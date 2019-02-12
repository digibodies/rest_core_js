// Utility methods

/**
 * Given a domain, determine if it is allowed based on ENVIRONMENT vars
 * @param  {string} domain Domain to check, in the form of https://example.com
 * @param  {string[]} whiteList List of explicitly allowed domains in the form of [https://example.com]
 * @param  {string[]} whiteListRules Domain to check, in the form of [https://example.com]
 * @return {boolean} If the domain is an allowed origin
 */
function originAllowed(domain, whiteList, whiteListRules) {
  if (!domain) {
    return false;
  }

  // Check if it is explicitly in whitelist
  if (whiteList.indexOf(domain) >= 0) {
    return true;
  }

  // Check if it is a match
  let match = whiteListRules.some((rule) => {
    return (domain.match(RegExp(rule)) != null)
  });

  return match;
}


module.exports = {originAllowed}
