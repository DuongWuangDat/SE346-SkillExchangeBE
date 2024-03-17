const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const authJwt = require("./pkg/middleware/expressJwt.js")
const userRoute = require("./route/user_route.js")
const topicRoute = require("./route/topic_route.js")
const tokenRoute = require("./route/token_route.js")
const chatRoute = require('./route/chat_route.js')
const messageRoute = require('./route/message_route.js')
const requestRoute = require("./route/request_route.js")
const uploadRoute = require("./route/upload_route.js")
const http = require("http").createServer(app)

require("dotenv").config()

const port = process.env.PORT
const url = process.env.ATLAS_URI
const api = process.env.API_URL

///Prepare mongoDB and run server///
mongoose.connect(url).then(
    res =>{
        console.log("Connect mongoDB successfully");
        http.listen(port, ()=>{
                console.log("Listen and run at port: " + port)
        })
    }
).catch(
    err=>{
        console.log(err)
    }
)
///Prepare mongoDB and run server///

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(authJwt())
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.get("/ping", (req,res)=>{
    return res.status(200).json({
        message: "pong"
    })
})

app.use(`${api}/user`, userRoute)
app.use(`${api}/topic`, topicRoute)
app.use(`${api}/token`, tokenRoute)
app.use(`${api}/chat`,chatRoute)
app.use(`${api}/message`, messageRoute)
app.use(`${api}/request`,requestRoute)
app.use(`${api}/image`, uploadRoute)
///--------------------Socket------------------///
const {Server} = require("socket.io")
const io = new Server(http, {
    cors: {
        origin: "*"
    }
})
const chatGroups = []
io.on("connection", (socket)=>{
    console.log(`${socket.id} connected`)
    
    socket.on("createNewGroup", (data)=>{
        
        const chatModel = {
            groupName: groupName,
            id: chatGroups.length+1,
            message: []
        }
        chatGroups.unshift(chatModel)
        socket.emit("groupList", chatGroups)
    })

    socket.on("getAllChatGroups", ()=>{
        socket.emit("groupList", chatGroups)
    })

    socket.on("findGroup", (id)=>{
        const filterGroups = chatGroups.filter((item)=> item.id == id)
        socket.emit("foundGroup", filterGroups[0].message)
    })

    socket.on("addNewMessage", (data)=>{
        const {groupId, currentChatMessage, userId, timeData} = data
        const filterGroups = chatGroups.filter((item)=> item.id == groupId)
        const newMessage = {
            id: createUniqueId(),
            groupId: groupId,
            currentChatMessage: currentChatMessage,
            userId: userId,
            timeData: `${timeData.hr}:${timeData.mins}`
        }
        filterGroups[0].message.push(newMessage)
        socket.to(filterGroups[0].groupName).emit("groupMessage", newMessage)
        socket.emit("foundGroup", filterGroups[0].message)
        socket.emit("groupList", chatGroups)
        
        
    })
})

function createUniqueId() {
    return Math.random().toString(20).substring(2, 10);
  }


