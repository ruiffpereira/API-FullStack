const CategoryModel = require("../models/categories");

class CategoryController {
  constructor() {}

  async createCategory(params) {
    try {
      const { name } = params;
      const result = await CategoryModel.create({
        name,
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async readCategory() {
    try {
      const result = await CategoryModel.findAll();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

   async updateCategory(params) {
    try {
      const { categoryID, name } = params;
      const result = await CategoryModel.update(
        { name },
        {
          where: {
            categoryID,
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

  async deleteCategory(params) {
    const { categoryID } = params;
    try {
      const result = await CategoryModel.destroy({ where: { categoryID } });
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
}

module.exports = CategoryController;
