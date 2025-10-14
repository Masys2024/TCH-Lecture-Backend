import express from "express";
import {
  readTeachers,
  createTeachers,
  updateTeachers,
  deleteTeachers,
} from "./controller.js";

const teachersRouter = express.Router();

// Routes
teachersRouter.get("/", readTeachers);
teachersRouter.post("/", createTeachers);
teachersRouter.patch("/", updateTeachers);
teachersRouter.delete("/", deleteTeachers);

export default teachersRouter;
