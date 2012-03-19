/**
 * BigDecimal.
 * @param value
 * @param scale
 * @constructor
 */
var BigDecimal = function (value, scale) {
  this._value = isNumber(value) ?  value.toString() : "0";
  this._scale = isNumber(scale) ? scale : getScale(this._value);

  this.add = function(addValue, pScale) {
    var thisNumber,
        addNumber,
        maxScale;

    if (!(addValue instanceof BigDecimal)) {
      addValue = new BigDecimal(addValue);
    }
    maxScale = max(this._scale, addValue._scale);
    thisNumber = toNumber(this._value, maxScale);
    addNumber = toNumber(addValue._value, maxScale);
    return new BigDecimal(toS(thisNumber + addNumber, maxScale), isNumber(pScale) ? pScale : maxScale);
  };

  this.subtract = function(subtractValue, pScale) {
    pScale = isNumber(pScale) ? pScale : 0;
    if (!(subtractValue instanceof BigDecimal)) {
      subtractValue = new BigDecimal(subtractValue, pScale);
    }
    pScale = max(this._scale, subtractValue._scale, pScale);
    return new BigDecimal(toNumber(this._value, pScale) + toNumber(subtractValue._value, pScale), pScale);
  };

  this.toString = function() {
    var split = this._value.split(".");
    if (this._scale == 0) {
      return split[0];
    } else if (split.length == 1) {
      return split[0] + "." + addZero("", this._scale);
    } else if (split[1].length < scale) {
      return split[0] + "." + addZero(split[1], scale);
    } else {
      return split[0] + "." + split[1].substring(0, scale);
    }
  };

  function getScale(value) {
    if (value.indexOf(".") == -1) {
      return 0;
    }
    return value.split(".")[1].length;
  }


  function toNumber(pValue, pScale) {
    var split = pValue.split(".");
    if (split.length == 1) {
      return new Number(pValue + addZero("", pScale));
    }
    if (split[1].length >= pScale) {
      return new Number(split[0] + split[1].substring(0, pScale));
    } else {
      return new Number(split[0] + addZero(split[1], pScale));
    }
  }

  function toS(pValue, pScale) {
    var str = pValue.toString();
    if (pScale == 0) {
      return str;
    }
    return str.substring(0, str.length - pScale) + "." + str.substring(str.length - pScale);
  }
  function addZero(pValue, count) {
    var i;
    for (i = pValue.length; i < count; i+= 1) {
      pValue += "0";
    }
    return pValue;
  }

  function max() {
    var i,
        maxValue = 0;
    for (i = 0; i < arguments.length; i+= 1) {
      if (maxValue < arguments[i]) {
        maxValue = arguments[i];
      }
    }
    return maxValue;
  }

  function isNumber(value) {
    if (value === undefined) {
      return false;
    }
    if (value.toString().length == 0) {
      return false;
    }
    return !isNaN(value);
  }
};