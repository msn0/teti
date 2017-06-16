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
const runner = cli.flags.runner && require(`./${cli.flags.runner}-runner`);

const spinner = ora('Starting performance tests').start();

function verboseLog(message) {
    if (verbose) {
        console.log(message);
    }
}

function notify({ current, timing }) {
    if (current) {
        spinner.text = `Collecting DOM timings ${current}/${num} `;
    }
    if (timing) {
        verboseLog(JSON.stringify(timing));
    }
}

teti({ url, num, notify, runner }).then(output => {
    spinner.stop();

    const table = new Table({
        head: ['Timing', 'median', 'mean', 'p95', 'σ²', 'MAD'],
        colWidths: [20, 10, 10, 10, 8, 8]
    });
    console.log(output);

    output.forEach(o => {
        table.push([
            o.name,
            o.metrics.median,
            o.metrics.mean,
            o.metrics.p95,
            o.metrics.variance,
            o.metrics.mad
        ]);
    });

    console.log(`\nResults for ${url} based on ${num} requests:\n`);
    console.log(table.toString());
});
