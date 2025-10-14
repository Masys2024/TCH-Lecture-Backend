import BaseCrud from "../../lib/models/baseCrud.js";
import { v4 as uuidv4 } from "uuid";

const schedulesCrud = new BaseCrud("lecture_schedules");

export const readSchedules = async (req, res) => {
  try {
    const filters = req.query;

    let existingSchedules;
    if (filters) {
      existingSchedules = await schedulesCrud.read({
        filters: filters,
        join: [
          { table: "teachers", on: "teacher" },
          { table: "subjects", on: "subject" },
          { table: "branches", on: "branch" },
          { table: "standards", on: "standard" },
          { table: "courses", on: "course" },
          { table: "batches", on: "batch" },
          { table: "rooms", on: "room" },
        ],
      });
    } else {
      existingSchedules = await schedulesCrud.read({
        join: [
          { table: "teachers", on: "teacher" },
          { table: "subjects", on: "subject" },
          { table: "branches", on: "branch" },
          { table: "standards", on: "standard" },
          { table: "courses", on: "course" },
          { table: "batches", on: "batch" },
          { table: "rooms", on: "room" },
        ],
      });
    }

    if (existingSchedules.length === 0) {
      return res.status(409).json({
        returncode: 409,
        message: "No Lecture Schedule found.",
        output: [],
      });
    }
    res.json({
      returncode: 200,
      message: "Lecture Schedules found successfully.",
      output: existingSchedules,
    });
  } catch (error) {
    res.status(500).json({
      returncode: 500,
      message: "Please check your request and resend again.",
      output: [],
    });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const {
      date,
      day,
      batch,
      branch,
      standard,
      course,
      time_in,
      time_out,
      teacher,
      subject,
      room,
      topic,
    } = req.body;

    let scheduleCreated;
    await schedulesCrud.transaction(async (conn) => {
      const schedule = {
        id: uuidv4(),
        date,
        day,
        batch,
        branch,
        standard,
        course,
        time_in,
        time_out,
        teacher,
        subject,
        room,
        topic,
      };
      scheduleCreated = await schedulesCrud.create(schedule, conn);
    });

    res.json({
      returncode: 200,
      message: "Added new Lecture Schedule.",
      output: scheduleCreated,
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

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.query;
    const existingSchedule = await schedulesCrud.readById(id);

    if (!existingSchedule?.id) {
      return res.status(409).json({
        returncode: 409,
        message: "Lecture Schedule doesn't exists.",
        output: [],
      });
    }

    await schedulesCrud.transaction(async (conn) => {
      await schedulesCrud.delete(id, conn);
    });

    res.json({
      returncode: 200,
      message: "Lecture Schedule deleted successfully.",
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

export const deleteAllSchedules = async (req, res) => {
  try {
    const existingSchedules = await schedulesCrud.read();
    await schedulesCrud.transaction(async (conn) => {
      existingSchedules?.map(async (schedule) => {
        await schedulesCrud.delete(schedule?.id, conn);
      });
    });

    res.json({
      returncode: 200,
      message: "Lecture Schedules deleted successfully.",
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
