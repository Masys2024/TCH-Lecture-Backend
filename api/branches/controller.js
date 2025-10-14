import BaseCrud from "../../lib/models/baseCrud.js";
import { v4 as uuidv4 } from "uuid";

const branchesCrud = new BaseCrud("branches");

export const readBranches = async (req, res) => {
  try {
    const filters = req.query;

    let existingBranches;
    if (filters) {
      existingBranches = await branchesCrud.read({
        filters: filters,
      });
    } else {
      existingBranches = await branchesCrud.read();
    }

    if (existingBranches.length === 0) {
      return res.status(409).json({
        returncode: 409,
        message: "No Branches found.",
        output: [],
      });
    }
    res.json({
      returncode: 200,
      message: "Branches found successfully.",
      output: existingBranches,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message: "Please check your request and resend again.",
      output: [],
    });
  }
};

export const createBranch = async (req, res) => {
  try {
    const { code, name } = req.body;

    let batchCreated;
    await branchesCrud.transaction(async (conn) => {
      const branch = {
        id: uuidv4(),
        code,
        name,
      };
      batchCreated = await branchesCrud.create(branch, conn);
    });

    res.json({
      returncode: 200,
      message: "Added new Branch.",
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

export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.query;
    const existingBranch = await branchesCrud.readById(id);

    if (!existingBranch?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Branch doesn't exists.",
        output: [],
      });
    }

    await branchesCrud.transaction(async (conn) => {
      await branchesCrud.delete(id, conn);
    });

    res.json({
      returncode: 200,
      message: "Branch deleted successfully.",
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
