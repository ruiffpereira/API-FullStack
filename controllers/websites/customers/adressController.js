const { Address } = require('../../../models');
const { z } = require('zod');

const addressSchema = z.object({
  address: z.string().min(5, 'Morada completa é obrigatória'),
  postalCode: z
    .string()
    .regex(/^\d{4}-\d{3}$/, 'O código postal deve estar no formato 1234-567'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, ' Número de telemóvel inválido'),
  nif: z
    .string()
    .regex(
      /^\d{9}$/,
      'NIF deve ter exatamente 9 dígitos e conter apenas números',
    )
    .min(9, 'NIF deve ter 9 dígitos')
    .max(9, 'NIF deve ter 9 dígitos'),
  addTaxpayer: z.boolean(),
  customerId: z.string().uuid('Invalid customer ID'),
});

// Criar uma nova morada
const createAddress = async (req, res) => {
  try {

    // Verificar se já existe uma morada para o cliente
    const existingAddress = await Address.findOne({ where: { customerId } });

    if (existingAddress) {
      console.log('Address already exists for this customer');
      return res.status(409).json({ error: 'Address already exists for this customer' });
    }

    const { customerId } = req;
    const data = { ...req.body, customerId };

    const validatedData = addressSchema.parse(data);
    await Address.create(validatedData);
    res.status(201).json(validatedData);
  } catch (error) {
    res.status(400).json({ error: 'Validation error', details: error.errors });
  }
};

// Obter todas as moradas do cliente autenticado
const getAddresses = async (req, res) => {
  try {
    const { customerId } = req;
    const addresses = await Address.findAll({ where: { customerId }, attributes: ['addressId', 'address', 'postalCode', 'city', 'phoneNumber', 'nif', 'addTaxpayer'] });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching addresses', details: error.message });
  }
};

// Atualizar uma morada
const updateAddress = async (req, res) => {
  try {
    const { customerId } = req;
    const { addressId } = req.params;

    const data = { ...req.body, customerId };

    const validatedData = addressSchema.parse(data);
    
    const existingAddress = await Address.findOne({ where: { addressId, customerId }, attributes: ['addressId', 'address', 'postalCode', 'city', 'phoneNumber', 'nif', 'addTaxpayer']  });

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    await existingAddress.update(validatedData);
    res.status(200).json(validatedData);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Validation error', details: error.errors });
  }
};

// Deletar uma morada
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { customerId } = req;

    console.log(customerId, addressId);

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
 *   description: Endpoints for managing customer addresses
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Address already exists for this customer
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
 *     summary: Update an address
 *     tags: [Addresses]
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the address to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
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
 *           format: uuid
 *         description: The ID of the address to delete
 *     responses:
 *       204:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Error deleting address
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         addressId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the address
 *         address:
 *           type: string
 *           description: Full address
 *         postalCode:
 *           type: string
 *           description: Postal code in the format 1234-567
 *         city:
 *           type: string
 *           description: City name
 *         phoneNumber:
 *           type: string
 *           description: Phone number in international format
 *         nif:
 *           type: string
 *           description: Taxpayer identification number (9 digits)
 *         addTaxpayer:
 *           type: boolean
 *           description: Indicates if the taxpayer is added
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the customer
 */