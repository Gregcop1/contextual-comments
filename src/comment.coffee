class Comment
  # _cc
  # uid
  # parentId
  # index
  # selection
  # author
  # email
  # comment
  _availableOptions : ['_cc', 'uid', 'parentId', 'index', 'selection', 'author', 'email', 'comment']

  constructor: (options)->
    @_initVars(options)
      ._render()
    return @

  _initVars: (options)->
    _.extend(@, _.pick(options, @_availableOptions))
    return @

  _binds: (options)->
    return @

  _getAvatar: ()->
    return '<img src="http://www.gravatar.com/avatar/'+gc.comments.MD5(@email)+'?s=50" alt=""/>'

  _render: (options)->
    @_el = (_.template(@_cc._commentView, {
      avatar: @_getAvatar(),
      author: @author,
      comment: @comment
      parentId: @parentId
    }))
    return @

if module?.exports then exports.gc.comments.Comment = Comment else window.gc.comments.Comment = Comment