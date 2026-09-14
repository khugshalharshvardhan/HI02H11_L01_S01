# CHANGES.md — HI02H11_L01_S01 · SME round-4 revise · 2026-09-14

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
| 10 | "The sentence should appear with a simple word-by-word animation." | ✅ | CSS stagger, `--i` per word; end state is the default so a frozen capture shows it complete |
| 11 | "Highlight only the repeated 'क' … Do not highlight the complete word." | ✅ | capture 01 — 5 marked aksharas: का · कौ · काँ · काँ · क; the rest of each word stays navy |
| 12 | "Add a clear crow illustration below the sentence… do not let it cover the sentence." | ⏳ | wired + laid out (capture 01 shows it below, not overlapping); **final art pending** — 🐦‍⬛ fallback today |
| 13 | "A small 'काँव-काँव' sound effect … when the crow appears." | ⏳ | `sfx_kanv` wired, fires at the crow's beat; **needs a real recording** — see §Assets |
| 14 | Flow: sentence → words one by one → 'क' lights → crow → crow sound → VO | ✅ | CSS timeline: words at .25s + .43s each, then the क light, then the crow +.42s, sfx on the same beat |
| 15 | New `vo_landing` (deck text, verbatim) | ⏳ | text in the card + `audio_text`; **clip is the old line** until regen |

## C · New page 2 (was page 4 · T3) · SENTENCE_SOUND — च — `capture 02`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 16 | Sentence → "चूहे ने चार चने चबाए।" | ✅ | capture 02; card-diff words 4→5, चूहा→चूहे + "ने" added. Clip `vo_line_l2` re-record pending |
| 17 | "Remove 'र' and 'ल' … focus only on 'च'." | ✅ | card-diff `options[]` 3→1; capture 02 shows one card, च |
| 18 | Word-by-word highlight synced with the VO: चूहे → ने → चार → चने → चबाए | ✅ | `teach_seq` step `sentence`; karaoke driven off the clip's real duration |
| 19 | "After the sentence is completed, remove the word-level highlighting." | ✅ | `clear_words` step; capture 02 shows no word fills, only lit aksharas |
| 20 | "Highlight only the letter 'च' in चूहे, चार, चने, चबाए." | ✅ | capture 02 — चू · चा · च · च lit; **"ने" correctly unlit** |
| 21 | "Play only the 'च' sound … show the letter 'च' clearly on screen." | ✅ | `letter` step plays `vo_snd_ch` as the card lands; capture 02 |
| 22 | VO 2 = "चूहे, चार, चने, चबाए—इन सब शब्दों में 'च' की आवाज़ बार-बार आई।" | ⏳ | text in card; `vo_t3_explain` re-record pending |
| 23 | "Keep a brief pause between VO 1 and VO 2." | ✅ | `{"step":"pause","ms":700}` between them |

## D · New page 3 (was page 5 · T4) · MEET_LETTER — च — `capture 03`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 24 | Remove the explanatory sentence from the screen; keep as VO only | ✅ | card-diff `prompt_hi` → `""`; capture 03 has no prompt band; `sweep` prompt=None |
| 25 | Letter 'च' stays left; highlights **in sync with "चूहा"** in the VO | ✅ | `cues` on a 6 s clip: lit @0.9 s ("सुनी"), re-lit @4.6 s (the word "चूहा") |
| 26 | "Remove the current ant image. Add a … rat/mouse image instead." | ✅ | capture 03 — mouse; card-diff `obj_chinta` → `obj_chuha` |
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
- **OPEN-5 · "Only the target letter" is implemented at AKSHARA granularity.** A bare consonant cannot
  be wrapped away from its own matra without breaking the cluster — the browser renders an orphaned
  mark. So पीतल lights **पी**, not "प" and not the whole word. This is the same shaping limit that
  killed the matra-colour attempt on HI01H04; it is not re-attempted. Captures 02/04/06 show the result.
- **OPEN-6 · Word sync is duration-proportional, not force-aligned.** No forced aligner exists in this
  toolchain, so each word takes a share of the clip's measured duration weighted by akshara count.
  Close, not frame-exact — and it will shift slightly when the re-recorded clips land.
- **OPEN-7 · Deck slide order vs `02_PAGE_ORDER.md`.** The deck reviews page 8 **last**; the handover
  doc places it at **position 8**. Followed the handover doc, as agreed.
- **OPEN-8 · `vo_snd_*` are still carrier words** ("च से चम्मच।") where the deck asks for the **bare
  sound**. A known TTS limit recorded in `04_VO_RECORDING_LIST_current.md`; `vo_snd_n` follows the same
  convention. These need a human reader.
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
- **`sfx_kanv`** — must be a real recording or a licensed effect. Do not synthesize a bird at the
  lesson's opening beat; the engine currently plays the landing silently, which is the better failure.
- `sfx_correct` / `sfx_wrong` / `sfx_celebrate` — synthesized tones, inherited.

## Placeholder vs final

| Asset | State |
|---|---|
| 30 VO clips (20 re-records, 10 new) | **placeholder / stale** — text authored, audio pending |
| 9 object pictures (6 new, 3 replacements) | **pending** — emoji fallback renders today |
| `sfx_kanv` crow call | **not generatable** — needs a recording |
| Everything else (73 clips, 14 pictures, all UI) | final, unchanged, untouched by this round |
