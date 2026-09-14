# How to rebuild this game

This folder is a **delivery**, not a build tree. The files below are copies; they only run from
inside the factory, at the paths named here.

## Where the source of truth lives

```
D:\Dev_Kit\factories\FLN_Content_Factory\
  scripts\build_skill_HI02H11_L01_S01.py      <- the recipe (content + VO script)
  KG\HI02H11_L01_S01\
    engine_local\                             <- THIS GAME'S OWN ENGINE (isolated)
    rebuild_isolated.py                       <- the build entry point
    card.json, HI02H11_L01_S01.html, assets\
  dist\HI02H11_L01_S01\                       <- the 8.5 MB shippable copy
```

## Rebuild

```powershell
cd D:\Dev_Kit\factories\FLN_Content_Factory
$env:PYTHONUTF8 = '1'
python KG\HI02H11_L01_S01\rebuild_isolated.py
```

`rebuild_isolated.py` folds `engine_local/app.js` + `style.css` back into this game's own monolith,
points the engine guard at that copy, and then runs the recipe. It never reads or writes the shared
engine.

**Do not run `build_skill_HI02H11_L01_S01.py` directly** — it would be measured against the shared
engine instead of this game's, and the guard would either refuse or (worse) build the new card onto
an engine that has none of round 4's mechanics.

## Why this game is isolated

Round 4 needed five engine changes that no other lesson has asked for — a word-by-word karaoke
highlight, akshara-level letter marking, a VO-cue-driven MEET_LETTER reveal, a data-driven landing
hero, and a whole new balloon mechanic. Rather than push those into the engine every other lesson
shares, the game carries a private copy. `ENGINE_DIFF.patch` in this folder is the complete change
(+434 / −2 lines in `app.js`, +142 in `style.css`, almost entirely additive).

**The trade:** a fix made to the shared engine will not reach this game, and these five features do
not reach anything else. If the fleet should inherit any of them, forward-port from
`ENGINE_DIFF.patch` — it is written to be readable as a review, not just applied.

> This checkout has **no `Maths HTML Factory`**, which the FLN engine guard and
> `engine_isolate.py` both expect to exist. That is why isolation was performed with the tool's own
> `_mono_extract` rather than its CLI, and why `rebuild_isolated.py` exists instead of
> `engine_isolate.py build`. Both are noted in the scripts themselves.

## What is in this folder

| Path | What it is |
|---|---|
| `CHANGES.md` | **The scorecard.** All 108 deck asks, each with its status and proof. Read this first. |
| `build/` | The revised working bundle (playable, but 25 MB — not for delivery) |
| `dist/` | The optimized 8.5 MB copy. `index.html` is not created yet — see below |
| `_review_shots/` | A capture of all 16 pages, in play order |
| `_assets_round4/` | The one blocked step: the VO regeneration scope + art manifest + runbook |
| `ENGINE_DIFF.patch` | Every engine change this round, as a reviewable diff |
| `engine_local/` | Copy of the private engine (runs only from the factory path above) |
| `build_skill_HI02H11_L01_S01.py` | Copy of the recipe (ditto) |

## Before this goes to Netlify

1. Generate the outstanding assets — `_assets_round4/GENERATE_ASSETS.md`.
2. Rebuild, then re-run `verify_bundle.py`; the two asset FAILs should clear.
3. Re-run the dist step, then confirm it still renders with **no 404s**.
4. Copy `dist/HI02H11_L01_S01.html` to `dist/index.html`, drop `card.json`, zip `dist/`, and
   drag it to `app.netlify.com/drop`. `CHANGES.md` ships to the team, **not** in the child-facing zip.
