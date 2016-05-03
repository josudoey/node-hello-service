var prog = require("commander"),
  path = require("path"),
  fs = require("fs"),
  env = process.env,
  co = require("co"),
  requirejs = require("requirejs");

prog
  .command('server')
  .option('-p, --port <port>', 'web service listen port default:[3000]', 3000)
  .option('--conf <config-path>', 'config file path')
  .description('run a kiter service.')
  .action(function (opts) {
    requirejs.config({
      baseUrl: "./",
      paths: {
        "log4js": "amd/log4js",
        "nconf": "amd/nconf",
      }
    });
    var nconf = requirejs("nconf");
    var log4js = requirejs("log4js");
    if (opts.conf) {
      nconf.file({
        file: opts.conf
      });
    }

    log4js.setGlobalLogLevel('INFO');
    logConf = {
      appenders: [{
        type: 'console',
      }]
    };
    nconf.defaults({
      "process.log.maxLogSize": 100 * 1024 * 1024,
      "process.log.backups": 15
    });

    if (nconf.get("process.log.filename")) {
      logConf.appenders.push({
        type: 'file',
        layout: {
          type: 'custom'
        },
        "filename": path.resolve(nconf.get("process.log.filename")),
        "maxLogSize": nconf.get("process.log.maxLogSize"),
        "backups": nconf.get("process.log.backups")
      });
    }

    log4js.configure(logConf);
    var Log = log4js.getLogger();
    var root = requirejs("amd/http/root")();
    var hello = requirejs("amd/http/hello/app")({
      "version": prog.version()
    });
    root.mount("/", hello);
    var server = root.listen(opts.port);
    server.on('listening', function () {
      var web_listen = server.address().address + ":" + server.address().port;
      Log.info("service listein on " + web_listen);
    });
    process.on('uncaughtException', function (err) {
      Log.error(err.stack);
    });
  });

