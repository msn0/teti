<h1 align="center">
    teti
    <br>
    <br>
	<img src="https://raw.githubusercontent.com/msn0/teti/master/screencast.gif" alt="teti" />
	<br>
</h1>

> CLI for testing DOM timings

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
  --verbose   output all data
```

## Examples

```
$ teti google.com -n 30

Results for http://google.com based on 30 requests:

┌────────────────────┬──────────┬──────────┬──────────┬──────────┐
│ Timing             │ median   │ mean     │ p95      │ variance │
├────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ domInteractive     │ 0.27     │ 0.28     │ 0.47     │ 10       │
├────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ domComplete        │ 0.71     │ 0.72     │ 0.99     │ 15.46    │
└────────────────────┴──────────┴──────────┴──────────┴──────────┘
```

## license

MIT
