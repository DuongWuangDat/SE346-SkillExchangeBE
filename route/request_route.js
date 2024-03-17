const requestController = require("../controller/request_controller.js")
const express = require("express")
const route = express.Router()

route.get("/find/:senderID", requestController.getRequestBySenderId)
route.post("/create", requestController.createNewRequest)
route.delete("/delete/:id", requestController.deleteRequest)

module.exports = route
