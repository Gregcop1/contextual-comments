'use strict'

try
  if typeof($) == 'undefined' || $ == null
    throw 'You must include jQuery'
  if typeof(_) == 'undefined' || _ == null
    throw 'You must include undescore'
catch error
  console.warn 'Error : '+error

if( !window.gc )
	window.gc = {}

if( !window.gc.comments )
	window.gc.comments = {}

_.extend(_,
	subpart: (text, subpart) ->
    rec = false
    content = ''
    $(text).toArray().forEach((item)->
      if(item.nodeName != '#comment' && rec)
        newContent = if (item.outerHTML ) then item.outerHTML else item.textContent
        content += newContent.replace(/[\n\r\t]/g, '').trim()
      else if(item.nodeName == '#comment')
        if(item.data.trim() == subpart+' template start')
          rec = true
        if(item.data.trim() == subpart+' template end')
          rec = false
    )
    return _.unescape(content)
)