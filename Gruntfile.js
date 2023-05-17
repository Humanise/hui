const sass = require('node-sass');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: {
          options: {
              reporterOutput: ''
          },
          src: ['js/*.js', '!js/compatibility.js', '!js/hui_require.js']
        }
    },
    watch: {
      scss: {
        files: ['scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        }
      },
//      css: {
//        files: ['css/**/*.css'],
//        tasks: ['shell:join'],
//        options: {
//          spawn: false,
//        }
//      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['shell:join','uglify:joined'],
        options: {
          spawn: false,
        }
      },
      ts: {
        files: ['ts/**/*.ts'],
        tasks: ['shell:tsc'],
        options: {
          spawn: false,
        }
      },
      joined_css: {
        files: ['bin/joined.css','bin/joined.site.css'],
        tasks: ['cssmin'],
        options: {
          spawn: false,
        }
      }
    },
    qunit: {
      local: ['test/unittests/*.html'],
      live : {
        options : {
          timeout : 15000,
          urls: [
          ]
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['js/*.js'],
        options: {
          destination: 'api',
          template : "node_modules/ink-docstrap/template",
          configure : "api/jsdoc.conf.json"
        }
      }
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: false,
        outputStyle: 'nested'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'scss',
          src: ['*.scss'],
          dest: 'css',
          ext: '.css'
        }]
      }
    },
    shell: {
      all : {
        command : 'tools/all.sh'
      },
      join : {
        command : 'node tools/join.js'
      },
      tsc : {
        command : 'npx tsc'
      }
    },
    uglify : {
      'all' : {
        files: [{
          expand: true,
          cwd: 'js',
          src: '**/*.js',
          dest: 'bin/js'
        }]
      },
      some : {
        files : {
          'bin/minimised.js': ['js/hui.js', 'js/ui.js']
        }
      },
      joined : {
        files : {
          'bin/minimized.js': ['bin/joined.js']
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'bin/minimized.css': ['bin/joined.css']
        }
      }
    },
    jsbeautifier : {
      files : ["js/Alert.js", "js/Bar.js", "js/BoundPanel.js", "js/DropDown.js", "js/VideoPlayer.js"],
      options : {
        js: {
          indentSize: 2
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8888,
          base: '../',
          keepalive: !true,
          middleware: function(connect, options, middlewares) {
            // inject a custom middleware into the array of default middlewares
            middlewares.unshift(function(req, res, next) {
              req.method = 'GET';
              return next();
            });

            return middlewares;
          }
        }
      },
      run: {
        options: {
          port: 8888,
          base: '../',
          keepalive: true,
          middleware: function(connect, options, middlewares) {
            // inject a custom middleware into the array of default middlewares
            middlewares.unshift(function(req, res, next) {
              req.method = 'GET';
              return next();
            });

            return middlewares;
          }
        }
      }
    }
  });

  // Load plugins.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', 'Watch', ['sass','watch']);

  grunt.registerTask('build', 'Build', ['sass', 'shell:join', 'uglify:joined', 'cssmin', 'shell:tsc']);

  grunt.registerTask('doc', 'Docs', ['jsdoc']);

  grunt.registerTask('test', 'Run tests', function(testname) {
    grunt.task.run('connect:server');
    var tests = grunt.file.expand('test/unittests/*.html');
    if (!!testname) {
      tests = ['test/unittests/' + testname + '.html'];
    }
    for (var i = 0; i < tests.length; i++) {
      tests[i] = 'http://0.0.0.0:8888/hui/' + tests[i];
    }
    grunt.config('qunit.live.options.urls', tests);
    grunt.task.run('qunit:live');
  });

  grunt.registerTask('run', 'Run', function(testname) {
    grunt.task.run('connect:run');
  });
};