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

  grunt.initConfig
    gc: gcConfig

    pkg: grunt.file.readJSON('package.json')

    browserify:
      dist:
        files:
          '<%=gc.dist %>/<%= pkg.name %>.js': '<%=gc.src %>/<%= pkg.name %>.coffee'
        options:
          transform: ['coffeeify']

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
        livereload: 35729
      copy:
        files: ['<%=gc.src %>/templates/**']
        tasks: ['copy:templates']
      browserify:
        files: ['<%=gc.src %>/*.coffee', '<%=gc.src %>/templates/*.html']
        tasks: ['browserify:dist']
      uglify:
        files: ['<%=gc.dist %>/<%= pkg.name %>.js']
        tasks: ['uglify:build']
      examples:
        files: ['examples/*', 'lib/<%= pkg.name %>.min.js']

  grunt.registerTask 'default', [
    'browserify',
    'uglify',
    'copy',
    'watch'
  ]

  grunt.registerTask 'serve', [
    'coffee',
    'uglify',
    'copy'
  ]