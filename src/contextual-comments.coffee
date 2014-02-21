class Contextualcomments
  # Globals variables
  target                  : 'body'
  selector                : 'p, img, li'
  containerId             : 'comments-container'
  comments                : []
  gapBetweenButtonAndList : 20

  # template
  templateFile              : './templates/template.html'

  # private variables
  # _container
  # _containerTemplate
  # _commentsListTemplate
  # _commentTemplate
  _commentsLists    : []
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
        that._containerTemplate = _.subpart(data, 'container')
        that._commentsListButtonTemplate = _.subpart(data, 'list button')
        that._commentsListTemplate = _.subpart(data, 'list')
        that._commentTemplate = _.subpart(data, 'comment')

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
    @target.find(@selector).each(()->
      list = new gc.Commentslist({
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

if module?.exports then exports.gc.Contextualcomments = Contextualcomments else window.gc.Contextualcomments = Contextualcomments