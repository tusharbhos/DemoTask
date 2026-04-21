const { validationResult } = require('express-validator');
const { error } = require('../utils/responseHelper');

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().reduce((acc, err) => {
      acc[err.path] = err.msg;
      return acc;
    }, {});
    return error(res, 'Validation failed', 422, errors);
  }
  next();
};

module.exports = validate;
