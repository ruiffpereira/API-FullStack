const OrderProductModel = require("../models/orderProduct");

class OrderProductController {
  constructor() {}

  async createOrderProduct(params) {
    try {
      const { productID, orderID, amount } = params;
      const result = await OrderProductModel.create({
        productID, 
        orderID,
        amount
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async readOrderProduct() {
    try {
      const result = await OrderProductModel.findAndCountAll();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

   async updateOrderProduct(params) {
    try {
      const { productID, orderID, amount } = params;
      const result = await OrderProductModel.update(
        { productID,
          orderID,
          amount 
        },
        {
          where: {
            productID,
            orderID
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

  async deleteOrderProduct(params) {
    const { productID, orderID } = params;
    try {
      const result = await OrderProductModel.destroy({ where: { productID, orderID  } });
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

module.exports = OrderProductController;
