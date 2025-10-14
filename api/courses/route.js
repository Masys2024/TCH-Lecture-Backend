import express from "express";
import { readCourses, createCourses, deleteCourses } from "./controller.js";

const coursesRouter = express.Router();

// Routes
coursesRouter.get("/", readCourses);
coursesRouter.post("/", createCourses);
coursesRouter.delete("/", deleteCourses);

export default coursesRouter;
