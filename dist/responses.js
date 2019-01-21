'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Rest Core
var API_DEFAULT_ORIGIN = 'localhost:9000'; // Uh.. yeah. ENV variable plz

function serveResponse(res, req, status, results) {
  var messages = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var extraFields = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  // Serve the response - should be the only spot that outputs

  // Check it messages is an array
  if (messages && typeof messages.map !== 'function') {
    messages = [messages];
  }

  // Set the HTTP status code
  res.status(status);

  // Determine origin for CORS
  //let requestOrigin = req.headers.get('Origin') || req.headers.get('Referer');
  var responseOrigin = API_DEFAULT_ORIGIN;

  // Check if request origin is white listed


  /*
  request_origin = self.request.headers.get('Origin') or self.request.referer
  response_origin = API_DEFAULT_ORIGIN
   origin_in_whitelist = rest_utils.is_origin_in_whitelist(request_origin)
  if origin_in_whitelist:
      response_origin = request_origin  # Input origin is good, so passthru
  */

  //# TODO: Validate that extra_fields doesn't contain bad props - collisions

  // Update Payload
  var payload = _extends({}, extraFields, { status: status, results: results, messages: messages });

  // Set the CORS headers
  res.set({
    'Access-Control-Allow-Origin': responseOrigin, // TODO: Determine origin
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // TODO: These should be determined
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  });

  // Finally Serve the Response
  if (req.cleaned_params && req.cleaned_params.pretty) {
    res.set({ 'Content-Type': 'application/json' });
    res.send(JSON.stringify(payload, null, 2));
  } else {
    res.json(payload);
  }
}

function serveError(res, req, e) {
  var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;

  var messages = e.stack.split('\n');
  serveResponse(res, req, status, messages, messages = e.message);
}

function serve404(res, req, e) {
  serveResponse(res, req, 404, [], messages = e.message);
}

function serveSuccess(res, req, results, messages) {
  var extraFields = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  serveResponse(res, req, 200, results, messages, extraFields);
}

module.exports = {
  serve404: serve404,
  serveError: serveError,
  serveSuccess: serveSuccess,
  serveResponse: serveResponse
};