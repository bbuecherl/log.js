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
