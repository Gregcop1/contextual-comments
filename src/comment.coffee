class Comment
  # _parent
  # uid
  # parentId
  # index
  # selection
  # author
  # email
  # comment
  _availableOptions : ['uid', 'parentId', 'index', 'selection', 'author', 'email', 'comment']

	constructor: (options)->
    @_initVars(options)

    return @

  _initVars: (options)->
    _.extend(@, _.pick(options, @_availableOptions))

    return @

  render: (options)->

    return @

if module?.exports then exports.gc.comments.Comment = Comment else window.gc.comments.Comment = Comment