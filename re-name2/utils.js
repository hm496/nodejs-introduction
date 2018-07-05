/**
 * 格式化时间
 * @param date
 * @param fmt 'yyyyMMdd hh:mm:ss:SS'
 * @param isUTC
 * @param isReturnObj
 * @param isLeftTime
 * @returns String
 */
function dateFmt (date, fmt, isUTC, isReturnObj, isLeftTime, isCut) {
  isCut = isCut === undefined ? true : isCut;
  if (date === null || date === undefined || date === "") {
    return "";
  }
  var DateObj;
  if (Object.prototype.toString.apply(date) === "[object Date]") {
    DateObj = date;
  } else {
    DateObj = new Date(date);
  }

  var MONTH = isUTC ? DateObj.getUTCMonth() : DateObj.getMonth();
  /* eslint-disable no-self-compare */
  if (MONTH !== MONTH) {
    return "";
  }
  var o = {
    "M": MONTH + 1,                                                              //月份
    "d": isUTC ? DateObj.getUTCDate() : DateObj.getDate(),                       //日
    "h": isUTC ? DateObj.getUTCHours() : DateObj.getHours(),                     //小时
    "m": isUTC ? DateObj.getUTCMinutes() : DateObj.getMinutes(),                 //分
    "s": isUTC ? DateObj.getUTCSeconds() : DateObj.getSeconds(),                 //秒
    "q": isUTC ? Math.floor((DateObj.getUTCMonth() + 3) / 3) : Math.floor((DateObj.getMonth() + 3) / 3), //季度
    "S": ~~(DateObj.getMilliseconds() / 10)                                      //毫秒
  };
  var FullYear = isUTC ? DateObj.getUTCFullYear() : DateObj.getFullYear();

  if (isLeftTime) {
    o.M--;
    o.d--;
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (FullYear + "").substr(4 - RegExp.$1.length));
  }

  function zeroTo2 ($0, $1) {
    return (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))
  }

  for (var k in o) {
    if (new RegExp("(" + k + "+)").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, zeroTo2);
    }
  }
  if (isReturnObj) {
    if (isLeftTime && isCut) {
      var mindex = fmt.match(/[1-9]/)
      if (mindex) {
        mindex = mindex.index
        fmt = fmt.substr(mindex)
      } else {
        fmt = ''
      }
    }
    return {
      fmt: fmt,
      o: o,
    }
  }
  return fmt;
}

module.exports = {
  dateFmt,
}
