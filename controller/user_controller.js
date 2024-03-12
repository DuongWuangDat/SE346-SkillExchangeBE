const User = require("../model/user.js")
const bcrypt = require("../pkg/auth/authorization.js")
const auth = require("../pkg/auth/authentication.js")
const helper = require("../pkg/helper/helper.js")
const register = async (req,res)=>{
    
    const isValidEmail = await helper.isValidEmail(req.body.email)
    const isValidPhoneNumber = await helper.isValidPhoneNumber(req.body.phoneNumber)
    if(!isValidEmail) return res.status(400).json({
        message: "Invalid email"
    })
    if(!isValidPhoneNumber) return res.status(400).json({
        message: "Invalid phone number"
    })
    const existUser = await User.find({
        email: req.body.email
    })
    if(existUser) return res.status(400).json({
        message: "Existed email"
    })
    const newUser = new User(req.body)
    newUser.password = bcrypt.hashPassword(newUser.password)
    newUser.save().catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    const accessToken = await auth.generateToken(newUser._id, "1d")
    const refreshToken = await auth.generateToken(newUser._id, "30d")
    return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        data: newUser.populate([{path: "userTopicSkill"},{path: "learnTopicSkill"}])
    })

}

const login = async (req,res)=>{
    const existUser = await User.find({
        email: req.body.email
    })
    if(!existUser) return res.status(404).json({
        message: "User is not found"
    })
    const isValidPassword = await bcrypt.comparePassword(req.body.password, existUser.password)
    if(!isValidPassword) return res.status(401).json({
        message: "Unauthorized"
    })

    const accessToken = auth.generateToken(existUser._id,"1d")
    const refreshToken = auth.generateToken(existUser._id, "30d")

    return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        data: existUser.populate([{path: "userTopicSkill"},{path: "learnTopicSkill"}])
    })
}

const getUserByTopic= async (req,res)=>{
    const topics = req.query.topic 
    const topicList = topics.split(',')
    const user = await User.find({
        userTopicSkill: {$in: topicList}
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
    const existUser = await User.find({
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
    const existUser = await User.find({
        email: req.body.email
    }).select('-password')
    if(!existUser) return res.status(404).json({
        message: "User is not found"
    })
    return res.json({
        data: existUser
    })
}

module.exports = {register,login,getUserByEmail,getUserByTopic,changePassword,deleteUser,updateUser}