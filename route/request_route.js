const requestController = require("../controller/request_controller.js")
const express = require("express")
const route = express.Router()

route.get("/find/sender/:senderID", requestController.getRequestBySenderId)
route.get("/find/reciever/:recieverID", requestController.getRequestByRecieverId)
route.post("/create", requestController.createNewRequest)
route.delete("/delete/:id", requestController.deleteRequest)

module.exports = route
