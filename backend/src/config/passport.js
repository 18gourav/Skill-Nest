import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL;

export const isGoogleAuthEnabled = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL);
export const googleAuthEnabled = isGoogleAuthEnabled();
export const frontendURL = process.env.CLIENT_URL || "http://localhost:5175";

const buildUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter += 1;
  }

  return username;
};

if (googleAuthEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(null, false);
          }

          const googleId = profile.id;
          const displayName = profile.displayName || "Google User";
          const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() || "googleuser";
          let user = await User.findOne({ $or: [{ googleId }, { emailId: email }] });

          if (user) {
            user.googleId = user.googleId || googleId;
            user.authProvider = "google";
            if (!user.fullName) user.fullName = displayName;
            if (!user.username) user.username = await buildUniqueUsername(baseUsername);
            if (!user.password) user.password = crypto.randomBytes(16).toString("hex");
            await user.save({ validateBeforeSave: false });
            return done(null, user);
          }

          user = await User.create({
            fullName: displayName,
            username: await buildUniqueUsername(baseUsername),
            emailId: email,
            password: crypto.randomBytes(16).toString("hex"),
            googleId,
            authProvider: "google",
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

export default passport;
