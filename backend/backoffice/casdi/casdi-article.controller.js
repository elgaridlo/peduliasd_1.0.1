const catchAsync = require('../../utils/catchAsync.helper');
const knex = require('../../config/configuration');
const AppError = require('../../utils/appError');

exports.createArticleCASDI = catchAsync(async (req, res) => {
  const insert = await knex('casdi_articles').insert({
    ...req.body,
    urlTitle: req.body.title
      .toLowerCase()
      .replace(/[^a-z/0-9]+/g, ' ')
      .replaceAll(' ', '-'),
  });

  const data = await knex
    .select('*')
    .from('casdi_articles')
    .where('id', insert[0]);
  res.status(201).json({
    status: 'Success',
    data,
  });
});

exports.getArticleCASDIById = catchAsync(async (req, res, next) => {
  const article = await knex('casdi_articles')
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

exports.getAllArticleCASDI = catchAsync(async (req, res) => {
  const page = req.query.page * 1 || 1; // || 1 mean the default is 1
  const size = req.query.size * 1 || 100;
  const skip = (page - 1) * size;

  const casdi_articles = await knex
    .select('*')
    .from('casdi_articles')
    .orderBy('id', 'desc')
    .limit(size)
    .offset(skip);

  res.status(200).json({
    status: 'Success',
    data: casdi_articles,
    page: {
      rows: casdi_articles.length,
      size,
      page,
    },
  });
});

exports.updateArticleCASDI = catchAsync(async (req, res, next) => {
  const updt = await knex('casdi_articles').where('id', req.params.id);

  if (updt === 0)
    return next(new AppError('Program Edukasi tidak ditemukan!', 404));

  await knex('casdi_articles')
    .where('id', req.params.id)
    .update({
      ...req.body,
      urlTitle: req.body.title
        .toLowerCase()
        .replace(/[^a-z/0-9]+/g, ' ')
        .replaceAll(' ', '-'),
    });

  const updated = await knex('casdi_articles').where('id', req.params.id);

  res.status(201).json({
    status: 'Success',
    data: updated[0],
  });
});

exports.deleteArticleCASDI = catchAsync(async (req, res, next) => {
  await knex.transaction(async (trx) => {
    const del = await trx('casdi_articles').where('id', req.params.id).del();

    if (del === 0) {
      return next(new AppError('Program Edukasi tidak ditemukan!', 404));
    }

    res.status(200).json({
      status: 'Program Edukasi berhasil dihapus.',
      data: null,
    });
  });
});
