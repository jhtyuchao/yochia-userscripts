/**
 * Created by jhtyuchao on 2018/1/24.
 */

(function (g) {
  'use strict';

  function formatFormString(json) {
    var resultData = "";

    var keyArray = [];
    for (var key in json) {
      keyArray.push(key);
      resultData += key + "=" + json[key] + "&";
    }
    keyArray.sort();

    var plainStr = "";
    for (var i = 0; i < keyArray.length; i++) {
      plainStr += keyArray[i] + "=" + json[keyArray[i]];
    }
    plainStr += "tiebaclient!!!";
    resultData += "&sign=" + md5(plainStr);

    return resultData;
  }

  function baidu() { }

  baidu.getTbThreadList = function (keyword, pageNumber) {
    var data = {
      kw: keyword,
      pn: pageNumber / 50 + 1,
      rn: 50,
      _client_version: "6.0.0"
    };
    return JSON.parse(
      $.ajax({
        type: "post",
        url: "/c/f/frs/page",
        data: formatFormString(data),
        async: false
      }).responseText);
  };

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return baidu;
    });
  } else {
    g.baidu = baidu;
  }

}(this));
