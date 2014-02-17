try
  if typeof($) == 'undefined' || $ == null
    throw 'You must include jQuery'
  if typeof(_) == 'undefined' || _ == null
    throw 'You must include undescore'
catch error
  console.warn 'Error : '+error

window.gc = {}
gc.commentsList = require './comments-list.coffee'

gc.contextualcomments = class Contextualcomments
  # Globals variables
  target                  : 'body'
  selector                : 'p, img, li'
  containerId             : 'comments-container'
  comments                : []
  gapBetweenButtonAndList : 20

  # templates
  templatePaths            : './templates/'
  containerTemplateFile    : 'container.html'
  commentsListTemplateFile : 'commentsList.html'
  commentsListButtonTemplateFile : 'commentsListButton.html'
  commentTemplateFile      : 'comment.html'

  # private variables
  # _container
  # _containerTemplate
  # _commentsListTemplate
  # _commentTemplate
  _commentsLists    : []
  _availableOptions : ['target', 'selector', 'containerId', 'comments', 'gapBetweenButtonAndList', 'templatePaths', 'containerTemplateFile', 'commentsListTemplateFile', 'commentTemplateFile']

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
    $.when(
      $.get( @templatePaths+@containerTemplateFile, (data)->
        that._containerTemplate = data
      );
      $.get( @templatePaths+@commentsListButtonTemplateFile, (data)->
        that.commentsListButtonTemplate = data
      );
      $.get( @templatePaths+@commentsListTemplateFile, (data)->
        that._commentsListTemplate = data
      );
      $.get( @templatePaths+@commentTemplateFile, (data)->
        that._commentTemplate = data
      );
    ).then(()->
      that._render())

    return @

  _getCommentsByIndexAndParentId: (index, parentId, comments)->
    if !comments
      comments = []
    that = @

    @comments.forEach( (comment)->
      if comment.index == index && comment.parentId == parentId
        comments.push(comment)
        that._getCommentsByIndexAndParentId(index, comment.uid, comments)
    )

    return comments

  _buildLists: ()->
    that = @
    $(@target).find(@selector).each(()->
      list = new gc.commentsList({
        parent: that,
        target: this
      })
      that._commentsLists.push(list)
    )

    return @

  _render: ()->
    @_container = $(_.template(@_containerTemplate, { container: @containerId }))
    @_container.appendTo('body')

    @_buildLists()

    return @