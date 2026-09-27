// Deterministic, per-player daily riddle selection.
//
// Goal: the same player, on the same local calendar day, always gets the
// same 10 riddles — across refreshes, closing/reopening the tab, and
// restarting the game — while different players generally get different
// riddles, and nobody sees a riddle they solved in roughly the last month
// (when the pool allows avoiding it).
//
// No Math.random() is used for the actual daily assignment: everything is
// derived from a seed built out of (playerId, date, tier), so the result is
// fully reproducible from those three inputs alone.

const RECENT_RIDDLE_AVOID_DAYS = 21; // within the 14-30 day range requested
const ANON_PLAYER_ID_KEY = 'clue_anon_player_id';
const RECENT_RIDDLES_KEY = 'clue_recent_riddles';

// Small, fast, deterministic 32-bit string hash (djb2 variant). Good enough
// for seeding a PRNG — this is not used for anything security-sensitive.
function hashStringToInt(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
    }
    return hash >>> 0;
}

// mulberry32: a tiny, fast, deterministic PRNG. Same seed -> same sequence,
// every time, on every device.
function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Returns a stable identifier to key daily selection off of, even before
// (or without) a registered player ID — so a fresh visitor doesn't get a
// new random set on every refresh while the player-name modal is open.
function getSelectionPlayerId() {
    const registered = localStorage.getItem(PLAYER_ID_KEY);
    if (registered) return registered;

    let anonId = localStorage.getItem(ANON_PLAYER_ID_KEY);
    if (!anonId) {
        anonId = (crypto.randomUUID ? crypto.randomUUID() : `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`);
        localStorage.setItem(ANON_PLAYER_ID_KEY, anonId);
    }
    return anonId;
}

function readRecentRiddleHistory() {
    try {
        const raw = localStorage.getItem(RECENT_RIDDLES_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function pruneRecentRiddleHistory(history, todayKey) {
    const cutoff = new Date(todayKey);
    cutoff.setDate(cutoff.getDate() - RECENT_RIDDLE_AVOID_DAYS);
    const pruned = {};
    for (const [riddleId, shownOn] of Object.entries(history)) {
        if (new Date(shownOn) >= cutoff) {
            pruned[riddleId] = shownOn;
        }
    }
    return pruned;
}

function recordRiddlesShown(riddleIds, todayKey) {
    let history = readRecentRiddleHistory();
    history = pruneRecentRiddleHistory(history, todayKey);
    for (const id of riddleIds) {
        history[id] = todayKey;
    }
    try {
        localStorage.setItem(RECENT_RIDDLES_KEY, JSON.stringify(history));
    } catch {
        // Storage full or unavailable — recent-riddle avoidance is a nice-to-have,
        // never worth breaking the game over.
    }
}

// Picks exactly one riddle per tier (1..10), deterministically, for the
// given player + date. Recently-shown riddles are avoided when the tier has
// another valid option; otherwise the deterministic pick is used anyway
// (correctness of the difficulty curve outranks repeat avoidance).
function pickDailyRiddles(playerId, dateKey) {
    const recentHistory = pruneRecentRiddleHistory(readRecentRiddleHistory(), dateKey);
    // Only avoid riddles shown on a DIFFERENT day. Today's own past selection
    // (e.g. from an earlier attempt today, after a bust) must stay eligible,
    // or a retry on the same day would reroll instead of reusing today's set.
    const avoidIds = new Set(
        Object.entries(recentHistory)
            .filter(([, shownOn]) => shownOn !== dateKey)
            .map(([riddleId]) => riddleId)
    );
    const selected = [];

    for (const tier of RIDDLE_TIERS) {
        const candidates = ENGLISH_RIDDLE_POOL[tier];
        const fresh = candidates.filter((riddle) => !avoidIds.has(riddle.id));
        const pool = fresh.length > 0 ? fresh : candidates;

        const seed = hashStringToInt(`${playerId}|${dateKey}|tier${tier}`);
        const rng = mulberry32(seed);
        const index = Math.floor(rng() * pool.length);

        selected.push({ ...pool[index] });
    }

    return selected;
}
