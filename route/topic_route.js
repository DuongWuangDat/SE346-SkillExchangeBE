const topicController = require("../controller/topic_controller.js")
const express = require("express")
const route = express.Router()

route.post("/create", topicController.addNewTopic)
route.delete("/delete/:id",topicController.deleteTopic)
route.patch("/update/:id", topicController.updateTopic)
route.get("/find", topicController.getAllTopic)
route.get("/find/:id", topicController.getTopicById)
route.get("/find/:limit", topicController.getTopicLimit)
route.get("/find/pagination", topicController.getTopicPagination)

module.exports = route