gc.comment = require './comment.coffee'

module.exports = class Commentslist
  _parent
  _target
  _index

  _availableOptions : ['_parent', '_target', '_index']

  constructor: (args...)->
    @_initVars(args)

    return @

  _initVars: (options...)->
    console.log options
    # _.extend(@, _.pick(options, @_availableOptions))

    return @

  _render: ()->
    return @