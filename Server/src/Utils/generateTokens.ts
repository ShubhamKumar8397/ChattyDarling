import jwt from "jsonwebtoken";


export const generateRefreshToken = (user: any) => {
    const refreshToken = jwt.sign(
        {
            user
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn : "30D"
        }
    )

    return refreshToken;
}


export const generateAccessToken = (user: any) => {
    const accessToken = jwt.sign(
        {
            user
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn : "30M"
        }
    )

    return accessToken;
}
