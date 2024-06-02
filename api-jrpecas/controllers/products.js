const ProductModel = require("../models/products");

class ProductController {
  constructor() {}

  async createProduct(params) {
    try {
      const { name, reference, price, stock, photos, description, subcategoryID } = params;
      const result = await ProductModel.create({
        name,
        reference,
        price,
        stock,
        photos,
        description,
        subcategoryID,
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async readProduct() {
    try {
      const result = await ProductModel.findAndCountAll();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

   async updateProduct(params) {
    try {
      const { productID, name, reference, price, stock, photos, description, subcategoryID } = params;
      const result = await ProductModel.update(
        { name, reference, price, stock, photos, description, subcategoryID },
        {
          where: {
            productID,
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

  async deleteProduct(params) {
    const { productID } = params;
    try {
      const result = await ProductModel.destroy({ where: { productID } });
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

  // async readUsers(email) {
  //   try {
  //     if (!email) {
  //       const result = await UserModel.findAll({
  //         attributes: ["name", "email", "contact", "rule"],
  //       });
  //       console.log(result);
  //       return result;
  //     } else {
  //       const result = await UserModel.findAll({
  //         attributes: ["name", "email", "contact", "rule"],
  //         where: { email: email },
  //       });
  //       console.log(result);
  //       return result;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // }

  // async updateUser(params) {
  //   try {
  //     const { id, name, email, contact, rule } = params;
  //     const result = await UserModel.update(
  //       { name, email, contact, rule },
  //       {
  //         where: {
  //           id,
  //         },
  //       }
  //     );
  //     console.log(result);
  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // }

  // async deleteUser(params) {
  //   try {
  //     const result = await UserModel.destroy({ where: { id: params.id } });
  //     if (result == 0) {
  //       console.log(result);
  //       return false;
  //     } else {
  //       console.log(result);
  //       return true;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // }
}

module.exports = ProductController;
