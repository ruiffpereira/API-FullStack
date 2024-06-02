const OrderModel = require("../models/orders");

class OrderController {
  constructor() {}

  async createOrder(params) {
    try {
      const { clientID, orderdate, paid } = params;
      const result = await OrderModel.create({
        clientID, 
        orderdate, 
        paid
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async readOrder() {
    try {
      const result = await OrderModel.findAndCountAll();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

   async updateOrder(params) {
    try {
      const { orderID, clientID, orderdate, paid } = params;
      const result = await OrderModel.update(
        { clientID, orderdate, paid },
        {
          where: {
            orderID,
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

  async deleteOrder(params) {
    const { orderID } = params;
    try {
      const result = await OrderModel.destroy({ where: { orderID } });
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

module.exports = OrderController;
