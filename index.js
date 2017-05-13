const phantom = require('phantom');
const ora = require('ora');
const median = require('stats-median');

function getTimings(data) {
    return function (name) {
        return data
          .map(timing => timing[name])
          .filter(timing => timing > 0)
          .sort();
    };
}

function analyze(data) {
    const domInteractiveList = getTimings(data)('domInteractive');
    const domCompleteList = getTimings(data)('domComplete');

    console.log(data);

    console.log('domInteractive:\t', (median.calc(domInteractiveList) / 1000).toFixed(2));
    console.log('domComplete: \t', (median.calc(domCompleteList) / 1000).toFixed(2));
}

async function start(url, flags) {

  const data = [];
  const spinner = ora('Starting performance tests').start();

  for (var i = 1; i <= flags.n; i++) {
    spinner.text = `Testing timings ${i}/${flags.n}`;

    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.open(url);

    const { connectStart, domInteractive, domComplete } = await page.evaluate(function () {
        return window.performance.timing;
    });

    data.push({
      domInteractive: domInteractive - connectStart,
      domComplete: domComplete - connectStart
    });

    await instance.exit();
  }

  spinner.stop();
  analyze(data);
}

module.exports = function (url, flags) {
  start(url, flags);
};
