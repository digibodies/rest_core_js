'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Core Handler Middleware
var Joi = require('joi');
var restErrors = require('./exceptions');

var rootHandler = function rootHandler(paramSchema, dataSchema) {

  var inner = function inner(req, res, next) {
    var raw_params = _objectWithoutProperties(req.query, []);

    var _Joi$validate = Joi.validate(raw_params, paramSchema),
        error = _Joi$validate.error,
        value = _Joi$validate.value;

    if (error) {
      throw new restErrors.BadRequestException(error);
    }

    // Set the cleaned params on the request for later use
    req.cleaned_params = value;

    // Clean the data
    req.cleaned_data = {};

    // Only post/put allow bodies...
    var hasBody = Object.keys(req.body).length > 0;

    if (!(req.method.toLowerCase() == 'post' || req.method == 'put') && hasBody) {
      throw new restErrors.BadRequestException('Body is not allowed for HTTP method : ' + req.method);
    }

    if (req.method.toLowerCase() == 'post' || req.method == 'put') {

      var finalSchema = {};
      var validationErrors = [];

      // Collect Validation errors and bundle as part of the 400 error
      dataSchema.forEach(function (field) {
        try {
          finalSchema[field._name] = field.to_resource(req.body);
        } catch (e) {
          validationErrors.push(e);
        }
      });

      if (validationErrors.length > 0) {
        var err = new restErrors.BadRequestException(validationErrors, 'Invalid body');
        throw err;
      }

      req.cleaned_data = finalSchema;
    }

    next();
  };
  return inner;
};

module.exports = rootHandler;