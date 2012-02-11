#!/usr/bin/env node

var util    = require("util");
var path    = require("path");
var nist    = require("../lib/nist");
var program = require('commander');
// var version = require("../lib/version")

program
  .version('0.0.1')
  .option('-c, --config', 'Github account file')
  .parse(process.argv);

nist.findNistrcFile(function (exists) {
  if(!exists || program.config) {
    program.prompt('Login or Email: ', function(login){
      program.password('Password: ', '*', function(pass){
        process.stdin.destroy();
        nist.saveNistrcFile(JSON.stringify({"login": login, "pass": pass}));
        if(program.args.length > 0) nist.readFile(program.args[0])
      });
    });
  } 
  else {
    if(program.args.length > 0) nist.readFile(program.args[0])    
  }
});
