import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(process.cwd(),".env")})

export default {
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    appUrl : process.env.APP_URL,
    jwtSecret: process.env.JWT_SCRETE!,
    jwtExpiration: process.env.JWT_EXPIRATION!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION!,
}