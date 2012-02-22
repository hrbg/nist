var fs    = require('fs'),
qs    = require('qs'),
path  = require('path'),
https = require('https');

function Nist() {

  this.nistrcPath = process.env.HOME + '/.nistrc'; 

  this.readFile = function(file_name) {
    this.openNistrcFile(function(gistAccount){
      console.log(file_name)
      fs.readFile(file_name, 'utf8', function(err, data){
        if(data){
          postCode(data, gistAccount, function(url){
            console.log(url);
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

  function postCode(codestring, gistAccount) {
    var jsonGistAccount = JSON.parse(gistAccount);
    var data =  qs.stringify({"file_contents": {"gistfile1": codestring}})
    var post_options = {
      host: 'gist.github.com',
      path: '/api/v1/json/new',
      method: 'POST',
      auth: jsonGistAccount.login + ':' + jsonGistAccount.pass,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    };
    // Set up the request
    var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log(chunk)
        res.body += chunk
      });
      res.on('end', function(){
        console.log('---body---')
        console.log(res.body)
        console.log('----------')
        // json_response = JSON.parse(res.body);
        // console.log('http://gist.github.com/' + json_response.gists[0].repo);
      });
    });

    // post_req.write(qs.stringify({"files": {"newfile": codestring}}))
    post_req.write(data)
    post_req.end();
    // console.log(qs.stringify({"files": {"newfile": codestring}}))
  }

  // function postCode(content, gistAccount, callback) {
  //   var body = 'files[newfile]=' + content;
    
  //   var options = {
  //     host: 'gist.github.com',
  //     port: 80,
  //     path: '/api/v1/json/new',
  //     method: 'POST',
  //     auth: jsonGistAccount.login + ':' + jsonGistAccount.pass,
  //     headers: {
  //       'host': 'gist.github.com',
  //       'Content-length': body.length, 
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }
  //   };
    
  //   var req = http.request(options, function(res) {
  //     res.body = '';
  //     res.setEncoding('utf8');
  //     res.on('data', function (chunk) {
  //       res.body += chunk;
  //     });
  //     res.on('end', function () {
  //       callback.apply(null, [res.body]);
  //     });
  //   });
    
  //   req.end(body);
  // }
} 

module.exports = new Nist();
