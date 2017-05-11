const phantom = require('phantom');

async function start() {
  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.open(`http://allegro.pl`);

  const timing = await page.evaluate(function() {
      return window.performance.timing;
  });

  const connectStart = timing.connectStart;
  const domInteractive = timing.domInteractive;
  const domComplete = timing.domComplete;

  console.log('domInteractive:\t', domInteractive - connectStart);
  console.log('domComplete: \t', domComplete - connectStart);

  await instance.exit();
}

start();
