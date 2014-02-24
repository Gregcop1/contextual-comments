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

  Commentslist = (function() {
    Commentslist.prototype._comments = [];

    Commentslist.prototype._commentsOfAllLevels = [];

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
        this._commentsOfAllLevels = this._parent._getCommentsByIndex(this._index);
      }
      return this;
    };

    Commentslist.prototype._getLabel = function() {
      if (this._commentsOfAllLevels.length) {
        return this._commentsOfAllLevels.length;
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
      this._button = $(_.template(this._parent._commentsListButtonTemplate, {
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

    Commentslist.prototype._renderList = function() {
      this._list = $(_.template(this._parent._commentsListTemplate, {
        comments: this._comments
      }));
      return this;
    };

    Commentslist.prototype._render = function() {
      this._renderButton();
      this._renderList();
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

    Contextualcomments.prototype.templateFile = './templates/template.html';

    Contextualcomments.prototype._commentsLists = [];

    Contextualcomments.prototype._availableOptions = ['target', 'selector', 'containerId', 'comments', 'gapBetweenButtonAndList', 'templateFile'];

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
      $.ajax(this.templateFile).success(function(data) {
        that._containerTemplate = _.subpart(data, 'container');
        that._commentsListButtonTemplate = _.subpart(data, 'list button');
        that._commentsListTemplate = _.subpart(data, 'list');
        that._commentTemplate = _.subpart(data, 'comment');
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

    Contextualcomments.prototype._buildLists = function() {
      var that;
      that = this;
      this.target.find(this.selector).each(function() {
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
