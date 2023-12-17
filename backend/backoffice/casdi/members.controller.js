const catchAsync = require('../../utils/catchAsync.helper');
const knex = require('../../config/configuration');
const AppError = require('../../utils/appError');
const { paginations } = require('../../utils/paginations');
const {
  emailValidation,
  phoneValidation,
  nameValidation,
} = require('../../validates/format');

const validationCode = (body) => {
  const pattern = /^[na]-\d{6}$/;
  if (!pattern.test(body.code.toLowerCase()))
    throw new AppError(
      'Kode anggota harus berformat n atau a kemudian - kemudian 6 digit angka.',
      400,
    );
  if (
    (body.is_asd && body.code.toLowerCase().includes('n')) ||
    (!body.is_asd && body.code.toLowerCase().includes('a'))
  )
    throw new AppError('Kode anggota dan kondisi tidak sesuai', 400);
};

const validation = (req) => {
  emailValidation(req.body.email);
  phoneValidation(req.body.phone_no);
  nameValidation(req.body.parent_name);
  nameValidation(req.body.kid_name);
  validationCode(req.body);
};

exports.createMember = catchAsync(async (req, res, next) => {
  const { code, kid_name, parent_name, phone_no, email, is_asd } = req.body;
  if (
    !code ||
    !kid_name ||
    !phone_no ||
    !email ||
    !parent_name ||
    is_asd === undefined
  )
    return next(
      new AppError(
        'Tolong isi kode, nama anak, nama orang tua, no whatsapp, dan email',
        400,
      ),
    );

  validation(req);

  await knex('members').insert({
    ...req.body,
    code: code.toLowerCase(),
    parent_name: parent_name.toLowerCase(),
    kid_name: kid_name.toLowerCase(),
    email: email.toLowerCase(),
  });

  const data = await knex
    .select('*')
    .from('members')
    .where('code', code.toLowerCase());
  res.status(201).json({
    status: 'Success',
    data,
  });
});

// exports.getMemberById = catchAsync(async (req, res, next) => {
//   const product = await knex('products').select().where({ id: req.params.id })

//   if (!product) {
//     return next(new AppError('Product tidak ditemukan', 404))
//   }

//   res.status(200).json({
//     status: 'Success',
//     data: product[0],
//   })
// })

exports.getAllMembers = catchAsync(async (req, res) => {
  const { page, size, skip } = paginations(req.query.page, req.query.size);

  const members = await knex
    .select('*')
    .from('members')
    .orderBy('is_asd', 'code')
    .limit(size)
    .offset(skip);

  res.status(200).json({
    status: 'Success',
    data: members,
    page: {
      rows: members.length,
      size,
      page,
    },
  });
});

// exports.updateProducts = catchAsync(async (req, res, next) => {
//     const updt = await knex('products').where('id', req.params.id)

//     if (updt === 0)
//         return next(new AppError('Program Edukasi tidak ditemukan!', 404));

//     await knex('products').where('id', req.params.id)
//         .update({
//             ...req.body
//         })

//     const updated = await knex('products').where('id', req.params.id)

//     res.status(201).json({
//         status: 'Success',
//         data: updated[0]
//     })
// })

// exports.deleteProducts = catchAsync(async (req, res, next) => {
//     await knex.transaction(async (trx) => {
//         const del = await trx('products').where('id', req.params.id).del()

//         if (del === 0) {
//             return next(new AppError('Product tidak ditemukan!', 404));
//         }

//         res.status(200).json({
//             status: 'Product berhasil dihapus.',
//             data: null
//         })
//     })

// })
