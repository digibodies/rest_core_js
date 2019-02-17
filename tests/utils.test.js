/* eslint-env jest */

// Util Tests
const utils = require('../src/utils');

describe('Orgin Allowed validation', () => {
  test('should fail if no whitelists are passed in', () => {
    let result = utils.originAllowed('http://www.example.com', [], []);
    expect(result).toBe(false);
  });

  test('should fail if domain is not in whitelist', () => {
    let domain = 'http://example.com';
    let whitelist = ['http://myapp.com', 'https://myapp.com'];
    expect(utils.originAllowed(domain, whitelist, [])).toBe(false);
  });

  test('should pass if domain is in whitelist', () => {
    let domain = 'http://myapp.com';
    let whitelist = ['http://myapp.com', 'https://myapp.com'];
    expect(utils.originAllowed(domain, whitelist, [])).toBe(true);
  });

  test('should pass if domain is in whitelist resetModules', () => {
    let domain = 'http://myapp.com';
    let rules = ['https?://localhost:*', 'https?://myapp\.[^.]+'];
    expect(utils.originAllowed(domain, [], rules)).toBe(true);
  });

  test('should fail if domain is not in whitelist', () => {
    let domain = 'http://badexample.com';
    let rules = ['https?://localhost:[1-9]+', 'https?://myapp\.[^.]+'];
    expect(utils.originAllowed(domain, [], rules)).toBe(false);
  });

  test('appengine versions should pass', () => {
    let domain = 'https://superadmin-web-dot-pollywog-dev-datastore.appspot.com';
    let rules = ['https?://.+-dot-pollywog-dev-\.[^.]+.appspot.com'];
    expect(utils.originAllowed(domain, [], rules)).toBe(true);
  });

  test('wild card rule should pass', () => {
    let domain = 'https://superadmin-web-dot-pollywog-dev-datastore.appspot.com';
    let rules = ['.+'];
    expect(utils.originAllowed(domain, [], rules)).toBe(true);
  });
});
