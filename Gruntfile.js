
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
        files: ['templates/{,**/}*.html', 'i18n/{,**/}*.*'],
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

		var marked = require('marked'),
				layout = require('jengine-template').compile( grunt.file.read('templates/layout.html') ),
				Scope = require('jengine-scope'),
    		data = new Scope(),
				langsList = ['en'];

		langsList.forEach(function (lang) {

			langData = data.$$new({
				lang: lang,
				i18n: grunt.file.readJSON('i18n/' + lang + '/texts.json'),
				aboutMe: marked( grunt.file.read('i18n/' + lang + '/about-me.md') ),
				otherLangs: langsList.slice().filter(function (langCode) { return langCode !== lang; })
			});

			grunt.file.write( lang === 'en' ? 'index.html' : ( lang + '/index.html' ) , layout( langData ) );

		});

  });

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'templates', 'less', 'fileserver', 'watch']);

};
