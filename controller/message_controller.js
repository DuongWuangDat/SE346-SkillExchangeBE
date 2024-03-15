const Message = require('../model/message.js')
// post message
const sendMessage = async(req,res)=>{
    try{
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
        const message = await Message.find({chatID: chatID})
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
        const chatID = req.params.chatID
        const senderID = req.params.senderID
        const message = await Message.find({chatID: chatID, senderID:senderID})
        res.json({
            data: message
        })
    }
    catch(err){
        console.log(err)
    }
}
module.exports = {sendMessage,getMessageByBoth,getMessageByChatID}