var fs    = require('fs'),
qs    = require('qs'),
path  = require('path'),
https = require('https');

function Nist() {

  this.nistrcPath = process.env.HOME + '/.nistrc'; 

  this.readFile = function(file_name) {
    this.openNistrcFile(function(gistAccount){
      fs.readFile(file_name, 'utf8', function(err, data){
        if(data){
          gistOptions(data, gistAccount, file_name, function(data, options){
            postCode(data, options);
          });
        }
        else {
          console.log("no data")
        }
      });
    });
  };
  
  this.findNistrcFile = function(callback){
    path.exists(this.nistrcPath, function(exists){
      return callback(exists);
    });
  };

  this.openNistrcFile = function(callback){
    fs.readFile(this.nistrcPath, 'utf8', function (err, data) {
      if(err) throw console.log("openNistrcFile ERROR: %s", err)
      callback(data)
    });
  };

  this.saveNistrcFile = function(obj) {
    fs.writeFile(this.nistrcPath, obj, function(err, data){
      if(err) throw console.log("openNistrcFile ERROR: %s", err);
      console.log("~/.nistrc file saved");
    });
  };
  
  function gistOptions(data, gistAccount, fileName, callback) {
    var jsonGistAccount = JSON.parse(gistAccount);
    var data            = qs.stringify({
      "file_contents": {"gistfile1": data}, 
      "file_name": {"gistfile1" : path.basename(fileName)},
      "file_ext" : {"gistfile1": path.extname(fileName)}
    });

    var postOptions = {
      host: 'gist.github.com',
      path: '/api/v1/json/new',
      method: 'POST',
      auth: jsonGistAccount.login + ':' + jsonGistAccount.pass,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    };

    return callback(data, postOptions)
  };

  function postCode(data, postOptions) {
    // Set up the request
    var post_req = https.request(postOptions, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        gist = JSON.parse(chunk)
        console.log('http://gist.github.com/' + gist.gists[0].repo)
      });
    });

    post_req.write(data)
    post_req.end();
  }

} 

module.exports = new Nist();
