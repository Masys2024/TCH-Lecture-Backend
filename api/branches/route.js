import express from "express";
import { readBranches, createBranch, deleteBatch } from "./controller.js";

const branchesRouter = express.Router();

// Routes
branchesRouter.get("/", readBranches);
branchesRouter.post("/", createBranch);
branchesRouter.delete("/", deleteBatch);

export default branchesRouter;
