const express = require('express');
const {
  createProducts,
  deleteProducts,
  getAllProducts,
  getProductsById,
  updateProducts,
} = require('./product.controller');
const { protect, restrictTo } = require('../../auth/auth.controller');
const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(protect, restrictTo('admin'), createProducts);
router
  .route('/:id')
  .get(getProductsById)
  .put(protect, restrictTo('admin'), updateProducts)
  .delete(protect, restrictTo('admin'), deleteProducts);

module.exports = router;
