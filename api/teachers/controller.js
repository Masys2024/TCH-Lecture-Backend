import BaseCrud from "../../lib/models/baseCrud.js";
import { v4 as uuidv4 } from "uuid";

const teachersCrud = new BaseCrud("teachers");

export const readTeachers = async (req, res) => {
  try {
    const filters = req.query;

    let existingTeachers;
    if (filters) {
      existingTeachers = await teachersCrud.read({
        filters: filters,
      });
    } else {
      existingTeachers = await teachersCrud.read();
    }

    if (existingTeachers.length === 0) {
      return res.status(409).json({
        returncode: 409,
        message: "No Teachers found.",
        output: [],
      });
    }
    res.json({
      returncode: 200,
      message: "Teachers found successfully.",
      output: existingTeachers,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message: "Please check your request and resend again.",
      output: [],
    });
  }
};

export const createTeachers = async (req, res) => {
  try {
    const { code, firstName, lastName } = req.body;

    let teacherCreated;
    await teachersCrud.transaction(async (conn) => {
      const request = {
        id: uuidv4(),
        code,
        firstName,
        lastName,
      };
      teacherCreated = await teachersCrud.create(request, conn);
    });

    res.json({
      returncode: 200,
      message: "Added new Teacher.",
      output: teacherCreated,
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

export const updateTeachers = async (req, res) => {
  try {
    const { teacherId, code, firstName, lastName } = req.body;
    const existingTeacher = await teachersCrud.readById(teacherId);

    if (!existingTeacher?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Teacher doesn't exists.",
        output: [],
      });
    }

    let teacherUpdated;
    await teachersCrud.transaction(async (conn) => {
      const teacher = {
        code,
        firstName,
        lastName,
      };
      teacherUpdated = await teachersCrud.update(teacherId, teacher, conn);
    });

    res.json({
      returncode: 200,
      message: "Teacher updated successfully.",
      output: teacherUpdated,
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

export const deleteTeachers = async (req, res) => {
  try {
    const { id } = req.query;
    const existingTeachers = await teachersCrud.readById(id);

    if (!existingTeachers?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Teacher doesn't exists.",
        output: [],
      });
    }

    await teachersCrud.transaction(async (conn) => {
      await teachersCrud.delete(id, conn);
    });

    res.json({
      returncode: 200,
      message: "Teacher deleted successfully.",
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
