// Persists today's daily-challenge state so a refresh or a closed tab never
// rerolls the day's 10 riddles or loses mid-run progress — and so a player
// gets exactly one attempt per local calendar day. Keyed to the current
// player + today's local date, so a new day (or genuinely different player)
// starts fresh.

const DAILY_STATE_KEY = 'clue_daily_state_v1';

// status meanings:
//   'in_progress' — today's one attempt is underway; resume it in place,
//                   never restart it, on a refresh or reopened tab
//   'ended'       — today's attempt busted or was banked early; that was
//                   the day's one attempt, so no further attempts today
//   'completed'   — all 10 solved; no further attempts today
function loadDailyState(playerId, dateKey) {
    let raw;
    try {
        raw = localStorage.getItem(DAILY_STATE_KEY);
    } catch {
        return null;
    }
    if (!raw) return null;

    let state;
    try {
        state = JSON.parse(raw);
    } catch {
        return null;
    }

    if (!state || state.playerId !== playerId || state.dateKey !== dateKey) {
        return null;
    }
    return state;
}

function saveDailyState(state) {
    try {
        localStorage.setItem(DAILY_STATE_KEY, JSON.stringify(state));
    } catch {
        // Best-effort only — losing persistence shouldn't crash the game.
    }
}

function createFreshDailyState(playerId, dateKey, riddleIds) {
    return {
        playerId,
        dateKey,
        riddleIds,
        currentIndex: 0,
        pendingScore: 0,
        bankedScore: 0,
        lives: 4,
        status: 'in_progress',
        trail: [],
        hintStageByRiddle: {},
        revealCountByRiddle: {}
    };
}
