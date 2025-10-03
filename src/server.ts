import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import express from "express"
import session from "express-session"
import bodyParser from "body-parser"
import cors from "cors"
import cookieParser from "cookie-parser"
import locationsRoute from "./routes/locationRoute.ts"
import buildingRoute from "./routes/buildingRoute.ts"
import lecturerRoute from "./routes/lecturerRoute.ts"
import officeRoute from "./routes/officeRoute.ts"
import adminRoute from "./routes/adminRoute.ts"
import passport from "./middleware/passport.ts"

const app = express()

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CampusCompass API",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: `http://localhost:5000`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions)

app.use(morgan("dev"))
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false
}))
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "192.168.1.4:3000", "192.168.1.4:5173"],
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use("/locations", locationsRoute)
app.use("/admin", adminRoute)
app.use("/buildings", buildingRoute)
app.use("/lecturers", lecturerRoute)
app.use("/offices", officeRoute)
export default app;
