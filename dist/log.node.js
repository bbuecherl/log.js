/**
 * Log.js v0.0.1-1409241437
 * https://github.com/bbuecherl/log.js/
 * by Bernhard Buecherl http://bbuecherl.de/
 * License: MIT http://bbuecherl.mit-license.org/ */
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
Log.groups = {};

// config
Log.level = Log.LEVEL.ERROR;
Log.silent = false;
Log.throws = false;
Log.globalLevel = Log.LEVEL.ERROR;
Log.sysInfo = false;

// log function
var _logFunction = function(level, group) {
    return function() {
        Log.log(level, arguments, group);
    };
};

Log.use = function(logger) {
    if(logger instanceof Log.Logger) {
        Log.logger.push(logger);
        logger.attached(GLOBAL);
        if(Log.sysInfo !== false)
            logger.log(Log.sysInfo, Log.getDate(), null, [Log.getSysInfo()]);
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

Log.group = function(name) {
    if(Log.groups[name])
        return Log.groups[name];

    var tmp = {
        log: function(level, args) {
            Log.log(level, args, name);
        }
    };

    for(var level in Log.LEVEL) {
        if(level !== "SYSTEM")
            tmp[level.toLowerCase()] = _logFunction(Log.LEVEL[level], name);
    }

    Log.groups[name] = tmp;
    return tmp;
};

Log.log = function(level, args, group) {
    if(level >= Log.level && !Log.silent) {
        var date = Log.getDate();
        for(var i = 0; i < Log.logger.length; ++i) {
            if(Log.logger[i].level <= level) {
                Log.logger[i].log(level, date, group ? group : null, Array.prototype.slice.call(args));
            }
        }
    }
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

    var logname,
        date = new Date(),
        groups = {};

    for(var l in Log.LEVEL)
        if(Log.LEVEL[l] === level)
            logname = l;

    return {
        log: function(level, date, group, args) {
            var logname, elm;
            for(var l in Log.LEVEL)
                if(Log.LEVEL[l] === level)
                    logname = l;

            if(group) {
                if(!groups[group]) {
                    var div = document.createElement("div");
                    div.innerHTML = "<b>" + group + " (<em>0</em>)</b>";
                    div.count = div.getElementsByTagName("em")[0];
                    div.head = div.getElementsByTagName("b")[0];

                    div.content = document.createElement("p");
                    div.content.style.margin = "0 0 0 10px";
                    div.content.style.display = "none";
                    div.appendChild(div.content);
                    div.toggled = false;

                    div.head.onclick = function() {
                        div.content.style.display = div.toggled ? "none" : "block";
                        div.toggled = !div.toggled;
                    };

                    el.appendChild(div);
                    groups[group] = div;
                }
                elm = groups[group];
                elm.count.innerHTML = parseInt(elm.count.innerHTML, 10) + 1;
                elm = elm.content;
            } else {
                elm = el;
            }

            var span = document.createElement("span");
            span.style.color = Log.COLORS[logname];
            span.style.display = "block";
            span.innerHTML = "[" + date + "] " + logname + ": ";

            for(var i = 0, tmp; i < args.length; ++i) {
                tmp = document.createElement("i");
                tmp.innerHTML = JSON.stringify(args[i]);
                span.appendChild(tmp);
            }

            elm.appendChild(span);
            elm.scrollTop = elm.scrollHeight;
        }
    };
});

Log.Console = Log.Logger.create("console", function(global) {
    var log, warn, err,
        lastGroup = null,
        devTools = global.console && global.console.groupEnd instanceof Function && global.console.group instanceof Function;
    try { log = global.console.log } catch(e) { log = Log.NOOP; }
    try { warn = global.console.warn } catch(e) { warn = Log.NOOP; }
    try { err = global.console.error } catch(e) { err = Log.NOOP; }

    if(devTools)
        console.group(null);

    return {
        log: function(level, date, group, args) {
            var logname;
            for(var l in Log.LEVEL)
                if(Log.LEVEL[l] === level)
                    logname = l;

            if(group !== lastGroup && devTools) {
                console.groupEnd();
                console.group(group);
                lastGroup = group;
            }

            if(devTools)
                args.unshift("color: " + Log.COLORS[logname]);
            args.unshift( (devTools ? "%c" : "") + "[" + date + "][" + group + "] " + logname + ": ");

            if(level <= Log.LEVEL.INFO)
                log.apply(global.console, args);
            else if(level <= Log.LEVEL.CAUTION)
                warn.apply(global.console, args);
            else
                err.apply(global.console, args);
        }
    };
});

module.exports = Log;
