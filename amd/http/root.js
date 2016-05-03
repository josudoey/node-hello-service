define(function (require) {
  var mount = require("koa-mount");
  var websockify = require('koa-websocket'),
    compose = require('koa-compose'),
    co = require('co');
  koa = require('koa');
  return function () {
    var app = koa();;
    websockify(app);
    const oldListen = app.listen;
    app.listen = function () {
      app.ws.use(function* (next) {
        this.close(); //default close
      });
      app.server = oldListen.apply(app, arguments);
      return app.server;
    };
    app.ws.onConnection = function (socket) {
      socket.on('error', function (err) {
        app.emit("error", err);
      });
      const fn = co.wrap(compose(this.middleware));
      socket.path = socket.upgradeReq.url;
      fn.bind(socket).call().catch(function (err) {
        app.emit("error", err);
        socket.close();
      });
    };
    app.mount = function (prefix, extApp) {
      this.middleware.push(mount(prefix, extApp));
      if (extApp.ws) {
        this.ws.middleware.push(mount(prefix, extApp.ws));
      }
    }
    return app;
  }
});
