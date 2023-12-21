const catchAsync = require('../../utils/catchAsync.helper');
const knex = require('../../config/configuration');
const AppError = require('../../utils/appError');
const { paginations } = require('../../utils/paginations');
const { isEmptyObject } = require('../../validates/object-validate');

exports.createQuestion = catchAsync(async (req, res, next) => {
  if (isEmptyObject(req.body) || !req.body.question)
    return next(new AppError('Pertanyaan harus diisi', 400));

  const insert = await knex('casdi_questions')
    .returning('id')
    .insert({
      ...req.body,
    });

  const question = await knex
    .select('*')
    .from('casdi_questions')
    .where('id', insert[0]);

  res.status(201).json({
    status: 'success',
    data: question,
  });
});

exports.getAllQuestions = catchAsync(async (req, res) => {
  const { page, size, skip } = paginations(req.query.page, req.query.size);

  const questions = await knex
    .select('*')
    .from('questions')
    .orderBy('created_at')
    .limit(size)
    .offset(skip);

  res.status(200).json({
    status: 'success',
    data: questions,
    page: {
      rows: questions.length,
      size,
      page,
    },
  });
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  await knex.transaction(async (trx) => {
    const del = await trx('casdi_questions').where('id', req.params.id).del();

    if (del === 0) {
      return next(new AppError('Pertanyaan tidak ditemukan!', 404));
    }

    res.status(200).json({
      status: 'Pertanyaan berhasil dihapus.',
      data: null,
    });
  });
});
