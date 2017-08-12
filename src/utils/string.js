import _deburr from 'lodash/deburr';

const clean = string => {
  let s = _deburr(string);
  return s.toLowerCase();
}

export {clean};
