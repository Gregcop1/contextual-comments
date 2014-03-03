class List
  # _cc
  # _target
  # _index
  # _el
  # _form
  _comments            : []

  constructor: (options)->
    @_initVars(options)
      ._retrieveComments()
      ._build()
      ._binds()
    return @

  _initVars: (options)->
    @_cc = options?.cc || null
    @_target = options?.target || null
    if @_target
      @_target = $(@_target)
      @_index = @_target.index()
    return @

  _retrieveComments: ()->
    if(@_cc)
      @_commentsTemp = @_cc._getCommentsByIndexAndParentId(@_index, 0)
      @_comments = @_parseComments(@_commentsTemp, [])
    return @

  _parseComments: (ori, dest)->
    if ori && ori.length
      ori.forEach((item)=>
        dest.push( new gc.comments.Comment( _.extend(item, { _cc: @_cc }) ))
        if(item.children)
            dest = @_parseComments(item.children, dest)
      )

    return dest

  _getPosition: () ->
    target = $(@_target)
    offset = target.offset()
    return {
      top: offset.top,
      left: ( offset.left + target.outerWidth() - @_el.outerWidth())
    }

  _show: (e, target) =>
    @_cc.dispatcher.trigger('hideAllForms')
    if target == @_target.get(0)
      if @_ghostEl
        @_el.appendTo(@_cc._container)
          .fadeIn('fast')
        position  = @_getPosition()
        @_el.css({ top: position.top, left: position.left })
        @_ghostEl = null
      else
        @_hide()
    return e.target

  _hide: (e, except) =>
    if !except || except != @_target.get(0)
      @_el.fadeOut('fast', ()=>
        @_ghostEl = @_el.detach()
      )
    return @

  _showForm: (e)=>
    @_cc.dispatcher.trigger('hideAllForms')
    target = $(e.target)
      .slideUp('fast')
    @_form.show()
      ._el.insertAfter(target)
    return @

  _showReply: ()=>
    @_el.find('.reply')
      .slideDown('fast')
    return @

  _binds: () ->
    @_cc.dispatcher.on('showList', @_show)
    @_cc.dispatcher.on('hideAllLists', @_hide)
    @_el.find('.reply').click(@_showForm)
    @_cc.dispatcher.on('hideAllForms', @_showReply)
    @_hide()
    return @

  _build: ()->
    @_el = $(_.template(@_cc._listView, {
      comments   : @_comments
      replyLabel : @_cc.ll('form.replyLabel')
      form       : @_form
    }))

    @_form = new gc.comments.Form({
      cc: @_cc
      parent: @
    })
    return @

if module?.exports then exports.gc.comments.List = List else window.gc.comments.List = List