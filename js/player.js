const PLAYER_NAME_KEY = 'clue_player_name';
const PLAYER_ID_KEY = 'clue_player_id';

function showPlayerModal() {
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
        const data = await result.json();
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
