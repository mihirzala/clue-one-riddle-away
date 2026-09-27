// Tracks performance and integrity signals for the current run. This data
// no longer unlocks any extra riddle — the daily challenge is always
// exactly 10 riddles — but the signals remain useful for anti-cheat
// observation (see README.md) and could feed a future difficulty system.
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
}

const adaptiveAgent = new AdaptiveChallengeAgent();
