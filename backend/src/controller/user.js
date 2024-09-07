import { User } from "../model/user.model.js"
import { asyncHandler } from "../utils/apiResponse.js"
import { apiResponse } from "../utils/asyncHandler.js"
import { errorHandler } from "../utils//errorHandler.js"
import { genAccessToken, genRefreshToken } from "../utils/token.js"


export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        throw new errorHandler(400, "no refresh token provided")
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded._id)

        if (!user || !user.refreshToken !== refreshToken) {
            throw new errorHandler(403, "invalid refresh token ")
        }

        const newAccessToken = genAccessToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, { httpOnly: true })
            .json(new apiResponse(200, { accessToken: newAccessToken },
                "Access token refreshed successfully"))
    } catch (error) {
        throw new errorHandler('Invalid refresh token', 403);
    }
})

export const createUser = asyncHandler(async (req, res) => {

    const { name, email, password, provider = 'local' } = req.body
    const picture = req.file

    if (![name, email, password] || (provider !== 'google' && !password)) {
        throw new errorHandler(401, "Please provide all the fields")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { name }]
    })
    if (existingUser) {
        throw new errorHandler(401, "User with email or name exists")
    }

    const userData = ({
        name: name.toLowerCase(),
        email,
        provider,
    })

    if (provider !== 'google') {
        userData.password = password;
    }

    if (picture) {
        const fileName = `{uuidv4()}_${picture.originalname}`
        const fileUpload = bucket.file(fileName)

        await fileUpload.save(picture.buffer, {
            metadata: {
                contentType: picture.mimeyype
            }
        })

        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        userData.picture = fileUrl
    }

    const newUser = await User.create(userData)

    if (!newUser) {
        throw new errorHandler(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new apiResponse(200, newUser, "User registered Successfully")
    )
})

export const loginUser = asyncHandler(async (req, res) => {

    const { name, email, password, provider } = req.body


    if (!email) {
        throw new errorHandler(401, "email required")
    }

    if (provider !== 'google' && !password) {
        throw new errorHandler(401, "Password is required for non-Google logins");
    }

    let findUser = await User.findOne({ email })
    if (!findUser) {

        if (provider === 'google') {
            findUser = await User.create({ name, email, provider });
        } else {
            throw new errorHandler(404, "User does not exist");
        }
    } else {
        if (provider === 'google') {

            return res.status(200)
                .json(new apiResponse(200, findUser, "Logged in successfully via Google"));
        }
    }
    // Generate tokens
    const accessToken = genAccessToken(findUser._id)
    const refreshToken = genRefreshToken(findUser._id)

    findUser.refreshToken = refreshToken
    await findUser.save()

    const options = {
        httpOnly: true,
        secure: true
    }

    const isPasswordValid = await findUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new errorHandler(400, 'Invalid password');
    }

    return res
        .status(200)
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshtoken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                { accessToken, refreshToken, findUser },
                "User logged In Successfully"

            )
        )
})

export const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: undefined // this removes the field from document
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .status(200)
            .json(new apiResponse(200, {},
                "User logged out successfully"
            ))
    } catch (error) {
        console.log(error.message)
        return res
            .status(500)
            .json(new apiResponse(500, error.message));
    }
})