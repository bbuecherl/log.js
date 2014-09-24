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
