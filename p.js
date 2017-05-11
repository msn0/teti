// var page = require('webpage').create();
//
// page.onConsoleMessage = function (message) {
//     console.log(message);
// };

const Phantom = require('phantom');
const phantom = new Phantom();


phantom.createPage().then(() => {
  console.log("ssss");
});



let response = await page.evaluate(async function (status) {
    const connectStart = window.performance.timing.connectStart;
    const domInteractive = window.performance.timing.domInteractive;
    const domComplete = window.performance.timing.domComplete;

    console.log('testtest');

    return [domInteractive - connectStart, domComplete - connectStart];
});

console.log(response);
