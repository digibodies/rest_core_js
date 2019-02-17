// Response helpers
const utils = require('./utils');

function serveResponse(res, req, status, results, messages=null, extraFields={}) {
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
  let requestOrigin = req.headers.origin; // || getDomain(req.headers.referer)
  let responseOrigin = process.env.REST_DEFAULT_ORIGIN;
  const whitelistedOrigins = process.env.REST_WHITELIST_DOMAINS.split(' ');
  const whitelistedOriginRules = process.env.REST_WHITELIST_RULES.split(' ');

  // Check if request origin is white listed
  if (utils.originAllowed(requestOrigin, whitelistedOrigins, whitelistedOriginRules)) {
    responseOrigin = requestOrigin; // Overwrite response origin to be the request origin i.e. "all good"
  }


  // Set the HTTP status code
  res.status(status);

  //# TODO: Validate that extra_fields doesn't contain bad props - collisions

  // Update Payload
  let payload = {...extraFields, status, results, messages};

  // Set the CORS headers
  res.set({
    'Access-Control-Allow-Origin': responseOrigin, // TODO: Determine origin
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // TODO: These should be determined
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Authorization, Origin, X-Requested-With, Content-Type, Accept',
  });

  // Finally Serve the Response
  if (req.cleaned_params && req.cleaned_params.pretty) {
    res.set({'Content-Type': 'application/json'});
    res.send(JSON.stringify(payload, null, 2));
  }
  else {
    res.json(payload);
  }
}

function serveError(res, req, e, status=500) {
  let messages = e.stack.split('\n');
  serveResponse(res, req, status, messages, messages=e.message);
}

function serve404(res, req, e) {
  serveResponse(res, req, 404, [], e.message);
}

function serveSuccess(res, req, results, messages, extraFields={}) {
  serveResponse(res, req, 200, results, messages, extraFields);
}

module.exports = {
  serve404,
  serveError,
  serveSuccess,
  serveResponse
};
