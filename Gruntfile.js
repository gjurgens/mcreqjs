/*
 * mcReqJs
 *
 * Copyright (c) 2014 Gabriel Jürgens
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
    concat: {
      options: {
        banner: '/*!\n * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * (<%= pkg.description %>)\n *\n' +
        ' * Author: <%= pkg.author.name %> (<%= pkg.author.url %>)\n */\n\n'
      },
      dist: {
        src: ['LICENSE-MIT.js','lib/mcreqjs.js'],
        dest: 'dist/mcreqjs.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
          'AUTHOR: <%= pkg.author.name %> (<%= pkg.author.url %>) - ' +
          'LICENCE: https://raw.github.com/gjurgens/mcreqjs/<%= pkg.version %>/<%= pkg.licenses[0].file %>)' +
          '*/\n',
        sourceMap: 'dist/mcreqjs-map.js',
        sourceMapPrefix: 1,
        sourceMappingURL: 'https://raw.github.com/gjurgens/mcreqjs/<%= pkg.version %>/dist/mcreqjs-map.js'
      },
      dist: {
        src: 'dist/mcreqjs.js',
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
  grunt.loadNpmTasks('grunt-contrib-concat');

  //Test alias
  grunt.registerTask('test', ['jshint','shell:test']);

  // By default, lint, run all tests and build
  grunt.registerTask('default', ['jshint', 'shell:test','clean','concat','uglify']);
};
