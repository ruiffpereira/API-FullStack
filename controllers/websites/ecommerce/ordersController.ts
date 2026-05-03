import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import {
  Order,
  OrderProduct,
  Cart,
  CartProduct,
  Product,
  Customer,
  Address,
  sequelize,
} from "../../../models";
import {
  ApiError,
  CreateOrderBody,
  IdParams,
} from "../../../src/types/index";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type CartProductWithProduct = CartProduct & { product: Product };
type CartWithProducts = Cart & { cartProducts: CartProductWithProduct[] };

type EmailParams = {
  customer: { name: string; email: string };
  order: { createdAt: Date; price: number };
  products: CartProductWithProduct[];
  shippingAddress: { address: string; postalCode: string; city: string };
  billingAddress: { address: string; postalCode: string; city: string };
};

function buildOrderEmail({
  customer,
  order,
  products,
  shippingAddress,
  billingAddress,
}: EmailParams): string {
  return `
  <div style="font-family: Arial, sans-serif; background: #232326; padding: 20px; margin: 0;">
    <div style="max-width: 600px; margin: 40px auto; background: #f5f5f7; border-radius: 14px; padding: 32px;">
      <div style="background: linear-gradient(90deg, #b71c1c 0%, #232326 100%); padding: 32px 0 24px 0; text-align: center;">
        <h2 style="color: #b71c1c; margin: 0;">Obrigado pela sua compra, ${customer.name}!</h2>
        <p style="color: #232326; font-size: 1.1em; margin: 8px 0 0 0;">A sua encomenda foi efetuada com sucesso.</p>
      </div>
      <div style="padding: 0;">
        <h3 style="color: #b71c1c; margin-top: 0;">Detalhes da Encomenda</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; color: #232326;">
          <li><b>Data:</b> ${new Date(order.createdAt).toLocaleString("pt-PT")}</li>
          <li><b>Total:</b> <span style="color: #b71c1c; font-size: 1.2em;">${order.price.toFixed(2)} €</span></li>
        </ul>
        <div style="display: flex; gap: 32px; margin-bottom: 32px; flex-wrap: wrap;">
          <div style="flex: 1; background: #fff; border-radius: 8px; padding: 16px; min-width: 220px;">
            <h4 style="margin-bottom: 6px; color: #b71c1c;">Morada de Envio</h4>
            <p style="margin: 0; color: #232326;">${shippingAddress.address}<br>${shippingAddress.postalCode} ${shippingAddress.city}</p>
          </div>
          <div style="flex: 1; background: #fff; border-radius: 8px; padding: 16px; min-width: 220px;">
            <h4 style="margin-bottom: 6px; color: #b71c1c;">Morada de Faturação</h4>
            <p style="margin: 0; color: #232326;">${billingAddress.address}<br>${billingAddress.postalCode} ${billingAddress.city}</p>
          </div>
        </div>
        <h3 style="color: #b71c1c;">Produtos</h3>
        <div>
          ${products
            .map(
              (item) => `
            <div style="display: flex; align-items: center; background: #fff; border-radius: 8px; margin-bottom: 16px; padding: 12px 16px;">
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #b71c1c;">${item.product.name}</div>
                <div style="color: #232326; margin-top: 2px;">Quantidade: <b>${item.quantity}</b></div>
                <div style="color: #232326; margin-top: 2px;">Preço: <b style="color: #b71c1c;">${(item.product.price * item.quantity).toFixed(2)} €</b></div>
              </div>
            </div>`,
            )
            .join("")}
        </div>
      </div>
    </div>
  </div>`;
}

export const createPaymentIntent = async (
  req: Request,
  res: Response<{ clientSecret: string | null } | ApiError>,
): Promise<void> => {
  const { customerId } = req;
  try {
    const cart = await Cart.findOne({
      where: { customerId },
      include: [
        {
          model: CartProduct,
          as: "cartProducts",
          include: [{ model: Product, as: "product", attributes: ["price"] }],
        },
      ],
    });
    const typedCart = cart as CartWithProducts | null;
    if (!typedCart || typedCart.cartProducts.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }
    const totalPrice = typedCart.cartProducts.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "eur",
      payment_method_types: ["card"],
      metadata: { customerId: customerId! },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe payment error" });
  }
};

export const createOrder = async (
  req: Request<{}, {}, CreateOrderBody>,
  res: Response,
): Promise<void> => {
  const { shippingAddress, billingAddress } = req.body;
  const { customerId } = req;
  try {
    const [cart, customer, shipping, billing] = await Promise.all([
      Cart.findOne({
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
                attributes: ["productId", "name", "price", "photos"],
              },
            ],
          },
        ],
      }),
      Customer.findOne({
        where: { customerId },
        attributes: ["email", "name", "userId"],
      }),
      Address.findOne({ where: { addressId: shippingAddress, customerId } }),
      Address.findOne({ where: { addressId: billingAddress, customerId } }),
    ]);

    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    const typedCart = cart as CartWithProducts | null;
    if (!typedCart || typedCart.cartProducts.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }
    if (!shipping || !billing) {
      res.status(400).json({ error: "Endereço de envio ou faturação inválido." });
      return;
    }

    const totalPrice = typedCart.cartProducts.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    const transaction = await sequelize.transaction();
    try {
      const newOrder = await Order.create(
        {
          customerId: customerId!,
          userId: customer.userId,
          price: totalPrice,
          shippingAddress,
          billingAddress,
        },
        { transaction },
      );

      const orderProducts = typedCart.cartProducts.map((item) => ({
        orderId: newOrder.orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));
      await OrderProduct.bulkCreate(orderProducts, { transaction });
      await CartProduct.destroy({ where: { cartId: typedCart.cartId }, transaction });
      await transaction.commit();

      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: { user: process.env.EMAIL || "", pass: process.env.PASSWORD || "" },
      });
      const html = buildOrderEmail({
        customer,
        order: newOrder,
        products: typedCart.cartProducts,
        billingAddress: billing,
        shippingAddress: shipping,
      });
      await transporter.sendMail({
        from: `${customer.name} - A equipa da Loja <${process.env.EMAIL}>`,
        to: customer.email,
        bcc: [process.env.EMAIL!],
        subject: "A sua encomenda foi efetuada com sucesso!",
        html,
      });

      res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "An error occurred while creating the order" });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const { customerId } = req;
  try {
    const orders = await Order.findAll({
      where: { customerId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
};

export const getOrderById = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const { customerId } = req;
  const { id } = req.params;
  try {
    const order = await Order.findOne({
      where: { orderId: id, customerId },
      include: [
        {
          model: OrderProduct,
          as: "orderProducts",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["productId", "name", "price", "photos"],
            },
          ],
        },
      ],
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the order" });
  }
};

/**
 * @swagger
 * tags:
 *   name: WebsiteOrders
 *   description: Customer order management and checkout
 */

/**
 * @swagger
 * /websites/ecommerce/orders/payment-intent:
 *   post:
 *     summary: Create a Stripe payment intent for the current cart
 *     tags: [WebsiteOrders]
 *     responses:
 *       200:
 *         description: Payment intent created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *       400:
 *         description: Cart is empty
 *       500:
 *         description: Stripe payment error
 */

/**
 * @swagger
 * /websites/ecommerce/orders:
 *   get:
 *     summary: Get all orders for the authenticated customer
 *     tags: [WebsiteOrders]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error fetching orders
 */

/**
 * @swagger
 * /websites/ecommerce/orders/{id}:
 *   get:
 *     summary: Get an order by ID for the authenticated customer
 *     tags: [WebsiteOrders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details with products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */
