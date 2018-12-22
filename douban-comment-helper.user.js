// ==UserScript==
// @name          Koriri豆瓣评论区助手
// @namespace     http://yochia.cn
// @author        Yochia
// @version       1.1
// @updateURL     https://userscripts.yochia.cn/douban-comment-helper.user.js
// @description   豆瓣的评论区增强功能为日记、小组、广播的回复添加：· 楼层号；· 高亮、只显示当前作者按钮。
// @include       *://www.douban.com/note/*
// @include       *://www.douban.com/group/topic/*
// @include       *://www.douban.com/people/*/status/*
// @require       ./utils.js
// @icon          https://userscripts.yochia.cn/favicon.ico
// ==/UserScript==


(function() {
  'use strict';

  (function() {
    importStyles();
    optimizeElement();

    var commentItems = $(".dch-comment-item");
    var commentOffset = getUrlParam("start")-0;

    for (var i = 0; i < commentItems.length; i ++) {
      optimizeCommnetItem(commentItems[i]);
      showFloorNumber(commentItems[i], i, commentOffset);
      showHighlightButton(commentItems[i]);
      showFocusButton(commentItems[i]);
    }

    console.log("豆瓣评论区助手已生效！感谢使用!\n——Yochia（http://yochia.cn）");
  })();

  function optimizeElement() {
    var comments = $("#comments");

    $(comments).find(".comment-item").addClass("dch-comment-item");
    $(comments).find(".comment-item").find(".content").addClass("dch-comment-content");

    $(comments).find(".author").addClass("dch-author-background");
    $(comments).find(".bg-img-green h4").addClass("dch-author-background");

    $(comments).find(".author a").addClass("dch-author");
    $(comments).find(".bg-img-green h4 a").addClass("dch-author");

    $(comments).find(".op-lnks").addClass("dch-comment-tools");
    $(comments).find(".operation_div").addClass("dch-comment-tools");
    $(comments).find(".admin-lnks").addClass("dch-comment-tools");
    $(comments).find(".admin-lnks").css({"direction": "rtl", "float": "none"});
  }

  function importStyles() {
    var styles = document.createElement("style");
    styles.type = "text/css";
    styles.innerHTML =
      ".dch-floor-index {" +
      "float: right;" +
      "margin: 0 5px" +
      "}" +
      ".dch-highlight .dch-comment-content {"+
      "background-color: #e8f8ff" +
      "}" +
      "#comments[dch-focus='enabled'] .dch-comment-item {" +
      "display: none" +
      "}" +
      "#comments[dch-focus='enabled'] .dch-focus {" +
      "display: block" +
      "}";
    $("head").append(styles);
  }

  function optimizeCommnetItem(item) {
    $(item).attr("author-url", $(item).find(".dch-author").attr("href"));
  }

  function showFloorNumber(item, index, offset) {
    $(item).find(".dch-author-background")
      .append("<span class='dch-floor-index'>"+(index+1+offset)+"楼</span>");
  }

  function showHighlightButton(item) {
    var highlightBtn = document.createElement("a");
    highlightBtn.className = "dch-highlight-button";
    highlightBtn.href = "javascript:void(0)";
    highlightBtn.innerText = "高亮";
    highlightBtn.style.margin = "0 10px";
    highlightBtn.onclick = function () {
      if (this.innerText === "高亮") {
        highlightAuthor($(this).parents(".dch-comment-item").attr("author-url"));
      } else {
        resetHighlight();
      }
    };
    $(item).find(".dch-comment-tools").append(highlightBtn);
  }

  function highlightAuthor(userPageUrl) {
    resetHighlight();

    var target = $(".dch-comment-item[author-url='"+userPageUrl+"']");
    $(target).toggleClass("dch-highlight");

    var highlightBtn = $(target).find(".dch-highlight-button");
    for (var i = 0; i < highlightBtn.length; i ++) {
      $(highlightBtn[i]).text("取消高亮");
    }
  }

  function resetHighlight() {
    $(".dch-highlight").removeClass("dch-highlight");
    $(".dch-highlight-button").text("高亮");
  }

  function showFocusButton(item) {
    var focusBtn = document.createElement("a");
    focusBtn.className = "dch-focus-button";
    focusBtn.href = "javascript:void(0)";
    focusBtn.style.margin = "0 10px";
    focusBtn.innerText = "只看该用户";
    focusBtn.onclick = function () {
      if (this.innerText === "只看该用户") {
        focusAuthor($(this).parents(".dch-comment-item").attr("author-url"));
      } else {
        resetFocus();
      }
    };
    $(item).find(".dch-comment-tools").append(focusBtn);
  }

  function focusAuthor(userPageUrl) {
    resetFocus();
    $("#comments").attr("dch-focus", "enabled");

    var target = $(".dch-comment-item[author-url='"+userPageUrl+"']");
    $(target).toggleClass("dch-focus");

    var focusBtn = $(target).find(".dch-focus-button");
    for (var i = 0; i < focusBtn.length; i ++) {
      $(focusBtn[i]).text("取消只看该用户");
    }
  }

  function resetFocus() {
    $("#comments").attr("dch-focus", "disabled");
    $(".dch-focus").removeClass("dch-focus");
    $(".dch-focus-button").text("只看该用户");
  }

})();
