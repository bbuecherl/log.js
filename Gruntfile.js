module.exports = function(grunt) {
    var srcFiles = [
            "src/intro.js",
            "src/logger.js",
            "src/main.js",
            "src/ext/dom.js",
            "src/ext/console.js"
        ],
        devFile = "dist/log.dev.js",
        minFile = "dist/log.min.js";

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: "/**\n"
                    + " * Log.js v<%= pkg.version %>-<%= grunt.template.today('yymmddHHMM') %>\n"
                    + " * https://github.com/bbuecherl/log.js/\n"
                    + " * by Bernhard Buecherl http://bbuecherl.de/\n"
                    + " * License: MIT http://bbuecherl.mit-license.org/"
                    + " */\n!(function(GLOBAL) {\n",
                seperator: "\n",
                footer: "\n}(window));\n"
            },
            dist: {
                src: srcFiles,
                dest: devFile
            }
        },

        uglify: {
            options: {
                banner: "/**\n"
                    + " * Log.js v<%= pkg.version %>-<%= grunt.template.today('yymmddHHMM') %>\n"
                    + " * https://github.com/bbuecherl/log.js/\n"
                    + " * by Bernhard Buecherl http://bbuecherl.de/\n"
                    + " * License: MIT http://bbuecherl.mit-license.org/"
                    + " */\n",
            },
            dist: {
                src: [devFile],
                dest: minFile
            }
        },
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    //Tasks
    grunt.registerTask("build", ["concat", "uglify"]);
};
