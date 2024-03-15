const chatModel = require('../model/chat.js')
//get all chatroom
const getAllChatRoom = async (req,res)=>{
    const chat = await chatModel.find().catch((err)=>{console.log(err)})
    res.json({
        data: chat
    })
}
//get chat by uid
const getChatByUId = async (req,res)=>{
    const firstID = req.params.uid
    const chat = await chatModel.find({
        members: {$in: [firstID]}
    })
    res.json({
        data: chat
    })
}
//get chat by 2 uid
const getChatBy2UID = async (req,res)=>{
    const {firstID,secondID} = req.body
    try{
        const chat = await chatModel.find({
            members: {$all: [firstID,secondID]}
        })
        res.json({
            data: chat
        })
    }
    catch(err){
        console.log(err)
    }
}
//create new chat
const createNewChat = async (req,res)=>{
    const {firstID, secondID} = req.body
    try{
        const existChat = await chatModel.find({
            members: {$all: [firstID,secondID]}
        })
        if(existChat) return res.status(200).json({
            data: existChat
        })
        const chat = new chatModel({
            members: [firstID, secondID]
        })
        await chat.save().then(result=> res.json({
            message: "Create new chat successfully",
            data: result
        }))
    }
    catch(err){
        console.log(err)
    }
    
}
module.exports= {getAllChatRoom,getChatBy2UID,getChatByUId,createNewChat}