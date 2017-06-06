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

```
➜ teti google.com -n 5 --verbose

⠋ Collecting DOM timings 1/5 { domInteractive: 335, domComplete: 894 }
⠋ Collecting DOM timings 2/5 { domInteractive: 324, domComplete: 898 }
⠋ Collecting DOM timings 3/5 { domInteractive: 364, domComplete: 925 }
⠏ Collecting DOM timings 4/5 { domInteractive: 328, domComplete: 874 }
⠏ Collecting DOM timings 5/5 { domInteractive: 333, domComplete: 914 }

Results for http://google.com based on 5 requests:

┌────────────────────┬──────────┬──────────┬──────────┬──────────┐
│ Timing             │ median   │ mean     │ p95      │ variance │
├────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ domInteractive     │ 0.33     │ 0.34     │ 0.36     │ 0.2      │
├────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ domComplete        │ 0.9      │ 0.9      │ 0.93     │ 0.31     │
└────────────────────┴──────────┴──────────┴──────────┴──────────┘
```

## License

MIT &copy; [Michał Jezierski](https://github.com/msn0)
