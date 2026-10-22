import app from "./app";
import config from "./config";
import "dotenv/config";
import { redisClient } from "./lib/redis";
import { transporter } from "./lib/nodemailer";

const PORT = config.port;

async function main() {
  try {
    await redisClient.connect();
    await transporter.verify();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server or connecting to DB:", error);
    process.exit(1);
  }
}

main();

