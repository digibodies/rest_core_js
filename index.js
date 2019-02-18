// Main entry point for rest core
var resources = require('./dist/resources');
var exceptions = require('./dist/exceptions');
var handlers = require('./dist/handlers');
var responses = require('./dist/responses');
var middleware = require('./dist/middleware');

module.exports = {
  resources: resources,
  exceptions: exceptions,
  handlers: handlers,
  responses: responses,
  middleware: middleware
};
