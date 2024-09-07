import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import admin from "../firebase/firebase-admin.js";

export const checkAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    }
    else {
        throw new errorHandler('Not authorized as an admin', 403)
    }
})

export const isAuthenticated = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accesstoken || req.headers.authorization?.split(' ')[1]

        if (!token) {
            throw new errorHandler("Please Login to access this resource", 401);
        }

        try {
            const firebaseAuth = admin.auth()
            const firebaseUser = await firebaseAuth.verifyIdToken(token)
            req.user = {
                _id: firebaseUser._id,
                email: firebaseUser.email,
                role: 'user',
                provider: 'google'
            }
            next()
            return;
        } catch (firebaseError) {
            console.error('Firebase verification error:', firebaseError)
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = await User.findById(decoded._id)

        if (!req.user) {
            throw new errorHandler("User not found", 404);
        }
        next();

    } catch (error) {
        console.error("Error in isAuthenticated middleware:", error);
        throw new errorHandler(401, "Not authenticated")
    }
})