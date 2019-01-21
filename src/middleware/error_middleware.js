// Error Middleware for Sane REST Friendly error handling

var rest_exceptions = require('../exceptions');
var core_exceptions = require('core').exceptions;

const errorMiddleware = (err, req, res, next) => {
  let status;
  let messages = [err.message];

  if(err instanceof core_exceptions.DoesNotExistException) {
    // server404
    status = 404;
  }
  else if (err instanceof rest_exceptions.BadRequestException) {
    // serveError 400
    status = 400;

    // Handle Sub Errors
    const errors = err.getErrors();
    if (errors.length > 0) {
      errors.forEach((subErr) => {
        messages.push(subErr.message);
      });
    }
  }
  else if (err instanceof core_exceptions.AuthenticationException) {
    // serveError 401
    status = 401;
  }
  else if (err instanceof core_exceptions.PermissionException) {
    // serveError 403
    status = 403;
  }
  else if (err instanceof rest_exceptions.HTTPMethodNotAllowed) {
    // serveError 405
    status = 405;
  }
  else if (err instanceof core_exceptions.ConflictException) {
    // serveError 409
    status = 409;
  }
  else {
    // serveError 500
    status = 500;
  }

  // Serve the error payload
  res.status(status).json({
    status: status,
    results: err.stack.split('\n'),
    messages: messages
  });

  // Call the next handler for logging, etc
  next(err);
};

module.exports = errorMiddleware;
