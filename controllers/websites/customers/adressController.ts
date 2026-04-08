import { Request, Response } from "express";
import { z } from "zod";
import { Address } from "../../../models";

interface AddressBody {
  address: string;
  defaultAdressFaturation?: boolean;
  defaultAdress?: boolean;
  postalCode: string;
  city: string;
  phoneNumber: string;
  nif?: string;
  addTaxpayer?: boolean;
}

interface AddressParams {
  addressId: string;
}

const addressSchema = z.object({
  address: z.string().min(5, "Morada completa é obrigatória"),
  defaultAdressFaturation: z.boolean().default(false),
  defaultAdress: z.boolean().default(false),
  postalCode: z
    .string()
    .regex(/^\d{4}-\d{3}$/, "O código postal deve estar no formato 1234-567"),
  city: z.string().min(1, "Cidade é obrigatória"),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, " Número de telemóvel inválido"),
  nif: z
    .string()
    .regex(/^\d{9}$/, "NIF deve ter exatamente 9 dígitos")
    .min(9)
    .max(9)
    .default("999999990"),
  addTaxpayer: z.boolean().default(false),
  customerId: z.string().uuid("Invalid customer ID"),
});

export const createAddress = async (
  req: Request<{}, {}, AddressBody>,
  res: Response,
): Promise<void> => {
  try {
    const { customerId } = req;
    const data = { ...req.body, customerId };
    const addressCount = await Address.count({ where: { customerId } });
    if (addressCount >= 5)
      return res
        .status(400)
        .json({ error: "O cliente já atingiu o limite máximo de 5 moradas" });
    if ((data.addTaxpayer || data.defaultAdressFaturation) && !data.nif)
      return res.status(400).json({ error: "Dados invalidos" });
    const validatedData = addressSchema.parse(data);
    if (data.defaultAdress)
      await Address.update({ defaultAdress: false }, { where: { customerId } });
    if (data.defaultAdressFaturation)
      await Address.update(
        { defaultAdressFaturation: false },
        { where: { customerId } },
      );
    await Address.create(validatedData);
    res.status(201).json(validatedData);
  } catch (error) {
    console.log("Validation error", error);
    res
      .status(400)
      .json({ error: "Validation error", details: (error as any).errors });
  }
};

export const getAddresses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { customerId } = req;
    const addresses = await Address.findAll({
      where: { customerId },
      attributes: [
        "addressId",
        "address",
        "postalCode",
        "city",
        "phoneNumber",
        "nif",
        "addTaxpayer",
        "defaultAdress",
        "defaultAdressFaturation",
      ],
    });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching addresses",
      details: (error as Error).message,
    });
  }
};

export const updateAddress = async (
  req: Request<AddressParams, {}, AddressBody>,
  res: Response,
): Promise<void> => {
  try {
    const { customerId } = req;
    const { addressId } = req.params;
    const data = { ...req.body, customerId };
    const validatedData = addressSchema.parse(data);
    const existingAddress = await Address.findOne({
      where: { addressId, customerId },
    });
    if (!existingAddress)
      return res.status(404).json({ error: "Address not found" });
    if (validatedData.defaultAdressFaturation)
      await Address.update(
        { defaultAdressFaturation: false },
        { where: { customerId } },
      );
    if (validatedData.defaultAdress)
      await Address.update({ defaultAdress: false }, { where: { customerId } });
    await Address.update(validatedData, { where: { addressId, customerId } });
    res.status(200).json(validatedData);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ error: "Validation error", details: (error as any).errors });
  }
};

export const deleteAddress = async (
  req: Request<AddressParams>,
  res: Response,
): Promise<void> => {
  try {
    const { addressId } = req.params;
    const { customerId } = req;
    const address = await Address.findOne({ where: { addressId, customerId } });
    if (!address) return res.status(404).json({ error: "Address not found" });
    await address.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: "Error deleting address",
      details: (error as Error).message,
    });
  }
};

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Management of customer addresses
 */

/**
 * @swagger
 * /websites/customers/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Validation error or limit of 5 addresses reached
 *       500:
 *         description: Error creating address
 */

/**
 * @swagger
 * /websites/customers/addresses:
 *   get:
 *     summary: Get all addresses for the authenticated customer
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       500:
 *         description: Error fetching addresses
 */

/**
 * @swagger
 * /websites/customers/addresses/{addressId}:
 *   put:
 *     summary: Update an address by ID
 *     tags: [Addresses]
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Address not found
 */

/**
 * @swagger
 * /websites/customers/addresses/{addressId}:
 *   delete:
 *     summary: Delete an address by ID
 *     tags: [Addresses]
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Error deleting address
 */
