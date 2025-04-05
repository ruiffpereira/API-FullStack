const { Customer, User } = require('../../../models');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const { OAuth2Client } = require('google-auth-library');

// Configurar o cliente OAuth2 do Google
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const validateGoogleToken = async (idToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Verifica se o token foi emitido para o seu cliente
    });

    const payload = ticket.getPayload(); // Informações do usuário
    return payload; // Retorna os dados do usuário (email, name, picture, etc.)
  } catch (error) {
    console.error('Error validating Google ID Token:', error);
    throw new Error('Invalid Google ID Token');
  }
};

const loginCustomerSchema = z.object({
  idToken: z.string(), // ID Token do Google enviado pelo cliente
});

const loginCustomer = async (req, res, next) => {
  try {
    
    const validatedData = loginCustomerSchema.parse(req.body);
    const { idToken } = validatedData;
    
    const ticket = await validateGoogleToken(idToken);

    const user = await User.findOne({
      where: { userId: req.userId }
    });

    if (!user) {
      console.log('User not found for the given website key');
      return res.status(404).json({ error: 'User not found for the given website key' });
    }

    let customer = await Customer.findOne({
      where: {
        userId: user.userId,
        email : ticket.email 
      },
      attributes: ['customerId','name', 'contact', 'email', 'photo']
    });

    if (!customer) {

      customer = await Customer.create({
        email,
        name : name || 'N/A',
        contact: contact || 'N/A',
        photo : image || 'N/A',
        userId: user.userId
      });

      customer = await Customer.findOne({
        where: {
          userId: user.userId,
          email
        },
        attributes: ['customerId','name', 'contact', 'email', 'photo'] 
      });
    }

    // Gerar token JWT
    const token = jwt.sign({customerId: customer.customerId}, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('customer-token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    customer.setDataValue('token', token);

    res.status(200).json(customer);
    next(); // Chama o próximo middleware (NextAuth)

  } catch (error) {
    console.log('Validation error:', error.errors);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error fetching or creating customer:', error);
    res.status(500).json({ error: 'An error occurred while fetching or creating the customer' });
  }
};

module.exports = {
  loginCustomer,
};

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Management of customers
 */


/**
 * @swagger
 * /websites/customerslogin:
 *   post:
 *     summary: Log in or create a customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID Token for authentication
 *     responses:
 *       200:
 *         description: Customer logged in or created successfully
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
 *                 contact:
 *                   type: string
 *                   description: Contact information of the customer
 *                 email:
 *                   type: string
 *                   description: Email of the customer
 *                 photo:
 *                   type: string
 *                   description: Profile image of the customer
 *                 token:
 *                   type: string
 *                   description: JWT token for the customer
 *       400:
 *         description: Validation error or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         description: Field that caused the error
 *                       message:
 *                         type: string
 *                         description: Error message
 *       404:
 *         description: User or email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found for the given website key
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while fetching or creating the customer
 */