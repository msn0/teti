#!/usr/bin/env node

'use strict';

const meow = require('meow');
const ora = require('ora');
const chalk = require('chalk');
const UA = require('@financial-times/polyfill-useragent-normaliser');

const printOutput = require('./print-output');
const teti = require('./');

const networkPresets = require('./network-presets');
const devicePresets = require('./device-presets');

function listPresets(presets) {
    return Object.keys(presets).join(', ');
}

const cli = meow(`
  Usage
    $ teti <url>

  Options
    --number,   -n    number of tests to run (10 is default)
    --runner,   -r    specify runner; available options: chrome (default)
    --custom,   -c    additional metrics to gather (Navigation Timing API and User Timing API)
    --output,   -o    output format; available options: pretty (default), table, csv
    --insecure, -i    allow to open insecure pages, like localhost over HTTPS with self-signed certificate
    --device,   -d    allow to emulate a device; available options: ${listPresets(devicePresets)}
    --network,  -k    allow to emulate network conditions; available options: ${listPresets(networkPresets)}
    --verbose,  -v    output all data

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
        },
        device: {
            type: 'string',
            alias: 'd'
        },
        network: {
            type: 'string',
            alias: 'k'
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
const { number, verbose, output: outputFormat, insecure, network, device } = cli.flags;

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

function printDeviceSettings(settings) {
    if (!settings) {
        return '';
    }

    const ua = new UA(settings.ua);
    const friendlyUa = `${ua.getFamily()} ${ua.getVersion()}`;

    return `\nDevice: ${chalk.bgMagenta(device)} ` +
        `(Viewport size: ${settings.width}x${settings.height}, DPR: ${settings.dpr})\n` +
        `User-Agent: ${chalk.bgMagenta(friendlyUa)} (${settings.ua})`;
}

function printNetworkSettings(settings) {
    if (!settings) {
        return '';
    }

    return `\nNetwork: ${chalk.bgMagenta(network)} ` +
        `(Up: ${Math.round(settings.upload)} kbps, Down: ${Math.round(settings.download)} kbps, ` +
        `Latency: ${settings.latency} ms)`;
}

(async () => {
    const spinner = ora('Starting performance tests').start();

    try {
        const { results, deviceSettings, networkSettings } = await teti({
            url,
            number,
            notify: notify(spinner),
            runner,
            custom,
            insecure,
            device,
            network,
            devicePresets,
            networkPresets
        });

        const headings = [
            'Timing',
            'median',
            'mean',
            'p95',
            'σ²',
            'MAD'
        ];
        const rows = results.map(({ name, metrics }) => [
            name,
            metrics.median,
            metrics.mean,
            metrics.p95,
            metrics.variance,
            metrics.mad
        ]);

        switch (outputFormat) {
            case 'pretty': {
                spinner.succeed();
                printOutput.prettyTable(
                    `Results for ${chalk.bgMagenta(url)} based on ${chalk.bgMagenta(number)} requests` +
                    printNetworkSettings(networkSettings) + printDeviceSettings(deviceSettings) + '\n',
                    headings,
                    rows
                );
                break;
            }
            case 'table': {
                spinner.succeed();
                printOutput.nativeTable(headings, rows);
                break;
            }
            case 'csv': {
                spinner.stop();
                printOutput.csv(headings, rows);
                break;
            }
            default: {
                spinner.stop();
                printOutput.prettyTable(
                    `Unsupported output format ${outputFormat}`,
                    headings,
                    rows
                );
            }
        }
    } catch (err) {
        spinner.fail(err.message);
    }
})();
