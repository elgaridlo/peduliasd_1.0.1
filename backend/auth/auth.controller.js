
const jwt = require('jsonwebtoken');
const knex = require('../config/configuration')
const catchAsync = require('../utils/catchAsync.helper')
const bycrpt = require('bcryptjs');
const AppError = require('../utils/appError');
const lodash = require('lodash')


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = async (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
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
        user
    });
};

const correctPassword = async (
    candidatePassword,
    userPassword
) => {
    return await bycrpt.compare(candidatePassword, userPassword);
};

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exists
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    // 2) Check if email and password is correct
    const user = await knex.select('*').from('auths').where('email', email).first()

    if (!user || !(await correctPassword(password, user.password))) {
        // 401 means unauthorize
        return next(new AppError('Incorrect email or password!', 401));
    }

    // // 3) If everything ok, send the token back to the client
    createSendToken(lodash.omit(user, ['passwordResetExpired','passwordResetToken','updated_at']), 200, res);
});

const resetPassword = catchAsync(async (req, res, next) => {
    const update = await knex('auths').where('id', '=', req.params.id)
    .update({
      password: await bycrpt.hash(req.body.password,12),
      passwordChangedAt: new Date()
    })

    if(update === 0) {
        return next(new AppError('User tidak ditemukan!', 404));
    }
    
    res.status(200).json({
        status: 'Success',
        message:'Password berhasil diganti'
    })
})

const restrictTo = (...roles) => (req, res, next) => {
    // roles['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
        return next(
            // 403 means forbidden
            new AppError('You do not have permission to perform this action', 403)
        );
    }
    next();
};

module.exports = { login, restrictTo, resetPassword }