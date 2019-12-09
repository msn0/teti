#!/usr/bin/env node

'use strict';

const meow = require('meow');
const teti = require('./');
const ora = require('ora');
const chalk = require('chalk');
const table = require('text-table');

const cli = meow(`
  Usage
    $ teti <url>

  Options
    --number, -n    number of tests to run (10 is default)
    --runner, -r    specify runner (chrome by default)
    --custom, -c    additional metrics to gather (Navigation Timing API and User Timing API)
    --verbose, -v   output all data

  Examples
    $ teti google.com -n 96
`, {
    flags: {
        number: {
            type: 'number',
            alias: 'n',
            default: 10
        },
        runner: {
            type: 'string',
            alias: 'r',
            default: 'chrome'
        },
        custom: {
            type: 'string',
            alias: 'c'
        }
    }
});

if (!cli.input[0]) {
    cli.showHelp();
    process.exit(1);
}

const url = cli.input[0].startsWith('http')
    ? cli.input[0]
    : 'http://' + cli.input[0];
const runner = require(`./${cli.flags.runner}-runner`);
const custom = Array.isArray(cli.flags.custom)
    ? cli.flags.custom
    : [cli.flags.custom];
const { number, verbose } = cli.flags;

function verboseLog(message) {
    if (verbose) {
        console.log(message);
    }
}

function notify(spinner) {
    return ({ current, timings }) => {
        if (current) {
            spinner.text = `Collecting DOM timings ${current}/${number} `;
        }
        if (timings) {
            verboseLog('\n' + JSON.stringify(timings));
        }
    };
}

(async () => {
    const spinner = ora('Starting performance tests').start();

    const output = await teti({
        url,
        number,
        notify: notify(spinner),
        runner,
        custom
    });

    spinner.stop();

    const headings = [
        'Timing',
        'median',
        'mean',
        'p95',
        'σ²',
        'MAD'
    ].map(h => chalk.cyan(h));
    const rows = output.map(o => [
        chalk.blue(o.name),
        chalk.yellow(o.metrics.median),
        chalk.yellow(o.metrics.mean),
        chalk.yellow(o.metrics.p95),
        chalk.yellow(o.metrics.variance),
        chalk.yellow(o.metrics.mad)
    ]);

    const t = table([headings, ...rows], {
        align: Array.from(headings, () => 'r')
    });

    console.log(`\nResults for ${chalk.bgMagenta(url)} based on ${chalk.bgMagenta(number)} requests:\n`);
    console.log(`${t}\n`);
})();
