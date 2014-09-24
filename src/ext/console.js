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
