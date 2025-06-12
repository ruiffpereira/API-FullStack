const { Customer, User } = require("../../../models");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const { OAuth2Client } = require("google-auth-library");

// Configurar o cliente OAuth2 do Google
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  contact: z.string().min(9, { message: "Phone is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const validateGoogleToken = async (idToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Verifica se o token foi emitido para o seu cliente
    });

    const payload = ticket.getPayload(); // Informações do usuário
    return payload; // Retorna os dados do usuário (email, name, picture, etc.)
  } catch (error) {
    console.error("Error validating Google ID Token:", error);
    throw new Error("Invalid Google ID Token");
  }
};

const registerEmail = async (customer) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL || "",
        pass: process.env.PASSWORD || "",
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9;   padding: 40px;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(255,0,0,0.08); padding: 32px; border: 1px solid #e53935;">
          <h2 style="color: #e53935;">Bem-vindo(a), ${customer.name}!</h2>
          <p style="font-size: 16px; color: #b71c1c;">
            Obrigado por te registares na nossa plataforma.<br>
            Estamos muito felizes por te ter connosco!
          </p>
          <p style="font-size: 15px; color: #d32f2f;">
            A partir de agora podes aceder à tua conta, consultar os teus dados e aproveitar todas as funcionalidades do nosso serviço.
          </p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e57373;">
          <p style="font-size: 14px; color: #888;">
            Se tiveres alguma dúvida ou precisares de ajuda, responde a este email.<br>
            Estamos sempre disponíveis para ti!
          </p>
          <p style="font-size: 14px; color: #888; margin-top: 32px;">
            Cumprimentos,<br>
            <b style="color: #e53935;">Equipa Complete Peças Usadas</b>
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `Complete Peças Usadas <${process.env.EMAIL}>`,
      to: customer.email,
      subject: "Bem-vindo(a) à Complete Peças Usadas!",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw new Error("Failed to send registration email");
  }
};

const loginCustomer = async (req, res, next) => {
  try {
    const { provider } = req.body;
    const { userId } = req;

    if (provider === "google") {
      // --- GOOGLE LOGIN (já tens) ---
      const { idToken } = req.body;
      const ticket = await validateGoogleToken(idToken);

      const user = await User.findOne({ where: { userId } });
      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found for the given website key" });
      }

      let customer = await Customer.findOne({
        where: { userId, email: ticket.email },
        attributes: ["customerId", "name", "contact", "email", "photo"],
      });

      if (!customer) {
        customer = await Customer.create({
          email: ticket.email,
          name: ticket.name || "N/A",
          contact: "N/A",
          photo: ticket.picture || "N/A",
          userId,
        });
        registerEmail(customer);
      }

      const token = jwt.sign(
        { customerId: customer.customerId },
        process.env.JWT_SECRET,
        { expiresIn: "4d" }
      );
      res.cookie("customer-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      customer.setDataValue("token", token);

      return res.status(200).json(customer);
    }

    // --- CREDENTIALS LOGIN ---
    if (provider === "credentials") {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
      }

      // Procura o utilizador pelo email
      const customer = await Customer.findOne({
        where: { email },
        attributes: [
          "customerId",
          "name",
          "contact",
          "email",
          "photo",
          "password",
        ],
      });

      if (!customer) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verifica a password
      const validPassword = await bcrypt.compare(password, customer.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Remove o campo password do objeto retornado
      customer.setDataValue("password", undefined);

      const token = jwt.sign(
        { customerId: customer.customerId },
        process.env.JWT_SECRET,
        { expiresIn: "4d" }
      );

      res.cookie("customer-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      customer.setDataValue("token", token);

      return res.status(200).json(customer);
    }

    // Se provider não for válido
    return res.status(400).json({ error: "Invalid provider" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error fetching or creating customer:", error);
    res.status(500).json({
      error: "An error occurred while fetching or creating the customer",
    });
  }
};

const registerCustomer = async (req, res) => {
  const { userId } = req;
  try {
    const validated = registerSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.errors });
    }
    const { name, email, password, contact } = validated.data;

    // Verifica se já existe
    const existingCustomer = await Customer.findOne({
      where: { email, userId },
    });
    if (existingCustomer) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //Cria o customer associado
    const customer = await Customer.create({
      name,
      email,
      contact,
      photo: "N/A",
      password: hashedPassword,
      userId: userId,
    });

    registerEmail(customer);

    res.status(201).json("Customer registered successfully");
  } catch (error) {
    console.error("Error registering customer:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the customer" });
  }
};

module.exports = {
  loginCustomer,
  registerCustomer,
};

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Management of customers
 */

/**
 * @swagger
 * /websites/customers/autentication/login:
 *   post:
 *     summary: Login or create a customer (Google or credentials)
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             GoogleLogin:
 *               summary: Google login
 *               value:
 *                 provider: google
 *                 idToken: "GOOGLE_ID_TOKEN"
 *             CredentialsLogin:
 *               summary: Credentials login
 *               value:
 *                 provider: credentials
 *                 email: "user@email.com"
 *                 password: "mypassword"
 *     responses:
 *       200:
 *         description: Customer logged in or created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customerId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 contact:
 *                   type: string
 *                 email:
 *                   type: string
 *                 photo:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   oneOf:
 *                     - type: string
 *                     - type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           path:
 *                             type: string
 *                           message:
 *                             type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 *       404:
 *         description: User or email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found for the given website key
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while fetching or creating the customer
 */

/**
 * @swagger
 * /websites/customers/autentication/register:
 *   post:
 *     summary: Register a new customer (credentials only)
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, contact]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
