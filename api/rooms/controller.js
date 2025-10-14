import BaseCrud from "../../lib/models/baseCrud.js";
import { v4 as uuidv4 } from "uuid";

const roomsCrud = new BaseCrud("rooms");

export const readRooms = async (req, res) => {
  try {
    const filters = req.query;

    let existingRooms;
    if (filters) {
      existingRooms = await roomsCrud.read({
        filters: filters,
      });
    } else {
      existingRooms = await roomsCrud.read();
    }

    if (existingRooms.length === 0) {
      return res.status(409).json({
        returncode: 409,
        message: "No Rooms found.",
        output: [],
      });
    }
    res.json({
      returncode: 200,
      message: "Rooms found successfully.",
      output: existingRooms,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message: "Please check your request and resend again.",
      output: [],
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { code, name } = req.body;

    let roomCreated;
    await roomsCrud.transaction(async (conn) => {
      const request = {
        id: uuidv4(),
        code,
        name,
      };
      roomCreated = await roomsCrud.create(request, conn);
    });

    res.json({
      returncode: 200,
      message: "Added new Room.",
      output: roomCreated,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message:
        "Some errors occured while completing your request, please try again later...",
      output: [],
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { roomId, code, location } = req.body;
    const existingRoom = await roomsCrud.readById(roomId);

    if (!existingRoom?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Room doesn't exists.",
        output: [],
      });
    }

    let roomUpdated;
    await roomsCrud.transaction(async (conn) => {
      const room = {
        code,
        location,
      };
      roomUpdated = await roomsCrud.update(roomId, room, conn);
    });

    res.json({
      returncode: 200,
      message: "Room updated successfully.",
      output: roomUpdated,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message:
        "Some errors occured while completing your request, please try again later...",
      output: [],
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.query;
    const existingRoom = await roomsCrud.readById(id);

    if (!existingRoom?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Room doesn't exists.",
        output: [],
      });
    }

    await roomsCrud.transaction(async (conn) => {
      await roomsCrud.delete(id, conn);
    });

    res.json({
      returncode: 200,
      message: "Room deleted successfully.",
      output: [],
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message:
        "Some errors occured while completing your request, please try again later...",
      output: [],
    });
  }
};
