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
