const { Cart, CartProduct, Product } = require('../models');

// Adicionar produto ao carrinho
const addProductToCart = async (req, res) => {

  const { productId, quantity } = req.body;
  const { customerId } = req.data;

  try {
    // Converter a quantidade para um número inteiro
    const quantityInt = parseInt(quantity, 10);

    if (isNaN(quantityInt) || quantityInt <= 0) {
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
      // Se o produto já está no carrinho, atualizar a quantidade
      cartProduct.quantity += quantityInt;
      await cartProduct.save();
      console.log('cartProduct:', cartProduct);
    } else {
        // Se o produto não está no carrinho, adicionar um novo item
        await CartProduct.create({
          cartId: cart.cartId,
          productId,
          quantity : quantityInt
        });
    }

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
    
    const formattedCartProducts =  cartProducts.cartProducts.map(cartProduct => {
      return {
        productId: cartProduct.product.productId,
        name: cartProduct.product.name,
        price: cartProduct.product.price,
        photos: cartProduct.product.photos,
        quantity: cartProduct.quantity,
      };
    });


    res.status(200).json(formattedCartProducts);
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'An error occurred while adding the product to the cart' });
  }
};

// Atualizar quantidade de produto no carrinho
const updateProductQuantityInCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { customerId } = req.data;

  try {
    // Converter a quantidade para um número inteiro
    const quantityInt = parseInt(quantity, 10);

    if (isNaN(quantityInt) || quantityInt < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Buscar o carrinho associado ao customerId
    const cart = await Cart.findOne({
      where: { customerId }
    });

    const cartProduct = await CartProduct.findOne({
      where: { cartId: cart.cartId, productId }
    });

    if (!cartProduct) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (quantityInt === 0) {
      // Remover o produto do carrinho se a quantidade for 0
      await cartProduct.destroy();
      return res.status(200).json({ message: 'Product removed from cart' });
    }

    // Atualizar a quantidade do produto no carrinho
    cartProduct.quantity = quantityInt;
    await cartProduct.save();

    res.status(200).json(cartProduct);
  } catch (error) {
    console.error('Error updating product quantity in cart:', error);
    res.status(500).json({ error: 'An error occurred while updating the product quantity in the cart' });
  }
};

// Buscar itens do carrinho
const getCartItems = async (req, res) => {
  const { customerId } = req.data;
  
  try {
    // Verificar se o cliente tem um carrinho
    const cart = await Cart.findOne({
      where: { customerId : customerId }
    });

    if (!cart) {
      cart = await Cart.create({ customerId : customerId  });
    }

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
    
    const formattedCartProducts =  cartProducts.cartProducts.map(cartProduct => {
      return {
        productId: cartProduct.product.productId,
        name: cartProduct.product.name,
        price: cartProduct.product.price,
        photos: cartProduct.product.photos,
        quantity: cartProduct.quantity,
      };
    });

    res.status(200).json(formattedCartProducts);
      
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'An error occurred while fetching the cart items' });
  }
}

module.exports = {
  addProductToCart,
  updateProductQuantityInCart,
  getCartItems,
};