const User = require("../model/user.js")
const Request = require("../model/request.js")
const helper = require("../pkg/helper/helper.js")
const createNewRequest = async (req,res)=>{
    const {senderID, receiverID} = req.body
    const user1 = await User.findById(senderID)
    const user2 = await User.findById(receiverID)
    if(!user1 || !user2) return res.status(400).json({
        message: "User not found"
    })
    const existRequest = await Request.findOne({
        senderID : senderID,
        receiverID: receiverID
    })
    if(existRequest) return res.status(400).json({
        message: "Existed request"
    })
    console.log("Pass")
    const request = new Request({
        senderID: senderID,
        receiverID: receiverID
    })
    let isSuccess = true;
    await request.save().catch((err)=>{
        isSuccess=false;
        
    })
    if(!isSuccess)  return res.status(400).json({
        message: "Something went wrong"
    })
    return res.status(200).json({
        message: "Created new request successfully",
        data: request
    })
}

const getRequestBySenderId = async (req,res) =>{
    console.log("Sender id")
    const senderID= req.params.senderID
    const isValidId = await helper.isValidObjectID(senderID)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    const request = await Request.find({
        senderID: senderID
    }).populate('receiverID', 'username avatar').catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })

    return res.json({
        data: request
    })
}

const getRequestByRecieverId = async (req,res) =>{
    console.log("Recieve id")
    const receiverID= req.params.receiverID
    const isValidId = await helper.isValidObjectID(receiverID)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    const request = await Request.find({
        receiverID: receiverID
    }).populate('senderID', 'username avatar').catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })

    return res.json({
        data: request
    })
}

const deleteRequest = async(req,res)=>{
    const id = req.params.id
    const isValidId = await helper.isValidObjectID(id)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    await Request.findByIdAndDelete(id).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })

    return res.json({
        message: "Deleted request successfully"
    })
}

module.exports = {deleteRequest,createNewRequest,getRequestBySenderId, getRequestByRecieverId}