const express = require('express');

const productRoutes = express.Router();

const productController = require('../controllers/product');

productRoutes.get('/products', productController.getProducts);

productRoutes.post('/product', productController.addProduct);

module.exports = productRoutes;