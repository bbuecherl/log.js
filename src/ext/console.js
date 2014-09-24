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
