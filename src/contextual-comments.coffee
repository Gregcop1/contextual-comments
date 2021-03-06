class Contextualcomments
  # Globals variables
  target                  : 'body'
  selector                : 'p, img, li'
  containerId             : 'comments-container'
  comments                : []
  gapBetweenButtonAndList : 20
  dispatcher              : $({})

  # template
  templateFile              : './templates/template.html'

  # private variables
  # _container
  # _containerView
  # _listView
  # _commentView
  _buttons          : []
  _lists            : []
  _availableOptions : ['target', 'selector', 'containerId', 'comments', 'gapBetweenButtonAndList', 'templateFile']

  constructor: (options)->
    @_initVars(options)
      ._initTemplates()
    return @

  _initVars: (options)->
    _.extend(@, _.pick(options, @_availableOptions))

    if typeof @target == 'string'
      @target = $(@target)

    return @

  _initTemplates: ()->
    that = @
    $.ajax(@templateFile)
      .success((data) ->
        that._containerView = _.subpart(data, 'container')
        that._buttonView = _.subpart(data, 'button')
        that._listView = _.subpart(data, 'list')
        that._commentView = _.subpart(data, 'comment')

        that._render())
    return @

  _getCommentsByIndexAndParentId: (index, parentId)->
    comments = []
    that = @

    @comments.forEach( (comment)->
      if comment.index == index && comment.parentId == parentId
        comment.children = that._getCommentsByIndexAndParentId(index, comment.uid)
        comments.push(comment)
    )

    return comments

  _getCommentsByIndex: (index)->
    comments = []
    that = @

    @comments.forEach( (comment)->
      if comment.index == index
        comments.push(comment)
    )

    return comments

  _build: ()->
    that = @
    @target.find(@selector).each(()->
      # button
      button = new gc.comments.Button({
        cc: that,
        target: this
      })
      that._buttons.push(button)

      # list
      list = new gc.comments.List({
        cc: that,
        target: this
      })
      that._lists.push(list)
    )
    return @

  _render: ()->
    @_container = $(_.template(@_containerView, { container: @containerId }))
    @_container.appendTo('body')

    @_build()

    return @

if module?.exports then exports.gc.Contextualcomments = Contextualcomments else window.gc.Contextualcomments = Contextualcomments