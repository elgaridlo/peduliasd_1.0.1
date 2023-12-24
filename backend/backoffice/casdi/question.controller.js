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
    .select(
      'cq.id',
      'cq.created_at',
      'cq.updated_at',
      'cq.question',
      'ca.answer',
      'ca.updated_at as answer_updated_at',
    )
    .from('casdi_questions as cq')
    .leftJoin('casdi_answers as ca', 'cq.id', 'ca.question_id')
    .orderBy('cq.created_at', 'desc')
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
    const del = await trx('casdi_questions').where('id', req.body.id).del();

    if (del === 0) {
      return next(new AppError('Pertanyaan tidak ditemukan!', 404));
    }

    res.status(200).json({
      status: 'Pertanyaan berhasil dihapus.',
      data: null,
    });
  });
});
