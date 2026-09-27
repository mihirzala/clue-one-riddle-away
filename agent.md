# Adaptive Challenge Agent

## Purpose

The in-game agent observes the current gameplay session's performance and
integrity signals. As of the English-only relaunch, it **no longer unlocks
any extra riddle** — every daily challenge is exactly 10 riddles, always.
The agent exists purely for tracking and as a foundation for future
anti-cheat or difficulty work.

## Lifecycle

1. The agent is inactive while the welcome screen is displayed.
2. Tracking starts when the player presses **Start Game**.
3. Each riddle starts a new timing window.
4. Tracking stops when the player loses, saves and finishes, or completes the challenge.
5. A new attempt starts a fresh session with cleared performance counters — but reuses the same day's riddle set (see `js/riddle-selector.js`).

## Session signals

The agent records:

- first-attempt correct answers;
- wrong answers;
- time spent on each solved riddle;
- hints used (either progressive-hint stage);
- reveals used;
- remaining lives; and
- integrity warnings such as attempted answer pasting or implausibly fast submissions.

The agent does not collect names, email addresses, account identifiers, location, browsing history, or answers typed on other pages.

## No more Expert Bonus

Earlier versions of this game could unlock an "Expert Bonus" 11th riddle for
strong performance. That has been removed entirely: `riskAndContinue()` in
`js/game.js` always ends the run at exactly 10 riddles, and
`AdaptiveChallengeAgent` no longer has a `shouldUnlockExpertChallenge`-style
method. There is no code path that can add an 11th riddle.

## Integrity limits

Accepted answers are stored as SHA-256 fingerprints and pasted answers are blocked. Daily riddle assignment is deterministic per player and local date (see `js/riddle-selector.js`), so a player cannot simply refresh their way into an easier set, and recently-seen riddles are avoided where the pool allows it. These are deterrents for a browser-only game, not absolute security. Competitive or prize-based play should validate answers and session events on a trusted server.
