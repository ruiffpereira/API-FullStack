const { BankCard } = require('../../../models');

const { z } = require('zod');

const bankCardSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be at least 16 digits'),
  expirationDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiration date must be in MM/YY format'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits').max(4, 'CVV must be at most 4 digits'),
  customerId: z.string().uuid('Invalid customer ID'),
});

// Criar um novo cartão bancário
const createBankCard = async (req, res) => {
  try {
    const validatedData = bankCardSchema.parse(req.body);
    const bankCard = await BankCard.create(validatedData);
    res.status(201).json(bankCard);
  } catch (error) {
    res.status(400).json({ error: 'Validation error', details: error.errors });
  }
};

// Obter todos os cartões bancários do cliente autenticado
const getBankCards = async (req, res) => {
  try {
    const { customerId } = req;
    const bankCards = await BankCard.findAll({ where: { customerId } });
    res.status(200).json(bankCards);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bank cards', details: error.message });
  }
};

// Atualizar um cartão bancário
const updateBankCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const validatedData = bankCardSchema.parse(req.body);
    const { customerId } = req;

    const bankCard = await BankCard.findOne({ where: { cardId, customerId } });

    if (!bankCard) {
      return res.status(404).json({ error: 'Bank card not found' });
    }

    await bankCard.update(validatedData);
    res.status(200).json(bankCard);
  } catch (error) {
    res.status(400).json({ error: 'Validation error', details: error.errors });
  }
};

// Deletar um cartão bancário
const deleteBankCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { customerId } = req;

    const bankCard = await BankCard.findOne({ where: { cardId, customerId } });

    if (!bankCard) {
      return res.status(404).json({ error: 'Bank card not found' });
    }

    await bankCard.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting bank card', details: error.message });
  }
};

module.exports = {
  createBankCard,
  getBankCards,
  updateBankCard,
  deleteBankCard,
};

/**
 * @swagger
 * tags:
 *   name: BankCards
 *   description: Endpoints for managing bank cards
 */

/**
 * @swagger
 * /websites/customers/bankcards:
 *   post:
 *     summary: Create a new bank card
 *     tags: [BankCards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 description: Card number
 *               expirationDate:
 *                 type: string
 *                 description: Expiration date of the card
 *               cvv:
 *                 type: string
 *                 description: CVV of the card
 *               customerId:
 *                 type: string
 *                 description: ID of the customer
 *     responses:
 *       201:
 *         description: Bank card created successfully
 *       400:
 *         description: Error creating bank card
 */

/**
 * @swagger
 * /websites/customers/bankcards/customer/{customerId}:
 *   get:
 *     summary: Get all bank cards for a customer
 *     tags: [BankCards]
 *     parameters:
 *       - name: customerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: List of bank cards
 *       500:
 *         description: Error fetching bank cards
 */

/**
 * @swagger
 * /websites/customers/bankcards/{cardId}:
 *   put:
 *     summary: Update a bank card
 *     tags: [BankCards]
 *     parameters:
 *       - name: cardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bank card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardNumber:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *               cvv:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bank card updated successfully
 *       404:
 *         description: Bank card not found
 *       400:
 *         description: Error updating bank card
 */

/**
 * @swagger
 * /websites/customers/bankcards/{cardId}:
 *   delete:
 *     summary: Delete a bank card
 *     tags: [BankCards]
 *     parameters:
 *       - name: cardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bank card
 *     responses:
 *       204:
 *         description: Bank card deleted successfully
 *       404:
 *         description: Bank card not found
 *       500:
 *         description: Error deleting bank card
 */