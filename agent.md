# Adaptive Challenge Agent

## Purpose

The in-game agent adjusts the challenge for skilled players. It observes only the current gameplay session and may unlock an expert bonus riddle after the regular ten.

## Lifecycle

1. The agent is inactive while the welcome screen is displayed.
2. Tracking starts when the player presses **Start Game**.
3. Each riddle starts a new timing window.
4. Tracking stops when the player loses, saves and finishes, or completes the challenge.
5. A new attempt starts a fresh session with cleared performance counters.

## Session signals

The agent records:

- first-attempt correct answers;
- wrong answers;
- time spent on each solved riddle;
- hints used;
- first-letter reveals;
- remaining lives; and
- integrity warnings such as attempted answer pasting or implausibly fast submissions.

The agent does not collect names, email addresses, account identifiers, location, browsing history, or answers typed on other pages.

## Expert challenge rule

The expert bonus is unlocked only when all of these conditions are true after the ten regular riddles:

- at least 8 riddles were correct on the first attempt;
- no more than 1 wrong answer was submitted;
- no more than 1 hint was used;
- no first-letter reveals were used;
- at least 3 lives remain;
- average solved-riddle time is no more than 90 seconds; and
- no integrity warnings were recorded.

## Integrity limits

Accepted answers are stored as SHA-256 fingerprints and pasted answers are blocked. These are deterrents for a browser-only game, not absolute security. Competitive or prize-based play should validate answers and session events on a trusted server.
