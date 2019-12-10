#!/usr/bin/env node

'use strict';

const meow = require('meow');
const ora = require('ora');
const chalk = require('chalk');

const printOutput = require('./print-output');
const teti = require('./');

const cli = meow(`
  Usage
    $ teti <url>

  Options
    --number, -n     number of tests to run (10 is default)
    --runner, -r     specify runner (chrome is default)
    --custom, -c     additional metrics to gather (Navigation Timing API and User Timing API)
    --output, -o     output format: table or csv, (table is default)
    --insecure, -i   allow to open insecure pages, like localhost over HTTPS with self-signed certificate
    --verbose, -v    output all data

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
        },
        output: {
            type: 'string',
            alias: 'o',
            default: 'pretty'
        },
        insecure: {
            type: 'boolean',
            alias: 'i',
            default: false
        }
    }
});

if (!cli.input[0]) {
    cli.showHelp();
    process.exit(1);
}

function toArray(value) {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

const url = cli.input[0].startsWith('http')
    ? cli.input[0]
    : 'http://' + cli.input[0];
const runner = require(`./${cli.flags.runner}-runner`);
const custom = toArray(cli.flags.custom);
const { number, verbose, output: outputFormat, insecure } = cli.flags;

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
        custom,
        insecure
    });

    spinner.stop();

    const headings = [
        'Timing',
        'median',
        'mean',
        'p95',
        'σ²',
        'MAD'
    ];
    const rows = output.map(({ name, metrics }) => [
        name,
        metrics.median,
        metrics.mean,
        metrics.p95,
        metrics.variance,
        metrics.mad
    ]);

    switch (outputFormat) {
        case 'pretty': {
            printOutput.prettyTable(
                `Results for ${chalk.bgMagenta(url)} based on ${chalk.bgMagenta(number)} requests:`,
                headings,
                rows
            );
            break;
        }
        case 'table': {
            printOutput.nativeTable(headings, rows);
            break;
        }
        case 'csv': {
            printOutput.csv(headings, rows);
            break;
        }
        default: {
            printOutput.prettyTable(
                `Unsupported output format ${outputFormat}`,
                headings,
                rows
            );
        }
    }
})();
