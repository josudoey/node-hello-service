var _require = require;
define(function (require) {
    var log4js = _require.nodeRequire('log4js');
  var path = require('path');
  var getCallerModulePath = function (err, depth) {
    var stack = err.stack;
    var lines = stack.split('\n');
    var line = lines[depth];
    var m = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+):(\d+)|([^)]+))\)?/);
    return m[2];
  }
  var __filename = getCallerModulePath(new Error(), 1);
  var __dirname = path.dirname(__filename);
  var _getLogger = log4js.getLogger.bind(log4js);

  function customLayout(msg, timezoneOffset) {
    //{"startTime":"2016-02-19T07:22:26.926Z","categoryName":"defaults","data":["log example"],"level":{"level":20000,"levelStr":"INFO"},"logger":{"category":"defaults","_events":{},"_eventsCount":1}}
    //
    return msg.startTime.toISOString() + " [" + msg.level.levelStr + "] " + msg.data.join(" ");
  }

  var defCategory = function () {
    var filepath = getCallerModulePath(new Error(), 3);
    var rfilepath = path.relative(__dirname, filepath);
    return rfilepath.replace(/^(\.\.\/)+/, "").replace(/.js$/, "").replace(/\//g, ".");
  }

  var getLogger = function (category) {
    category = category || defCategory();
    return _getLogger(category);
  }
  log4js.getLogger = getLogger;

  var _layout = log4js.layouts.layout;
  log4js.layouts.layout = function (name, config) {
    if (name === "custom") {
      return customLayout;
    }
    return _layout(name, config)
  }
  log4js.layouts["customLayout"] = customLayout;
  return log4js;
});

