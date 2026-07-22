const now = new Date();
const dayOfYear = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000
);
const challengeDay = ((dayOfYear - 1) % 365) + 1;
function getLocalDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const dailyKey = getLocalDateKey(now);
let activeLanguage = localStorage.getItem('clue_language') === 'gu' ? 'gu' : 'en';

function buildDailyQuestions(language) {
    if (language === 'gu') return GUJARATI_QUESTIONS.map((question) => ({ ...question }));
    return BASE_QUESTIONS.map((question, index) => ({
        ...(((challengeDay - 1) >> index) & 1 ? ALT_QUESTIONS[index] : question)
    }));
}

const QUESTIONS = buildDailyQuestions(activeLanguage);

function updateLanguageUI() {
    const gujarati = activeLanguage === 'gu';
    document.documentElement.lang = gujarati ? 'gu' : 'en';
    document.getElementById('welcome-heading').textContent = gujarati ? 'કોયડો ઉકેલવા તૈયાર?' : 'Ready to solve?';
    document.getElementById('welcome-description').textContent = gujarati
        ? 'આજના 10 નવા ગુજરાતી કોયડા ઉકેલો. દરેક કોયડો વધુ મુશ્કેલ બનશે.'
        : 'Solve today’s 10 riddles. Each one gets harder.';
    document.getElementById('daily-challenge-label').textContent = gujarati
        ? `દિવસ ${challengeDay} / 365`
        : `DAY ${challengeDay} OF 365`;
    document.getElementById('start-game-button').textContent = gujarati ? 'રમત શરૂ કરો' : 'START GAME';
    document.getElementById('answer-input').placeholder = gujarati
        ? 'ગુજરાતી અથવા Gujlish માં જવાબ લખો...'
        : 'Type your answer...';
    document.getElementById('check-answer-label').textContent = gujarati ? 'જવાબ તપાસો' : 'CHECK ANSWER';

    const englishButton = document.getElementById('language-en');
    const gujaratiButton = document.getElementById('language-gu');
    const selectedClasses = 'rounded-lg bg-orange-500 px-4 py-2 text-xs font-extrabold text-white';
    const idleClasses = 'rounded-lg px-4 py-2 text-xs font-extrabold text-[#2c1e11]';
    englishButton.className = gujarati ? idleClasses : selectedClasses;
    gujaratiButton.className = gujarati ? selectedClasses : idleClasses;
}

function setGameLanguage(language) {
    if (typeof gameActive !== 'undefined' && gameActive) return;
    activeLanguage = language === 'gu' ? 'gu' : 'en';
    localStorage.setItem('clue_language', activeLanguage);
    QUESTIONS.splice(0, QUESTIONS.length, ...buildDailyQuestions(activeLanguage));
    updateLanguageUI();
    if (typeof updateDailyButton === 'function') updateDailyButton();
}

updateLanguageUI();

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
