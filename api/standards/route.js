import express from "express";
import {
  readStandards,
  createStandards,
  deleteStandards,
} from "./controller.js";

const standardsRouter = express.Router();

// Routes
standardsRouter.get("/", readStandards);
standardsRouter.post("/", createStandards);
standardsRouter.delete("/", deleteStandards);

export default standardsRouter;
