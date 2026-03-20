import express from "express";
import passport from "passport";
import "./config/passport.js";

const app = express();

app.use(passport.initialize());

app.use("/auth", authRoutes);