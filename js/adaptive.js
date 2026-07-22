class AdaptiveChallengeAgent {
    constructor() {
        this.reset();
    }

    reset() {
        this.active = false;
        this.startedAt = Date.now();
        this.questionStartedAt = Date.now();
        this.firstTryCorrect = 0;
        this.wrongAnswers = 0;
        this.hintsUsed = 0;
        this.lettersRevealed = 0;
        this.answerTimes = [];
        this.integrityFlags = 0;
    }

    startSession() {
        this.reset();
        this.active = true;
        this.startedAt = Date.now();
    }

    stopSession() {
        this.active = false;
    }

    beginQuestion() {
        if (!this.active) return;
        this.questionStartedAt = Date.now();
        this.attemptsOnQuestion = 0;
    }

    recordAnswer(correct) {
        if (!this.active) return;
        this.attemptsOnQuestion += 1;
        if (correct) {
            if (this.attemptsOnQuestion === 1) this.firstTryCorrect += 1;
            this.answerTimes.push((Date.now() - this.questionStartedAt) / 1000);
        } else {
            this.wrongAnswers += 1;
        }
    }

    recordHint() { if (this.active) this.hintsUsed += 1; }
    recordLetterReveal() { if (this.active) this.lettersRevealed += 1; }
    flagIntegrityIssue() { if (this.active) this.integrityFlags += 1; }

    shouldUnlockExpertChallenge(livesRemaining) {
        if (!this.active) return false;
        const averageTime = this.answerTimes.length
            ? this.answerTimes.reduce((sum, value) => sum + value, 0) / this.answerTimes.length
            : Infinity;

        return this.firstTryCorrect >= 8 &&
            this.wrongAnswers <= 1 &&
            this.hintsUsed <= 1 &&
            this.lettersRevealed === 0 &&
            livesRemaining >= 3 &&
            averageTime <= 90 &&
            this.integrityFlags === 0;
    }
}

const adaptiveAgent = new AdaptiveChallengeAgent();

const TOUGHEST_QUESTION = {
    level: 'BONUS',
    bonus: true,
    difficulty: 'EXPERT',
    clue: 'A prisoner faces two doors. One leads to freedom and one to danger. One guard always tells the truth; the other always lies. You may ask one guard one question. What should you ask to find the door to freedom? (Answer with the key phrase)',
    answerHashes: [
        '63297a8d6f9b6cef0f906eba87cb562871f46ec5e9b5daf56ec693c75e2357ba',
        '96d46597965b171b8df952cc898d0d624d80b7c6b1ca4802c6865103b9adc3c7'
    ],
    firstLetter: 'W',
    hint: 'Ask what the other guard would say, then choose the opposite door.',
    points: 7500
};
