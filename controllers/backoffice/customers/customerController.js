
const { Customer } = require('../../../models');
const jwt = require('jsonwebtoken');

const getAllCustomers = async (req, res) => {
  try {
    const user = req.user;
    const customers = await Customer.findAndCountAll({
      where: { userId: user }
    });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'An error occurred while fetching customers' });
  }
};
const getCustomerById = async (req, res) => {
  try {
    const userId = req.user; // Supondo que o ID do usuário autenticado está em req.user
    const customer = await Customer.findOne({
      where: {
        customerId: req.params.id, // Substitua "customerId" pelo nome correto do campo no modelo
        userId: userId, // Garante que o cliente pertence ao usuário autenticado
      },
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'An error occurred while fetching the customer' });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
};

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Endpoints for managing customers
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers for the authenticated user
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: [] # Indica que o endpoint requer autenticação com token
 *     responses:
 *       200:
 *         description: List of customers for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of customers
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: string
 *                         description: ID of the customer
 *                       name:
 *                         type: string
 *                         description: Name of the customer
 *                       email:
 *                         type: string
 *                         description: Email of the customer
 *                       contact:
 *                         type: string
 *                         description: Contact information of the customer
 *       500:
 *         description: Error fetching customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while fetching customers
 */

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a specific customer by ID for the authenticated user
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: [] # Indica que o endpoint requer autenticação com token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the customer to retrieve
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customerId:
 *                   type: string
 *                   description: ID of the customer
 *                 name:
 *                   type: string
 *                   description: Name of the customer
 *                 email:
 *                   type: string
 *                   description: Email of the customer
 *                 contact:
 *                   type: string
 *                   description: Contact information of the customer
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Customer not found
 *       500:
 *         description: Error fetching the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while fetching the customer
 */