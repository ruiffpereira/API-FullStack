const { Address } = require('../../../models');
const { z } = require('zod');

const addressSchema = z.object({
  address: z.string().min(5, 'Morada completa é obrigatória'),
  defaultAdressFaturation: z.boolean().default(false),
  defaultAdress: z.boolean().default(false),
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
    .max(9, 'NIF deve ter 9 dígitos')
    .default('999999990'),
  addTaxpayer: z.boolean().default(false),
  customerId: z.string().uuid('Invalid customer ID'),
});

// Criar uma nova morada
const createAddress = async (req, res) => {
  try {
    const { customerId } = req;
    const data = { ...req.body, customerId };
    
    // Verificar se o cliente já tem 5 moradas
    const addressCount = await Address.count({ where: { customerId } });
    if (addressCount >= 5) {
      console.log('O cliente já atingiu o limite máximo de5 moradas');
      return res.status(400).json({ error: 'O cliente já atingiu o limite máximo de 5 moradas' });
    }


    if ((data.addTaxpayer || data.defaultAdressFaturation) && !data.nif) {
      console.log('Dados invalidos');
      return res.status(400).json({ error: 'Dados invalidos' });
    }

    const validatedData = addressSchema.parse(data);

    // Garantir que apenas uma morada seja marcada como principal
    if (data.defaultAdress) {
      await Address.update(
        { defaultAdress: false },
        { where: { customerId } }
      );
    }

    // Garantir que apenas uma morada seja marcada como principal
    if (data.defaultAdressFaturation) {
      await Address.update(
        { defaultAdressFaturation: false },
        { where: { customerId } }
      );
    }

    await Address.create(validatedData);

    res.status(201).json(validatedData);
  } catch (error) {
    console.log('Validation error',error);
    res.status(400).json({ error: 'Validation error', details: error.errors });
  }
};

// Obter todas as moradas do cliente autenticado
const getAddresses = async (req, res) => {
  try {
    const { customerId } = req;
    const addresses = await Address.findAll({ where: { customerId }, attributes: ['addressId', 'address', 'postalCode', 'city', 'phoneNumber', 'nif', 'addTaxpayer', "defaultAdress", "defaultAdressFaturation"] });
    
    //console.log('Moradas encontradas:1', addresses);
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
    console.log(validatedData);
    
    const existingAddress = await Address.findOne({ where: { addressId, customerId }, attributes: ['addressId', 'address', 'postalCode', 'city', 'phoneNumber', 'nif', 'addTaxpayer', "defaultAdress", "defaultAdressFaturation"]  });

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Garantir que apenas uma morada seja marcada como principal
    if (validatedData.defaultAdressFaturation) {
      await Address.update(
        { defaultAdressFaturation: false },
        { where: { customerId } }
      );
    }

     // Garantir que apenas uma morada seja marcada como principal
     if (validatedData.defaultAdress) {
      await Address.update(
        { defaultAdress: false },
        { where: { customerId } }
      );
    }
    
    await Address.update(validatedData, { where: { addressId, customerId } });

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
 *     security:
 *       - bearerAuth: [] # Requer autenticação com token
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
 *         description: Validation error or maximum address limit reached
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: O cliente já atingiu o limite máximo de 10 moradas
 *       409:
 *         description: Address already exists for this customer
 */

/**
 * @swagger
 * /websites/customers/addresses:
 *   get:
 *     summary: Get all addresses for the authenticated customer
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: [] # Requer autenticação com token
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error fetching addresses
 */

/**
 * @swagger
 * /websites/customers/addresses/{addressId}:
 *   put:
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: [] # Requer autenticação com token
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Address not found
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation error
 */

/**
 * @swagger
 * /websites/customers/addresses/{addressId}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: [] # Requer autenticação com token
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Address not found
 *       500:
 *         description: Error deleting address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error deleting address
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
 *         defaultAdress:
 *           type: boolean
 *           description: Indicates if this is the default address
 *         defaultAdressFaturation:
 *           type: boolean
 *           description: Indicates if this is the default billing address
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the customer
 *       required:
 *         - address
 *         - postalCode
 *         - city
 *         - phoneNumber
 */