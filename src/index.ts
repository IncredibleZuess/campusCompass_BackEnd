import type e = require("express")
import morgan from "morgan"
import dotenv from "dotenv"
import express from "express"
import session from "express-session"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import config from "./utils/config.ts"
import {initDB} from "./db.ts"
import locationsRoute from "./routes/locationRoute.ts"
import adminRoute from "./routes/adminRoute.ts"
import passport from "./middleware/passport.ts"
import app from "./server.ts"

dotenv.config()
initDB()


const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})

export default server;
