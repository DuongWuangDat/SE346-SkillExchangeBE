const mongoose = require("mongoose")
const Schema = mongoose.Schema
const requestSchema = new Schema({
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }]
})

const requestModel = mongoose.model("Request", requestSchema)
module.exports= requestModel