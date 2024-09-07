import jwt from "jsonwebtoken"

export const genAccessToken = (userid) => {
    return jwt.sign({ _id: userid }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )
}
export const genRefreshToken = (userid) => {
    return jwt.sign({ _id: userid }, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
}