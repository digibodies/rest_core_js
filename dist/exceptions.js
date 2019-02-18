"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

// Error types
// Note: Extending base modules like Error, Array requires babel-plugin-transform-builtin-extend

var RestError = function (_extendableBuiltin2) {
  _inherits(RestError, _extendableBuiltin2);

  function RestError() {
    _classCallCheck(this, RestError);

    return _possibleConstructorReturn(this, (RestError.__proto__ || Object.getPrototypeOf(RestError)).apply(this, arguments));
  }

  return RestError;
}(_extendableBuiltin(Error));

var BadRequestException = function (_RestError) {
  _inherits(BadRequestException, _RestError);

  function BadRequestException() {
    var _ref;

    var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, BadRequestException);

    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var _this2 = _possibleConstructorReturn(this, (_ref = BadRequestException.__proto__ || Object.getPrototypeOf(BadRequestException)).call.apply(_ref, [this].concat(params)));

    _this2.name = _this2.constructor.name;
    _this2._errors = errors;
    Error.captureStackTrace(_this2, _this2.constructor);
    return _this2;
  }

  _createClass(BadRequestException, [{
    key: "getErrors",
    value: function getErrors() {
      // Retuns the collected sub errors
      return this._errors;
    }
  }]);

  return BadRequestException;
}(RestError);

var HTTPMethodNotAllowed = function (_RestError2) {
  _inherits(HTTPMethodNotAllowed, _RestError2);

  function HTTPMethodNotAllowed() {
    _classCallCheck(this, HTTPMethodNotAllowed);

    return _possibleConstructorReturn(this, (HTTPMethodNotAllowed.__proto__ || Object.getPrototypeOf(HTTPMethodNotAllowed)).apply(this, arguments));
  }

  return HTTPMethodNotAllowed;
}(RestError);

var ValidationError = function (_RestError3) {
  _inherits(ValidationError, _RestError3);

  function ValidationError() {
    _classCallCheck(this, ValidationError);

    return _possibleConstructorReturn(this, (ValidationError.__proto__ || Object.getPrototypeOf(ValidationError)).apply(this, arguments));
  }

  return ValidationError;
}(RestError);

module.exports = {
  RestError: RestError,
  BadRequestException: BadRequestException,
  HTTPMethodNotAllowed: HTTPMethodNotAllowed,
  ValidationError: ValidationError
};