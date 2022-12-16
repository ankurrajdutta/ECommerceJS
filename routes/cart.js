const express = require('express');

const cartRoutes = express.Router();

const cartController= require('../controllers/cart');

cartRoutes.get('/cart', cartController.getCartItems);

cartRoutes.post('/cart', cartController.addToCart);

cartRoutes.post('/cart-delete/:productId', cartController.removeFromCart);

module.exports= cartRoutes;