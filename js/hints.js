// Progressive hint/reveal engine.
//
// Two independent forms of help exist per riddle:
//  - "hint" (buyHint in game.js): up to 2 stages of a written nudge, paid
//    for with round points. Stage 1 is subtle, stage 2 narrows things down.
//  - "reveal" (buyFirstLetter in game.js): a letter-reveal power-up, paid
//    for with a life. How much it can reveal depends entirely on the
//    answer's length, so a 1-3 character answer is never partially revealed
//    (that would just hand over the answer) — it falls back to a third,
//    stronger semantic hint instead.
//
// This file only computes what SHOULD happen; game.js applies it to the DOM
// and to game state (lives, score, daily persistence).

const HINT_STAGE_COSTS = [25, 50]; // points for hint stage 1, then stage 2

function getHintText(question, stage) {
    if (stage === 1) return question.hint1;
    if (stage === 2) return question.hint2;
    return null;
}

// How many characters of the answer may ever be revealed, based on its
// length. Short answers are never partially revealed — one revealed
// character out of 1-3 gives away the whole thing.
function getMaxReveals(answerLength) {
    if (answerLength <= 3) return 0;
    if (answerLength <= 6) return 1;
    if (answerLength <= 9) return 2;
    return 3;
}

// Order in which character positions get revealed: starts near the middle
// and works outward, so the reveal isn't simply "the first N letters" —
// position 0 (the very first letter) is used only as a last resort.
function getRevealOrder(answerLength) {
    const order = [];
    const mid = Math.floor(answerLength / 2);
    for (let offset = 0; order.length < answerLength; offset++) {
        const a = mid + offset;
        const b = mid - offset - 1;
        if (a > 0 && a < answerLength && !order.includes(a)) order.push(a);
        if (b > 0 && b < answerLength && !order.includes(b)) order.push(b);
        if (offset > answerLength) break;
    }
    if (!order.includes(0)) order.push(0);
    return order;
}

// Builds a display string like "_ E _ _ _" for the given answer, with the
// characters at `revealedPositions` shown and everything else masked.
// Non-letter characters (spaces) are always shown through, matching how
// crosswords traditionally handle multi-word answers.
function buildMaskedAnswer(answer, revealedPositions) {
    const revealedSet = new Set(revealedPositions);
    return answer
        .split('')
        .map((char, index) => {
            if (char === ' ') return ' ';
            return revealedSet.has(index) ? char.toUpperCase() : '_';
        })
        .join(' ');
}
