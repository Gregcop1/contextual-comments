(function() {
  'use strict';
  var Commentslist, Contextualcomments, error;

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

  Commentslist = (function() {
    Commentslist.prototype._comments = [];

    function Commentslist(options) {
      this._initVars(options)._retrieveComments()._render()._binds();
      return this;
    }

    Commentslist.prototype._initVars = function(options) {
      this._parent = (options != null ? options.parent : void 0) || null;
      this._target = (options != null ? options.target : void 0) || null;
      this._target = $(this._target);
      this._index = this._target.index();
      return this;
    };

    Commentslist.prototype._retrieveComments = function() {
      if (this._parent) {
        this._comments = this._parent._getCommentsByIndexAndParentId(this._index, 0);
      }
      return this;
    };

    Commentslist.prototype._getLabel = function() {
      if (this._comments.length) {
        return this._comments.length;
      } else {
        return '+';
      }
    };

    Commentslist.prototype._getPosition = function() {
      var offset, target;
      target = $(this._target);
      offset = target.offset();
      return {
        top: offset.top,
        left: offset.left + target.outerWidth() + this._parent.gapBetweenButtonAndList
      };
    };

    Commentslist.prototype._showButton = function(e) {
      var that;
      that = e.data.that;
      that._isButtonShown = true;
      that._button.fadeIn('fast');
      return $(this);
    };

    Commentslist.prototype._hideButton = function(e) {
      var force, that;
      that = e.data.that;
      force = e.data.force;
      that._isButtonShown = that._comments.length;
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

    Commentslist.prototype._hoverButton = function(e) {
      var target, that;
      that = e.data.that;
      target = $(e.target);
      that._isButtonShown = true;
      target.addClass('comment-active');
      return target;
    };

    Commentslist.prototype._outButton = function(e) {
      var target;
      target = $(e.target);
      target.removeClass('comment-active');
      return target;
    };

    Commentslist.prototype._showList = function() {
      return this;
    };

    Commentslist.prototype._hideList = function() {
      return this;
    };

    Commentslist.prototype._binds = function() {
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

    Commentslist.prototype._renderButton = function() {
      var position;
      this._button = $(_.template(this._parent.commentsListButtonTemplate, {
        label: this._getLabel()
      }));
      position = this._getPosition();
      this._button.css({
        top: position.top,
        left: position.left
      }).appendTo(this._parent._container);
      this._hideButton({
        data: {
          force: true,
          that: this
        }
      });
      return this;
    };

    Commentslist.prototype._render = function() {
      this._renderButton();
      return this;
    };

    return Commentslist;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    exports.gc.Commentslist = gc.Commentslist;
  } else {
    window.gc.Commentslist = Commentslist;
  }

  Contextualcomments = (function() {
    Contextualcomments.prototype.target = 'body';

    Contextualcomments.prototype.selector = 'p, img, li';

    Contextualcomments.prototype.containerId = 'comments-container';

    Contextualcomments.prototype.comments = [];

    Contextualcomments.prototype.gapBetweenButtonAndList = 20;

    Contextualcomments.prototype.templatePaths = './templates/';

    Contextualcomments.prototype.containerTemplateFile = 'container.html';

    Contextualcomments.prototype.commentsListTemplateFile = 'commentsList.html';

    Contextualcomments.prototype.commentsListButtonTemplateFile = 'commentsListButton.html';

    Contextualcomments.prototype.commentTemplateFile = 'comment.html';

    Contextualcomments.prototype._commentsLists = [];

    Contextualcomments.prototype._availableOptions = ['target', 'selector', 'containerId', 'comments', 'gapBetweenButtonAndList', 'templatePaths', 'containerTemplateFile', 'commentsListTemplateFile', 'commentTemplateFile'];

    function Contextualcomments(options) {
      this._initVars(options)._initTemplates();
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
      $.when($.get(this.templatePaths + this.containerTemplateFile, function(data) {
        return that._containerTemplate = data;
      }), $.get(this.templatePaths + this.commentsListButtonTemplateFile, function(data) {
        return that.commentsListButtonTemplate = data;
      }), $.get(this.templatePaths + this.commentsListTemplateFile, function(data) {
        return that._commentsListTemplate = data;
      }), $.get(this.templatePaths + this.commentTemplateFile, function(data) {
        return that._commentTemplate = data;
      })).then(function() {
        return that._render();
      });
      return this;
    };

    Contextualcomments.prototype._getCommentsByIndexAndParentId = function(index, parentId, comments) {
      var that;
      if (!comments) {
        comments = [];
      }
      that = this;
      this.comments.forEach(function(comment) {
        if (comment.index === index && comment.parentId === parentId) {
          comments.push(comment);
          return that._getCommentsByIndexAndParentId(index, comment.uid, comments);
        }
      });
      return comments;
    };

    Contextualcomments.prototype._buildLists = function() {
      var that;
      that = this;
      $(this.target).find(this.selector).each(function() {
        var list;
        list = new gc.Commentslist({
          parent: that,
          target: this
        });
        return that._commentsLists.push(list);
      });
      return this;
    };

    Contextualcomments.prototype._render = function() {
      this._container = $(_.template(this._containerTemplate, {
        container: this.containerId
      }));
      this._container.appendTo('body');
      this._buildLists();
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
