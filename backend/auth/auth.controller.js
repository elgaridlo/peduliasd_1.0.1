const knex = require('../config/configuration');
const catchAsync = require('../utils/catchAsync.helper');
const bycrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const lodash = require('lodash');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true, // set to true, so the cookie can't be modified or changes in anyway in the browser
  };

  // the cookie will send encrypted to the client
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // await updateWorkshop(user)
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'Success',
    token,
    user,
  });
};

const correctPassword = async (candidatePassword, userPassword) => {
  return await bycrpt.compare(candidatePassword, userPassword);
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) Check if email and password is correct
  const user = await knex
    .select('*')
    .from('auths')
    .where('email', email)
    .first();

  if (!user || !(await correctPassword(password, user.password))) {
    // 401 means unauthorize
    return next(new AppError('Incorrect email or password!', 401));
  }

  // // 3) If everything ok, send the token back to the client
  createSendToken(
    lodash.omit(user, [
      'passwordResetExpired',
      'passwordResetToken',
      'updated_at',
    ]),
    200,
    res,
  );
});

const resetPassword = catchAsync(async (req, res, next) => {
  const update = await knex('auths')
    .where('id', '=', req.params.id)
    .update({
      password: await bycrpt.hash(req.body.password, 12),
      passwordChangedAt: new Date(),
    });

  if (update === 0) {
    return next(new AppError('User tidak ditemukan!', 404));
  }

  res.status(200).json({
    status: 'Success',
    message: 'Password berhasil diganti',
  });
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log('roles = ', roles);
    console.log('req.user = ', req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        // 403 means forbidden
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 2 ) Verification token
  if (!token) {
    return next(
      new AppError('You are not logged in ! Please login to get access.', 401),
    );
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3 ) Check if user still exists
  const currentUser = await knex
    .select('*')
    .from('auths')
    .where('id', decoded.id)
    .first();

  if (!currentUser) {
    return next(
      new AppError(
        'The User belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  req.user = currentUser;
  // GRANT ACCESS TO THE PROTECTED ROUTE
  next();
});

module.exports = { login, protect, restrictTo, resetPassword };
