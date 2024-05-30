const ServicesModel = require("../models/Services");

class ServicesController {
  constructor() {}

  async createServices(params) {
    try {
      const { service, time, price } = params;
      const result = await ServicesModel.create({
        service,
        time,
        price,
      });

      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async readServices() {
    try {
      const result = await ServicesModel.findAll({
        attributes: ["service", "price"],
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateServices(params) {
    try {
      const { id, service, time, price } = params;
      const result = await ServicesModel.update(
        { service, time, price },
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

  async deleteService(params) {
    try {
      const result = await ServicesModel.destroy({ where: { id: params.id } });
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

module.exports = ServicesController;
