var express = require('express');
var morgan = require('morgan');
var gzippo = require('gzippo');
var app = express();

var port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(express.static(__dirname));
app.listen(port);

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/dist/index.html');
});
app.use(gzippo.staticGzip(''+__dirname+'/dist'));

console.log('listening on '+port);
