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
    password:{
        type: String,
        require: true
    },
    avatar:{
        type: String
    },
    imgaeDisplay: [{
        type: String,
        required: true
    }],
    imageCerti: {
        type: String
    },
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
        require: true
    }],
    birthDay: {
        type: Date,
        default: Date.now(),
    },
    rankElo:{
        type: Number,
        default: 0
    }
    
},{timestamps: true})

userSchema.virtual("id").get(function(){
    return this._id.toHexString
})

userSchema.set('toJSON',{
    "virtuals": true
})
const userModel = mongoose.model("User", userSchema)
module.exports = userModel