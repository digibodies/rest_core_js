// Simple Lightweight Resource Model
const Joi = require('joi');
const {ValidationError} = require('./exceptions');

const Resource = (obj, fields, explicitResourceType) => {
  let resource = {obj: null, fields: [], errors: [], cleaned_data: []};

  // TODO: This is pythonic way to check for empty object... convert to js
  if (!obj) { obj = null; }

  if (obj == null || !(typeof obj === 'object')) {
    throw Error('First argument to Resource should be object, received ' + obj);
  }
  resource.obj = obj;

  // Dumps a rest Resource to a json friendly return values
  resource.to_dict = (verbose=false) => {
    let result = {};

    let obj = resource.obj;
    if (!obj || obj == {}) {
      return result;
    }

    // Determine Resource Kind
    let resourceType = 'UNDEFINED_KIND';
    if (explicitResourceType) {
      resourceType = explicitResourceType;
    }
    else if (obj.kind && obj.kind !== '') {
      resourceType = obj.kind;
    }

    result['_meta'] = {is_verbose: false, resource_type: resourceType};

    // TODO: Set the resource_id for the resource

    // Keep track of if we excluded antything because of verbose, etc
    let has_excluded_fields = false;

    fields.forEach((field) => {
      if (!field.verbose_only || verbose) {
        result[field._name] = field.from_resource(obj);
      }
      else {
        has_excluded_fields = true;
      }
    });

    // Update meta
    result['_meta'].is_verbose = !has_excluded_fields;
    return result;
  };

  return resource;
};

class RestField {
  constructor(name, kwargs) {

    this._name = name;
    this._fieldType = kwargs['type'];
    this._validator = kwargs['validator'];
    this._default = kwargs['default'];
    this._repeated = kwargs['repeated'] || false;
    this._required = kwargs['required'] || false;
  }

  // This is passed in
  default() {
    return this._default || null;
  }

  validate(val) {
    let validator = this._validator;
    if (this._repeated) {
      validator = Joi.array().items(validator);
    }

    // TODO: Rework this so all payload is validated at once
    let {error, value } = Joi.validate(val, validator);
    if (error) {
      throw new ValidationError(error);
    }

    return value;
  }

  from_resource(obj) {
    // Obj could be object or instance of Model
    return obj[this._name];
  }

  to_resource(data) {
    // validate and shape
    if (!this._name) {
      throw new Error('_name is not defined...');
    }

    let val = data[this._name];

    if (val === undefined && this._required) {
      throw new ValidationError(this._name + ' is required');
    }

    // Check if empty, etc
    return this.validate(val);
  }
}

const StringField = (name, kwargs={}) => {
  kwargs['type'] = 'StringField';
  kwargs['validator'] = kwargs['validator'] || Joi.string();
  return new RestField(name, kwargs);
};

const IntegerField = (name, kwargs={}) => {
  kwargs['type'] = 'IntegerField';
  kwargs['validator'] = kwargs['validator'] || Joi.number().integer();
  return new RestField(name, kwargs);
};

var FloatField = function FloatField(name) {
  var kwargs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  kwargs['type'] = 'FloatField';
  kwargs['validator'] = kwargs['validator'] || Joi.number();
  return new RestField(name, kwargs);
}

var DateTimeField = function DateTimeField(name) {
  var kwargs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  kwargs['type'] = 'DateTimeField';
  kwargs['validator'] = kwargs['validator'] || Joi.date();
  return new RestField(name, kwargs);
}

var BooleanField = function BooleanField(name) {
  var kwargs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  kwargs['type'] = 'BooleanField';
  kwargs['validator'] = kwargs['validator'] || Joi.boolean();
  return new RestField(name, kwargs);
}

module.exports = {Resource, RestField, StringField, IntegerField};
