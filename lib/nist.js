var fs   = require('fs'),
    http = require('https');

function Nist() {
    // this.account = {username: "hrbg", password: "123456a"}

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
            path: '/gists',
            method: 'POST',
            auth: 'hrbg:123456a',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': codestring.length
            }
        };
        // Set up the request
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });

        // post the data
        // console.log(post_req);
        post_req.write("file_contents[gistfile1]=" + codestring);
        post_req.end();
    }
} 

module.exports = new Nist();
