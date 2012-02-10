#!/usr/bin/env node

var util    = require("util");
var path    = require("path");
var nist    = require("../lib/nist");
var program = require('commander');
// var version = require("../lib/version")

// var args = process.argv.slice(0);
// // shift off node and script name
// args.shift(); args.shift();
// console.log("------")
// // console.log(util.inspect(nist, true, null));
// console.log("------")

// nist.readFile(args[0])
// nist.openNistrcFile()

program
  .version('0.0.1')
  .option('-c, --config', 'Github account file')
  .parse(process.argv);

//Search for ~/.nistrc and prompt for Github account if is not found
path.exists(nist.nistrcPath, function (exists) {
  if(!exists || program.config) {
    program.prompt('Login or Email: ', function(name){
      program.password('Password: ', '*', function(pass){
        process.stdin.destroy();
        nist.openNistrcFile(JSON.stringify({"login": name, "pass": pass}))
        if(program.args.length > 0) nist.readFile(program.args[0])
      });
    });
  }
});

console.log(program.args)
