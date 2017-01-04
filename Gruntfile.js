module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: ['js/*.js']
    },
    watch: {
      scss: {
        files: ['scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        }
      },
      css: {
        files: ['css/**/*.css'],
        tasks: ['shell:join'],
        options: {
          spawn: false,
        }
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['shell:join','uglify:joined'],
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
      all: {
        options : {sourcemap:'none'},
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
        command : 'tools/join.sh'
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
          'bin/minimized.js': ['bin/joined.js'],
          'bin/minimized.site.js': ['bin/joined.site.js'],
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
          'bin/minimized.css': ['bin/joined.css'],
          'bin/minimized.site.css': ['bin/joined.site.css']
        }
      }
    }
  });

  // Load plugins.
  //grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', 'Watch', ['watch']);

  //grunt.registerTask('test', ['qunit']);
  grunt.registerTask('test', 'Run tests', function(testname) {
    var tests = grunt.file.expand('test/unittests/*.html');
    if (!!testname) {
      tests = ['test/unittests/' + testname + '.html']
    }
    for (var i = 0; i < tests.length; i++) {
      tests[i] = 'http://hui.local/' + tests[i]
    }
    grunt.config('qunit.live.options.urls', tests);
    grunt.task.run('qunit:live');
  });
};