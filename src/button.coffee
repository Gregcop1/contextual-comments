class Button
  # _cc
  # _index
  # _label
  # _target
  # _el
  # _isShown
  # _commentLength

  constructor: (options)->
    @_initVars(options)
      ._refreshLabel()
      ._render()
      ._binds()
    return @

  _initVars: (options)->
    @_cc = options?.cc || null
    @_target = $(options?.target) || null
    if @_target
      @_index = @_target.index()
    return @

  _refreshLabel: ()->
    comments = @_cc._getCommentsByIndex(@_index)
    @_commentLength = comments.length
    @_label = if @_commentLength then @_commentLength else '+'
    @_render()
    return @

  _getPosition: () ->
    target = $(@_target)
    offset = target.offset()
    return {
      top: offset.top,
      left: ( offset.left + target.outerWidth() + @_cc.gapBetweenButtonAndList)
    }

  _show: (e) =>
    target = $(e.target)
    @_isShown = true
    @_el.fadeIn('fast')

    return target

  _hide: (e) =>
    target = $(e.target)
    that = @
    force = e.data?.force
    @_isShown = @_commentLength
    if !@_isShown && force
      @_el.fadeOut(0)
    else
      setTimeout(()->
        if !that._isShown
          that._el.fadeOut('fast')
      , 1000)

    return target

  _hover: (e) =>
    target = $(e.target)
    @_isShown = true
    target.addClass('comment-active')
    return target

  _out: (e) =>
    target = $(e.target)
    target.removeClass('comment-active')
    return target

  _click: (e) =>
    target = $(e.target)
    @_cc.dispatcher.trigger('hideAllLists')
    @_cc.dispatcher.trigger('showList', @_target)
    return target

  _binds: () ->
    @_el.on('mouseenter', @_show)
      .on('mouseenter', @_hover)
      .on('mouseleave', @_out)
      .on('click', @_click)
    @_target.on('mouseenter', @_show)
      .on('mouseout', @_hide)
    return @

  _render: ()->
    @_el = $(_.template(@_cc._buttonView, { label: @_label }))
    position  = @_getPosition()
    @_el.css({ top: position.top, left: position.left })
              .appendTo(@_cc._container)
    @_hide({ data : { force: true }})
    return @


if module?.exports then exports.gc.comments.Button = Button else window.gc.comments.Button = Button