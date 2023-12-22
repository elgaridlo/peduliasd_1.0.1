const catchAsync = require('../../utils/catchAsync.helper');
const knex = require('../../config/configuration');
const AppError = require('../../utils/appError');
const { isEmptyObject } = require('../../validates/object-validate');

exports.createEditAnswer = catchAsync(async (req, res, next) => {
  const { answer, question_id } = req.body;
  if (isEmptyObject(req.body) || !answer)
    return next(new AppError('Jawaban harus diisi', 400));

  if (!question_id)
    return next(new AppError('Isi pertanyaan yang akan dijawab.', 400));

  const isAnswerExist = await knex
    .select('*')
    .from('casdi_answers')
    .where('question_id', question_id)
    .first();

  if (isAnswerExist) {
    await knex('casdi_answers').where('question_id', question_id).update({
      answer,
      updated_at: new Date(),
    });

    const select = await knex
      .select('*')
      .from('casdi_answers')
      .where('question_id', question_id)
      .first();

    res.status(200).json({
      status: 'success',
      data: select,
    });
  } else {
    const insert = await knex('casdi_answers')
      .returning('id')
      .insert({
        ...req.body,
      });

    const response = await knex
      .select('*')
      .from('casdi_answers')
      .where('id', insert[0])
      .first();

    res.status(201).json({
      status: 'success',
      data: response,
    });
  }
});

exports.deleteAnswer = catchAsync(async (req, res, next) => {
  await knex.transaction(async (trx) => {
    const del = await trx('casdi_answers').where('id', req.body.id).del();

    if (del === 0) {
      return next(new AppError('Jawaban tidak ditemukan!', 404));
    }

    res.status(200).json({
      status: 'Jawaban berhasil dihapus.',
      data: null,
    });
  });
});
