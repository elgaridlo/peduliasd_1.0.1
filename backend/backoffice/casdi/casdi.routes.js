const express = require('express');
const { getAllMembers, createMember } = require('./members.controller');
// const { createProducts,getAllProducts } = require('./product.controller');
const router = express.Router();

router.route('/members').get(getAllMembers).post(createMember);
// router.route('/appointment').get(getAllProducts).post(createProducts);

module.exports = router