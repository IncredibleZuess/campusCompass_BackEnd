import mongoose, { Model, Schema } from "mongoose";
import Location from "./models/location.ts";

const initDB = async() => {
    await mongoose.connect(process.env.MONGO_URL || "", {dbName: "MapManage"}).then(() => {
        console.log("Database connected!");
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });
}


export default initDB;