'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Response helpers
var utils = require('./utils');

function serveResponse(req, res, status, results) {
  var messages = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var extraFields = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  // Serve the response - should be the only spot that outputs

  // Validate that cors allowed origin bits are defined
  if (!process.env.REST_DEFAULT_ORIGIN) {
    throw new Error('Environment Variable REST_DEFAULT_ORIGIN must be defined and in the form of https://example.com');
  }

  if (!process.env.REST_WHITELIST_DOMAINS) {
    throw new Error('Environment Variable REST_WHITELIST_DOMAINS must be defined and a space separated string of domains in the form of https://example.com');
  }

  if (!process.env.REST_WHITELIST_RULES) {
    throw new Error('Environment Variable REST_WHITELIST_RULES must be defined and a space separated string of domain regular expression in the form of https?://example.com, etc');
  }

  // Check it messages is an array
  if (messages && typeof messages.map !== 'function') {
    messages = [messages];
  }

  // Determine origin for CORS
  var requestOrigin = req.headers.origin; // || getDomain(req.headers.referer)
  var responseOrigin = process.env.REST_DEFAULT_ORIGIN;
  var whitelistedOrigins = process.env.REST_WHITELIST_DOMAINS.split(' ');
  var whitelistedOriginRules = process.env.REST_WHITELIST_RULES.split(' ');

  // Check if request origin is white listed
  if (utils.originAllowed(requestOrigin, whitelistedOrigins, whitelistedOriginRules)) {
    responseOrigin = requestOrigin; // Overwrite response origin to be the request origin i.e. "all good"
  }

  // Set the HTTP status code
  res.status(status);

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

function serveError(req, res, e) {
  var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;

  var messages = e.stack.split('\n');
  serveResponse(req, res, status, messages, messages = e.message);
}

function serve404(req, res, e) {
  serveResponse(req, res, 404, [], e.message);
}

function serveSuccess(req, res, results, messages) {
  var extraFields = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  serveResponse(req, res, 200, results, messages, extraFields);
}

module.exports = {
  serve404: serve404,
  serveError: serveError,
  serveSuccess: serveSuccess,
  serveResponse: serveResponse
};