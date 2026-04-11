import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { Customer, User } from "../../../models";
import {
  ApiError,
  CustomerLoginResponse,
  LoginBody,
  RegisterBody,
} from "../../../src/types/index";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  contact: z.string().min(9, { message: "Phone is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const validateGoogleToken = async (idToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

const registerEmail = async (customer: { name: string; email: string }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL || "", pass: process.env.PASSWORD || "" },
    });
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 40px;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; padding: 32px; border: 1px solid #e53935;">
          <h2 style="color: #e53935;">Bem-vindo(a), ${customer.name}!</h2>
          <p style="font-size: 16px; color: #b71c1c;">Obrigado por te registares na nossa plataforma.</p>
          <p style="font-size: 14px; color: #888;">Estamos sempre disponíveis para ti!</p>
          <p style="font-size: 14px; color: #888; margin-top: 32px;">Cumprimentos,<br><b style="color: #e53935;">Equipa Complete Peças Usadas</b></p>
        </div>
      </div>`;
    await transporter.sendMail({
      from: `Complete Peças Usadas <${process.env.EMAIL}>`,
      to: customer.email,
      subject: "Bem-vindo(a) à Complete Peças Usadas!",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending registration email:", error);
  }
};

export const loginCustomer = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
): Promise<void | Response> => {
  try {
    const { provider } = req.body;
    const { userId } = req;

    if (provider === "google") {
      const { idToken } = req.body;
      if (!idToken) return res.status(400).json({ error: "Missing idToken" });
      const ticket = await validateGoogleToken(idToken);
      if (!ticket)
        return res.status(400).json({ error: "Invalid Google token" });

      const user = await User.findOne({ where: { userId } });
      if (!user)
        return res
          .status(404)
          .json({ error: "User not found for the given website key" });

      let customer = await Customer.findOne({
        where: { userId, email: ticket.email },
        attributes: ["customerId", "name", "contact", "email", "photo"],
      });

      if (!customer) {
        customer = await Customer.create({
          email: ticket.email!,
          name: ticket.name || "N/A",
          contact: "N/A",
          photo: ticket.picture || "N/A",
          userId: userId!,
        });
        registerEmail(customer);
      }

      const token = jwt.sign(
        { customerId: customer.customerId },
        process.env.JWT_SECRET as string,
        { expiresIn: "4d" },
      );
      res.cookie("customer-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      customer.setDataValue("token" as any, token);
      return res.status(200).json(customer);
    }

    if (provider === "credentials") {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });

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
      if (!customer)
        return res.status(401).json({ error: "Invalid credentials" });

      const validPassword = await bcrypt.compare(
        password,
        customer.password || "",
      );
      if (!validPassword)
        return res.status(401).json({ error: "Invalid credentials" });

      customer.setDataValue("password" as any, null);
      const token = jwt.sign(
        { customerId: customer.customerId },
        process.env.JWT_SECRET as string,
        { expiresIn: "4d" },
      );
      res.cookie("customer-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      customer.setDataValue("token" as any, token);
      return res.status(200).json(customer);
    }

    return res.status(400).json({ error: "Invalid provider" });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: error.errors });
    console.error("Error fetching or creating customer:", error);
    res.status(500).json({
      error: "An error occurred while fetching or creating the customer",
    });
  }
};

export const registerCustomer = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
): Promise<void | Response> => {
  const { userId } = req;
  try {
    const validated = registerSchema.safeParse(req.body);
    if (!validated.success)
      return res.status(400).json({ error: validated.error.errors });
    const { name, email, password, contact } = validated.data;

    const existingCustomer = await Customer.findOne({
      where: { email, userId },
    });
    if (existingCustomer)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name,
      email,
      contact,
      photo: "N/A",
      password: hashedPassword,
      userId: userId!,
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

/**
 * @swagger
 * tags:
 *   name: CustomerAuth
 *   description: Customer authentication (login and registration)
 */

/**
 * @swagger
 * /websites/customers/autentication/login:
 *   post:
 *     summary: Login a customer (Google or credentials)
 *     tags: [CustomerAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid provider or missing fields
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Error during login
 */

/**
 * @swagger
 * /websites/customers/autentication/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [CustomerAuth]
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
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Error registering customer
 */
