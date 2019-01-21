// Handler tests
const Joi = require('joi');
const rootHandler = require('../src/handlers');
const exceptions = require('../src/exceptions');
const resources = require('../src/resources');

test('no schema does not error', () => {

  // Set Up Test
  let paramSchema = {};
  let dataSchema = {};
  const mNext = jest.fn();
  const req = {query: {}, body:{}, method:'get'};
  const res = {};

  // Run Code To Test
  const handler = rootHandler(paramSchema, dataSchema);
  const result = handler(req, res, mNext);

  // Check Results
  expect(result).toBe(undefined);
  expect(req.cleaned_data).toEqual({});
  expect(req.cleaned_params).toEqual({});
});


test('invalid query params error', () => {

  // Set Up Test
  let paramSchema = {};
  let dataSchema = {};
  const mNext = jest.fn();
  const req = {query: {'bad': 'param'}, body:{}, method:'get'};
  const res = {};

  // Run Code To Test
  const handler = rootHandler(paramSchema, dataSchema);

  expect(() => {
    handler(req, res, mNext);
  }).toThrow(exceptions.BadRequestException);
});

test('valid query params does not error', () => {

  // Set Up Test
  let paramSchema = {'cursor': Joi.string()};
  let dataSchema = {};
  const mNext = jest.fn();
  const req = {query: {'cursor': 'asdf34534'}, body:{}, method:'get'};
  const res = {};

  // Run Code To Test
  const handler = rootHandler(paramSchema, dataSchema);

  let result = handler(req, res, mNext);
  // Check Results
  expect(result).toBe(undefined);
  expect(req.cleaned_params).toEqual({'cursor': 'asdf34534'});
  expect(req.cleaned_data).toEqual({});
});

test('valid post request body does not error', () => {

  // Set Up Test
  let paramSchema = {};
  let dataSchema = [
    resources.StringField('givenName', {required:true}),
    resources.StringField('familyName', {required:true})
  ];

  const mNext = jest.fn();
  const req = {query: {}, body:{'givenName': 'Rick', 'familyName': 'Sanchez'}, method:'post'};
  const res = {};

  // Run Code To Test
  const handler = rootHandler(paramSchema, dataSchema);

  let result = handler(req, res, mNext);
  // Check Results
  expect(result).toBe(undefined);
  expect(req.cleaned_params).toEqual({});
  expect(req.cleaned_data).toEqual({'familyName': 'Sanchez', 'givenName': 'Rick'});
});

test('missing fields in post request body error', () => {

  // Set Up Test
  let paramSchema = {};
  let dataSchema = [
    resources.StringField('givenName', {required:true}),
    resources.StringField('familyName', {required:true})
  ];

  const mNext = jest.fn();
  const req = {query: {}, body:{'givenName': 'Rick'}, method:'post'};
  const res = {};

  // Run Code To Test
  const handler = rootHandler(paramSchema, dataSchema);

  try {
    handler(req, res, mNext);
    // TODO: assert fail
  }
  catch (err) {
    expect(err instanceof exceptions.BadRequestException).toBe(true);
    expect(err.getErrors()[0].message).toBe('familyName is required');
  }
});

test('non empty body on get throws error', () => {

  // Set Up Test
  let paramSchema = {};
  let dataSchema = [
    resources.StringField('givenName', {required:true}),
    resources.StringField('familyName', {required:true})
  ];
  const mNext = jest.fn();
  const req = {query: {}, body:{'givenName': 'Rick', 'familyName': 'Sanchez'}, method:'get'};
  const res = {};

  // Run Code To Test
  const handler = rootHandler(paramSchema, dataSchema);

  expect(() => {
    handler(req, res, mNext);
  }).toThrow(exceptions.BadRequestException);
});
