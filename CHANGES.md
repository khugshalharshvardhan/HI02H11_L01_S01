# CHANGES.md — HI02H11_L01_S01 · SME round-4 revise · 2026-09-14
### r4b-r4d — **page 1 / cover**: only क marked, VO-synced flow, SME crow art + SME crow recording
### trimmed to one call. Rows 10-14; OPEN-5 closed.
### r4e-r4g — **page 2 (T3)**: only च marked (no matra, no overhang, no fringe); फिर सुनो removed;
### ✓ badge removed; exactly two clips; the highlight no longer bounces. Rows 20, 21, 23.
### r4h — **page 2 (T3)**, by Piyush (69519fc): the च overlay is now NESTED inside .sw-text using
### the cover's own .sound-layered structure, instead of being a sibling positioned by measured
### geometry. Root cause named there: an inline span's rect is its FONT box, an absolutely-positioned
### box is blockified and sits in a LINE box, and the two differ by the half-leading — ~9 px at 48 px.
### Nested, base and overlay share one line box and one baseline, so they register by construction.
### (A parallel fix here measured both baselines instead; it is superseded and layerSoundOnChip is
### now dead code. Piyush's removes the reason the boxes disagree rather than compensating for it.)
### r4i — karaoke paces against the whole spoken line, not just the marked words (Piyush, 69519fc).
### r4j — the nested form still clipped the overlay from the text origin, but च's ink starts 2 px
### LEFT of it (negative side bearing), so the navy base showed as a nub on the headline's left end:
### 132 navy px in a 4 px band left of the orange, on चार at 8x. soundWordHTML now covers the bearing.
### Final: left band 132 → 0, inside the letter 6 px (the following ा stem, correctly navy), 0 above,
### 0 below. **page 3 (T4) + page 11 (G5)**: mouse art replaced with the SME-supplied file. Row 26.

**Deck:** `HI02H11_L01_S01_SME_Review_Final_WITH_RECOMMENDATIONS.pptx` — 31 slides, 15 pages carrying asks.
**Baseline reviewed:** `build/HI02H11_L01_S01.html`, engine `2026.08.04b-r4-unified` — **matches** the
factory engine, so the deck reviewed the build we hold. Route: REVIEW (current engine, contract-shaped).
**Result:** 20 pages → **16**. 15 slides. `phase_distribution` 6 tutorial / 4 guided / 5 practice.

**Page ↔ slide map** (20 deck pages = landing + 19 card slides; page N = slide N−1):

| Page | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Slide | landing | T1 | T2 | T3 | T4 | T5 | T6 | G1 | G2 | G3 | **G4** | G5 | P1 | P2 | **P3** | P4 | **P5** | **P6** | P7 | P8 |

Bold = deleted. Slide IDs deliberately keep their original letters so every VO id, screenshot and
tracker row still resolves; only the **sequence** changed.

**Status:** ✅ DONE · ⏳ PENDING · ⚑ FLAGGED-BACK · N/C (deck asked for no change)
**Proof keys:** `capture NN` = `_review_shots/NN_*.png` · `sweep` = 15-slide mount sweep, 0 console errors ·
`behaviour` = the click-through walk (wrong→wrong→wrong→right) · `cues` = the VO-cue timeline probe ·
`card-diff` = pre/post `card.json` diff · `geom` = measured layout rects · `overlap` = `sweep_overlap` ·
`receipt` = `verify_bundle.py`.

---

## A · Structural

| # | Change | Where | Status | Proof |
|---|---|---|---|---|
| 1 | Delete page 11 → slide **G4** | card | ✅ | card-diff: deleted `['G4','P3','P5','P6']` |
| 2 | Delete page 15 → slide **P3** | card | ✅ | ditto |
| 3 | Delete page 17 → slide **P5** | card | ✅ | ditto |
| 4 | Delete page 18 → slide **P6** | card | ✅ | ditto |
| 5 | Pages 2+3 move after page 7 — teach order **च → म → प** | card | ✅ | card-diff order = `T3,T4,T5,T6,T1,T2,G1,G2,G3,G5,P1,P2,P4,P7,P8`; captures 02–07 read चूहे → चूहा → मामा → मूली → पीतल → पपीता |
| 6 | `phase_distribution` re-sums to 15 | card | ✅ | receipt "phase_distribution == #slides — 15 vs 15"; derived in code, never typed |

## B · New page 1 (was page 1) · landing — `capture 01`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 7 | "Remove the existing heading 'बार-बार आने वाली ध्वनि' from this screen." | ✅ | capture 01 — node **removed**, not hidden; `overlap` 0 findings |
| 8 | "Remove the current 'प, च, म' highlighting animation." | ✅ | card-diff `landing_hero.cells` → `<absent>`, `kind` concept_strip → sentence_sound |
| 9 | Add "काला कौआ काँव-काँव करता।" at top-centre | ✅ | capture 01 |
| 10 | "The sentence should appear with a simple word-by-word animation." | ✅ | **r4b: each word lands when the voice reaches it** (token cue off `audio_text`), not on a timer |
| 11 | "Highlight only the repeated 'क' … Do not highlight the complete word." | ✅ | **r4d: the letter क and nothing else.** The overlay is now a copy of the LETTER, positioned at the letter's offset — not a shape cut out of the word — so no matra, headline overhang or floating mark can be caught by geometry. Verified by zone measurement (0 orange px above the headline on काला and काँव-काँव, where the ँ lives) and by a 4× crop of each word. See the correction note below |
| 12 | "Add a clear crow illustration below the sentence… do not let it cover the sentence." | ✅ | **SME-supplied art installed** as `obj_kauaa.png` (cartoon crow, beak open — it is calling, which is what the line describes). Alpha already clean, no keying needed; trimmed to its bbox and fitted to 512 px long edge to match the other object art. capture 01 shows it below the sentence, not overlapping |
| 13 | "A small 'काँव-काँव' sound effect … when the crow appears." | ✅ | **r4d: SME-supplied recording**, trimmed to ONE call. The source is 10.8 s and holds ~8 caws; the cleanest isolated one (silence either side, peak at 1.44 s) was cut at **1.34–1.90 s** → 0.57 s, 15 ms fade-in / 80 ms fade-out, normalised to −3.2 dBFS peak, mono Opus, 5 KB. Fires in the same statement that reveals the crow — traced once at 9.6 s, never again. Untrimmed source kept at `_assets_round4/CROW_SOUND_EFFECT_source.mp3` |
| 14 | Flow: sentence → words one by one → 'क' lights → crow → crow sound → VO continues | ✅ | **r4b: driven by the greeting, not by fixed delays.** Traced against a 12 s clip — काला 6.0 s · कौआ 6.5 s · काँव-काँव 7.0 s · करता। 7.5 s · every क lights 8.5 s (as the VO says «क») · crow + call 9.6 s · VO plays on |
| 15 | New `vo_landing` (deck text, verbatim) | ⏳ | text in the card + `audio_text`; **clip is the old line** until regen |

## C · New page 2 (was page 4 · T3) · SENTENCE_SOUND — च — `capture 02`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 16 | Sentence → "चूहे ने चार चने चबाए।" | ✅ | capture 02; card-diff words 4→5, चूहा→चूहे + "ने" added. Clip `vo_line_l2` re-record pending |
| 17 | "Remove 'र' and 'ल' … focus only on 'च'." | ✅ | card-diff `options[]` 3→1; capture 02 shows one card, च |
| 18 | Word-by-word highlight synced with the VO: चूहे → ने → चार → चने → चबाए | ✅ | `teach_seq` step `sentence`; karaoke driven off the clip's real duration |
| 19 | "After the sentence is completed, remove the word-level highlighting." | ✅ | `clear_words` step; capture 02 shows no word fills, only lit aksharas |
| 20 | "Highlight only the letter 'च' in चूहे, चार, चने, चबाए." | ✅ | **r4g: highlights, does not move.** Three separate causes were reported as "overlapping" and fixed in turn — (a) the overlay drew its headline across its full ADVANCE, so the bar reached over the following ा/ू → clipped to the letter's INK; (b) it was positioned from `offsetTop` *and* re-applied the glyph's centring transform, double-counting it and sitting **1.09 px low** → a navy fringe along the top; now aligned to the painted box (**0.02 px**); (c) it pulsed to `scale(1.16)` on its beat, momentarily larger than the base beneath → that scale, the chip lift and the card's green glow are all gone. Sampled 59× across the beat: width, height and position each a single constant. ा · ू · े navy; **ने** unmarked |
| 21 | "Play only the 'च' sound … show the letter 'च' clearly on screen." | ⚑ | **OVERRULED BY REVIEW (r4f) — the letter still appears on its own beat, but SILENTLY.** The page was told to play exactly two clips and no others, so the bare-च sound was dropped from it. See OPEN-10. (`vo_snd_ch` itself was trimmed to a real bare च in r4e and still serves page 10.) |
| 22 | VO 2 = "चूहे, चार, चने, चबाए—इन सब शब्दों में 'च' की आवाज़ बार-बार आई।" | ⏳ | text in card; `vo_t3_explain` re-record pending |
| 23 | "Keep a brief pause between VO 1 and VO 2." | ✅ | 900 ms authored pause plus the step gap — traced at **~1.7 s** between the sentence ending and the explanation starting |

## D · New page 3 (was page 5 · T4) · MEET_LETTER — च — `capture 03`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 24 | Remove the explanatory sentence from the screen; keep as VO only | ✅ | card-diff `prompt_hi` → `""`; capture 03 has no prompt band; `sweep` prompt=None |
| 25 | Letter 'च' stays left; highlights **in sync with "चूहा"** in the VO | ✅ | `cues` on a 6 s clip: lit @0.9 s ("सुनी"), re-lit @4.6 s (the word "चूहा") |
| 26 | "Remove the current ant image. Add a … rat/mouse image instead." | ✅ | capture 03 — mouse; card-diff `obj_chinta` → `obj_chuha`. **r4h: art swapped to the SME-supplied mouse.** Normalised first — the file carried 9,440 px of pure-red background-removal matte at alpha≤1 reaching the canvas edge, which would have inflated the fitted box and rendered the mouse ~10% small and off-centre; matte stripped and re-padded to the previous asset's ink:canvas ratio (80.5%W/92.2%H vs 80.4/92.3), so it drops in at the same size. Renders on T4 (220×220) and G5 (72×72) |
| 27 | Add the label "चूहा" below the image | ✅ | capture 03 |
| 28 | Final VO "हमने 'च' की आवाज़ सुनी… जैसे—च से चूहा।" | ⏳ | text in card; `vo_t4_prompt` re-record pending |
| 29 | Flow: 'च' → VO → highlight → image → label | ✅ | `cues`: lit 0.9 s → pic 2.6 s → label 3.6 s → akshara mark 4.6 s → आगे live |

## E · New page 4 (was page 6 · T5) · SENTENCE_SOUND — म — `capture 04`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 30 | Sentence → "मेरे मामा मीठी मलाई लाए।" | ✅ | capture 04; card-diff words 4→5 with "मेरे" added. `vo_line_l3` re-record pending |
| 31 | "Remove the current focus on 'त' and 'ल'… only 'म'." | ✅ | card-diff `options[]` 3→1 |
| 32 | Word-by-word highlight, then cleared | ✅ | `teach_seq` sentence → clear_words |
| 33 | "Highlight only 'म' in मेरे, मामा, मीठी, मलाई. **Do not highlight 'लाए'.**" | ✅ | capture 04 — मे · मा · मा · मी · म lit; **लाए is plain navy** |
| 34 | "Play only the 'म' sound … show the letter 'म'." | ✅ | `letter` step, `vo_snd_m`; capture 04 |
| 35 | "Highlight 'म' in each target word **one by one** as spoken." | ✅ | `mark` step walks the 4 listed words in step with the clip |
| 36 | VO 2 = "मेरे, मामा, मीठी, मलाई—…" | ⏳ | text in card; `vo_t5_explain` re-record pending |

## F · New page 5 (was page 7 · T6) · MEET_LETTER — म — `capture 05`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 37 | Remove the explanatory sentence; keep as VO only | ✅ | `prompt_hi` → `""`; `sweep` prompt=None |
| 38 | Final VO "हमने 'म' की आवाज़ सुनी… जैसे—म से मूली।" | ⏳ | text in card; `vo_t6_prompt` re-record pending |
| 39 | Highlight at "म", then **again** at "मूली" | ✅ | `cues`: lit @0.9 s, re-lit + label-akshara marked @4.6 s |
| 40 | "Add a clear, full image of मूली." | ⏳ | `obj_muli` queued for replacement in `objs.json` |
| 41 | Add the label "मूली" below the image | ✅ | capture 05 |
| 42 | Flow: 'म' → VO → highlight → मूली → label → 'म' in "मूली" highlighted | ✅ | `cues`; final target akshara = **मू** |

## G · New page 6 (was page 2 · T1) · SENTENCE_SOUND — प — `capture 06`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 43 | Word-by-word highlight during VO 1, then cleared | ✅ | `teach_seq` sentence → clear_words |
| 44 | "Highlight only 'प' in पीतल, पतीले, पपीता, पीला." | ✅ | capture 06 — 6 lit aksharas across those 4 words; **"के" and "में" plain** |
| 45 | "Play only the 'प' sound. Show the letter 'प' at the same time." | ✅ | `letter` step; capture 06 shows one card, प |
| 46 | VO 2 = "पीतल, पतीले, पपीता, पीला।" — **new clip** | ⏳ | `vo_t1_words` authored; generation pending |
| 47 | VO 3 = "इन सब शब्दों में 'प' की आवाज़ बार-बार आई।" | ⏳ | `vo_t1_explain` re-scripted (the old single clip split in two); regen pending |

> This page's step order differs from C/E on purpose — the deck asks for **VO 2 with प lit first, then
> the letter, then VO 3**, so the sequence is `sentence → clear → mark → letter → say`.

## H · New page 7 (was page 3 · T2) · MEET_LETTER — प — `capture 07`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 48 | Remove the explanatory sentence; keep as VO only | ✅ | `prompt_hi` → `""` |
| 49 | Replace the papaya with a clear, full, child-friendly पपीता | ⏳ | `obj_papita` queued in `objs.json`. *Note: the current art already reads clearly (capture 07) — worth an eyeball before replacing.* |
| 50 | Add the label "पपीता" below the image | ✅ | capture 07 |
| 51 | Highlight at "प", then **again** at "पपीता" | ✅ | `cues`: lit @0.9 s, re-lit @4.6 s; label marks **प + पी** |
| 52 | Final VO "हमने 'प' की आवाज़ सुनी… जैसे—प से पपीता।" | ⏳ | text in card; `vo_t2_prompt` re-record pending |

## I · New page 8 (was page 8 · G1) · **NEW BALLOON MECHANIC** — `capture 08`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 53 | Remove the हाँ/नहीं activity; replace with a balloon activity for 'प' | ✅ | card-diff `type` `TAP_VACHAN` → `TAP_BALLOON_SOUND`; new engine module |
| 54 | "Do not show any written instruction… Do not show feedback text." | ✅ | `behaviour`: prompt band, आगे and hint chip all `display:none`; capture 08 |
| 55 | VO-only instruction "'प' की आवाज़ वाले चित्र पर टैप कीजिए।" | ⏳ | `behaviour` confirms it plays on entry; `vo_g1_prompt` re-record pending |
| 56 | Balloons with one object image each, **no text inside** | ✅ | capture 08 — 8 balloons, no labels |
| 57 | Enough spacing; soft, minimal, distraction-free background | ✅ | `geom`: 4+4, 44 px gutters, field 472 px inside a 494 px host — no clipping |
| 58 | Correct पतंग/पपीता/पत्ता/पानी · incorrect आम/केला/घर/मछली | ✅ | card-diff items; 5 of the 8 pictures pending art |
| 59 | Correct: balloon bursts + sparkle | ✅ | `behaviour`: bursts counted 1,2,3,4 as tapped |
| 60 | Correct VO "शाबाश! इसमें 'प' की आवाज़ है।" | ⏳ | wired; `vo_g1_correct` re-record pending |
| 61 | **1st wrong:** gentle shake, no text, **negative sound only** | ✅ | `behaviour`: object name speaks, **no hint line**, balloon not removed, attempt counted |
| 62 | **2nd wrong:** shake + VO "ध्यान से सुनिए, इसमें 'प' की आवाज़ नहीं है।" | ✅ | `behaviour`: `vo_g1_hint` plays on attempt 2 (clip re-record pending) |
| 63 | "If the learner continues to struggle, show a subtle hand nudge" | ✅ | `behaviour`: hand appears on attempt 3, **on a still-correct balloon** |
| 64 | Tapping a balloon plays the object name | ✅ | `behaviour`: `vo_w_aam`, `vo_w_kela` recorded on wrong taps |
| 65 | Continues until all correct 'प' balloons are selected | ✅ | `behaviour`: advances only after the 4th burst |

## J · New page 9 (was page 9 · G2) · TAP_ALL — प — `capture 09`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 66 | Instruction text + VO | N/C | already present, unchanged |
| 67 | Options appear one by one after the instruction VO | N/C | `reveal_seq` already on |
| 68 | **4 options only** — correct पपीता/पतंग · incorrect केला/आम | ✅ | card-diff items 5→4; पतंग + केला art pending |
| 69 | Clear image + word label per option | N/C | existing layout |
| 70 | Correct: positive highlight, stays marked, not re-selectable | N/C | existing |
| 71 | Wrong: shake + brief red + **do not remove the option** + hint VO | ⚑ | see **OPEN-3** — kept the existing ladder, as item 5 of the same page instructs |
| 72 | Hint VO "हर शब्द को ध्यान से देखो और सुनो…" | ⏳ | text in card; `vo_g2_hint` re-record pending |
| 73 | "Keep the current hint logic… do not introduce a new hint flow." | N/C | untouched |
| 74 | Hand nudge on a remaining correct option after repeated wrongs; no auto-select | ✅ | **newly built** — this mechanic had no hand at all. `behaviour`: appears after 2 wrongs, lands on a correct card, does not select it |

## K · New page 10 (was page 10 · G3) · pick the repeated sound — च — `capture 10`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 75 | Instruction text + VO | N/C | unchanged |
| 76 | Sentence "चूहे ने चार चने चबाए।" | ✅ | card-diff words updated to match page 2 |
| 77 | Play the whole sentence; keep it visible | N/C | existing |
| 78 | 3 letters च/ल/र one at a time, each speaking, short pause, then enable | N/C | `reveal_seq` already on; card order now च, ल, र per the deck |
| 79 | Hint 1: brief red + shake + "यह 'च' की आवाज़ नहीं है।" | ⏳ | `vo_g3_try` re-scripted to the deck's exact line; regen pending |
| 80 | Hint 2: hand nudge on 'च' + "ध्यान से देखो, सही जवाब 'च' है।" | ⏳ | `vo_g3_reveal` re-scripted; the hand at `max_attempts` 2 is existing engine behaviour |
| 81 | "Do not auto-select the answer." | N/C | engine never auto-selects (terminal help only glows + points) |
| 82 | On correct: "चूहे, चार, चने, चबाए — …" explanation | ⏳ | `vo_g3_correct` re-scripted to the explanation; wired to the `correct` role |

## L · New page 11 (was page 12 · G5) · SORT — प vs च — `capture 11`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 83 | Categories → "प की आवाज़ वाला" / "च की आवाज़ वाला" | ✅ | capture 11; card-diff both bin labels |
| 84 | Options that clearly carry प or च | ✅ | पानी, पायल / चूहा, चाँदी — card-diff. *"मोती" is gone: it carried neither, so it could not belong in either basket.* |
| 85 | Instruction + VO "हर चित्र का नाम सुनो…" | ✅ | capture 11 (clip re-record pending) |
| 86 | Picking an image plays its name | N/C | existing |
| 87 | Correct drop settles; wrong drop shakes and returns | N/C | existing |
| 88 | "Keep the existing hint logic exactly as it is." | N/C | untouched |

## M · New page 12 (was page 13 · P1) · TAP_ALL — म — `capture 12`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 89 | 4 options — correct मामा/मूली · incorrect चींटी/लाल | ✅ | card-diff items 5→4, माला dropped, चींटा→चींटी |
| 90 | Keep instruction + VO | N/C | unchanged |
| 91 | Tap plays the word; correct stays selected | N/C | existing |
| 92 | Same hint logic, same shake/red, same hand behaviour | ✅ | inherits #74; `behaviour` confirms **no hand in practice** — the round-3 ruling, see OPEN-9 |
| 93 | "Replace the current 'माला' image if it is visually unclear." | ⏳ | `obj_mala` queued (still used on page 15) |

## N · New page 13 (was page 14 · P2) · SORT — position of प — `capture 13`

| # | Change | Status | Proof |
|---|---|---|---|
| 94–98 | Keep the instruction, the two bins, the 4 options, the drag behaviour and the hint logic | N/C | **card-diff reports this slide byte-identical.** Every ask on this page was "keep" |

> ⚠️ This page has **no slide in the deck** — its entries come from `01_CHANGE_LIST.md` only. All of
> them are "keep", and nothing changed. See **OPEN-2**.

## O · New page 14 (was page 16 · P4) · pick the repeated sound — न — `capture 14`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 99 | New sentence "नानी नई नाव लाई।", target sound **न** | ✅ | capture 14; card-diff `target_sound` प→न, `whole_audio` l4→l6 |
| 100 | Keep the instruction + VO | N/C | unchanged |
| 101 | Keep the sentence visible; **no word-by-word highlighting** | ✅ | no `teach_seq` on this slide — `sweep` shows 0 lit aksharas |
| 102 | 3 letters म/ल/न one at a time, each speaking; correct = **न** | ✅ | capture 14; `vo_snd_n` authored (new clip, regen pending) |
| 103 | "Keep the existing hint logic exactly the same." | ✅ | ladder untouched; `vo_p4_reveal` / `vo_p4_correct` re-pointed प→न because they NAME the answer |

## P · New page 15 (was page 19 · P7) · TAP_ALL — च — `capture 15`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 104 | 4 options — correct चाँद/चींटी · incorrect माला/लाल | ✅ | card-diff items 5→4; चंदा→चाँद, अचार→चींटी |
| 105 | Keep the instruction + VO | N/C | unchanged |
| 106 | Tap plays the word; correct stays selected | N/C | existing |
| 107 | "Keep the existing hint logic exactly the same." | N/C | untouched |

## Q · New page 16 (was page 20 · P8) · CELEBRATION — `capture 16`

| # | Change | Status | Proof |
|---|---|---|---|
| 108 | _No change requested._ | N/C | card-diff reports this slide **byte-identical** |

---

## Receipt — quoted verbatim

```
 15 pass · 4 FAIL · 5 warn
```
…before the silent-prompt fix; after it, and as delivered:
```
 16 pass · 3 FAIL · 5 warn   (run with --delivery to make SME/dist artifacts hard requirements)
```

The three FAILs:

1. `[FAIL] Voice-over: all 74 lines have real audio` — the 8 brand-new ids. **Blocked on `GEMINI_KEY`.**
2. `[FAIL] Art: all 20 images generated (not emoji-fallback)` — `obj_ghar, obj_kauaa, obj_kela,
   obj_machhli, obj_patang, obj_patta`. **Blocked on `GEMINI_KEY`.**
3. `[FAIL] Engine UI assets: all 11 referenced files in assets/UI — MISSING: ['start_mascot.png',
   'start_btn.png']` — **pre-existing.** The identical FAIL appears on the delivered build
   (`17 pass · 1 FAIL · 6 warn`). Not introduced here, and not fixed here (outside the deck).

The five warns: **MCQ-in-costume** (counts the 6 zero-tap teach slides as tests — the same
misclassification annotated in round 3); **orphaned audio** (35 retired clips still on disk — the dist
step prunes them, measured below); **no SME .pptx yet**; and **silent hint / silent reveal on T3, T5,
T1** — those are zero-tap teach slides with nothing to answer, so a hint and a reveal have no meaning
on them.

**Other gates:** `sweep_overlap` 16 slides · **0 findings**. `card_engine_contract` **0 FAIL**.
`attempts_check` **0 defects**. Mount sweep: 15/15 mount, **0 console errors**.
Behaviour walk: **clean** (see §I, §J, §M proofs).

**Delivery size:** raw bundle 25 MB → dist **8.52 MB** (audio 14.77→1.29 MB Opus, art 1.99→0.24 MB
WebP, 0.52 MB of unreachable assets pruned). `DIST TOTAL 8.52 MB — UNDER 10MB OK`. The dist
render-check shows 404s **only** for the ungenerated assets above — nothing the dist step broke.

---

## CHANGED BEYOND THE DECK

Every card diff that maps to no row above, with why it exists.

1. **The three teach pages' question prompts are retired** (`vo_t1_prompt`, `vo_t3_prompt`,
   `vo_t5_prompt`). The deck gives each teach page a complete "Final VO" list — sentence, then
   explanation — and its flow starts at "Sentence appears"; none of the three lists a question line.
   The re-order made it worse: `vo_t3_prompt` says "**अब** यह वाक्य सुनो" ("now listen to *this*
   sentence") and now opens the whole lesson. The `prompt` **role** still points at the sentence clip,
   because the sentence is what the slide says first. **Say the word and they come back.**
2. **`vo_g5_hint` re-pointed** — "क्या उसमें प की आवाज़ आती है?" → "उसमें प की आवाज़ है या च की?".
   Consequence of row 83: once the bins stopped being *प / not-प* and became *प / च*, a yes-no hint no
   longer described the board it was hinting about. Logic and progression untouched.
3. **`vo_p4_reveal` + `vo_p4_correct` re-pointed प → न.** Consequence of row 99: both clips *name the
   answer*, and the answer changed. The ladder itself is untouched (row 103).
4. **`signals_expected`: `gender_match_first_try` removed, `balloon_sound_first_try` added.** The
   addition is required by row 53. The removal is a pre-existing stale entry — there is no MATCH slide
   in this lesson and never was, so the `?dev=1` validator was flagging a signal that could not fire.
5. **`data.matra_audio` dropped from the three MEET_LETTER slides.** Dead data: the engine only reads
   it `if(slide.data.matra)`, and no slide here has a `matra`. The new `reveal_flow` supersedes that
   step list.
6. **`data.auto` / `reveal_seq` replaced by `teach_seq` on T1/T3/T5**, and `audio.explain` moved into
   the step that plays it. Mechanical consequence of rows 18–21, 32–35, 43–45.
7. **`audio.reveal` / `try_again` / `word_name` dropped from G1.** The balloon module has no
   single-noun stimulus and no reveal rung; those roles have nothing to address. Consequence of row 53.
8. **A danda added to T1's last on-screen word** ("पीला-पीला" → "पीला-पीला।"). One character, so the
   sentence on screen matches the sentence the deck prints for that page, and matches the other three.
9. **`_emoji_fallback` and `phase_distribution`** follow the option and slide changes automatically.

Nothing else differs. P2 and P8 are byte-identical, which is exactly what the deck asked for.

---

## Self-review — defects THIS run introduced, found and fixed before handover

Bound to this run's own edits; anything pre-existing is in Observations instead, untouched.

1. **The crow call followed the child off the landing.** `sfx_kanv` is fired by a timer sized to the
   sentence animation (~2.6 s). A child who taps «शुरू करें» before it fires took the caw with them —
   measured landing *on the celebration screen* in one probe. The timer now checks the start gate is
   still up before playing. Re-verified: the celebration plays `sfx_celebrate` + `vo_p8_prompt` and
   nothing else.
2. **The new mechanics' staged reveals used private class names.** `bal-hidden` / `ss-hidden` /
   `ml-stage` meant `capture_pages` — which settles staggered reveals by stripping `.seq-hidden` —
   could not settle them, so all five new pages captured **blank**. This is the documented
   HI01H02_L01_S01 failure (four match slides shipped blank to an SME the same way). Re-keyed to the
   shared `seq-hidden` class, and the landing intro was moved to pure CSS whose *end state is the
   default*, so a frozen or script-less render shows the finished page rather than an empty one.
3. **The teach slides' single letter card grew into the replay pill.** It inherited the 4-up grid's
   184 px row height; measured 8 px of overlap with «फिर सुनो». Sized and centred — `geom` now shows
   the card at 394–532 px, clear of the pill (ends 372) and of आगे (starts 560).
4. **The balloon field overflowed its host by 210 px** — the second row was cut off. Sized down and
   capped so exactly four fit a row; `geom` now shows the field at 472 px inside a 494 px host.
   *(The first fix made it worse — a 780 px cap is a border-box width and the 80 px of side padding
   left room for only three per row, breaking the set 3/3/2. Caught by re-measuring, not by eye.)*
5. **The target-sound highlight rendered as a detached amber block below the letter.** A background on
   an inline span paints over the font's full em box, and Baloo 2's descent is deep. Replaced with
   colour + glow, which needs no box geometry and survives any glyph.

Not fixed, because they are not this run's: everything under Observations.

---

## OPEN — flagged back, not silently decided

- **OPEN-1 · `GEMINI_KEY` is absent** — the one blocked step. 30 voice clips (20 re-records + 10 new),
  9 pictures. Everything is authored, wired and verified against it; only the media is missing.
  `_assets_round4/GENERATE_ASSETS.md` is the runbook, `regen_ids.txt` the exact scope.
- **OPEN-2 · The deck has no page-14 slide.** `01_CHANGE_LIST.md` carries one; every ask in it is
  "keep", and the slide is byte-identical. Confirm nothing was lost in transcription.
- **OPEN-3 · Page 9 is internally inconsistent.** Item 4 says "Do not remove the option"; item 5 says
  "keep the current hint logic… do not introduce a completely new hint flow" — and the current logic
  greys-and-locks a card on the **2nd** wrong tap. Followed item 5. The option is never removed from
  the screen, only locked. One ruling settles it.
- **OPEN-4 · Register clash on page 8.** The balloon VO is **aap** ("टैप कीजिए", "ध्यान से सुनिए");
  every other line in the lesson is **tum**. Deck wording kept verbatim, as agreed — but the lesson now
  changes register on that one page.
- **OPEN-5 · CLOSED for page 1 (r4d): the cover marks the letter क and nothing else.**
  This took three attempts and each one is worth recording, because each looked right and was not.
  **r4** marked the whole akshara (का) and I flagged it as a Devanagari-shaping limit.
  **r4b** wrapped the bare consonant in its own span and measured *identical advance widths*, which I
  read as "the boundary held". It was the opposite: Chrome **shapes Devanagari across inline element
  boundaries**, so क and its ा still formed one cluster and painted in the colour of the element that
  opened it. Unchanged widths were the symptom, not the all-clear.
  **r4c** stopped splitting the text and clipped the PAINT instead — the whole word drawn twice, the
  top copy cut to the consonant's advance. Better, but an advance runs to where the *next* glyph
  starts, so it swept in the stretch of headline bridging the gap to the matra: an orange bar hanging
  past the क with nothing under it. Clipping to the consonant's **ink** fixed that, and a full-height
  rectangle still caught anything FLOATING ABOVE the letter's column — measured at 4×: **1078 orange
  px on कौआ's ौ arm, 919 on काँव's ँ**. A letter is not a rectangle, so no rectangle can express it.
  **r4d** stops cutting altogether. The overlay is a copy of the LETTER ITSELF, positioned at that
  letter's own offset: the matra and the candrabindu are not in the overlay's text at all, so no
  geometry can include them by accident. A leading consonant with a post-base matra renders the same
  glyph standalone as it does in the word, which is what makes the two register exactly.
  **The lesson worth keeping: every one of these was caught by measuring pixels, and every one of them
  passed a look at the screen first.** A conjunct (क् + …) has no separable letterform and is
  deliberately left unmarked rather than painted with a glyph it does not have.
  **Pages 2, 4 and 6 still mark the akshara** (पी, चू, मे) — out of scope for a page-1 pass, and the
  mechanism now exists to switch them in one line whenever you want it.

- **OPEN-6 · Word sync is duration-proportional, not force-aligned.** No forced aligner exists in this
  toolchain, so each word takes a share of the clip's measured duration weighted by akshara count.
  Close, not frame-exact — and it will shift slightly when the re-recorded clips land.
- **OPEN-7 · Deck slide order vs `02_PAGE_ORDER.md`.** The deck reviews page 8 **last**; the handover
  doc places it at **position 8**. Followed the handover doc, as agreed.
- **OPEN-10 · Page 2 now contradicts the deck on one point, by later instruction.**
  Deck row 21 asks: *"When introducing the target sound, play only the 'च' sound. At the same time,
  show the letter 'च' clearly on screen."* The page-by-page review then asked for **exactly two clips
  on this page — the sentence and the explanation — and no others**. Those cannot both hold, so the
  later instruction was taken: the letter card still arrives on its own beat, but says nothing.
  One word restores it (`{"step":"letter","silent":True}` → drop `silent`). Flagging because the SME
  wrote row 21 and will not see this decision unless it is written down.

- **OPEN-12 · The no-bounce treatment is scoped to page 2 only.**
  Pages 4 and 6 still lift the word chip and pulse the mark on their beat, because they mark the whole
  akshara and were not in scope. The CSS keys off `[data-sw-word]`, which only a bare-marking chip
  carries, so switching those pages to bare marking will bring the calm treatment with it — no extra
  work needed at that point.

- **OPEN-11 · The ✓ badge removal reaches all three teach pages, not just page 2.**
  The green tick came from `.opt-cell.correct`, whose `::after` renders "✓" — the engine's
  "you answered correctly" badge. The teach slides were adding that class purely to emphasise the
  letter card, on pages where the child answers nothing. It is now a neutral warm ring (`.ss-lit`).
  The letter beat is one shared code path, so pages 4 and 6 lost the tick too. Kept global
  deliberately — a correctness badge on a slide with no question is wrong on all three — but it is a
  change beyond the page-2 scope, so: say the word and pages 4 and 6 get it back.

- **OPEN-8 · `vo_snd_ch` is now a BARE SOUND (r4e); the other `vo_snd_*` are still carrier words.**
  The TTS model refuses an isolated akshara, which is why these were recorded as «च से चम्मच।» etc.
  Rather than leave page 2 playing a whole sentence where the deck asks for one sound, the existing
  clip was **trimmed to its first syllable** — no new generation needed, and it is what
  `04_VO_RECORDING_LIST_current.md` says the clip should have been. `vo_snd_ch` is shared with page 10,
  which also improves. **The same one-minute trim will do `vo_snd_p`, `vo_snd_m`, `vo_snd_l`,
  `vo_snd_r` and `vo_snd_n`** when their pages come up. Worth one listen: the cut point came from the
  energy envelope, not an ear.
- **OPEN-9 · Page 12 asks for the same hand nudge as page 9, but the engine bans the hand in
  PRACTICE** (the round-3 "no visual hint in round 3" ruling, enforced centrally in `pointNudgeAt`).
  Page 9 is guided and gets the hand; page 12 is practice and does not. Since the same page also says
  "keep the same hint logic… no change is required", keeping the existing behaviour honours both. Flagging
  because it means the two pages do not behave identically.

---

## Observations — noticed, NOT changed

The game was left exactly as the deck specified on all of these.

1. **`start_mascot.png` / `start_btn.png` are referenced but absent** (receipt FAIL 3) — identical on the
   delivered build. Engine chrome that "vanishes silently"; worth a kit copy in a future round.
2. **`hint.png`, `hint_active.png`, `peeking_pal.gif`** are referenced in the HTML with no file on disk.
   Also pre-existing.
3. **The two SORT slides overflow their host container** (`scrollHeight` > `clientHeight`) — present on
   the delivered build too, on the same slides. Nothing leaves the stage (`sweep_overlap`: 0 findings).
4. **Every tutorial slide reports the same host overflow**, at 1500×900, 1000×470 and 820×1180 alike —
   again identical on the delivered build. A `.tut-card` layout artifact, not a visible defect.
5. **Page 11's bin labels wrap to three lines** ("प की / आवाज़ / वाला"). Readable, but the boxes are
   tall and narrow. The labels are the SME's exact words, so they were not touched.
6. **The existing papaya art (row 49) already reads clearly** at full size — worth comparing before
   replacing it.
7. **`sfxCorrect` / `sfxWrongSoft` are code-synthesized tones**, not recorded effects. Pre-existing
   engine behaviour, and they are on the EAR-CHECK list below.
8. **The lesson is 9 pick slides to 2 sorts** after the deletions — the receipt's "MCQ-in-costume" warn.
   The deck drove the mix; noting it since the balance moved this round.

---

## EAR-CHECK — a human must listen before this ships

- All **30 regenerated clips** once they exist — none has been heard by anyone yet.
- Any clip `gen_tts` recovers on a **fallback voice** (it prints its own EAR-CHECK list; paste it here).
- **`sfx_kanv`** — **a real recording** as of r4d, supplied by the SME and trimmed here to one call.
  The synthesized stand-in from r4c is deleted. Still worth one listen at the trimmed length, since
  the cut point was chosen from the energy envelope rather than by ear.
- `sfx_correct` / `sfx_wrong` / `sfx_celebrate` — synthesized tones, inherited.

## Placeholder vs final

| Asset | State |
|---|---|
| 30 VO clips (20 re-records, 10 new) | **placeholder / stale** — text authored, audio pending |
| `vo_snd_ch` | **trimmed to a bare च** (r4e) from the existing carrier clip; EAR-CHECK |
| 8 object pictures (5 new, 3 replacements) | **pending** — emoji fallback renders today |
| crow `obj_kauaa` | **final** — supplied by the SME, installed r4c |
| mouse `obj_chuha` | **final** — supplied by the SME, matte-stripped and re-framed, installed r4h |
| `sfx_kanv` crow call | **final** — SME recording, trimmed to one 0.57 s call (r4d) |
| Everything else (73 clips, 14 pictures, all UI) | final, unchanged, untouched by this round |
