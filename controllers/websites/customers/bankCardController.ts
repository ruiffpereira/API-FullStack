import { Request, Response } from "express";
import { z } from "zod";
import { BankCard } from "../../../models";
import {
  ApiError,
  BankCardBody,
  BankCardResponse,
  CardIdParams,
} from "../../../src/types/index";

const bankCardSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  expirationDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Expiration date must be in MM/YY format"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits"),
  customerId: z.string().uuid("Invalid customer ID"),
});

export const createBankCard = async (
  req: Request<{}, {}, BankCardBody>,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = bankCardSchema.parse(req.body);
    const bankCard = await BankCard.create(validatedData);
    res.status(201).json(bankCard);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Validation error", details: (error as any).errors });
  }
};

export const getBankCards = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { customerId } = req;
    const bankCards = await BankCard.findAll({ where: { customerId } });
    res.status(200).json(bankCards);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching bank cards",
      details: (error as Error).message,
    });
  }
};

export const updateBankCard = async (
  req: Request<CardIdParams, {}, BankCardBody>,
  res: Response,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const validatedData = bankCardSchema.parse(req.body);
    const { customerId } = req;
    const bankCard = await BankCard.findOne({ where: { cardId, customerId } });
    if (!bankCard) {
      res.status(404).json({ error: "Bank card not found" });
      return;
    }
    await bankCard.update(validatedData);
    res.status(200).json(bankCard);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Validation error", details: (error as any).errors });
  }
};

export const deleteBankCard = async (
  req: Request<CardIdParams>,
  res: Response,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const { customerId } = req;
    const bankCard = await BankCard.findOne({ where: { cardId, customerId } });
    if (!bankCard) {
      res.status(404).json({ error: "Bank card not found" });
      return;
    }
    await bankCard.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: "Error deleting bank card",
      details: (error as Error).message,
    });
  }
};

/**
 * @swagger
 * tags:
 *   name: BankCards
 *   description: Management of customer bank cards
 */

/**
 * @swagger
 * /websites/customers/bankcards:
 *   post:
 *     summary: Add a new bank card
 *     tags: [BankCards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankCard'
 *     responses:
 *       201:
 *         description: Bank card created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /websites/customers/bankcards:
 *   get:
 *     summary: Get all bank cards for the authenticated customer
 *     tags: [BankCards]
 *     responses:
 *       200:
 *         description: List of bank cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BankCard'
 *       500:
 *         description: Error fetching bank cards
 */

/**
 * @swagger
 * /websites/customers/bankcards/{cardId}:
 *   put:
 *     summary: Update a bank card by ID
 *     tags: [BankCards]
 *     parameters:
 *       - name: cardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankCard'
 *     responses:
 *       200:
 *         description: Bank card updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Bank card not found
 */

/**
 * @swagger
 * /websites/customers/bankcards/{cardId}:
 *   delete:
 *     summary: Delete a bank card by ID
 *     tags: [BankCards]
 *     parameters:
 *       - name: cardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Bank card deleted successfully
 *       404:
 *         description: Bank card not found
 *       500:
 *         description: Error deleting bank card
 */
