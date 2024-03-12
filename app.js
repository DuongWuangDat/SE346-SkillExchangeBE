const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()

const port = process.env.PORT
const url = process.env.ATLAS_URI


///Prepare mongoDB and run server///
mongoose.connect(url).then(
    res =>{
        console.log("Connect mongoDB successfully");
        app.listen(port, ()=>{
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

app.get("/ping", (req,res)=>{
    return res.status(200).json({
        message: "pong"
    })
})


