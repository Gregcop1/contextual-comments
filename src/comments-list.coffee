class Commentslist
  # _parent
  # _target
  # _index
  # _button
  _comments   : []

  constructor: (options)->
    @_initVars(options)
      ._retrieveComments()
      ._render()
      ._binds()

    return @

  _initVars: (options)->
    @_parent = options?.parent || null
    @_target = options?.target || null

    @_target = $(@_target)
    @_index = @_target.index()

    return @

  _retrieveComments: ()->
    if(@_parent)
      @_comments = @_parent._getCommentsByIndexAndParentId(@_index, 0)

    return @

  _getLabel: ()->
    return if @_comments.length then @_comments.length else '+'

  _getPosition: () ->
    target = $(@_target)
    offset = target.offset()
    return {
      top: offset.top,
      left: ( offset.left + target.outerWidth() + @_parent.gapBetweenButtonAndList)
    }

  _showButton: (e) ->
    that = e.data.that
    that._isButtonShown = true

    that._button.fadeIn('fast')

    return $(this)

  _hideButton: (e) ->
    that = e.data.that
    force = e.data.force
    that._isButtonShown = that._comments.length
    if !that._isButtonShown && force
      that._button.fadeOut(0)
    else
      setTimeout(()->
        if !that._isButtonShown
          that._button.fadeOut('fast')
      , 1000)

    return $(this)

  _hoverButton: (e) ->
    that = e.data.that
    target = $(e.target)

    that._isButtonShown = true
    target.addClass('comment-active')
    return target

  _outButton: (e) ->
    target = $(e.target)

    target.removeClass('comment-active')
    return target

  _showList: () ->

    return @

  _hideList: () ->
    return @

  _binds: () ->
    @_button.on('mouseenter', { that: @ }, @_showButton)
      .on('mouseenter', { that: @ }, @_hoverButton)
      .on('mouseleave', @_outButton)
    @_target.on('mouseenter', { that: @ }, @_showButton)
      .on('mouseout', { that: @ }, @_hideButton)

    return @

  _renderButton: ()->
    @_button = $(_.template(@_parent._commentsListButtonTemplate, { label: @_getLabel() }))
    position  = @_getPosition()
    @_button.css({ top: position.top, left: position.left })
              .appendTo(@_parent._container);
    @_hideButton({ data : { force: true, that: @ }})

    return @

  _render: ()->
    @_renderButton();

    return @

if module?.exports then exports.gc.Commentslist = gc.Commentslist else window.gc.Commentslist = Commentslist