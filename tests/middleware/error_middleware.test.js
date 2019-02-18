/* eslint-env jest */

// Test middleware
const rest_exceptions = require('../../src/exceptions');
const core_exceptions = require('core').exceptions;
const error_middleware = require('../../src/middleware/error_middleware');

describe('Error middleware should call next middleware and https status', () => {

  // Generic Exception
  test('should be 500 for generic Errors', () => {
    // Set up Test
    const err = Error('Gandalf');
    const mJson = jest.fn();
    const mStatus = jest.fn().mockReturnValue({json: mJson});
    const mCallback = jest.fn();

    const req = {};
    const res = {status: mStatus};

    // Call Code to Test
    let result = error_middleware(err, req, res, mCallback);

    // Check Results
    expect(result).toBe(undefined);
    expect(mCallback).toHaveBeenCalledWith(err);
    expect(mStatus).toHaveBeenCalledWith(500);
    expect(mJson.mock.calls[0][0]['messages']).toEqual(['Gandalf']);
    expect(mJson.mock.calls[0][0]['status']).toEqual(500);
  });

  test('should be 400 for BadRequestException with sub errors', () => {
    // Set up Test

    const msg = 'Data is invalid.';
    const errors = [
      new rest_exceptions.ValidationError('Field `familyName` is required'),
      new rest_exceptions.ValidationError('Field `givenName` is required')
    ];

    const err = new rest_exceptions.BadRequestException(errors, msg);
    const mJson = jest.fn();
    const mStatus = jest.fn().mockReturnValue({json: mJson});
    const mCallback = jest.fn();

    const req = {};
    const res = {status: mStatus};

    // Call Code to Test
    let result = error_middleware(err, req, res, mCallback);

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

  test('should be 400 for BadRequestException without sub errors', () => {
    // Set up Test

    const msg = 'Data is invalid.';

    const err = new rest_exceptions.BadRequestException([], msg);
    const mJson = jest.fn();
    const mStatus = jest.fn().mockReturnValue({json: mJson});
    const mCallback = jest.fn();

    const req = {};
    const res = {status: mStatus};

    // Call Code to Test
    let result = error_middleware(err, req, res, mCallback);

    // Check Results
    expect(result).toBe(undefined);
    expect(mCallback).toHaveBeenCalledWith(err);
    expect(mStatus).toHaveBeenCalledWith(400);
    expect(mJson.mock.calls[0][0]['messages']).toEqual([
      'Data is invalid.',
    ]);

    expect(mJson.mock.calls[0][0]['status']).toEqual(400);
  });

  test('should be 404 for DoesNotExistException', () => {
    const err = new core_exceptions.DoesNotExistException('This does not exist');
    const mJson = jest.fn();
    const mStatus = jest.fn().mockReturnValue({json: mJson});
    const mCallback = jest.fn();
    const req = {};
    const res = {status: mStatus};
    let result = error_middleware(err, req, res, mCallback);

    expect(result).toBe(undefined);
    expect(mCallback).toHaveBeenCalledWith(err);
    expect(mStatus).toHaveBeenCalledWith(404);
    expect(mJson.mock.calls[0][0]['messages']).toEqual(['This does not exist']);
  });

  test('should be 409 for ConflictException', () => {
    const err = new core_exceptions.ConflictException('This already exists');
    const mJson = jest.fn();
    const mStatus = jest.fn().mockReturnValue({json: mJson});
    const mCallback = jest.fn();
    const req = {};
    const res = {status: mStatus};
    let result = error_middleware(err, req, res, mCallback);

    expect(result).toBe(undefined);
    expect(mCallback).toHaveBeenCalledWith(err);
    expect(mStatus).toHaveBeenCalledWith(409);
    expect(mJson.mock.calls[0][0]['messages']).toEqual(['This already exists']);
  });

  test('should be 403 for PermissionException', () => {
    const err = new core_exceptions.PermissionException('You do not have permission');
    const mJson = jest.fn();
    const mStatus = jest.fn().mockReturnValue({json: mJson});
    const mCallback = jest.fn();
    const req = {};
    const res = {status: mStatus};
    let result = error_middleware(err, req, res, mCallback);

    expect(result).toBe(undefined);
    expect(mCallback).toHaveBeenCalledWith(err);
    expect(mStatus).toHaveBeenCalledWith(403);
    expect(mJson.mock.calls[0][0]['messages']).toEqual(['You do not have permission']);
  });

  test('should be 401 for AuthenticationException', () => {
    const err = new core_exceptions.AuthenticationException('You are not authenticated');
    const mJson = jest.fn();
    const mStatus = jest.fn().mockReturnValue({json: mJson});
    const mCallback = jest.fn();
    const req = {};
    const res = {status: mStatus};
    let result = error_middleware(err, req, res, mCallback);

    expect(result).toBe(undefined);
    expect(mCallback).toHaveBeenCalledWith(err);
    expect(mStatus).toHaveBeenCalledWith(401);
    expect(mJson.mock.calls[0][0]['messages']).toEqual(['You are not authenticated']);
  });

  test('should be 405 for HTTPMethodNotAllowed', () => {
    const err = new rest_exceptions.HTTPMethodNotAllowed('POST is not allowed');
    const mJson = jest.fn();
    const mStatus = jest.fn().mockReturnValue({json: mJson});
    const mCallback = jest.fn();
    const req = {};
    const res = {status: mStatus};
    let result = error_middleware(err, req, res, mCallback);

    expect(result).toBe(undefined);
    expect(mCallback).toHaveBeenCalledWith(err);
    expect(mStatus).toHaveBeenCalledWith(405);
    expect(mJson.mock.calls[0][0]['messages']).toEqual(['POST is not allowed']);
  });
});
