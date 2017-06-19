<h1 align="center">
    <br>
    <img width=122 height=71 src="https://raw.githubusercontent.com/msn0/teti/master/teti.png" alt="teti" />
    <br>
    <br>
	<img width=606 height=244 src="https://raw.githubusercontent.com/msn0/teti/master/screencast.gif" alt="teti screencast" />
	<br>
</h1>

> CLI for testing DOM timings built upon [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome) & [Lighthouse](https://github.com/GoogleChrome/lighthouse) 💜

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
  --custom    custom [User Timing](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) (performance.mark) to be measured
  --verbose   output all data
```

## Examples

```
➜ teti google.com

Results for http://google.com based on 10 requests:

┌────────────────┬──────────┬──────────┬──────────┬────────┬────────┐
│ Timing         │ median   │ mean     │ p95      │ σ²     │ [MAD](https://en.wikipedia.org/wiki/Median_absolute_deviation)    │
├────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domLoading     │ 0.21     │ 0.2      │ 0.21     │ 0.03   │ 0      │
├────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domInteractive │ 0.31     │ 0.31     │ 0.36     │ 0.49   │ 0.01   │
├────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domComplete    │ 0.68     │ 0.7      │ 0.78     │ 2.15   │ 0.01   │
├────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ first-paint    │ 0.38     │ 0.38     │ 0.41     │ 0.27   │ 0.01   │
└────────────────┴──────────┴──────────┴──────────┴────────┴────────┘
```

```
➜ teti https://www.theguardian.com/football -n 30 --custom "commercial boot"

Results for https://www.theguardian.com/football based on 30 requests:

┌─────────────────┬──────────┬──────────┬──────────┬────────┬────────┐
│ Timing          │ median   │ mean     │ p95      │ σ²     │ [MAD](https://en.wikipedia.org/wiki/Median_absolute_deviation)    │
├─────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domLoading      │ 0.16     │ 0.16     │ 0.17     │ 0.03   │ 0      │
├─────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domInteractive  │ 0.64     │ 0.67     │ 0.85     │ 7.59   │ 0.05   │
├─────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ domComplete     │ 3.59     │ 4.04     │ 10.43    │ 3797.… │ 0.38   │
├─────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ first-paint     │ 0.34     │ 0.34     │ 0.39     │ 0.41   │ 0.01   │
├─────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│ commercial boot │ 0.83     │ 0.84     │ 1.04     │ 14.02  │ 0.08   │
└─────────────────┴──────────┴──────────┴──────────┴────────┴────────┘
```

## License

MIT &copy; [Michał Jezierski](https://github.com/msn0)
