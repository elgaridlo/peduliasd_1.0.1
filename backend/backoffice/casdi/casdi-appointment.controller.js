const catchAsync = require('../../utils/catchAsync.helper');
const knex = require('../../config/configuration');
const AppError = require('../../utils/appError');
const { startOfDay } = require('date-fns');
const { durations } = require('./helper');

const appointmentDateValidate = (body) => {
  const { appointment_date, duration } = body;
  if (appointment_date < startOfDay(new Date()))
    throw new AppError('Tanggal tidak boleh kurang dari tanggal sekarang.');

  if (!durations.includes(duration))
    throw new AppError('Jam kunjungan tidak sesuai.');
};
const durationValidate = (duration) => {
  if (!durations.includes(duration))
    throw new AppError('Durasi tidak dikenali.');
};

const logicDB = async (body) => {
  const code_member = body.code_member.toLowerCase();
  const { appointment_date, duration } = body;
  const exists = await knex
    .select('*')
    .from('casdi_appointments')
    .where('code_member', code_member);

  if (exists.length > 0)
    throw new AppError('Anggota sudah pernah melakukan kunjungan.');

  const appointment_exist = await knex
    .select('*')
    .from('members')
    .where('code', code_member);

  if (appointment_exist.length === 0)
    throw new AppError('Anggota tidak terdaftar.');

  const durationAllReadyExist = await knex
    .select('*')
    .from('casdi_appointments')
    .where('duration', duration)
    .andWhere('appointment_date', appointment_date);

  if (durationAllReadyExist.length > 0)
    throw new AppError('Jadwal kunjungan sudah terisi.');
};

const validating = async (req) => {
  appointmentDateValidate(req.body);
  await logicDB(req.body);
  durationValidate(req.body.duration);
};

exports.createAppointment = catchAsync(async (req, res, next) => {
  const { code_member, appointment_date, duration } = req.body;
  if (!code_member || !appointment_date || !duration)
    return next(
      new AppError(
        'Tolong isi kode anggota, jadwal kunjungan, dan jam kunjungan',
        400,
      ),
    );

  await validating(req);
  await knex('casdi_appointments').insert({
    ...req.body,
  });

  const data = await knex
    .select('*')
    .from('casdi_appointments')
    .where('code_member', code_member);
  res.status(201).json({
    status: 'Success',
    data,
  });
});
