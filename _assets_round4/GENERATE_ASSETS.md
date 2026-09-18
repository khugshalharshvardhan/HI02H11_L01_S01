# Round-4 assets — the one blocked step

Everything else in this round is built and verified. These 30 voice clips and 9 pictures need a
`GEMINI_KEY`, which was not in the environment when the work was done. Nothing else is outstanding.

Run from the factory root (`D:\Dev_Kit\factories\FLN_Content_Factory`).

```powershell
$env:GEMINI_KEY = '<key>'
$env:PYTHONUTF8 = '1'
$SKILL = "$env:USERPROFILE\.claude\skills\swiftpal-game-revise\scripts\build"
$BUNDLE = "KG\HI02H11_L01_S01"
```

## 1 · Pick the voice first (once)

The lesson is currently voiced by **Kore**. Keep it unless you are re-cutting the whole card —
mixing takes across a lesson is audible.

```powershell
python $SKILL\audition_voices.py $BUNDLE\card.json    # only if you want to change voice
```

## 2 · Voice — REGENERATE ONLY THESE 30 IDS

Generated audio is non-deterministic: re-running an unchanged clip yields a *different take*, which
is itself a change nobody asked for. Naming the ids is what keeps this run honest.

> ### ⚠ Corrected 2026-09-17 — the command below was wrong twice, and it shipped stale voice-over
>
> The earlier version of this step read:
>
> ```powershell
> $ids = (Get-Content $BUNDLE\_assets_round4\regen_ids.txt -Raw).Trim()
> python $SKILL\gen_tts.py $BUNDLE\card.json --voice Kore --ext ogg --only $ids
> ```
>
> **`--only` takes ONE id, not a list.** `gen_tts.py` does `ids = [a.only]`, so a comma string is
> looked up as a single audio_id and the run dies with *"audio_id(s) not in card audio_text"*.
> Loop instead.
>
> **It is missing `--force`, and the 20 re-records are exactly the ids that need it.** `gen_tts`
> skips any id whose file already exists — that is the right default for resuming a rate-limited
> run, but a *re-record* already has a file: the OLD line. Without `--force` all 20 were skipped
> and the lesson kept playing its round-3 voice-over while every check reported green, because the
> receipt counts files rather than listening to them. A reviewer caught it by ear on 2026-09-17.

```powershell
# the 20 RE-RECORDS - the file on disk is the old line, so --force is REQUIRED
$ids = (Select-String -Path $BUNDLE\_assets_round4\regen_ids.txt -Pattern '^# IDS:' -Context 0,1).Context.PostContext[0].Split(',')
foreach ($i in $ids) {
  python $SKILL\gen_tts.py $BUNDLE\card.json --voice Kore --ext ogg --only $i.Trim() --force
}
```

```bash
# git-bash equivalent
for i in $(grep -A1 '^# IDS:' _assets_round4/regen_ids.txt | tail -1 | tr ',' ' '); do
  python "$SKILL/gen_tts.py" "$BUNDLE/card.json" --voice Kore --ext ogg --only "$i" --force
done
```

Drop `--force` **only** when you are filling genuine gaps (ids with no file at all) and must not
disturb takes already approved.

20 of the 30 are **re-records** — the file on disk is the *old* line and will be overwritten.
10 are new. The full old→new text for every one is in `regen_ids.txt`.

`gen_tts.py` is collect-and-continue: one refused clip never kills the batch, and refusals are
auto-recovered on a fallback voice. **Copy its EAR-CHECK list into the scorecard** — those clips
came back on a different voice and a human has to hear them. If anything is UNRECOVERED it exits 1;
report those ids rather than shipping a silent gap.

**Then rebuild.** `check_clip_lengths()` in the build script now measures every clip against the
line the card says it speaks, so a skipped re-record or a partial take fails the build instead of
reaching a child. It would have caught this one.

## 3 · Art — 6 new + 3 replacements

```powershell
python $SKILL\gen_objects.py $BUNDLE\assets\Images --manifest $BUNDLE\_assets_round4\objs.json --force
python $SKILL\keep_largest.py $BUNDLE\assets\Images
```

`--force` is required: `obj_papita`, `obj_mala` and `obj_muli` already exist and the SME asked for
all three to be **replaced** ("replace the current papaya with a clear, full, child-friendly image",
"replace the current माला image if it is visually unclear", "add a clear, full image of मूली").

Then **look at each of the 9 PNGs**. A raspberry halo survives keying often enough that the second
`keep_largest` pass is belt-and-braces, not paranoia. Nothing here should read as pink.

## 4 · The crow call — NOT generatable

`sfx_kanv` (a काँव-काँव crow call) is the one asset on this list that must be a **real recording or a
licensed effect**. Do not synthesize it: a fake bird at the lesson's opening beat is worse than the
silence it replaces, and the engine already handles the silence correctly (`playSfx` no-ops on a
missing file, so the landing simply plays without it today).

## 5 · Rebuild, then re-run the gates

```powershell
python $BUNDLE\rebuild_isolated.py
python $SKILL\..\gates\verify_bundle.py $BUNDLE
```

The two asset FAILs currently on the receipt — "all 74 lines have real audio" and "all 20 images
generated" — should both flip to PASS. The third FAIL (`start_mascot.png` / `start_btn.png` missing
from `assets/UI`) **pre-dates this round**: it is identical on the delivered build and is not fixed
here. See the scorecard's Observations.
