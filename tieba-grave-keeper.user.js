// ==UserScript==
// @name          Yochia吧务挖坟检测
// @namespace     http://yochia.cn
// @author        Yochia
// @version       1.5
// @updateURL     http://yochia.cn/greasy/tieba-grave-keeper.user.js
// @description   侧边栏【吧务管理】中将添加一个名为【检测挖坟】的按钮，点击后会对当前页的所有贴子粗略检查，标红疑似挖坟的项目。索尼克吧吧务专用。
// @include       https://tieba.baidu.com/f*
// @require       http://cdn.bootcss.com/blueimp-md5/1.1.0/js/md5.min.js
// @require       ./utils.js
// @require       ./network.js
// @icon          http://yochia.cn/wp-content/uploads/2017/08/cropped-logo-1-32x32.png
// ==/UserScript==


(function() {
    'use strict';

    var styles = document.createElement("style");
    styles.type = "text/css";
    styles.innerHTML =
        "#tgk-area input[type='checkbox'] {" +
        "margin: 5px" +
        "}" +
        "#tgk-area button {" +
        "margin: 10px auto;" +
        "display: block" +
        "}";
    $("head").append(styles);

    function start() {
        var dataList = baidu.getTbThreadList(getUrlParam("kw"), getUrlParam("pn"));
        
        // 最小挖坟时间
        var minInterval = $("#tgk-min-interval").val() * 86400;
        // 是否显示发贴时间
        var showCreateTime = $("#tgk-create-time").prop("checked");
        // 是否显示回复时间
        var showReplyTime = $("#tgk-reply-time").prop("checked");
        // 是否显示真实ID
        var showRealName = $("#tgk-real-name").prop("checked");
        // 是否无视精品贴
        var ignoreGood = $("#tgk-ignore-good").prop("checked");
        // 只显示目标
        var showTargetOnly = $("#tgk-show-target-only").prop("checked");

        var threads = $(".j_thread_list");
        threads.show();
        threads.css("background", "");

        $(".j_icon_slot").remove();

        if (showCreateTime) {
            $(".is_show_create_time").show();
        } else {
            $(".is_show_create_time").hide();
        }

        if (showCreateTime || showReplyTime) {
            $(".pull_left").width(375);
            $(".threadlist_author.pull_right").width(250);
            $(".threadlist_abs.threadlist_abs_onlyline").width(375);
            $("span.frs-author-name-wrap").width("auto");
        }

        for (var i = 0; i<threads.length; i ++) {
            var dataField = JSON.parse($(threads[i]).attr("data-field"));

            if (showRealName) {
                showRealAuthorName($(threads[i]).find(".frs-author-name"));
            }

            if (showCreateTime) {
                formatCreateDate(threads[i], dataList.thread_list[i].create_time);
            }

            if (showReplyTime) {
                formatReplyDate(threads[i], dataList.thread_list[i].last_time_int);
            }

            if (ignoreGood && dataField.is_good) continue;
            compareDate(threads[i], dataList.thread_list[i].create_time, dataList.thread_list[i].last_time_int, minInterval);
        }
        if (showTargetOnly) {
            threads.not(".tgk-target").hide();
        }

        console.log("挖坟检查视角已生效！颜色越红的贴子越可能是挖坟贴！  ——Yochia吧务挖坟检测");
    }

    function showRealAuthorName(nameEles) {
        for (var i = 0; i < nameEles.length; i ++) {
            var realName = JSON.parse($(nameEles[i]).attr("data-field")).un;
            $(nameEles[i]).html(realName);
        }
    }

    function formatCreateDate(thread, time) {
        var dateEle = $(thread).find(".is_show_create_time");
        if (dateEle.length === 0) return;
        $(dateEle).html(formateStandardDateString(new Date(time*1000)));
    }

    function formatReplyDate(thread, time) {
        var dateEle = $(thread).find(".threadlist_reply_date");
        if ($(dateEle).length === 0) return;
        $(dateEle).html(formateStandardDateString(new Date(time*1000)));
    }

    function compareDate(thread, createTime, lastTime, minInterval) {
        if ($(thread).find(".threadlist_reply_date").length === 0 || lastTime <= createTime) return;
        var interval = lastTime - createTime;
        if (interval < minInterval) return;

        var bet = interval - minInterval;
        bet = parseInt(255 - bet / 259200000 * 255 + "") - 20;
        bet = bet < 100 ? 100 : bet;
        $(thread).addClass("tgk-target");
        thread.style.backgroundColor="rgb(255,"+bet+","+bet+")";
    }

    var manageArea = document.createElement("div");
    manageArea.className = "aside_region bawu";
    manageArea.id = "tgk-area";

    var title = document.createElement("h4");
    title.className = "region_header clearfix";
    title.innerHTML = "挖坟检测";
    manageArea.appendChild(title);

    var content = document.createElement("div");
    content.className = "region_cnt clearfix";
    manageArea.appendChild(content);

    var btn = document.createElement("button");
    btn.className = "manager_btn";
    btn.innerText = "开始检测";
    btn.onclick = start;
    $(content).append(btn);

    $(content).append("<div><input type='checkbox' id='tgk-create-time' />显示具体创建日期</div>");
    $(content).append("<div><input type='checkbox' id='tgk-reply-time' />显示具体回复日期</div>");
    $(content).append("<div><input type='checkbox' id='tgk-real-name' />显示真实用户名</div>");
    $(content).append("<div><input type='checkbox' id='tgk-show-target-only' />只显示疑似挖坟贴子</div>");
    $(content).append("<div><input type='checkbox' id='tgk-ignore-good' checked/>无视精品贴</div>");
    $(content).append("<div>超过 <input style='width: 30px' id='tgk-min-interval' value='31' type='number'/> 天的贴子即算坟贴</div>");

    document.getElementById("pagelet_bawu/pagelet/bawu").appendChild(manageArea);

})();




