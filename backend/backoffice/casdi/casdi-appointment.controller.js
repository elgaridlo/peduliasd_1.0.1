const catchAsync = require('../../utils/catchAsync.helper');
const knex = require('../../config/configuration');
const AppError = require('../../utils/appError');
const { startOfDay } = require('date-fns');
const { durations } = require('./helper');
const stringify = require('csv-stringify');

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
    code_member: appointment_date.toUpperCase(),
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

exports.getHourMember = catchAsync(async (req, res, next) => {
  const { appointment_date } = req.body;
  if (!appointment_date)
    return next(new AppError('Tolong isi jadwal kunjungan', 400));

  const appoints = await knex
    .select('*')
    .from('casdi_appointments')
    .where('appointment_date', appointment_date);

  const hourExist = appoints.map((item) => item.duration);
  const filtered = durations.filter((item) => !hourExist.includes(item));

  res.status(200).json({
    status: 'Success',
    data: filtered,
  });
});

exports.downloadCasdi = catchAsync(async (req, res) => {
  const appoints = await knex
    .select(
      'phone_no',
      'code_member',
      'appointment_date',
      'kid_name',
      'is_asd',
      'parent_name',
      'email',
      'duration',
      'casdi_appointments.created_at',
    )
    .from('casdi_appointments')
    .innerJoin('members', 'members.code', 'casdi_appointments.code_member');

  const formattedAppoints = appoints.map((appoint) => {
    return {
      code_member: appoint.code_member,
      duration: appoint.duration,
      appointment_date: new Date(appoint.appointment_date).toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      ),
      kid_name: appoint.kid_name,
      is_asd: appoint.is_asd ? 'ASD' : 'NON ASD',
      parent_name: appoint.parent_name,
      phone_no: appoint.phone_no,
      email: appoint.email,
      created_at: new Date(appoint.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    };
  });

  stringify.stringify(formattedAppoints, { header: true }, (err, output) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Mengirimkan file CSV sebagai respons HTTP
    res.attachment('janji_temu.csv');
    res.send(output);
  });
});
