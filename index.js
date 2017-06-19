const median = require('stats-median').calc;
const percentile = require('stats-percentile');
const mean = require('stats-mean').calc;
const variance = require('stats-variance').calc;
const mad = require('stats-mad');
const timingsToCollect = require('./timings');

function twoDigits(value) {
    return (value / 1000).toFixed(2) * 1;
}

function getTimings(measurements) {
    return function(name) {
        return measurements
            .map(measurement => {
                return measurement
                    .filter(timing => timing.name === name)
                    .map(timing => timing.value);
            }).map(t => t[0]).sort();
    };
}

function p95(data) {
    return percentile(data, 95);
}

function analyze(data, custom) {
    const getDataTimings = getTimings(data);

    return timingsToCollect.concat(custom).map(t => {
        const timings = getDataTimings(t);

        return {
            name: t,
            metrics: {
                median: twoDigits(median(timings)),
                mean: twoDigits(mean(timings)),
                p95: twoDigits(p95(timings)),
                variance: twoDigits(variance(timings)),
                mad: twoDigits(mad(timings))
            }
        };
    });
}

function toTiming({ name, startTime }) {
    return {
        name,
        value: startTime.toFixed(0) * 1
    };
}

async function start({ url, num, notify, custom, runner = require('./chrome-runner') }) {

    const data = [];

    for (let current = 1; current <= num; current++) {
        notify({ current });

        const { timing, paint, mark } = await runner(url);

        const timings = Object.keys(timing)
            .map(name => ({
                name,
                value: timing[name] - timing.connectStart
            }))
            .concat(paint.map(toTiming))
            .concat(mark.map(toTiming))
            .filter(t => t.value > 0);

        data.push(timings);
        notify({ timings });
    }

    return analyze(data, custom);
}

module.exports = params => start(params);
