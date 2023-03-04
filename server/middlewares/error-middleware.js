const ApiError = require('../exceptions/api-error');

module.exports = function(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  res.status(500).json(`Something strange with ${err.message}`);
}
