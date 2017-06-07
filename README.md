<h1 align="center">
    <br>
    <img width=122 height=71 src="https://raw.githubusercontent.com/msn0/teti/master/teti.png" alt="teti" />
    <br>
    <br>
	<img width=606 height=244 src="https://raw.githubusercontent.com/msn0/teti/master/screencast.gif" alt="teti screencast" />
	<br>
</h1>

> CLI for testing DOM timings with Headless Chrome (or PhantomJS) under the hood.

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

┌────────────────────┬──────────┬──────────┬──────────┬────────┬────────┐
│ Timing             │ median   │ mean     │ p95      │ σ²     │ MAD    │
├────────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ firstPaint         │ 0.46     │ 0.47     │ 0.53     │ 0.98   │ 0.01   │
├────────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domInteractive     │ 0.34     │ 0.34     │ 0.36     │ 0.71   │ 0.01   │
├────────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domComplete        │ 0.93     │ 0.89     │ 1.01     │ 25.21  │ 0.01   │
└────────────────────┴──────────┴──────────┴──────────┴────────┴────────┘
```

```
➜ teti google.com -n 5 --verbose

⠋ Collecting DOM timings 1/5 {"firstPaint":427,"domInteractive":311,"domComplete":893}
⠋ Collecting DOM timings 2/5 {"firstPaint":442,"domInteractive":316,"domComplete":903}
⠋ Collecting DOM timings 3/5 {"firstPaint":420,"domInteractive":301,"domComplete":908}
⠋ Collecting DOM timings 4/5 {"firstPaint":436,"domInteractive":323,"domComplete":924}
⠋ Collecting DOM timings 5/5 {"firstPaint":435,"domInteractive":318,"domComplete":901}

Results for https://google.com based on 5 requests:

┌────────────────────┬──────────┬──────────┬──────────┬────────┬────────┐
│ Timing             │ median   │ mean     │ p95      │ σ²     │ MAD    │
├────────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ firstPaint         │ 0.43     │ 0.43     │ 0.44     │ 0.06   │ 0.01   │
├────────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domInteractive     │ 0.32     │ 0.31     │ 0.32     │ 0.06   │ 0.01   │
├────────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domComplete        │ 0.9      │ 0.91     │ 0.92     │ 0.11   │ 0.01   │
└────────────────────┴──────────┴──────────┴──────────┴────────┴────────┘
```

## License

MIT &copy; [Michał Jezierski](https://github.com/msn0)
