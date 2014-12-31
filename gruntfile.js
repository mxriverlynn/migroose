module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    meta: {
      version: "<%= pkg.version %>",
      banner:
        "// <%= pkg.name %>\n" + 
        "// ------\n" + 
        "// <%= pkg.description %>" + 
        "// \n" + 
        "// v<%= pkg.version %>\n" +
        "// Copyright (C)<%= grunt.template.today('yyyy') %> Muted Solutions, LLC.\n" + 
        "// Distributed under <%= pkg.license %> license\n" + 
        "// \n" +
        "// <%= pkg.homepage %>\n" +
        "\n"
    },

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      src: [ "mongrate/**/*.js" ]
    },

    jasmine_node: {
      options: {
        forceExit: true,
        match: ".",
        matchall: false,
        extensions: "js",
        specNameMatcher: "[Ss][Pp][Ee][Cc][Ss]",
        useHelpers: true,
        helperNameMatcher: "-helper",
        jUnit: {
          report: false
        }
      },
      all: ["specs/"]
    },

    watch: {
      specs: {
        files: ["mongrate/**/*.js", "specs/**/*.js"],
        tasks: ["specs"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-jasmine-node");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("specs", ["jshint", "jasmine_node:all"]);
  grunt.registerTask("default", ["specs", "watch"]);
};
