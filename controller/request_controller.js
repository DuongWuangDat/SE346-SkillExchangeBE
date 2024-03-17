const Request = require("../model/request.js")
const helper = require("../pkg/helper/helper.js")
const createNewRequest = async (req,res)=>{
    const {senderID, receiverID} = req.body
    const existRequest = await Request.findOne({
        member: {$all: [senderID, receiverID]}
    })
    if(existRequest) return res.status(400).json({
        message: "Existed request"
    })
    const request = new Request({
        member: [senderID,receiverID]
    })
    await request.save().catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })

    return res.status(200).json({
        message: "Created new request successfully",
        data: request
    })
}

const getRequestBySenderId = async (req,res) =>{
    const senderID= req.params.senderID
    const isValidId = await helper.isValidObjectID(senderID)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    const request = await Request.find({
        member: {$in: [senderID]}
    }).catch((err)=>{
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

module.exports = {deleteRequest,createNewRequest,getRequestBySenderId}