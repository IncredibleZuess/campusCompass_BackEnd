import passport from "passport";
import passportJwt from "passport-jwt"
import passportHttp from "passport-http"
import Admin from "../models/admin.ts";
import helper from "../utils/helper.ts"

const extractFromCookie = (req) => {
    let jwt = null

    if (req && req.cookies){
        jwt = req.cookies['accessToken']
    }
    return jwt
}

const options = {
    jwtFromRequest: extractFromCookie,
    secretOrKey: process.env.SECRET
}

passport.use(new passportJwt.Strategy(options, async (payload, done) => {
    try{
        const admin = await Admin.findOne({ _id: payload.id });
        if (!admin) {
            return done(null, false);
        }
        done(null, admin);
    } catch (error) {
        done(error, false);
    }
}))

passport.use(
    new passportHttp.BasicStrategy(async (username, password, done) => {
        try {
            const admin = await Admin.findOne({ username: username });
            if (!admin) {
                return done(null, false);
            }
            const isMatch = await helper.comparePasswords(password, admin.password);
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, admin);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;