#!/usr/bin/env node

'use strict';

const meow = require('meow');
const teti = require('.');

const cli = meow(`
	Usage
	  $ teti <url>

	Options
	  -n  number of tests to run (10 is default)

	Examples
	  $ teti google.com -n 96
`
);

const num = cli.flags.n || 10;
const url = cli.input[0].startsWith('http')
	? cli.input[0]
	: 'http://' + cli.input[0];

teti(url, num);
