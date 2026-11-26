import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// share.js is a classic browser script, so load it into a sandbox.
const context = {};
vm.runInNewContext(readFileSync(new URL('../js/share.js', import.meta.url), 'utf8'), context);
const { buildShareText } = context;

const riddleIds = Array.from({ length: 10 }, (_, i) => `r${i}`);

function makeState(overrides = {}) {
    return {
        dateKey: '2026-11-26',
        riddleIds,
        currentIndex: 0,
        status: 'ended',
        solvedIds: [],
        hintStageByRiddle: {},
        revealCountByRiddle: {},
        ...overrides
    };
}

const squaresOf = (state) => buildShareText(state).split('\n')[1];

test('builds the full message when all riddles are solved', () => {
    const state = makeState({ status: 'completed', currentIndex: 9, solvedIds: riddleIds });
    assert.equal(
        buildShareText(state),
        'CLUE · Nov 26\n🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩\nSolved 10/10\nCan you beat me? https://clue.hecodesme.com'
    );
});

test('counts the current riddle after saving early', () => {
    const state = makeState({ currentIndex: 2, solvedIds: riddleIds.slice(0, 3) });
    assert.equal(squaresOf(state), '🟩🟩🟩⬛⬛⬛⬛⬛⬛⬛');
    assert.match(buildShareText(state), /Solved 3\/10/);
});

test('leaves the failed riddle unsolved after running out of lives, even with help', () => {
    const state = makeState({
        currentIndex: 2,
        solvedIds: riddleIds.slice(0, 2),
        hintStageByRiddle: { r2: 1 }
    });
    assert.equal(squaresOf(state), '🟩🟩⬛⬛⬛⬛⬛⬛⬛⬛');
});

test('marks solved riddles that used a hint or a reveal', () => {
    const state = makeState({
        currentIndex: 2,
        solvedIds: riddleIds.slice(0, 3),
        hintStageByRiddle: { r0: 2 },
        revealCountByRiddle: { r2: 1 }
    });
    assert.equal(squaresOf(state), '🟨🟩🟨⬛⬛⬛⬛⬛⬛⬛');
});

test('shares an attempt with nothing solved', () => {
    assert.match(buildShareText(makeState()), /Solved 0\/10/);
});

test('returns null while the attempt is underway or missing', () => {
    assert.equal(buildShareText(makeState({ status: 'in_progress' })), null);
    assert.equal(buildShareText(null), null);
});

test('returns null when the saved solved list is missing or incomplete', () => {
    assert.equal(buildShareText(makeState({ solvedIds: undefined, currentIndex: 3 })), null);
    assert.equal(buildShareText(makeState({ solvedIds: [], currentIndex: 3 })), null);
    // Underway at release: only riddles solved afterwards were recorded.
    assert.equal(buildShareText(makeState({ solvedIds: ['r3', 'r4'], currentIndex: 4 })), null);
    // Old format flag migrated to a completed state.
    assert.equal(buildShareText(makeState({ status: 'completed', currentIndex: 10 })), null);
});

test('returns null for an old attempt with no solved list at the first riddle', () => {
    assert.equal(buildShareText(makeState({ solvedIds: undefined })), null);
});
