/* jshint node:true, expr:true */
'use strict';

const siPrefixes = {
  '-24': {
    symbol: 'y',
    prefix: 'yocto'
  },
  '-21': {
    symbol: 'z',
    prefix: 'zepto'
  },
  '-18': {
    symbol: 'a',
    prefix: 'atto'
  },
  '-15': {
    symbol: 'f',
    prefix: 'femto'
  },
  '-12': {
    symbol: 'p',
    prefix: 'pico'
  },
  '-9': {
    symbol: 'n',
    prefix: 'nano'
  },
  '-6': {
    symbol: 'u',
    prefix: 'micro'
  },
  '-3': {
    symbol: 'm',
    prefix: 'milli'
  },
  3: {
    symbol: 'K',
    prefix: 'kilo'
  },
  6: {
    symbol: 'M',
    prefix: 'mega'
  },
  9: {
    symbol: 'G',
    prefix: 'giga'
  },
  12: {
    symbol: 'T',
    prefix: 'tera'
  },
  15: {
    symbol: 'P',
    prefix: 'peta'
  },
  18: {
    symbol: 'E',
    prefix: 'exa'
  },
  21: {
    symbol: 'Z',
    prefix: 'zetta'
  },
  24: {
    symbol: 'Y',
    prefix: 'yotta'
  }
};

function toSi(exp) {
  if (siPrefixes.hasOwnProperty(String(exp))) {

    return siPrefixes[String(exp)];
  }

  return {
    symbol: '',
    prefix: ''
  };
}

function siExponent(e) {

  return Math.floor(e / 3);
}

function log10(val) {

  return Math.log(val) / Math.LN10;
}

function exponent(v) {
  if (v !== 0) {
    return Math.round(log10(Math.abs(v)));
  }

  return 0;
}

function format(options) {
  var len = 3;
  var mantissa = String(options.mantissa);
  if (mantissa.search('.') >= 0) {
    len++;
  }

  mantissa = mantissa.slice(0, len);

  if (mantissa[mantissa.length - 1] === '.') {
    mantissa = mantissa.slice(0, -1);
  }

  return String(mantissa) + options.symbol;
}

function normalize(val) {
  var power = exponent(val);
  var siPower = siExponent(power);
  var mantissa = val / Math.pow(10, power);
  var mantissaShift = (power % 3);

  function fixMantissaLessThanOne(m) {
    // Special Case: Convert 0.123EN to 123E(N-3)
    if ((Math.abs(m) > 0) && (Math.abs(m) < 1)) {
      siPower--;

      return m * Math.pow(10, 3);
    }

    return m;
  }

  function normalizeMantissa(m) {
    if (siPower < 0) {
      if (mantissaShift !== 0) {

        return m * Math.pow(10, 3 - Math.abs(mantissaShift));
      }
    } else {

      return m * Math.pow(10, Math.abs(mantissaShift));
    }

    return m;
  }

  mantissa = normalizeMantissa(mantissa);
  mantissa = fixMantissaLessThanOne(mantissa);

  return {
    mantissa: mantissa,
    exponent: siPower
  };
}

module.exports = function (val, options) {
  var normalized = normalize(val);
  var si = toSi(3 * normalized.exponent);

  if (options && options.hasOwnProperty('detailed') && options.detailed) {
    return {
      mantissa: normalized.mantissa,
      exponent: (3 * normalized.exponent),
      symbol: si.symbol,
      prefix: si.prefix,
      formatted: format({
        mantissa: normalized.mantissa,
        symbol: si.symbol
      })
    };
  }

  return format({
    mantissa: normalized.mantissa,
    symbol: si.symbol
  });
};
