# Runway Rumble

An original browser platform fighter prototype with a fashion editorial aesthetic. Four selectable concept fighters inspired by the supplied model roster; original stylized artwork, no scraped photos or claimed affiliation.

## Run

Requires Node.js 18 or newer. No package installation or credentials needed.

```sh
npm start
```

Open port 3000 in your browser. `PORT` overrides the default port.

## Play

Select a fighter and enter the arena. A/D or left/right arrows move; W or up arrow jumps (twice); J strikes; K performs a slower, stronger strike; Escape pauses. Touch buttons are available on smaller screens. Knock your CPU opponent outside the arena to take a stock. Each fighter has three stocks. At two minutes, stocks and then lower damage determine the winner. Reset Match starts again with the current selection.

## Status

Playable local single-player prototype: CPU opponent, one stage, stock and damage systems, double jump, character speed/power differences, pause and rematch. No multiplayer, licensed portraits, audio, or production character animations yet. External Google Fonts are optional; system font fallbacks work offline. Profile links identify the requested inspirations.

## Validation

`npm run check` checks the game JavaScript syntax. Run the game to validate browser rendering and controls.
