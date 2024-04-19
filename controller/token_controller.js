const Token = require("../model/token.js")
const auth = require("../pkg/auth/authentication.js")
const User = require("../model/user.js")
const { isJwtExpired } = require('jwt-check-expiration');
const addNewToken = async (token, userID)=>{
    const tokenModel= new Token({
        token: token,
        user: userID
    })
    await tokenModel.save().catch(
        err=>{
            return err
        }
    )
    return null
}

const checkTokenIsRevoked = async (token) =>{
    const isExpired = await checkTokenIsExpired(token)
    if(isExpired) return true
    const jwt = await auth.verifyToken(token)
    const type = jwt.type
    if(type == 'access'){
        return false
    }
    const tokenModel = await Token.findOne(
        {
            token: token
        }
    )
    if(!tokenModel) return true
    return false
}

const revokedToken = async (token) =>{
    const tokenFind = await Token.findOneAndDelete({
        token: token
    })
    return tokenFind
}

const getAccessToken = async (refreshToken) =>{
    const jwt = await auth.verifyToken(refreshToken)
    const id= jwt.userId
    const user = await User.findById(id)
    const token =  await auth.generateToken(user, "1h", 'access')
    return token
}

const deleteTokenByUserID = async (uid) =>{
    return await Token.deleteMany({
        user: uid
    })
}


const deleteAllToken = async ()=>{
    return await Token.deleteMany({});
}

const checkTokenIsExpired = async (token)=>{
    return isJwtExpired(token)
}
module.exports = {addNewToken, checkTokenIsRevoked,revokedToken, getAccessToken,deleteTokenByUserID, deleteAllToken, checkTokenIsExpired}