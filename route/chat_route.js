const express = require('express')
const chatController = require('../controller/chat_controller.js')
const route = express.Router()
route.get('/find/all',chatController.getAllChatRoom)
route.get('/find/:uid',chatController.getChatByUId)
route.get('/find/both',chatController.getChatBy2UID)
route.post('/create', chatController.createNewChat)
module.exports = route