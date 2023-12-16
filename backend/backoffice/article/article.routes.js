const express = require('express');
const { getAllArticle, createArticle, deleteArticle, updateArticle, getArticleById } = require('./article.controller');
const router = express.Router();

router.route('/').get(getAllArticle).post(createArticle);
router.route('/:id').get(getArticleById).put(updateArticle).delete(deleteArticle);

module.exports = router