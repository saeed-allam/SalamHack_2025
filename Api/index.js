import express from "express";
import authRoute from "./routes/authRoutes.js";
import contentRoute from "./routes/contentRoutes.js";
import summeryRoute from "./routes/summeryRoutes.js";
import cookieParser from "cookie-parser";
import chatRoute from "./routes/chatRoutes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("db connected"))
  .catch((e) => console.log("Error: " + e));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));
app.use("/api/auth", authRoute);
app.use("/api/content", contentRoute);
app.use("/api/summery", summeryRoute);
app.use("/api/chat/:summeryId", chatRoute);

app.listen(3000, () => {
  console.log(
    "server is running on http://localhost:3000 ,Wait for the DB connection to occur"
  );
});
