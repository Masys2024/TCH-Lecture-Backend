import express from "express";
import {
  readSubjects,
  createSubjects,
  updateSubjects,
  deleteSubject,
} from "./controller.js";

const subjectsRouter = express.Router();

// Routes
subjectsRouter.get("/", readSubjects);
subjectsRouter.post("/", createSubjects);
subjectsRouter.patch("/", updateSubjects);
subjectsRouter.delete("/", deleteSubject);

export default subjectsRouter;
