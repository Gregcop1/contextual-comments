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

    coffee:
      build:
        options: {
          # bare: true
        },
        files:
          '<%=gc.dist %>/<%= pkg.name %>.js': '<%=gc.src %>/<%= pkg.name %>.coffee'

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
      build:
        src: '<%=gc.dist %>/<%= pkg.name %>.js'
        dest: '<%=gc.dist %>/<%= pkg.name %>.min.js'

    watch:
      options:
        livereload: grunt.option('port') || 35729
      coffee:
        files: ['<%=gc.src %>/*.coffee']
        tasks: ['coffee:build']
      examples:
        files: ['examples/**']

  grunt.registerTask 'default', [
    'coffee',
    'uglify',
    'watch'
  ]

  grunt.registerTask 'serve', [
    'coffee',
    'uglify'
  ]