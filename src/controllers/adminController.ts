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
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 Mins
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/api/admin/refresh-token'
        })
        res.status(200).json({ accessToken, refreshToken })
    }catch (err){
        res.status(500).json({error: "Error with admin login"})
    }
        
    }

const refreshToken = async (req: express.Request, res: express.Response) => {
    const refreshTokenUUID = req.cookies['refreshToken']
    console.log(refreshTokenUUID)
    const refreshToken = await RefreshToken.findOne({ token: refreshTokenUUID }).populate("user")
    console.log(refreshToken)

    if (!refreshToken) {
        return res.status(401).send("Invalid refresh token.")
    }

    const isExpired = helper.verifyRefreshTokenExpiration(refreshToken)
    if (isExpired) {
        await RefreshToken.findByIdAndDelete(refreshToken._id).exec()
        return res.status(401).send("Refresh token is expired.")
    }

    await RefreshToken.findByIdAndDelete(refreshToken._id).exec()
    const newAccessToken = helper.issueAccessToken({ id: refreshToken.user._id })
    const newRefreshToken = await helper.createRefreshToken(refreshToken.user._id)
     res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 Mins
        })

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/api/admin/refresh-token'
        })
    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
}

export default {
    register,
    login,
    refreshToken
}
