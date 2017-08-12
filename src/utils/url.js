/**
 * @module utils/url Url utility methods
 */

const url = {};

/**
 * Update the URL to reflect the current state of the application
 */
url.update = function() {
  let url = window.location.origin + window.location.pathname;
  let toAppend = [];

  if (app.bus.search.length) { toAppend.push('q='+app.bus.search); }
  if (app.bus.page != 1) { toAppend.push('page='+app.bus.page); }

  if (toAppend.length) {
      url += '?' + toAppend.join('&');
  }

  history.replaceState({}, document.title, url);
};

/**
 * Turn url query string from a string to an array of key-value pairs
 *
 * @returns {Array} key-value pairs found in the query string
 */
url.decodeQueryString = function() {
  let queryString = location.search&&location.search.substr(1).replace(/\+/gi," ").split("&");
  for (let i in queryString) {
    let s = queryString[i].split("=");
    queryString[i]  = queryString[unescape(s[0])] = unescape(s[1]);
  }

  return queryString;
}

export default url;

