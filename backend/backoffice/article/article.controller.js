const catchAsync = require('../../utils/catchAsync.helper');
const knex = require('../../config/configuration');
const AppError = require('../../utils/appError');

exports.createArticle = catchAsync(async (req, res) => {
  const insert = await knex('articles').insert({
    ...req.body,
    urlTitle: req.body.title
      .toLowerCase()
      .replace(/[^a-z/0-9]+/g, ' ')
      .replaceAll(' ', '-'),
  });

  const data = await knex.select('*').from('articles').where('id', insert[0]);
  res.status(201).json({
    status: 'Success',
    data,
  });
});

exports.getArticleById = catchAsync(async (req, res, next) => {
  const article = await knex('articles')
    .select()
    .where({ urlTitle: req.params.id });

  if (!article) {
    return next(new AppError('Artikel tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: article[0],
  });
});

exports.getAllArticle = catchAsync(async (req, res) => {
  const page = req.query.page * 1 || 1; // || 1 mean the default is 1
  const size = req.query.size * 1 || 100;
  const skip = (page - 1) * size;

  const articles = await knex
    .select('*')
    .from('articles')
    .orderBy('id', 'desc')
    .limit(size)
    .offset(skip);

  res.status(200).json({
    status: 'Success',
    data: articles,
    page: {
      rows: articles.length,
      size,
      page,
    },
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const updt = await knex('articles').where('urlTitle', req.params.id);

  if (updt === 0)
    return next(new AppError('Program Edukasi tidak ditemukan!', 404));

  await knex('articles')
    .where('urlTitle', req.params.id)
    .update({
      ...req.body,
      urlTitle: req.body.title
        .toLowerCase()
        .replace(/[^a-z/0-9]+/g, ' ')
        .replaceAll(' ', '-'),
    });

  const updated = await knex('articles').where('urlTitle', req.params.id);

  res.status(201).json({
    status: 'Success',
    data: updated[0],
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  await knex.transaction(async (trx) => {
    const del = await trx('articles').where('id', req.params.id).del();

    if (del === 0) {
      return next(new AppError('Program Edukasi tidak ditemukan!', 404));
    }

    res.status(200).json({
      status: 'Program Edukasi berhasil dihapus.',
      data: null,
    });
  });
});
