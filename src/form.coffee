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

  _binds: () ->
    return @

  _build: () ->
    @_el = $(_.template(@_cc._formView, {
      authorlabel: @_cc.ll('form.authorLabel')
      emaillabel: @_cc.ll('form.emailLabel')
      messagelabel: @_cc.ll('form.messageLabel')
      submitlabel: @_cc.ll('form.submitLabel')
      cancellabel: @_cc.ll('form.cancelLabel')
    }))
    return @

if module?.exports then exports.gc.comments.Form = Form else window.gc.comments.Form = Form