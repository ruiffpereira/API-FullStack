import { Request, Response } from "express";
import Stripe from "stripe";
import {
  Order,
  OrderProduct,
  Cart,
  CartProduct,
  Product,
  Customer,
  Address,
} from "../models";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function handleStripeWebhook(
  req: Request,
  res: Response,
): Promise<void> {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { customerId, shippingAddress, billingAddress } =
      paymentIntent.metadata;

    try {
      const cart = await Cart.findOne({
        where: { customerId },
        include: [
          {
            model: CartProduct,
            as: "cartProducts",
            attributes: ["quantity", "productId"],
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["productId", "name", "price"],
              },
            ],
          },
        ],
      });
      const userRecord = await Customer.findOne({
        where: { customerId },
        attributes: ["userId"],
      });
      const shipping = await Address.findOne({
        where: { addressId: shippingAddress, customerId },
      });
      const billing = await Address.findOne({
        where: { addressId: billingAddress, customerId },
      });

      if (
        !cart ||
        !(cart as any).cartProducts?.length ||
        !userRecord ||
        !shipping ||
        !billing
      ) {
        console.error(
          "Webhook createOrder: missing data for customerId",
          customerId,
        );
        res.status(400).json({ error: "Missing order data" });
        return;
      }

      const totalPrice = (cart as any).cartProducts.reduce(
        (total: number, item: any) =>
          total + item.product.price * item.quantity,
        0,
      );
      const newOrder = await Order.create({
        customerId,
        userId: (userRecord as any).userId,
        price: totalPrice,
        shippingAddress,
        billingAddress,
      });

      const orderProducts = (cart as any).cartProducts.map((item: any) => ({
        orderId: (newOrder as any).orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));
      await OrderProduct.bulkCreate(orderProducts);
      await CartProduct.destroy({ where: { cartId: (cart as any).cartId } });

      console.log("Order created via webhook for customer", customerId);
    } catch (err) {
      console.error("Error creating order via webhook:", err);
      res.status(500).json({ error: "Order creation failed" });
      return;
    }
  }

  res.json({ received: true });
}
