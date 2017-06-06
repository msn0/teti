<h1 align="center">
    <br>
    <img width=122 height=71 src="https://raw.githubusercontent.com/msn0/teti/master/teti.png" alt="teti" />
    <br>
    <br>
	<img width=606 height=244 src="https://raw.githubusercontent.com/msn0/teti/master/screencast.gif" alt="teti screencast" />
	<br>
</h1>

> CLI for testing DOM timings

[![Build Status](https://travis-ci.org/msn0/teti.svg?branch=master)](http://travis-ci.org/msn0/teti)

## Installation

```
npm i -g teti
```

## Usage

```
$ teti --help

Usage
  $ teti <url>

Options
  -n          number of tests to run (10 is default)
  --runner    chrome or phantom (chrome is default, at least chrome 59 is needed)
  --verbose   output all data
```

## Examples

```
➜ teti google.com

Results for http://google.com based on 10 requests:

┌────────────────────┬──────────┬──────────┬──────────┬──────────┐
│ Timing             │ median   │ mean     │ p95      │ variance │
├────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ domInteractive     │ 0.34     │ 0.34     │ 0.38     │ 0.25     │
├────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ domComplete        │ 0.83     │ 0.84     │ 0.92     │ 1.21     │
└────────────────────┴──────────┴──────────┴──────────┴──────────┘
```

## License

MIT
