import express from "express"
import buildingController from "../controllers/buildingController.ts"
import passport from "passport";
import { upload } from "../db.ts";
const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Buildings
 *  description: API endpoints for managing buildings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Building:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         lat:
 *           type: number
 *           format: float
 *         long:
 *           type: number
 *           format: float
 *         offices:
 *           type: integer
 *           format: int32
 */

/**
 * @swagger
 * /buildings/:
 *  get:
 *    summary: Retrieve a list of all buildings
 *    tags: [Buildings]
 *    responses:
 *      200:
 *        description: A list of building
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Building'
 * */
router.get("/", buildingController.getAllBuildings);
router.get("/:id", buildingController.getBuildingById);
router.post("/", buildingController.createBuilding);
router.post("/:bid/location/:lid", passport.authenticate("jwt", {session: false}), buildingController.addBuildingToLocation)
router.post("/:id/image", upload.single('image'), buildingController.uploadBuildingImage)
router.post('/upload', upload.single('file'), buildingController.uploadImage)
router.put("/:id", passport.authenticate("jwt", { session: false }), buildingController.updateBuilding);
router.delete("/:id", passport.authenticate("jwt", { session: false }), buildingController.deleteBuilding);

export default router;
