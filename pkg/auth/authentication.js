const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret = process.env.SECRET_KEY
const generateToken = async (payload, expired) =>{
    const token = await jwt.sign(
        payload,
        secret,
        {
            algorithm: "HS256",
            expiresIn: expired
        }
    )
}

module.exports={generateToken}