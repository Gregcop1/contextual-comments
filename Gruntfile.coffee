# Generated on 2014-02-14 using generator-coffeelib 0.0.1
'use strict'

mountFolder = (connect, dir) ->
    connect.static require('path').resolve(dir)

module.exports = (grunt) ->
  # load all grunt tasks
  require("load-grunt-tasks")(grunt)

  gcConfig =
    src: 'src'
    dist : './lib'
    examples : './examples'

  grunt.initConfig
    gc: gcConfig

    pkg: grunt.file.readJSON('package.json')

    coffee:
      compileBare: {
        options: {
          join: true
        },
        files: {
          '<%=gc.dist %>/<%= pkg.name %>.js': [ '<%=gc.src %>/environment.coffee', '<%=gc.src %>/button.coffee', '<%=gc.src %>/list.coffee', '<%=gc.src %>/contextual-comments.coffee' ]
        }
      },

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
      build:
        src: '<%=gc.dist %>/<%= pkg.name %>.js'
        dest: '<%=gc.dist %>/<%= pkg.name %>.min.js'

    copy:
      templates:
        files: [
          expand: true,
          cwd: '<%=gc.src %>/templates/'
          src: ['**'],
          dest: '<%=gc.dist %>/templates',

        ]

    watch:
      options:
        livereload: grunt.option('liveport') || 35729
      copy:
        files: ['<%=gc.src %>/templates/**']
        tasks: ['copy:templates']
      coffee:
        files: ['<%=gc.src %>/*.coffee']
        tasks: ['coffee:compileBare']
      uglify:
        files: ['<%=gc.dist %>/<%= pkg.name %>.js']
        tasks: ['uglify:build']
      examples:
        files: ['<%=gc.examples %>/*', 'lib/<%= pkg.name %>.min.js']

    connect:
      all:
        options:
          livereload: grunt.option('liveport') || 35729
          port: grunt.option('port') || 9000
          hostname: "0.0.0.0"

  grunt.registerTask 'default', [
    'coffee',
    'uglify',
    'copy',
    'connect',
    'watch'
  ]

  grunt.registerTask 'serve', [
    'coffee',
    'uglify',
    'copy'
  ]