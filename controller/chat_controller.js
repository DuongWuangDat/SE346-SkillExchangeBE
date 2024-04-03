const chatModel = require('../model/chat.js')
const Message = require("../model/message.js")
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
    }).populate('members', 'username avatar')
    
    const dataChatList = []
    await Promise.all(chat.map( async (room)=>{
        const latestMessage = await Message.find({
            chatID: room._id
        }).sort({
            dateTime: -1
        }).limit(1).populate('senderID', 'username').catch((err)=>{
            return res.status(400).json({
                message: "Something went wrong"
            })
        })
        const dataChat = {
            chatInfo: room,
            latestMessage: latestMessage
        }
        dataChatList.push(dataChat)
    }))
    res.json({
        data: dataChatList
    })
}
//get chat by 2 uid
const getChatBy2UID = async (req,res)=>{
    const {firstID,secondID} = req.body
    try{
        const chat = await chatModel.find({
            members: {$all: [firstID,secondID]}
        }).populate("members", 'username avatar')
        const dataChatList = []
        await Promise.all(chat.map( async (room)=>{
            const latestMessage = await Message.find({
                chatID: room._id
            }).sort({
                dateTime: -1
            }).limit(1).populate('senderID', 'username').catch((err)=>{
                return res.status(400).json({
                    message: "Something went wrong"
                })
            })
            const dataChat = {
                chatInfo: room,
                latestMessage: latestMessage
            }
            dataChatList.push(dataChat)
        }))
        res.json({
            data: dataChatList
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
        const existChat = await chatModel.findOne({
            members: {$all: [firstID,secondID]}
        })
        if(existChat) return res.status(400).json({
            message: "Something went wrong"
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

const deleteChatRoom =async (req, res)=>{
    const id= req.params.id;  
    await Message.deleteMany({
        chatID: id
    }).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    await chatModel.findByIdAndDelete(id).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })

    return res.json({
        message: "Deleted chat successfully"
    })
}

module.exports= {getAllChatRoom,getChatBy2UID,getChatByUId,createNewChat,deleteChatRoom}