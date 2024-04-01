const Service = require("../pkg/helper/emailService.js")
const Helper = require("../pkg/helper/helper.js")
const sendEmail =async (req,res)=>{
    try{
        const email =req.body.email
        const code = Helper.randomCode()
        await Service.sendEmailService(email,code)
        res.json({
            message: "Send email successfull",
            userCode: code
        })
    }catch(e){
        res.status(400).json({
            message: "Something went wrong"
        })
    }
    
}

const hashCode = async (req,res)=>{

}
module.exports= {sendEmail}