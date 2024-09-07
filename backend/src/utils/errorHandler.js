import { apiResponse } from "./apiResponse.js"

class errorHandler extends Error {
    constructor(
        message = "Something went wrong",
        statusCode,
        error = {}
    ) {
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.error = error

        // Wrong Mongodb Id error
        if (error.name === "CastError") {
            const message = `Resource not found. Invalid: ${error.path}`;
            this.error = new apiResponse(message, 400);
        }

        // Mongoose duplicate key error
        if (error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
            this.error = new apiResponse(message, 400);
        }

        // Wrong JWT error
        if (error.name === "JsonWebTokenError") {
            const message = `Json Web Token is invalid, Try again `;
            this.error = new apiResponse(message, 400);
        }

        // JWT EXPIRE error
        if (error.name === "TokenExpiredError") {
            const message = `Json Web Token is Expired, Try again `;
            this.error = new apiResponse(message, 400);
        }

        Error.captureStackTrace(this, this.constructor)
    }
}

export { errorHandler }