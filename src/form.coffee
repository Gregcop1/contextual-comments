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

  _binds: () ->
    @_el.find('.cancel').click(@_hide)
    return @

  _build: () ->
    @_el = $(_.template(@_cc._formView, {
      authorlabel: @_cc.ll('form.authorLabel')
      emaillabel: @_cc.ll('form.emailLabel')
      messagelabel: @_cc.ll('form.messageLabel')
      submitlabel: @_cc.ll('form.submitLabel')
      cancellabel: @_cc.ll('form.cancelLabel')
    })).appendTo(@_parent._el.find('ul'))
    return @

if module?.exports then exports.gc.comments.Form = Form else window.gc.comments.Form = Form