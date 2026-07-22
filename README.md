# Clue: One Riddle Away

A single-player daily riddle game. Each player receives a new sequence of 10 increasingly difficult riddles at local midnight.

## Run locally

Serve this directory with any static web server, then open the local URL in a browser. For example:

```sh
python3 -m http.server 8000
```

## Project structure

- `index.html` — page structure and game screens
- `css/styles.css` — visual design and animations
- `js/questions.js` — curated riddle banks
- `js/daily.js` — 365-day selection and midnight renewal
- `js/game.js` — gameplay, scoring, hints, lives, audio, and screen flow

## Daily challenge rules

- One deterministic set of 10 riddles per local calendar day
- Difficulty and points increase from riddle 1 through riddle 10
- Four lives per attempt
- Revealing the first letter costs one life
- Completing all 10 riddles marks that day's challenge complete
- A new challenge becomes available at 12:00 AM in the player's local timezone

Progress and high scores are stored locally in the browser.
