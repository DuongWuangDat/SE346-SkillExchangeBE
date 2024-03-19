const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    phoneNumber:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    avatar:{
        type: String
    },
    imageCerti: [{
        type: String
    }],
    description:[{
        type: String
    }],
    userTopicSkill: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    learnTopicSkill: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    skill: [{
        type: String,
    }],
    birthDay: {
        type: Date
    },
    rankElo:{
        type: Number,
        default: 0
    }
    
})

userSchema.virtual("id").get(function(){
    return this._id.toHexString
})

userSchema.set('toJSON',{
    "virtuals": true
})
const userModel = mongoose.model("User", userSchema)
module.exports = userModel