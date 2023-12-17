const express = require('express');
const {
  createProducts,
  deleteProducts,
  getAllProducts,
  getProductsById,
  updateProducts,
} = require('./product.controller');
const router = express.Router();

router.route('/').get(getAllProducts).post(createProducts);
router
  .route('/:id')
  .get(getProductsById)
  .put(updateProducts)
  .delete(deleteProducts);

module.exports = router;
