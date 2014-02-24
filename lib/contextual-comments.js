(function() {
  'use strict';
  var Button, Contextualcomments, List, error,
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
      this._button.fadeIn('fast');
      return target;
    };

    Button.prototype._hide = function(e) {
      var force, target, that, _ref;
      target = $(e.target);
      that = this;
      force = (_ref = e.data) != null ? _ref.force : void 0;
      this._isShown = this._commentLength;
      if (!this._isShown && force) {
        this._button.fadeOut(0);
      } else {
        setTimeout(function() {
          if (!that._isShown) {
            return that._button.fadeOut('fast');
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
      this._cc.dispatcher.trigger($.Event('show list', {
        target: this._target
      }));
      return target;
    };

    Button.prototype._binds = function() {
      this._button.on('mouseenter', this._show).on('mouseenter', this._hover).on('mouseleave', this._out).on('click', this._click);
      this._target.on('mouseenter', this._show).on('mouseout', this._hide);
      return this;
    };

    Button.prototype._render = function() {
      var position;
      this._button = $(_.template(this._cc._buttonView, {
        label: this._label
      }));
      position = this._getPosition();
      this._button.css({
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

    List.prototype._commentsOfAllLevels = [];

    function List(options) {
      this._initVars(options)._retrieveComments()._build()._binds();
      return this;
    }

    List.prototype._initVars = function(options) {
      this._parent = (options != null ? options.parent : void 0) || null;
      this._target = (options != null ? options.target : void 0) || null;
      this._target = $(this._target);
      this._index = this._target.index();
      return this;
    };

    List.prototype._retrieveComments = function() {
      if (this._parent) {
        this._comments = this._parent._getCommentsByIndexAndParentId(this._index, 0);
        this._commentsOfAllLevels = this._parent._getCommentsByIndex(this._index);
      }
      return this;
    };

    List.prototype._getLabel = function() {
      if (this._commentsOfAllLevels.length) {
        return this._commentsOfAllLevels.length;
      } else {
        return '+';
      }
    };

    List.prototype._getPosition = function() {
      var offset, target;
      target = $(this._target);
      offset = target.offset();
      return {
        top: offset.top,
        left: offset.left + target.outerWidth() + this._parent.gapBetweenButtonAndList
      };
    };

    List.prototype._showButton = function(e) {
      var that;
      that = e.data.that;
      that._isButtonShown = true;
      that._button.fadeIn('fast');
      return $(this);
    };

    List.prototype._hideButton = function(e) {
      var force, that;
      that = e.data.that;
      force = e.data.force;
      that._isButtonShown = that._commentsOfAllLevels.length;
      if (!that._isButtonShown && force) {
        that._button.fadeOut(0);
      } else {
        setTimeout(function() {
          if (!that._isButtonShown) {
            return that._button.fadeOut('fast');
          }
        }, 1000);
      }
      return $(this);
    };

    List.prototype._hoverButton = function(e) {
      var target, that;
      that = e.data.that;
      target = $(e.target);
      that._isButtonShown = true;
      target.addClass('comment-active');
      return target;
    };

    List.prototype._outButton = function(e) {
      var target;
      target = $(e.target);
      target.removeClass('comment-active');
      return target;
    };

    List.prototype._showList = function() {
      return this;
    };

    List.prototype._hideList = function() {
      return this;
    };

    List.prototype._binds = function() {
      this._button.on('mouseenter', {
        that: this
      }, this._showButton).on('mouseenter', {
        that: this
      }, this._hoverButton).on('mouseleave', this._outButton);
      this._target.on('mouseenter', {
        that: this
      }, this._showButton).on('mouseout', {
        that: this
      }, this._hideButton);
      return this;
    };

    List.prototype._buildButton = function() {
      return this;
    };

    List.prototype._buildList = function() {
      this._list = $(_.template(this._parent._listView, {
        comments: this._comments
      }));
      return this;
    };

    List.prototype._build = function() {
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

    Contextualcomments.prototype.dispatcher = $();

    Contextualcomments.prototype.templateFile = './templates/template.html';

    Contextualcomments.prototype._buttons = [];

    Contextualcomments.prototype._lists = [];

    Contextualcomments.prototype._availableOptions = ['target', 'selector', 'containerId', 'comments', 'gapBetweenButtonAndList', 'templateFile'];

    function Contextualcomments(options) {
      this._initVars(options)._initTemplates();
      this.dispatcher.on('show list', function(e) {
        return console.log(e);
      });
      return this;
    }

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
        return that._render();
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

    Contextualcomments.prototype._build = function() {
      this._buildButtons();
      return this;
    };

    Contextualcomments.prototype._buildButtons = function() {
      var that;
      that = this;
      this.target.find(this.selector).each(function() {
        var button;
        button = new gc.comments.Button({
          cc: that,
          target: this
        });
        return that._buttons.push(button);
      });
      return this;
    };

    Contextualcomments.prototype._buildLists = function() {
      var that;
      that = this;
      this.target.find(this.selector).each(function() {
        var list;
        list = new gc.comments.List({
          parent: that,
          target: this
        });
        return that._lists.push(list);
      });
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

}).call(this);
