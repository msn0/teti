const puppeteer = require('puppeteer');

module.exports = async function launch(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const results = await page.evaluate(() => {
        return {
            timing: window.performance.timing.toJSON(),
            paint: performance.getEntriesByType('paint').map(mark => mark.toJSON()),
            mark: performance.getEntriesByType('mark').map(mark => mark.toJSON())
        };
    });

    await page.close();
    await browser.close();

    return results;
};
