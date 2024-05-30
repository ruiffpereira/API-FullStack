const UserModel = require("../models/Users");

class UserController {
  constructor() {}

  async readUsers(email) {
    try {
      if (!email) {
        const result = await UserModel.findAll({
          attributes: ["name", "email", "contact", "rule"],
        });
        console.log(result);
        return result;
      } else {
        const result = await UserModel.findAll({
          attributes: ["name", "email", "contact", "rule"],
          where: { email: email },
        });
        console.log(result);
        return result;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createUser(params) {
    try {
      const { name, email, contact, password, rule } = params;
      const user = await UserModel.create({
        name,
        email,
        contact,
        password,
        rule,
      });
      console.log(result);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateUser(params) {
    try {
      const { id, name, email, contact, rule } = params;
      const result = await UserModel.update(
        { name, email, contact, rule },
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

  async deleteUser(params) {
    try {
      const result = await UserModel.destroy({ where: { id: params.id } });
      if (result == 0) {
        console.log(result);
        return false;
      } else {
        console.log(result);
        return true;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async loginUser(email, password) {
    try {
      const result = await UserModel.findOne({
        where: { email: email, password: password },
      });

      if (!result) {
        console.log(result);
        return false;
      } else {
        console.log(result);
        return result;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = UserController;
