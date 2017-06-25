#!/usr/bin/env node

'use strict';

const meow = require('meow');
const teti = require('./');
const ora = require('ora');
const chalk = require('chalk');
const table = require('text-table');
const fkill = require('fkill');
const psList = require('ps-list');

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
const custom = cli.flags.custom || [];

const spinner = ora('Starting performance tests').start();

process.on('SIGINT', () => {
    getHeadlessChromePid().then(p => {
        fkill(p.pid);
        process.exit();
    });
});

function verboseLog(message) {
    if (verbose) {
        console.log(message);
    }
}

function notify({ current, timings }) {
    if (current) {
        spinner.text = `Collecting DOM timings ${current}/${num} `;
    }
    if (timings) {
        verboseLog('\n' + JSON.stringify(timings));
    }
}

function getHeadlessChromePid() {
    return psList().then(data => {
        return data
            .filter(p => ['Google Chrome', 'Google Chrome Canary'].includes(p.name))
            .find(p => p.cmd.indexOf('--headless') !== -1 && p.cmd.indexOf('--remote-debugging-port=9222') !== -1);
    });
}

teti({ url, num, notify, runner, custom }).then(output => {
    spinner.stop();

    const headings = [
        'Timing',
        'median',
        'mean',
        'p95',
        'σ²',
        'MAD'
    ].map(h => chalk.cyan(h));

    const t = table([headings].concat(output.map(o => {
        return [
            chalk.blue(o.name),
            chalk.yellow(o.metrics.median),
            chalk.yellow(o.metrics.mean),
            chalk.yellow(o.metrics.p95),
            chalk.yellow(o.metrics.variance),
            chalk.yellow(o.metrics.mad)
        ];
    })), { align: [ 'r', 'r', 'r', 'r', 'r', 'r' ] });

    console.log(`\nResults for ${chalk.bgMagenta(url)} based on ${chalk.bgMagenta(num)} requests:\n`);
    console.log(`${t}\n`);
});
