define(function (require) {
  var route = require("koa-route");
  var compose = require("koa-compose");
  var log4js = require("log4js");
  var Log = log4js.getLogger();
  return function (app) {
    return compose([
      route.all("/", function* (name, next) {
        var ws = this;
        var urlPath = this.originalUrl || this.path;
        Log.info("ws open", urlPath);
        ws.send("hello");
        ws.close();
        ws.on("close", function () {
          Log.info("ws close", urlPath);
        });
      }),
      route.all("/echo", function* (name, next) {
        var ws = this;
        var urlPath = this.originalUrl || this.path;
        Log.info("ws open", urlPath);
        ws.on("message", function (msg) {
          ws.send(msg);
        });
        ws.on("close", function () {
          Log.info("ws close", urlPath);
        });
      }),
      route.all("/:name*", function* (name, next) {
        var ws = this;
        var urlPath = this.originalUrl || this.path;
        Log.info("ws open", urlPath);
        ws.on("close", function () {
          Log.info("ws close", urlPath);
        });
      })
    ]);
  };
});

