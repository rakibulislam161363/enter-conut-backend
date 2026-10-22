import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(process.cwd(),".env")})

export default {
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    appUrl : process.env.APP_URL,
    jwtSecret: process.env.JWT_ACCESS_SECRET!,
    jwtExpiration: process.env.JWT_ACCESS_EXPIRES_IN!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRES_IN!,
    node_env: process.env.NODE_ENV,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    redis_user: process.env.REDIS_USER!,
	redis_password: process.env.REDIS_PASSWORD!,
	redis_host: process.env.REDIS_HOST!,
	redis_port: process.env.REDIS_PORT!,
	smtp_user: process.env.SMTP_USER!,
	smtp_password: process.env.SMTP_PASSWORD!,
	email_sender: process.env.EMAIL_SENDER!,
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
}