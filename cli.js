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
	  $ teti https://google.com -n 96
`
);

teti(cli.input[0], cli.flags);
