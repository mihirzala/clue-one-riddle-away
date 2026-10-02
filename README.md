# Clue: One Riddle Away

A single-player daily riddle game. English-only for now. Each player gets a
personalized set of 10 riddles per local calendar day, increasing in
difficulty from a confident warm-up to a genuine finale.

## Live game

[Play Clue: One Riddle Away](https://clue-riddle.vercel.app/)

## Run locally

Serve this directory with any static web server, then open the local URL in a browser. For example:

```sh
python3 -m http.server 8000
```

## Project structure

- `index.html` — page structure and game screens
- `css/styles.css` — visual design and animations
- `js/questions.js` — the English riddle pool, organized by difficulty tier (1-10)
- `js/riddle-selector.js` — deterministic, per-player daily riddle selection and recent-riddle avoidance
- `js/storage.js` — daily-challenge state persistence (so a refresh or restart never rerolls today's riddles)
- `js/hints.js` — the progressive hint/reveal engine
- `js/daily.js` — local-date tracking and midnight renewal
- `js/adaptive.js` — performance and integrity tracking (no longer unlocks extra riddles)
- `js/player.js` — first-visit name collection and backend registration
- `js/game.js` — gameplay, scoring, hints, lives, audio, and screen flow
- `api/players.js` — validated server-side player registration
- `js/archive/gujarati-riddles.js` — the original Gujarati riddle set, preserved but not loaded by the app (see below)

## Daily challenge rules

- Exactly 10 riddles per player per local calendar day — never 9, never 11, no bonus riddle
- Riddles are assigned deterministically from `(player ID, local date, difficulty tier)`: the same player always gets the same 10 riddles on the same day, but different players generally get different riddles
- **One attempt per player per local calendar day.** A refresh or a closed-and-reopened tab resumes an in-progress attempt exactly where it left off, but running out of lives or banking points ends that attempt for good — it does not grant a new one. Only finishing or starting a new local day unlocks a fresh attempt
- Once an attempt ends (by busting, banking, or solving all 10), that day's challenge is locked until the next local day
- Riddles avoid repeating ones the same player saw in roughly the last 3 weeks, when the pool allows it
- Four lives per attempt; each riddle offers up to 2 written hints (costing round points) and a length-aware reveal (costing a life) — see "Hints and reveals" below
- A new challenge becomes available at 12:00 AM in the player's local timezone

Progress and high scores are stored locally in the browser.

See [`agent.md`](agent.md) for the adaptive agent's complete tracking lifecycle and integrity limitations.

## Hints and reveals

Each riddle has two independent forms of help:

- **Hint** (points): stage 1 is a subtle nudge, stage 2 narrows things down further. Costs round points and can be used up to twice per riddle.
- **Reveal** (a life): how much it can reveal depends on the answer's length, so a short answer is never trivialized —
  - 1-3 characters: never reveals a letter; gives one extra semantic hint instead, at no cost
  - 4-6 characters: reveals exactly one strategically chosen character (not necessarily the first)
  - 7-9 characters: up to two characters
  - 10+ characters: up to three characters

## Clue chain

The ten riddles aren't purely independent: solving one adds its theme (e.g. "time," "wordplay," "ciphers") to that day's **Clue Trail**, shown as the game progresses. The tenth and final riddle explicitly calls back to the trail collected that day before posing the hardest, most conclusive puzzle. Because different players get different riddles, the trail is composed dynamically rather than following one hard-coded global storyline.

## Adaptive tracking and integrity

The adaptive agent measures first-try accuracy, mistakes, hint use, reveal use, answer time, and remaining lives during a run. It no longer unlocks any extra riddle — the daily challenge is always exactly 10 — but the signals remain useful as an anti-cheat and analytics baseline.

Answers are stored as SHA-256 fingerprints rather than readable text, and answer pasting is blocked. Combined with per-player deterministic daily sets (no simple reroll-for-an-easier-set) and recent-riddle avoidance, this discourages casual cheating, but a browser-only game cannot guarantee tamper-proof competitive results. Server-side answer validation and trusted sessions would be needed for tournament-grade enforcement — see "Remaining limitations" below.

## Remaining limitations (client-side only, for now)

- Daily-challenge state (riddle assignment, progress, completion) lives in `localStorage`, keyed to the player ID. It is not currently verified server-side, so a sufficiently motivated player could inspect or reset it locally.
- The one-attempt-per-day rule is enforced client-side (via `localStorage`'s daily-state `status` field), so it isn't tamper-proof against a sufficiently motivated player.
- Recent-riddle avoidance and per-player selection make answer-sharing harder, not impossible.
- Some browsers (notably iOS Safari's Intelligent Tracking Prevention, and standalone "Add to Home Screen" web apps under memory pressure) can evict a site's `localStorage` even outside private browsing. Player identity (name + ID) survives this: `api/players.js` also sets it as a cookie via the server's HTTP response, which isn't subject to that eviction, and `js/player.js` restores `localStorage` from it automatically if needed — so a returning player isn't asked for their name again. In-progress run state (current riddle, score, lives) does not have this same backup, so if `localStorage` is wiped mid-run, that specific run resets to riddle 1 — but with the same day's riddle set, since selection is deterministic per player and date, not a new/different set.

## Language

Clue is English-only for this release. Gujarati support was removed from the active game — the original Gujarati riddles are preserved in `js/archive/gujarati-riddles.js` but are not loaded or reachable from the UI. Gujarati (or another language) could be reintroduced later without needing to redesign the riddle-selection or hint systems.

## Player names and privacy

First-time players are asked for a name and shown a storage notice before continuing. The backend validates the name, stores it with a random player ID and signup timestamp in a private Vercel Blob store, and returns the ID to the browser. Player records are not publicly readable.

The player ID and name are kept in `localStorage` for normal use, and also set as a same-site cookie by the server's response (1-year expiry) so identity survives browser-level storage eviction — see "Remaining limitations" above.
