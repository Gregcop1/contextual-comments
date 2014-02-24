class List
  # _parent
  # _target
  # _index
  # _button
  # _list
  _comments            : []
  _commentsOfAllLevels : []

  constructor: (options)->
    @_initVars(options)
      ._retrieveComments()
      ._build()
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
      @_commentsOfAllLevels = @_parent._getCommentsByIndex(@_index)


    return @

  _getLabel: ()->
    return if @_commentsOfAllLevels.length then @_commentsOfAllLevels.length else '+'

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
    that._isButtonShown = that._commentsOfAllLevels.length
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

  _buildButton: ()->
    # @_button = $(_.template(@_parent._buttonView, { label: @_getLabel() }))
    # position  = @_getPosition()
    # @_button.css({ top: position.top, left: position.left })
    #           .appendTo(@_parent._container);
    # @_hideButton({ data : { force: true, that: @ }})

    return @

  _buildList: ()->
    @_list = $(_.template(@_parent._listView, { comments: @_comments }))
    return @

  _build: ()->
    # @_buildButton();
    # @_buildList();

    return @

if module?.exports then exports.gc.comments.List = List else window.gc.comments.List = List