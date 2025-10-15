import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import teachersRouter from "./api/teachers/route.js";
import subjectsRouter from "./api/subjects/route.js";
import roomsRouter from "./api/rooms/route.js";
import batchesRouter from "./api/batches/route.js";
import schedulesRouter from "./api/lecture_schedules/route.js";
import branchesRouter from "./api/branches/route.js";
import coursesRouter from "./api/courses/route.js";
import standardsRouter from "./api/standards/route.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    // origin: [
    //   "http://tcheducare.com/demo",
    //   "http://localhost:3001",
    //   "http://127.0.0.1:3001",
    // ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/teachers", teachersRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/branches", branchesRouter);
app.use("/api/standards", standardsRouter);
app.use("/api/batches", batchesRouter);
app.use("/api/lecture_schedules", schedulesRouter);

// Health Check
app.get("/", (req, res) => res.send("TCH API running!"));

export default app;
