const phantom = require('phantom');
const ora = require('ora');

function analyze(data) {
    console.log(data);
}

async function start(num) {

  const data = [];
  const spinner = ora('Starting performance tests').start();

  for (var i = 1; i <= num; i++) {
    spinner.text = `Testing timings ${i}/${num}`;

    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.open(`http://allegro.pl`);

    const timing = await page.evaluate(function () {
        return window.performance.timing;
    });

    const connectStart = timing.connectStart;
    const domInteractive = timing.domInteractive;
    const domComplete = timing.domComplete;

    data.push({
      domInteractive: domInteractive - connectStart,
      domComplete: domComplete - connectStart
    });

    spinner.stop();

    await instance.exit();
  }

  analyze(data);
}

start(2);
