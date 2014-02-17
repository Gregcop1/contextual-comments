(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Comment;

module.exports = Comment = (function() {
  _uid;
  _index;
  _selection;
  function Comment() {
    return this;
  }

  return Comment;

})();


},{}],2:[function(require,module,exports){
var Commentslist;

gc.comment = require('./comment.coffee');

module.exports = Commentslist = (function() {
  function Commentslist() {
    return this;
  }

  return Commentslist;

})();


},{"./comment.coffee":1}],3:[function(require,module,exports){
var Contextualcomments, error;

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

window.gc = {};

gc.commentsList = require('./comments-list.coffee');

gc.contextualcomments = Contextualcomments = (function() {
  Contextualcomments.prototype.target = 'body';

  Contextualcomments.prototype.selector = 'p, img, li';

  Contextualcomments.prototype.containerId = 'comments-container';

  Contextualcomments.prototype.comments = [];

  Contextualcomments.prototype.gapBetweenButtonAndList = 20;

  Contextualcomments.prototype.templatePaths = './templates/';

  Contextualcomments.prototype.containerTemplateFile = 'container.html';

  Contextualcomments.prototype.commentsListTemplateFile = 'commentsList.html';

  Contextualcomments.prototype.commentTemplateFile = 'comment.html';

  _container;

  _containerTemplate;

  _commentsListTemplate;

  _commentTemplate;

  Contextualcomments.prototype._commentsLists = [];

  Contextualcomments.prototype._availableOptions = ['target', 'selector', 'containerId', 'comments', 'gapBetweenButtonAndList', 'templatePaths', 'containerTemplateFile', 'commentsListTemplateFile', 'commentTemplateFile'];

  function Contextualcomments(options) {
    this._initVars(options)._initTemplates();
    return this;
  }

  Contextualcomments.prototype._initVars = function(options) {
    _.extend(this, _.pick(options, this._availableOptions));
    return this;
  };

  Contextualcomments.prototype._initTemplates = function() {
    var that;
    that = this;
    try {
      $.get(this.templatePaths + this.containerTemplateFile, function(data) {
        that.containerTemplate = data;
        return that._render();
      }, 'html');
    } catch (_error) {
      error = _error;
      console.warn('Error : ' + error);
    }
    return this;
  };

  Contextualcomments.prototype._getCommentsByParentId = function(parentId) {
    var comments;
    comments = [];
    this.comments.forEach(function(comment) {
      if (comment.parentId === parentId) {
        return comments.push(comment);
      }
    });
    return comments;
  };

  Contextualcomments.prototype._buildLists = function() {
    var that;
    that = this;
    $(this.target).find(this.selector).each(function() {
      var list;
      list = new gc.commentsList();
      return that._commentsLists.push(list);
    });
    console.log(that._commentsLists);
    return this;
  };

  Contextualcomments.prototype._render = function() {
    this._container = _.template(this.containerTemplate, {
      container: this.containerId
    });
    $(this._container).appendTo('body');
    this._buildLists();
    return this;
  };

  return Contextualcomments;

})();


},{"./comments-list.coffee":2}]},{},[3])