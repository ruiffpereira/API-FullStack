const SchedulesModel = require("../models/Schedules");

class SchedulesController {
  constructor() {}

  async createSchedules(params) {
    try {
      const { name, userId, date, hours, service } = params;
      const result = await SchedulesModel.create({
        name,
        userId,
        date,
        hours,
        service,
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async readSchedules() {
    try {
      const result = await SchedulesModel.findAll({
        attributes: ["name", "userId", "date", "hours", "service"],
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateSchedules(params) {
    try {
      const { name, userId, date, hours, service } = params;
      const result = await SchedulesModel.update(
        { name, userId, date, hours, service },
        {
          where: {
            id,
          },
        }
      );
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteSchedules(params) {
    try {
      const result = await SchedulesModel.destroy({ where: { id: params.id } });
      console.log(result);
      if (result == 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = SchedulesController;
