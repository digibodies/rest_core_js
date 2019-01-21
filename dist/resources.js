'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Simple Lightweight Resource Model
var Joi = require('joi');

var _require = require('./exceptions'),
    ValidationError = _require.ValidationError;

var Resource = function Resource(obj, fields) {
  var resource = { obj: null, fields: [], errors: [], cleaned_data: [] };

  // TODO: This is pythonic way to check for empty object... convert to js
  if (!obj) {
    obj = null;
  }

  if (obj == null || !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object')) {
    throw Error('First argument to Resource should be object, received ' + obj);
  }

  resource.obj = obj;

  // Dumps a rest Resource to a json friendly return values
  resource.to_dict = function () {
    var verbose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var result = {};
    //let verbose = false; // TODO: KWARG

    var obj = resource.obj;
    if (!obj) {
      return result;
    }

    result['_meta'] = { is_verbose: false, resource_type: 'TODO' };

    // TODO: Set the resource_id for the resource

    // Keep track of if we excluded antything because of verbose, etc
    var has_excluded_fields = false;

    fields.forEach(function (field) {
      if (!field.verbose_only || verbose) {
        result[field._name] = field.from_resource(obj);
      } else {
        has_excluded_fields = true;
      }
    });

    // Update meta
    result['_meta'].verbose = !has_excluded_fields;
    return result;
  };

  return resource;
};

var RestField = function () {
  function RestField(name, kwargs) {
    _classCallCheck(this, RestField);

    this._name = name;
    this._fieldType = kwargs['type'];
    this._validator = kwargs['validator'];
    this._default = kwargs['default'];
    this._repeated = kwargs['repeated'] || false;
    this._required = kwargs['required'] || false;
  }

  // This is passed in


  _createClass(RestField, [{
    key: 'default',
    value: function _default() {
      return this._default || null;
    }
  }, {
    key: 'validate',
    value: function validate(val) {
      var validator = this._validator;
      if (this._repeated) {
        validator = Joi.array().items(validator);
      }

      // TODO: Rework this so all payload is validated at once

      var _Joi$validate = Joi.validate(val, validator),
          error = _Joi$validate.error,
          value = _Joi$validate.value;

      if (error) {
        throw new ValidationError(error);
      }

      return value;
    }
  }, {
    key: 'from_resource',
    value: function from_resource(obj) {
      // Obj could be object or instance of Model
      return obj[this._name];
    }
  }, {
    key: 'to_resource',
    value: function to_resource(data) {
      // validate and shape
      if (!this._name) {
        throw new Error('_name is not defined...');
      }

      var val = data[this._name];

      if (val === undefined && this._required) {
        throw new ValidationError(this._name + ' is required');
      }

      // Check if empty, etc
      return this.validate(val);
    }
  }]);

  return RestField;
}();

var StringField = function StringField(name) {
  var kwargs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  kwargs['type'] = 'StringField';
  kwargs['validator'] = kwargs['validator'] || Joi.string();
  return new RestField(name, kwargs);
};

var IntegerField = function IntegerField(name) {
  var kwargs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  kwargs['type'] = 'IntegerField';
  kwargs['validator'] = kwargs['validator'] || Joi.number().integer();
  return new RestField(name, kwargs);
};

module.exports = { Resource: Resource, RestField: RestField, StringField: StringField, IntegerField: IntegerField };