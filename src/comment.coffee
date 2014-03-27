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
      ._binds()
    return @

  _initVars: (options)->
    _.extend(@, _.pick(options, @_availableOptions))
    return @

  _bindDatas: ()=>
    @_el = $(@_el)
    $.data(@_el, 'uid', @uid)
    $.data(@_el, 'index', @index)
    $.data(@_el, 'parentId', @parentId)
    $.data(@_el, 'selection', @selection)
    return @

  _binds: (options)->
    @_cc.dispatcher.on('bindDatasToCommentsItem', @_bindDatas)
    return @

  _getAvatar: ()->
    return '<img src="http://www.gravatar.com/avatar/'+gc.comments.MD5(@email)+'?s=40" alt=""/>'

  _render: (options)->
    @_el = (_.template(@_cc._commentView, {
      avatar: @_getAvatar()
      author: @author
      comment: @comment
      parentId: @parentId
      replyLabel : @_cc.ll('form.replyLabel')
      removeLabel : @_cc.ll('form.removeLabel')
    }))
    return @

if module?.exports then exports.gc.comments.Comment = Comment else window.gc.comments.Comment = Comment