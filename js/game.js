let audioCtx = null;
let audioMuted = false;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSynthSound(freq, type, duration, slideTo = 0, gainValue = 0.12) {
    if (audioMuted) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = type; 
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (slideTo > 0) {
            osc.frequency.exponentialRampToValueAtTime(slideTo, audioCtx.currentTime + duration);
        }
        
        gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.error("Audio Engine warning", e);
    }
}

function playSound(trigger) {
    switch(trigger) {
        case 'correct':
            playSynthSound(523.25, 'sine', 0.2, 0, 0.15); 
            setTimeout(() => playSynthSound(659.25, 'sine', 0.2, 0, 0.15), 100); 
            setTimeout(() => playSynthSound(783.99, 'sine', 0.25, 0, 0.15), 200); 
            setTimeout(() => playSynthSound(1046.50, 'sine', 0.45, 0, 0.15), 300); 
            break;
        case 'wrong':
            playSynthSound(180, 'triangle', 0.2, 0, 0.25);
            setTimeout(() => playSynthSound(140, 'triangle', 0.3, 0, 0.25), 120);
            break;
        case 'level-win':
            playSynthSound(329.63, 'sine', 0.15, 0, 0.15);
            setTimeout(() => playSynthSound(440, 'sine', 0.15, 0, 0.15), 80);
            setTimeout(() => playSynthSound(554.37, 'sine', 0.15, 0, 0.15), 160);
            setTimeout(() => playSynthSound(659.25, 'sine', 0.4, 0, 0.18), 240);
            break;
        case 'game-over':
            playSynthSound(220, 'triangle', 0.8, 80, 0.35);
            break;
        case 'escape':
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    playSynthSound(900 + (i * 200), 'sine', 0.15, 0, 0.12);
                }, i * 70);
            }
            break;
        case 'buy':
            playSynthSound(600, 'triangle', 0.08, 0, 0.1);
            setTimeout(() => playSynthSound(880, 'sine', 0.12, 0, 0.08), 50);
            break;
    }
}

function toggleAudio() {
    audioMuted = !audioMuted;
    document.getElementById('audio-on-icon').classList.toggle('hidden', audioMuted);
    document.getElementById('audio-off-icon').classList.toggle('hidden', !audioMuted);
    playSound('correct');
}

// Game State Core
let currentLevel = 0; 
let pendingScore = 0;
let bankedScore = 0;
let lives = 4;
const maxLives = 4;
let activeHintUsed = false;
let revealedLetterCount = 0;
let gameActive = false;
let bonusUnlocked = false;
let isSubmitting = false;

function updateDailyButton() {
    const dailyCompleted = localStorage.getItem('clue_daily_completed') === dailyKey;
    const startButton = document.getElementById('start-game-button');
    if (dailyCompleted) {
        startButton.textContent = activeLanguage === 'gu' ? "આજનો પડકાર પૂર્ણ થયો" : "TODAY’S CHALLENGE COMPLETE";
        startButton.classList.add('opacity-60', 'cursor-not-allowed');
    }
}
updateDailyButton();

let sessionHighScore = localStorage.getItem('clue_game_high') || 0;
document.getElementById('session-high-score').textContent = sessionHighScore + " pts";

function showScreen(screenId) {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('gameplay-screen').classList.add('hidden');
    document.getElementById('crossroads-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');

    document.getElementById(screenId).classList.remove('hidden');
}

async function startGame() {
    if (renewChallengeIfDateChanged()) return;
    if (localStorage.getItem('clue_daily_completed') === dailyKey) {
        showMessageNotification("You finished today’s 10 riddles. Come back tomorrow!");
        return;
    }

    const playerId = localStorage.getItem(PLAYER_ID_KEY);
    if (playerId) {
        try {
            const result = await fetch(`/api/daily-status?playerId=${encodeURIComponent(playerId)}&date=${encodeURIComponent(dailyKey)}`);
            const data = await result.json();
            if (result.ok && data.completed) {
                localStorage.setItem('clue_daily_completed', dailyKey);
                updateDailyButton();
                showMessageNotification("You finished today’s 10 riddles. Come back tomorrow!");
                return;
            }
        } catch {
            // Server check unavailable — fall back to the local flag already checked above.
        }
    }

    initAudio();
    currentLevel = 0;
    pendingScore = 0;
    bankedScore = 0;
    lives = maxLives;
    gameActive = true;
    bonusUnlocked = false;
    adaptiveAgent.startSession();
    
    document.getElementById('banked-score-display').textContent = "0 pts";
    document.getElementById('pending-score-display').textContent = "0 pts";

    loadLevel();
    showScreen('gameplay-screen');
}

function loadLevel() {
    const data = QUESTIONS[currentLevel];
    
    const gujarati = activeLanguage === 'gu';
    document.getElementById('level-tag').textContent = data.bonus
        ? (gujarati ? 'નિષ્ણાત બોનસ' : 'EXPERT BONUS')
        : (gujarati ? `કોયડો ${data.level}/10` : `RIDDLE ${data.level}/10`);
    const difficultyNames = {
        SIMPLE: 'EASY', MODERATE: 'MEDIUM', LOGICAL: 'MEDIUM', CLASSICAL: 'MEDIUM',
        HISTORIC: 'TRICKY', DIFFICULT: 'HARD', ADVANCED: 'HARD', EXPERT: 'EXPERT'
    };
    const gujaratiDifficultyNames = {
        SIMPLE: 'સરળ', MODERATE: 'મધ્યમ', LOGICAL: 'મધ્યમ', CLASSICAL: 'મધ્યમ',
        HISTORIC: 'અઘરું', DIFFICULT: 'મુશ્કેલ', CRYPTIC: 'મુશ્કેલ', SCHOLARLY: 'ઘણું મુશ્કેલ',
        COMPLEX: 'ઘણું મુશ્કેલ', LEGENDARY: 'અતિ મુશ્કેલ', EXPERT: 'નિષ્ણાત'
    };
    document.getElementById('difficulty-tag').textContent = gujarati
        ? (gujaratiDifficultyNames[data.difficulty] || data.difficulty)
        : (difficultyNames[data.difficulty] || data.difficulty);
    document.getElementById('clue-text').innerHTML = data.clue.replace(/\n/g, "<br>");
    document.getElementById('answer-input').value = "";
    document.getElementById('answer-input').focus();

    activeHintUsed = false;
    revealedLetterCount = 0;
    document.getElementById('active-hint-box').classList.add('hidden');
    document.getElementById('active-hint-row').classList.add('hidden');
    document.getElementById('active-letter-row').classList.add('hidden');

    const hintBtn = document.getElementById('hint-btn');
    hintBtn.disabled = false;
    hintBtn.classList.remove('opacity-50', 'cursor-not-allowed');

    if (currentLevel === 9 && !data.bonus) {
        activeHintUsed = true;
        document.getElementById('active-hint-text').textContent = data.hint;
        document.getElementById('active-hint-box').classList.remove('hidden');
        document.getElementById('active-hint-row').classList.remove('hidden');
        hintBtn.disabled = true;
        hintBtn.classList.add('opacity-50', 'cursor-not-allowed');
        showMessageNotification(gujarati
            ? 'અંતિમ કોયડાની મફત clue મળી!'
            : 'Your free clue for the final riddle is ready!');
    }

    renderLives();
    adaptiveAgent.beginQuestion();
}

function renderLives() {
    const container = document.getElementById('lives-display');
    container.innerHTML = "";
    for (let i = 0; i < maxLives; i++) {
        const node = document.createElement('span');
        if (i < lives) {
            node.innerHTML = `<svg class="w-6 h-6 drop-shadow-[0_2px_3px_rgba(234,88,12,0.35)] transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8.5" fill="#f97316" stroke="#c2410c" stroke-width="1.5" />
            </svg>`;
        } else {
            node.innerHTML = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8.5" fill="#ffedd5" stroke="#fdba74" stroke-width="1.5" />
            </svg>`;
        }
        container.appendChild(node);
    }
}

async function hashAnswer(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function submitAnswer() {
    if (!gameActive || isSubmitting) return;

    const inputEl = document.getElementById('answer-input');
    const rawValue = inputEl.value;
    const cleanedInput = rawValue.trim().toLowerCase().replace(/\s+/g, ' ');

    if (cleanedInput === "") {
        shakeConsole();
        return;
    }

    isSubmitting = true;
    const activeLevelData = QUESTIONS[currentLevel];
    const submittedHash = await hashAnswer(cleanedInput);
    const isCorrect = activeLevelData.answerHashes.includes(submittedHash);
    if (Date.now() - adaptiveAgent.questionStartedAt < 800 && cleanedInput.length > 1) {
        adaptiveAgent.flagIntegrityIssue();
    }
    adaptiveAgent.recordAnswer(isCorrect);
    isSubmitting = false;

    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}

const FAST_ANSWER_THRESHOLD_MS = 20000;

function maybeEscalateNextLevelDifficulty() {
    if (activeLanguage !== 'en') return false;
    const nextIndex = currentLevel + 1;
    if (nextIndex >= QUESTIONS.length || !HARD_CHAIN_EN[nextIndex]) return false;

    const answeredFast = (Date.now() - adaptiveAgent.questionStartedAt) <= FAST_ANSWER_THRESHOLD_MS;
    const answeredCleanly = adaptiveAgent.attemptsOnQuestion === 1 && !activeHintUsed && revealedLetterCount === 0;

    if (answeredFast && answeredCleanly) {
        QUESTIONS[nextIndex] = { ...HARD_CHAIN_EN[nextIndex] };
        return true;
    }
    return false;
}

function handleCorrectAnswer() {
    playSound('correct');

    const activeLevelData = QUESTIONS[currentLevel];
    const currentPayout = activeLevelData.points;
    pendingScore += currentPayout;

    document.getElementById('layer-payout-text').textContent = `+${currentPayout} pts`;
    document.getElementById('crossroads-pending-text').textContent = `${pendingScore} pts`;

    const escalated = maybeEscalateNextLevelDifficulty();

    const nextLevelBtnText = document.getElementById('next-level-btn-text');
    if (currentLevel < QUESTIONS.length - 1) {
        nextLevelBtnText.textContent = `Try Riddle ${currentLevel + 2}`;
    } else {
        nextLevelBtnText.textContent = "Finish the Game";
    }

    if (escalated) {
        showMessageNotification("Fast, clean answer! Next riddle just got harder.");
    }

    showScreen('crossroads-screen');
}

function handleIncorrectAnswer() {
    playSound('wrong');
    shakeConsole();
    spillRedInk();
    
    lives--;
    renderLives(); 

    if (lives <= 0) {
        triggerBust("You are out of lives.");
    } else {
        const inputEl = document.getElementById('answer-input');
        inputEl.classList.add('border-red-800', 'bg-red-50');
        setTimeout(() => {
            inputEl.classList.remove('border-red-800', 'bg-red-50');
        }, 800);
        showMessageNotification(`Wrong answer — ${lives} ${lives === 1 ? 'life' : 'lives'} left.`);
    }
}

function shakeConsole() {
    const container = document.getElementById('terminal-container');
    container.classList.add('shake', 'border-red-800');
    setTimeout(() => {
        container.classList.remove('shake', 'border-red-800');
    }, 400);
}

function spillRedInk() {
    const body = document.getElementById('body-wrapper');
    body.classList.add('ink-stain');
    setTimeout(() => {
        body.classList.remove('ink-stain');
    }, 500);
}

function buyHint() {
    if (activeHintUsed) return;
    const cost = 50;

    if (pendingScore < cost) {
        showMessageNotification("Needs 50 pts");
        playSound('wrong');
        return;
    }

    pendingScore -= cost;
    activeHintUsed = true;
    adaptiveAgent.recordHint();
    playSound('buy');

    const levelData = QUESTIONS[currentLevel];
    document.getElementById('active-hint-text').textContent = levelData.hint;
    document.getElementById('active-hint-box').classList.remove('hidden');
    document.getElementById('active-hint-row').classList.remove('hidden');

    const hintBtn = document.getElementById('hint-btn');
    hintBtn.disabled = true;
    hintBtn.classList.add('opacity-50', 'cursor-not-allowed');

    document.getElementById('pending-score-display').textContent = `${pendingScore} pts`;
}

function buyFirstLetter() {
    if (lives <= 0) return;

    const answer = QUESTIONS[currentLevel].answer;
    if (revealedLetterCount >= answer.length) {
        showMessageNotification("Whole answer already revealed!");
        playSound('wrong');
        return;
    }

    if (lives === 2) {
        const proceed = confirm("This will leave you with only 1 life. Reveal another letter anyway?");
        if (!proceed) return;
    }

    lives--;
    revealedLetterCount++;
    adaptiveAgent.recordLetterReveal();
    playSound('buy');
    renderLives();

    const revealedText = answer.slice(0, revealedLetterCount);

    document.getElementById('active-letter-text').textContent = revealedText;
    document.getElementById('active-hint-box').classList.remove('hidden');
    document.getElementById('active-letter-row').classList.remove('hidden');

    if (lives <= 0) {
        triggerBust("You are out of lives.");
    } else {
        showMessageNotification(`Revealed: '${revealedText}' — 1 life used.`);
    }
}

function bankAndLeave() {
    bankedScore += pendingScore;
    pendingScore = 0;

    playSound('escape');
    handleRunSuccess();
}

function riskAndContinue() {
    if (currentLevel < QUESTIONS.length - 1) {
        currentLevel++;
        playSound('level-win');
        showScreen('gameplay-screen');
        loadLevel();
        
        document.getElementById('pending-score-display').textContent = `${pendingScore} pts`;
        document.getElementById('banked-score-display').textContent = `${bankedScore} pts`;
    } else {
        if (!bonusUnlocked && adaptiveAgent.shouldUnlockExpertChallenge(lives)) {
            bonusUnlocked = true;
            QUESTIONS.push(activeLanguage === 'gu' ? GUJARATI_TOUGHEST_QUESTION : TOUGHEST_QUESTION);
            currentLevel++;
            playSound('level-win');
            showScreen('gameplay-screen');
            loadLevel();
            showMessageNotification("Expert bonus unlocked — your toughest riddle awaits!");
            return;
        }
        bankedScore += pendingScore;
        pendingScore = 0;
        playSound('escape');
        handleCompleteMastery();
    }
}

function triggerBust(reason) {
    gameActive = false;
    adaptiveAgent.stopSession();
    playSound('game-over');

    const retainedPending = Math.floor(pendingScore * 0.25);
    const lossAmount = pendingScore - retainedPending;
    const finalScore = bankedScore + retainedPending;

    updateHighScore(finalScore);

    document.getElementById('game-over-icon').innerHTML = `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>`;
    document.getElementById('game-over-icon').className = "inline-flex p-3 rounded-full bg-red-50/5 border border-red-800/10 text-red-800 mb-1";
    document.getElementById('game-over-title').textContent = "GAME OVER";
    document.getElementById('game-over-title').className = "text-xl md:text-2xl font-bold tracking-widest font-premium-header text-[#2c1e11]";
    document.getElementById('game-over-reason').innerHTML = `${reason}<br><span class="font-bold text-red-800">You lost ${lossAmount} round points.</span>`;

    document.getElementById('metric-level').textContent = `Riddle ${currentLevel + 1}`;
    document.getElementById('metric-solved').textContent = `${currentLevel} / 10 Solved`;
    document.getElementById('metric-secured').textContent = `${finalScore} pts`;
    document.getElementById('metric-title').textContent = getRankTitle(finalScore, currentLevel);

    showScreen('game-over-screen');
}

function handleRunSuccess() {
    gameActive = false;
    adaptiveAgent.stopSession();
    updateHighScore(bankedScore);

    document.getElementById('game-over-icon').innerHTML = `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`;
    document.getElementById('game-over-icon').className = "inline-flex p-3 rounded-full bg-orange-500/5 border-2 border-orange-600/20 text-[#2c1e11] mb-1";
    document.getElementById('game-over-title').textContent = "SCORE SAVED!";
    document.getElementById('game-over-title').className = "text-lg md:text-xl font-bold tracking-widest font-premium-header text-[#2c1e11]";
    document.getElementById('game-over-reason').textContent = "Great choice—your points are safe.";

    document.getElementById('metric-level').textContent = `Riddle ${currentLevel + 1}`;
    document.getElementById('metric-solved').textContent = `${currentLevel + 1} / 10 Solved`;
    document.getElementById('metric-secured').textContent = `${bankedScore} pts`;
    document.getElementById('metric-title').textContent = getRankTitle(bankedScore, currentLevel + 1);

    showScreen('game-over-screen');
}

function handleCompleteMastery() {
    gameActive = false;
    adaptiveAgent.stopSession();
    updateHighScore(bankedScore);
    localStorage.setItem('clue_daily_completed', dailyKey);
    updateDailyButton();

    const playerId = localStorage.getItem(PLAYER_ID_KEY);
    if (playerId) {
        fetch('/api/daily-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId, date: dailyKey })
        }).catch(() => {});
    }

    document.getElementById('game-over-icon').innerHTML = `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
    </svg>`;
    document.getElementById('game-over-icon').className = "inline-flex p-3 rounded-full bg-yellow-500/5 border border-yellow-800/20 text-yellow-700 mb-1 animate-bounce";
    document.getElementById('game-over-title').textContent = "YOU DID IT!";
    document.getElementById('game-over-title').className = "text-xl md:text-2xl font-bold tracking-widest font-premium-header text-[#2c1e11]";
    document.getElementById('game-over-reason').textContent = "You completed all 10 riddles!";

    document.getElementById('metric-level').textContent = "All 10 Riddles";
    document.getElementById('metric-solved').textContent = "10 / 10 Solved";
    document.getElementById('metric-secured').textContent = `${bankedScore} pts`;
    document.getElementById('metric-title').textContent = "RIDDLE CHAMPIONS";

    showScreen('game-over-screen');
}

function getRankTitle(score, layersCleared) {
    if (layersCleared >= 10) return "RIDDLE MASTER";
    if (layersCleared >= 8) return "BRILLIANT SOLVER";
    if (layersCleared >= 6) return "SUPER SOLVER";
    if (layersCleared >= 4) return "SHARP THINKER";
    if (layersCleared >= 2) return "NICE WORK";
    return "GOOD START";
}

function updateHighScore(score) {
    if (score > sessionHighScore) {
        sessionHighScore = score;
        localStorage.setItem('clue_game_high', sessionHighScore);
        document.getElementById('session-high-score').textContent = sessionHighScore + " pts";
    }
}

function showMessageNotification(msg) {
    let existingMsg = document.getElementById('toast-msg');
    if (existingMsg) {
        existingMsg.remove();
    }

    const wrapper = document.createElement('div');
    wrapper.id = "toast-msg";
    wrapper.style.cssText = "position:fixed; bottom:64px; left:50%; transform:translateX(-50%); z-index:50; width:90%; max-width:20rem; display:flex; justify-content:center; pointer-events:none;";

    const alertDiv = document.createElement('div');
    alertDiv.className = "bg-white border-2 border-[#2c1e11] text-[#2c1e11] text-xs font-clue px-5 py-2.5 rounded-lg shadow-xl animate-bounce tracking-wide text-center font-bold";
    alertDiv.textContent = msg;

    wrapper.appendChild(alertDiv);
    document.body.appendChild(wrapper);

    setTimeout(() => {
        wrapper.remove();
    }, 3000);
}

function returnToWelcome() {
    showScreen('welcome-screen');
}

document.getElementById('answer-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        submitAnswer();
    }
});

document.getElementById('answer-input').addEventListener('paste', function(event) {
    event.preventDefault();
    adaptiveAgent.flagIntegrityIssue();
    showMessageNotification("Please type your own answer.");
});
