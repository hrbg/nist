var fs          = require('fs'),
    querystring = require('querystring'),
    https       = require('https');

function Nist() {
    this.file = function(file_name) {
        console.log(file_name)
        fs.readFile(file_name, 'utf8', function(err, data){
            console.log("---readFile---");
            if(data){
                postCode(data);
            }
            else {
                console.log("no data")
            }
        });
    };

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
                json_response = JSON.parse(chunk)
                console.log('http://gist.github.com/' + json_response.gists[0].repo);
            });
        });

        // post the data
        console.log(codestring)
        post_req.write("files[newfile]=" + codestring)
        post_req.end();
    }
} 

module.exports = new Nist();
