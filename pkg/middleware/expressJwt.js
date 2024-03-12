const expressJwt = require("express-jwt")
require("dotenv").config
const secret = process.env.SECRET_KEY
const api = process.env.API_URL
const authJWT = ()=>{
    
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked

    }).unless({
        path: [

        ]
    })
}

function isRevoked (req,payload, done){
    done()
}

module.exports = authJWT