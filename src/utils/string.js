import _deburr from 'lodash/deburr';

/**
 * @module utils/string String utility methods
 */

 /**
  * Clean a string up for better comparisons when searching
  *
  * @param {string} string - The string that requires cleaning
  * @returns {string} The cleaned string
  */
export function clean(string) {
  let s = _deburr(string);
  return s.toLowerCase();
}
