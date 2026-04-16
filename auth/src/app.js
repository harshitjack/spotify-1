import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRotes from "./routes/auth.routes.js"
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import config from "./config/config.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRotes)
app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRECT,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));


export default app;