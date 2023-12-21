const express = require('express');
const {
  getAllArticle,
  createArticle,
  deleteArticle,
  updateArticle,
  getArticleById,
} = require('./article.controller');
const { protect, restrictTo } = require('../../auth/auth.controller');
const router = express.Router();

router
  .route('/')
  .get(getAllArticle)
  .post(protect, restrictTo('admin'), createArticle);
router
  .route('/:id')
  .get(getArticleById)
  .put(protect, restrictTo('admin'), updateArticle)
  .delete(deleteArticle);

module.exports = router;
