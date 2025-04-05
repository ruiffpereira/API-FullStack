const { Address } = require('../../../models');
const { z } = require('zod');

const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  city: z.string().min(1, 'City is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  nif: z.string().min(9, 'NIF must be at least 9 digits'),
  addTaxpayer: z.boolean(),
  customerId: z.string().uuid('Invalid customer ID'),
});

// Criar uma nova morada
const createAddress = async (req, res) => {
  try {
    const { customerId } = req;
    const data = { ...req.body, customerId };
    const validatedData = addressSchema.parse(data);
    const newAddress = await Address.create(validatedData);
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(400).json({ error: 'Validation error', details: error.errors });
  }
};

// Obter todas as moradas do cliente autenticado
const getAddresses = async (req, res) => {
  try {
    const { customerId } = req;
    const addresses = await Address.findAll({ where: { customerId } });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching addresses', details: error.message });
  }
};

// Atualizar uma morada
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const validatedData = addressSchema.parse(req.body);
    const { customerId } = req;

    const existingAddress = await Address.findOne({ where: { addressId, customerId } });

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await existingAddress.update(validatedData);
    res.status(200).json(existingAddress);
  } catch (error) {
    res.status(400).json({ error: 'Validation error', details: error.errors });
  }
};

// Deletar uma morada
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { customerId } = req;

    const address = await Address.findOne({ where: { addressId, customerId } });

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await address.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting address', details: error.message });
  }
};

module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Endpoints for managing addresses
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
 *         description: Validation error
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
 *       500:
 *         description: Error fetching addresses
 */

/**
 * @swagger
 * /websites/customers/addresses/{addressId}:
 *   put:
 *     summary: Update an address
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
 *       404:
 *         description: Address not found
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /websites/customers/addresses/{addressId}:
 *   delete:
 *     summary: Delete an address
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