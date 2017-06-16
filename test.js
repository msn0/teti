import test from 'ava';
import teti from './';

test('should report DOM timings', async t => {
    const connectStart = getConnectStart();
    const domInteractive = getDomInteractive();
    const domComplete = getDomComplete();
    const firstPaint = getFirstPaint();
    const firstContentfulPaint = getFirstContentfulPaint();

    const timings = await teti({
        num: 3,
        url: '',
        notify: () => {},
        runner: () => Promise.resolve({
            firstPaint: firstPaint.next().value,
            firstContentfulPaint: firstContentfulPaint.next().value,
            timing: {
                connectStart: connectStart.next().value,
                domComplete: domComplete.next().value,
                domInteractive: domInteractive.next().value
            }
        })
    });

    t.deepEqual(
        timings,
        {
            raw: [
                { domInteractive: 99, domComplete: 9, firstPaint: 12, firstContentfulPaint: 13 },
                { domInteractive: 118, domComplete: 18, firstPaint: 21, firstContentfulPaint: 23 },
                { domInteractive: 147, domComplete: 27, firstPaint: 36, firstContentfulPaint: 37 }
            ],
            domInteractive: { mad: 0.02, median: 0.12, mean: 0.12, p95: 0.15, variance: 0.39 },
            domComplete: { mad: 0.01, median: 0.02, mean: 0.02, p95: 0.03, variance: 0.05 },
            firstPaint: { mad: 0.01, median: 0.02, mean: 0.02, p95: 0.04, variance: 0.1 },
            firstContentfulPaint: { mad: 0.01, median: 0.02, mean: 0.02, p95: 0.04, variance: 0.1 }
        }
    );
});

function* getDomComplete() {
    yield 10;
    yield 20;
    yield 30;
}

function* getDomInteractive() {
    yield 100;
    yield 120;
    yield 150;
}

function* getConnectStart() {
    yield 1;
    yield 2;
    yield 3;
}

function* getFirstPaint() {
    yield 12;
    yield 21;
    yield 36;
}

function* getFirstContentfulPaint() {
    yield 13;
    yield 23;
    yield 37;
}
