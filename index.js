const phantom = require('phantom');
const ora = require('ora');
const median = require('stats-median');

function analyze(data) {
    const domInteractiveList = data.map(timing => timing.domInteractive).sort();
    const domCompleteList = data.map(timing => timing.domComplete).sort();

    console.log(data);

    console.log('domInteractive:\t', median.calc(domInteractiveList));
    console.log('domComplete: \t', median.calc(domCompleteList));
}

async function start(num) {

  const data = [];
  const spinner = ora('Starting performance tests').start();

  for (var i = 1; i <= num; i++) {
    spinner.text = `Testing timings ${i}/${num}`;

    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.open(`http://allegro.pl`);

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

start(30);
