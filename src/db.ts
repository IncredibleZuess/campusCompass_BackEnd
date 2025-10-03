import mongoose, { Model, Schema } from "mongoose";
import multer from "multer"
let bucket;

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads')
    },
    filename: (req,file,cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({storage: storage})

const initDB = async() => {
    await mongoose.connect(process.env.MONGO_URL || "", {dbName: "MapManage"}).then(() => {
        console.log("Database connected!");
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'PhotosBucket',
        })
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });
}


export {upload, initDB};