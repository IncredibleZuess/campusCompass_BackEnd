import mongoose from "mongoose";
import express from 'express'
import Image from "../models/image.ts";
import path from "path";
import fs from "fs";

const uploadImage = async (req: express.Request, res: express.Response) => {
    try{
        console.log(req.file)
        let obj = {
            name: req.body.name,
            desc:req.body.desc,
            img: {
                data: fs.readFileSync(path.join(process.cwd()+ '/uploads/' + req.file?.filename)),
                contentType: 'image/*'
            }
        }
        Image.create(obj)
    } catch (error) {
        console.error("Error adding image to Building", error)
        res.status(500).json({error: "Internal server error"})
    }    
}

const deleteImage = async (req: express.Request, res: express.Response) => {
    try {
        const imageID = req.params.id
        Image.findByIdAndDelete(imageID);
        res.json({success: "Image deleted successfully"})
    } catch (error) {
        res.status(500).json({error: "Internal Server error"})
    }
}