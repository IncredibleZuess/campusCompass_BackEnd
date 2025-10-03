import Location from "../models/location.ts";
import express from "express";

const addLocation = async (req: express.Request, res: express.Response) => {
    console.log(res.statusCode)
    if (res.statusCode == 400) {
        return res.status(400).json({ error: req.session });
    }
    Location.create(req.body).then((location) => {
        res.status(201).json(location);
    }).catch((error) => {
        console.error("Error creating location:", error);
        res.status(500).json({ error: "Internal server error" });
    });

}

const getAllLocations =async  (req: express.Request, res: express.Response) => {
    await Location.find().populate("buildings").then((locations) => {
        console.log(locations)
        res.json(locations);
    }).catch((error) => {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: "Internal server error" });
    });
}

const getLocationById = (req: express.Request, res: express.Response) => {
    const locationId = req.params.id;
    Location.findById(locationId).then((location) => {
        if (!location) {
            return res.status(404).json({ error: "Location not found" });
        }
        res.json(location);
    }).catch((error) => {
        console.error("Error fetching location:", error);
        res.status(500).json({ error: "Internal server error" });
    });
}

const updateLocation = (req: express.Request, res: express.Response)=>{
    const locationId = req.params.id;
    Location.findByIdAndUpdate(locationId, req.body).then((location) => {
        if(!location){
            return res.status(404).json({ error: "Location not found" });
        }
        res.json(location);
    }).catch((error) => {
        console.error("Error updating location:", error);
        res.status(500).json({ error: "Internal server error" });
    });
}

const deleteLocation = (req: express.Request, res: express.Response)=>{
    const locationId = req.params.id;
    Location.findByIdAndDelete(locationId).then((location)=>{
        if (!location) {
            return res.status(404).json({ error: "Location not found" });
        }
        res.status(204).json({ message: "Location deleted successfully" })

    }).catch((error)=>{
        console.error("Error deleting location:", error);
        res.status(500).json({ error: "Internal server error" });
    });
}

export default {
    addLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation
};