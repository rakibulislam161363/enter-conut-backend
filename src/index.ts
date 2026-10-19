import app from "./app";
import config from "./config";
import "dotenv/config";
import { db } from "./prisma/db";

const PORT = config.port;

async function main() {
  try {
    await db.orm.public.User.first(); 
    console.log("Connected to the database successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server or connecting to DB:", error);
    process.exit(1);
  }
}

main();

