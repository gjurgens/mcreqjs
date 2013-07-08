/*
 * mcReqJs
 *
 * Copyright (c) 2013 Gabriel Jürgens
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'package.json',
        'lib/mcreqjs.js',
        'spec/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    shell: {
        test: {
            command: 'node node_modules/jasmine-node/bin/jasmine-node --captureExceptions --verbose spec/mcreqjs.spec.js',
            options: {
              stdout: true,
              failOnError: true
            }
        }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
          'AUTHOR: <%= pkg.author.name %> (<%= pkg.author.url %>) - ' +
          'LICENCE: <%= pkg.licenses[0].type %> (<%= pkg.repository.url %>/<%= pkg.version %>/<%= pkg.licenses[0].file %>)' +
          '*/\n',
        sourceMap: 'dist/mcreqjs-map.js',
        sourceMappingURL: '<%= pkg.repository.url %>/<%= pkg.version %>/dist/mcreqjs-map.js'
      },
      dist: {
        src: 'lib/mcreqjs.js',
        dest: 'dist/mcreqjs.min.js'
      }
    },
    clean: {
      test: ['dist']
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');

  //Test alias
  grunt.registerTask('test', ['jshint','shell:test']);

  // By default, lint, run all tests and build
  grunt.registerTask('default', ['jshint', 'shell:test','clean','uglify']);
};
