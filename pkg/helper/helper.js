const validator = require('validator')
const mongoose = require("mongoose")

const isValidEmail =async  (email)=>{
    return await validator.isEmail(email)
}

const isValidPhoneNumber = async (phoneNumber) =>{
    return await validator.isValidPhoneNumber(phoneNumber)
}

const isValidObjectID = async (id) =>{
    return await mongoose.isValidObjectId(id)
}

module.exports = {isValidEmail, isValidPhoneNumber, isValidObjectID}