const median = require('stats-median').calc;
const percentile = require('stats-percentile');
const mean = require('stats-mean').calc;
const variance = require('stats-variance').calc;
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
    const firstPaintList = getTimings(data)('firstPaint');
    const domInteractiveList = getTimings(data)('domInteractive');
    const domCompleteList = getTimings(data)('domComplete');

    return {
        raw: data,
        firstPaint: {
            median: twoDigits(median(firstPaintList)),
            mean: twoDigits(mean(firstPaintList)),
            p95: twoDigits(p95(firstPaintList)),
            variance: twoDigits(variance(firstPaintList)),
            mad: twoDigits(mad(firstPaintList))
        },
        domInteractive: {
            median: twoDigits(median(domInteractiveList)),
            mean: twoDigits(mean(domInteractiveList)),
            p95: twoDigits(p95(domInteractiveList)),
            variance: twoDigits(variance(domInteractiveList)),
            mad: twoDigits(mad(domInteractiveList))
        },
        domComplete: {
            median: twoDigits(median(domCompleteList)),
            mean: twoDigits(mean(domCompleteList)),
            p95: twoDigits(p95(domCompleteList)),
            variance: twoDigits(variance(domCompleteList)),
            mad: twoDigits(mad(domCompleteList))
        }
    };
}

async function start({ url, num, notify, runner = require('./chrome-runner') }) {

    const data = [];

    for (let current = 1; current <= num; current++) {
        notify({ current });

        const response = await runner(url);
        const { connectStart, domInteractive, domComplete } = response.timing;
        const firstPaint = response.firstPaint;

        if (domInteractive === 0 || domComplete === 0) {
            console.log('Incorrect response, I\'m trying once again.');
            current--;
            continue;
        }

        const timing = {
            firstPaint: firstPaint.toFixed(0) * 1,
            domInteractive: domInteractive - connectStart,
            domComplete: domComplete - connectStart
        };

        data.push(timing);
        notify({ timing });
    }

    return analyze(data);
}

module.exports = params => start(params);
