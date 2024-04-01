const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema = new Schema({
    chatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dateTime:{
        type: Date,
        default: Date.now
    },
    text: String
},{
    timestamps: true
})
const messageModel = mongoose.model('Message',messageSchema)
module.exports = messageModel