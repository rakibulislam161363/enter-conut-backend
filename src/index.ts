import app from "./app";
import config from "./config";
import { redisClient } from "./lib/redis";
import { transporter } from "./lib/nodemailer";

// Render ফ্রি টিয়ারের জন্য পোর্ট বাইন্ডিং (PORT এনভায়রনমেন্ট ভ্যারিয়েবল না থাকলে ডিফল্ট ১০০০০)
const PORT = process.env.PORT || config.port || 10000;

async function main() {
  try {
    // ১. Redis কানেকশন
    await redisClient.connect();
    console.log("Redis connected successfully.");

    // ২. Nodemailer ভেরিফিকেশন (Try-Catch ছাড়া আলাদাভাবে হ্যান্ডেল করা হয়েছে যাতে সার্ভার ক্র্যাশ না করে)
    transporter.verify((error) => {
      if (error) {
        console.log("Nodemailer timeout or network blocked, keeping server alive:", error.message);
      } else {
        console.log("Nodemailer is ready to send emails!");
      }
    });

    // ৩. এক্সপ্রেস সার্ভার স্টার্ট (Render-এর জন্য '0.0.0.0' হোস্ট দেওয়া বাধ্যতামূলক)
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.log("Error starting server or connecting to DB:", error);
    process.exit(1);
  }
}

main();


