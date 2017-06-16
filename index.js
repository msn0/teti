const median = require('stats-median').calc;
const percentile = require('stats-percentile');
const mean = require('stats-mean').calc;
const variance = require('stats-variance').calc;
const mad = require('stats-mad');

const timingsToCollect = [
    'domLoading', 'domInteractive', 'domComplete'
];

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

function analyze(data) {
    const getDataTimings = getTimings(data);

    return timingsToCollect.map(t => {
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

async function start({ url, num, notify, runner = require('./chrome-runner') }) {

    const data = [];

    for (let current = 1; current <= num; current++) {
        notify({ current });

        const response = await runner(url);
        const { timing, paint } = response;

        const timings = Object.keys(timing)
            .map(name => ({
                name,
                value: timing[name] - timing.connectStart
            }))
            .filter(t => t.value > 0);

        const paints = Object.keys(paint)
            .map(name => ({
                name,
                value: paint[name].startTime.toFixed(0) * 1
            }))
            .filter(t => t.value > 0);

        data.push(timings);

        notify({ timings });
    }

    const analyzedData = analyze(data);
    console.log(analyzedData);
    return analyzedData;
}

module.exports = params => start(params);
