import passport from "passport"
import Account from "../models/admin.ts"
import helper from "../utils/helper.ts"
import RefreshToken from "../models/refreshToken.ts"
import express from "express"
const register = async (req: express.Request, res: express.Response) => {
    try{
        const { username, password } = req.body
        const passwordHash = await helper.hashPassword(password)
        const admin = new Account({ username, password: passwordHash })
        await admin.save()
        res.status(201).send("Admin registered successfully.")
    } catch (err){
        res.status(500).json({error: "Error registering admin user"})
    }
    
}

const login = async (req: express.Request, res: express.Response) => {
    try{
        const {username, password} = req.body
        const admin = await Account.findOne({ username })
        if (!admin) {
            return res.status(401).send("Invalid username or password.")
        }
        const isMatch = await helper.comparePasswords(password, admin.password)
        if (!isMatch) {
            return res.status(401).send("Invalid username or password.")
        }
        const accessToken = helper.issueAccessToken({ id: admin._id })
        const refreshToken = await helper.createRefreshToken(admin._id)
        res.status(200).json({ accessToken, refreshToken })
    }catch (err){
        res.status(500).json({error: "Error with admin login"})
    }
        
    }

const refreshToken = async (req: express.Request, res: express.Response) => {
    const {refreshToken: refreshTokenUUID} = req.body
    const refreshToken = await RefreshToken.findOne({ token: refreshTokenUUID }).populate("admin")

    if (!refreshToken) {
        return res.status(401).send("Invalid refresh token.")
    }

    const isExpired = helper.verifyRefreshTokenExpiration(refreshToken)
    if (isExpired) {
        await RefreshToken.findByIdAndDelete(refreshToken._id).exec()
        return res.status(401).send("Refresh token is expired.")
    }

    await RefreshToken.findByIdAndDelete(refreshToken._id).exec()
    const newAccessToken = helper.issueAccessToken({ id: refreshToken.admin._id })
    const newRefreshToken = await helper.createRefreshToken(refreshToken.admin._id)
    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
}

export default {
    register,
    login,
    refreshToken
}
