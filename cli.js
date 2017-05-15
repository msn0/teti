#!/usr/bin/env node

'use strict';

const meow = require('meow');
const teti = require('./');
const ora = require('ora');
const Table = require('cli-table');

console.log(teti);

const cli = meow(`
  Usage
    $ teti <url>

  Options
    -n          number of tests to run (10 is default)
    --verbose   output all data

  Examples
    $ teti google.com -n 96
`);

if (!cli.input[0]) {
    cli.showHelp();
    process.exit(1);
}

const num = cli.flags.n || 10;
const url = cli.input[0].startsWith('http')
    ? cli.input[0]
    : 'http://' + cli.input[0];
const verbose = cli.flags.verbose;

const spinner = ora('Starting performance tests').start();

function notify (current) {
    spinner.text = `Testing timings ${current}/${num}`;
}

teti({ url, num, notify }).then(output => {
    spinner.stop();

    if (verbose) {
        console.log(output.raw);
    }

    const table = new Table({
        head: ['Timing', 'median'],
        colWidths: [20, 20]
    });

    table.push(['domInteractive', output.domInteractive]);
    table.push(['domComplete', output.domComplete]);

    console.log(table.toString());
});
