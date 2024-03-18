const Topic = require("../model/topic.js")
const User = require("../model/user.js")
const helper = require("../pkg/helper/helper.js")
const addNewTopic = async (req,res)=>{
    const existTopic = await Topic.findOne({
        name: req.body.name
    })
    if(existTopic) return res.status(400).json({
        message: "Existed topic"
    })
    const topic = new Topic(req.body)
    topic.save().catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    return res.json({
        message: "Created successfully",
        data: topic
    })
}

const getAllTopic = async (req,res)=>{
    const topic = await Topic.find()
    return res.json({
        data: topic
    })
}

const getTopicById = async (req,res) =>{
    const id = req.params.id
    const isValidId = helper.isValidObjectID(id)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    const topic = await Topic.findById(id).catch(err=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    return res.json({
        data: topic
    })
}

const deleteTopic = async (req,res) =>{
    const id = req.params.id
    const isValidId = helper.isValidObjectID(id)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    const user = await User.find({
        $or: [
            {userTopicSkill: {$in: [id]}},
            {learnTopicSkill: {$in: [id]}}
        ]
    })
    console.log(user)
    user.forEach(async (element)=>{
        const userTopicSkillIndex = element.userTopicSkill.indexOf(id)
        const learnTopicSkillIndex = element.learnTopicSkill.indexOf(id)
        const userTopicSkill = element.userTopicSkill
        const learnTopicSkill = element.learnTopicSkill
        if(userTopicSkillIndex!= -1) {
            userTopicSkill.splice(userTopicSkillIndex,1)
        }
        if(learnTopicSkillIndex!= -1) {
            learnTopicSkill.splice(learnTopicSkillIndex,1)
        }
        await User.findByIdAndUpdate(element._id,{
            userTopicSkill: userTopicSkill,
            learnTopicSkill: learnTopicSkill
        })
    })
    await Topic.findByIdAndDelete(id).catch(err=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    
    
    
    return res.json({
        message: "Deleted successfully"
    })
}

const updateTopic = async (req,res) =>{
    const id = req.params.id
    const isValidId = helper.isValidObjectID(id)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    await Topic.findByIdAndUpdate(id,req.body).catch(err=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    return res.json({
        message: "Updated successfully"
    })
}

const getTopicLimit = async (req,res)=>{
    const limit = parseInt(req.params.limit);
    const topics = await Topic.find().limit(limit)
    return res.json({
        data: topics
    })
}
const getTopicPagination = async (req,res)=>{
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    
    const topics = await Topic.aggregate([
        {$skip: (page-1)*limit},
        {$limit: limit}
    ])
    return res.json({
        data: topics
    })
}
module.exports = {updateTopic,deleteTopic,getAllTopic,getTopicById,addNewTopic, getTopicLimit,getTopicPagination}