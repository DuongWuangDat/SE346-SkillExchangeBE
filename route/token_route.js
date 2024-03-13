const tokenController = require("../controller/token_controller.js")
const express = require("express")
const route = express.Router()

route.get("/refresh-token", async (req,res)=>{
    const header = req.headers.authorization
    const split = header.split(" ")
    const token = split[1]
    const newToken = await tokenController.getAccessToken(token)
    return res.json({
        access_token: newToken
    })
})
module.exports= route