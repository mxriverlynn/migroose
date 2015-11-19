module.exports = function(grunt){
  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      src: [ "migroose/**/*.js" ]
    },

    jasmine_nodejs: {
      options: {
        specNameSuffix: "-specs.js",
        helperNameSuffix: ".js",
        useHelpers: true,
        helpers: ["specs/helpers/**"]
      },
      all: {
        specs: ["specs/**/*-specs.js"]
      },
    },

    watch: {
      specs: {
        files: ["migroose/**/*.js", "specs/**/*.js"],
        tasks: ["specs"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-jasmine-nodejs");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("specs", ["jshint", "jasmine_nodejs:all"]);
  grunt.registerTask("default", ["specs", "watch"]);
};
