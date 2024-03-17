const Token = require("../model/token.js")
const auth = require("../pkg/auth/authentication.js")
const User = require("../model/user.js")
const addNewToken = async (token, userID)=>{
    await Token.updateMany({
        user: userID
    }, {isRevoked: true})
    const tokenModel= new Token({
        token: token,
        user: userID,
        isRevoked: false
    })
    await tokenModel.save().catch(
        err=>{
            return err
        }
    )
    return null
}

const checkTokenIsRevoked = async (token) =>{
    const tokenModel = await Token.findOne(
        {
            token: token,
            isRevoked: false
        }
    )
    if(!tokenModel) return true
    return false
}

const revokedToken = async (userId) =>{
    await Token.updateMany({
        user: userId
    }, {
        isRevoked: true
    })
}

const getAccessToken = async (refreshToken) =>{
    const jwt = await auth.verifyToken(refreshToken)
    const id= jwt.userId
    const user = await User.findById(id)
    const token =  await auth.generateToken(user, "1d")
    addNewToken(token)
    return token
}

const deleteTokenByUserID = async (uid) =>{
    return await Token.deleteMany({
        user: uid
    })
}

module.exports = {addNewToken, checkTokenIsRevoked,revokedToken, getAccessToken,deleteTokenByUserID}