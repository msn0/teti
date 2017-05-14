#!/usr/bin/env node

'use strict';

const meow = require('meow');
const teti = require('.');

const cli = meow(`
    Usage
    $ teti <url>

  Options
    -n          number of tests to run (10 is default)
    --verbose   detailed output

  Examples
    $ teti google.com -n 96
`
);

if (!cli.input[0]) {
    cli.showHelp();
    process.exit(1);
}

const num = cli.flags.n || 10;
const url = cli.input[0].startsWith('http')
    ? cli.input[0]
    : 'http://' + cli.input[0];
const verbose = cli.flags.verbose;

teti({ url, num, verbose });
