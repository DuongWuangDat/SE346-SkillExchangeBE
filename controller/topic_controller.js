const Topic = require("../model/topic.js")
const User = require("../model/user.js")
const helper = require("../pkg/helper/helper.js")
const addNewTopic = async (req,res)=>{
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
    const topic = Topic.find()
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
    
    await Topic.findByIdAndDelete(id).catch(err=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    const user = await User.find({
        $or: [
            {userTopicSkill: {$in: id}},
            {learnTopicSkill: {$in: id}}
        ]
    })

    if(user){
        const userChange = new User(user)
        const userTopicSkillIndex = userChange.userTopicSkill.indexOf(id)
        const learnTopicSkillIndex = userChange.learnTopicSkill.indexOf(id)
        if(userTopicSkillIndex!= -1) {
            userChange.userTopicSkill.splice(userTopicSkillIndex,1)
        }
        if(learnTopicSkillIndex!= -1) {
            userChange.userTopicSkill.splice(learnTopicSkillIndex,1)
        }
        await User.findByIdAndUpdate(user._id, userChange)
    }
    
    
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

module.exports = {updateTopic,deleteTopic,getAllTopic,getTopicById}