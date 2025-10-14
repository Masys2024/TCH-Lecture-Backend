import BaseCrud from "../../lib/models/baseCrud.js";
import { v4 as uuidv4 } from "uuid";

const subjectsCrud = new BaseCrud("subjects");

export const readSubjects = async (req, res) => {
  try {
    const filters = req.query;

    let existingSubjects;
    if (filters) {
      existingSubjects = await subjectsCrud.read({
        filters: filters,
      });
    } else {
      existingSubjects = await subjectsCrud.read();
    }

    if (existingSubjects.length === 0) {
      return res.status(409).json({
        returncode: 409,
        message: "No Subjects found.",
        output: [],
      });
    }
    res.json({
      returncode: 200,
      message: "Subjects found successfully.",
      output: existingSubjects,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message: "Please check your request and resend again.",
      output: [],
    });
  }
};

export const createSubjects = async (req, res) => {
  try {
    const { code, name } = req.body;

    let subjectCreated;
    await subjectsCrud.transaction(async (conn) => {
      const request = {
        id: uuidv4(),
        code,
        name,
      };
      subjectCreated = await subjectsCrud.create(request, conn);
    });

    res.json({
      returncode: 200,
      message: "Added new Subject.",
      output: subjectCreated,
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

export const updateSubjects = async (req, res) => {
  try {
    const { subjectId, code, name } = req.body;
    const existingSubject = await subjectsCrud.readById(subjectId);

    if (!existingSubject?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Subject doesn't exists.",
        output: [],
      });
    }

    let subjectUpdated;
    await subjectsCrud.transaction(async (conn) => {
      const teacher = {
        code,
        name,
      };
      subjectUpdated = await subjectsCrud.update(subjectId, teacher, conn);
    });

    res.json({
      returncode: 200,
      message: "Subject updated successfully.",
      output: subjectUpdated,
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

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.query;
    const existingSubject = await subjectsCrud.readById(id);

    if (!existingSubject?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Subject doesn't exists.",
        output: [],
      });
    }

    await subjectsCrud.transaction(async (conn) => {
      await subjectsCrud.delete(id, conn);
    });

    res.json({
      returncode: 200,
      message: "Subject deleted successfully.",
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
