# Balloon Game — standalone

A hostable copy of just the balloon game from **HI02H11_L01_S01** ("बार-बार आने वाली ध्वनि").

## Hosting it

Upload this whole folder. `index.html` must sit next to `assets/`.

It is a plain static site — no build step, no server code. Drag the folder onto Netlify Drop, or
push it to any static host. Opening `index.html` straight off disk works too.

The root URL opens **directly into the game** — no cover, no menu.

## What the player does

1. Balloons rise from the bottom carrying pictures. **Stage 1:** tap the ones whose name starts
   with **प** (पतंग, पपीता, पत्ता, पानी). Wrong taps shake; correct ones pop.
2. Four correct pops end the stage. The sky clears and **stage 2** starts on **च** (चूहा, चाँद,
   चम्मच, चींटी).
3. Finishing both leads to the celebration screen.

Both letters are mixed in the stream throughout — telling them apart is the point of the activity.

## Keeping it in step with the real lesson

Do not hand-edit anything here. Re-run the builder from the repo root:

    PYTHONUTF8=1 python make_balloon_demo.py

It rebuilds this folder from `dist/`, so the demo always shows what the lesson actually ships.

## Notes

* 7.4 MB, against 9.6 MB for the full lesson. It carries only the assets these two slides reach.
* Five asset paths referenced by the engine are absent (`obj_crane.png`, `hint.png`,
  `hint_active.png`, `peeking_pal.gif`, `startnew_bg.webp`). They are absent from the full delivery
  too — pre-existing, not something this copy dropped. Images fall back; none are used by this game.
* The lesson's own bundle is untouched by this folder and by the builder.
