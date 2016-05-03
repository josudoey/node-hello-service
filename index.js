var prog = require("commander"),
    path = require("path"),
    fs = require("fs");

var version = require("./package").version;
var m = __filename.match(/.+(\d+\.\d+\.\d+[^\/]*)\/.*/);
if (m) {
    version = m[1];
}
prog
    .version(version)

// load ./*.js for commander module 
var ls = fs.readdirSync(__dirname + "/cmd");
ls.forEach(function(fn) {
    var m = /(.+).js$/.exec(fn);
    if (!m) {
        return;
    }
    require("./cmd/" + fn);
});

exports = module.exports = prog;

if (module.parent) {
    return;
}

prog.parse(process.argv);
if (prog.args.length == 0 || !prog.args[prog.args.length - 1]._name) {
    prog.outputHelp();
}

process.on('uncaughtException', function(err) {
    console.log(err);
});
