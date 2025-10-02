import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    offices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Office" }],
}, { timestamps: true })

const Building = mongoose.model("Building", buildingSchema);

export default Building;
