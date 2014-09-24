/**
 * Log.js v0.0.1-1409241232
 * https://github.com/bbuecherl/log.js/
 * by Bernhard Buecherl http://bbuecherl.de/
 * License: MIT http://bbuecherl.mit-license.org/ */
!(function(GLOBAL) {
GLOBAL.Log = {};
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

if(window.innerWidth !== undefined && window.innerHeight !== undefined) {
    _sysinfo.viewport.width = window.innerWidth;
    _sysinfo.viewport.height = window.innerHeight;
} else {
    _sysinfo.viewport.width = document.documentElement.clientWidth;
    _sysinfo.viewport.height = document.documentElement.clientHeight;
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

Log.Logger = function(name, obj, level, options) {
    // make sure its instance of Log.Logger
    if(!(this instanceof Log.Logger))
        return new Log.Logger(name, obj, level);

    // set name and level
    this.name = name;
    this.level = level || Log.LEVEL.ERROR;

    if(obj instanceof Function)
        obj = obj(GLOBAL, options);

    // run "created"
    if(obj.created)
        obj.created(GLOBAL, options);

    this.attached = obj.attached || Log.NOOP;
    this.log = obj.log || Log.NOOP;
};

Log.Logger.create = function(name, obj) {
    return Log.Logger.bind(null, name, obj);
};

Log.logger = [];
Log.level = Log.LEVEL.ERROR;
Log.silent = false;
Log.throws = false;
Log.globalLevel = Log.LEVEL.ERROR;
Log.sysInfo = false;

Log.use = function(logger) {
    if(logger instanceof Log.Logger) {
        Log.logger.push(logger);
        logger.attached(GLOBAL);
        if(Log.sysInfo !== false)
            logger.log(Log.sysInfo, Log.getDate(), [Log.getSysInfo()]);
    }
};

Log.config = function(options) {
    if(options.hasOwnProperty("level"))
        Log.level = options.level;
    if(options.hasOwnProperty("silent"))
        Log.silent = options.silent;
    if(options.hasOwnProperty("throws"))
        Log.throws = options.throws;
    if(options.hasOwnProperty("globalLevel"))
        Log.globalLevel = options.globalLevel;
    if(options.hasOwnProperty("sysInfo"))
        Log.sysInfo = options.sysInfo;
};

Log.log = function(level, args) {
    if(level >= Log.level && !Log.silent) {
        var date = Log.getDate();
        for(var i = 0; i < Log.logger.length; ++i) {
            if(Log.logger[i].level <= level) {
                Log.logger[i].log(level, date, Array.prototype.slice.call(args));
            }
        }
    }
};

var _logFunction = function(level) {
    return function() {
        Log.log(level, arguments);
    };
};

for(var level in Log.LEVEL) {
    if(level !== "SYSTEM")
        Log[level.toLowerCase()] = _logFunction(Log.LEVEL[level]);
}

// Global error hanlder
GLOBAL.onerror = function() {
    Log.log(Log.globalLevel, arguments);
    if(!Log.throws)
        return true;
};

Log.DOM = Log.Logger.create("dom", function(global, el) {
    if(!(el instanceof HTMLElement)) {
        el = document.createElement("div");
        document.body.appendChild(el);
    }
    el.className = "log_js___log_dom";
    el.style.background = "#FFF";
    el.style.overflow = "auto";
    var logname, date = new Date();
    for(var l in Log.LEVEL)
        if(Log.LEVEL[l] === level)
            logname = l;

    return {
        log: function(level, date, args) {
            var logname;
            for(var l in Log.LEVEL)
                if(Log.LEVEL[l] === level)
                    logname = l;

            var span = document.createElement("span");
            span.style.color = Log.COLORS[logname];
            span.style.display = "block";
            span.innerHTML = "[" + date + "] " + logname + ": ";

            for(var i = 0, tmp; i < args.length; ++i) {
                tmp = document.createElement("i");
                tmp.innerHTML = JSON.stringify(args[i]);
                span.appendChild(tmp);
            }

            el.appendChild(span);
            el.scrollTop = el.scrollHeight;
        }
    };
});

Log.Console = Log.Logger.create("console", function(global) {
    var log, warn, err;
    try { log = global.console.log } catch(e) { log = Log.NOOP; }
    try { warn = global.console.warn } catch(e) { warn = Log.NOOP; }
    try { err = global.console.error } catch(e) { err = Log.NOOP; }

    return {
        log: function(level, date, args) {
            var logname;
            for(var l in Log.LEVEL)
                if(Log.LEVEL[l] === level)
                    logname = l;

            args.unshift("color: " + Log.COLORS[logname]);
            args.unshift("%c[" + date + "] " + logname + ": ");

            if(level <= Log.LEVEL.INFO)
                log.apply(global.console, args);
            else if(level <= Log.LEVEL.CAUTION)
                warn.apply(global.console, args);
            else
                err.apply(global.console, args);
        }
    };
});

}(window));
