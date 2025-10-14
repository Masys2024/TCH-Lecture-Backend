import BaseCrud from "../../lib/models/baseCrud.js";
import { v4 as uuidv4 } from "uuid";

const standardsCrud = new BaseCrud("standards");

export const readStandards = async (req, res) => {
  try {
    const filters = req.query;

    let existingStandards;
    if (filters) {
      existingStandards = await standardsCrud.read({
        filters: filters,
      });
    } else {
      existingStandards = await standardsCrud.read();
    }

    if (existingStandards.length === 0) {
      return res.status(409).json({
        returncode: 409,
        message: "No Standards found.",
        output: [],
      });
    }
    res.json({
      returncode: 200,
      message: "Standards found successfully.",
      output: existingStandards,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message: "Please check your request and resend again.",
      output: [],
    });
  }
};

export const createStandards = async (req, res) => {
  try {
    const { code, name } = req.body;

    let standardCreated;
    await standardsCrud.transaction(async (conn) => {
      const branch = {
        id: uuidv4(),
        code,
        name,
      };
      standardCreated = await standardsCrud.create(branch, conn);
    });

    res.json({
      returncode: 200,
      message: "Added new Standards.",
      output: standardCreated,
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

export const deleteStandards = async (req, res) => {
  try {
    const { id } = req.query;
    const existingStandards = await standardsCrud.readById(id);

    if (!existingStandards?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Standard doesn't exists.",
        output: [],
      });
    }

    await standardsCrud.transaction(async (conn) => {
      await standardsCrud.delete(id, conn);
    });

    res.json({
      returncode: 200,
      message: "Standard deleted successfully.",
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
