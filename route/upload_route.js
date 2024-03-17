const express = require("express")
const route = express.Router()

const multer = require("multer")

const FILE_TYPE_NAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req,file, cb){
        const isValid = FILE_TYPE_NAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid){
            uploadError = null;
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_NAP[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({storage: storage})

route.post("/upload", uploadOptions.single("image"), (req,res)=>{
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')
    const filename = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;
    return res.json({
        image: `${basePath}/${filename}`
    })
})

module.exports = route