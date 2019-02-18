/* eslint-env jest */

const exceptions = require('../src/exceptions');

test('BadRequestException is a subclass of Error', () => {
  let msg = 'A Rest Error Occurred';
  expect(() => {
    throw new exceptions.BadRequestException(msg);
  }).toThrow(exceptions.RestError); // Unknown property `something` of model JunkDrawer
});

test('BadRequestException contains expected message', () => {
  const msg = 'This request is bad.';
  try {
    throw new exceptions.BadRequestException([], msg);
  } catch (e) {
    expect(e.message).toBe(msg);
  }
});

test('BadRequestException with errors contains expected values', () => {
  const msg = 'Data is invalid.';
  const errors = [
    new exceptions.ValidationError('Field `familyName` is required'),
    new exceptions.ValidationError('Field `givenName` is required')
  ];

  try {
    throw new exceptions.BadRequestException(errors, msg);
  } catch (e) {
    expect(e.message).toBe(msg);

    const errors = e.getErrors();
    expect(errors.length).toBe(2);
    expect(errors[0].message).toBe('Field `familyName` is required');
    expect(errors[1].message).toBe('Field `givenName` is required');
  }
});

test('HTTPMethodNotAllowed contains expected message', () => {
  const msg = 'PATCH is not an implemented HTTP verb';
  try {
    throw new exceptions.HTTPMethodNotAllowed(msg);
  } catch (e) {
    expect(e.message).toBe(msg);
  }
});
