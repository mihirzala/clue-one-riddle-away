const PLAYER_NAME_KEY = 'clue_player_name';
const PLAYER_ID_KEY = 'clue_player_id';

function readCookie(name) {
    const escaped = name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&');
    const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

// localStorage can be wiped by the browser itself (notably iOS Safari's
// Intelligent Tracking Prevention, or standalone "Add to Home Screen" apps
// under memory pressure) even outside private browsing. The player-id/name
// cookies set by api/players.js are set via the server's HTTP response, not
// client-side JS, so they aren't subject to that same eviction — use them
// to recognize a returning player whose localStorage came back empty,
// instead of asking for their name again and starting a new run.
function restoreIdentityFromCookieIfNeeded() {
    if (localStorage.getItem(PLAYER_NAME_KEY) && localStorage.getItem(PLAYER_ID_KEY)) return;

    const cookieName = readCookie(PLAYER_NAME_KEY);
    const cookieId = readCookie(PLAYER_ID_KEY);
    if (cookieName && cookieId) {
        localStorage.setItem(PLAYER_NAME_KEY, cookieName);
        localStorage.setItem(PLAYER_ID_KEY, cookieId);
    }
}

function showPlayerModal() {
    restoreIdentityFromCookieIfNeeded();
    if (!localStorage.getItem(PLAYER_NAME_KEY)) {
        document.getElementById('player-modal').classList.remove('hidden');
        document.getElementById('player-name-input').focus();
    }
}

async function savePlayerName() {
    const input = document.getElementById('player-name-input');
    const button = document.getElementById('save-player-button');
    const error = document.getElementById('player-name-error');
    const name = input.value.trim();

    if (!name || name.length > 50) {
        error.textContent = 'Please enter a name between 1 and 50 characters.';
        return;
    }

    button.disabled = true;
    button.textContent = 'SAVING...';
    error.textContent = '';

    try {
        const result = await fetch('/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        let data;
        try {
            data = await result.json();
        } catch {
            throw new Error('Unable to save your name right now. Please try again later.');
        }
        if (!result.ok) throw new Error(data.error || 'Unable to save your name.');

        localStorage.setItem(PLAYER_NAME_KEY, data.name);
        localStorage.setItem(PLAYER_ID_KEY, data.playerId);
        document.getElementById('player-modal').classList.add('hidden');
    } catch (saveError) {
        error.textContent = saveError.message;
        button.disabled = false;
        button.textContent = 'CONTINUE';
    }
}

document.getElementById('player-name-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') savePlayerName();
});

showPlayerModal();
