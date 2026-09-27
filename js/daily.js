const now = new Date();

function getLocalDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const dailyKey = getLocalDateKey(now);

// QUESTIONS is populated once a daily state exists for today (see game.js's
// resumeOrStartDailyState). Declared here, mutated in place, so every other
// file that reads QUESTIONS keeps working against the same array reference.
const QUESTIONS = [];

function updateWelcomeUI() {
    document.getElementById('welcome-heading').textContent = 'Ready to solve?';
    document.getElementById('welcome-description').textContent = 'Solve today’s 10 riddles. Each one gets harder.';
    document.getElementById('daily-challenge-label').textContent = `TODAY’S CHALLENGE — ${dailyKey}`;
    document.getElementById('start-game-button').textContent = 'START GAME';
    document.getElementById('answer-input').placeholder = 'Type your answer...';
    document.getElementById('check-answer-label').textContent = 'CHECK ANSWER';
}
updateWelcomeUI();

function renewChallengeIfDateChanged() {
    if (getLocalDateKey() !== dailyKey) {
        window.location.reload();
        return true;
    }
    return false;
}

const nextMidnight = new Date(now);
nextMidnight.setHours(24, 0, 0, 0);
setTimeout(() => window.location.reload(), nextMidnight.getTime() - now.getTime() + 500);
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) renewChallengeIfDateChanged();
});
