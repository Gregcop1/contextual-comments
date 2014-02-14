# Generated on 2014-02-14 using generator-coffeelib 0.0.1
'use strict'

mountFolder = (connect, dir) ->
    connect.static require('path').resolve(dir)

module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  yeomanConfig =
    src: 'src'
    dist : './'

  grunt.initConfig
    yeoman: yeomanConfig

    coffee:
      build:
        files: [
          expand: true
          cwd: '<%= yeoman.src %>'
          src: '{,*/}*.coffee'
          dest: '<%= yeoman.dist %>'
          ext: '.js'
        ]

    uglify:
      build:
        src: '<%=yeoman.dist %>/jquerycontextual-comments.js'
        dest: '<%=yeoman.dist %>/jquerycontextual-comments.min.js'

    mochaTest:
      test:
        options:
          reporter: 'spec'
          compilers: 'coffee:coffee-script'
        src: ['test/**/*.coffee']

    connect:
      all:
        options:
          port: grunt.option('port') || 0
          hostname: "localhost"
          middleware: (connect, options) ->
            return [
              # Serve the project folder
              connect.static(options.base)
            ]
    open:
      all:
        path: 'http://localhost:<%= connect.all.options.port %>/examples/'

    watch:
      options:
        livereload: grunt.option('port') || 35729
      coffee:
        files: ['src/*.coffee']
        tasks: ['coffee:build']
      html:
        files: ['examples/*']

    grunt.registerTask 'default', [
      'coffee:build'
      'uglify:build'
    ]

    grunt.registerTask 'server', [
      'coffee:build'
      'connect',
      'open'
      'watch'
    ]

