const catchAsync = require('../../utils/catchAsync.helper');
const knex = require('../../config/configuration');
const AppError = require('../../utils/appError');

exports.createProducts = catchAsync(async (req, res) => {
  const insert = await knex('products').insert({
    ...req.body,
  });

  const data = await knex.select('*').from('products').where('id', insert[0]);
  res.status(201).json({
    status: 'Success',
    data,
  });
});

exports.getProductsById = catchAsync(async (req, res, next) => {
  const product = await knex('products').select().where({ id: req.params.id });

  if (!product) {
    return next(new AppError('Product tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: product[0],
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const page = req.query.page * 1 || 1; // || 1 mean the default is 1
  const size = req.query.size * 1 || 100;
  const skip = (page - 1) * size;

  const products = await knex
    .select('*')
    .from('products')
    .orderBy('id', 'desc')
    .limit(size)
    .offset(skip);

  res.status(200).json({
    status: 'Success',
    data: products,
    page: {
      rows: products.length,
      size,
      page,
    },
  });
});

exports.updateProducts = catchAsync(async (req, res, next) => {
  const updt = await knex('products').where('id', req.params.id);

  if (updt === 0)
    return next(new AppError('Program Edukasi tidak ditemukan!', 404));

  await knex('products')
    .where('id', req.params.id)
    .update({
      ...req.body,
    });

  const updated = await knex('products').where('id', req.params.id);

  res.status(201).json({
    status: 'Success',
    data: updated[0],
  });
});

exports.deleteProducts = catchAsync(async (req, res, next) => {
  await knex.transaction(async (trx) => {
    const del = await trx('products').where('id', req.params.id).del();

    if (del === 0) {
      return next(new AppError('Product tidak ditemukan!', 404));
    }

    res.status(200).json({
      status: 'Product berhasil dihapus.',
      data: null,
    });
  });
});
