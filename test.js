import test from 'ava';
import teti from './';

test('should report DOM timings', async t => {
    const connectStart = getConnectStart();
    const domLoading = getDomLoading();
    const domInteractive = getDomInteractive();
    const domComplete = getDomComplete();
    const firstPaint = getFirstPaint();
    const fooBar = getFooBar();

    const timings = await teti({
        num: 5,
        url: '',
        custom: ['foo bar'],
        notify: () => {},
        runner: () => Promise.resolve({
            timing: {
                connectStart: connectStart.next().value,
                domLoading: domLoading.next().value,
                domInteractive: domInteractive.next().value,
                domComplete: domComplete.next().value
            },
            paint: [{
                name: 'first-paint',
                startTime: firstPaint.next().value
            }],
            mark: [{
                name: 'foo bar',
                entryType: 'mark',
                startTime: fooBar.next().value,
                duration: 0
            }]
        })
    });

    t.deepEqual(
        timings,
        [{
            name: 'domLoading',
            metrics: {
                mad: 0.06,
                mean: 0.95,
                median: 0.94,
                p95: 1.1,
                variance: 7.87
            }
        }, {
            name: 'domInteractive',
            metrics: {
                mad: 0.12,
                mean: 1.11,
                median: 1.05,
                p95: 1.36,
                variance: 27.6
            }
        }, {
            name: 'domComplete',
            metrics: {
                mad: 0.09,
                mean: 1.38,
                median: 1.35,
                p95: 1.57,
                variance: 13.75
            }
        }, {
            name: 'first-paint',
            metrics: {
                mad: 0.02,
                mean: 0.61,
                median: 0.58,
                p95: 0.68,
                variance: 2.41
            }
        }, {
            name: 'foo bar',
            metrics: {
                mad: 0.01,
                mean: 2.13,
                median: 2.16,
                p95: 2.17,
                variance: 4.56
            }
        }]
    );
});

function* getDomLoading() {
    yield 885;
    yield 846;
    yield 1000;
    yield 1100;
    yield 940;
}

function* getDomInteractive() {
    yield 940;
    yield 950;
    yield 1360;
    yield 1250;
    yield 1060;
}

function* getDomComplete() {
    yield 1350;
    yield 1462;
    yield 1570;
    yield 1268;
    yield 1271;
}

function* getConnectStart() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
}

function* getFirstPaint() {
    yield 660;
    yield 570;
    yield 680;
    yield 562;
    yield 583;
}

function* getFooBar() {
    yield 2160;
    yield 2170;
    yield 1993;
    yield 2162;
    yield 2153;
}
