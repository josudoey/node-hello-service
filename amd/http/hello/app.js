define(function (require, exports, module) {
  var NodeCache = require("node-cache");
  var merge = require("merge");
  var co = require('co');
  var only = require('only');
  var log4js = require("log4js");
  var httpMw = require("./mw");
  var wsMw = require("./ws/mw");
  var Log = log4js.getLogger();
  var debug = require("debug")("app");

  /**
   * Class represents a instance for App.
   * @public
   * @class
   * @name Hello
   */

  var Applaction = function (opts) {
    opts = merge({
      "version": "1.0.0"
    }, opts);
    merge(this, opts);

    this.middleware = [];
    this.ws = {
      "middleware": []
    };

    this.cache = new NodeCache({
      stdTTL: 3600,
      useClones: false
    });

    this.middleware.push(httpMw(this));
    this.ws.middleware.push(wsMw(this));
  };

  var app = Applaction.prototype;

  app.hello = function () {
    return Promise.resolve({"msg":"hello"});
  }

  app.inspect = app.toJSON = function () {
    var ret = only(this, [
      'version'
    ]);
    return ret;
  };

  var exports = function (opts) {
    return new Applaction(opts);
  }
  exports["Applaction"] = Applaction;
  return exports;
})

