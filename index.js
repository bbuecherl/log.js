var Log = require("./dist/log.node.js");
Log.config({ level: Log.LEVEL.DEBUG });
Log.use(Log.Console(Log.LEVEL.DEBUG));
Log.info("asdf");
