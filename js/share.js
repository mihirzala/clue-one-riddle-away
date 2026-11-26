// Spoiler-free "Share my result" text and the buttons that send it. The text
// carries no riddles, answers or player name.

const SHARE_URL = 'https://clue.hecodesme.com';
const SHARE_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Riddles are solved in order, so a trustworthy list is the first N riddles
// and reaches at least the saved position. Attempts that began before solves
// were recorded fail this check.
function hasCompleteSolvedList(state) {
    const { solvedIds, riddleIds, currentIndex } = state;
    return Array.isArray(solvedIds)
        && solvedIds.length >= currentIndex
        && solvedIds.every((id, index) => id === riddleIds[index]);
}

// Returns null when there is no finished, reliable result to share.
function buildShareText(state) {
    if (!state || state.status === 'in_progress' || !hasCompleteSolvedList(state)) return null;

    const squares = state.riddleIds.map((id) => {
        if (!state.solvedIds.includes(id)) return '⬛';
        const usedHelp = state.hintStageByRiddle[id] > 0 || state.revealCountByRiddle[id] > 0;
        return usedHelp ? '🟨' : '🟩';
    });
    const [, month, day] = state.dateKey.split('-').map(Number);

    return [
        `CLUE · ${SHARE_MONTHS[month - 1]} ${day}`,
        squares.join(''),
        `Solved ${state.solvedIds.length}/${state.riddleIds.length}`,
        `Can you beat me? ${SHARE_URL}`
    ].join('\n');
}

function updateShareButtons(state) {
    const canShare = buildShareText(state) !== null;
    document.querySelectorAll('.share-result-button').forEach((button) => {
        button.classList.toggle('hidden', !canShare);
    });
    document.querySelectorAll('.share-fallback').forEach((box) => box.classList.add('hidden'));
}

function showShareFallback(text) {
    document.querySelectorAll('.share-fallback').forEach((box) => {
        box.value = text;
        box.classList.remove('hidden');
    });
    showMessageNotification('Select the text below to copy your result.');
}

async function shareResult() {
    const text = buildShareText(loadDailyState(getSelectionPlayerId(), dailyKey));
    if (!text) return;

    if (navigator.share) {
        try {
            await navigator.share({ text });
            return;
        } catch (shareError) {
            if (shareError.name === 'AbortError') return; // player closed the share menu
            console.warn('Share menu failed, copying instead', shareError);
        }
    }

    try {
        await navigator.clipboard.writeText(text);
        showMessageNotification('Result copied!');
    } catch (copyError) {
        console.warn('Copy failed, showing the text instead', copyError);
        showShareFallback(text);
    }
}
