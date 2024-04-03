//import { initializeApp } from "firebase/app";
//import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
const {initializeApp} = require("firebase/app")
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage")

const express = require("express")
const route = express.Router()
const config = require("../pkg/config/firebaseConfig")

const multer = require("multer")

initializeApp({
    apiKey: "AIzaSyDBY3h-59d1LB8U_W54QveIEANAs3o3ZUU",
    authDomain: "skillexchange-62da0.firebaseapp.com",
    projectId: "skillexchange-62da0",
    storageBucket: "skillexchange-62da0.appspot.com",
    messagingSenderId: "620499387371",
    appId: "1:620499387371:web:1d9a5bb2834406ee53cfae",
    measurementId: "G-NP63D4FV2Y"
})

const storage = getStorage();



const uploadOptions = multer({storage: multer.memoryStorage()})

route.post("/upload", uploadOptions.single("image"),async (req,res)=>{
    
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')
    const curDate = new Date();
    const curMili = curDate.getMilliseconds();

    const storageRef = ref(storage, `files/${req.file.originalname}-${curMili}`)

    const metaData= {
        contentType: req.file.mimetype
    }

    const snapShot = await uploadBytesResumable(storageRef,req.file.buffer,metaData)

    const downloadURL = await getDownloadURL(snapShot.ref)
    return res.json({
        image: downloadURL
    })
})

module.exports = route