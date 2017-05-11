const phantom = require('phantom');

function analyze(data) {
    console.log('\n');
    console.log(data);
}

async function start(num) {

  const data = [];

  for (var i = 0; i < num; i++) {
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

    process.stdout.write('.');
    await instance.exit();
  }

  analyze(data);
}

start(5);
