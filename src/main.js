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
