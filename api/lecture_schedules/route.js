import express from "express";
import {
  readSchedules,
  createSchedule,
  deleteSchedule,
  deleteAllSchedules,
} from "./controller.js";

const schedulesRouter = express.Router();

// Routes
schedulesRouter.get("/", readSchedules);
schedulesRouter.post("/", createSchedule);
schedulesRouter.delete("/", deleteSchedule);
schedulesRouter.get("/delete-all", deleteAllSchedules);

export default schedulesRouter;
