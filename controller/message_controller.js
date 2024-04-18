const Message = require('../model/message.js')
const User = require("../model/user.js")
const Chat = require("../model/chat.js")
// post message
const sendMessage = async(req,res)=>{
    try{
        const user = await User.findById(req.body.senderID)
        if(!user) return res.status(400).json({
            message: "User not found"
        })
        const chat = await Chat.findById(req.body.chatID)
        if(!chat) return res.status(400).json({
            message: "Chat not found"
        })
        const message = new Message(req.body)
        await message.save().then(result=>{
            return res.json({
                message: "Send message successfully",
                data: message
            })
        }).catch((err)=>{
            return res.status(400).json({
                message: "Something went wrong",
            })
        })
    }
    catch(err){
        console.log(err)
    }
}
// message in chat room ID
const getMessageByChatID = async(req,res)=>{
    try{
        const chatID = req.params.chatID
        const message = await Message.find({chatID: chatID}).populate("senderID", "username avatar")
        res.json({
            data: message
        })
    }
    catch(err){
        console.log(err)
    }
}
//message in chat room ID by senderID
const getMessageByBoth =async(req,res)=>{
    try{
        const chatID = req.query.chatID
        const senderID = req.query.senderID
        const message = await Message.find({chatID: chatID, senderID:senderID}).populate("senderID", "username avatar")
        res.json({
            data: message
        })
    }
    catch(err){
        console.log(err)
    }
}
module.exports = {sendMessage,getMessageByBoth,getMessageByChatID}