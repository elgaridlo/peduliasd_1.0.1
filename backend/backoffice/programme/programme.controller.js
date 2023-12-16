const catchAsync = require('../../utils/catchAsync.helper')
const knex = require('../../config/configuration')
const AppError = require('../../utils/appError');

exports.createProgrammes = catchAsync(async (req, res, next) => {
  const insert = await knex('programmes')
    .insert({
      ...req.body
    })

  const data = await knex.select('*').from('programmes').where('id', insert[0])
  res.status(201).json({
    status: 'Success',
    data
  })
})

exports.getProgrammesById = catchAsync(async (req, res, next) => {
  const programmes = await knex('programmes').select().where({ id: req.params.id })

  if (!programmes) {
    return next(new AppError('Kegiatan tidak ditemukan', 404))
  }

  res.status(200).json({
    status: 'Success',
    data: programmes[0],
  })
})

exports.getAllProgrammes = catchAsync(async (req, res, next) => {

  const page = req.query.page * 1 || 1; // || 1 mean the default is 1
  const size = req.query.size * 1 || 100;
  const skip = (page - 1) * size;

  const programmes = await knex.select('*')
    .from('programmes').orderBy('id', 'desc').limit(size).offset(skip)

  res.status(200).json({
    status: 'Success',
    data: programmes,
    page: {
      rows: programmes.length,
      size,
      page
    }
  })
})

exports.deleteProgrammes = catchAsync(async (req, res, next) => {
  await knex.transaction(async (trx) => {
    const del = await trx('programmes').where('id', req.params.id).del()
  
    if (del === 0) {
      return next(new AppError('Kegiatan tidak ditemukan!', 404));
    }

    res.status(200).json({
      status: 'Kegitan berhasil dihapus.',
      data: null
    })    
  })

})