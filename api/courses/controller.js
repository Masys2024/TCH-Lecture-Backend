import BaseCrud from "../../lib/models/baseCrud.js";
import { v4 as uuidv4 } from "uuid";

const coursesCrud = new BaseCrud("courses");

export const readCourses = async (req, res) => {
  try {
    const filters = req.query;

    let existingCourses;
    if (filters) {
      existingCourses = await coursesCrud.read({
        filters: filters,
      });
    } else {
      existingCourses = await coursesCrud.read();
    }

    if (existingCourses.length === 0) {
      return res.status(409).json({
        returncode: 409,
        message: "No Courses found.",
        output: [],
      });
    }
    res.json({
      returncode: 200,
      message: "Courses found successfully.",
      output: existingCourses,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message: "Please check your request and resend again.",
      output: [],
    });
  }
};

export const createCourses = async (req, res) => {
  try {
    const { code, name } = req.body;

    let courseCreated;
    await coursesCrud.transaction(async (conn) => {
      const branch = {
        id: uuidv4(),
        code,
        name,
      };
      courseCreated = await coursesCrud.create(branch, conn);
    });

    res.json({
      returncode: 200,
      message: "Added new Course.",
      output: courseCreated,
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

export const deleteCourses = async (req, res) => {
  try {
    const { id } = req.query;
    const existingCourses = await coursesCrud.readById(id);

    if (!existingCourses?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Course doesn't exists.",
        output: [],
      });
    }

    await coursesCrud.transaction(async (conn) => {
      await coursesCrud.delete(id, conn);
    });

    res.json({
      returncode: 200,
      message: "Course deleted successfully.",
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
