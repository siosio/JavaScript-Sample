/**
 * BigDecimal.
 * @param value 値
 * @param scale スケール
 * @constructor
 */
var BigDecimal = function (value, scale) {
  this._value = isNumber(value) ?  value.toString() : "0";
  this._scale = isNumber(scale) ? scale : getScale(this._value);

  this.add = function(addValue, pScale) {
    return expression(this, addValue, pScale, function(v1, v2) {
      return v1 + v2;
    });
  };

  this.subtract = function(subtractValue, pScale) {
    return expression(this, subtractValue, pScale, function(v1, v2) {
      return v1 - v2;
    });
  };

  function expression(value1, value2, pScale, func) {
    var thisNumber,
        addNumber,
        maxScale;

    if (!(value2 instanceof BigDecimal)) {
      value2 = new BigDecimal(value2);
    }
    maxScale = max(value1._scale, value2._scale);
    thisNumber = toNumber(value1._value, maxScale);
    addNumber = toNumber(value2._value, maxScale);
    return new BigDecimal(toS(func(thisNumber, addNumber), maxScale), isNumber(pScale) ? pScale : maxScale);
  }

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