#!/usr/bin/env node

var program = require('commander');
var request = require('request');
var chalk = require('chalk');

program
  .version('0.0.1')
  .usage('[options] <keywords>')
    .option('-o, --owner [name]', 'Filter by the repositories owner')
    .option('-l, --language [language]', 'Filter by the repositories language')
  .parse(process.argv)

if (!program.args.length) {
  program.help();
} else {
  var keywords = program.args;
  var url = 'https://api.github.com/search/repositories?sort=stars&order=desc&q=' + keywords;

  if(program.owner) {
    url += '+user:' + program.owner;
  }
  if(program.language) {
    url += '+language' + program.language;
  }

  request({
    method: 'GET',
    headers: {
      'User-Agent': 'hukuuu'
    },
    url: url
  }, function(error, response, body) {

    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);

      body.items.forEach(function(item){
        console.log(chalk.magenta.bold('Name: ' + item.name));
        console.log(chalk.cyan.bold('Desc: ' + item.description + '\n'));
        console.log(chalk.grey('Owner: ' + item.owner.login));
        console.log(chalk.grey('Clone url: ' + item.clone_url + '\n'));
      });

    } else if (error) {
      console.log('Error: ' + error);
    }
  });
}