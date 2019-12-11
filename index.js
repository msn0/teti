const median = require('stats-median').calc;
const percentile = require('@elstats/percentile');
const mean = require('@elstats/mean');
const variance = require('stats-variance').calc;
const mad = require('stats-mad');
const timingsToCollect = require('./timings');

function twoDigits(value) {
    return (value / 1000).toFixed(2) * 1;
}

function getTimings(measurements) {
    return (name) => measurements
        .map(measurement => {
            const found = measurement.find(timing => timing.name === name);

            if (found) {
                return found.value;
            }

            return null;
        })
        .filter(Boolean)
        .sort();
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

function getPreset(error, presets, presetName) {
    if (!presetName) {
        return null;
    }

    if (!presets[presetName]) {
        throw new Error(`Unknown ${error} ${presetName}`);
    }

    return presets[presetName];
}

async function start({
    url,
    number,
    notify,
    custom,
    runner,
    insecure,
    device,
    network,
    devicePresets,
    networkPresets
}) {

    const data = [];

    const deviceSettings = getPreset('device name', devicePresets, device);
    const networkSettings = getPreset('network preset', networkPresets, network);

    for (let current = 1; current <= number; current++) {
        notify({ current });

        const { timing, paint, mark } = await runner({
            url,
            insecure,
            deviceSettings,
            networkSettings
        });

        const timings = Object.keys(timing)
            .map(name => ({
                name,
                value: timing[name] - timing.connectStart
            }))
            .concat(paint.map(toTiming), mark.map(toTiming))
            .filter(t => t.value > 0);

        data.push(timings);

        notify({ timings });
    }

    const results = analyze(data, custom);

    return { results, deviceSettings, networkSettings };
}

module.exports = params => start(params);
