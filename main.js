var express = require('express'),
    multer  = require('multer'),
    fs      = require('fs');

var app = express();
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/uploads');
  },  
  filename: function(req, file, cb) {
    cb(null, 'main.c');
  }
});
var upload = multer({ storage: storage });

const spawn = require('child_process').spawn;

app.get('/', function(req, res) {
  res.send('Netcompiler');
});

app.post('/compile', upload.single('source'), function(req, res) {
  var path = req.file.path;

  var gcc = spawn('i586-mingw32msvc-gcc', [path, '-o', 'bin/main.exe']);
  //var gpp = spawn('i586-mingw32msvc-g++', [path, '-o', 'bin/main.exe']);
  var gccError;
  
  gcc.stderr.on('data', function(data) {
    gccError = data;
    //console.log(data);
  });

  gcc.on('close', function(code) {
    if (code === 1) {
      res.send(gccError); 
      return;
    }
    res.sendFile('bin/main.exe', { root: __dirname });
  });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
