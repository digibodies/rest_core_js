const responses = require('../src/responses');

const defaultOrigin = 'https://example.com';

test('serveResponse produces expected side affects', () => {
  // Set up Test
  const mJson = jest.fn();
  const mStatus = jest.fn().mockReturnValue({json: mJson});
  const mCallback = jest.fn();
  const mSet = jest.fn();

  const req = {cleaned_params: [], headers: {origin: defaultOrigin}};
  const res = {status: mStatus, set: mSet, json: mJson};

  const extraFields = {'cursor': null};
  const messages = ['Request took .2ms'];
  const payload = {'givenName': 'Rick', 'familyName': 'Sanchez'};

  // Run Code to Test
  const result = responses.serveResponse(res, req, 200, payload, messages, extraFields);

  // Check Results
  expect(result).toBe(undefined);
  expect(mCallback).toHaveBeenCalledTimes(0); // End of the response
  expect(mStatus).toHaveBeenCalledWith(200);
  expect(mJson.mock.calls[0][0]['messages']).toEqual(['Request took .2ms']);
  expect(mJson.mock.calls[0][0]['status']).toEqual(200);
  expect(mJson.mock.calls[0][0]['cursor']).toEqual(null);
  expect(mJson.mock.calls[0][0]['results']['givenName']).toEqual('Rick');
});

test('serveError produces expected side affects', () => {
  // Note: It'd be great to just mock serveResponse, but since it is in the same package,
  //  not possible without some import hacking...

  // Setup Test
  const mJson = jest.fn();
  const mStatus = jest.fn().mockReturnValue({json: mJson});
  const mSet = jest.fn();

  const req = {cleaned_params: [], headers: {origin: defaultOrigin}};
  const res = {status: mStatus, set: mSet, json: mJson};
  const err = new Error('Gandalf');

  // Run Code To Test
  const result = responses.serveError(res, req, err)

  // Check Results
  expect(result).toBe(undefined);
  expect(mStatus).toHaveBeenCalledWith(500);
  expect(mJson.mock.calls[0][0]['messages']).toEqual(['Gandalf']);
  expect(mJson.mock.calls[0][0]['status']).toEqual(500);
});

test('serve404 produces expected side affects', () => {
  // Note: It'd be great to just mock serveResponse, but since it is in the same package,
  //  not possible without some import hacking...

  // Setup Test
  const mJson = jest.fn();
  const mStatus = jest.fn().mockReturnValue({json: mJson});
  const mSet = jest.fn();

  const req = {cleaned_params: [], headers: {origin: defaultOrigin}};
  const res = {status: mStatus, set: mSet, json: mJson};
  const err = new Error('Gandalf');

  // Run Code To Test
  const result = responses.serve404(res, req, err)

  // Check Results
  expect(result).toBe(undefined);
  expect(mStatus).toHaveBeenCalledWith(404);
  expect(mJson.mock.calls[0][0]['messages']).toEqual(['Gandalf']);
  expect(mJson.mock.calls[0][0]['status']).toEqual(404);
});

test('serveSuccess produces expected side affects', () => {
  // Note: It'd be great to just mock serveResponse, but since it is in the same package,
  //  not possible without some import hacking...

  // Setup Test
  const mJson = jest.fn();
  const mStatus = jest.fn().mockReturnValue({json: mJson});
  const mSet = jest.fn();

  const req = {cleaned_params: [], headers: {origin: defaultOrigin}};
  const res = {status: mStatus, set: mSet, json: mJson};

  const extraFields = {'cursor': null};
  const messages = ['Request took .2ms'];
  const payload = {'givenName': 'Rick', 'familyName': 'Sanchez'};


  // Run Code To Test
  const result = responses.serveSuccess(res, req, payload, messages, extraFields);

  // Check Results
  expect(result).toBe(undefined);
  expect(mStatus).toHaveBeenCalledWith(200);
  expect(mJson.mock.calls[0][0]['messages']).toEqual(['Request took .2ms']);
  expect(mJson.mock.calls[0][0]['status']).toEqual(200);
  expect(mJson.mock.calls[0][0]['cursor']).toEqual(null);
  expect(mJson.mock.calls[0][0]['results']['givenName']).toEqual('Rick');
});

describe('Missing CORS environment variables', () => {
  test('should error on missing REST_DEFAULT_ORIGIN', () => {
    let backup = process.env.REST_DEFAULT_ORIGIN;
    const req = {cleaned_params: [], headers: {origin: defaultOrigin}};

    delete process.env.REST_DEFAULT_ORIGIN;
    expect(() => {
      responses.serveResponse({}, req, 200, {}, [], {});
    }).toThrow(Error);
    process.env.REST_DEFAULT_ORIGIN = backup;
  });

  test('should error on missing REST_WHITELIST_DOMAINS', () => {
    let backup = process.env.REST_DEFAULT_ORIGIN;
    const req = {cleaned_params: [], headers: {origin: defaultOrigin}};

    delete process.env.REST_WHITELIST_DOMAINS;
    expect(() => {
      responses.serveResponse({}, req, 200, {}, [], {});
    }).toThrow(Error);
    process.env.REST_WHITELIST_DOMAINS = backup;
  });

  test('should error on missing REST_WHITELIST_RULES', () => {
    let backup = process.env.REST_WHITELIST_RULES;
    const req = {cleaned_params: [], headers: {origin: defaultOrigin}};

    delete process.env.REST_WHITELIST_RULES;
    expect(() => {
      responses.serveResponse({}, req, 200, {}, [], {});
    }).toThrow(Error);
    process.env.REST_WHITELIST_RULES = backup;
  });

});
