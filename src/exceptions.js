// Error types
// Note: Extending base modules like Error, Array requires babel-plugin-transform-builtin-extend

class RestError extends Error {}

class BadRequestException extends RestError {

  constructor(errors=[], ...params) {
    super(...params);
    this.name = this.constructor.name;
    this._errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  getErrors() {
    // Retuns the collected sub errors
    return this._errors;
  }
};

class HTTPMethodNotAllowed extends RestError {};

class ValidationError extends RestError {};

module.exports = {
  RestError,
  BadRequestException,
  HTTPMethodNotAllowed,
  ValidationError
};
