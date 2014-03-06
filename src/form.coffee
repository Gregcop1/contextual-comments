class Form
  # _cc
  # _parent
  # _el
  # _parentId
  # _index
  # _selection

  constructor: (options)->
    @_initVars(options)
      ._build()
      ._binds()
    return @

  _initVars: (options) ->
    @_cc = options?.cc || null
    @_parent = options?.parent || null
    return @

  show: ()->
    @_el.slideDown('fast')
    return @

  _hide: ()=>
    @_el.slideUp('fast')
    @_cc.dispatcher.trigger('hideAllForms')
    return @

  _empty: ()->
    form = @_el.find('form')
    form.get(0).reset()
    return @

  _formSubmit: (e)=>
    e.preventDefault()
    form = $(e.target)
    @_cc.dispatcher.trigger('addComment', { comment: {
      parentId: form.find('#cc-parentId').val(),
      index: form.find('#cc-index').val(),
      selection: form.find('#cc-selection').val(),
      author: form.find('#cc-author').val(),
      email: form.find('#cc-email').val(),
      message: form.find('#cc-message').val(),
    }})

    @_empty()
      ._hide()

    return @

  _binds: () ->
    @_el.find('.cancel').on('click', @_hide)
    @_el.find('form').on('submit', @_formSubmit)
    return @

  _build: () ->
    @_el = $(_.template(@_cc._formView, {
      authorLabel: @_cc.ll('form.authorLabel')
      emailLabel: @_cc.ll('form.emailLabel')
      messageLabel: @_cc.ll('form.messageLabel')
      submitLabel: @_cc.ll('form.leaveANote')
      cancelLabel: @_cc.ll('form.cancelLabel')
    })).appendTo(@_parent._el.find('ul'))
    return @

if module?.exports then exports.gc.comments.Form = Form else window.gc.comments.Form = Form