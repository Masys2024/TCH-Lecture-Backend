import BaseCrud from "../../lib/models/baseCrud.js";
import { v4 as uuidv4 } from "uuid";

const batchesCrud = new BaseCrud("batches");

export const readBatches = async (req, res) => {
  try {
    const filters = req.query;

    let existingBatches;
    if (filters) {
      existingBatches = await batchesCrud.read({
        filters: filters,
      });
    } else {
      existingBatches = await batchesCrud.read();
    }

    if (existingBatches.length === 0) {
      return res.status(409).json({
        returncode: 409,
        message: "No Batches found.",
        output: [],
      });
    }
    res.json({
      returncode: 200,
      message: "Batches found successfully.",
      output: existingBatches,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message: "Please check your request and resend again.",
      output: [],
    });
  }
};

export const createBatch = async (req, res) => {
  try {
    const { code, name } = req.body;

    let batchCreated;
    await batchesCrud.transaction(async (conn) => {
      const batch = {
        id: uuidv4(),
        code,
        name,
      };
      batchCreated = await batchesCrud.create(batch, conn);
    });

    res.json({
      returncode: 200,
      message: "Added new Batch.",
      output: batchCreated,
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

export const updateBatch = async (req, res) => {
  try {
    const { batchId, code, name } = req.body;
    const existingBatch = await batchesCrud.readById(batchId);

    if (!existingBatch?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Batch doesn't exists.",
        output: [],
      });
    }

    let batchUpdated;
    await batchesCrud.transaction(async (conn) => {
      const batch = {
        code,
        name,
      };
      batchUpdated = await blogsCrud.update(batchId, batch, conn);
    });

    res.json({
      returncode: 200,
      message: "Batch updated successfully.",
      output: batchUpdated,
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

export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.query;
    const existingBatch = await batchesCrud.readById(id);

    if (!existingBatch?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Batch doesn't exists.",
        output: [],
      });
    }

    await batchesCrud.transaction(async (conn) => {
      await batchesCrud.delete(id, conn);
    });

    res.json({
      returncode: 200,
      message: "Batch deleted successfully.",
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
