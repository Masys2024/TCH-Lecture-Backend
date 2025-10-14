import express from "express";
import {
  readBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from "./controller.js";

const batchesRouter = express.Router();

// Routes
batchesRouter.get("/", readBatches);
batchesRouter.post("/", createBatch);
batchesRouter.patch("/", updateBatch);
batchesRouter.delete("/", deleteBatch);

export default batchesRouter;
