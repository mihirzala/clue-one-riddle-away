let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSynthSound(freq, type, duration, slideTo = 0, gainValue = 0.12) {
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


// Game State Core
let currentLevel = 0;
let pendingScore = 0;
let bankedScore = 0;
let lives = 4;
const maxLives = 4;
let gameActive = false;
let isSubmitting = false;
let dailyState = null;
let selectionPlayerId = null;

// --- Daily state: resume in place, never reroll today's riddles ---

function migrateStaleLocalStorage() {
    // Pre-refactor builds stored a simple flag instead of a full daily
    // state. If someone already finished today's (old-format) challenge
    // before this update shipped, honor that instead of granting a free
    // extra attempt. Any other leftover old-format keys are harmless and
    // are simply never read again.
    if (localStorage.getItem('clue_daily_completed') === dailyKey && !loadDailyState(getSelectionPlayerId(), dailyKey)) {
        const riddles = pickDailyRiddles(getSelectionPlayerId(), dailyKey);
        const migrated = createFreshDailyState(getSelectionPlayerId(), dailyKey, riddles.map((r) => r.id));
        migrated.status = 'completed';
        migrated.currentIndex = riddles.length;
        saveDailyState(migrated);
    }
}

function refreshStartButtonForTodayStatus() {
    const startButton = document.getElementById('start-game-button');
    const state = loadDailyState(getSelectionPlayerId(), dailyKey);
    if (state && state.status === 'completed') {
        startButton.textContent = "TODAY’S CHALLENGE COMPLETE";
        startButton.classList.add('opacity-60', 'cursor-not-allowed');
    } else {
        startButton.textContent = "START GAME";
        startButton.classList.remove('opacity-60', 'cursor-not-allowed');
    }
}

migrateStaleLocalStorage();
refreshStartButtonForTodayStatus();

let sessionHighScore = localStorage.getItem('clue_game_high') || 0;
document.getElementById('session-high-score').textContent = sessionHighScore + " pts";

function persistDailyState() {
    if (!dailyState) return;
    dailyState.currentIndex = currentLevel;
    dailyState.pendingScore = pendingScore;
    dailyState.bankedScore = bankedScore;
    dailyState.lives = lives;
    saveDailyState(dailyState);
}

function showScreen(screenId) {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('gameplay-screen').classList.add('hidden');
    document.getElementById('crossroads-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');

    document.getElementById(screenId).classList.remove('hidden');
}

function startGame() {
    if (renewChallengeIfDateChanged()) return;

    selectionPlayerId = getSelectionPlayerId();
    const existing = loadDailyState(selectionPlayerId, dailyKey);

    if (existing && existing.status === 'completed') {
        showMessageNotification("You finished today’s 10 riddles. Come back tomorrow!");
        return;
    }

    initAudio();

    if (existing && existing.status === 'in_progress') {
        // Resume exactly where the player left off (e.g. after a refresh).
        dailyState = existing;
        currentLevel = existing.currentIndex;
        pendingScore = existing.pendingScore;
        bankedScore = existing.bankedScore;
        lives = existing.lives;
    } else {
        // Fresh attempt. The riddle set itself is deterministic for
        // player+day, so this is the same 10 riddles even if the player
        // busted or banked earlier today and is trying again.
        const riddles = pickDailyRiddles(selectionPlayerId, dailyKey);
        recordRiddlesShown(riddles.map((r) => r.id), dailyKey);
        dailyState = createFreshDailyState(selectionPlayerId, dailyKey, riddles.map((r) => r.id));
        currentLevel = 0;
        pendingScore = 0;
        bankedScore = 0;
        lives = maxLives;
    }

    QUESTIONS.splice(0, QUESTIONS.length, ...resolveRiddlesFromIds(dailyState.riddleIds));

    gameActive = true;
    adaptiveAgent.startSession();

    document.getElementById('banked-score-display').textContent = `${bankedScore} pts`;
    document.getElementById('pending-score-display').textContent = `${pendingScore} pts`;

    persistDailyState();
    loadLevel();
    showScreen('gameplay-screen');
}

function resolveRiddlesFromIds(riddleIds) {
    const byId = new Map();
    for (const tier of RIDDLE_TIERS) {
        for (const riddle of ENGLISH_RIDDLE_POOL[tier]) {
            byId.set(riddle.id, riddle);
        }
    }
    return riddleIds.map((id) => ({ ...byId.get(id) }));
}

function fillTrailPlaceholder(clueTemplate, trail) {
    if (!clueTemplate.includes('{{TRAIL}}')) return clueTemplate;
    if (!trail || trail.length === 0) return clueTemplate.replace('{{TRAIL}}', '');
    const list = trail.length === 1
        ? trail[0]
        : `${trail.slice(0, -1).join(', ')} and ${trail[trail.length - 1]}`;
    return clueTemplate.replace('{{TRAIL}}', `Today's clues touched on ${list}. `);
}

function renderClueTrail() {
    const container = document.getElementById('clue-trail');
    if (!container) return;
    const trail = dailyState ? dailyState.trail : [];
    if (!trail || trail.length === 0) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }
    container.classList.remove('hidden');
    container.innerHTML = trail
        .map((theme) => `<span class="px-2 py-0.5 bg-white border border-orange-300 text-orange-700 text-[9px] font-bold rounded-full capitalize">${theme}</span>`)
        .join('');
}

function loadLevel() {
    const data = QUESTIONS[currentLevel];

    document.getElementById('level-tag').textContent = `RIDDLE ${currentLevel + 1}/${QUESTIONS.length}`;
    document.getElementById('difficulty-tag').textContent = data.difficulty;
    const clueWithTrail = fillTrailPlaceholder(data.clue, dailyState ? dailyState.trail : []);
    document.getElementById('clue-text').innerHTML = clueWithTrail.replace(/\n/g, "<br>");
    document.getElementById('answer-input').value = "";
    document.getElementById('answer-input').focus();

    renderClueTrail();

    const hintStage = (dailyState && dailyState.hintStageByRiddle[data.id]) || 0;
    const revealCount = (dailyState && dailyState.revealCountByRiddle[data.id]) || 0;
    const maxReveals = getMaxReveals(data.answer.length);

    document.getElementById('active-hint-box').classList.add('hidden');
    document.getElementById('active-hint-row').classList.add('hidden');
    document.getElementById('active-letter-row').classList.add('hidden');

    const hintBtn = document.getElementById('hint-btn');
    hintBtn.disabled = false;
    hintBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    const hintCostLabel = document.getElementById('hint-cost-label');
    if (hintStage >= HINT_STAGE_COSTS.length) {
        hintBtn.disabled = true;
        hintBtn.classList.add('opacity-50', 'cursor-not-allowed');
        hintCostLabel.textContent = 'USED';
        document.getElementById('active-hint-text').textContent = getHintText(data, hintStage) || getHintText(data, HINT_STAGE_COSTS.length);
        document.getElementById('active-hint-box').classList.remove('hidden');
        document.getElementById('active-hint-row').classList.remove('hidden');
    } else {
        hintCostLabel.textContent = `${HINT_STAGE_COSTS[hintStage]} pts`;
        if (hintStage > 0) {
            document.getElementById('active-hint-text').textContent = getHintText(data, hintStage);
            document.getElementById('active-hint-box').classList.remove('hidden');
            document.getElementById('active-hint-row').classList.remove('hidden');
        }
    }

    const firstLetterBtn = document.getElementById('first-letter-btn');
    const firstLetterLabel = document.getElementById('first-letter-label');
    const firstLetterCostLabel = document.getElementById('first-letter-cost-label');
    firstLetterBtn.disabled = false;
    firstLetterBtn.classList.remove('opacity-50', 'cursor-not-allowed');

    if (maxReveals === 0) {
        firstLetterLabel.textContent = 'Extra Hint';
        firstLetterCostLabel.innerHTML = 'Free, <strong class="text-orange-700">once</strong>';
        if (revealCount >= 1) {
            firstLetterBtn.disabled = true;
            firstLetterBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    } else {
        firstLetterLabel.textContent = 'Reveal Letter';
        firstLetterCostLabel.innerHTML = 'Costs <strong class="text-blue-700">1 life</strong>';
        if (revealCount > 0) {
            const positions = getRevealOrder(data.answer.length).slice(0, revealCount);
            document.getElementById('active-letter-text').textContent = buildMaskedAnswer(data.answer, positions);
            document.getElementById('active-hint-box').classList.remove('hidden');
            document.getElementById('active-letter-row').classList.remove('hidden');
        }
        if (revealCount >= maxReveals) {
            firstLetterBtn.disabled = true;
            firstLetterBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
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

function normalizeAnswer(raw) {
    let value = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    value = value.replace(/[.,!?;:]+$/, '');
    value = value.replace(/^\$/, '');
    value = value.replace(/%$/, '');
    return value;
}

async function submitAnswer() {
    if (!gameActive || isSubmitting) return;

    const inputEl = document.getElementById('answer-input');
    const rawValue = inputEl.value;
    const cleanedInput = normalizeAnswer(rawValue);

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

function handleCorrectAnswer() {
    playSound('correct');

    const activeLevelData = QUESTIONS[currentLevel];
    const currentPayout = activeLevelData.points;
    pendingScore += currentPayout;

    if (dailyState && activeLevelData.theme && !dailyState.trail.includes(activeLevelData.theme)) {
        dailyState.trail.push(activeLevelData.theme);
    }
    persistDailyState();

    document.getElementById('layer-payout-text').textContent = `+${currentPayout} pts`;
    document.getElementById('crossroads-pending-text').textContent = `${pendingScore} pts`;

    const nextLevelBtnText = document.getElementById('next-level-btn-text');
    if (currentLevel < QUESTIONS.length - 1) {
        nextLevelBtnText.textContent = `Try Riddle ${currentLevel + 2}`;
    } else {
        nextLevelBtnText.textContent = "Finish the Game";
    }

    showScreen('crossroads-screen');
}

function handleIncorrectAnswer() {
    playSound('wrong');
    shakeConsole();
    spillRedInk();

    lives--;
    renderLives();
    persistDailyState();

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
    const question = QUESTIONS[currentLevel];
    const stage = (dailyState && dailyState.hintStageByRiddle[question.id]) || 0;
    if (stage >= HINT_STAGE_COSTS.length) return;

    const cost = HINT_STAGE_COSTS[stage];
    if (pendingScore < cost) {
        showMessageNotification(`Needs ${cost} pts`);
        playSound('wrong');
        return;
    }

    pendingScore -= cost;
    const newStage = stage + 1;
    if (dailyState) dailyState.hintStageByRiddle[question.id] = newStage;
    adaptiveAgent.recordHint();
    playSound('buy');

    document.getElementById('active-hint-text').textContent = getHintText(question, newStage);
    document.getElementById('active-hint-box').classList.remove('hidden');
    document.getElementById('active-hint-row').classList.remove('hidden');

    const hintBtn = document.getElementById('hint-btn');
    const hintCostLabel = document.getElementById('hint-cost-label');
    if (newStage >= HINT_STAGE_COSTS.length) {
        hintBtn.disabled = true;
        hintBtn.classList.add('opacity-50', 'cursor-not-allowed');
        hintCostLabel.textContent = 'USED';
    } else {
        hintCostLabel.textContent = `${HINT_STAGE_COSTS[newStage]} pts`;
    }

    document.getElementById('pending-score-display').textContent = `${pendingScore} pts`;
    persistDailyState();
}

function buyFirstLetter() {
    if (lives <= 0) return;
    const question = QUESTIONS[currentLevel];
    const answer = question.answer;
    const maxReveals = getMaxReveals(answer.length);
    const usedReveals = (dailyState && dailyState.revealCountByRiddle[question.id]) || 0;

    if (maxReveals === 0) {
        if (usedReveals >= 1) return;
        if (dailyState) dailyState.revealCountByRiddle[question.id] = 1;
        playSound('buy');
        document.getElementById('active-hint-text').textContent = question.hint2 || question.hint1;
        document.getElementById('active-hint-box').classList.remove('hidden');
        document.getElementById('active-hint-row').classList.remove('hidden');
        const firstLetterBtn = document.getElementById('first-letter-btn');
        firstLetterBtn.disabled = true;
        firstLetterBtn.classList.add('opacity-50', 'cursor-not-allowed');
        showMessageNotification("This answer is too short to reveal a letter — here's another nudge instead.");
        persistDailyState();
        return;
    }

    if (usedReveals >= maxReveals) return;

    if (lives === 2) {
        const proceed = confirm("This will leave you with only 1 life. Reveal another letter anyway?");
        if (!proceed) return;
    }

    lives--;
    const newCount = usedReveals + 1;
    if (dailyState) dailyState.revealCountByRiddle[question.id] = newCount;
    adaptiveAgent.recordLetterReveal();
    playSound('buy');
    renderLives();

    const positions = getRevealOrder(answer.length).slice(0, newCount);
    const masked = buildMaskedAnswer(answer, positions);

    document.getElementById('active-letter-text').textContent = masked;
    document.getElementById('active-hint-box').classList.remove('hidden');
    document.getElementById('active-letter-row').classList.remove('hidden');

    if (newCount >= maxReveals) {
        const firstLetterBtn = document.getElementById('first-letter-btn');
        firstLetterBtn.disabled = true;
        firstLetterBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    persistDailyState();

    if (lives <= 0) {
        triggerBust("You are out of lives.");
    } else {
        showMessageNotification(`Revealed: '${masked}' — 1 life used.`);
    }
}

function bankAndLeave() {
    bankedScore += pendingScore;
    pendingScore = 0;
    if (dailyState) dailyState.status = 'ended';
    persistDailyState();

    playSound('escape');
    handleRunSuccess();
}

function riskAndContinue() {
    if (currentLevel < QUESTIONS.length - 1) {
        currentLevel++;
        playSound('level-win');
        showScreen('gameplay-screen');
        loadLevel();
        persistDailyState();

        document.getElementById('pending-score-display').textContent = `${pendingScore} pts`;
        document.getElementById('banked-score-display').textContent = `${bankedScore} pts`;
    } else {
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
    if (dailyState) dailyState.status = 'ended';
    persistDailyState();

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
    document.getElementById('metric-solved').textContent = `${currentLevel} / ${QUESTIONS.length} Solved`;
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
    document.getElementById('metric-solved').textContent = `${currentLevel + 1} / ${QUESTIONS.length} Solved`;
    document.getElementById('metric-secured').textContent = `${bankedScore} pts`;
    document.getElementById('metric-title').textContent = getRankTitle(bankedScore, currentLevel + 1);

    showScreen('game-over-screen');
}

function handleCompleteMastery() {
    gameActive = false;
    adaptiveAgent.stopSession();
    updateHighScore(bankedScore);
    if (dailyState) {
        dailyState.status = 'completed';
        persistDailyState();
    }
    refreshStartButtonForTodayStatus();

    document.getElementById('game-over-icon').innerHTML = `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
    </svg>`;
    document.getElementById('game-over-icon').className = "inline-flex p-3 rounded-full bg-yellow-500/5 border border-yellow-800/20 text-yellow-700 mb-1 animate-bounce";
    document.getElementById('game-over-title').textContent = "10 / 10 COMPLETE";
    document.getElementById('game-over-title').className = "text-xl md:text-2xl font-bold tracking-widest font-premium-header text-[#2c1e11]";
    document.getElementById('game-over-reason').textContent = "You solved today’s challenge. Come back tomorrow for a new set.";

    document.getElementById('metric-level').textContent = "All 10 Riddles";
    document.getElementById('metric-solved').textContent = `${QUESTIONS.length} / ${QUESTIONS.length} Solved`;
    document.getElementById('metric-secured').textContent = `${bankedScore} pts`;
    document.getElementById('metric-title').textContent = "RIDDLE CHAMPIONS";

    showScreen('game-over-screen');
}

function getRankTitle(score, riddlesCleared) {
    if (riddlesCleared >= 10) return "RIDDLE MASTER";
    if (riddlesCleared >= 8) return "BRILLIANT SOLVER";
    if (riddlesCleared >= 6) return "SUPER SOLVER";
    if (riddlesCleared >= 4) return "SHARP THINKER";
    if (riddlesCleared >= 2) return "NICE WORK";
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
    refreshStartButtonForTodayStatus();
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
