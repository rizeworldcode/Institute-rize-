const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Admin = require('../models/adminmodel');
const Student = require('../models/studentModel');
const Referred = require('../models/referreledModel');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  // 3) Check if user still exists
  let currentUser;
  if (decoded.role === 'admin') {
    currentUser = await Admin.findById(decoded.id);
  } else if (decoded.role === 'student') {
    currentUser = await Student.findById(decoded.id);
  } else if (decoded.role === 'referrer') {
    currentUser = await Referred.findById(decoded.id);
  }

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued (Optional)
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError('User recently changed password! Please log in again.', 401));
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  req.role = decoded.role;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'student', 'referrer']. role='user'
    if (!roles.includes(req.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
