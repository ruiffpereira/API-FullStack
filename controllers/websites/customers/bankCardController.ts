import { Request, Response } from "express";
import { z } from "zod";
import { BankCard } from "../../../models";
import { ApiError, BankCardBody, BankCardResponse, CardIdParams } from "../../../src/types/index";

const bankCardSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").max(19),
  expirationDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Expiration date must be in MM/YY format"),
  customerId: z.string().uuid("Invalid customer ID"),
});

export const createBankCard = async (
  req: Request<{}, {}, BankCardBody>,
  res: Response<BankCardResponse | ApiError>,
): Promise<void> => {
  try {
    const validatedData = bankCardSchema.parse(req.body);
    const lastFourDigits = validatedData.cardNumber.slice(-4);
    const bankCard = await BankCard.create({
      lastFourDigits,
      expirationDate: validatedData.expirationDate,
      customerId: validatedData.customerId,
    });
    res.status(201).json({
      cardId: bankCard.cardId,
      lastFourDigits: bankCard.lastFourDigits,
      expirationDate: bankCard.expirationDate,
      customerId: bankCard.customerId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error" });
      return;
    }
    res.status(500).json({ error: "Error creating bank card" });
  }
};

export const getBankCards = async (
  req: Request,
  res: Response<BankCardResponse[] | ApiError>,
): Promise<void> => {
  try {
    const { customerId } = req;
    const bankCards = await BankCard.findAll({
      where: { customerId },
      attributes: ["cardId", "lastFourDigits", "expirationDate", "customerId"],
    });
    res.status(200).json(bankCards as unknown as BankCardResponse[]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bank cards" });
  }
};

export const updateBankCard = async (
  req: Request<CardIdParams, {}, BankCardBody>,
  res: Response<BankCardResponse | ApiError>,
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
    const lastFourDigits = validatedData.cardNumber.slice(-4);
    await bankCard.update({ lastFourDigits, expirationDate: validatedData.expirationDate });
    res.status(200).json({
      cardId: bankCard.cardId,
      lastFourDigits: bankCard.lastFourDigits,
      expirationDate: bankCard.expirationDate,
      customerId: bankCard.customerId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error" });
      return;
    }
    res.status(500).json({ error: "Error updating bank card" });
  }
};

export const deleteBankCard = async (
  req: Request<CardIdParams>,
  res: Response<ApiError | void>,
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
    res.status(500).json({ error: "Error deleting bank card" });
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
