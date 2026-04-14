import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  User,
  Permission,
  UserPermission,
  Category,
  Customer,
  Cart,
  Product,
  sequelize,
} from "../../../models";
import {
  ApiError,
  ApiMessage,
  LoginResponse,
  LoginUserBody,
  RegisterUserBody,
  UpdateUserBody,
  UserIdParams,
  UserResponse,
} from "../../../src/types/index";

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_SECRET_PUBLIC = process.env.JWT_SECRET_PUBLIC as string;
const environment = process.env.ENVIROMENT;

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Permission,
          as: "permissions",
          attributes: ["permissionId", "name"],
          through: { attributes: [] },
        },
      ],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching Users:", error);
    res.status(500).json({ error: "An error occurred while fetching Users" });
  }
};

export const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
): Promise<void | Response> => {
  try {
    const { name, email, permissionId, password } = req.body;
    const text = "SELECT * FROM Users WHERE email = :email";
    if (!email || !password || !name || !permissionId) {
      return res.status(400).json({ error: "Invalid Fields" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const transaction = await sequelize.transaction();
    try {
      const user = await User.create(
        { email, password: hashedPassword, name },
        { transaction },
      );
      const secretkeysite = jwt.sign(
        { userId: user.userId },
        JWT_SECRET_PUBLIC,
      );
      user.secretkeysite = secretkeysite;
      await user.save({ transaction });
      await UserPermission.create(
        { userId: user.dataValues.userId, permissionId },
        { transaction },
      );
      await transaction.commit();
      return res.status(201).json({ user });
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "User creation failed" });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response<LoginResponse | ApiError>,
): Promise<void | Response> => {
  console.log("Login request body:", req.body);
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { name: username } });
    if (!user) return res.status(404).json({ error: "Incorrect Data!" });

    if (environment !== "DEV") {
      if (!password || !user.password) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      userId: user.userId,
      username: user.name,
      email: user.email,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error test" });
  }
};

export const updateUser = async (
  req: Request<{}, {}, UpdateUserBody>,
  res: Response,
): Promise<void | Response> => {
  const { userId, name, email, password, permissionId, secretkeysite } =
    req.body;
  try {
    const transaction = await sequelize.transaction();
    try {
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: "User not found" });
      }
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (secretkeysite) {
        user.secretkeysite = jwt.sign(
          { userId: user.userId },
          JWT_SECRET_PUBLIC,
        );
      }
      await user.save({ transaction });
      if (permissionId) {
        await UserPermission.update(
          { permissionId },
          { where: { userId }, transaction },
        );
      }
      await transaction.commit();
      return res.json({
        message: "User updated successfully",
        user,
        ...(secretkeysite && { newSecretKey: user.secretkeysite }),
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating user or permissions:", error);
      return res.status(500).json({ error: "User update failed" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
};

export const deleteUser = async (
  req: Request<UserIdParams>,
  res: Response<ApiMessage | ApiError>,
): Promise<void | Response> => {
  const { userId } = req.params;
  res.status(500).json({ error: "An error occurred while deleting the user" });
  try {
    const transaction = await sequelize.transaction();
    try {
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: "User not found" });
      }
      const customers = await Customer.findAll({
        where: { userId },
        transaction,
      });
      const customerIds = customers.map((c) => c.customerId);
      if (customerIds.length > 0) {
        await Cart.destroy({
          where: { customerId: customerIds },
          force: true,
          transaction,
        });
      }
      await Customer.destroy({ where: { userId }, force: true, transaction });
      await Category.destroy({ where: { userId }, force: true, transaction });
      await Product.destroy({ where: { userId }, force: true, transaction });
      await UserPermission.destroy({
        where: { userId },
        force: true,
        transaction,
      });
      await User.destroy({ where: { userId }, force: true, transaction });
      await transaction.commit();
      return res.json({ message: "User deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting user or permissions:", error);
      return res.status(500).json({ error: "User deletion failed" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Management of backoffice users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error fetching users
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, permissionId]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               permissionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid fields
 *       500:
 *         description: User creation failed
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns accessToken
 *       404:
 *         description: Incorrect data
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               permissionId:
 *                 type: string
 *               secretkeysite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: User update failed
 */

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: User deletion failed
 */
