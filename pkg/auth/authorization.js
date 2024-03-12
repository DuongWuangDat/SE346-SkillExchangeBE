const bcrypt = require("bcrypt")

const hashPassword = async (password) =>{
    const salt = bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}

const comparePassword = async (password, hashPassword)=>{
    return await bcrypt.compareSync(password,hashPassword)
}

module.exports={hashPassword,comparePassword}