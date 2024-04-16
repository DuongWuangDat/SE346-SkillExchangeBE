const User = require("../model/user.js")
const Topic = require("../model/topic.js")
const tokenController = require("../controller/token_controller.js")
const moment = require("moment")
const bcrypt = require("../pkg/auth/authorization.js")
const auth = require("../pkg/auth/authentication.js")
const helper = require("../pkg/helper/helper.js")
const Message = require("../model/message.js")

const register = async (req,res)=>{
    const isValidEmail = await helper.isValidEmail(req.body.email)
    const isValidPhoneNumber = await helper.isValidPhoneNumber(req.body.phoneNumber)
    if(!isValidEmail) return res.status(400).json({
        message: "Invalid email"
    })
    if(!isValidPhoneNumber) return res.status(400).json({
        message: "Invalid phone number"
    })
    var email = req.body.email.toLowerCase()
    const existUser = await User.findOne({
        email: email
    })
    if(existUser) return res.status(400).json({
        message: "Existed email"
    })
    const newUser = new User(req.body)
    newUser.email = email
    newUser.password =await  bcrypt.hashPassword(newUser.password)
    const dateString = req.body.birthDay
    const dateSplit = dateString.split("/")
    var day = parseInt(dateSplit[0], 10);
    var month = parseInt(dateSplit[1], 10) - 1; // Month is zero-based
    var year = parseInt(dateSplit[2], 10);
    newUser.birthDay = new Date(Date.UTC(year, month, day))
    var flag =false
    await Promise.all(newUser.learnTopicSkill.map(async (topicId)=>{
        const topic = await Topic.findById(topicId)
        if(!topic){
            flag = true
            return
        }
    }))
    await Promise.all(newUser.userTopicSkill.map(async (topicId)=>{
        const topic = await Topic.findById(topicId)
        if(!topic){
            flag = true
            return
        }
    }))
    if(flag) return res.status(400).json({
        message: "Topic not exist"
    })
    let isSuccess = true;
    await newUser.save().catch((err)=>{
        isSuccess = false;
        
    })
    if(!isSuccess) return res.status(400).json({
        message: "Something went wrong"
    })
    const accessToken = await auth.generateToken(newUser, "1h",'access')
    const refreshToken = await auth.generateToken(newUser, "30d", 'refresh')
    tokenController.addNewToken(refreshToken, newUser._id)
    return res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        data: newUser
    })

}

const login = async (req,res)=>{
    var email = req.body.email.toLowerCase()
    const existUser = await User.findOne({
        email: email
    })
    if(!existUser) return res.status(404).json({
        message: "User is not found"
    })
    const isValidPassword = await bcrypt.comparePassword(req.body.password, existUser.password)
    if(!isValidPassword) return res.status(401).json({
        message: "Unauthorized"
    })
    const user = await User.findOne({
        email: email
    }).select('-password')
    const accessToken = await auth.generateToken(existUser,"1h", 'access')
    const refreshToken = await auth.generateToken(existUser, "30d", 'refresh')
    tokenController.addNewToken(refreshToken, user._id)
    return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        data: user
    })
}

const getUserByTopic= async (req,res)=>{
    const topics = req.query.topics
    const topicList = topics.split(',')
    const topicIdList = await Promise.all(topicList.map(async (topicname)=>{
        const topic = await Topic.findOne({
            name: topicname
        })
        console.log(topic);
        if(topic != null){
            return topic._id;
        }
        
    }))
    const user = await User.find({
        userTopicSkill: {$in: topicIdList}
    }).select('-password')
    if(!user) return res.status(404).json({
        message: "User is not found"
    })
    return res.json({
        data: user
    })
    
}

const deleteUser = async (req,res)=>{
    const id = req.params.id
    const isValidId = await helper.isValidObjectID(id)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    await tokenController.deleteTokenByUserID(id)
    await Message.deleteMany(
        {
            senderID: id
        }
    ).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    await User.findByIdAndDelete(id).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    return res.json({
        message: "Deleted successfully"
    })

}

/// Only change info not password
const updateUser = async (req,res)=>{
    const id= req.params.id
    const isValidId = await helper.isValidObjectID(id)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    if(req.body.password != null) return res.status(400).json({
        message: "Use changePassword route to change password"
    })
    if(req.body.birthDay != null){
        const dateString = req.body.birthDay
        const dateSplit = dateString.split("/")
        var day = parseInt(dateSplit[0], 10);
        var month = parseInt(dateSplit[1], 10) - 1; // Month is zero-based
        var year = parseInt(dateSplit[2], 10);
        req.body.birthDay = new Date(Date.UTC(year,month,day))
    }
    await User.findByIdAndUpdate(id,req.body).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    return res.json({
        message: "Updated successfully"
    })
}

///Change password
const changePassword = async (req,res) =>{
    const isValidEmail = await helper.isValidEmail(req.body.email)
    if(!isValidEmail) return res.status(400).json({
        message: "Invalid email"
    })
    const existUser = await User.findOne({
        email: req.body.email
    })
    if(!existUser) return res.status(404).json({
        message: "User is not found"
    })
    const password = req.body.password
    const hashPassword = await bcrypt.hashPassword(password)
    await User.findOneAndUpdate({
        email: req.body.email
    }, {password: hashPassword}).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    return res.json({
        message: "Updated password successfully"
    })
}

///Find user by email
const getUserByEmail = async (req,res) =>{
    const isValidEmail = await helper.isValidEmail(req.body.email)
    if(!isValidEmail) return res.status(400).json({
        message: "Invalid email"
    })
    const existUser = await User.findOne({
        email: req.body.email
    }).select('-password')
    if(!existUser) return res.status(404).json({
        message: "User is not found"
    })
    return res.json({
        data: existUser
    })
}

const getAllUser = async (req,res)=>{
    const userList = await User.find().select('-password').catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    return res.json({
        data: userList
    })
}

const getUserById = async(req,res)=>{
    const id = req.params.id
    const isValidId = await helper.isValidObjectID(id)
    if(!isValidId) return res.status(400).json({
        message: "Invalid id"
    })
    const existUser = await User.findById(id).select('-password')
    if(!existUser) return res.status(404).json({
        message: "User is not found"
    })
    return res.json({
        data: existUser
    })
}

//Log out

const logOut = async (req,res)=>{
    const header = req.headers.authorization
    const split = header.split(" ")
    const refreshToken = split[1]
    try{
        const tokenFind = await tokenController.revokedToken(refreshToken)
        if(!tokenFind) {
            return res.status(400).json({
                message: "Invalid refresh token"
            })
        }
    }
    catch{
        return res.status(400).json({
            message: "Something went wrong"
        })
    }
    return res.json({
        message: "Log out successfully"
    })
}
module.exports = {register,login,getUserByEmail,getUserByTopic,changePassword,deleteUser,updateUser,getAllUser, logOut, getUserById}