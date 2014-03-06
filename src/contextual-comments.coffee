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

  # localization
  _currentLanguage : 'en'
  _l10n:
    en:
      'form.replyLabel'   : 'Reply'
      'form.leaveANote'   : 'Leave a note'
      'form.cancelLabel'  : 'Cancel'
      'form.authorLabel'  : 'Author'
      'form.emailLabel'   : 'Email'
      'form.messageLabel' : 'Message'

  # private variables
  # _container
  # _containerView
  # _listView
  # _commentView
  # _formView
  _buttons          : []
  _lists            : []
  _availableOptions : ['target', 'selector', 'containerId', 'comments', 'gapBetweenButtonAndList', 'templateFile']

  constructor: (options)->
    @_initVars(options)
      ._initTemplates()
    return @

  ll: (key)->
    return @_l10n[@_currentLanguage][key]

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
        that._formView = _.subpart(data, 'form')

        that._render()
          ._binds()
      )
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

  addComment: (e, data)=>
    if data?.comment
      @comments.push(data.comment)
      console.log @comments
    return @

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

  _binds: ()->
    @dispatcher.on('addComment', @addComment)
    return @

  _render: ()->
    @_container = $(_.template(@_containerView, { container: @containerId }))
    @_container.appendTo('body')

    @_build()

    return @

if module?.exports then exports.gc.Contextualcomments = Contextualcomments else window.gc.Contextualcomments = Contextualcomments