require("./src/intro.js");
require("./src/logger.js");
require("./src/main.js");
require("./src/ext/console.js");

console.log(Log);
Log.config({
    level: Log.LEVEL.DEBUG
});
Log.use(Log.Console(Log.LEVEL.DEBUG));
Log.info("test");
