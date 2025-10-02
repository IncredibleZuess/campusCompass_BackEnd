import express from "express"
import adminController from "../controllers/adminController.ts"


const router = express.Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin user creation
 * /register:
 *   post:
 *     tags: [Admin]
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Invalid request
 */
router.post("/register", adminController.register)
/**
 * @swagger
 * /admin/login:
 *   post:
 *     tags: [Admin]
 *     summary: Login as an admin
 *     requestBody:
 *       required: true
 *       parameters:
 *       - in: body
 *         name: credentials
 *         description: Admin credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Invalid request
 * */

router.post("/login", adminController.login)

/**
 * @swagger
 * /admin/refresh-token:
 *   post:
 *     tags: [Admin]
 *     summary: Refresh JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid token
 *       400:
 *         description: Invalid request
 * */

router.post("/refresh-token", adminController.refreshToken)

export default router;