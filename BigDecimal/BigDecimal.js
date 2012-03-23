/**
 * BigDecimal.
 * @param value 値
 * @param scale スケール
 * @constructor
 */
var BigDecimal = function (value, scale) {

  /** 文字列に変換した値 */
  this._value = isNumber(value) ? value.toString() : "0";
  /** スケール(スケールが指定されない場合は、値を元に導出する) */
  this._scale = isNumber(scale) ? scale : getScale(this._value);

  /**
   * 加算を行う。
   * @param addValue 加算する値
   * @param expScale 加算後のスケール(見指定の場合は、このオブジェクトのスケールとaddValueのスケールの大きいスケールが適用される。)
   * @return {BigDecimal} 加算後の値
   */
  this.add = function (addValue, expScale) {
    return expression(this, addValue, expScale, function (v1, v2) {
      return v1 + v2;
    });
  };

  /**
   * 減算を行う。
   * @param subtractValue 減算する値
   * @param expScale 減算後のスケール(見指定の場合は、このオブジェクトのスケールとaddValueのスケールの大きいスケールが適用される。)
   * @return {BigDecimal} 減算後の値
   */
  this.subtract = function (subtractValue, expScale) {
    return expression(this, subtractValue, expScale, function (v1, v2) {
      return v1 - v2;
    });
  };

  /**
   * 計算を行う。
   * @param value1 計算対象の値1
   * @param value2 計算対象の値2
   * @param expScale 計算時のスケール
   * @param func 計算処理を行う関数
   * @return {BigDecimal} 計算後の値
   */
  function expression(value1, value2, expScale, func) {
    var thisNumber,
        addNumber,
        maxScale;

    if (!(value2 instanceof BigDecimal)) {
      value2 = new BigDecimal(value2);
    }
    maxScale = Math.max(value1._scale, value2._scale);
    thisNumber = toInteger(value1._value, maxScale);
    addNumber = toInteger(value2._value, maxScale);
    return new BigDecimal(toBigDecimalString(func(thisNumber, addNumber), maxScale),
        isNumber(expScale) ? expScale : maxScale);
  }

  /**
   * 文字列に変換する。
   * @return {String} 変換後の文字列
   */
  this.toString = function () {
    console.log(this._value);
    var split = this._value.split(".");
    if (this._scale === 0) {
      return split[0];
    } else if (split.length === 1) {
      return split[0] + "." + addZero("", this._scale);
    } else if (split[1].length < this._scale) {
      return split[0] + "." + addZero(split[1], this._scale);
    } else {
      return split[0] + "." + split[1].substring(0, this._scale);
    }
  };

  /**
   * 文字列値からスケールを導出する。
   * @param value 値
   * @return {Number} スケール
   */
  function getScale(value) {
    if (value.indexOf(".") === -1) {
      return 0;
    }
    return value.split(".")[1].length;
  }

  /**
   * スケール分桁をずらした数値に変換する。
   * @param value 値
   * @param scale スケール
   * @return {Number} 変換後の値
   */
  function toInteger(value, scale) {
    var split = value.split(".");
    if (split.length === 1) {
      return Number(value + addZero("", scale));
    }
    if (split[1].length >= scale) {
      return Number(split[0] + split[1].substring(0, scale));
    } else {
      return Number(split[0] + addZero(split[1], scale));
    }
  }

  /**
   * 指定されたスケールを持つ数値文字列に変換する。
   * @param val 値
   * @param s スケール
   * @return {*}
   */
  function toBigDecimalString(val, s) {
    var str = val.toString();
    if (s === 0) {
      return str;
    }
    return str.substring(0, str.length - s) + "." + str.substring(str.length - s);
  }

  /**
   * 指定した長さになるように末尾に「0」を付加する。
   * @param val 値
   * @param length 長さ
   * @return {*}
   */
  function addZero(val, length) {
    var i,
        ret = val;
    for (i = ret.length; i < length; i += 1) {
      ret += "0";
    }
    return ret;
  }

  /**
   * 指定した値が数値化否か。
   * @param val
   * @return {Boolean}
   */
  function isNumber(val) {
    if (val === undefined) {
      return false;
    }
    if (val.toString().length === 0) {
      return false;
    }
    return !isNaN(val);
  }
};
