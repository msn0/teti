// @source https://github.com/ChromeDevTools/devtools-frontend/blob/efc39691ea8dd5b8576dfbcc8feff814e6e326d9/front_end/sdk/NetworkManager.js#L244-L257
module.exports = {
    'Fast 3G': {
        download: 1.6 * 1024 * 1024 / 8 * .9,
        upload: 750 * 1024 / 8 * .9,
        latency: 150 * 3.75
    },
    'Slow 3G': {
        download: 500 * 1024 / 8 * .8,
        upload: 500 * 1024 / 8 * .8,
        latency: 400 * 5
    }
};
