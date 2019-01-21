const responses = require('../src/responses');

test('serveResponse produces expected side affects', () => {
  // Set up Test
  const mJson = jest.fn();
  const mStatus = jest.fn().mockReturnValue({json: mJson});
  const mCallback = jest.fn();
  const mSet = jest.fn();

  const req = {cleaned_params: []};
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

  const req = {cleaned_params: []};
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

  const req = {cleaned_params: []};
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

  const req = {cleaned_params: []};
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
