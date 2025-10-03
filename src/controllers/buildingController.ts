import express from "express"
import Building from "../models/building.ts"
import Location from "../models/location.ts";
import Image from "../models/image.ts";
import fs from "fs"
import path from "path";


const createBuilding = async (req: express.Request, res: express.Response) => { 
    try{
        const building = await Building.create(req.body);
        console.log(req.body)
        if(req.body.image){
            let obj = {
            name: req.body.name,
            desc: '',
            img: {
                data: fs.readFileSync(path.join(process.cwd()+ '/uploads/' + req.file?.filename)),
                contentType: 'image/*'
            }
            
        }
        const image = await Image.create(obj)
        building.image = image
        }
        
        
        res.status(201).json(building);
    } catch (error) {
        console.error("Error creating building:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const addBuildingToLocation = async (req: express.Request, res: express.Response) => {
    try{
        const building = await Building.findById(req.params.bid);
        const location = await Location.findById(req.params.lid);
        console.log("Building " + building + " Location " + location )
        if(!building){
            res.status(404).json({error: "Building not found"})
        } else if(!location){
            res.status(404).json({error: "Cannot find location"})
        }
        location.buildings = building
        res.status(200).json(location)
        await location.save();
    } catch (error){
        console.error("Error linking buildings:", error)
        res.status(500).json({error: "Internal server error"})
    }
}

const getAllBuildings = async (req: express.Request, res: express.Response) => {
    try {
        await Building.find().populate('offices').populate('image').then((buildings)=>{
            res.json(buildings)
        });
    } catch (error) {
        console.error("Error fetching buildings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getBuildingById = async (req: express.Request, res: express.Response) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: "Building not found" });
        }
        res.status(200).json(building);
    } catch (error) {
        console.error("Error fetching building:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateBuilding = async (req: express.Request, res: express.Response) => {
    try {
        const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!building) {
            return res.status(404).json({ error: "Building not found" });
        }
        res.status(200).json(building);
    } catch (error) {
        console.error("Error updating building:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const uploadBuildingImage = async (req: express.Request, res: express.Response) => {
    try{
        const building = await Building.findById(req.params.id)
        const image = await Image.create(req.body)
        if (!building){
            return res.status(404).json({error: "Building not found"})
        }
        building.image = image
        res.status(200).json(building)
        await building.save()
    } catch (error) {
        console.error("Error adding image to Building", error)
        res.status(500).json({error: "Internal server error"})
    }    
}

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

const deleteBuilding = async (req: express.Request, res: express.Response) => {
    try {
        const building = await Building.findByIdAndDelete(req.params.id);
        if (!building) {
            return res.status(404).json({ error: "Building not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting building:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export default {
    createBuilding,
    addBuildingToLocation,
    uploadBuildingImage,
    uploadImage,
    getAllBuildings,
    getBuildingById,
    updateBuilding,
    deleteBuilding
}