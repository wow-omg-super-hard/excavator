#! /usr/bin/env node
var program = require('commander');

program
    .version('0.0.1')
    .usage('init [工程目录名称]')
    .command('init', '创建新项目')
    .parse(process.argv);