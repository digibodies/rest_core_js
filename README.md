# rest_core_js
Rest Core Library for Javascript

# Required Environment Variables
There are 3 required environment variables for CORS
* `REST_DEFAULT_ORIGIN` - a domain with protocol used as default origin on response - eg. * https://example.com*
* `REST_WHITELIST_DOMAINS` - a space separated list of allowed origins: eg. * https://example.com https://example.org https://example.net *
* `REST_WHITELIST_RULES` - a space separated list of regular expressions for allowed origins: eg. * https?://example.+ https?://example.+ *
