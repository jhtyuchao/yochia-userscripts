// ==UserScript==
// @name          Koriri豆瓣用户广播助手
// @namespace     http://yochia.cn
// @author        Yochia
// @version       1.1
// @updateURL     *://userscripts.yochia.cn/douban-status-helper.user.js
// @description   为豆瓣用户个人页面的广播页面添加分类筛选功能。
// @include       https://www.douban.com/people/*/statuses*
// @require       ./utils.js
// @icon          ./favicon.ico
// ==/UserScript==


(function() {
  'use strict';

  var filterNames = {
    "original": "原创",
    "shared": "转播",
    "recommend": "推荐",
    "favor": "喜欢",
    "music": "音乐",
    "movie": "电影",
    "book": "读书",
    "game": "游戏",
    "app": "应用",
    "doulist": "豆列"
  };

  (function() {
    importStyles();
    optimizeElement();
    initStatusHelper();
    refreshListStyles();

    console.log("豆瓣用户广播助手已生效！感谢使用!\n——Yochia（http://yochia.cn）");
  })();

  function optimizeElement() {
    var items = $(".new-status.status-wrapper");

    items.find("[data-target-type='rec']").parent().addClass("dsh-type-recommend");
    items.find("[data-target-type='sns']").parent().addClass("dsh-type-original");
    items.find("[data-target-type='fav']").parent().addClass("dsh-type-favor");
    items.find("[data-target-type='doulist']").parent().addClass("dsh-type-doulist");
    items.find("[data-target-type='music']").parent().addClass("dsh-type-music");
    items.find("[data-target-type='movie']").parent().addClass("dsh-type-movie");
    items.find("[data-target-type='book']").parent().addClass("dsh-type-book");
    items.find("[data-target-type='game']").parent().addClass("dsh-type-game");
    items.find("[data-target-type='app']").parent().addClass("dsh-type-app");

    $(".new-status.status-wrapper.status-reshared-wrapper").addClass("dsh-type-shared");
    items.find("[data-target-type='']").parent().addClass("dsh-type-shared");

    var reshared = items.find("span.reshared_by").parent();
    $(reshared).attr('class', function (i, cls) { return cls.replace(/dsh-type-\S* */g, ''); });
    $(reshared).addClass("dsh-type-shared");
  }

  function importStyles() {
    var tabStyles = document.createElement("style");
    tabStyles.type = "text/css";
    $("head").append(tabStyles);
  }

  function initStatusHelper() {
    var helperTab = document.getElementById("dsh-filter-tab");
    if (!helperTab) {
      helperTab = document.createElement("ul");
      helperTab.id = "dsh-filter-tab";
    }
    helperTab.innerHTML = "";

    var allLi = document.createElement("li");
    if (getUrlParam("dsh-filter")) {
      var allA = document.createElement("a");
      allA.setAttribute("href", "javascript:void(0)");
      allA.onclick = function () {
        if (getUrlParam("p")) {
          history.pushState({}, "", "?p=" + getUrlParam("p"));
        } else {
          history.pushState({}, "", location.href.split("?")[0])
        }
        initStatusHelper();
        refreshListStyles();
      };
      allA.innerHTML = "全部";
      allLi.appendChild(allA);
    } else {
      allLi.innerHTML = "全部";
    }
    helperTab.appendChild(allLi);

    for (var key in filterNames) {
      var li = document.createElement("li");
      if (getUrlParam("dsh-filter") === key.toString()) {
        li.innerHTML = filterNames[key.toString()];
      } else {
        var a = document.createElement("a");
        a.setAttribute("href", "javascript:void(0)");
        a.setAttribute("dsh-filter-type", key.toString());
        a.onclick = function () {
          history.pushState({}, "",
            "?dsh-filter="+ this.getAttribute("dsh-filter-type") +
            (getUrlParam("p") ? "&p=" + getUrlParam("p"):"")
          );
          initStatusHelper();
          refreshListStyles();
        };
        a.innerHTML = filterNames[key.toString()];
        li.appendChild(a);
      }

      helperTab.appendChild(li);
    }

    $("#db-usr-profile").find(".info").append(helperTab);

    var paginators = $(".paginator").find("a,link");
    for (var i = 0; i < paginators.length; i++) {
      if (getUrlParam("dsh-filter")) {
        $(paginators[i]).attr("href",
          "?p=" + $(paginators[i]).attr("href").getUrlParam("p") + "&dsh-filter=" + getUrlParam("dsh-filter"));
      } else {
        $(paginators[i]).attr("href", "?p=" + $(paginators[i]).attr("href").getUrlParam("p"));
      }
    }
  }

  function refreshListStyles() {
    $("head").find("#dsh-filter-styles").remove();

    var styles = document.createElement("style");
    styles.type = "text/css";
    styles.id = "dsh-filter-styles";

    var type = getUrlParam("dsh-filter");
    if (type) {
      styles.innerHTML =
        ".new-status.status-wrapper {" +
        "display: none" +
        "}" +
        ".new-status.status-wrapper.dsh-type-" + getUrlParam("dsh-filter") + "{" +
        "display: block" +
        "}";
    }

    $("head").append(styles);
  }
})();
