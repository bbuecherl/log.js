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
