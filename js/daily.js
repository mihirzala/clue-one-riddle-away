const now = new Date();
const dayOfYear = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000
);
const challengeDay = ((dayOfYear - 1) % 365) + 1;
function getLocalDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const dailyKey = getLocalDateKey(now);
const QUESTIONS = BASE_QUESTIONS.map((question, index) =>
    ((challengeDay - 1) >> index) & 1 ? ALT_QUESTIONS[index] : question
);
document.getElementById('daily-challenge-label').textContent = `DAY ${challengeDay} OF 365`;

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

