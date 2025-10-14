import express from "express";
import { readRooms, createRoom, updateRoom, deleteRoom } from "./controller.js";

const roomsRouter = express.Router();

// Routes
roomsRouter.get("/", readRooms);
roomsRouter.post("/", createRoom);
roomsRouter.patch("/", updateRoom);
roomsRouter.delete("/", deleteRoom);

export default roomsRouter;
