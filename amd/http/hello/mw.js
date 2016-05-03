define(function (require) {
  var route = require("koa-route");
  var compose = require("koa-compose");
  var log4js = require("log4js");
  var Log = log4js.getLogger();
  return function (self) {
    return compose([
      route.get('/', function* () {
        this.is('application/json');
        this.status = 200;
        this.body = self;
      }),
      route.get('/hello', function* () {
        this.is('application/json');
        this.status = 200;
        this.body =
          yield self.hello();
      }),
      route.all('/:any*', function* (name, next) {
        this.is('Application/json');
        this.status = 400;
        this.body = {
          "msg": "sorry,function not enable."
        };
        var method = this.request.method;
        var urlPath = this.originalUrl || this.path;
        Log.warn("not support req " + method + " " + urlPath);
      })
    ]);
  }
});

