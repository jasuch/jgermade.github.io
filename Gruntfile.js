
module.exports = function(grunt) {

  // Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// This shows system notifications. is very useful for debug
	grunt.task.run('notify_hooks');

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    dir: {
      styles: 'styles',
      css: 'assets/css'
    },

    less: {
      development: {
        options: {
          paths: ['<%= dir.css %>']
        },
        files: {
          '<%= dir.css %>/site.css': '<%= dir.styles %>/main.less'
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      styles: {
        files: ['<%= dir.styles %>/{,**/}*.less'],
        tasks: ['less'],
        options: {
          spawn: false,
        }
      },
      scripts: {
        files: ['{,**/}*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      },
			templates: {
        files: ['templates/{,**/}*.html'],
        tasks: ['templates'],
        options: {
          spawn: false,
        },
      }
    },

    jshint: {
      all: ['**/*.js', '!node_modules/**/*.js', '!.bower_components/**/*.js' ]
    },

    fileserver: {
      dev: {
        options: {
          port: 8080,
          hostname: '0.0.0.0',
          root: '.',
          openInBrowser: true
        }
      }
    }
  });

  grunt.registerTask('templates', function () {

		var layout = require('jengine-template').compile( grunt.file.read('templates/layout.html') ),
				Scope = require('jengine-scope'),
    		data = new Scope();

		grunt.file.write('index.html', layout( data.$$new({ lang: 'en', i18n: grunt.file.readJSON('i18n/en.json') }) ) );

  });

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'templates', 'less', 'fileserver', 'watch']);

};
