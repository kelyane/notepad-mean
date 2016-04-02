var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://ds023088.mlab.com:23088/sakura',
  cloud: process.env.CLOUD_CODE_MAIN  || __dirname + '/client/main.js',
  appId: process.env.APP_ID || 'notepadId',
  masterKey: process.env.MASTER_KEY || '',
  javascriptKey: 'notepadIdJS',
  serverURL: process.env.SERVER_URL || 'https://notepad-mean.herokuapp.com/parse',
});

var app = express();

app.use('/client', express.static(path.join(__dirname, '/client')));
app.use('/public/angular', express.static(path.join(__dirname, '/node_modules/angular/')));

// Serve the Parse API on the /parse URL prefix
var mountPath = '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
/*app.get('/', function(req, res) {
  res.status(200).send('HIII!!!!');
});*/

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});


var port = process.env.PORT;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('my app running on port ' + port + '.');
});


