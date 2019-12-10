const puppeteer = require('puppeteer');

function getMetrics() {
    return {
        timing: window.performance.timing.toJSON(),
        paint: performance.getEntriesByType('paint').map(mark => mark.toJSON()),
        mark: performance.getEntriesByType('mark').map(mark => mark.toJSON())
    };
}

module.exports = async function launch(url, ignoreHTTPSErrors) {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const results = await page.evaluate(getMetrics);

    await page.close();
    await browser.close();

    return results;
};
