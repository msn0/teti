const puppeteer = require('puppeteer');

function getMetrics() {
    return {
        timing: window.performance.timing.toJSON(),
        paint: performance.getEntriesByType('paint').map(mark => mark.toJSON()),
        mark: performance.getEntriesByType('mark').map(mark => mark.toJSON())
    };
}

module.exports = async function launch({
    url,
    insecure,
    deviceSettings,
    networkSettings
}) {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: insecure });
    const [page] = await browser.pages();

    if (deviceSettings) {
        if (deviceSettings.ua) {
            await page.setUserAgent(deviceSettings.ua);
        }

        await page.setViewport({
            width: deviceSettings.width,
            height: deviceSettings.height,
            deviceScaleFactor: deviceSettings.dpr
        });
    }

    if (networkSettings) {
        const devTools = await page.target().createCDPSession();
        await devTools.send('Network.emulateNetworkConditions', {
            offline: false,
            downloadThroughput: networkSettings.download,
            uploadThroughput: networkSettings.upload,
            latency: networkSettings.latency
        });
    }

    await page.goto(url, { waitUntil: 'networkidle2' });

    const results = await page.evaluate(getMetrics);

    await page.close();
    await browser.close();

    return results;
};
