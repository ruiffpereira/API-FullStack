const { Product, Cart, CartProduct} = require('../../../models');

const calculateCartTotals = async (cart) => {
  
    const cartProducts = await Cart.findOne({
      where: { cartId: cart.cartId }, // Filtrar pelo cartId
      attributes: [],
      include: [
        {
          model: CartProduct, // Incluir os itens do carrinho
          as: 'cartProducts',
          attributes: ['quantity'],
          include: [
            {
              model: Product, // Incluir os detalhes dos produtos
              as: 'product',
              attributes: ['productId', 'name', 'price', 'photos'], // Selecionar os campos desejados
            },
          ],
        },
      ],
      order: [
        // Ordenar os produtos pelo nome em ordem crescente
        [{ model: CartProduct, as: 'cartProducts' }, { model: Product, as: 'product' }, 'name', 'ASC'],
      ],
    });
  
    let shipPrice = 0; // Inicializar o valor de shipPrice
    const products = cartProducts.cartProducts.map(cartProduct => {
  
      const productPrice = parseFloat(cartProduct.product.price); // Garantir que o preço seja um número
      const quantity = cartProduct.quantity;
  
      // Calcular o preço total para este produto e adicionar ao shipPrice
      shipPrice += productPrice * quantity;
  
      return {
        productId: cartProduct.product.productId,
        name: cartProduct.product.name,
        price: cartProduct.product.price,
        photos: cartProduct.product.photos,
        quantity: cartProduct.quantity,
      };
    });

    return { products, shipPrice };
};

// Adicionar produto ao carrinho
const addProductToCart = async (req, res) => {

const { productId, quantity } = req.body;
const { customerId } = req;

  try {
    console.log('productId:', productId);
      console.log('quantity:', quantity);
      // Converter a quantidade para um número inteiro
      const quantityInt = parseInt(quantity, 10);

      if (isNaN(quantityInt)) {
      return res.status(400).json({ error: 'Invalid quantity' });
      }

      // Verificar se o cliente já tem um carrinho
      let cart = await Cart.findOne({
      where: { customerId : customerId }
      });

      // Se o cliente não tem um carrinho, criar um novo carrinho
      if (!cart) {
      cart = await Cart.create({ customerId : customerId  });
      }

      // Verificar se o produto já está no carrinho
      let cartProduct = await CartProduct.findOne({
      where: { cartId: cart.cartId, productId }
      });

      

      if (cartProduct) {
      // Se o produto já está no carrinho
      if (quantityInt === -1) {
          // Remover o produto do carrinho independentemente da quantidade
          await cartProduct.destroy();

      } else if (quantityInt === 0) {
          // Diminuir a quantidade do produto no carrinho
          if (cartProduct.quantity > 1) {
          cartProduct.quantity -= 1;
          await cartProduct.save();
          } else {
          // Se a quantidade for 1, remover o produto
          await cartProduct.destroy()
          }
      } else if (quantityInt === 1) {
          // Adicionar mais um do produto ao carrinho
          cartProduct.quantity += 1;
          await cartProduct.save();
      } else {
          return res.status(400).json({ error: 'Invalid quantity operation' });
      }
      } else {
      // Se o produto não está no carrinho
      if (quantityInt === 1) {
          // Adicionar o produto ao carrinho com quantidade inicial de 1
          await CartProduct.create({
          cartId: cart.cartId,
          productId,
          quantity: 1,
          });

      } else {
          return res.status(400).json({ error: 'Invalid operation for a product not in the cart' });
      }
      }

      const cartUpdated = await calculateCartTotals(cart);

      res.status(200).json({cartId: cart.cartId, custormerId: cart.customerId, products: cartUpdated.products,  shipPrice: cartUpdated.shipPrice});

  } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ error: 'An error occurred while adding the product to the cart' });
  }

};

// Buscar itens do carrinho
const getCartItems = async (req, res) => {
  
  const { customerId } = req;

  try {
      // Verificar se o cliente tem um carrinho
      const cart = await Cart.findOne({
        where: { customerId }
      });

      if (!cart) {
      cart = await Cart.create({ customerId  });
      }

      const cartUpdated = await calculateCartTotals(cart);

      res.status(200).json({cartId: cart.cartId, custormerId: cart.customerId, products: cartUpdated.products,  shipPrice: cartUpdated.shipPrice});
      
  } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'An error occurred while fetching the cart items' });
  }
}

module.exports = {
addProductToCart,
getCartItems,
};

/**
 * @swagger
 * tags:
 *   name: Website
 *   description: Management of website products and cart
 */


/**
 * @swagger
 * /websites/ecommerce/carts:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Website]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - productId
 *              - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product to add
 *     responses:
 *       200:
 *         description: Product added to the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartId:
 *                   type: string
 *                   description: ID of the cart
 *                 customerId:
 *                   type: string
 *                   description: ID of the customer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 shipPrice:
 *                   type: number
 *                   description: Total price of the cart
 *       400:
 *         description: Invalid quantity or operation
 *       500:
 *         description: Error adding product to the cart
 */

/**
 * @swagger
 * /websites/ecommerce/carts:
 *   get:
 *     summary: Get all items in the cart
 *     tags: [Website]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         description: Secret key for the website
 *     responses:
 *       200:
 *         description: List of items in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - products
 *                 - cartId
 *                 - customerId
 *                 - shipPrice
 *               properties:
 *                 cartId:
 *                   type: string
 *                   description: ID of the cart
 *                 customerId:
 *                   type: string
 *                   description: ID of the customer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 shipPrice:
 *                   type: number
 *                   description: Total price of the cart
 *                 quantity:
 *                   type: number
 *                   description: Total price of the cart
 *       404:
 *         description: Cart not found for the customer
 *       500:
 *         description: Error fetching cart items
 */