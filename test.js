import test from 'ava';
import teti from './';

test('should report DOM timings', async t => {
    const connectStart = getConnectStart();
    const domInteractive = getDomInteractive();
    const domComplete = getDomComplete();

    const timings = await teti({
        num: 3,
        url: '',
        notify: () => {},
        runner: () => Promise.resolve({
            connectStart: connectStart.next().value,
            domComplete: domComplete.next().value,
            domInteractive: domInteractive.next().value
        })
    });

    t.deepEqual(
        timings,
        {
            raw: [
                { domInteractive: 99, domComplete: 9 },
                { domInteractive: 118, domComplete: 18 },
                { domInteractive: 147, domComplete: 27 }
            ],
            domInteractive: { median: 0.12, mean: 0.12, p95: 0.15, variance: 0.39 },
            domComplete: { median: 0.02, mean: 0.02, p95: 0.03, variance: 0.05 }
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
