const ClientModel = require("../models/clients");

class ClientController {
  constructor() {}

  async createClient(params) {
    try {
      const { name, photo, email, contact } = params;
      const result = await ClientModel.create({
        name,
        photo,
        email,
        contact
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async readClient() {
    try {
      const result = await ClientModel.findAll();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

}

module.exports = ClientController;
