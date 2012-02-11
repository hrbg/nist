var fs    = require('fs'),
qs    = require('qs'),
https = require('https');

function Nist() {

  this.nistrcPath = process.env.HOME + '/.nistrc'; 

  this.readFile = function(file_name) {
    console.log(file_name)
    fs.readFile(file_name, 'utf8', function(err, data){
      console.log("---readFile---");
      if(data){
        postCode(data);
        console.log("BOOM!!")
      }
      else {
        console.log("no data")
      }
    });
  };
  
  this.openNistrcFile = function(callback){
    
  };

  // this.openNistrcFile = function(str) {
  //     fs.open(this.nistrcPath, 'w', function(err, fd){
  //         fs.write(fd, str, null, null, null, function(err, written, buffer){
  //             fs.close(fd, function(){
  //                 console.log("---File saved---")
  //             });
  //         });
  //     });
  // };

  function postCode(codestring) {
    var post_options = {
      host: 'gist.github.com',
      path: '/api/v1/json/new',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': codestring.length
      }
    };
    // Set up the request
    var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log(chunk)
        json_response = JSON.parse(chunk)
        console.log('http://gist.github.com/' + json_response.gists[0].repo);
      });
    });

    post_req.write(qs.stringify({"files": {"newfile": codestring}}))
    post_req.end();
  }
} 

module.exports = new Nist();
