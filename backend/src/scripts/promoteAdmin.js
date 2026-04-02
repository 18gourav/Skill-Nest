import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const email = process.argv[2]?.trim();

if (!email) {
  console.error("Usage: npm run promote-admin -- user@example.com");
  process.exit(1);
}

if (!process.env.MONGODB_URL) {
  console.error("MONGODB_URL is missing in backend .env");
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const user = await User.findOne({ emailId: email });

    if (!user) {
      console.error(`User not found for email: ${email}`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`User ${email} is already admin`);
      process.exit(0);
    }

    user.role = "admin";
    await user.save({ validateBeforeSave: false });
    console.log(`Promoted ${email} to admin`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to promote admin:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

run();
