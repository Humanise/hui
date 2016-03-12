module.exports = function(grunt) {
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: ['js/*.js']
    },
    watch: {
      core: {
        files: ['src/main/webapp/WEB-INF/core/web/scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        }
      },
      reader: {
        files: ['src/main/webapp/WEB-INF/apps/reader/web/scss/**/*.scss'],
        tasks: ['sass:reader'],
        options: {
          spawn: false,
        }
      },
      words: {
        files: ['src/main/webapp/WEB-INF/apps/words/web/scss/**/*.scss'],
        tasks: ['sass:words'],
        options: {
          spawn: false,
        }
      }
    },
    sass: {
      core: {
        options : {sourcemap:'none'},
        files: [{
          expand: true,
          cwd: 'src/main/webapp/WEB-INF/core/web/scss/',
          src: ['*.scss'],
          dest: 'src/main/webapp/WEB-INF/core/web/css',
          ext: '.css'
        }]
      },
      reader: {
        options : {sourcemap:'none'},
        files: [{
          expand: true,
          cwd: 'src/main/webapp/WEB-INF/apps/reader/web/scss/',
          src: ['*.scss'],
          dest: 'src/main/webapp/WEB-INF/apps/reader/web/css',
          ext: '.css'
        }]
      },
      words: {
        options : {sourcemap:'none'},
        files: [{
          expand: true,
          cwd: 'src/main/webapp/WEB-INF/apps/words/web/scss/',
          src: ['*.scss'],
          dest: 'src/main/webapp/WEB-INF/apps/words/web/css',
          ext: '.css'
        }]
      }
    },
    qunit: {
      all: ['test/phantom/*.html']
    },
    jsdoc : {
      dist : {
        src: ['js/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },
    compass: {
      full: {
        options: {
          sassDir: "scss",
          cssDir: "css",
			    noLineComments: true,
        }
      }
    },
    shell: {
      all : {
        command : 'tools/all.sh'
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
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-autoprefixer');

  // Default task(s).
  grunt.registerTask('default', 'Watch', ['watch']);
  
  //grunt.registerTask('test', ['qunit']);
  grunt.registerTask('test', 'Run tests', function(testname) {
    if(!!testname) {
      grunt.config('qunit.all', ['test/phantom/' + testname + '.html']);
    }
    grunt.task.run('qunit:all');
  });
};