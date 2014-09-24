var Log = {};
Log.NOOP = function() {};
Log.LEVEL = {
    DEBUG: -1,
    INFO: 0,
    WARN: 1,
    CAUTION: 2,
    ERROR: 3,
    CRITICAL: 4
};

Log.COLORS = {
    DEBUG: "rgb(102, 205, 170)",
    INFO: "rgb(30, 30, 30)",
    WARN: "rgb(255, 215, 0)",
    CAUTION: "rgb(255, 140, 0)",
    ERROR: "rgb(255, 0, 0)",
    CRITICAL: "rgb(220, 20, 60)"
};

var _sysinfo = new function SYSINFO() {
    this.userAgent = GLOBAL.navigator ? GLOBAL.navigator.userAgent : false;
    this.viewport = {};
    this.performance = GLOBAL.performance || false;
};

try {
    if(window.innerWidth !== undefined && window.innerHeight !== undefined) {
        _sysinfo.viewport.width = window.innerWidth;
        _sysinfo.viewport.height = window.innerHeight;
    } else {
        _sysinfo.viewport.width = document.documentElement.clientWidth;
        _sysinfo.viewport.height = document.documentElement.clientHeight;
    }
} catch(e) {
    // fail silently... looks like its node.js
}

Log.getSysInfo = function() {
    return _sysinfo;
};

Log.getDate = function() {
    var date = new Date();
    return date.getUTCFullYear() + "/" + (date.getUTCMonth() + 1) + "/" +
        date.getUTCDate() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" +
        date.getUTCSeconds() + "." + date.getUTCMilliseconds();
};
