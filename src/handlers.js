// Core Handler Middleware
const Joi = require('joi');
const restErrors = require('./exceptions');

let rootHandler = function(paramSchema, dataSchema) {

  let inner = function(req, res, next) {
    let {...raw_params} = req.query;
    const {error, value} = Joi.validate(raw_params, paramSchema);

    if (error) {
      throw new restErrors.BadRequestException(error);
    }

    // Set the cleaned params on the request for later use
    req.cleaned_params = value;

    // Clean the data
    req.cleaned_data = {};

    // Only post/put allow bodies...
    let hasBody = Object.keys(req.body).length > 0;

    if (!(req.method.toLowerCase() == 'post' || req.method == 'put') && hasBody) {
      throw new restErrors.BadRequestException('Body is not allowed for HTTP method : ' + req.method);
    }

    if ((req.method.toLowerCase() == 'post' || req.method == 'put')) {

      let finalSchema = {};
      let validationErrors = [];

      dataSchema.forEach(field => {
        try {
          finalSchema[field._name] = field.to_resource(req.body);
        } catch(e) {
          validationErrors.push(e);
        }
      });

      if (validationErrors.length > 0) {
        let err = new restErrors.BadRequestException(validationErrors, 'Invalid body');
        console.log(err);
        throw err;
      }

      req.cleaned_data = finalSchema;
    }

    next();
  };
  return inner;
};


module.exports = rootHandler;
