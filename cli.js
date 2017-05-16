#!/usr/bin/env node

'use strict';

const meow = require('meow');
const teti = require('./');
const ora = require('ora');
const Table = require('cli-table');

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

function verboseLog(message) {
    if (verbose) {
        console.log(message);
    }
}

function notify(current, timing) {
    spinner.text = `Collecting DOM timings ${current}/${num}`;

    verboseLog(timing);
}

teti({ url, num, notify }).then(output => {
    spinner.stop();

    const table = new Table({
        head: ['Timing', 'median', 'mean', 'p95', 'variance'],
        colWidths: [20, 10, 10, 10, 10]
    });

    table.push([
        'domInteractive',
        output.domInteractive.median,
        output.domInteractive.mean,
        output.domInteractive.p95,
        output.domInteractive.variance]
    );
    table.push([
        'domComplete',
        output.domComplete.median,
        output.domComplete.mean,
        output.domComplete.p95,
        output.domComplete.variance]
    );

    verboseLog(output.raw);
    console.log(`\nResults for ${url} based on ${num} requests:\n`);
    console.log(table.toString());
});
