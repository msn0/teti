const median = require('stats-median');
const percentile = require('stats-percentile');
const mean = require('stats-mean');
const variance = require('stats-variance');
const mad = require('stats-mad');

function twoDigits(value) {
    return (value / 1000).toFixed(2) * 1;
}

function getTimings(data) {
    return function (name) {
        return data
          .map(timing => timing[name])
          .filter(timing => timing > 0)
          .sort();
    };
}

function p95(data) {
    return percentile(data, 95);
}

function analyze(data) {
    const domInteractiveList = getTimings(data)('domInteractive');
    const domCompleteList = getTimings(data)('domComplete');

    return {
        raw: data,
        domInteractive: {
            median: twoDigits(median.calc(domInteractiveList)),
            mean: twoDigits(mean.calc(domInteractiveList)),
            p95: twoDigits(p95(domInteractiveList)),
            variance: twoDigits(variance.calc(domInteractiveList)),
            mad: twoDigits(mad(domInteractiveList))
        },
        domComplete: {
            median: twoDigits(median.calc(domCompleteList)),
            mean: twoDigits(mean.calc(domCompleteList)),
            p95: twoDigits(p95(domCompleteList)),
            variance: twoDigits(variance.calc(domCompleteList)),
            mad: twoDigits(mad(domCompleteList))
        }
    };
}

async function start({ url, num, notify, runner = require('./chrome-runner') }) {

    const data = [];

    for (let current = 1; current <= num; current++) {
        notify({ current });

        const { connectStart, domInteractive, domComplete } = await runner(url);

        if (domInteractive === 0 || domComplete === 0) {
            console.log('Incorrect response, I\'m trying once again.');
            current--;
            continue;
        }

        const timing = {
            domInteractive: domInteractive - connectStart,
            domComplete: domComplete - connectStart
        };

        data.push(timing);
        notify({ timing });
    }

    return analyze(data);
}

module.exports = params => start(params);
