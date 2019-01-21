// Test middleware
const exceptions = require('../../src/exceptions');
const error_middleware = require('../../src/middleware/error_middleware');

test('ensure that error middleware produces expected side affects and calls next middlware', () => {
  // Set up Test
  const err = Error('Gandalf');
  const mJson = jest.fn();
  const mStatus = jest.fn().mockReturnValue({json: mJson});
  const mCallback = jest.fn();

  const req = {};
  const res = {status: mStatus};

  // Call Code to Test
  result = error_middleware(err, req, res, mCallback);

  // Check Results
  expect(result).toBe(undefined);
  expect(mCallback).toHaveBeenCalledWith(err);
  expect(mStatus).toHaveBeenCalledWith(500);
  expect(mJson.mock.calls[0][0]['messages']).toEqual(['Gandalf']);
  expect(mJson.mock.calls[0][0]['status']).toEqual(500);
});


test('ensure that BadRequestException with sub errors handles them', () => {
  // Set up Test

  const msg = 'Data is invalid.';
  const errors = [
    new exceptions.ValidationError('Field `familyName` is required'),
    new exceptions.ValidationError('Field `givenName` is required')
  ];

  const err = new exceptions.BadRequestException(errors, msg);
  const mJson = jest.fn();
  const mStatus = jest.fn().mockReturnValue({json: mJson});
  const mCallback = jest.fn();

  const req = {};
  const res = {status: mStatus};

  // Call Code to Test
  result = error_middleware(err, req, res, mCallback);

  // Check Results
  expect(result).toBe(undefined);
  expect(mCallback).toHaveBeenCalledWith(err);
  expect(mStatus).toHaveBeenCalledWith(400);
  expect(mJson.mock.calls[0][0]['messages']).toEqual([
    'Data is invalid.',
    'Field `familyName` is required',
    'Field `givenName` is required'
  ]);

  expect(mJson.mock.calls[0][0]['status']).toEqual(400);
});
