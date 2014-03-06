(function() {
  'use strict';
  var Button, Comment, Contextualcomments, Form, List, error,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  try {
    if (typeof $ === 'undefined' || $ === null) {
      throw 'You must include jQuery';
    }
    if (typeof _ === 'undefined' || _ === null) {
      throw 'You must include undescore';
    }
  } catch (_error) {
    error = _error;
    console.warn('Error : ' + error);
  }

  if (!window.gc) {
    window.gc = {};
  }

  if (!window.gc.comments) {
    window.gc.comments = {};
  }

  _.extend(_, {
    subpart: function(text, subpart) {
      var content, rec;
      rec = false;
      content = '';
      $(text).toArray().forEach(function(item) {
        var newContent;
        if (item.nodeName !== '#comment' && rec) {
          newContent = item.outerHTML ? item.outerHTML : item.textContent;
          return content += newContent.replace(/[\n\r\t]/g, '').trim();
        } else if (item.nodeName === '#comment') {
          if (item.data.trim() === subpart + ' template start') {
            rec = true;
          }
          if (item.data.trim() === subpart + ' template end') {
            return rec = false;
          }
        }
      });
      return _.unescape(content);
    }
  });

  Comment = (function() {
    Comment.prototype._availableOptions = ['_cc', 'uid', 'parentId', 'index', 'selection', 'author', 'email', 'comment'];

    function Comment(options) {
      this._initVars(options)._render();
      return this;
    }

    Comment.prototype._initVars = function(options) {
      _.extend(this, _.pick(options, this._availableOptions));
      return this;
    };

    Comment.prototype._binds = function(options) {
      return this;
    };

    Comment.prototype._getAvatar = function() {
      return '<img src="http://www.gravatar.com/avatar/' + gc.comments.MD5(this.email) + '?s=40" alt=""/>';
    };

    Comment.prototype._render = function(options) {
      this._el = _.template(this._cc._commentView, {
        avatar: this._getAvatar(),
        author: this.author,
        comment: this.comment,
        parentId: this.parentId
      });
      return this;
    };

    return Comment;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    exports.gc.comments.Comment = Comment;
  } else {
    window.gc.comments.Comment = Comment;
  }

  Form = (function() {
    function Form(options) {
      this._formSubmit = __bind(this._formSubmit, this);
      this._hide = __bind(this._hide, this);
      this._initVars(options)._build()._binds();
      return this;
    }

    Form.prototype._initVars = function(options) {
      this._cc = (options != null ? options.cc : void 0) || null;
      this._parent = (options != null ? options.parent : void 0) || null;
      return this;
    };

    Form.prototype.show = function() {
      this._el.slideDown('fast');
      return this;
    };

    Form.prototype._hide = function() {
      this._el.slideUp('fast');
      this._cc.dispatcher.trigger('hideAllForms');
      return this;
    };

    Form.prototype._empty = function() {
      var form;
      form = this._el.find('form');
      form.get(0).reset();
      return this;
    };

    Form.prototype._formSubmit = function(e) {
      var form;
      e.preventDefault();
      form = $(e.target);
      this._cc.dispatcher.trigger('addComment', {
        comment: {
          parentId: form.find('#cc-parentId').val(),
          index: form.find('#cc-index').val(),
          selection: form.find('#cc-selection').val(),
          author: form.find('#cc-author').val(),
          email: form.find('#cc-email').val(),
          message: form.find('#cc-message').val()
        }
      });
      this._empty()._hide();
      return this;
    };

    Form.prototype._binds = function() {
      this._el.find('.cancel').on('click', this._hide);
      this._el.find('form').on('submit', this._formSubmit);
      return this;
    };

    Form.prototype._build = function() {
      this._el = $(_.template(this._cc._formView, {
        authorLabel: this._cc.ll('form.authorLabel'),
        emailLabel: this._cc.ll('form.emailLabel'),
        messageLabel: this._cc.ll('form.messageLabel'),
        submitLabel: this._cc.ll('form.leaveANote'),
        cancelLabel: this._cc.ll('form.cancelLabel')
      })).appendTo(this._parent._el.find('ul'));
      return this;
    };

    return Form;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    exports.gc.comments.Form = Form;
  } else {
    window.gc.comments.Form = Form;
  }

  Button = (function() {
    function Button(options) {
      this._click = __bind(this._click, this);
      this._out = __bind(this._out, this);
      this._hover = __bind(this._hover, this);
      this._hide = __bind(this._hide, this);
      this._show = __bind(this._show, this);
      this._initVars(options)._refreshLabel()._render()._binds();
      return this;
    }

    Button.prototype._initVars = function(options) {
      this._cc = (options != null ? options.cc : void 0) || null;
      this._target = $(options != null ? options.target : void 0) || null;
      if (this._target) {
        this._index = this._target.index();
      }
      return this;
    };

    Button.prototype._refreshLabel = function() {
      var comments;
      comments = this._cc._getCommentsByIndex(this._index);
      this._commentLength = comments.length;
      this._label = this._commentLength ? this._commentLength : '+';
      this._render();
      return this;
    };

    Button.prototype._getPosition = function() {
      var offset, target;
      target = $(this._target);
      offset = target.offset();
      return {
        top: offset.top,
        left: offset.left + target.outerWidth() + this._cc.gapBetweenButtonAndList
      };
    };

    Button.prototype._show = function(e) {
      var target;
      target = $(e.target);
      this._isShown = true;
      this._el.fadeIn('fast');
      return target;
    };

    Button.prototype._hide = function(e) {
      var force, target, that, _ref;
      target = $(e.target);
      that = this;
      force = (_ref = e.data) != null ? _ref.force : void 0;
      this._isShown = this._commentLength;
      if (!this._isShown && force) {
        this._el.fadeOut(0);
      } else {
        setTimeout(function() {
          if (!that._isShown) {
            return that._el.fadeOut('fast');
          }
        }, 1000);
      }
      return target;
    };

    Button.prototype._hover = function(e) {
      var target;
      target = $(e.target);
      this._isShown = true;
      target.addClass('comment-active');
      return target;
    };

    Button.prototype._out = function(e) {
      var target;
      target = $(e.target);
      target.removeClass('comment-active');
      return target;
    };

    Button.prototype._click = function(e) {
      var target;
      target = $(e.target);
      this._cc.dispatcher.trigger('hideAllLists', this._target);
      this._cc.dispatcher.trigger('showList', this._target);
      return target;
    };

    Button.prototype._binds = function() {
      this._el.on('mouseenter', this._show).on('mouseenter', this._hover).on('mouseleave', this._out).on('click', this._click);
      this._target.on('mouseenter', this._show).on('mouseout', this._hide);
      return this;
    };

    Button.prototype._render = function() {
      var position;
      this._el = $(_.template(this._cc._buttonView, {
        label: this._label
      }));
      position = this._getPosition();
      this._el.css({
        top: position.top,
        left: position.left
      }).appendTo(this._cc._container);
      this._hide({
        data: {
          force: true
        }
      });
      return this;
    };

    return Button;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    exports.gc.comments.Button = Button;
  } else {
    window.gc.comments.Button = Button;
  }

  List = (function() {
    List.prototype._comments = [];

    function List(options) {
      this._addComment = __bind(this._addComment, this);
      this._showReply = __bind(this._showReply, this);
      this._showForm = __bind(this._showForm, this);
      this._hide = __bind(this._hide, this);
      this._show = __bind(this._show, this);
      this._initVars(options)._retrieveComments()._build()._binds();
      return this;
    }

    List.prototype._initVars = function(options) {
      this._cc = (options != null ? options.cc : void 0) || null;
      this._target = (options != null ? options.target : void 0) || null;
      if (this._target) {
        this._target = $(this._target);
        this._index = this._target.index();
      }
      return this;
    };

    List.prototype._retrieveComments = function() {
      if (this._cc) {
        this._commentsTemp = this._cc._getCommentsByIndexAndParentId(this._index, 0);
        this._comments = this._parseComments(this._commentsTemp, []);
      }
      return this;
    };

    List.prototype._parseComments = function(ori, dest) {
      if (ori && ori.length) {
        ori.forEach((function(_this) {
          return function(item) {
            dest.push(new gc.comments.Comment(_.extend(item, {
              _cc: _this._cc
            })));
            if (item.children) {
              return dest = _this._parseComments(item.children, dest);
            }
          };
        })(this));
      }
      return dest;
    };

    List.prototype._getPosition = function() {
      var offset, target;
      target = $(this._target);
      offset = target.offset();
      return {
        top: offset.top,
        left: offset.left + target.outerWidth() - this._el.outerWidth()
      };
    };

    List.prototype._show = function(e, target) {
      var position;
      this._cc.dispatcher.trigger('hideAllForms');
      if (target === this._target.get(0)) {
        if (this._ghostEl) {
          this._el.appendTo(this._cc._container).fadeIn('fast');
          position = this._getPosition();
          this._el.css({
            top: position.top,
            left: position.left
          });
          this._ghostEl = null;
        } else {
          this._hide();
        }
      }
      return e.target;
    };

    List.prototype._hide = function(e, except) {
      if (!except || except !== this._target.get(0)) {
        this._el.fadeOut('fast', (function(_this) {
          return function() {
            return _this._ghostEl = _this._el.detach();
          };
        })(this));
      }
      return this;
    };

    List.prototype._showForm = function(e) {
      var reply, target;
      reply = $(e.target);
      if (reply != null ? reply.prev() : void 0) {
        console.log(reply.prev());
      }
      this._cc.dispatcher.trigger('hideAllForms');
      target = $(e.target).slideUp('fast');
      this._form.show()._el.insertAfter(target);
      return this;
    };

    List.prototype._showReply = function() {
      this._el.find('.reply').slideDown('fast');
      return this;
    };

    List.prototype._addComment = function(e, data) {
      if ((data != null ? data.comment : void 0) && (data != null ? data.comment.index : void 0) === this._index) {
        console.log('c est moi', this._index);
      }
      return this;
    };

    List.prototype._binds = function() {
      this._cc.dispatcher.on('showList', this._show);
      this._cc.dispatcher.on('hideAllLists', this._hide);
      this._el.find('.reply').on('click', this._showForm);
      this._cc.dispatcher.on('hideAllForms', this._showReply);
      this._cc.dispatcher.on('addComment', this._addComment);
      this._hide();
      return this;
    };

    List.prototype._build = function() {
      this._el = $(_.template(this._cc._listView, {
        comments: this._comments,
        replyLabel: this._cc.ll('form.replyLabel'),
        form: this._form
      }));
      this._form = new gc.comments.Form({
        cc: this._cc,
        parent: this
      });
      return this;
    };

    return List;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    exports.gc.comments.List = List;
  } else {
    window.gc.comments.List = List;
  }

  Contextualcomments = (function() {
    Contextualcomments.prototype.target = 'body';

    Contextualcomments.prototype.selector = 'p, img, li';

    Contextualcomments.prototype.containerId = 'comments-container';

    Contextualcomments.prototype.comments = [];

    Contextualcomments.prototype.gapBetweenButtonAndList = 20;

    Contextualcomments.prototype.dispatcher = $({});

    Contextualcomments.prototype.templateFile = './templates/template.html';

    Contextualcomments.prototype._currentLanguage = 'en';

    Contextualcomments.prototype._l10n = {
      en: {
        'form.replyLabel': 'Reply',
        'form.leaveANote': 'Leave a note',
        'form.cancelLabel': 'Cancel',
        'form.authorLabel': 'Author',
        'form.emailLabel': 'Email',
        'form.messageLabel': 'Message'
      }
    };

    Contextualcomments.prototype._buttons = [];

    Contextualcomments.prototype._lists = [];

    Contextualcomments.prototype._availableOptions = ['target', 'selector', 'containerId', 'comments', 'gapBetweenButtonAndList', 'templateFile'];

    function Contextualcomments(options) {
      this.addComment = __bind(this.addComment, this);
      this._initVars(options)._initTemplates();
      return this;
    }

    Contextualcomments.prototype.ll = function(key) {
      return this._l10n[this._currentLanguage][key];
    };

    Contextualcomments.prototype._initVars = function(options) {
      _.extend(this, _.pick(options, this._availableOptions));
      if (typeof this.target === 'string') {
        this.target = $(this.target);
      }
      return this;
    };

    Contextualcomments.prototype._initTemplates = function() {
      var that;
      that = this;
      $.ajax(this.templateFile).success(function(data) {
        that._containerView = _.subpart(data, 'container');
        that._buttonView = _.subpart(data, 'button');
        that._listView = _.subpart(data, 'list');
        that._commentView = _.subpart(data, 'comment');
        that._formView = _.subpart(data, 'form');
        return that._render()._binds();
      });
      return this;
    };

    Contextualcomments.prototype._getCommentsByIndexAndParentId = function(index, parentId) {
      var comments, that;
      comments = [];
      that = this;
      this.comments.forEach(function(comment) {
        if (comment.index === index && comment.parentId === parentId) {
          comment.children = that._getCommentsByIndexAndParentId(index, comment.uid);
          return comments.push(comment);
        }
      });
      return comments;
    };

    Contextualcomments.prototype._getCommentsByIndex = function(index) {
      var comments, that;
      comments = [];
      that = this;
      this.comments.forEach(function(comment) {
        if (comment.index === index) {
          return comments.push(comment);
        }
      });
      return comments;
    };

    Contextualcomments.prototype.addComment = function(e, data) {
      if (data != null ? data.comment : void 0) {
        this.comments.push(data.comment);
        console.log(this.comments);
      }
      return this;
    };

    Contextualcomments.prototype._build = function() {
      var that;
      that = this;
      this.target.find(this.selector).each(function() {
        var button, list;
        button = new gc.comments.Button({
          cc: that,
          target: this
        });
        that._buttons.push(button);
        list = new gc.comments.List({
          cc: that,
          target: this
        });
        return that._lists.push(list);
      });
      return this;
    };

    Contextualcomments.prototype._binds = function() {
      this.dispatcher.on('addComment', this.addComment);
      return this;
    };

    Contextualcomments.prototype._render = function() {
      this._container = $(_.template(this._containerView, {
        container: this.containerId
      }));
      this._container.appendTo('body');
      this._build();
      return this;
    };

    return Contextualcomments;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    exports.gc.Contextualcomments = Contextualcomments;
  } else {
    window.gc.Contextualcomments = Contextualcomments;
  }

  gc.comments.MD5 = function(string) {
    var AA, AddUnsigned, BB, CC, ConvertToWordArray, DD, F, FF, G, GG, H, HH, I, II, RotateLeft, S11, S12, S13, S14, S21, S22, S23, S24, S31, S32, S33, S34, S41, S42, S43, S44, Utf8Encode, WordToHex, a, b, c, d, k, temp, x;
    RotateLeft = function(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
    AddUnsigned = function(lX, lY) {
      var lResult, lX4, lX8, lY4, lY8;
      lX4 = void 0;
      lY4 = void 0;
      lX8 = void 0;
      lY8 = void 0;
      lResult = void 0;
      lX8 = lX & 0x80000000;
      lY8 = lY & 0x80000000;
      lX4 = lX & 0x40000000;
      lY4 = lY & 0x40000000;
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
        } else {
          return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        }
      } else {
        return lResult ^ lX8 ^ lY8;
      }
    };
    F = function(x, y, z) {
      return (x & y) | ((~x) & z);
    };
    G = function(x, y, z) {
      return (x & z) | (y & (~z));
    };
    H = function(x, y, z) {
      return x ^ y ^ z;
    };
    I = function(x, y, z) {
      return y ^ (x | (~z));
    };
    FF = function(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    GG = function(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    HH = function(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    II = function(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    ConvertToWordArray = function(string) {
      var lByteCount, lBytePosition, lMessageLength, lNumberOfWords, lNumberOfWords_temp1, lNumberOfWords_temp2, lWordArray, lWordCount;
      lWordCount = void 0;
      lMessageLength = string.length;
      lNumberOfWords_temp1 = lMessageLength + 8;
      lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      lWordArray = Array(lNumberOfWords - 1);
      lBytePosition = 0;
      lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };
    WordToHex = function(lValue) {
      var WordToHexValue, WordToHexValue_temp, lByte, lCount;
      WordToHexValue = "";
      WordToHexValue_temp = "";
      lByte = void 0;
      lCount = void 0;
      lCount = 0;
      while (lCount <= 3) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        lCount++;
      }
      return WordToHexValue;
    };
    Utf8Encode = function(string) {
      var c, n, utftext;
      string = string.replace(/\r\n/g, "\n");
      utftext = "";
      n = 0;
      while (n < string.length) {
        c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        n++;
      }
      return utftext;
    };
    x = Array();
    k = void 0;
    AA = void 0;
    BB = void 0;
    CC = void 0;
    DD = void 0;
    a = void 0;
    b = void 0;
    c = void 0;
    d = void 0;
    S11 = 7;
    S12 = 12;
    S13 = 17;
    S14 = 22;
    S21 = 5;
    S22 = 9;
    S23 = 14;
    S24 = 20;
    S31 = 4;
    S32 = 11;
    S33 = 16;
    S34 = 23;
    S41 = 6;
    S42 = 10;
    S43 = 15;
    S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    k = 0;
    while (k < x.length) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
      b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
      b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
      d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
      d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
      b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = AddUnsigned(a, AA);
      b = AddUnsigned(b, BB);
      c = AddUnsigned(c, CC);
      d = AddUnsigned(d, DD);
      k += 16;
    }
    temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
  };

}).call(this);
