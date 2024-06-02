const SubCategoryModel = require("../models/subcategories");

class SubCategoryController {
  constructor() {}

  async createSubCategory(params) {
    try {
      const { name, categoryID } = params;
      const result = await SubCategoryModel.create({
        name,
        categoryID
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async readSubCategory() {
    try {
      const result = await SubCategoryModel.findAndCountAll();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

   async updateSubCategory(params) {
    try {
      const { categoryID, name, subcategoryID } = params;
      const result = await SubCategoryModel.update(
        { name, categoryID },
        {
          where: {
            subcategoryID,
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

  async deleteSubCategory(params) {
    const { subcategoryID } = params;
    try {
      const result = await SubCategoryModel.destroy({ where: { subcategoryID } });
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

module.exports = SubCategoryController;
