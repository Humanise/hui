module.exports = function(grunt) {
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: ['js/*.js']
    },
    watch: {
      scss: {
        files: ['src/main/webapp/WEB-INF/apps/reader/web/scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        }
      }
    },
    sass: {
      dist: {
        options : {sourcemap:'none'},
        files: [{
          expand: true,
          cwd: 'src/main/webapp/WEB-INF/apps/reader/web/scss/',
          src: ['*.scss'],
          dest: 'src/main/webapp/WEB-INF/apps/reader/web/css',
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