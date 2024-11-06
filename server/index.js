import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/UserRouter.js";
import CourseRouter from "./routes/CourseRouter.js";
import VideoRouter from "./routes/VideoRouter.js";
import ConferenceRouter from "./routes/ConferenceRouter.js";
import BlogRouter from "./routes/BlogRouter.js";
import CategoryRouter from "./routes/CategoryRouter.js";
import MemeberShipRouter from "./routes/MemberShipRouter.js";
import ProgressRouter from "./routes/ProgressRouter.js";
import QuizRouter from "./routes/QuizRouter.js";
import AdminRouter from "./routes/AdminRouter.js";
import UserMembershipRouter from "./routes/UserMembershipRouter.js";
import AWS from "aws-sdk";

dotenv.config();

const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACE_ENDPOINT);
export const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
  secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
});

export const Scaleway = new AWS.S3({
  endpoint: "https://s3.<region>.scw.cloud", // Replace <region> with your Scaleway bucket region (e.g., 'fr-par' or 'nl-ams')
  accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
  secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
  signatureVersion: "v4",
});

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use(UserRouter);
app.use(CourseRouter);
app.use(VideoRouter);
app.use(ConferenceRouter);
app.use(BlogRouter);
app.use(MemeberShipRouter);
app.use(CategoryRouter);
app.use(ProgressRouter);
app.use(QuizRouter);
app.use(UserMembershipRouter);
app.use("/admin", AdminRouter);
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/mydatabase";

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
