const appError = require('../utils/appError');

/**
 *
 * @param {string} email
 * Digunakan untuk memvalidasi format email
 */
exports.emailValidation = (email) => {
  const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!pattern.test(email)) throw new appError('Email tidak sesuai', 400);
};

/**
 *
 * @param {string} phone
 * memvalidasi format phone number dengan awalan 08 dan memiliki 8 sampai 11 digit setelah 08
 */
exports.phoneValidation = (phone) => {
  const pattern = /^08\d{8,11}$/;
  if (!pattern.test(phone))
    throw new appError(
      'Nomor telpon harus terdiri angka berawalan dengan 08 dan 8 sampai 11 digit dibelakang.',
      400,
    );
};

/**
 *
 * @param {string} name
 * memvalidasi format phone number dengan awalan 08 dan memiliki 8 sampai 11 digit setelah 08
 */
exports.nameValidation = (name) => {
  const pattern = /^[a-zA-Z\s]+$/;
  if (!pattern.test(name))
    throw new appError('Nama harus terdiri dari huruf', 400);
};
