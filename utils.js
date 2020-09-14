/**
 * Created by jhtyuchao on 2018/1/24.
 */

// 获取url参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return unescape(decodeURI(r[2]));
  }
  return null;
}

String.prototype.getUrlParam = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = this.split("?")[1].match(reg);
  if (r !== null) {
    return unescape(decodeURI(r[2]));
  }
  return null;
};

// cookie方法
function setCookie(name, value) {
  document.cookie = name + "=" + value;
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return arr[2];
  } else {
    return null;
  }
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}

// 通过Date格式化标准日期(yyyy-MM-dd hh:mm:ss)
function formateStandardDateString(date) {
  return date.getFullYear() + "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
    ("0" + (date.getDate())).slice(-2) + " " +
    ("0" + (date.getHours())).slice(-2) + ":" +
    ("0" + (date.getMinutes())).slice(-2) + ":" +
    ("0" + (date.getSeconds())).slice(-2);
}

// 字符串格式化日期
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

// 切换字符串
String.prototype.toggleString = function (fir, sec) {
  return this.toString() === fir ? sec : fir;
};