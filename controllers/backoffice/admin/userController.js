const {
  User,
  Permission,
  UserPermission,
  Category,
  Customer,
  sequelize,
  Cart,
  Product,
} = require("../../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_PUBLIC = process.env.JWT_SECRET_PUBLIC;
require("dotenv").config();
const environment = process.env.ENVIROMENT;

// Retorna todas as permissões
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Exclui o campo 'password'
      include: [
        {
          model: Permission,
          as: "permissions",
          attributes: ["permissionId", "name"],
          through: { attributes: [] },
        },
      ],
    });
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching Users:", error);
    res.status(500).json({ error: "An error occurred while fetching Users" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, permissionId, password } = req.body;

    if (!email || !password || !name || !permissionId) {
      return res.status(400).json({ error: "Invalid Fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Iniciar uma transação para garantir atomicidade
    const transaction = await sequelize.transaction();

    try {
      // Criar o usuário
      const user = await User.create(
        { email, password: hashedPassword, name },
        { transaction }
      );

      const secretkeysite = jwt.sign(
        { userId: user.userId },
        JWT_SECRET_PUBLIC
      );

      user.secretkeysite = secretkeysite;

      await user.save({ transaction });

      // Atribuir a permissão ao usuário
      await UserPermission.create(
        { userId: user.dataValues.userId, permissionId },
        { transaction }
      );

      // Confirmar a transação
      await transaction.commit();

      return res.status(201).json({ user: user });
    } catch (error) {
      await transaction.rollback();
      // Logar o erro para depuração
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "User creation failed" });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { name: username },
    });

    if (!user) {
      return res.status(404).json({ error: "Incorrect Data!" });
    }

    if (environment !== "DEV") {
      // Verificar se a senha e o hash estão presentes
      if (!password || !user.password) {
        console.log("Password and hash are required");
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Invalid email or password");
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }

    // Gerar token JWT
    const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // // Segurança de Cookies
    // res.cookie("user-token", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    // });

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

const updateUser = async (req, res) => {
  const { userId, name, email, password, permissionId, secretkeysite } =
    req.body;

  try {
    // Iniciar uma transação para garantir atomicidade
    const transaction = await sequelize.transaction();

    try {
      // Encontrar o usuário pelo ID
      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: "User not found" });
      }

      // Atualizar os dados do usuário
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);

      // Verificar se um novo token deve ser gerado
      if (secretkeysite) {
        const secretkeysite = jwt.sign(
          { userId: user.userId },
          JWT_SECRET_PUBLIC
        );
        user.secretkeysite = secretkeysite;
      }

      // Salvar as alterações no usuário
      await user.save({ transaction });

      // Atualizar as permissões do usuário
      if (permissionId) {
        // Atualizar o campo permissionId na tabela UserPermission
        await UserPermission.update(
          { permissionId },
          { where: { userId }, transaction }
        );
      }

      // Confirmar a transação
      await transaction.commit();

      return res.json({
        message: "User updated successfully",
        user,
        ...(secretkeysite && { newSecretKey: user.secretkeysite }), // Retorna o novo token, se gerado
      });
    } catch (error) {
      // Reverter a transação em caso de erro
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

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  res.status(500).json({ error: "An error occurred while deleting the user" });
  try {
    // Iniciar uma transação para garantir atomicidade
    const transaction = await sequelize.transaction();

    try {
      // Encontrar o usuário pelo ID
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

      // Apaga todos os carts desses customers
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
      // Reverter a transação em caso de erro
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

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Management of users
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *               permissionId:
 *                 type: string
 *                 description: ID of the permission to assign to the user
 *               secretkeysite:
 *                 type: string
 *                 description: Secret key for the site
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid fields
 *       500:
 *         description: Error registering user
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Name of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: ID of the user
 *                 username:
 *                   type: string
 *                   description: Username of the user
 *                 email:
 *                   type: string
 *                   description: Email of the user
 *                 accessToken:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Password and hash are required
 *       401:
 *         description: Invalid email or password
 *       404:
 *         description: Incorrect data
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
 *                 description: ID of the user to update
 *               name:
 *                 type: string
 *                 description: Updated name of the user
 *               email:
 *                 type: string
 *                 description: Updated email of the user
 *               password:
 *                 type: string
 *                 description: Updated password of the user
 *               permissionId:
 *                 type: string
 *                 description: Updated permission ID
 *               secretkeysite:
 *                 type: string
 *                 description: Updated secret key for the site
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
