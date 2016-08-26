var iconwar = "<img src=\/AliImages\/icon_war.gif align=absmiddle \/> ";
var iconload = "<img src=\/AliImages\/ajaxload.gif align=absmiddle \/> ";
var badstr = "!&^#|%$)(-+/?<>@`~';:{}[],=\".\\";
var badsql = "!&^|+/?<>`~'=";
var $show = function(e) {
    try {
        document.getElementById(e).style.display = "";
    } catch (e) {}
};
var $hide = function(e) {
    try {
        document.getElementById(e).style.display = "none";
    } catch (e) {}
};
var $W = document.write;
var reurl, js_UserName;
reurl = document.referrer;
if (reurl == "") {
    reurl = "/index.html";
}

function onDisplay(id) {
    if (document.getElementById(id).style.display == 'none') {
        $show(id);
    } else {
        $hide(id);
    }
}

function onLabelTxt(id, LabelID, ShowTxt, HideTxt) {
    if (document.getElementById(id).style.display == 'none') {
        $show(id);
        document.getElementById(LabelID).value = HideTxt;
    } else {
        $hide(id);
        document.getElementById(LabelID).value = ShowTxt;
    }
}

function listdisp(tid, lid) {
    if (document.getElementById(tid).style.display == 'none') {
        $show(tid);
    } else {
        $hide(tid);
    }
    if (lid == 't1') {
        return 't1_off';
    } else if (lid == 't2') {
        return 't2_off';
    } else if (lid == 't1_off') {
        return 't1';
    } else if (lid == 't2_off') {
        return 't2';
    }
}

function trim(str) {
    return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}

function addbookmark(url, site) {
    if (is_ie) {
        window.external.addFavorite(url, site);
    } else {
        alert('Please press "Ctrl+D" to add bookmark');
    }
}
//AJAX_START
var xmlhttp = null;

function createxmlhttp() {
    try {
        xmlhttp = new ActiveXObject("Msxml2.xmlhttp");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.xmlhttp");
        } catch (oc) {
            xmlhttp = null;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != "undefined") {
        xmlhttp = new XMLHttpRequest();
    }
    if (!xmlhttp) {
        alert("您的浏览器不支AJAX特性,本页某些功能将无法正常使用!");
    }
}

//js操作cookies函数 *********************
function delcookie(name) {
    setcookie(name, "");
}

function getcookie(name) {
    var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(";", cookie_start);
    return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}

function setcookie(cookieName, cookieValue, seconds) {
    var expires = new Date();
    var path = "/";
    var domain = "alixixi.com";
    var secure = "";
    expires.setTime(expires.getTime() + seconds);
    document.cookie = escape(cookieName) + '=' + escape(cookieValue) +
        (expires ? '; expires=' + expires.toGMTString() : '') +
        (path ? '; path=' + path : '/') +
        (domain ? '; domain=' + domain : '') +
        (secure ? '; secure' : '');
}
//GetQueryString ***********************
var LocString = String(window.document.location.href);

function GetQueryString(str) {
    var rs = new RegExp("(^|)" + str + "=([^\&]*)(\&|$)", "gi").exec(LocString),
        tmp;
    if (tmp = rs) return tmp[2];
    return " ";
}
//VScroll 显示上翻单条标题************************
function _ge(a) {
    return document.getElementById ? document.getElementById(a) : null;
}

function VScroll() {
    var m_box = null;
    var m_lineHeight = 0;
    var m_lineNum = 0;
    var m_splitStr = '';
    var m_speed = 0;
    var m_delay = 0;
    var m_pos = 0;
    var m_stopTimes = 0;
    var m_stop = false;
    this.init = function(box, lnum, lheight, speed, delay, split) {
        m_box = _ge(box);
        m_lineNum = lnum;
        m_lineHeight = lheight;
        m_speed = speed;
        m_delay = delay;
        m_splitStr = split;
    }
    this.play = function() {
        if (m_stop) {
            return;
        }
        m_pos = m_box.scrollTop;
        if (m_pos % m_lineHeight == 0 && m_stopTimes < m_delay && m_box.scrollTop < m_lineHeight * m_lineNum) {
            m_stopTimes++;
        } else {
            m_box.scrollTop++;
            if (m_pos % m_lineHeight == 0 && m_stopTimes >= m_delay) {
                m_stopTimes = 0;
            }
        }
        if (m_box.scrollTop > m_lineHeight * m_lineNum) {
            m_box.scrollTop = 0;
        }
    }
    this.show = function() {
        setInterval(m_self + ".play()", m_speed);
    }
    this.setSelf = function(n) {
        m_self = n;
    }
    this.stop = function(n) {
        m_stop = n;
    }
}

function show_date() {
    var today = new Date();
    var day = new Array();
    var str = '';
    day[0] = "日";
    day[1] = "一";
    day[2] = "二";
    day[3] = "三";
    day[4] = "四";
    day[5] = "五";
    day[6] = "六";
    str += today.getFullYear();
    str += "年";
    str += today.getMonth() + 1;
    str += "月";
    str += today.getDate();
    str += "日";
    str += " ";
    str += "星期";
    str += day[today.getDay()];
    return str;
}

function ajaxPost(url, stateurl, data, info, loading) {
    var url, stateurl, data, info, loading
    createxmlhttp();
    if (data == "" || data == null) {
        //getMode
        xmlhttp.open("get", url, true);
        xmlhttp.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            checkState(stateurl, info, loading);
        };
        xmlhttp.send(null);
    } else {
        //postMode
        xmlhttp.open("post", url, true, "", "");
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            checkState(stateurl, info, loading);
        }
        xmlhttp.send(data);
    }
}

function checkState(stateurl, info, loadnews) {
    if (xmlhttp.readyState == 4) {
        document.getElementById(info).innerHTML = loadnews;
        if (xmlhttp.status == 200) {
            var retext = xmlhttp.responseText.split("$");
            document.getElementById(info).innerHTML = retext[1];
            switch (retext[0]) {
                case "usreg":
                    if (stateurl !== "") location.href = stateurl;
                    break;
                case "uslogin":
                    if (stateurl !== "") location.href = stateurl;
                    break;
                case "active":
                    location.href = retext[2];
                    break;
                case "errinfo":
                    return false;
                    break;
                default:
                    document.getElementById(info).innerHTML = retext[0];
            }
        }
    } else {
        document.getElementById(info).innerHTML = loadnews;
    }
}
//AJAX_END

//运行代码
function runEx(cod1) {
    cod = document.getElementById(cod1)
    var code = cod.value;
    if (code != "") {
        var newwin = window.open('', '', '');
        newwin.opener = null
        newwin.document.write(code);
        newwin.document.close();
    }
}
//复制代码
function doCopy2(ID) {
    if (document.all) {
        textRange = document.getElementById(ID).createTextRange();
        textRange.execCommand("Copy");
        alert('复制成功');
    } else {
        alert("此功能只能在IE上有效")
    }
}
//复制代码
function doCopy(obj) {
    var rng = document.body.createTextRange();
    rng.moveToElementText(obj);
    rng.scrollIntoView();
    rng.select();
    rng.execCommand("Copy");
    rng.collapse(false);
}

function doCopyUrl() {
    document.getElementById("CopyUrl").value = parent.location.href;
    document.getElementById("CopyUrl").select();
    document.execCommand("copy");
    alert("网址成功复制到剪贴板！")
}
//另存代码
function doSave(obj) {
    var winname = window.open('', '_blank', 'top=10000');
    winname.document.open('text/html', 'replace');
    winname.document.writeln(obj.value);
    winname.document.execCommand('saveas', '', 'code.htm');
    winname.close();
}

function findobj(n, d) {
    var p, i, x;
    if (!d) d = document;
    if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document;
        n = n.substring(0, p);
    }
    if (x != d[n] && d.all) x = d.all[n];
    for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++) x = findobj(n, d.layers[i].document);
    if (!x && document.getElementById) x = document.getElementById(n);
    return x;
}

function submitonce(theform) {
    //if IE 4+ or NS 6+
    if (document.all || document.getElementById) {
        //screen thru every element in the form, and hunt down "submit" and "reset"
        for (i = 0; i < theform.length; i++) {
            var tempobj = theform.elements[i]
            if (tempobj.type.toLowerCase() == "submit" || tempobj.type.toLowerCase() == "reset")
            //disable em
                tempobj.disabled = true
        }
    }
}

function openScript(url, width, height) {
    var Win = window.open(url, "openScript", 'width=' + width + ',height=' + height + ',resizable=1,scrollbars=yes,menubar=no,status=yes');
}

function CheckAll(form) {
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        if (e.name != 'chkall') e.checked = form.chkall.checked;
    }
}

function chkuserlogin() {
    if (getcookie('userid') == '' || getcookie('userid') == 0 || getcookie('username') == '') {
        return false;
    } else {
        return true;
    }
}

function chkcookieed() {
    if (getcookie("username") !== "") {
        var url = "/ajax.asp?action=loginmenu";
        url += "&random=" + Math.random();
        ajaxPost(url, null, null, "top_login", " ");
    }
}

function userlogout() {
    var url = "/AspCode.asp?getType=logout";
    url += "&random=" + Math.random();
    ajaxPost(url, null, null, "top_login", "正在退出...");
    chkcookieed();
    alert('欢迎再次光临阿里西西WEB开发社区...');
}
//Cookie解密
function DecodeCookie(str) {
    var strArr;
    var strRtn = "";
    strArr = str.split("a");
    try {
        for (var i = strArr.length - 1; i >= 0; i--)
            strRtn += String.fromCharCode(eval(strArr[i]));
    } catch (e) {}
    return strRtn;
}

function isnumber(str) {
    var digits = "1234567890";
    var i = 0;
    var strlen = str.length;
    while ((i < strlen)) {
        var char = str.charAt(i);
        if (digits.indexOf(char) == -1) return false;
        i++;
    }
    return true;
}
