# Hello

The following system environment is required.

* node v4.4.3+ 
* mocha `npm install -g mocha`


## run Hello server

```
$ node index.js server --conf ./conf.json
# for DEBUG
$ DEBUG=hello:* node index.js server --conf ./conf.json 
```


## conf.json example.
{
  "process.log.filename": "/tmp/hello.log"
}
