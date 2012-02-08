#!/usr/bin/env node

var util = require("util")
var nist = require("../lib/nist")

var args = process.argv.slice(0);
// shift off node and script name
args.shift(); args.shift();
// console.log("------")
// console.log(util.inspect(nist, true, null));
// console.log("------")
nist.file(args[0])
