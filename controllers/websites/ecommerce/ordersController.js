const {
  Order,
  OrderProduct,
  Cart,
  CartProduct,
  Product,
  Customer,
  Address,
} = require("../../../models");
const nodemailer = require("nodemailer");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Função para gerar o HTML do email
function buildOrderEmail({
  customer,
  order,
  products,
  shippingAddress,
  billingAddress,
}) {
  return `
  <div style="font-family: Arial, sans-serif; background: #232326; padding: 20px; margin: 0;">
    <style>
      @media only screen and (max-width: 600px) {
        .email-container { padding: 8px !important; }
        .product-card { flex-direction: column !important; align-items: flex-start !important; }
        .product-img { margin-bottom: 8px !important; }
      }
    </style>
    <div class="email-container" style="max-width: 600px; margin: 40px auto; background: #f5f5f7; border-radius: 14px; box-shadow: 0 4px 32px #0003; overflow: hidden; padding: 32px;">
      <div style="background: linear-gradient(90deg, #b71c1c 0%, #232326 100%); padding: 32px 0 24px 0; text-align: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Loja" style="width: 72px; margin-bottom: 12px;" />
        <h2 style="color: #b71c1c; margin: 0;">Obrigado pela sua compra, ${customer.name}!</h2>
        <p style="color: #232326; font-size: 1.1em; margin: 8px 0 0 0;">
          A sua encomenda foi efetuada com sucesso.
        </p>
      </div>
      <div style="padding: 0;">
        <h3 style="color: #b71c1c; margin-top: 0;">Detalhes da Encomenda</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; color: #232326;">
          <li><b>Data:</b> ${new Date(order.createdAt).toLocaleString("pt-PT")}</li>
          <li><b>Total:</b> <span style="color: #b71c1c; font-size: 1.2em;">${order.price.toFixed(2)} €</span></li>
        </ul>
        <div style="display: flex; gap: 32px; margin-bottom: 32px; flex-wrap: wrap;">
          <div style="flex: 1; background: #fff; border-radius: 8px; padding: 16px; min-width: 220px; margin-right: 16px;">
            <h4 style="margin-bottom: 6px; color: #b71c1c;">Morada de Envio</h4>
            <p style="margin: 0 0 8px 0; color: #232326;">
              ${shippingAddress.address}<br>
              ${shippingAddress.postalCode} ${shippingAddress.city}
            </p>
          </div>
          <div style="flex: 1; background: #fff; border-radius: 8px; padding: 16px; min-width: 220px;">
            <h4 style="margin-bottom: 6px; color: #b71c1c;">Morada de Faturação</h4>
            <p style="margin: 0 0 8px 0; color: #232326;">
              ${billingAddress.address}<br>
              ${billingAddress.postalCode} ${billingAddress.city}
            </p>
          </div>
        </div>
        <h3 style="color: #b71c1c;">Produtos</h3>
        <div>
          ${products
            .map(
              (item) => `
              <div class="product-card" style="display: flex; align-items: center; background: #fff; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 2px 8px #0001; padding: 12px 16px;">
                <div class="product-img" style="flex-shrink: 0; margin-right: 18px;">
                  ${
                    item.product.photos && item.product.photos.length > 0
                      ? `<img src="${process.env.API_URL}${item.product.photos[0].slice(1)}" alt="${item.product.name}" style="width:56px; height:56px; object-fit:cover; border-radius: 6px; box-shadow: 0 2px 8px #b71c1c22;" />`
                      : `<span style="color: #bbb; font-size: 13px;">(sem imagem)</span>`
                  }
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 500; color: #b71c1c; font-size: 1.08em;">${item.product.name}</div>
                  <div style="color: #232326; margin-top: 2px;">Quantidade: <b>${item.quantity}</b></div>
                  <div style="color: #232326; margin-top: 2px;">Preço: <b style="color: #b71c1c;">${(item.product.price * item.quantity).toFixed(2)} €</b></div>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
        <div style="margin-top: 40px; text-align: center;">
          <p style="font-size: 1.1em; color: #b71c1c;">Se tiver alguma dúvida, estamos ao seu dispor.</p>
          <p style="color: #232326; font-size: 1.05em; margin-top: 18px;">
            <b>Com os melhores cumprimentos,<br>A equipa da Loja</b>
          </p>
        </div>
      </div>
    </div>
  </div>
  `;
}

// Endpoint para criar PaymentIntent Stripe
const createPaymentIntent = async (req, res) => {
  const { customerId, paymentMethod = "card" } = req;
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

    if (!cart || !cart.cartProducts || cart.cartProducts.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalPrice = cart.cartProducts.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Adapta para MB WAY ou cartão
    let paymentIntent;
    if (paymentMethod === "mb_way") {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: "eur",
        payment_method_types: ["mb_way"],
        metadata: { customerId },
      });
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: "eur",
        payment_method_types: ["card"],
        metadata: { customerId },
      });
    }

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe payment error" });
  }
};

// Endpoint para criar encomenda (chamado pelo webhook Stripe após pagamento)
const createOrder = async (req, res) => {
  const { shippingAddress, billingAddress } = req.body;
  const { customerId } = req;

  try {
    // Buscar o carrinho do cliente e incluir os produtos
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
              attributes: ["productId", "name", "price", "photos"],
            },
          ],
        },
      ],
    });

    const customer = await Customer.findOne({
      where: { customerId },
      attributes: ["email", "name"],
    });

    const userId = await Customer.findOne({
      where: { customerId },
      attributes: ["userId"],
    });

    // Buscar os dados completos das moradas
    const shipping = await Address.findOne({
      where: { addressId: shippingAddress, customerId },
    });
    const billing = await Address.findOne({
      where: { addressId: billingAddress, customerId },
    });

    if (!userId) {
      return res.status(404).json({ error: "Customer not found" });
    }

    if (!cart || !cart.cartProducts || cart.cartProducts.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!shipping || !billing) {
      return res
        .status(400)
        .json({ error: "Endereço de envio ou faturação inválido." });
    }

    // Calcular o preço total
    const totalPrice = cart.cartProducts.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Criar a encomenda
    const newOrder = await Order.create({
      customerId,
      userId: userId.userId,
      price: totalPrice,
      shippingAddress,
      billingAddress,
    });

    // Criar os itens da encomenda
    const orderProducts = cart.cartProducts.map((item) => ({
      orderId: newOrder.orderId,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
    }));

    const createdOrderProducts = await OrderProduct.bulkCreate(orderProducts);

    if (!createdOrderProducts || createdOrderProducts.length === 0) {
      return res.status(500).json({ error: "Failed to create order products" });
    }

    // Limpar o carrinho
    await CartProduct.destroy({ where: { cartId: cart.cartId } });

    // Enviar email de confirmação
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL || "",
        pass: process.env.PASSWORD || "",
      },
    });

    const html = buildOrderEmail({
      customer,
      order: newOrder,
      products: cart.cartProducts,
      billingAddress: billing,
      shippingAddress: shipping,
    });

    await transporter.sendMail({
      from: `${customer.name} - A equipa da Loja <${process.env.EMAIL}>`,
      to: customer.email,
      bcc: [process.env.EMAIL, "joaosousa.9@hotmail.com"],
      subject: "A sua encomenda foi efetuada com sucesso!",
      html,
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
};

const getOrders = async (req, res) => {
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

const getOrderById = async (req, res) => {
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
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the order" });
  }
};

module.exports = {
  createOrder,
  createPaymentIntent,
  getOrders,
  getOrderById,
};

/**
 * @swagger
 * /websites/ecommerce/orders/payment-intent:
 *   post:
 *     summary: Cria um PaymentIntent Stripe para o pagamento da encomenda (cartão ou MB WAY)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID do cliente
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, mb_way]
 *                 description: Método de pagamento (card ou mb_way)
 *             required:
 *               - customerId
 *     responses:
 *       200:
 *         description: PaymentIntent criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *                   description: Stripe client secret
 *       400:
 *         description: Carrinho vazio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cart is empty
 *       500:
 *         description: Erro ao criar PaymentIntent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Stripe payment error
 */

/**
 * @swagger
 * /websites/ecommerce/orders:
 *   post:
 *     summary: Cria uma nova encomenda após pagamento Stripe confirmado (chamado pelo webhook)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID do cliente
 *               shippingAddress:
 *                 type: string
 *                 description: ID da morada de envio
 *               billingAddress:
 *                 type: string
 *                 description: ID da morada de faturação
 *     responses:
 *       201:
 *         description: Encomenda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Carrinho vazio ou morada inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Customer not found
 *       500:
 *         description: Erro ao criar encomenda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while creating the order
 */

/**
 * @swagger
 * /websites/ecommerce/orders:
 *   get:
 *     summary: Lista todas as encomendas do cliente autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de encomendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erro ao obter encomendas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while fetching orders
 */

/**
 * @swagger
 * /websites/ecommerce/orders/{id}:
 *   get:
 *     summary: Obtém uma encomenda específica pelo ID para o cliente autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da encomenda
 *     responses:
 *       200:
 *         description: Detalhes da encomenda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Encomenda não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Erro ao obter encomenda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while fetching the order
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the order
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the customer
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         price:
 *           type: number
 *           format: float
 *           description: Total price of the order
 *         shippingAddress:
 *           type: string
 *           description: Shipping address ID
 *         billingAddress:
 *           type: string
 *           description: Billing address ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order was last updated
 */
