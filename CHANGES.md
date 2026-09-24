# CHANGES.md — HI02H11_L01_S01 · SME round-4 revise · 2026-09-14
### r4b-r4d — **page 1 / cover**: only क marked, VO-synced flow, SME crow art + SME crow recording
### trimmed to one call. Rows 10-14; OPEN-5 closed.
### r4e-r4g — **page 2 (T3)**: only च marked (no matra, no overhang, no fringe); फिर सुनो removed;
### ✓ badge removed; exactly two clips; the highlight no longer bounces. Rows 20, 21, 23.
### S01r4h — **page 2 (T3)**, by Piyush (69519fc): the च overlay is now NESTED inside .sw-text using
### the cover's own .sound-layered structure, instead of being a sibling positioned by measured
### geometry. Root cause named there: an inline span's rect is its FONT box, an absolutely-positioned
### box is blockified and sits in a LINE box, and the two differ by the half-leading — ~9 px at 48 px.
### Nested, base and overlay share one line box and one baseline, so they register by construction.
### (A parallel fix here measured both baselines instead; it is superseded and layerSoundOnChip is
### now dead code. Piyush's removes the reason the boxes disagree rather than compensating for it.)
### S01r4i — karaoke paces against the whole spoken line, not just the marked words (Piyush, 69519fc).
### S01r4j — the nested form still clipped the overlay from the text origin, but च's ink starts 2 px
### LEFT of it (negative side bearing), so the navy base showed as a nub on the headline's left end:
### 132 navy px in a 4 px band left of the orange, on चार at 8x. soundWordHTML now covers the bearing.
### Final: left band 132 → 0, inside the letter 6 px (the following ा stem, correctly navy), 0 above,
### 0 below. **page 3 (T4) + page 11 (G5)**: mouse art replaced with the SME-supplied file. Row 26.
### S01r4k — **page 3 (T4)**, and with it pages 5 (T6) and 7 (T2): the picture LABEL marked the whole
### akshara — चूहा came up with the ू coloured too — because it rendered through aksharaHTML, which
### wraps the cluster. aksharaHTML's own `bare` flag is not the fix: it splits the span between the
### consonant and its matra, and Chrome shapes a Devanagari cluster ACROSS inline boundaries and
### paints it in the opening element's colour. The label now uses the same layered form as the cover
### and the sentence chips, whose overlay text is the consonant ALONE. Verified on pixels at 6x:
### चूहा, मूली and पपीता (two प) all mark the bare consonant and leave every matra navy.
### One behaviour change: the consonant now lights amber ON THE VO CUE rather than arriving already
### lit, and the scale-pulse is gone — pulsing the overlay alone would scale it off the base and show
### the navy letter through. Matches the flow the module documents and the no-bounce ask.

### S01r4p + r4p — **page 9 (G3)**, the pick-the-sound question. Most of the deck's flow was already
### implemented (reveal_seq letters one-by-one each speaking itself; red flash + buzzShake on a wrong
### tap; terminal help at max_attempts=2 that puts the HAND on the correct card without selecting it;
### the three VO lines authored verbatim). Four things were not:
###  1. «फिर से सुनो» removed — hide_replay was only honoured on the teach path.
###  2. THE SENTENCE NEVER PLAYED ITSELF. The reveal chain was prompt -> letters; the sentence was
###     reachable ONLY through that pill, so removing the pill would have asked "which sound
###     repeats?" about a line the child never heard. New data.seq_say_whole inserts it between the
###     prompt and the letters, marking the chips .said as it goes. Opt-in; every other reveal_seq
###     slide is unchanged.
###  3. The 2nd-wrong rung spoke the WRONG CLIP. revealAnswer() prefers audioFor("hint") over
###     ("reveal"), and a generic `hint` was authored, so it said "हर शब्द की शुरू की आवाज़
###     पर ध्यान दो।" instead of the Hint 2 line. The `hint` key is dropped from this slide only.
###  4. Option order was SHUFFLED (observed च, र, ल) against the flow's named च -> ल -> र. New
###     data.fixed_order pins the authored order for this slide only.
### ⚠ TRADEOFF ON 4: the engine shuffles options everywhere precisely so the answer is never pinned
### to one position, and the named order puts the CORRECT letter first. Implemented as asked; worth
### the SME confirming, since a child can pass this page by always tapping the first card.
### Walked on behaviour: prompt -> वाक्य -> च/ल/र one at a time -> wrong ल (red+buzzShake, vo_g3_try,
### no hand) -> wrong र (hand on च, च .reveal-hold NOT .correct, vo_g3_reveal) -> tap च (vo_g3_correct).
### P4, the other pick-the-sound page, keeps its pill, its shuffle and its `hint` — flags default off.
### VO-1 — **page 9 (G3)**: the letter options spoke their CARRIER PHRASES — "ल से लट्टू।" and
### "र से रस्सी।" — where the page asks for the bare sound. vo_snd_l and vo_snd_r are now trimmed
### to the consonant alone, the same way vo_snd_ch already was: ल 1.77s -> 0.40s, र 1.69s -> 0.38s,
### against च's 0.38s. Cut points taken from a 20ms energy envelope (ल 0.28-0.68s, र 0.28-0.66s),
### 12ms fade in / 30ms fade out so the cut cannot click. Verified one utterance per clip.
### Originals kept at _assets_round4/vo_snd_originals/<id>.carrier.ogg.
### ⚠ PAGE 13 IS NOW MIXED, and this is the part to decide on. vo_snd_l is shared: it is option ल on
### page 9 AND on page 13 (P4). Page 13's other two options still speak carriers — "म से मछली।" and
### "न से नाव।" — so that page now has one bare sound next to two phrases. vo_snd_m, vo_snd_p and
### vo_snd_n were NOT trimmed: the instruction named page 9 only. Trimming them reaches pages
### 3,4,5,6,7,8,10,11,12,13. Say the word and it is one run.
### EAR-CHECK: all three cuts were chosen from energy envelopes, not by ear.
### ART-3 — **page 11 (P1)**: मामा, चींटी and लाल replaced with the SME-supplied mama / aunt /
### tamatar files. ("aunt" is an ANT — चींटी — checked against the image, not the filename.)
### Installed AS-IS, unlike the mouse and the papaya: their faint alpha is black antialiasing hugging
### the subject (ink box at threshold 0 vs 24 differs by ~2px), not the pure-red background-removal
### matte those two carried, and their ink:canvas fractions (65-91%) are in normal range rather than
### cropped edge-to-edge. Nothing to strip or re-pad.
### ⚠ REACHES PAGE 14 TOO: obj_chinti and obj_laal are shared with P7, which now shows the new ant
### and tomato. Checked on render — both suit that page; flagged because it was not asked for.
### ⚠ 12 UNREFERENCED FILES in build/assets/Images, 3.36 MB: the six SME source uploads
### (aunt 1 / mama 1 / mouse / papita / radish / tamatar 1) once copied onto their obj_* keys, plus
### six obj_* orphans from slides this round deleted (achar, chanda, chinta, moti, patila, pital).
### dist/ prunes all of them; only build/ carries the weight. Left in place — they are the SME's
### originals and deleting them is the owner's call.
### S01r4q — **fln-animation-toolkit** (github.com/ananya-goswami/fln-animation-toolkit) — the
### applicable subset installed, not the whole kit. The kit documents 22 recipes; this game already
### ships the older fleet set (buzzShake, revealPulse, correctPop, sgFloat, pgPeek, blkDrop …), so
### most recipes describe what is here rather than adding to it. THREE were genuinely missing:
###  · recipe 22 — REAL SOUND. sfxCorrect/sfxWrongSoft were WebAudio arpeggios and have sat on this
###    bundle's EAR-CHECK as a known weakness since round 4. Now sfx_correct.ogg (rises 10.7
###    semitones) and sfx_wrong.ogg (falls 5.1) — measured on pitch contour, not filename. The tone
###    stays as fallback via _sfxFile(), so a blocked/missing file degrades to today's behaviour,
###    never to silence. Licence: _assets_round4/anim_kit/SFX_LICENCE.txt (Kenney CC0 + a Pixabay
###    clip supplied by the team). sfx_pop.ogg installed for future use, not yet wired.
###  · recipe 7 — CONFETTI. The old cannon dropped 48 single elements down one diagonal at one
###    speed. Now three nested elements per piece (fall / sway / two-axis tumble with a darkened
###    back face), ~22% going end-over-end. Verified: 56 pieces, four shapes, 25% tumbling.
###  · recipe 19 + answer-tempo — CORRECT SELECT. ckPop's anticipation dip (scale .966 at 11%) makes
###    the pop read as caused by the child's finger; 5 sparks lift off the TOP ARC only so they
###    never cross the letter. Verified gold #FFC93C, star clip-path, on the correct tile.
### DELIBERATELY NOT INSTALLED, each for a reason:
###  · recipes 1+2 (start-screen sky / tap burst) — BLOCKED: the kit requires swapping .start-bg to
###    startnew_bg_plain.webp first or the stars double (one frozen in the bitmap, one moving).
###    Neither this game nor the kit ships that asset.
###  · recipe 20 (wrong select) — this engine's wrong feedback was tuned by the SME across three
###    rounds ([28p]/[28r]/[28u]: red flash on BOTH wrongs, grey lock only from the 2nd). Its tempo
###    anchor --fx-beat is already this engine's buzzShake .4s, so the pair is in step without it.
###  · recipe 21 (object outline) — N/A: no look-and-find mechanic in this card's six slide types.
###  · recipes 3+4 (nudge hand press / tap ripple) — not taken: the kit warns the ripple geometry is
###    anchored to an 86×108 hand and that later `#nudgeHand{width:56px}` fork rules silently
###    override the offsets (its own R11). Worth doing, but it needs a measured pass of its own.
### ⚠ ONE HOUSE-RULE CONFLICT LEFT OPEN. The kit's recipe 9/19 state the green outline IS the
### correct-mark — no tick — and .ck-correct::after{content:none} enforces it. This engine hangs a
### ✓ badge on .opt-cell.correct. That line is NOT included: dropping the tick is a pedagogy change
### across every answerable slide and no SME here has asked for it. The tick and the crown sparks
### now coexist; if the SME wants the kit's rule, it is one line.
### S01r4r — **fln-animation-toolkit, second pass**: the three effects asked for by name.
###  · recipe 7 (correct-answer confetti) was already installed in S01r4q — unchanged.
###  · recipe 1 (START-SCREEN SKY) — previously declined as BLOCKED, now UNBLOCKED. The block was
###    real: startnew_bg.webp has stars, sparkles, rings and dots painted INTO the bitmap, and the
###    kit's drift layer on top gives two sets, one frozen and one moving. Generated the missing
###    plate instead: startnew_bg_plain.webp, made by detecting everything lighter than a hard blur
###    of itself (the shapes are small and light; the rays and gradient are large-scale), dilating
###    that mask and pasting the blur back. 13,167 shape pixels detected, 0 remaining — rays and
###    gradient untouched. 87 stars now drift across 3 layers × 29 lanes, sized in vmax because the
###    layer sits OUTSIDE the transform-scaled stage (kit R1). NO CSS mask is used to keep the start
###    card clear: r0=22vmax means nothing ever spawns within 22vmax of centre, so the card sits in
###    a hole the geometry already leaves. Built at runtime from app.js rather than as template
###    markup, so nothing outside engine_local/ had to change.
###    ⚠ dist_local.py's UI whitelist had to gain 'startnew_bg_plain.webp' — that list is the ONLY
###    thing deciding what survives the prune, so without it the dist start screen loses its ground.
###    Verified present in dist (UI 20 → 21).
###  · recipe 8 (CELEBRATION STAR BURST) — RETUNE, not a new effect. starBurst() already WAS the
###    kit's old burst parameter for parameter (ticks 100, decay 0.96, startV 22, 80 stars + 20
###    circles, shots 0/150/300). 300 particles leaving centre at 22px/frame read as one bright
###    flash that is over before the child looks up. Now the kit's retune: ticks 150, decay 0.975,
###    startV 14, spin .18, 32 stars + 8 circles, shots 0/220/440, and the loop's floor derived from
###    the LAST shot so retiming cannot end it early. Gravity stays 0 — these float and fade; the
###    confetti is what falls. Measured 37,148 lit canvas px at peak.
### ⚠ CAUGHT BY THE CARD-DIFF GATE: the first sync of this round would have reverted two pieces of
### teammate work — G1 moved to second-to-last ("balloon wala page at last") and P4's new
### fixed_order/hide_replay/seq_say_whole. Cause: the recipe was reconciled repo→factory AFTER the
### rebuild, so the artifacts came from the stale one. Rebuilt; card now byte-identical to the
### committed one. RECONCILE THE RECIPE BEFORE BUILDING, NOT AFTER.
### S01r4u — three asks, all resolved to slide IDs BEFORE anything renumbered (a delete shifts
### every page after it, and all three were written against the order that was live at the time):
###  1. **page 11 = P2** (the शुरुआत में / बीच में sort) REMOVED. 15 slides → 14. The pages after it
###     shift: P7 is now page 12 and the balloon page 13.
###  2. **page 14 = G1, balloon pop** — the burst was 8 particles on a fixed 45° cross, every one the
###     same size, colour, distance and duration, so it read as one 8-pointed shape flicking open
###     rather than a balloon coming apart. Now 22 across TWO rings — a fast outer throw (13) and a
###     slower, smaller inner spray (9) — each particle carrying its own angle jitter, distance,
###     size, spin, delay and warm hue. Measured after the pop: 22 particles, 18 distinct sizes,
###     5 colours, 17 distinct durations. Piyush's [S01r5i] shockwave ring is untouched and still
###     fires behind it.
###  3. **pages 10 (P1) and 13→now 12 (P7)** get the earned hand after two wrong taps, matching
###     page 7 (G2). Done through data.allow_hand, NOT by widening the phase rule: handOnAnswer
###     self-gates to tutorial+guided because of Yasir's round-3 ruling ("round 3 gets no hand by
###     ANY route"), and allow_hand is the per-slide opt-in the balloon page already uses. The
###     TAP_ALL_WITH_SOUND branch now forwards it, which is the one line that was missing.
###     Walked: page 7 HAND=True (reference), pages 10 and 12 HAND=True after 2 wrong taps, ripple
###     present on all three.
###     ⚠ THIS OVERRIDES A RECORDED SME RULING. [28j] says practice gets no hand by any route; two
###     pages now do, by name. Worth confirming with Yasir — one flag per page reverts it.
### ⚠⚠ I HAD BEEN CLOBBERING PIYUSH'S ENGINE WORK. He pushed 6fb18ab "Restore page 5/8/10/14 engine
### work lost in the animation-kit merge". Cause: I reconciled the RECIPE repo→factory every round
### but never engine_local/, so each sync overwrote app.js and style.css with my stale factory copy.
### His restore then dropped four of MY effects in turn (hand ripple, hand press, wrong ring,
### celebration retune). Both sides are now re-applied on top of each other and verified present.
### RECONCILE engine_local/ AND the recipe repo→factory BEFORE EVERY EDIT — not just the recipe.
### S01r4w — NO EMOJI ANYWHERE, and the SME's own balloon-pop sound.
###  · The five images that had been falling back to emoji (obj_ghar, obj_kela, obj_machhli,
###    obj_patang, obj_patta) are in. All five arrived cropped EDGE-TO-EDGE (99-100% of canvas both
###    ways) with a matte fringe — obj_machhli's was pure red. Dropped in raw they would have
###    rendered visibly larger than their neighbours and touched their chip edges, so each was
###    matte-stripped, trimmed to true ink and re-padded to the HOUSE framing, measured across the
###    20 assets already correct: median 82.2%W / 88.7%H. Verified on the render: zero emoji and
###    zero broken images across all 14 slides. The receipt's "Art: emoji-fallback" FAIL is gone
###    — 17 pass/3 FAIL → 18 pass/2 FAIL.
###  · Balloon pop now plays the SME's recording. Trimmed 1.97s → 0.21s: the source had 140ms of
###    LEADING silence, which would have landed the bang after the balloon had already gone, plus
###    1.7s of dead air. Peak now sits 30ms in. sfxCorrect still fires alongside it — the pop and
###    the "that was right" ding are two different messages and this page wants both.
### ⚠ TWO PRE-EXISTING DIST DEFECTS found while verifying, both now fixed:
###  1. The committed dist referenced swifty_with_balloons twice in its HTML and shipped NEITHER
###     file — the balloon mascot has been a broken image in every dist cut since it landed. The
###     factory had no assets/gif at all; I had been reconciling engine_local and the recipe but
###     never the ASSET folders.
###  2. balloon.png is painted by .balloon in style.css but was not on dist_local's UI whitelist,
###     so every dist pruned it. That list is the only thing deciding what survives, and nothing
###     cross-checks it against the CSS.
### ⚠ CARRYING THE GIF BROKE THE 10 MB CAP (11.68 MB). Re-encoded to the format every other
### animated mascot here already uses: swifty_with_balloons .gif+.png (2,145 KB) → .webp pair
### (456 KB) at 408px/10fps, and balloon.png (106 KB) → balloon.webp (16 KB) at 300px — .bal-body
### is 150x172, so both are still a true 2x. Dist 11.68 → 9.97 MB, under the cap, no 404s.
### Originals kept at _assets_round4/sme_originals/.
### ⚠ THREE DEAD UI REFERENCES remain, pre-existing and untouched: hint.png, hint_active.png,
### peeking_pal.gif are referenced by the engine but exist nowhere. Harmless only while those code
### paths stay unused.
### S01r4x — **pages 7 (G2), 10 (P1), 12 (P7)**: the hand nudge points AT the box, and clears on tap.
###  · THE FINGERTIP NOW LANDS ON THE TILE. _placeNudge put the hand BELOW it — [28h] moved it there
###    because the hand was covering the word, and [28j] then measured text rects to push it below
###    the label too. Both fixed a real defect, but the cure left the finger pointing at the GAP
###    under the tile. The hand's own geometry is why below was tempting: the fingertip sits near
###    the TOP of the 96px box (39.93, 6.38 — measured by rasterising the art) and the palm hangs
###    DOWN-RIGHT, so centring the box on a tile buries the tile under the palm. Anchoring the
###    FINGERTIP to the tile's RIGHT side instead puts the finger on the target and swings the palm
###    off to the right, where there is nothing to cover.
###    Measured on all three: tip ON the tile at 81% across / 52% down, distance 0.
###    ⚠ It does still grip the label's right edge — 22% of पपीता, 14% of मामा, 6% of चाँद. That is
###    the tradeoff [28h] was avoiding, now bounded: Yasir's original report measured 92-100%
###    coverage, and the word stays readable at these figures. Worth one look before it ships.
###  · THE HAND CLEARS ON TAP. TAP_ALL_WITH_SOUND's chip onclick never called stopNudge(), so it
###    stayed on screen pointing at a tile already answered. mountTapOptions has cleared it since
###    [27d]; this mechanic was simply missed. The balloon page already did it right.
###  · ⚠ A SECOND COPY OF THE PLACEMENT existed. pointNudgeAtForced() carried its own centred,
###    below-the-tile arithmetic, so the FORCED path (practice pages opting in via data.allow_hand,
###    and the balloon page) ignored _placeNudge entirely. Page 7 came out right while 10 and 12
###    still measured 8.4px BELOW the tile at 46% across — the old signature exactly. It now
###    delegates. One placement function, one behaviour.
### ⚠ SELF-INFLICTED, CAUGHT AND REVERTED: my first pass at this rewrote _placeNudge by searching
### the whole file for its closing line, which matched a LATER one and deleted 12 functions and the
### `state` declaration — 18,562 chars, and mountSlide threw on every slide. Restored from HEAD and
### redone with the edit bounded to the single function. Bound a structural edit to its own
### function; never search the file for a closing brace.
### S01r4y — **page 13 (G1)**: the mascot was SHUFFLING. Root cause found by matching every frame
### of the shipped webp back to the source gif: the order was
###   [0, 25, 4, 6, 8, 10, 12, ... 34]
### — the SECOND frame of every loop was source frame 25, a pose from near the end, before snapping
### back to frame 4. It flashed once per 1.8s loop. ffmpeg's `fps=10` filter with `-vsync 0` (my own
### r4w conversion) produced it; nothing in the pipeline checks frame ORDER, so it shipped.
### Rebuilt with PIL, indexing the source frames explicitly instead of letting a filter resample:
### 18 frames taken as [0,2,4...34], uniform 100ms, loop 0, same 408px and the same 425 KB, so the
### dist cap is untouched (9.97 MB). Verified three ways — frame order strictly increasing, ANMF
### durations read straight out of the container (18 x 100ms = 1800ms, matching the source's
### 36 x 50ms), and sampled in the browser at 60ms: max per-sample motion 16.8%, ZERO jumps over
### 18% (the bad frame produced a ~40% one).
### Two things I checked and ruled out on the way, both worth knowing:
###  · PIL's WebP reader does NOT expose per-frame durations — it reports None/0ms even for a file
###    with correct timing. I nearly 'fixed' a non-bug on that reading. Parse the ANMF chunks.
###  · The anim/still swap is not the problem: measured 3 flips in 12s, and the still matches
###    animation frame 0 to within 5.1% of pixels, so the swap is seamless.
### ⚠ The frame rate is still 10fps against the source's 20. Per-step motion is 11.4% vs 6.8%. 20fps
### costs 565-874 KB depending on size and does not fit under the 10 MB cap; uniform timing needs a
### frame count that divides 36, so 24 frames is not an option either. If the motion still reads as
### choppy now that the order is right, the lever is the cap, not the encoder.
### S01r4z / S01r5a — four asks.
###  1. NO TICK ON A CORRECT OPTION. Three sites carried one: .opt-cell.correct::after (a 64px green
###     disc) and .tap-all-item.got::after twice over. The mark survives — green border and fill
###     stay, .ck-correct still pops the tile, tapGotPop still fires. Verified: content:none,
###     display:none on both, border still rgb(0,177,50).
###     ⚠ This is the fln-animation-toolkit's own house rule (recipe 9, "the green outline IS the
###     correct-mark"), which is why recipe 19 was installed without it in r4q. Now adopted.
###  2. A WRONG TAP WIGGLES, IT DOES NOT TURN RED. Supersedes [28r] ("BOTH wrong attempts flash RED
###     FIRST") and the red half of [28p]/[28u]. Only the COLOUR goes: buzzShake still fires and
###     still snaps rather than eases, and the card is still released after a first miss. Verified
###     at the tap: animation buzzShake, background #fff, border #E3ECF7, no red anywhere. The
###     toolkit's red spark ring (recipe 20, added r4s) is hidden with it — with the tile neutral it
###     would have been the only red left on screen.
###     ⚠ [28r] was an SME ruling, reversed on request. One CSS block reverts it.
###  3. The SME's own correct/incorrect recordings replace the toolkit's. Both start at 0.02s, so no
###     onset fix was needed; trimmed to 0.86s / 0.73s (the sources carried 0.6s and 1.16s of dead
###     air) and converted to Opus. sfxCorrect/sfxWrongSoft already resolve to these ids, so no code
###     changed. Verified firing: sfx_wrong.ogg on a wrong tap.
###  4. THE BALLOON MASCOT IS BACK AT THE SOURCE'S OWN 20fps. r4y fixed the out-of-order frame but
###     left it at 18 frames/10fps, which is what still read as glitchy: per-step motion 11.4% against
###     the source's 6.8%. Now all 36 frames at 50ms, 408px, order verified as identity.
###     PROVEN THE ONLY WAY THAT SETTLES IT — both files rendered SIDE BY SIDE in the same browser at
###     the real 226px box and sampled at 50ms: source gif avg 18.7% / max 29.3%, new webp avg 18.6%
###     / max 28.6%, same count of large steps. It now moves like the SME's original.
###     ⚠ Measuring animated WebP through PIL is unreliable — it reports no per-frame durations, and
###     a LOSSLESS encode measured MORE frame-to-frame change than its own source, which is
###     impossible. Parse ANMF chunks for timing; measure motion in the browser.
### ⚠ ROOM FOR 20fps CAME FROM PRUNING ORPHANS, not from quality. 36 frames cost 874 KB against
### 425 KB, which would have broken the 10 MB cap. dist_local now drops any asset whose id appears
### nowhere in the built HTML: 51 files, left behind by slides deleted across the rounds. The
### keep-test is deliberately the widest exact one — the HTML inlines the card AND the engine, so a
### clip fetched by convention (sfx_*) survives without enumerating conventions, and it prints what
### it dropped. Dist 9.97 → 9.33 MB pruned, → 9.80 MB with the 20fps mascot. Walked all 14 slides
### served FROM THE DIST: zero image/UI 404s; the six audio 404s are the ungenerated clips already
### on the receipt's standing FAIL list, absent from the factory too.
### ⚠ TAG NAMESPACES. The engine comments run S01r4b..S01r4k; the recipe runs r4b..r4o, and
### the two series independently reached "r4j" meaning different things (engine: the left
### side-bearing clip; recipe: mark_bare on T5/T1). Entries here now use the name the CODE uses.
### Asset swaps carry no code tag, so they are ART-n.
### ART-2 — **page 7 (T2) + pages 8 (G1) and 9 (G2)**: पपीता art replaced with the SME-supplied
### papaya. Normalised like the mouse, not installed raw: the file carried 10,539 px of pure-red
### background-removal matte at alpha≤24 reaching the canvas edge, and its subject was cropped
### almost edge-to-edge (98.2%W/99.0%H) — dropped in as-is it would have rendered ~20% oversized
### and touching the box edges. Matte stripped, trimmed to true ink, re-padded to the outgoing
### asset's ink:canvas ratio: 80.8%W/93.4%H, matching it exactly. Left at native resolution on
### purpose — a straight RGBA downscale blends edge colour toward the transparent pixels beside it
### and leaves a dark halo (measured: 3,693 new semi-transparent px), and the correct premultiplied
### resize needs numpy, which this environment lacks. The dist step re-encodes anyway.
### ART-1 — **page 5 (T6) + page 11 (P1)**: मूली art replaced with the SME-supplied radish, installed
### as-is (clean alpha, framing already matched the outgoing asset).
### ⚠ TWO COPIES OF THE RECIPE. `build_skill_HI02H11_L01_S01.py` lives BOTH at the repo root and in
### the factory's scripts/. Piyush's r4j (mark_bare on T5 and T1) went into the REPO copy; a rebuild
### run from the FACTORY copy therefore regenerated card.json without it and silently reverted his
### fix — the recipe said mark_bare=True while the shipped card said false. Caught by diffing the
### two copies. Before any rebuild, reconcile repo recipe -> factory recipe first; the repo copy is
### the one collaborators edit.

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
| 44 | "Highlight only 'प' in पीतल, पतीले, पपीता, पीला." | ✅ | **[r4j] now the BARE consonant**, as pages 2 and 4 do — `mark_bare`: 6 lit प across those 4 words with every ी matra left navy; **"के" and "में" plain**. The «फिर सुनो» pill is gone too (`hide_replay`), matching those pages |
| 45 | "Play only the 'प' sound. Show the letter 'प' at the same time." | ⛑ | **[r4n] OVERRULED BY REVIEW** — "we don't need प se Patang VO". `vo_snd_p` speaks the phrase "प से पतंग।", so the letter beat is now `silent` — exactly as page 2's is (row 21). The card still arrives on its own beat |
| 46 | VO 2 = "पीतल, पतीले, पपीता, पीला।" — **new clip** | ⛑ | **NOT IN THE FLOW.** `assets/Audio/vo_t1_words.ogg` has never been generated, so this beat played nothing: the four प lit in silence and only then did VO 3 speak — the SME's "first it highlights all the letters then it plays the VO". **[r4o]** the mark beat now rides `vo_t1_explain` instead (row 47), the one clip this page actually has, so the marking is spoken over. Generate this clip and the SME can decide whether to restore the two-beat script |
| 47 | VO 3 = "इन सब शब्दों में 'प' की आवाज़ बार-बार आई।" | ✅ | `vo_t1_explain` re-scripted (the old single clip split in two); the .ogg EXISTS. **[r4o] it now carries the mark beat too** — the four प light across "इन सब शब्दों में" (0% → 29% of the clip), i.e. exactly while the voice says "in all these words", and stay lit through "प की आवाज़ बार-बार आई।". Same one-clip shape as pages 2 and 4 |

> **[r4l] The step order now MATCHES pages 2 and 4**: `sentence → clear → pause(900) → letter → mark → say`.
> It previously ran `mark → letter`, which is what this page's deck asked for verbatim ("VO 2 plays with
> प highlighted in each target word → letter प appears → VO 3", row 45). The reviewer has since asked for
> all three teach sentences to read alike — "page 5 is similar to page 1 and 3, fix it the same way" —
> and consistency across the three won out over this one page's ordering.
>
> **Nothing was dropped.** All three clips still play and keep their order relative to each other
> (`vo_snd_p` → `vo_t1_words` → `vo_t1_explain`); only the letter card now arrives BEFORE the marking,
> so the child sees प on screen while the words light up — exactly as pages 2 and 4 behave.
> **SME: overrule here if the deck's mark-then-letter order was load-bearing for this page.**

## H · New page 7 (was page 3 · T2) · MEET_LETTER — प — `capture 07`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 48 | Remove the explanatory sentence; keep as VO only | ✅ | `prompt_hi` → `""` |
| 49 | Replace the papaya with a clear, full, child-friendly पपीता | ⏳ | `obj_papita` queued in `objs.json`. *Note: the current art already reads clearly (capture 07) — worth an eyeball before replacing.* |
| 50 | Add the label "पपीता" below the image | ✅ | capture 07 |
| 51 | Highlight at "प", then **again** at "पपीता" | ✅ | `cues`: lit @0.9 s, re-lit @4.6 s; label marks **प + पी** |
| 52 | Final VO "हमने 'प' की आवाज़ सुनी… जैसे—प से पपीता।" | ⏳ | text in card; `vo_t2_prompt` re-record pending |

## I · New page 8 (was page 8 · G1) · **NEW BALLOON MECHANIC** — `capture 08`
| 119 | **SME r5c** — real balloon art, recoloured, element on top | ✅ | the balloon was drawn in CSS (a border-radius blob, a triangle knot, a blurred shine). The SME supplied one yellow balloon, measured at hue **49.3°**, cropped to body+knot (the long ribbon dropped, `.bal-tie` still draws the string) and installed as `assets/UI/balloon.png` 321×420. It rides a `::before` rather than `.bal-body` itself, because the per-balloon colour is a `hue-rotate` and a filter on `.bal-body` would tint the OBJECT PICTURE sitting on it. Rotations are computed from 49.3° to the six palette hues the mechanic already used. First attempt left a coloured RECTANGLE behind each balloon: the `bcol` rules set `background` at (0,3,0) and my reset was (0,2,0) |
| 120 | **SME r5c** — balloons rise from the bottom of the screen | ✅ | **the old entrance never ran.** `.balloon` carried `animation:balFloat` AND `transition:transform`, and an animation beats a transition on the same property, so `.seq-hidden{transform:translateY(46px)}` was dead code and the balloons only faded in. The float moves to a new `.bal-lift` wrapper and `.balloon` keeps the transform, so the rise works — measured `matrix(0.9,0,0,0.9,0,680)` where it used to compute to the float's own matrix. 680px clears a 600px `overflow:hidden` stage, so they enter from off-screen. `.popped` and `.bal-shake` stop fighting balFloat as a side effect |
| 121 | **SME r5d** — the balloon page becomes the last page | ✅ | order is now `T3 T4 T5 T6 T1 T2 G2 G3 G5 P1 P2 P4 P7 **G1** P8`, i.e. last activity before the celebration. `phase_distribution` re-derives to 6/3/6. **G1’s phase changes guided→practice** — the phase-transition gate fires on a phase BOUNDARY, so leaving it guided after four practice slides would have replayed the guided interstitial near the end. See **OPEN-16** |
| 122 | **SME r5f** — page 14 re-checked against the full deck spec | ✅ | walked all seven items against the built page. Already correct and left alone: the हाँ/नहीं activity is gone; `prompt_hi` is empty and `vo-only` strips the prompt band, hint chip and आगे so nothing is written on screen; balloons carry a picture and no label; the option set is exactly पतंग/पपीता/पत्ता/पानी against आम/केला/घर/मछली; tapping plays the object name first (`afterName`); correct = burst + sparkle + `vo_g1_correct`; 1st wrong = shake + buzz with `if(n < 2) return` so no voice; 2nd wrong = shake + `vo_g1_hint`. All three VO lines match the deck text verbatim |
| 123 | **SME r5f** — the hand nudge works again on this page | ✅ | r5d moved this page to the end and had to change its phase guided→practice, which silently killed the nudge: `HAND_PHASES` is tutorial+guided, so the deck's "if the learner continues to struggle, show a subtle hand nudge" could never fire — the code was there and unreachable. `handOnAnswer` gains an explicit `force` argument, opted into by `data.allow_hand` on this one slide, rather than widening the phase rule for the fleet. Still earned: it only fires on the THIRD wrong tap. Closes **OPEN-16** |
| 124 | **SME r5f** — balloons scatter instead of sitting in two rows | ✅ | the reference has them drifting at clearly different heights; a single even/odd 12px step still read as a grid. A four-step `nth-child` cycle (38/0/52/14px) gives each row of four its own rise and fall, and the second row inherits the cycle offset by its own count, so no two neighbours sit level. The 44px horizontal tap gap is unchanged |
| 125 | **SME r5g** — the last three balloon pictures are real art | ✅ | `obj_patta`, `obj_ghar`, `obj_machhli` had NEVER existed and fell back to 🍃 🏠 🐟 — and पत्ता is one of the four CORRECT answers. The SME’s sheet had the leaf and the house overlapping in x with no gutter (39px of ink at the narrowest column), so a vertical cut would have clipped one: separated by CONNECTED COMPONENTS on the alpha mask instead, each shape masked to its own label so no neighbour bleeds in. All eight balloons now carry real art. Closes **OPEN-17** |
| 126 | **SME r5g** — Swiftee holds the balloons and moves only while the VO speaks | ✅ | a GIF cannot be paused, so the animation and a still of its first frame are BOTH in the DOM and CSS swaps them on `body.vo-lock` — which `setPlaying()` holds for exactly as long as a clip sounds, so she needs no timer of ours and cannot drift. Measured: VO silent → still 1 / gif 0; VO playing → still 0 / gif 1. Placed bottom-left clear of the field (field measured at x=347 w=640, she lands x=27..239) |
| 127 | **SME r5g** — background matched to the reference | ✅ | the stage paints `var(--bg)` #F2F7FA, a grey-white; the reference is bluer. Now **#EAF2FB**, scoped to `.stage.vo-only` which ONLY this slide sets, so no other page shifts. Verified in the render as `rgb(234,242,251)`. If it is not exactly the SME’s value it is one hex |
| 128 | **SME r5h** — Swiftee is also the replay control | ✅ | the reference carries no audio chip and the deck lists what may be shown ("only the mascot, balloons, object images"), so the chip is hidden here. That would have taken the child’s only way to hear the instruction again, so the mascot who GIVES the instruction now answers to a tap. Guarded against replaying over a live clip or after the round is won |
| 129 | **SME r5i** — Swiftee no longer clipped | ✅ | she sat at x=27 with the stage edge at 0, so the left of her bunch met the boundary. Moved to x=95 and up 22px, and grown 226×228 to hold her weight against the bigger balloons |
| 130 | **SME r5i** — balloons bigger and higher | ✅ | the responsive rule below 1400px pinned them to **124px**; now **146px** with the body and picture scaled to match. The field loses its top padding, the scatter offsets drop from 38/0/52/14 to 24/0/34/10, and the 100px the stage reserves for an आगे button — dead space here, since this page has none — is reclaimed so the group centres. First balloon now 30px from the stage top |
| 131 | **SME r5i** — the balloon POPS instead of vanishing | ✅ | it ran `sfxCorrect()`, the generic ding, over a plain scale-down — which reads as a fade-out. `sfx_pop.ogg` already shipped (7.3KB) and this page had never used it; `playSfx` gives it its own channel so it lands ON the tap rather than queuing behind the object name. `balPop` now INFLATES to 1.36 before it goes, as a balloon does under pressure, and a white shockwave ring expands behind it. Verified on a simulated tap: `popped`, `.bal-ring` present, `.bal-sparkle` present, `balPop` running |
| 132 | **SME r5i** — the area outside the stage matches | ✅ | the stage is 1333×750 scaled to fit, so `body` shows around it on most screens — painting #F2F7FA against this page’s #EAF2FB, which read as a pale band down each side. `body` cannot be reached from a `.stage` descendant selector, so the module puts `bal-page` on body and the same teardown that removes `vo-only` takes it off. Verified: body computes rgb(234,242,251) |

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
| 67 | Options appear one by one after the instruction VO | ✅ | **[S01r4p] NEWLY BUILT — the earlier N/C was wrong.** The card has carried `reveal_seq` since round 4, but only `mountTapOptions` and `sortSeqReveal` ever read that flag; TAP_ALL_WITH_SOUND never did, so all four chips were on screen from mount, under the instruction VO. Now the same shape as mountTapOptions: prompt plays to COMPLETION, then each chip fades in speaking its own word, then taps open. Per-clip 4.5s fallback + 16s global net so an ungenerated clip cannot soft-lock. Measured: 2 of 4 chips still hidden at t=120ms. **Also fixes P1 and P7**, which carry the same flag |
| 68 | **4 options only** — correct पपीता/पतंग · incorrect केला/आम | ✅ | card-diff items 5→4. **[S01r4q] art no longer pending** — `obj_kela.png` + `obj_patang.png` cut from the SME's banana/kite/mango sheet, then **[S01r4r]** `obj_aam.png` replaced from the SME's `new_mango.png`, all trimmed to alpha and scaled to a 349px long edge. Source files parked in `_assets_round4/` rather than `assets/Images/`, so they are not shipped |
| 69 | Clear image + word label per option | ✅ | **[S01r4q/r4r]** all four render real PNGs in one illustration style. पतंग — one of the two CORRECT answers — had been falling back to the 🪁 emoji and केला to 🍌; आम now matches the same character art as the other three |
| 70 | Correct: positive highlight, stays marked, not re-selectable | ✅ | green card + ✓ badge, `.got` persists, and the handler returns early on an already-got chip — all pre-existing. **[S01r4p]** adds the deck's "small sparkle/tick animation" (the ✓ was STATIC). **[S01r4q]** the tick was then called out as "does not look good": a bare 40px green glyph on the corner with no ground of its own, sitting ON the picture. Now a filled green disc, white tick, white ring, hung just outside the corner |
| 71 | Wrong: shake + brief red + **do not remove the option** + hint VO | ✅ | shake + red were already there. **[S01r4q] the hint half is now RULED** — the SME asked to "play only this Hint VO", so a wrong tap plays the slide's own `hint` clip and nothing else: not the `try_again` rung the ladder used to open with, and not the tapped word's own clip either. `wrongClip` stays as the fallback for any slide with no hint authored. Lock-on-2nd-wrong still open, see **OPEN-3** |
| 72 | Hint VO "हर शब्द को ध्यान से देखो और सुनो…" | ⏳ | text in card; **[S01r4q] it is now the ONLY clip a wrong tap plays**. `vo_g2_hint.ogg` exists; re-record pending |
| 73 | "Keep the current hint logic… do not introduce a new hint flow." | N/C | untouched |
| 74 | Hand nudge on a remaining correct option after repeated wrongs; no auto-select | ✅ | **newly built** — this mechanic had no hand at all: appears after 2 wrongs, lands on a correct card, does not select it. **Re-checked r4q**: `HAND_PHASES` = tutorial+guided and this page is guided so it fires; `.nudge-hand` runs `nudgeMove 1s ease-in-out infinite`, the gentle pulse the deck asks for; it only points — the chip's own onclick is untouched |
| 109 | **SME r4q** — "remove 0/2" | ✅ | the `.tap-all-count` readout is off the screen; `found` and `need` still drive completion and the प badge keeps the row. Applies to the whole mechanic, so **P1 and P7 lose their counters too** |

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
| 84 | Options that clearly carry प or च | ✅ | पानी, पायल / चूहा, चाँदी — card-diff. *"मोती" is gone: it carried neither, so it could not belong in either basket.* **[S01r4s]** पानी / पायल / चाँदी re-cut from the SME's new sheet (349px long edge, source parked in `_assets_round4/`); चूहा keeps the round-4 mouse |
| 85 | Instruction + VO "हर चित्र का नाम सुनो…" | ✅ | capture 11 (clip re-record pending) |
| 86 | Picking an image plays its name | ✅ | **[S01r4s] NEWLY BUILT — the earlier N/C was wrong.** `makeDraggable` exposes `opts.onTap` for a tap and nothing for a grab, and this mechanic passed no opts at all, so the word was only ever spoken by the tray reveal and by an echo on a correct drop. A `pointerdown` listener now speaks on tap AND pick-up; the correct-drop echo is dropped. **[S01r4t]** it must NOT go through `play()`: that sets `body.vo-lock`, which the stylesheet turns into `pointer-events:none` on `.sort-item`, `.sort-bin` AND `.dd-zone` — so r4s made the tiles un-draggable outright. `speakNoLock()` plays the word on its own element (mute-aware, cancels the previous word) and never takes the lock |
| 87 | Correct drop settles; wrong drop shakes and returns | ✅ | **[S01r4s] half of this was not true either.** Correct: `.snapped` only removed the box-shadow, so a tile arrived in the basket with no beat of its own — it now scales up from .74 with a small overshoot. Wrong: only the BIN flashed red; the tile had no feedback at all. It now runs the same `buzzShake` the wrong-tap chips use, and `makeDraggable` was already clearing the transform on a rejected drop, so the return home was free |
| 88 | "Keep the existing hint logic exactly as it is." | N/C | untouched |
| 110 | **SME r4t** — baskets big enough to hold 2 pictures | ✅ | the basket carries BOTH `.sort-bin` and `.dd-zone` (the drop hook), and `.dd-zone{width:150px;height:150px}` is declared LATER at equal specificity, so it silently won: **measured 150px wide against a 116px tile**. The label wrapped to 3 lines and overflowed its fixed 56px title box (scrollHeight 100 vs clientHeight 56), and two pictures could never sit side by side. Sized on the combined selector `.sort-bin.dd-zone` so it beats `.dd-zone` without touching the drop hook. Now **320×252**, title overflow **0**, `.bin-items` **290×128** (was 0×0) — two tiles fit with room to spare |
| 111 | **SME r4u** — "increase the size so it feels draggable for kids" | ✅ | the tray tile was **116px carrying a 72px picture and a 16px label — smaller than the 150px drop zone it is dragged into**, which is backwards for a six-year-old's finger. Tray tile now **164×164** (picture 104px, label 22px) and the bottom edge is deepened so it reads as a physical thing to pick up. The SNAPPED tile is held at **124×124** on purpose so two still fit side by side in the 290px basket row (2×124 + 8 gap = 256). Measured: 4 tray tiles need 710px of a 1193px row, and bins + tray stack to 438px of a 494px stage. Shape sorts untouched — `.shape-sort .sort-item` is (0,2,0) and outranks these |
| 112 | **SME r4v** — "show how to drag, it feels confusing" | ✅ | `travelNudge` already animates the hand between two elements and its gate is `HAND_PHASES` (tutorial+guided), so this page qualified — it had simply never been called except from `terminalHold`, i.e. only as help EARNED by two wrong drops. Now opt-in on `data.drag_demo` (page 10 only). It travels to the **bins ROW**, whose centre is the midpoint BETWEEN the baskets, so the child is shown the GESTURE and not the ANSWER. Waits out the one-by-one reveal and the prompt VO, stops on the first press, never returns. Measured: hand armed at the first tile (x=346 for a tile centred at 394) travelling to x=667, the row centre |
| 113 | **SME r4x** — basket label as a pill on the top edge | ✅ | the label sat as a block INSIDE the basket. It is now lifted out of the flex flow and centred on the top border like a fieldset legend, which also hands the whole inside of the box to `.bin-items`. `.dd-zone` already sets `position:relative`, so no new stacking context. Measured: pill 223px inside a 320px basket, one line, not clipped |
| 114 | **SME r4x** — drag demo runs 3 times and goes INTO a box | ✅ | `travelNudge` looped `Infinity`, which is right for terminal help but makes a demo into wallpaper; it now takes an OPTIONAL loop count and puts the hand away on finish — `terminalHold` passes nothing and is unchanged. r4v aimed at the bins ROW so the demo could not reveal an answer, but the row's centre is the empty gap BETWEEN the boxes, so it read as "drag upwards into nothing". It now aims at the basket the first tile belongs in. Measured: iterations=3, travel from x=394 (tile) to x=485 (basket 0), not x=667 (the gap). **This reveals one of the four pairings** — see OPEN-14 |
| 115 | **SME r4y** — hand travels to the CENTRE of the box, hint and demo alike | ✅ | `travelNudge` used ONE helper for both ends of the journey, and that helper places the hand just BELOW an element — the right pose for POINTING AT a tile, since the fingertip is at the top of the hand image, but wrong for a box the picture goes INTO: the hand finished under the basket’s bottom edge and read as “drag PAST the box”. The destination now has its own helper, so the fix reaches `terminalHold`’s hint and the tile→zone travel on the match mechanics as well as page 10’s first-time demo. The START still points at the tile from below, because that end really is a “this one” gesture. Measured: fingertip lands at (485,152) against a basket centred (485,160) spanning y 34–286, i.e. inside the box; it used to land at y≈290, below it |
| 116 | **SME r4z** — a dropped picture centres on both axes | ✅ | X was already centred (`.bin-items` has `justify-content:center`); Y was not. `.bin-items` carried `align-content:flex-start` and no height of its own beyond `min-height:128px`, so inside a 252px basket the row was pinned to the TOP with every pixel of slack hanging below it. It now grows to fill the basket and centres its line, and the basket’s vertical padding is made symmetric so the centre of the content box is also the centre of the dashed box. Measured on a dropped tile: dx=0, dy=0, gap above 64px, gap below 64px |

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
| 117 | **SME r5a** — new चंपा and सपना art | ✅ | cut from the SME’s champa/sapna sheet, trimmed to alpha and scaled to a 349px long edge to match the other objects: `obj_champa` 349×266, `obj_sapna` 349×235. Source parked in `_assets_round4/` rather than `assets/Images/`, so it is not shipped. पानी and पायल on this page already carried the r4s art, so all four options now share one illustration style |

> ⚠️ This page has **no slide in the deck** — its entries come from `01_CHANGE_LIST.md` only. All of
> them are "keep", and nothing changed. See **OPEN-2**.

## O · New page 14 (was page 16 · P4) · pick the repeated sound — न — `capture 14`

| # | Change (verbatim) | Status | Proof |
|---|---|---|---|
| 99 | New sentence "नानी नई नाव लाई।", target sound **न** | ✅ | capture 14; card-diff `target_sound` प→न, `whole_audio` l4→l6 |
| 100 | Keep the instruction + VO | N/C | unchanged |
| 101 | Keep the sentence visible; **no word-by-word highlighting** | ✅ | no `teach_seq` on this slide — `sweep` shows 0 lit aksharas |
| 102 | 3 letters म/ल/न one at a time, each speaking; correct = **न** | ✅ | capture 14; `vo_snd_n` authored (new clip, regen pending) |
| 103 | "Keep the existing hint logic exactly the same." | ⛑ | `vo_p4_reveal` / `vo_p4_correct` were re-pointed प→न because they NAME the answer. **[r5b] the ladder is no longer untouched**: the `hint` key is dropped so the reveal can reach `vo_p4_reveal`, which it never could while a hint existed — the page had no way to state its own answer. Same call as page 9 (row 72 area); `vo_p4_hint` is now unused. See **OPEN-15** |
| 118 | **SME r5b** — give page 13 page 9’s treatment | ✅ | the SME: "page 9 and page 13 are almost similar, just content changes". P4 is the same `SENTENCE_SOUND` question as G3 and now carries the same four changes: `hide_replay` (no «फिर से सुनो» pill), `seq_say_whole` (the sentence plays itself before the letters), `fixed_order` (entry order pinned म → ल → न), and **the `hint` key dropped**. That last one was a live defect, not cosmetic: the reveal path speaks `audioFor("hint") || audioFor("reveal")`, so while a hint existed the reveal repeated "शब्द के अंत की आवाज़ नहीं…" and **this page never actually told the child the answer** (`vo_p4_reveal`, "शुरुआत में न की आवाज़ बार-बार आई।", was unreachable). `vo_p4_hint` is retired; `vo_p4_try` already carries the same "you heard the LAST sound" steer |

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
- **OPEN-3 · Page 9 — HALF RULED (r4q).** Item 4 said "Do not remove the option" while item 5 said
  "keep the current hint logic… do not introduce a completely new hint flow".
  **Settled:** the SME has since asked to "play only this Hint VO", so the ladder no longer opens with
  `try_again` — a wrong tap plays `vo_g2_hint` and nothing else.
  **Still open:** the card is still greyed-and-locked on the **2nd** wrong tap. It is never removed
  from the screen, only locked, which is why this was read as satisfying item 4 — but if "do not
  remove" was meant as "stays tappable forever", that lock has to go. One ruling settles it.
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

- **OPEN-13 · A FACTORY REBUILD SILENTLY REVERTS ENGINE WORK DONE IN THE REPO. HAPPENED TWICE.**
  `engine_local/app.js` and `style.css` in this repo are COPIES; `_HOW_TO_REBUILD.md` names the
  factory at `D:\Dev_Kit\factories\FLN_Content_Factory\` as the source of truth. Any engine edit
  made in the repo is one rebuild away from vanishing, and it vanishes QUIETLY because the build
  still succeeds and the card data survives — only the behaviour disappears.
    - **1st: `9934644`** ("Page 9 (G3)…") re-added `tap-all-count`/`setCount` and deleted every
      `[S01r4q]` block — the whole of page 8. Restored in r4w.
    - **2nd: `3bd7209`** ("Install the applicable subset of fln-animation-toolkit") removed
      `speakNoLock`, `sort-shake`, `tap-seq-hidden` and 79 lines of CSS across three blocks — the
      whole of page 10 (`r4s r4t r4u r4v r4x r4y r4z`) plus page 8 again. Both commits also deleted
      `dist/assets/Images/obj_kela.png` and `obj_patang.png`. Restored in r5e.
  Neither was a force-push and neither merge conflicted: the regenerated files simply replaced the
  edited ones, so git saw an ordinary change.
  **The fix is procedural and belongs to whoever runs the rebuild.** Pick one:
  (a) land repo-side engine edits into the factory tree BEFORE rebuilding; (b) rebuild FROM the repo
  copy; or (c) stop committing regenerated `engine_local/*` unless the engine itself changed.
  A cheap detector: grep the built monolith for the `[S01r4*]`/`[S01r5*]` markers before pushing —
  every engine change this round carries one, and a missing marker means a silent revert.
- **OPEN-14 · The page-10 drag demo now shows one correct pairing.** The SME asked twice for a
  how-to-drag demo ("it feels confusing", then "show the hand going towards the box"). Pointing at
  the gap BETWEEN the baskets satisfied the no-reveal rule but did not read as a drop, so the hand
  now travels into the basket the first tray tile belongs in. Two consequences to rule on:
  (a) it tells the child one of the four answers before they start — the other three are untouched
  and every drop is still made by the child; (b) [28f] grants a hand in GUIDED only after 2 failed
  attempts, and this one arrives unearned. It is opt-in per slide (`data.drag_demo`), stops after 3
  passes and on the first press, so reverting is a one-line card change if the SME prefers.
- **OPEN-15 · Two authored hint clips are now unused.** `vo_g3_hint` (r4p) and `vo_p4_hint` (r5b)
  were both dropped from their cards so the REVEAL could reach `vo_*_reveal`: the engine speaks
  `audioFor("hint") || audioFor("reveal") || …` at the reveal, so any authored hint silently
  swallowed the reveal line and the page could never state its own answer. Both pages now run the
  deck's two rungs (try_again, then reveal). The clips still exist in `assets/Audio/` and in
  `audio_text`; if the SME wants a genuine third rung, the fix is in the engine - give the reveal
  its own lookup instead of sharing the hint one - not in the cards.
- **OPEN-16 · CLOSED (r5f).** Moving the balloon page to the end forced its phase to `practice`,
  which killed the hand nudge because `HAND_PHASES` is tutorial+guided. Resolved without touching
  the fleet rule: `handOnAnswer` takes an explicit `force` argument that only this slide opts into,
  via `data.allow_hand`. The nudge is still earned - third wrong tap - and every other mechanic
  keeps the phase gate exactly as [28f] and [28j] wrote it.
- **OPEN-17 · CLOSED (r5g).** `obj_patta`, `obj_ghar` and `obj_machhli` now exist, cut from the
  SME’s sheet by connected-component separation (the leaf and house overlapped in x). All eight
  balloons carry real art, and the mascot-holding-balloons the reference shows is in as a GIF.
- **OPEN-18 · The balloon page no longer shows an audio chip.** The reference screen has none and
  the deck lists what may be visible, so it is hidden on this slide only. Replay moved onto Swiftee
  herself — a tap on the mascot replays the instruction. It is a discoverable affordance for an
  adult but not an obvious one for a six-year-old, and no VO says "tap me". If the SME would rather
  keep the chip, deleting one CSS line restores it.
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
| radish `obj_muli` | **final** — supplied by the SME, installed r4l as-is (clean alpha, framing already matched) |
| `sfx_kanv` crow call | **final** — SME recording, trimmed to one 0.57 s call (r4d) |
| Everything else (73 clips, 14 pictures, all UI) | final, unchanged, untouched by this round |


---

# Round 5c — the 9 unvoiced clips generated, and page 14's letter reveal made bare

**Ask:** *"if its correct then go ahead and generate the VOs that will be needed in this project"*
(after confirming the Gemini key in `.env` was added correctly — it was).

## What was generated

Nine `vo_*` ids were referenced by the card but had **no file on disk**, so five pages played
silence where a clip was expected. All nine now exist, generated with **voice `Kore`, `.ogg`** —
the voice `_assets_round4/GENERATE_ASSETS.md` pins for this lesson, so the new clips match the
existing 65 rather than introducing a second narrator.

| Clip | Text | Heard on |
|---|---|---|
| `vo_line_l6` | नानी नई नाव लाई। | page 14 sentence |
| `vo_snd_n` | न से नाव। | page 14 `audio.target` |
| `vo_w_chand` | चाँद | pages 12, 14 |
| `vo_w_chinti` | चींटी | pages 10, 12 |
| `vo_w_ghar` | घर | page 13 (balloons) |
| `vo_w_kela` | केला | pages 7, 13 |
| `vo_w_machhli` | मछली | page 13 |
| `vo_w_patang` | पतंग | pages 7, 13 |
| `vo_w_patta` | पत्ता | page 13 |

`gen_tts` skips existing files by default and was run **without `--force`**, so the 56 clips already
on disk — including the bare `vo_snd_ch/l/r` the SME signed off on for page 9 — were not touched.

### Two clips needed hand-work
- **`vo_w_ghar`** ("घर") was the one clip `gen_tts` could not produce: it exhausted the whole refuser
  ladder (every rung returned HTTP 200 with no audio). Recovered by wrapping the word in an English
  instruction the Hindi voice does not speak — 0.93 s, one clean burst, matching its siblings.
- **`vo_w_patang`** came back from the wrapper fallback at 1.61 s with **two** speech bursts where
  its siblings are ~0.95 s and one. Replaced with a plain-prompt take: 1.09 s, single burst.

### How each clip was checked
Open transcription is unreliable for isolated Hindi words — as a control, it misread **3 of 10
clips that are already shipped and approved**. So every clip was verified by **forced choice**
instead (identify the word from a list of ten). That method scored **5/5 on the same controls open
transcription failed**, and **every** new clip identified correctly.

## Page 14's letter reveal now plays bare sounds (SME ruling, carried over from page 9)

Page 14 (`P4`) runs the **same one-by-one letter reveal as page 9** (`seq_say_whole` +
`fixed_order`). Page 9 was fixed earlier on the SME's instruction — *"play only these च, ल, र
sound not more than that, currently it plays ल से लट्टू, र से रस्सी, which should not happen"* —
by cutting `vo_snd_ch/l/r` down to the bare akshara.

Page 14 was still pointing its म and न options at the **full carrier phrases**: `vo_snd_m` is
2.17 s of "म से मछली।". Generating `vo_snd_n` as written ("न से नाव।") and leaving it wired there
would have reproduced the exact behaviour the SME rejected, on a new page.

So two bare clips were added **for the reveal only**:

| New id | Source | Length |
|---|---|---|
| `vo_ltr_m` | the leading म cut from `vo_snd_m` | 0.39 s |
| `vo_ltr_n` | synthesised bare न, silence-trimmed | 0.43 s |

(0.38–0.41 s is exactly the length of the approved `vo_snd_ch/l/r`.) No trim of `vo_snd_n` gave a
recognisable न — every window read as च or ट — which is why that one is synthesised rather than cut.

`vo_snd_m` **keeps** its carrier phrase: page 3 genuinely teaches "म से मछली", and only page 14's
option was changed. The whole card diff against the last commit is 6 lines:

```
+ /assets/audio/vo_ltr_m, /assets/audio/vo_ltr_n
+ /assets/audio_text/vo_ltr_m = "म", /assets/audio_text/vo_ltr_n = "न"
~ /slides[10]/data/options[0]/audio  vo_snd_m -> vo_ltr_m
~ /slides[10]/data/options[2]/audio  vo_snd_n -> vo_ltr_n
```

## Receipt

- **`Voice-over: all 67 lines have real audio — OK`.** This was the standing FAIL; it is cleared on
  both `build/` and `dist/`.
- `dist/` re-cut: **9.84 MB**, under the 10 MB cap, `missing none`.
- The remaining `dist` FAIL — *"Engine UI assets: `start_mascot.png`, `start_btn.png`"* — is a
  **checker artifact, not a defect**: this isolated engine references `start_mascot.**webp**`
  (which ships) behind an `onerror` fallback, and does not reference `start_btn` at all.
- No page was recaptured: this round changed **audio ids only**, so every shot is unchanged.

## Still outstanding

1. **A human has not heard any of these 11 clips.** Forced-choice identification proves the right
   word was said; it does not judge warmth, pace or child-appropriateness.
2. **Page 1 vs pages 3 and 5 are inconsistent.** Page 1's teach step plays the bare `vo_snd_ch`
   (0.38 s) while pages 3 and 5 play full carrier phrases (`vo_snd_m` 2.17 s, `vo_snd_p` 1.57 s) —
   a side effect of the page-9 trim, since page 1 shares that id. **Not changed here**: the SME
   asked for bare sounds on the letter-reveal pages, not on the teach pages, and changing what
   page 1 says is their call, not mine.

## Closed since the VO round

### The crow SFX was already delivered — that item was stale

This list carried *"the काँव-काँव crow SFX for page 1 is still not delivered"* from an earlier
round, and it contradicted **row 13** and the asset table in this same document. The recording
landed in **r4d**: an SME-supplied 10.8 s source, cut to the one clean isolated call at
1.34–1.90 s. Re-verified on disk — `sfx_kanv.ogg` is 0.57 s, and the cut matches a burst the
source really has at 1.366–1.793 s. It ships in `build/` and `dist/` and is wired to the landing
hero (`picture_sfx`). Nothing to do; the line is removed and the build script's stale
`SFX_TO_RECORD` comment ("until one lands the landing simply stays silent") is corrected.

### The regeneration hazard is now caught by the build

The hazard was real and is unchanged in nature: `vo_snd_ch/l/r` hold a *bare* akshara
(0.38–0.41 s) while their `audio_text` still reads the carrier phrase, because that text doubles
as the human VO team's recording script. `gen_tts --force` would rebuild them from that text as
1.4–2.2 s phrases and silently undo the SME's page-9 ruling.

Documenting it did not prevent it, because nothing downstream can see it: the ids still resolve,
the clips still play, and the receipt's *"all 67 lines have real audio"* row counts files rather
than listening to them. So the build now **measures** the clips instead of trusting the text —
`check_bare_sounds()` in `build_skill_HI02H11_L01_S01.py`, run straight after `build_bundle`:

| | |
|---|---|
| Guarded ids | `vo_snd_ch`, `vo_snd_l`, `vo_snd_r`, `vo_ltr_m`, `vo_ltr_n` |
| Threshold | **0.8 s** — bare aksharas run 0.38–0.43 s, carriers 1.41–2.17 s, so it sits in open space between them |
| On regression | the build **fails** with the offending ids, their lengths, and the fix (restore from git, re-run `gen_tts` *without* `--force`) |

The length reader is stdlib-only — ffprobe is not on the build path — and handles both containers
that occur here, since `gen_tts` writes **RIFF/WAV under an `.ogg` name** and only the dist step
re-encodes to real Opus. It was checked against ffprobe across all **123** clips in `build/`:
worst disagreement **33 ms**, and the only files it declines to read are the three `.mp3`s, where
it returns "cannot tell" rather than a wrong number. Verified to pass on `build/` and `dist/` as
they stand, and to fail on a simulated `--force` regression.

> **Not a defect, but worth knowing:** `build/assets/Audio` is 16 MB because 106 of its 123 clips
> are uncompressed WAV carrying an `.ogg` extension. `dist/` re-encodes all 77 it ships to genuine
> Ogg/Opus and comes to 0.85 MB, so this never reaches a child's device. Browsers sniff content
> rather than trusting the extension, so `build/` plays correctly too.

---

# r5e — the lesson was still speaking its round-3 voice-over

**Reported by ear**, 2026-09-17: *"it still playing the same old VOs"*. Correct, on 20 of 67 lines.

## What happened

Round 4 rewrote 20 VO lines. `_assets_round4/regen_ids.txt` lists them under
*"RE-RECORD (20) — the file on disk is the OLD line and will be overwritten"*, with the full
old→new text for each.

They were never overwritten. `gen_tts.py` skips any id whose file already exists —

```python
if os.path.exists(out) and not a.force: print(f"[{aid}] skip (exists)")
```

— which is the right default for **resuming a rate-limited run**, but wrong for a **re-record**,
because a re-record already has a file: the old take. The r5d run was made deliberately *without*
`--force` to protect the 56 approved clips, and in doing so it skipped all 20 re-records. The
runbook's own command was missing `--force` too, so the error was waiting to be made.

**Nothing caught it.** The receipt's *"all 67 lines have real audio — OK"* row counts FILES. A file
was present for every id; it simply said the round-3 line. The round then reported the voice-over
FAIL as cleared, which was true of the 9 genuinely missing clips and false of these 20.

### How it was confirmed before anything was regenerated

`vo_landing` settles it arithmetically. The card's text is **176 characters / 33 words**; the file
on disk was **6.41 s**. At the ~14 Devanagari chars/sec these voices actually run, that line needs
**≈12.6 s** — fitting it into 6.41 s would require 5.1 words/sec, about double a narration pace for
a five-year-old. The old 18-word line fits 6.41 s comfortably. Measured against the generator's own
`min_pcm_bytes` floor, `vo_landing` was **below** the minimum length that could contain its line.

Regenerated, it is **14.97 s** — the first time the file has ever held the sentence the card
claims. Across all 20, duration moved in the direction the text changed in every case where the two
texts differ in length.

## Fixed

| | |
|---|---|
| Re-recorded | the **20** ids in `regen_ids.txt`, `gen_tts --force --only <id>` per id, voice **Kore**, `.ogg` |
| Also fixed | **`vo_p1_try`** — a PARTIAL take (see below) |
| Rebuilt | card + HTML **byte-identical** (`a7f50b58…`) — this round changed audio bytes only |
| `dist/` | 20+1 clips re-encoded, Opus **32k mono** (settings confirmed byte-exact against three untouched clips) → **9.92 MB**, under the 10 MB cap |

### `vo_p1_try` was speaking a third of its line

Found while sweeping *every* clip, not just the 20. It held **1.45 s** for a 58-character line
needing **≥2.28 s**; its near-twin `vo_p7_try` (53 chars, same shape) runs 3.97 s. This is the
**partial take** `min_pcm_bytes` was written to catch — the model obeys a trailing imperative
("एक बार फिर सुनो।") and speaks only part of the sentence. It predates that check, so nothing ever
measured it. Regenerated: **4.33 s**.

## The build now measures clips instead of counting them

`check_clip_lengths()` runs after `build_bundle` and fails the build if any clip is too short to
contain the line the card says it speaks. The floor is gen_tts's own rule (~14 chars/sec, required
at 55%) — deliberately generous, so a failure is a real defect and never a judgement call.

Run against the tree **as the reviewer heard it** (git `HEAD`), it fails with exactly the two
defects this round fixed:

```
CLIP TOO SHORT FOR ITS LINE — 2 clip(s):
          vo_landing = 6.41s (needs >=6.91s for 176 chars)
          vo_p1_try  = 1.45s (needs >=2.28s for 58 chars)
```

It cannot catch a stale clip whose replacement text happens to be a similar length — no automated
check can. It does catch every case where the text grew, and every partial take.

`_assets_round4/GENERATE_ASSETS.md` step 2 is corrected: it was missing `--force`, **and** it piped
a comma list into `--only`, which takes a single id (`ids = [a.only]`) and would have exited with
*"audio_id(s) not in card audio_text"*.

## Still needs a human

1. **Nobody has heard these 21 clips.** Length proves a clip is long enough to hold its line; it
   does not prove the words are right, nor judge warmth or pace.
2. **Two came back through the refuser ladder** and may differ in timbre — flag for the ear-check:
   **`vo_g1_hint`** (recovered via `danda`) and **`vo_p1_try`** (recovered via `wrapped(Kore)`).
3. **`vo_g5_try`** is not fixed and not certainly broken: 2.05 s against a 3.21 s expectation, so it
   clears the floor but sits low. It was left alone rather than regenerated, because re-rolling a
   clip that may be fine is itself an unrequested change. Worth an ear.
4. **`dist/` has ~80 KB of headroom** under the 10 MB cap (9.92 MB, up from 9.84 MB — the new
   `vo_landing` is 8.5 s longer). The next audio addition may need a lower Opus bitrate.

---

# r5f — the rest of the stale voice-over, and the highlighting that ran ahead of it

Three reports, all confirmed: *"there are still many places where you used the old VOs"*, *"the VO of
चाँद does not feel right"*, and *"the highlighting of letter and word does not sync with the VOs"*.

## 1 · The delivery and the factory held DIFFERENT audio

`build/` in this handover and `KG/HI02H11_L01_S01/` in the factory had **40 clips that were not the
same file**. r5e had verified that `card.json`, the recipe and `app.js` matched across the two, and
stopped there — it never compared the audio. So r5e regenerated into the factory, and the player
opened `build/`.

All 40 of `build/`'s versions **match git `HEAD`**; none of the factory's do. The factory's were
written 2026-09-17 13:15, after r5d's commit at 13:06, by a run nobody recorded — and one of them
was **broken**: `vo_snd_m` said *"मासी मछली"* instead of *"म से मछली"*. Two others (`vo_ltr_m`,
`vo_ltr_n`) no longer matched the lengths CHANGES.md records for them.

The reviewed, committed audio in `build/` was therefore treated as authoritative and copied back
over the factory. All 120 clips are now identical in `build/`, `dist/` and both factory trees.

## 2 · Four more clips were missing words — the model was obeying them

Found by transcribing every clip back and comparing with the line the card says it speaks. Four
came back short, and re-running `gen_tts` did **not** fix them, which is what identified the cause:
these are not stale takes, they are **partial** ones. The model treats an imperative as an
instruction and declines to voice it — the failure `min_pcm_bytes` was written for.

| Clip | Was heard as | Missing |
|---|---|---|
| `vo_g5_try` | "यह टोकरी सही नहीं है।" | the whole second sentence, "शब्द की आवाज़ फिर सुनो।" |
| `vo_g2_reveal` | "इसमें प की आवाज़ है।" | the opening "सुनो —" |
| `vo_p1_reveal` | "इसमें म की आवाज़ है।" | the opening "सुनो —" |
| `vo_p7_reveal` | "इसमें च की आवाज़ है।" | the opening "सुनो —" |

They slipped past every check because a partial take is **padded with silence**: `vo_g5_try` was
3.49s long with only 1.54s of speech. Duration looked right; the words were not there.

So they were re-synthesised judging each take on **speech time measured with silence detection**,
not on file size, climbing the refuser ladder until a take actually contained the line.
`vo_g2_reveal` needed `wrapped-lesson(Kore)` and `vo_p7_reveal` needed `wrapped(Kore)`; the plain
and danda rungs both returned the truncated version. All four now transcribe complete.

## 3 · चाँद, and the clips that only looked wrong

`vo_w_chand` was re-recorded as asked (it came back through the `wrapped-lesson(Kore)` rung — **ear-check it**).

The transcription sweep also flagged nine single-word clips, and they turned out to be **fine**:
open transcription is unreliable for an isolated Hindi word, which this bundle already knew. Under
**forced choice** — the method r5d validated at 5/5 on approved controls — 16 of 17 identified
correctly on two independent shuffles. The one holdout, `vo_w_aam`, identified as आम **3/3** once
the options included near-neighbours (आ, नाम, काम, शाम); against the lesson's own word list, which
contains nothing that rhymes with it, the model had simply been guessing. No defect.

`vo_snd_ch/l/r` and `vo_ltr_m/n` still read as mismatches and still **should** — their text is the
carrier-phrase placeholder and their audio is the bare akshara, by the SME's page-9 ruling.

## 4 · Why the highlighting ran ahead of the voice

Two independent causes, both fixed in `engine_local/app.js`.

**The walk did not know about pauses.** `karaokePlay` spreads a line's tokens across the clip in
proportion to akshara weight, which assumes the voice speaks continuously. `vo_landing` is 14.97s
of which only **11.21s is speech** — the other 3.76s is the pauses at its four dandas and its
em-dash. Wall-clock ran through those pauses while the walk kept advancing.

The build now measures when each clip is actually sounding (`speech_map()` → `assets.audio_speech`,
64 clips described) and the walk is driven by **speech elapsed**: it advances while the voice
sounds and holds still through a pause. Measured in isolation this is worth **0.3–0.4s** — real,
but smaller than it first looks, because evenly-spread pauses largely cancel.

**A cue was landing on the wrong word.** The bigger error. The spoken script reads
"…है। **सुनो—काला** कौआ…", and whitespace tokenising glues `सुनो—काला` into ONE token — so the hero
word काला was cued at the onset of **सुनो**. Tokens are now split after an em-dash, so each cue
lands on the word it names. Where the cued word already starts its token (`चबाए—इन`), nothing
changes.

Net effect on the landing, simulated against the real clip and card:

| cue | was | now | shift |
|---|---|---|---|
| काला | 7.87s | 8.54s | +0.67s |
| क (all क light) | 11.61s | 12.03s | +0.43s |
| ध्वनि (crow) | 11.97s | 12.30s | +0.33s |

Both fixes are in `karaokePlay` itself, so all four highlighting paths inherit them: the landing
hero, the MEET_LETTER reveal, and both SENTENCE_SOUND beats.

**The limit, stated plainly.** There is still no forced aligner in this toolchain. Within a run of
speech the walk is still proportional, so a word spoken unusually slowly can still drift. What is
fixed is that the marking no longer advances through silence, and no longer fires on a neighbouring
word. Exact word-level sync would need an aligner.

## 5 · A third guard

`check_speech_map()` fails the build if the card's speech map does not describe the audio beside it
— segments that overlap, do not advance, or run past the end of the clip. That is the cheap symptom
of the §1 drift: a card measured against audio the player will never hear. All three guards now run
after every build and pass on `build/` and `dist/`.

## Receipt

- **27 clips** regenerated this session (20 r4 re-records, `vo_p1_try`, `vo_g5_try`, three reveals,
  `vo_w_aam`, `vo_w_chand`), **40** restored from the committed audio
- All 120 audio files identical across `build/`, `dist/` and both factory trees
- `dist/` **9.96 MB**, under the 10 MB cap — but only ~40 KB of headroom left
- Every sentence-length clip transcribes at **≥90%** against its card text; the remainder are the
  five bare-by-design ids and single words cleared by forced choice

## Still needs a human ear

1. **Nobody has heard any of the 27 clips.** Transcription proves the words; it does not judge
   warmth, pace or child-appropriateness.
2. **Five came back through the refuser ladder** and may differ in timbre — `vo_g1_hint` (danda),
   `vo_p1_try` (wrapped), `vo_w_chand` (wrapped-lesson), `vo_g2_reveal` (wrapped-lesson),
   `vo_p7_reveal` (wrapped).
3. **The sync fix has not been watched in a browser.** It is verified by simulation against the
   real clip and card, not by eye on the running lesson.
4. **`dist/` is ~40 KB under the cap.** The next audio change will likely need a lower Opus bitrate.

---

# r5g — page 8's VO overlap, page 13's layout, and three word clips

Five asks. Page numbers below are the **player's** order (the 14-slide card), which is how they were
reported; the internal slide ids are given alongside because `card.json` still uses those.

## 1 · "Page 8 — there is a mix up of VO in the whole page" — a timeout, not a wiring error

Page 8 (`G3`) reveals its three letter options one at a time, and the chain is **strictly
sequenced**: the prompt plays to completion, then the sentence, then each option. Each step carries
a fallback timer so a missing or blocked clip can never stall the page —

```js
fb = setTimeout(go, 4500);      // safety net: never stall on one clip
```

— and that flat 4500 ms silently assumes **every clip is shorter than 4.5 s**. `vo_g3_prompt` is
**5.05 s**. So on this page the net fired while the prompt was still speaking: the chain advanced,
`play()` stopped the prompt mid-word, and the sentence started over it. Everything after that landed
early too. That is the mix-up.

**Page 11 (`P4`) has the identical defect** — `vo_p4_prompt` is also 5.05 s. It was not reported, but
it is the same line of code and is fixed with it. A sweep of every `reveal_seq` chain found these two
and no others.

The build now writes each clip's real length to `assets.audio_dur` (76 ids) and the net is sized to
the clip — `max(4500, duration + 1500ms)`, so 6550 ms for those two prompts and no change anywhere
else. All three copies of that timer are fixed (`mountTapOptions`, `sortSeqReveal`, and
SENTENCE_SOUND's own chip reveal). The **global** backstop that sits behind those per-clip nets was a
flat 16000/22000 ms, which a raised per-clip net could have outlived — it is now computed from the
chain it is actually backing (`_chainNetMs`), keeping the old value as a floor.

## 2 · Page 13 layout (`G1`, the balloon page)

| Ask | Change |
|---|---|
| balloons a little bigger | `.balloon` **150 → 164px** (and the `≤1400px` `.vo-only` rule **146 → 160px**), body and object art in proportion |
| balloons a little higher | the field is vertically centred, so the stage now reserves more below it: `.stage.vo-only .slide-stage` padding-bottom **26 → 96px**, lifting the group **~35px** |
| Swiftie a little bigger | `.bal-swiftee` **226×228 → 248×250px** |

Two knock-on adjustments were needed, both arithmetic rather than taste:

- **Four balloons per row had only 8px of slack.** The field caps its width so exactly four fit and
  five cannot (the comment on `.balloon-field` records a past 3/3/2 break). At 164px, four no longer
  fitted. The column gap goes **44 → 34px** and the cap **820 → 838px**: four now need 758px against
  758px of content, and five need 956px, so the 4-per-row set is preserved at both sizes.
- **Swiftie grows down and right from a fixed corner.** The field centres on the 1333px stage, so at
  838px it starts at x=247.5. `left` moves **-252 → -240px** to keep her on-stage (x=7.5) with
  **32px** of clearance to the first balloon, and `top` **344 → 322px** so that growing 22px taller
  keeps her feet on the same line instead of pushing them into the stage edge.

Verified by headless capture at 1333×750, not only by arithmetic: four per row, both rows clear,
Swiftie clear of the balloons and inside the stage.

## 3 · The question text sat too far right

`--band-pad-l` **150 → 120px**, a 20% cut to the inset, moving the question text 30px left in the
pill on every page that uses it. It still clears Swiftie's avatar (text now starts at x≈196, the
avatar ends at x≈160).

## 4 · आम, मछली and घर

All three re-synthesised. Checked by **forced choice against deliberately confusable options** —
including `आ` for आम, so a clipped final consonant could not pass:

| Clip | Identified as (3 shuffles) |
|---|---|
| `vo_w_aam` | आम / आम / आम |
| `vo_w_ghar` | घर / घर / घर |
| `vo_w_machhli` | मछली / मछलि / मछली — the odd one differs only in final vowel length, i.e. ASR noise |

`vo_w_ghar` again refused the plain rung and came back on `wrapped-lesson(Kore)` — **ear-check it**.

## Receipt

- All three guards pass on `build/` and `dist/`; all 120 audio files and the HTML identical across
  `build/`, `dist/` and both factory trees
- No clip in any `reveal_seq` chain can now outlive its own safety net
- `dist/` **9.97 MB** as it sits, but `card.json`, `ENGINE_DIFF.patch` and `_build_report.json`
  (92 KB) are dropped before zipping, so the **shippable payload is 9.87 MB — 126 KB under the cap**

## Still needs a human

1. **The page-8 fix cannot be seen in a screenshot** — it is a timing fault. It is verified by
   arithmetic (5.05s clip vs a 6550ms net) and by the sweep finding no remaining over-long clip, but
   somebody should play pages 8 and 11 and hear the prompt finish before the sentence starts.
2. **`vo_w_ghar`** came back through a wrapper rung and may differ in timbre.
3. **The layout changes were captured with animation frozen**, which is how the capture tool works;
   the balloons' float animation was not observed at the new size.

---

# r5h — the क lights word by word, and the balloon words stop being buried

## 1 · The cover: each word's क lights as that word is spoken

The landing already revealed the four words one at a time against the greeting. The **highlight**
did not follow them: a single `light` cue removed `.lh-dim` from the whole strip, so all four क lit
together — and that cue is anchored to the standalone «क» in the LAST sentence
("इस वाक्य में **क** की ध्वनि…"), several seconds after the line the SME was watching.

The beat is now **per word**: each word's own क lights on the token the voice is speaking, so काला
कौआ काँव-काँव करता lights left to right under the narration.

- `app.js` — a word cue now adds `lh-lit` alongside `lh-in`.
- `style.css` — two rules let ONE word light while the strip as a whole is still dim. They carry one
  class more than the two `.lh-strip.lh-dim` rules above them, so they win on specificity without
  `!important`.

The old whole-strip `light` cue is deliberately **left in place** as a catch-all. On a normal run
every word is already lit by the time it fires, so it changes nothing; when there is no audio at all
(autoplay refused, missing clip, a capture tool freezing the page) `finish()` runs every cue and the
cover still resolves to the finished, fully-lit sentence.

Verified in headless Chrome by polling the DOM, not by screenshot — a static capture cannot show
sequencing:

```
  t(s)   lit words     (X = that word's क is lit)
   8.9   X...          काला
   9.2   XX..          कौआ
   9.6   XXX.          काँव-काँव
  10.3   XXXX          करता।
```

## 2 · "The machli sound is not coming properly" — it was never the clip

मछली was re-recorded twice across r5g and this round and kept being reported. It was the wrong
thing to fix. The clip is fine; **the buzzer was sitting on top of it.**

`sfxCorrect` / `sfxWrongSoft` / `playSfx` each ride their **own** `Audio` element, so `play()`'s
`stopAudio()` cannot see them. On a balloon tap the feedback sound and the object's name were
started in the same breath, and the feedback sound is the longer of the two:

| clip | leading silence | speech | how much of it the 0.72s buzzer covered |
|---|---|---|---|
| `vo_w_aam` | 0.26s | 0.35s | **100%** |
| `vo_w_machhli` | 0.27s | 0.54s | **85%** |
| `vo_w_ghar` | 0.28s | 0.56s | **80%** |
| `vo_w_kela` | 0.29s | 0.47s | **92%** |

That is exactly the set the SME reported — आम, घर and मछली are three of the page's four wrong
answers, and they are the three most heavily covered. The correct answers were masked too, by the
0.85s `sfx_correct` ding.

The object's name now waits for the effect to finish (`_sfxHoldMs`, sized from the card's
`assets.audio_dur`): **780ms** on a wrong tap, **910ms** on a correct one. The pop and the ding still
land ON the tap, which is what the earlier rounds asked for — only the spoken word moves.

`sfx_bal_pop` also had to be **declared in the card**. It ships and the page plays it, but it was
referenced only from engine code, so it had no `audio_dur` entry for the hold to read.

Measured in a real browser, logging every `Audio` the page creates:

```
tap मछली (wrong)     +   2ms  sfx_wrong.ogg        tap पतंग (correct)   +   3ms  sfx_bal_pop.ogg
                     + 789ms  vo_w_machhli.ogg                          +   3ms  sfx_correct.ogg
                                                                        + 916ms  vo_w_patang.ogg
                                                                        +2078ms  vo_g1_correct.ogg
```

`busy` is already held for the whole wait, so a second tap cannot land in the gap; the tap's
fail-safe timer goes 4000 → 5600ms to cover the hold.

## Receipt

- All three guards pass on `build/` and `dist/`; HTML and all 121 audio files identical across
  `build/`, `dist/` and both factory trees
- Shippable dist payload **9.87 MB**, 123 KB under the cap
- मछली was re-scored by forced choice against confusable spellings (मछलि, बछली, मसली, मचली, मक्खी,
  बछड़ी) across five fresh takes — all five identified 3/3, which is itself the evidence that the
  clip was never the problem

## Still needs a human

1. **Nobody has heard the balloon page since the hold was added.** The order is proven; whether a
   ~0.8s gap between the buzz and the word feels right to a five-year-old is a judgement call, and
   it is one line (`_sfxHoldMs`) to retune.
2. **The cover was verified with the DOM, not by ear.** The words light one at a time against the
   clip's own timeline, but nobody has watched it next to the narration.
3. `vo_w_ghar` still carries the `wrapped-lesson(Kore)` timbre from r5g.

---

# r5i — balloons higher, the cover text off the border, and मछली by a different method

## 1 · The balloon page: the lever from r5g had stopped working

r5g lifted the group by reserving more space under it (`padding-bottom` 26 → 96px), because the
field is vertically centred in what the stage leaves. Asked to lift it again, raising that value to
156px **moved nothing**, and measuring the running page said why:

```
.slide-stage content box   438px      the field is TALLER than the box it is centred in,
.balloon-field             542px      so there is no free space for align-content:center to
                                      share out - the field just starts at the top and overflows
```

The field grew past its container when the balloons went to 164px in r5g. So the lift now comes
from a **negative top margin** (`-50px`), which works regardless of overflow. Measured: the field
sat 156px below the stage top and only 52px above its bottom; it is now even.

That in turn needed `overflow:visible` on this page's `.slide-stage`. It clips at y=175 and the
lifted balloons sit at y=160, with `balFloat` raising them another **13px** at its peak — the first
capture after the lift showed the top row cut by a visible seam. The 150px band above the slide is
**empty on this page** (prompt band, hint button and audio chip are all `display:none` under
`.vo-only`), and `.stage` still clips, so nothing can escape the card. Scoped to `.vo-only`; every
other page keeps its clip.

`padding-bottom` goes back to r5g's 96px — leaving it at 156 would read as a lever that works.

## 2 · The cover: the sentence was over the card's edge, not just near it

Measured on the running cover: the sentence sat **5px** below the card's top border and the content
block actually started **6px ABOVE** it, while 115px of the card went unused underneath.

`.sg-content` is centred in `.sg-card` by its margin box, so its bottom margin is the lever:
120 → **60px**, which moves the block down 30px. The sentence now sits **39px** clear of the border.

That exposed a second problem the first fix caused: the crow landed **11px on top of** the शुरू करें
button, because `.sg-btn` is `position:absolute` and does not move with the block. Solving the
geometry showed the block cannot fit above the button at its current height at all — it needs to be
≤317px and it is 347px. Rather than shrink the crow, which nobody asked to change, the room comes
from the **40px of unused card sitting under the button**: the button drops to `bottom:16px`, and the
hero's internal gap goes 16 → 6px. Crow to button is now **+18px**.

The shared `.sg-btn{bottom:40px}` rule is a fleet standard swept by `_tools/start_btn_standard.py`,
so it is **not** edited. The override is scoped to `.sg-card.lh-card`, a hook the landing-hero branch
now sets in `app.js` — `.sg-btn` is the card's child, not `.sg-content`'s, so no selector rooted at
the content block can reach it.

| | before | after |
|---|---|---|
| sentence below the card's top border | 5px | **39px** |
| crow image to button | −11px (overlapping) | **+18px** |
| block inside the card | started 6px above it | 201..538 inside 172..628 |

## 3 · मछली, by a different method

Re-recorded twice already and still reported. Every check I have passes it — forced choice 3/3
against confusable spellings (मछलि, बछली, मसली, मचली, मक्खी, बछड़ी), a clean transcription, and a
"fully articulated" quality rating — on **both** the old take and the new. **My tooling cannot hear
what the SME is hearing**, and five fresh takes all scored identically, so re-rolling again was not
going to help.

So the production method changed instead. Isolated-word TTS is where this model's Hindi is weakest:
with no prosodic context it clips codas and flattens aspiration. The clip is now **cut out of a
carrier sentence** — "मछली पानी में तैरती है।" — taking the first speech burst, which is unambiguous
because the word starts the sentence. 45ms of head and 75ms of tail kept, 15ms/60ms fades,
loudnorm. It carries 0.57s of speech in a 0.69s file where the isolated take had 0.53s in 1.09s:
more word, less padding.

The carrier and the technique are recorded in `_assets_round4/vo_carrier_sources/`.

## Receipt

- All three guards pass on `build/` and `dist/`; HTML and all 121 audio files identical across
  `build/`, `dist/` and both factory trees
- Shippable dist payload **9.88 MB**, 121 KB under the cap
- Both layout changes verified by **measuring the running page** and by capture, not by eye

## Still needs a human

1. **मछली is still unconfirmed.** If it is wrong again, saying *what* it sounds like (wrong
   consonant? clipped ending? too fast?) would let me target it — or I can voice this one clip with
   a different speaker, accepting that it will not match the lesson's narrator.
2. **The balloon page now paints outside `.slide-stage`.** Intended and scoped, but it is the kind
   of change worth a glance on a real device, where the stage is scaled to fit.
3. The captures freeze animation; `balFloat` at the new height has been reasoned about (13px peak,
   clears the stage top) but not watched.

---

# r5j — the teach block sits one square higher, and the picture waits for the word

## 1 · "One box up" on the grid pages

The grid the SME pointed at is `.tut-card`'s own background — graph paper at
`background-size:46px 46px` — so "one box" is a measured 46px, not a guess.

The block is vertically centred inside `.tut-content`, so 92px of bottom padding moves it up by
half that: **exactly one square**. It applies to every **tutorial-phase** slide, which is what
"similar pages like this" means here — `isTut` in `mountSlide` puts pages 1–6 in the card: the
three SENTENCE_SOUND teach pages and the three MEET_LETTER pages. Pages 7–14 mount bare and are
untouched.

## 2 · The picture now comes after the line, not a sentence early

The SME: *"whenever an image comes like चूहा, पपीता and all, it will come AFTER the text or VO is
done — 'च से चूहा' then the mouse image comes."*

It was arriving a whole sentence early. The three MEET_LETTER pages speak one line —

> हमने **च** की आवाज़ **सुनी**। यह आवाज़ च अक्षर से **लिखी** जाती है। **जैसे**—च से **चूहा**।

— and every beat was anchored to a word of it: `letter` on सुनी, **`pic` on लिखी**, `label` on जैसे,
`mark` on चूहा. So the mouse appeared at "लिखी", in the middle of the second sentence, and the VO
only got round to naming it one sentence later.

**A token cue cannot express what was asked.** The example word ENDS the line, so anchoring the
picture to चूहा puts it *on* the word, not after it. The card now carries a separate
`reveal_flow.after_line` list, which the engine runs off the **clip's end** instead of off a token:

```
cues:       [ {at: "सुनी", do: "letter"} ]          during the line
after_line: [ "pic", "label", "mark" ]              once it has finished, 520ms apart
```

Measured in a real browser on T4, logging the audio element:

```
+   34ms  vo_t4_prompt.ogg          the line starts
+ 6579ms  ENDED vo_t4_prompt.ogg    "...जैसे—च से चूहा।"
+ 6764ms  the picture appears
```

`after_line` runs inside the existing `finish()`, so it also covers the paths that never reach the
end of the clip — a stalled or missing file, an autoplay refusal, the 22s fail-safe — and the page
still resolves to a complete teach screen rather than a blank one.

**The trade, stated plainly:** the middle of the line now has no visual beat. `letter` fires early
on "सुनी" and nothing else moves until the voice finishes. That is the direct consequence of the
request, and it is one line of card data to re-balance if it reads as too static.

## Receipt

- All three guards pass on `build/` and `dist/`; HTML identical across `build/`, `dist/` and both
  factory trees; no audio changed this round
- Shippable dist payload **9.88 MB**, 120 KB under the cap
- Both changes verified against the running page — the 46px lift by measuring `.tut-content`, the
  picture timing by logging when the clip ends versus when `.meet-pic-box` loses `seq-hidden`

## Still needs a human

1. **The pause in the middle of the MEET_LETTER line** (see the trade above) is a judgement call.
2. The captures freeze animation and strip `seq-hidden`, so the static shots show the picture
   already present — that is the capture tool, not the runtime. The timing was checked separately.

---

# r5k — the three teach pages made alike, the picture moved onto the word, and a correct tap answered

Six asks, and three of them turned out to be the same underlying problem: the three teach pages had
drifted apart from each other.

## 1 · The sentence sits one grid box clear of the letter card

One box of the card's grid paper is **46px** (`.tut-card background-size`).

`transform`, not margin. A margin would grow the flex block, and the block is CENTRED — so the
letter card would move down by half of whatever the sentence moved up, and the gap would open by
only half the intended amount. A transform takes the sentence out of layout, so the letter card does
not move and the full 46px becomes clearance. It moves into the empty `.tut-prompt` band (these
pages carry no heading), so nothing is displaced.

Measured on all three pages: sentence-bottom to letter-card-top **38px → 84px**.

## 2 · The picture lands on "<letter> से", not after the line

r5j put it after the whole line, which was the ask at the time; this is the correction.

The anchor is the subtle part. **"से" occurs twice** in the spoken line — "अक्षर **से** लिखी" and
"च **से** चूहा" — and the cue resolver scans FORWARD from the previous cue. A bare `{at:"से"}` would
therefore resolve to the FIRST one, mid-sentence, which is roughly where the picture already was. A
`{at:"जैसे"}` cue placed before it moves the scan past the first occurrence; it re-pulses the letter,
which also gives the middle of the line a beat of its own (the static gap r5j introduced).

Resolved token indices, checked against the real card:

```
T4  letter -> [4] सुनी।   letter -> [13] जैसे—   pic -> [15] से   label -> [16] चूहा।
T6  ...                                          pic -> [15] से   label -> [16] मूली।
T2  ...                                          pic -> [15] से   label -> [16] पपीता।
```

In the browser the picture now appears **during** the line (T4: +5920ms against a clip ending at
+6513ms) instead of after it. Only the letter-mark still waits for the end.

## 3 + 4 · Pages 1, 3 and 5 are now the same page with different content

Two separate drifts, one per page, both found by diffing the three against each other:

- **Page 3 spoke a clip the others did not.** Its `teach_seq` letter beat carried
  `{"step":"letter","audio":"vo_snd_m"}` — 2.17s of "म से मछली।" — while pages 1 and 5 have always
  been `{"silent": true}` on that beat. That is the VO the SME asked to remove. Now silent, like the
  others.
- **Page 5's explanation named nothing.** The mark beat lights the four words one at a time, paced by
  the explain clip, and on pages 1 and 3 that clip NAMES them ("चूहे, चार, चने, चबाए—…"), so each word
  lights as it is spoken. r4 shortened `vo_t1_explain` to just "इन सब शब्दों में प की आवाज़ बार-बार
  आई।", leaving page 5 marking four words against a sentence that named none of them. Re-scripted to
  the page-1 shape and regenerated.

All three pages now play exactly two clips, verified by logging every audio element the page creates:

```
T3   vo_line_l2.ogg, vo_t3_explain.ogg
T5   vo_line_l3.ogg, vo_t5_explain.ogg
T1   vo_line_l1.ogg, vo_t1_explain.ogg
```

## 5 + 6a · The letter sounds were abrupt because they were cut mid-decay

r5c made the bare sounds by **trimming a carrier phrase** — slicing "च" out of "च से चम्मच।". That
cuts the waveform while it is still ringing. Measured on the last 12ms, as a share of each clip's own
peak:

| clip | amplitude at the last sample |
|---|---|
| `vo_snd_ch` / `vo_snd_l` / `vo_snd_r` | 6.4% / 4.8% / 6.8% |
| `vo_ltr_m` | **20.8%** |
| all six new clips | **0.0%** |

A waveform that stops at a fifth of its peak is a step change, and a step change is what "abrupt"
sounds like.

The six replacements are cut from a carrier that **repeats the letter** — "च, च, च।" — so each one is
a complete utterance with its own onset and decay, taken at a silence boundary with 15ms/60ms fades.
A retry loop rejects any take where the voice ran the repetitions together (one long burst) or
clipped the letter, requiring at least 2 separated bursts and a letter of 0.18–0.45s. Some letters
refuse the comma carrier and needed dandas ("ल। ल। ल।") or a wrapped prompt.

`vo_ltr_ch`, `vo_ltr_l`, `vo_ltr_r`, `vo_ltr_p` are new; `vo_ltr_m` and `vo_ltr_n` were remade the
same way. Final lengths 0.32–0.48s, all within the band the approved clips occupied.

Wiring, which also settles the long-standing page-1-vs-3-and-5 inconsistency: **every** place that
plays a bare letter now uses `vo_ltr_*` — the three teach pages' letter card, page 8's च/ल/र options,
page 11's म/ल/न options, and both question pages' `target`.

> **Honest limit.** Isolated consonants cannot be verified by ASR — asked to identify these clips the
> model returned ट/म/ट for प and claimed a 0.3s clip contained "6 sounds". That is noise, and this
> bundle already knew open transcription fails on isolated aksharas. What is verified here is
> structural: separated bursts, a length in the approved band, and a clean decay to silence. Whether
> they SOUND right is still a human call.

## 5 + 6b · A correct tap had no visible answer at all

`.opt-cell.correct` paints the card green at line 131 of the stylesheet. The toybox theme repaints
every `.opt-cell` cream at line 418 — **the same specificity (0,2,0), and later in the file, so it
won**. The tick that used to carry the message by itself was removed by an earlier SME ruling
(`.opt-cell.correct::after{content:none !important}`), which left nothing at all: the card the child
got right looked exactly like the two they never touched.

Fixed with one theme-scoped rule carrying one class more, so no `!important` is needed. The wrong
states never had the problem — `.crossed` and `.wrong-flash` are both defined after the toybox block.

Verified by clicking the correct option in a real browser on both pages:

```
G3   classes = opt-cell correct ck-correct   background rgb(204,248,216)   border rgb(0,177,50)
P4   classes = opt-cell correct ck-correct   background rgb(204,248,216)   border rgb(0,177,50)
```

## Receipt

- All three guards pass on `build/` and `dist/`; the bare-sound guard now covers **9** ids
- HTML and all audio files identical across `build/`, `dist/` and both factory trees
- Shippable dist payload **9.90 MB** — but only **99 KB** under the cap now
- Every change checked against the running page, not by eye: the gap and the green by measuring the
  DOM, the picture timing by logging the audio element, the clip lists by recording every `new Audio`

## Still needs a human

1. **The six letter sounds have not been heard.** Their construction is measurably better than the
   trims they replace; the sound itself is unverified (see the limit above).
2. **`dist/` is at 99 KB of headroom.** The next audio addition will need a lower Opus bitrate.
3. `vo_snd_l` and `vo_snd_r` are now referenced by nothing and will drop out of the next full dist
   cut. `vo_snd_ch`, `vo_snd_m`, `vo_snd_p` and `vo_snd_n` are still used by the MEET_LETTER pages'
   `sound` slot and the practice pages' `target`.

---

# r5l — a play button and a clear sky on the cover, icon-only nav, a pulsing letter, a bigger word

## 1a · The stars were flying through the card, and the geometry says why

The sky layer is the animation toolkit's recipe 1, and its rule is that nothing spawns inside
`r0 = 22vmax` of centre, so "the card sits in a hole the geometry already leaves". **It does not.**
`r0` clears a CIRCLE; the start card is a wide RECTANGLE.

The stage is 1333×750 scaled to fit and centred, so the card's half-size in vmax is the same at
every window size — it is scale-invariant, because the card and `vmax` both track the viewport:

| | half-width | half-height |
|---|---|---|
| the card (+ the mascot's overhang) | **43.6 vmax** | 18.0 vmax |
| where a star starts | 22 vmax | 22 vmax |

So a star on a horizontal lane began its flight **22 vmax inside the card**, and the lanes either
side of horizontal crossed the card and the mascot on their way out. Vertically 22 already cleared,
which is why it looked deliberate from some angles and wrong from others.

The start radius is now computed **per lane** — how far along that particular ray the card's edge
actually is (`min(halfW/|cos|, halfH/|sin|)`, plus a margin), floored at the original 22 so vertical
lanes are unchanged. Horizontal lanes now start near 47 vmax. The outer radius follows so every lane
still travels a real distance, and each element keeps its own angle so a resize can recompute.

Measured on the running cover at five window sizes, portrait included: **0 of 87 stars** start
inside the card, against ~20 before.

> I could not open the repo referred to in the request, so this matches the rule the toolkit's own
> comments state (clear the card) rather than that repo's motion. If the drift, speed or density
> should change too, point me at the repo and I will match it properly.

## 1b · A play button instead of the wording

`शुरू करें` is gone; the pill now carries a ▶ glyph, drawn through `::after` exactly the way
`.nav-btn` already draws its arrow — so there is no new asset to ship and nothing to go missing. The
button itself is untouched: same fill, border, radius, shadow, and the 186px min-width that stops an
icon-only label collapsing it to a circle. Measured on the running page: **198×68**, as before. The
Hindi stays on the element as `aria-label`.

## 1c · An idle hand on the play button after 5s

With the wording gone the cover has no other affordance, so an idle child has nothing telling them
where to go. The hand appears after 5s and is cancelled by any touch of the cover.

**It has to be INSIDE the gate, not merely above it.** The first build set `z-index:90` on the hand
and looked correct in the DOM — classes set, z-index applied — and was invisible on screen. The hand
lives in `.slide-stage`, and z-index resolves against the nearest stacking context, so 90 only ever
competed with the slide's own children while `.slide-stage` as a whole still painted under the cover
(z-index 80). Raising `.slide-stage` instead would have lifted the mounted slide over the cover too.
So for this one nudge the hand is moved into the gate and placed against the gate's box; the disarm
puts it back where every other nudge expects it.

Verified: appears at **+5.7s**, fingertip lands **on** the button, and an early tap suppresses it.

## 2 · A pulse on the letter card (pages 1, 3, 5)

r4g had deliberately dropped `reveal-pulse` from this card, and was right to: that animation pulses a
GREEN box-shadow left over from when the card was `.correct`, and green on an amber teach card reads
as "you answered right" when nothing has been answered.

So this is its own keyframe in the card's own colour — scale plus an amber ring, 1.6s — running on
`.ss-lit`, which is set only while the letter is being shown on the three teach pages.

## 3 · The picture's word is bigger (pages 2, 4, 6)

`.meet-pic-box .pic-label` **36px → 52px**. It sits beside a 200px letter glyph, so 36px read as a
caption rather than as the word being taught. Safe to change here: the two-layer overlay that reddens
the target letter is built from `getComputedStyle(...).fontSize`, so it re-cuts itself at the new
size instead of landing at the old offsets.

## 4 · The nav button is arrow-only, everywhere

`आगे` removed from the markup; the `::after` arrow it already had is now the whole label. One change
covers every page, since all of them share the single `#navBtn`. Its design is untouched — same
170px pill, same states — and the word is kept as `aria-label`.

## Receipt

- All three guards pass on `build/` and `dist/`; HTML identical across `build/`, `dist/` and both
  factory trees; no audio changed this round
- Shippable dist payload **9.91 MB**, 91 KB under the cap
- Everything checked against the running page: star positions against the card's real rect at five
  window sizes, the nudge by timing it from page load, the button labels and the pulse by reading
  computed style

## Still needs a human

1. **The celebration's own button still reads "आगे बढ़ें →"** (`#endBtn`, a different element from
   `#navBtn`). It was left alone because stripping it to an arrow would lose the phrase's meaning on
   the final screen — say the word and I will make it match.
2. **The star motion itself is unchanged** — only where each lane begins. See the note in 1a.
3. **`dist/` is at 91 KB of headroom.** The next audio addition needs a lower Opus bitrate.

---

# r5m — the hunt pages follow through, and the question pages help instead of answering

## 1 · Pages 7, 10 and 12 (the sound hunt)

### The letter is quoted in the instruction panel

`prompt_hi` **is** the VO string on these pages (shown == spoken, by construction), so the quotes go
in that one string rather than a second copy of the line. They cost nothing spoken — TTS does not
voice a quotation mark — so the existing clips still match and were not re-recorded. Verified: the
clip still transcribes at 98% against the quoted text.

### The earned hand sits below the card

`_placeNudge` puts the fingertip ON the target, which is right for a bare letter and wrong for a
picture card: the hand covered the art or the word. The SME asked for it "just below the text of the
card (below the पपीता word) so that it does not cover anything".

A card opts in with `data-nudge-below`, so the default placement is untouched everywhere else, and
the hand is then centred horizontally and dropped just under the card. Measured on all three pages:
fingertip at y=601 against a word ending at y=576 and a card ending at y=591 — **below both**, and
**0px** off the card's centre.

### The page asks for the second word

There was nothing said between the first correct tap and the last, so a child who found one word got
silence exactly where the page should have been asking for the other. New clip per page
(`vo_g2_more` / `vo_p1_more` / `vo_p7_more`), spoken after a correct find **only while one is still
missing**. Measured order on a correct tap: `sfx_correct` → the word → `vo_g2_more`.

### A found card leaves play, and a locked card comes back

| | |
|---|---|
| on a correct tap | the card is already green (`.got`), and **2s later** it fades to `.spent` — 0.42 opacity, `pointer-events:none` |
| also on a correct tap | every `.nope` lock is cleared |

The fade matters because the card was *already* untappable — the click guard returns on `.got` — but
still looked live, so nothing told the child which cards were still in question.

Clearing the lock is the SME's "after one correct if any other element is disabled then enable it so
user can tap on that too". It clears the LOCK, not the attempt count, so another wrong tap re-locks
immediately and the scaffold ladder is unchanged.

## 2 · Pages 8 and 11 (the sound question)

### "ध्यान से सुनो" is gone from the panel — and it was the same string as the VO

`prompt_hi` is the VO text here too, so cutting the phrase from that one string removes it from the
panel **and** from what is spoken, keeping shown == spoken. Both prompt clips were re-recorded.

### The help replays the sentence instead of naming the answer

This one was not where it looked. The SME reported a VO "after 2 wrong attempts", and the obvious
place to change was the 2nd-wrong rung — but this game sets **`max_attempts: 2`**, so the second
wrong tap does not reach that rung at all: it lands on **terminal help**, which spoke
`vo_g3_reveal` — *"ध्यान से देखो, सही जवाब च है।"* That is the line the SME heard.

So terminal help now runs the slide's own hint action when it has one, and these two pages provide
it: the target akshara is overlaid on each word (the two-layer form, so only the consonant lights and
never its matra) and the line is replayed with each word lighting as it is spoken — the same beat
pages 1, 3 and 5 use. The overlay is built at hint time, not at mount, because lighting the answer
inside the stimulus before the child has tried would hand it to them.

Measured after two wrong taps:

```
G3   sfx_wrong, vo_ltr_l, vo_g3_try, sfx_wrong, vo_ltr_l, vo_line_l2     overlay 5/5 words, 4 lit
P4   sfx_wrong, vo_ltr_m, vo_p4_try, sfx_wrong, vo_ltr_m, vo_line_l6     overlay 4/4 words, 3 lit
```

4 of 5 and 3 of 4 are right: "ने" carries no च and "लाई।" carries no न, and an unlit word is the
point of the beat.

### No pulse, no green glow on the hint — green is reserved for the child

`.reveal-hold` runs `revealPulse`, which animates a **green** box-shadow — the same green a card gets
when the child picks it correctly. On the help rung that painted the answer as though it had been
answered. It is removed; what identifies the answer is now only what terminal help already did — the
other options fade, and the hand points, now **below** the letter (fingertip y=623 against a cell
ending at y=613).

A correct tap still turns the card green, on both pages:
`opt-cell correct` · background `rgb(204,248,216)` · border `rgb(0,177,50)`.

## Receipt

- All three guards pass on `build/` and `dist/`; HTML and all 81 referenced clips identical across
  `build/`, `dist/` and both factory trees
- The build's own guard caught the three new ids before they could ship silent
  (`!! no clip on disk for: vo_g2_more, vo_p1_more, vo_p7_more`)
- All five new/changed clips transcribe at **98–100%** against their card text
- Shippable dist payload **9.93 MB**

## Still needs a human

1. **`dist/` is down to 64 KB of headroom.** Three clips were added this round. The next addition
   needs a lower Opus bitrate — say the word and I will re-cut the whole dist at 24k, which buys
   roughly 200 KB.
2. **Nobody has heard the five new clips.**
3. The hunt pages' `hint` clips still say "ध्यान से…" in their own wording (`vo_g2_hint` etc.). Those
   were not in scope here — the SME's note was about pages 8 and 11 — but if the phrase should go
   fleet-wide on this lesson, say so.

---

# r5n — a watch-first sort page, डिब्बे, and the last button loses its wording

## 1 · The celebration's button is an arrow too

r5l stripped `#navBtn`, which is the button on every in-lesson page, but the celebration carries a
**different element** — `#endBtn`, which read "आगे बढ़ें →". That was left alone at the time and
flagged; the SME has now said "all the pages (complete game)", so it goes.

Its arrow used to be a character inside the text that was just removed, so it comes back as `::after`
— written as the glyph itself rather than a CSS escape, because the escape form is one stray
backslash away from rendering as literal digits. (It did, on the first attempt: `\2192` was parsed
as an octal escape and the button showed `92`.) Both buttons now read `text=""`, `::after="→"`, with
the Hindi kept as `aria-label`.

## 2 · The sort page, and a page in front of it that plays itself

### डिब्बे, and the two lines that echo it

`prompt_hi` IS the VO string on this page, so "टोकरी → डिब्बे" changes there. The two lines that
echo the word back at the child (`vo_g5_try`, `vo_g5_correct`) changed with it — otherwise the page
would say डिब्बा once and टोकरी twice. All three re-recorded.

`vo_g5_try` came back truncated on the plain rung — it ends in the imperative "…फिर सुनो।", the same
class of refusal r5e documented — and was recovered on `danda` by the speech-time ladder. It now
transcribes at 98%.

### The boxes carry the letter and nothing else

`प की आवाज़ वाला` → **`प`**, `च की आवाज़ वाला` → **`च`**. These are read by a pre-reader, and the old
label was a sentence.

### A new page BEFORE it, where the child watches

The SME asked for a copy of the sort page placed in front of it, with its own two words, on which
"user won't do anything — we'll just show how to do things".

That is **not** what `drag_demo` did. r4v/r4x had already tried the nearest thing — a hand travelling
over the live board — and the gesture still read as unclear, because **nothing ever moved except the
hand**. So the new page is a different mechanism: `auto_demo` locks input entirely and plays the
whole gesture. Each picture is named, then the hand travels to the right box and **the tile flies
along with it** and lands, using the same code path a real drop uses — `leaveTrayGhost` to hold the
tray slot, `.snapped`, appended into `.bin-items` — so the page ends in exactly the state a child's
own drop would leave, not a lookalike. The tile's 0.97s flight is matched to the window
`travelNudge` spends moving, so hand and picture arrive together.

Two tiles, one per box: the smallest set that shows "this one goes here, that one goes there". The
words are **पतंग** and **चाँद**, chosen because their art and clips already ship (pages 7 and 12), so
the whole page costs **one** new VO line — dist has very little room left.

Measured on the running page:

```
 + 6s   tiles in tray 2, in boxes 0, आगे disabled
 +10s   tiles in tray 1, in boxes 1, आगे disabled
 +14s   tiles in tray 0, in boxes 2, आगे disabled
 +18s   tiles in tray 0, in boxes 2, आगे ENABLED
```

Nothing is draggable there: the tile loop returns early on `auto_demo`, so neither the pick-up speech
nor `makeDraggable` is attached at all — not merely disabled.

### ...and the live page drops its hand

`drag_demo` is off on page 10 now. The page before it teaches the gesture in full, so a hand
travelling over the live board would repeat a lesson the child has just watched. Verified: no hand
appears on that page.

## 3 · Page 12 (was 11): the new sentence, and a trap inside it

"ध्यान से सुनो" was already gone from this panel — **r5m** removed it, together with the VO, which is
why it also stopped being what the 2-wrong hint said.

The sentence is now **"नानी ने नई नाव बनाई।"**, `vo_line_l6` re-recorded to match.

**The new sentence needed one extra guard.** The page asks which sound repeats *at the start of
words* — and बनाई carries a न in the **middle**. The hint lights every word containing the target, so
it would have lit बनाई's middle न and quietly answered a different question than the page was
asking. `mark_initial` restricts the marking to words that BEGIN with the target. Measured on the
hint:

```
नानी  marked=True    ने  marked=True    नई  marked=True    नाव  marked=True    बनाई।  marked=False
```

## Receipt

- 15 slides now (`tutorial 6 · guided 4 · practice 5`); all three guards pass on `build/` and `dist/`
- HTML and all 82 referenced clips identical across `build/`, `dist/` and both factory trees
- The build's guard again caught the new id before it could ship silent (`!! no clip on disk for:
  vo_g5_show`)
- Five new/changed clips transcribe at **98–100%**
- Three clips that nothing references any more (`vo_snd_l`, `vo_snd_r`, `vo_snd_n`) were dropped from
  `dist/` — a full dist re-cut would drop them anyway

## dist is nearly full, and this is now a decision

**9.95 MB shippable — 51 KB under the 10 MB cap.** Measured on the 82 clips that actually ship:

| Opus bitrate | audio total | headroom after |
|---|---|---|
| **32k (current)** | 968 KB | 51 KB |
| 28k | 852 KB | 167 KB |
| 24k | 734 KB | 285 KB |

I have not re-encoded anything: it changes the quality of every clip in a lesson where VO quality has
been the running concern, so it is your call, not mine. Say which and I will re-cut `dist/` in one
pass.

## Still needs a human

1. **The bitrate decision above.** The next addition of any size does not fit at 32k.
2. **Nobody has heard the five new/changed clips**, `vo_g5_show` among them.
3. **The demo page has not been watched at full speed** — its beats are verified by polling the DOM,
   and the stills show the finished board, but the flight itself has only been measured, not seen.

---

# r5o — the balloon page gets a second round, and a floor to stand on

Page 14 was a single pass over eight balloons: tap the four with प, and the sky slowly emptied. The
SME asked for six things on it, and they turn out to be one change — the page had no **state** beyond
"how many are left".

## 1 · Swiftie was hovering

She was pinned 322px down a field that r5i had lifted by 50px, so she ended up mid-air on the left
with nothing underneath her. She now sits at **372px**, which leaves her feet **22px** off the stage
floor while still riding up with the field, so she stays *beside* the balloons rather than behind
them.

392px was the first attempt and was wrong — it measured **2px** of clearance, which reads as standing
*on* the frame edge rather than on the ground.

## 2 · The word is named before it is judged

Tapping a balloon used to play the verdict. It now plays **the word first** — पतंग — and the
correct/incorrect line follows. This is the point of the page: the child has to hear the word to hear
the sound inside it, and a verdict that arrives before the word teaches nothing about why.

The two clips are chained with `_chainNetMs`, so the gap between them is sized to the first clip's
actual length rather than a guessed delay.

## 3 · The pop is a balloon popping

The old burst was sparks only, which reads as a firework. Six **torn rubber slivers** are now thrown
with the sparks, tumbling faster than they do, with a lopsided `border-radius` so each one reads as a
piece of skin rather than a confetti rectangle.

They are drawn in **the popped balloon's own colour** — `sparkle()` reads it off that `.bal-body`'s
computed `color` rather than taking a parameter, so a balloon can never pop in someone else's colour.

## 4 · The sky never thins out

Popping a target now **refills** that balloon from a `spares` list instead of leaving a hole. A refill
is always a **non-target**, so the number still to find stays exactly what the round promised — the
board gets no easier as it goes, which is the whole difficulty of the exercise.

Measured on round 1: पतंग → माला, पपीता → मूली.

## 5 · Two misses lights the answers, and the hand is gone

The hand nudge is removed from this page (`allow_hand: False`). After **two** incorrect taps every
*remaining* correct balloon breathes with an amber glow instead.

This is not a smaller version of the hand — it is the thing the hand could not do. A hand points at
**one** balloon; the question on this page is "which four", and four is what the glow can mark. The
glow rides on `.bal-lift` rather than `.balloon` so it cannot fight `balFloat` (the r5c lesson), and
it is dropped on refill, because a refill is never an answer.

## 6 · A second round, on a different sound

`items` became `levels`. Clearing round 1 swaps the whole board for round 2, which hunts **च** against
**क** distractors — the "words from क and च" that was asked for.

Round 2 cannot share round 1's praise or hint, because both **name the letter out loud**; a per-level
`audio` block overrides `prompt`/`correct`/`hint`/`done`.

Its four च words and two of its four क words are art and clips this lesson already ships (कौआ is the
cover crow), so only **कमल** and **कबूतर** are new pictures.

Measured end to end:

```
vo_g1_prompt → vo_g1_correct ×4 → vo_g1_next → vo_g1_correct2 ×4
round 2 board: obj_chuha obj_kela obj_chand obj_kauaa obj_chandi obj_kamal obj_chinti obj_kabutar
glow marks 4 of 4, no hand
```

**One compromise, and it is visible in the data.** Round 2's three *refill* balloons are words from
elsewhere in the lesson (आम, घर, मछली) rather than three more क images. Three more pictures did not
fit under the cap. If the क/च set has to hold through the refills as well, that is three more images
and a bitrate drop to pay for them.

## 7 · Four images were shipping from the wrong tree

While cross-checking the copies, `dist/` turned out to be shipping **different art** from `build/` for
four objects — `obj_aam`, `obj_chandi`, `obj_pani`, `obj_payal`. Not a re-encode: different
generations, different dimensions.

`build/`'s versions **match git `HEAD`**; the factory KG copies did not — the same drift, resolved the
same way, as the 40 audio clips in r5e.

It also happens that `build/`'s are the right ones on their own merits:

- **house style** — this lesson's objects have faces (`obj_kela`, `obj_laal`, `obj_muli`,
  `obj_papita`, `obj_patang`, `obj_chand` all do). build's mango and water-glass do; dist's flat
  bold-outline versions did not.
- **correctness** — build's `obj_payal` is a pair of anklets with bells. The one that was shipping
  read as a single bangle.

Both factory trees and `dist/` were re-cut from `build/`. Two of the six that had drifted
(`obj_champa`, `obj_sapna`) are not referenced by the card and never shipped at all.

Six non-`obj_` files in `build/assets/Images` (`aunt 1.png`, `mama 1.png`, `mouse.png`, `papita.png`,
`radish.png`, `tamatar 1.png`) are unreferenced legacy leftovers. Left in place — they are not shipped
and removing them is not this round's call.

## Receipt

- 15 slides (`tutorial 6 · guided 4 · practice 5`); all three guards pass on **all four** trees —
  `build/`, `dist/`, factory KG, factory dist
- HTML byte-identical across all four (`5a7d85008303604e`)
- Audio byte-identical across the pairs; images now byte-identical too
- Six new clips: `vo_g1_next`, `vo_g1_correct2`, `vo_g1_hint2`, `vo_w_kauaa`, `vo_w_kamal`,
  `vo_w_kabutar`; two new pictures: `obj_kamal`, `obj_kabutar`
- **dist 9.56 MB — 450 KB under the cap**

## The bitrate question was answered by the work

r5n left the 32k/28k/24k choice open. Round 2's content put dist **14 KB over** at 32k, so all 88
shipping clips were re-cut at **28k**. That was forced by the request rather than chosen — if 28k is
audibly worse on any line, say so and the fix is to cut content, not to go back up.

## Still needs a human

1. **Nobody has heard the six new clips.** `vo_g1_hint2` came back on the `wrapped(Kore)` rung of the
   refuser ladder, so its timbre may not match the rest.
2. **28k has not been listened to.** See above — it was forced, not chosen.
3. **The pop has not been watched at full speed.** Shard count, colour inheritance and timing are
   verified in the DOM; the burst itself has been measured, not seen.

---

# r5p — the crow answers its own line, the hand waits its turn, and three new pictures

## 1 · The cover

### काँव-**काँव** — the sound now agrees with the sentence

The cover reads **"काला कौआ काँव-काँव करता।"** and the trimmed recording held a **single** call. On the
one page whose entire subject is that sound, the sound and the words disagreed.

`picture_sfx_times: 2` lives in the **card**, not the engine, because it belongs to the line — a
different line would want a different count. The engine spaces the repeats by the clip's own
`audio_dur`, so a re-cut caw cannot make them overlap or straggle, and **every repeat re-checks that
the cover is still up**: tapping the play button mid-call must not leave a caw to bark over slide 0.
That is the same trap the cue timeline beneath it already documents.

Measured: **2 calls, 664 ms apart, on a 0.56 s clip.**

### The hand was nudging a child who was listening

r5l armed the 5-second idle timer **at page load**. The greeting is ~19 s. So the hand appeared while
Swiftie was still talking — it read as "hurry up" at a child who was doing exactly the right thing.

The timer is now disarmed for the whole greeting and armed **from its end**. Both endings count: the
karaoke run, and the no-token fallback, which fires its `finish()` *before* its clip plays and so has
to arm from the clip instead. Two more paths that could otherwise leave an idle child with no nudge
at all — a cover with no landing sentence, and a cover whose greeting never ran — arm it too.

```
greeting ended  18893 ms
hand appeared   23909 ms   -> 5.0 s after the VO, as asked
```

**And idle now means idle.** Activity *restarts* the wait instead of cancelling it. Before, one stray
tap on the card bought permanent silence, which is not what "inactive for more than 5 seconds"
describes.

### It points at the middle

`0.72` put the fingertip three-quarters across the pill — fine when the button had a word in it, but
r5l took the word out, and on an icon-only button that reads as pointing *past* it. Now `0.50`.

Measured: **button centre x=742, fingertip x=742, offset +0 px.**

## 2 · The arrow is the whole button now, so it is sized like one

r5l removed the wording from `#navBtn`, which turned the arrow from a companion to the text into the
**entire label** — still drawn at a size chosen back when it was not. 28px → **40px**, and the
celebration's `#endBtn` with it (30px → 40px), because it is the same affordance.

`line-height:1` is pinned on both so a taller glyph box cannot push the pill around. Measured: the
pill is still exactly **170×62**.

## 3 · Three new pictures on the two practice hunts

The SME supplied art for **चिड़िया**, **लड्डू** and **चश्मा** and named where each goes.

| page | out | in | target | answers |
|---|---|---|---|---|
| **11** (P1) | चींटी, लाल | चिड़िया, लड्डू | म | 2 → **2** |
| **13** (P7) | चींटी | चश्मा | च | 2 → **2** |

**Both swaps preserve the count of correct answers, which is the thing that could quietly have
broken.** On page 11 both departures were distractors and both arrivals are too (चिड़िया begins च,
लड्डू begins ल). On page 13 चींटी was an **answer**, and चश्मा begins च as well, so the page still
holds two. A swap that changed the count would leave the page's own "मैंने सब ढूँढ लिए" logic
answering a question the child was never asked.

चींटी and लाल have **not** left the lesson — both still appear on page 14's balloons, so their art and
clips still ship.

The supplied files were cutouts already, so they were only trimmed and fitted to this lesson's 512px
long edge. The originals went to `_assets_round4/` as `*_SOURCE.png`, which is where this bundle
already keeps SME masters — `assets/Images` is for game art, and three raw drops sitting in it is how
the six unreferenced leftovers got there in the first place.

Three new clips, verified by forced choice against the full word list (so चाँद/चाँदी/चश्मा and
लाल/लड्डू are live near-neighbours, not a soft test) — **all three identified correctly on both
shuffles.**

## The build reads its recipe from a third place

Worth writing down, because it cost a rebuild to find: `rebuild_isolated.py` ends with

```python
runpy.run_path(os.path.join(FLN, "scripts", "build_skill_%s.py" % CODE), ...)
```

— so the recipe that actually runs is **`FLN_Content_Factory/scripts/`**, not the copy in
`KG/<CODE>/`. A recipe edit synced only to the KG folder builds cleanly and changes nothing, which is
exactly what happened here: the first rebuild reported the same 88 ids and 20 images as before, with
every guard passing. The tell was that **nothing changed**, not that anything failed.

## Receipt

- 15 slides; all three guards pass on **all four** trees, now covering 74 authored lines / 80 clips
- HTML byte-identical across all four (`ac0864265d6a9560`); audio and images identical across the pairs
- Both swapped pages render their new items with **0 broken images**
- **dist 9.70 MB — 311 KB under the cap** (91 clips, 23 images)

## Still needs a human

1. **`vo_w_chidiya` came back on the `wrapped-lesson(Kore)` rung** of the refuser ladder, so its
   timbre may not match its neighbours. It identifies correctly; nobody has *heard* it.
2. **Nobody has heard `vo_w_laddu` or `vo_w_chashma` either**, nor the doubled crow at full speed —
   the two calls and their gap are measured, not listened to.
3. **`vo_w_patta` is fine, and this is the note saying so.** It failed one shuffle of the sweep
   (read as कबूतर); re-asked six times it came back **5/6**, with the single miss on the same seed
   and naming a word that sounds nothing like it. ASR noise on a pre-existing clip — not regenerated.

---

# r5q — चम्मच takes चाँदी's place in the प/च sort

SME art, one swap, page 10 (`G5`).

## The swap

| out | in | box |
|---|---|---|
| चाँदी | **चम्मच** | च |

चाँदी and चम्मच both begin **च**, so the boxes still take **two and two**. That is the check this
page needs: a swap that moved a tile across bins would have left one box unfillable and the other
over-subscribed, and the page would have sat there waiting for a tile that does not exist.

**चाँदी has not left the lesson** — page 14's second balloon round still uses it, so `obj_chandi` and
`vo_w_chandi` still ship.

The supplied file was a clean cutout, so it was trimmed and fitted to this lesson's 512px long edge
(189×512 — a spoon is a narrow subject, and `object-fit:contain` gives it the tile's full height).
The original is filed as `_assets_round4/chammach_SOURCE.png`.

## चश्मा and चम्मच are now both in this lesson, and that is worth a measurement

r5p added **चश्मा** to page 13. Adding **चम्मच** put a genuine near-neighbour beside it — same
opening अक्षर, same length, and the middle differs by one conjunct. The forced-choice sweep noticed
immediately: `vo_w_chashma`, which passed cleanly in r5p, came back UNSTABLE as soon as चम्मच joined
the option list.

So it was asked directly, six shuffles each:

```
against the FULL word list   vo_w_chashma   5/6      vo_w_chammach  6/6
head to head, only those two vo_w_chashma   6/6      vo_w_chammach  6/6
```

**Head to head both are 6/6**, which is the test that actually answers the question — the clips are
distinguishable, and the one full-list miss is the same seed-1 positional artifact that `vo_w_patta`
shows. Neither clip was regenerated.

The two words never appear on the same page (चम्मच on 10, चश्मा on 13), so a child is never asked to
tell them apart. This note exists so that if someone later puts them side by side, they know the pair
was measured rather than assumed.

## Receipt

- 15 slides; all three guards pass on all four trees, now 75 authored lines / 81 clips
- HTML byte-identical across all four (`5be10c3721985143`)
- Page 10 renders चूहा · पानी · पायल · चम्मच into the प/च boxes, **0 broken images**
- `vo_w_chammach` came off the **primary** TTS rung — no refuser-ladder fallback
- **dist 9.72 MB — 290 KB under the cap** (92 clips, 24 images)

## Still needs a human

Nobody has heard `vo_w_chammach`. It identifies 6/6 against the full word list and 6/6 against चश्मा
directly, but that is a machine listening, not a person.

---

# r5r — the cover waits its turn, page 9 shows itself out, and the lesson speaks आप

## 1 · The cover

### The hand is gone; the button does its own asking

A hand pointing at the only affordance on an otherwise empty screen was saying what the button can
say by itself — and it covered the ▶ it was pointing at. The idle timer and its reset are r5p's,
unchanged; all that differs is what firing does: `.sg-btn` gets `.idle-pulse`.

**The pulse is now earned.** It used to run from first paint, which made it wallpaper rather than a
signal, and left nothing to escalate to when a child actually stalled.

### The button is dead until the greeting finishes

SME: *"button is inactive during the voice over, once voice over is complete then the play button
will activate."* So the greeting is no longer skippable. `.sg-waiting` makes that visible — muted and
flat, because a bright button that ignores taps teaches the child the screen is broken rather than
busy.

Measured end to end:

```
t(ms)   disabled  waiting  pulsing  hand
    0   True      True     False    False     <- dead from first paint
  345   True      True     False    False     <- greeting speaking
23292   False     False    False    False     <- greeting ends, button live
28300   False     False    True     False     <- 5.0s idle -> pulse
```

The hand never appears at any point.

**This has a cost worth naming: the child now waits ~23 s before they can start.** That is the
greeting's own length, and it was previously skippable by tapping through. If it proves too long in
front of children, the fix is to shorten `vo_landing`, not to re-open the button mid-line — a button
that works halfway through a sentence is the thing this change removed.

**A dead play button is now a total block, so it has a watchdog.** Every ordinary ending releases the
button off `play()`'s `onEnd`, but a clip that *stalls* rather than errors never fires it. A timer
sized off the clip's own duration plus 8 s releases the button regardless. It only ever fires when
something has already gone wrong.

### The stars pop, and they do it on screen

Two faults, both measured on the shipping build before anything was touched.

**They were mostly outside the window.** r4r starts each lane outside the *card* so nothing crosses
Swiftie or the panel, and r5l pushed that further out. On a wide window the card's own half-width in
vmax is most of the way to the edge, so lanes began at the rim and the star was gone before it could
be seen:

```
before   87 stars   18 on screen   median radius 722-791px   (screen half-diagonal 843px)
after    87 stars   60 on screen
```

`_skyLaneStart` now caps the start at 55% of that lane's own distance to the screen edge, and the
travel target is the window's corner rather than a fixed 72vmax, so the outer half of each flight is
no longer off-screen either.

**They only drifted.** A star that slides on at constant size reads as debris. What reads as a
twinkle is *scale*: `sgFly` now opens at 0.15, overshoots to 1.28, settles to 1, and shrinks to 0.25
on the way out. Measured live scale range **0.25 – 1.26**, against a flat 1.00 before. Flight time
came down from 18–34 s to 11–21 s, because a 34-second crossing is slower than the pop is worth.

> **This is not a match to the reference.** The Slack link in the request is not something I can
> open, so the animation above is built from what the code measurably got wrong, not from the repo
> it was meant to copy. If the reference has a specific pop, send the repo or the file and this can
> be matched properly rather than approximated.

## 2 · Page 9 shows itself out

- **The box labels are legible.** r5n cut these from a sentence to a single अक्षर and left them at
  the sentence's 26px, so the one thing a pre-reader must read became the smallest text on the page.
  **26px → 40px.** The pill is centred *on* the top border and hangs half its height into the box —
  at 40px that is 32px, which crossed the old 30px padding and let a dropped picture touch it, so
  the box padding went **30px → 36px** (both axes, keeping r4z's symmetry). Measured clearance
  **+7px**. This is a shared component, so page 10's labels grew with it.
- **No आगे pill, and the page leaves by itself.** There is nothing to *do* on a watch-first page, so
  a button that only says "I have finished watching" is a gate with no question behind it. The pill
  is hidden for the slide's whole life (`.stage.auto-adv`) rather than removed at the end, so it
  cannot flash in and out. Scoped by its own `auto_advance` flag, not by `auto_demo`, so a future
  demo page can still choose to wait for a tap.
- **"देखो," is gone** from the panel, leaving the instruction on its own.

```
+ 0s  slide=8  navBtn display=none  auto-adv=True   tiles in boxes=0
+10s  slide=8  navBtn display=none  auto-adv=True   tiles in boxes=2
+16s  slide=9  navBtn display=flex  auto-adv=False  -> left page 9 on its own
```

## 3 · The arrow, again

**40px → 52px** on `#navBtn` and `#endBtn`. The pill still measures exactly **170×62** —
`line-height:1` is what keeps the glyph box from pushing it around.

## 4 · The lesson speaks आप

करो → **कीजिए**, देखो → **देखिए**, on the on-screen instructions the SME named.

**This closed a defect that was already logged.** `vo_g1_prompt` and `vo_g1_hint` came from the deck
in आप while every other line was तुम; r4 flagged the split as OPEN-4 and preserved it because the
deck's wording was authoritative. It is now closed by making the rest match, and that note has been
rewritten so nobody restores the old split.

**The spoken-only siblings went too.** `prompt_hi` *is* the VO on these pages, and a page that reads
कीजिए then says करो two seconds later is worse than either register on its own — so `vo_g2_more`,
`vo_p1_more`, `vo_p7_more`, `vo_g1_next`, `vo_g2_hint` and `vo_g3_reveal` moved with their panels.

**And page 10, which the instruction did not name.** Its on-screen prompt ends सुनो/डालो, not
करो/देखो — but it is the fourth on-screen instruction, and once 7/11/13 moved it was the only panel
left in तुम, sitting beside three that were not. It travels with them.

**11 spoken-only lines are still तुम, and that is a decision, not an oversight.** They are never
shown on screen:

```
vo_g2_reveal  vo_g2_try  vo_g5_hint  vo_g5_try  vo_landing
vo_p1_hint    vo_p1_reveal  vo_p1_try
vo_p7_hint    vo_p7_reveal  vo_p7_try
```

They were left because converting them is a bigger change than was asked for, and because
`vo_landing` is the cover's 19-second karaoke clip — the most delicate recording in the lesson, with
the sentence animation timed against its speech map. Converting it means re-cutting that map and
re-checking every cue. Say the word and it is one more pass.

## 5 · चाँदी leaves the balloons, and the lesson

SME: *"don't use chandi balloon."* **चम्मच** replaces it — also च, with art and a clip that already
ship from page 10, so the board keeps four च targets at no cost in size.

This was चाँदी's **last** use: r5q had already replaced it on page 10. `obj_chandi` and
`vo_w_chandi` are now unreferenced and have dropped out of `dist/` (92 → 91 clips, 24 → 23 images).
Both masters stay in `build/`.

## Receipt

- 15 slides; all three guards pass on **all four** trees (74 lines / 80 clips)
- HTML byte-identical across all four
- **11 clips re-recorded**, every one on the **primary** TTS rung — no refuser-ladder fallback
  despite कीजिए/सुनिए being imperatives, which is the failure class r5e documented
- All 11 transcribe at **97–100%**
- **dist 9.70 MB — 303 KB under the cap**

## Still needs a human

1. **The ~23-second wait on the cover.** Measured, intended, and the direct consequence of the
   request. It wants watching with a real child before it ships.
2. **Nobody has heard the 11 re-recorded lines.** They transcribe correctly; that is a machine.
3. **The star pop is an interpretation, not the reference.** See the note in §1.
4. **The 11 remaining तुम lines** in §4 — convert or keep.

---

# r5s — the sky keeps off the card, and pops when you tap it

## 1 · My own regression, undone

r5r capped the lane start radius to drag the field back on screen, and its comment said out loud
that the cap might let stars begin over the card's edge. It did. Measured on the shipping build:

```
r5r:   up to 26 stars over the CARD, up to 5 over Swiftie
```

That is the exact complaint r5l had already fixed, reintroduced by me in the round that was supposed
to make the sky better. The cap is gone.

**The real constraint, stated plainly:** the card is 1187×486 inside a 1484×799 window. It fills
most of the viewport, so *"outside the card and inside the window"* **is** a thin margin band —
there is no third place to put stars. r4r's geometry was right about the start and wrong about the
end: it sent every lane out to a flat `72vmax`, so most of each flight happened past the screen edge
where nobody could see it. That is why clearing the card looked like "no animation".

So: clearing the card still sets the **start** (non-negotiable), and a new `_skyLaneEnd` stops the
flight just past **this direction's screen edge** instead of at a fixed radius. The whole flight now
happens inside the visible band. Density comes from lane **count** (29 → 44 lanes × 3 layers = 132)
rather than from lane length.

```
            over card   over Swiftie   visible per sample
r4r/r5l         0             0              ~18
r5r            26             5             ~60
r5s             0             0            99-114
```

Zero overlap across ten samples, and five times the visible density r5l had.

## 2 · Tap a star and it bursts

SME: *"when we click on any star or bubble it burst with some sfx which is currently missing."*

- **The sound is `sfx_bal_pop`** — 0.20s, already shipping for the balloon page, so this cost
  nothing in size. It honours mute.
- **The burst** swells the bubble (scale 1 → 1.95 → 2.7) and fades it, with a shock ring expanding
  out of it. The ring reuses the twinkle's existing glow pseudo-element, so the effect adds no new
  element to any of the 132 stars.
- **It starts from where the star actually is.** The drift lives in `transform`, so a burst that
  animated `transform` from scratch would snap the star back to its lane origin before popping.
  `popStar` reads the live matrix and hands the two numbers to the keyframes as `--bx/--by`.
- **A popped star is respawned, not destroyed** — with a fresh delay, so it re-enters somewhere new.
  A sky that thins out as a child plays with it punishes them for playing with it.
- **One listener, not 132.** Delegated on the layer, which also means a respawned star needs no
  rebinding.

### Nothing on the cover became unclickable

A full-viewport overlay that takes pointer events is how you break every control under it. The
**layer** stays `pointer-events:none` and only the stars turn it back on. Verified by hit-testing
the centre of each control:

```
play button -> the control itself      🔊 chip -> the control itself
card        -> the control itself      Swiftie -> the control itself
```

The gate sits at z-index 80 over the sky's 1, so a star drifting near the card cannot steal a tap
meant for the card either.

Stars are 12–39px across, which is a mean target for a five-year-old, so an invisible `::before`
pad widens the hit area by 14px without changing anything that is drawn.

### One judgement call, easily reversed

**Popping stars does NOT reset the 5-second idle timer**, so the play button still starts pulsing
even while a child is happily bursting bubbles. The timer's job is to point at the way forward, and
popping bubbles is not progress toward it. If you would rather any touch count as activity, it is
one line.

## Still not the reference

The Slack link still cannot be opened from here, so this burst is built to the description in the
request — tap, burst, sound — not matched to the repo. If the reference has a particular burst, send
the repo or the file and it can be matched properly.

## Receipt

- Guards pass on all four trees; HTML byte-identical across them
- **dist 9.71 MB — 299 KB under the cap.** No new assets: the pop reuses `sfx_bal_pop`

---

# r5t — the delivery manifests

The text is frozen, so the recording brief can be cut. `make_manifests.py` writes both sheets from
the built card:

| file | what it is |
|---|---|
| `build/assets/Audio/audio_manifest.xlsx` | the VO brief — every spoken line, the exact filename to deliver it as, and where the child hears it |
| `build/assets/Images/image_manifest.xlsx` | the illustration inventory — every picture the card references, where it is used, what ships today |

```
audio   81 lines   0 missing   0 unresolved
images  23 images  0 missing
```

**Every one of the 81 lines reads "machine TTS — replace".** Nothing is pink. This is a complete
replace-list for a human voice artist, not a list of gaps.

The 10 card audio ids that are *not* on the sheet are the 7 sound effects and the 3 phase-gate
clips — none of them has spoken text, and none of them is something a person records.

## Why this is a script in the repo and not a one-off export

**1 · It has to be re-cut whenever a word changes.** r5r rewrote eleven lines two rounds ago. A
manifest cut before that would have sent a voice artist the old wording, and nothing downstream
would have caught it.

**2 · The shared generator could not say where two thirds of the clips are used.** `make_vo_sheets.py`
resolves usage from `slide["audio"]` and `data["options"]` only. This card also keeps clips in
`data["items"]`, `data["levels"][n]["items"] / ["spares"] / ["audio"]`, `data["teach_seq"]`,
`data["whole_audio"]` and `landing_hero["sync_audio"]` — so **28 of 81 rows came out as
"engine/shared"**, including *all 20 picture words*. That is precisely the column a voice artist
reads to know what they are naming. Resolved locally rather than by editing the shared tool, which
serves the whole fleet — though that resolver is the obvious upstream improvement if anyone wants it.

**3 · The shared generator labels usage by slide ID.** `G1:correct`, `P7:prompt`. Nobody outside
this repo can turn G1 into a page number, so every row is relabelled `page N · role` — and a word
used in several places now says so:

```
vo_w_patang   page 7 · picture पतंग; page 9 · picture पतंग; page 14 · round 1 balloon पतंग
vo_w_kela     page 7 · picture केला; page 14 · round 1 balloon केला; page 14 · round 2 balloon केला
```

The audio sheet's own format — columns, colours, the pink MISSING fill — is the shared tool's and is
deliberately not re-invented; only the usage column is rewritten.

Neither manifest ships: `sync_dist.py` copies only referenced `.ogg`/`.png`, so `dist/` is untouched
and the size budget is unaffected.

## A correction, and it matters before anyone records

r5r reported **11** spoken-only lines still in तुम. The real number is **14**. That scan looked for
तुम *verbs* (करो/देखो/सुनो/डालो/बोलो) and missed three lines that carry the तुम *pronoun* instead:
`vo_g2_done` ("तुमने … खोज लिए"), `vo_p4_try` ("तुमने आखिरी आवाज़ सुनी"), `vo_p7_done` ("तुमने च की
आवाज़ … पहचान ली").

The full list, all voice-only — **every on-screen line is आप**:

```
verb form   vo_g2_reveal  vo_g2_try   vo_g5_hint  vo_g5_try  vo_landing
            vo_p1_hint    vo_p1_reveal  vo_p1_try
            vo_p7_hint    vo_p7_reveal  vo_p7_try
pronoun     vo_g2_done    vo_p4_try   vo_p7_done
```

**This is now time-critical rather than cosmetic.** The manifest is the handoff to human recording;
14 lines recorded in तुम and then converted is 14 lines recorded twice. The register question wants
answering before the sheet goes out, not after.

## Receipt

- `make_manifests.py` added at the bundle root, mirrored to the factory KG with both sheets
- Regenerate with `PYTHONUTF8=1 python make_manifests.py build`
- Guards still pass on all four trees; no asset or HTML change in this round

---

# r5u — the sky, ported from the repo instead of guessed at

The SME supplied the reference: **github.com/ananya-goswami/fln-animation-toolkit**. Recipes §1
"Start screen stars (drift)" and §2 "Start screen stars (tap to burst)" are now ported rather than
approximated, and four rounds of chasing this collapse into one root cause.

## The root cause, and why no amount of tuning could have found it

**r4r ported §1 but dropped its CSS mask**, on the reasoning that the spawn radius `r0` could keep
the centre clear "by construction". That reasoning is wrong in one word: `r0` describes a **circle**
and the card is a wide **rectangle**. Everything after that was a chase between two failures that
cannot both be fixed geometrically:

| round | what it did | result |
|---|---|---|
| r4r | r0 = 22vmax circle | stars crossed the card |
| r5l | r0 computed per lane to clear the card's rectangle | correct, but the card fills most of the window, so lanes began at the screen rim — **18 of 87 visible**, and the sky read as absent |
| r5r | capped the radius to pull them back on screen | **26 stars over the card** |
| r5s | pushed the flight into the margin band | clean, dense, but still not the reference |

**The kit does not choose.** Stars fly from the centre straight out, and a mask hole the size of the
card *occludes* them while they are behind it — §1's own words: *"hole punched over the centre card
... Hard edge: a real occlusion boundary."* With the mask restored there is no trade-off left: the
geometry goes back to the kit's verbatim `r0:22 / r1:72`, 29 lanes × 3 layers, `dur 18–34s`, and the
card is clean because it is *occluding*, not because the stars are avoiding it.

Also restored from §1: **`.sg-glow`**, the breathing radial wash under the stars, which we never had.

### One deliberate deviation, measured

The kit insets the hole 40 design px so its hard edge hides under the card's own frame. Measured
here, **that inset leaks**: diffing the card region with the sky shown against hidden found 499
changed pixels, worst delta 405/765 — our frame is not opaque across the full 20px, and at the
rounded corners a rect inset cuts inside the curve. The hole is sized to the card exactly
(1114×456, its design size), so the occlusion boundary *is* the card boundary.

Re-measured after the change, over 8 trials with every animation frozen:

```
0 changed pixels inside the card
```

(Two false positives had to be excluded first: Swiftie and the 🔊 chip are an animated WebP and a
pulsing button *inside* the card, and neither obeys `animation-play-state`, so they differ between
any two screenshots whatever the sky is doing. That is what the first runs were reporting.)

## §2 — tap to burst, which is what "the star popping animation" meant

It was never installed. r5s added a burst of my own invention; this replaces it with the kit's.

- **16 particles** (rings of 9 and 7) of the **same shape as the star tapped**, in the kit's six
  hues, arcing out under gravity behind a white-blue flash.
- The particle is a solid fill **masked** to the shape, so its two colour drop-shadows follow the
  star's silhouette rather than a box.
- The star is **hidden, not destroyed**, and returns on its next lap — the kit listens for
  `animationiteration` and filters on the animation **name**, because the twinkle on `::after`
  fires far more often than the flight does.
- The pop is **synthesised** (sine thud → filtered noise tail → four square crackles), not a clip,
  so it costs nothing against the size budget. r5s's `sfx_bal_pop` is no longer used here.

Measured: `16 particles | flash present | 6 distinct hues | --gy gravity | 0 nodes left after 1.5s`.

**`--gy`, not `--g`.** The kit records that the shipped version named the gravity variable `--g`,
colliding with the sky's own glow-duration `--g`. Ours uses `--gy`.

### r5s made the layer interactive; the kit forbids it

r5s gave every star `pointer-events:auto`. §2 is explicit: *"making `.sg-sky` interactive would put
an invisible full-screen layer over every button."* Reverted — the layer is inert again and the tap
is found by hit-testing each star's rect on a **capture-phase document listener**, claiming the
event only when one is actually hit. Verified: play button, 🔊 chip and card all still resolve to
themselves under a centre-point hit test.

The generous hit box is the kit's too: `max(12px, width × 0.7)`, because the smallest stars are
about 4px.

## What the density looks like now

**24–36 stars on screen** at any moment, against r5s's 99–114. That is not a regression — it is the
reference's own numbers. The difference is *where* the flight happens: r5s put all 132 stars inside
the visible margin, while the kit's stars emerge from **behind the card** and sail outward, so each
one is visible for a long stretch and the motion reads as coming from somewhere. r5l's 18 looked
absent because those stars appeared *at the screen rim* and left immediately.

## Receipt

- 87 stars (29 lanes × 3 layers), exactly the kit's count
- `mask-composite: exclude`, hole tracked by `--scale`
- **0 pixels of the card touched by the sky**, 8 trials
- Guards pass on all four trees; HTML byte-identical
- **dist 9.71 MB — 294 KB under the cap.** No new assets: the burst is synthesised and the star
  shapes were already inline data URIs

## Still needs a human

The burst has been measured, not watched: particle count, hues, gravity variable, flash and cleanup
are all verified in the DOM, and the pop is synthesised so it has never been heard here.

---

# r5v — the celebration gets the sky it was missing

## What page 15 already had, and what it did not

The SME asked for the toolkit's **recipe 8, celebration star burst**. It has been installed since
r4r and matches the kit's *retuned* preset parameter for parameter — `stars:32, circles:8,
startV:14, decay:0.975, ticks:150, shots:[0,220,440], spin:0.18, starScale:1.8` — which is the
kit's `SB_NEW`, not its `SB_OLD`. Verified it actually renders rather than assuming:

```
suppress starBurst() and re-screenshot -> 61,662 pixels change, worst delta 703/765
```

So the canvas burst was never the gap. The SME named the real one: *"the popping of star and
bubbles is not happening"* — **recipes 1 and 2 were missing from the end screen.**

## The gap was in my own r5u port

The kit runs the drifting sky on **both** screens, and recipe 2 is live on both by default:

```css
body.is-start .sg-glow,body.is-start .sg-sky,
body.is-end   .sg-glow,body.is-end   .sg-sky{display:block;}
```
```js
when:["is-start","is-end"]
```

r5u ported only `is-start`, and dropped the kit's dedicated end-screen mask with it. So page 15 had
the canvas burst on arrival and then nothing to tap. Both restored.

**The end screen gets a different hole, and the kit says why:** *"end screen has no visible
occluder, so a hard edge reads as a sliced crescent. Soft radial hole sized to the mascot
instead."* A card-shaped rectangle would cut a hard-edged box out of empty gold. It is an 800×800
design-px radial, solid to 71% then fading.

`.end-screen` is `background:transparent` at z-index 90 and `.end-bg` is z-index 0, so the sky at
z-index 1 slots between them exactly as it does on the cover — no z-order work was needed.

Measured on page 15, after the canvas burst has faded so the sky is what is being tested:

```
body.is-end   .sg-sky display:block   .sg-glow display:block
mask-size     100% 100%, 800px 800px  (soft radial, not the card rect)
drifting stars on screen                32
tap one  -> .popped=true, k-star burst, 16 particles, flash, 6 hues, audio context used
         -> 0 burst nodes left after 1.5s
आगे button under a star                 still resolves to the button
```

## The cover is untouched

Its mask is still the card-sized rect (1186.78 × 485.79 measured) and r5u's pixel evidence stands.

One note for whoever reads the numbers next: a *rect-based* count says "2 stars over the card" on
the cover, and that is a limitation of the test, not an overlap. The hole is exactly the card, so a
star centred just outside it has its bounding box straddling the boundary — and the mask clips the
inside half to zero alpha. The authoritative measurement is the pixel diff in r5u: **0 changed
pixels over 8 trials**. Count pixels here, not rectangles.

## Receipt

- Guards pass on all four trees; HTML byte-identical
- **dist 9.71 MB — 293 KB under the cap.** No new assets; the pop is still synthesised

## Still needs a human

The end-screen pop has been measured, not watched or heard — same standing caveat as the cover's.

---

# r5w — the manifest says what to actually deliver, and an intake step that checks it

The SME asked which column carries the filename, and what audio format to record in. Answering the
second question turned up a trap worth closing in code rather than in a reply.

## Column C — but it now says `.wav`, and that is the point

The shared generator derives the extension from the card's audio paths, which say `.ogg`. That is
the name the **engine loads**, not the format a person records. `gen_tts` writes **RIFF/WAV content
under an `.ogg` name** (its own note: Chromium sniffs the container), so `build/` is 124 WAV files
wearing an `.ogg` extension, and only the dist step produces real Opus.

Asking a studio for "vo_landing.ogg" would therefore get us a real Ogg — which is the one thing
that must not arrive:

> **The karaoke word-highlighting is timed by reading the waveform.** `_wav_mono16` in the recipe
> accepts **16-bit PCM RIFF and nothing else**. Hand it an Ogg, an MP3 or a 24-bit WAV and it
> returns no segments: the clip still plays, the highlighting silently falls back to wall-clock
> guessing, and the words drift off the voice. That is precisely the defect reported in r5e, and it
> would come back one clip at a time **with no error anywhere** — the length guard only checks that
> a clip is long enough to hold its line, so a correctly-long clip in the wrong format passes every
> check we have.

So column C now reads `<vo_id>.wav`, and `intake_vo.py` does the renaming into `build/`.

The SUMMARY tab carries the spec in full: **WAV, 16-bit PCM, mono, 48 kHz**, no added silence, no
fades, no music bed, no brickwall normalisation.

## `intake_vo.py`

```
PYTHONUTF8=1 python intake_vo.py <delivered_folder> [--apply]
```

Dry run by default. It reports the real format of every delivered file, rejects the ones that would
break the highlighting, flags names that are not audio ids in this lesson, lists which lines are
still outstanding, and only then — with `--apply` — copies them in under the `.ogg` name the engine
wants. It refuses to apply at all while anything is rejected.

Exercised on a deliberately mixed folder:

```
vo_g2_more        24000Hz 1ch 16bit                      replace vo_g2_more.ogg
vo_g3_reveal      24000Hz 1ch 24bit  <- must be 16-bit    !! REJECTED
vo_landing        24000Hz 1ch 16bit                      replace vo_landing.ogg
vo_not_a_real_id  -                                      !! not an audio id - SKIPPED
vo_w_kela         not WAV (Ogg)                          !! REJECTED
2 accepted, 2 rejected, 1 unrecognised, 77 lesson lines not in this delivery
```

Both rejects are the silent kind: a 24-bit WAV and a real Ogg, each of which plays perfectly and
each of which would have quietly desynced its page.

## Sample rate

Deliver **48 kHz**. The current machine clips are 24 kHz, the waveform reader takes any rate, and
`dist` encodes to Opus at 48 kHz mono — so 48 kHz in means no resample anywhere and a better master
than what it replaces.

## Receipt

- `make_manifests.py` rewrites column C and writes the format block; both manifests regenerated
- `intake_vo.py` added at the bundle root, mirrored to the factory KG with both manifests
- No engine, card or asset change in this round

---

# r5x — the human VO delivery

81 studio recordings arrived in `build/assets/Audio/voiceovers`, named by VO id. **79 are in place.**
Two were sent back; both are described below, and neither was caught by anything except verification.

```
intake   81 accepted, 0 rejected, 0 unrecognised, 0 lesson lines missing
         all 16-bit mono WAV, complete coverage of the manifest
```

`intake_vo.py` took them in and the rebuild recomputed `audio_dur` and the speech map, so **the
word-by-word highlighting re-timed itself to the new voice** — the reason the format spec insisted
on 16-bit WAV in r5w.

## Two guards fired, and both were right

**1 · The bare-sound guard — a real regression, and a threshold that was measuring the wrong thing.**

`vo_snd_ch` came back as the full carrier `"च से चम्मच।"` (2.36s) because that is what its
`audio_text` says, and `audio_text` doubles as the recording script. A studio reads what it is given.
Trimmed to its first speech burst using the build's own detector — **2.36s → 0.75s**, the human
voice kept. The untrimmed take is in the scratchpad.

But the same guard also failed all six `vo_ltr_*`, and those were **correct**: their text is a single
अक्षर and that is what was recorded. The threshold was 0.8s, which really measured *"spoken by the
TTS"*. The two populations are far apart —

```
human single letter   0.84 - 1.36s
carrier phrase        2.24 - 2.36s
```

— so the discriminator belongs between them, not below both. **0.8 → 1.6s.** It still caught
`vo_snd_ch` in this very delivery.

`intake_vo.py` now warns about this at delivery instead of letting it surface as a build failure.

**2 · The length guard — `vo_p8_prompt` was the wrong line entirely.**

1.68s against the 4.12s its 105 characters need. Transcribed, it says **"बहुत बढ़िया"** — a generic
praise line, not the lesson summary the card carries (*"शाबाश! आज हमने सीखा — वाक्य ध्यान से सुनना…"*).
Reverted to the previous take so page 15 still speaks its recap.

## What verification found that no guard could

Every clip was transcribed, and every word clip additionally put through forced choice, because
transcription is unreliable on isolated words — that is the method note from r5d, and it mattered
here: eight word clips "failed" transcription and **22 of 23 passed forced choice**.

**`vo_w_kamal` says "काल", not "कमल".** Open transcription three times in a row returns काल; the
म is missing. Against the full word list it scores **0/6**, identified as लाल or कबूतर. (Head to head
against लाल alone it scores 6/6 — which is why a two-option test is not evidence.) Reverted; the
restored take transcribes as कमल three times out of three.

### Seven lines were recorded from a different script

These play fine and are good Hindi. They are simply **not what the card says**, which matters because
`prompt_hi` is both the on-screen text and the VO on several pages:

| id | card says | recorded |
|---|---|---|
| `vo_p4_try` | तुमने आखिरी आवाज़ सुनी। हमें वह आवाज़ ढूँढनी है… | यह आवाज़ बार-बार नहीं आई। वाक्य पढ़कर देखो… |
| `vo_g1_correct` | शाबाश! इसमें प की आवाज़ है। | शाबाश |
| `vo_g1_correct2` | शाबाश! इसमें च की आवाज़ है। | शाबाश |
| `vo_g1_hint` | ध्यान से **सुनिए**, इसमें प की आवाज़ नहीं है। | ध्यान से **देखिए** … + प वाले चित्र पर टैप कीजिए। |
| `vo_g1_hint2` | ध्यान से **सुनिए**, इसमें च की आवाज़ नहीं है। | ध्यान से **देखिए** … + च वाले चित्र पर टैप कीजिए। |
| `vo_p7_hint` | च की आवाज़ शुरू में भी… पूरा शब्द सुनो। | शब्द को दोबारा पढ़ो। च की आवाज़ शुरू में भी… |
| `vo_g5_prompt` | हर चित्र का नाम सुनिए और उसे सही डिब्बे में डालिए। | …उसे **उसके प या च वाले** सही डिब्बे में डालिए। |

`vo_g5_try` also reads 88%, but that one is ASR noise on डिब्बा — it is fine.

**`vo_g5_prompt` is the urgent one: it is page 10's on-screen text.** The panel and the voice now say
different things, which is the exact defect class this bundle has been closing all round.

**`vo_g1_hint`/`hint2` say देखिए where the card says सुनिए** — and this is a *listening* lesson. "Look
carefully" is arguably the wrong verb for a phonics hint, so this is not a free swap either.

These were left exactly as delivered rather than quietly rewriting the lesson's script to match
whatever was spoken. Which way each goes is the SME's call, not mine.

## Receipt

- 79 of 81 clips are the human delivery; `vo_p8_prompt` and `vo_w_kamal` remain the previous take
- All three guards pass on all four trees; HTML byte-identical
- **dist 9.80 MB — 202 KB under the cap** (the human takes are longer overall: +93 KB)
- Delivery masters filed at `_assets_round4/voiceovers_SME_20260922/` (14 MB, 81 WAV) — moved out of
  `build/assets/Audio`, which is for game clips
- Manifests regenerated against the new durations

## Still needs a human

1. **The seven script mismatches above** — re-record to the card, or change the card to match? One of
   them is on-screen text and two change a verb that matters pedagogically.
2. **`vo_p8_prompt` and `vo_w_kamal` need re-recording**, or page 15's recap and the balloon page's
   कमल stay in the old voice among 79 human ones.
3. **Nobody has listened to the delivery.** 79 clips verified by machine; that is not the same as
   hearing them.

---

# r5y — the cover trapped the child, and r5r built the trap

SME: *"when we are tapping the play button after completing the VO it is not moving ahead and playing
the same VO again."* Both symptoms, one listener.

## What was happening

The cover carries an autoplay fallback: a one-shot `pointerdown` listener that starts the greeting if
the browser refused to autoplay it. Its guard asks **"is audio audible right now?"** — and that is
false in **two** different situations:

1. autoplay was blocked, which is what the listener is for, and
2. the greeting simply **ended**.

Before r5r the second case was unreachable in practice: the child could tap through mid-clip, so the
first `pointerdown` almost always landed while audio was sounding. **r5r disabled the button until
the greeting finishes** — which *guarantees* the first `pointerdown` happens after it. So on every
run the fallback fired and replayed the 15-second greeting.

And because a replay calls `setStartBtnReady(false)`, it **disabled the button in the middle of the
child's own gesture**. A disabled element receives no `click`, so the cover stopped advancing too.

Measured before the fix — the whole event trace for a real tap on the button:

```
pointerdown@741,591 defaultPrevented=false
(no click event at all)
```

The star-burst hit test was the obvious suspect and was **innocent**: 0 stars had a padded hit box
over the button, and `defaultPrevented` was false.

## The fix

**1 · Releasing the button IS the signal that the greeting is done, so test that.** The fallback now
fires only when audio is inaudible *and* the button is still disabled — i.e. genuinely "the greeting
never started", never "the greeting finished".

**2 · A replay must never take away a way in that was already granted.** `__greetingDone` is set by
every path that releases the button, and the lock is applied on the first telling only. A child who
has already sat through the greeting and asks to hear it again (the 🔊 chip) is not sent to the back
of the queue — and, more importantly, nothing that replays the greeting can re-trap the cover.

Fix 1 alone would have been enough for this bug. Fix 2 is there because the trap — "something
re-locks the only way forward, mid-gesture" — is worth closing as a class, not as an instance.

## Verified, all three paths

```
tap play after the greeting   -> gate hidden, is-start cleared, slide 0 speaking   (was: stuck)
replay via the 🔊 chip         -> button stays live; tapping play mid-replay advances
autoplay BLOCKED               -> button stays disabled, a gesture still starts the greeting
```

The last one is the fallback's actual purpose, tested by launching Chrome with
`--autoplay-policy=document-user-activation-required`, and it still works.

## Receipt

- Guards pass on all four trees; HTML byte-identical
- No card, asset or dist change — engine only

---

# r6a — the letter lands after the highlighting, shorter tap prompts, and two moves

## 1 · The teach pages hand the letter over last

SME: *"once the letter[s are] highlighted then the च letter will appear on the screen and its VO
will be aligned with it"*, for pages 1, 3 and 5.

The order was `sentence → clear → pause → letter (silent) → mark`. The card arrived **before** the
line was highlighted, which asks a child to hold an unexplained symbol in mind while the sound is
hunted for. It is now `sentence → clear → pause → mark → pause → letter`, so the card is the
**answer** to the repetition they have just watched.

**And it speaks.** `silent: True` is gone, so the card plays `audio.target` as it appears —
`vo_ltr_ch` / `vo_ltr_m` / `vo_ltr_p`, the bare अक्षर. That is the alignment asked for, and it
restores the deck's own row 21 (*"play only the च sound"*), which r4f had dropped to keep the page
to two clips. These pages now carry three.

Measured on all three, live:

```
page 1   vo_line_l2  0.5s → vo_t3_explain 5.5s (paces the marking) → card 13.9s speaking vo_ltr_ch
page 3   vo_line_l3  0.5s → vo_t5_explain 5.1s                      → card 14.1s speaking vo_ltr_m
page 5   vo_line_l1  0.5s → vo_t1_explain 6.0s                      → card 15.4s speaking vo_ltr_p
```

## 2 · The tap prompts are shorter

`जिन शब्दों में “प” की आवाज़ सुनाई दे, उन पर टैप कीजिए।`
→ **`“प” की आवाज़ वाले शब्दों पर टैप कीजिए।`**

on all three tap pages (G2 प, P1 म, P7 च). `prompt_hi` is the VO on these pages, so all three were
re-recorded; they transcribe at 97%.

## 3 & 4 · The running order

Two moves: the sort pair before the balloons, and the न question beside the च question.

| page | was | |
|---|---|---|
| 9 | 12 | **P4** — the न question, now straight after G3's च question |
| 10 | 11 | P1 |
| 11 | 13 | P7 |
| 12 | 9 | **G5D** — watch-the-sort |
| 13 | 10 | **G5** — do-the-sort |

Everything else is where it was.

**The order now lives in one place.** The slide blocks are left where they sit — each carries the
review history of its own page, and cutting them apart to express a sequence would scatter that. A
single `ORDER` list states the running order, with an assert that fails the build if it ever
disagrees with the slides actually constructed. A typo there is a build failure, not a missing page.

**The sort pair is relabelled `practice`.** It now sits after three practice pages, and a slide
labelled `guided` arriving there would report a phase that has already passed — the emitted signals
carry `phase`, and the receipt counts by it. No gate misfires either way (`_gatedPhases` is a Set, so
each gate plays once), but the label should follow the page. Distribution is now
**tutorial 6 · guided 2 · practice 7**.

## Receipt

- 15 slides, new order verified page by page against the request
- All three guards pass on all four trees; HTML byte-identical
- Three re-recorded prompts transcribe at **97%**
- **dist 9.79 MB — 217 KB under the cap**; manifests regenerated

## Still needs a human

**The three re-worded prompts are machine TTS again.** `vo_g2_prompt`, `vo_p1_prompt` and
`vo_p7_prompt` were part of the studio delivery and matched; changing their wording made those takes
wrong, so they fell back to the generated voice. They go on the re-record list with the two from r5x
(`vo_p8_prompt`, `vo_w_kamal`) and the seven script mismatches — **twelve lines in total**, all
listed in the manifest.

---

# r6b — the card lands on the words that name it, and two pages move again

## 1 · The letter is cued INSIDE the explanation, not after it

r6a moved the card to the end of the teach sequence and gave it its own spoken अक्षर. The SME's
refinement: show it **when the voice says "च की आवाज़ बार-बार आई"**, pulsating, and drop that
last clip.

So the card is no longer a beat of its own. `reveal_at` names a token in the explanation script, and
the mark step — which already walks that script with `karaokePlay` to pace the highlighting — brings
the card in when the voice reaches it. Three clips back down to **two**.

**Why the token is the bare अक्षर and that is safe:** `findTok` matches a token EXACTLY before it
falls back to a substring, so the standalone च is found and the च sitting inside चूहे / चार / चने /
चबाए never steals the cue.

**The pulse costs nothing.** `.opt-cell.ss-lit` already carries `ssLitPulse`; revealing with that
class is the pulsation.

Measured, all three:

```
page 1   vo_line_l2 → vo_t3_explain; card at 5.15s of a 7.60s clip, on "च की आवाज़ बार-बार"
page 3   vo_line_l3 → vo_t5_explain; card at 5.60s of 8.12s, on "म की आवाज़ बार-बार"
page 5   vo_line_l1 → vo_t1_explain; card at 6.23s of 8.56s, on "प की आवाज़ बार-बार"
no separate bare-letter clip on any page; pulse animation confirmed as ssLitPulse
```

The landing point sits a little later than a flat `token/total × duration` estimate would put it,
because `karaokePlay` weights tokens by अक्षर and follows the clip's speech map rather than dividing
the time uniformly. That is the behaviour we want — it tracks the voice, not the arithmetic.

**One safety net:** if the clip stalls, or the token never matches, the card is shown when the clip
ends. It is the point of the page; it must not be possible to lose it to a bad match.

## 2 · Pages 8 and 9 move to just before page 12

| page | was | |
|---|---|---|
| 8 | 10 | P1 |
| 9 | 11 | P7 |
| 10 | 8 | **G3** — "which sound repeats?" |
| 11 | 9 | **P4** — the न question |

G3 and P4 now sit immediately before the sort pair, and the three tap-the-words pages (G2, P1, P7)
end up together at 7–9.

**G3 is relabelled `practice`,** for the same reason r5z relabelled the sort pair: it now follows two
practice pages, and a slide still labelled `guided` would report a phase that has already passed —
signals carry `phase` and the receipt counts by it. Distribution is now
**tutorial 6 · guided 1 · practice 8**.

## Receipt

- 15 slides, order verified page by page; all three guards pass on all four trees
- HTML byte-identical across the four; `app.js` parses clean (`node --check`)
- No new clips and no new art — one clip per teach page was *removed* from the flow
- **dist 9.79 MB — 215 KB under the cap**; manifests regenerated

---

# r6c — a sky for page 14, and balloons that keep rising in it

SME: *"we will need those balloons to keep going up and floating there, also a plain background but
attractive."*

## The background

`#EAF2FB` flat → a single soft vertical sky, deeper at the top and bright near the floor, with one
wide bloom low down where the balloons rise from. **Plain is the operative word**: this page already
carries eight coloured balloons, a mascot and a burst on every pop, so the background's job is to sit
still and let them read. No pattern, no texture, nothing that competes with a balloon for attention.

## "Keep going up" — and the decision inside it

A field of sixteen pastel balloons now drifts continuously up the page behind the play area, each
with its own size, lane, speed, sway and opacity, started mid-flight so the sky is populated on the
first frame rather than filling up over the first minute.

**They are scenery, and the playable balloons deliberately do NOT travel.** That is the whole design,
not a shortcut:

> This is a tap game for a seven-year-old. A target that travels is a target that gets missed, and a
> balloon that rises out of the field takes its word with it — the child would lose the answer they
> were reaching for. So the continuous rising is carried by a layer that has no targets to lose, and
> the play balloons stay exactly where the child aimed.

Verified: the hit boxes move **0px in either axis** over three seconds, and all eight remain
reachable at their centre; the scenery layer is `pointer-events:none`, so a tap can never be spent
on it.

## The play balloons float better where they are

They all ran the same 3.4s / 13px cycle separated only by a delay, so the set breathed in lockstep
and read like a metronome. Each now carries its own duration, amplitude and a small horizontal sway:

```
balloon 0  17px / 3.45s      balloon 4  11px / 3.92s
balloon 1  16px / 3.93s      balloon 5  18px / 4.50s
balloon 2  18px / 4.66s      balloon 6  17px / 5.00s
balloon 3  12px / 4.35s      balloon 7  13px / 5.36s
```

Measured travel of the visible body: **10.9–18.0px**, matching what each was assigned, and no two in
step. The ranges are deliberately narrow — this is buoyancy, not drift.

## Sizing the scenery took two passes

At 26–62px the drifting balloons read as faint blobs and the rising was barely perceptible. They are
now 38–92px against the 164px play balloons: legible as balloons, still less than half a target, so
they cannot be mistaken for one.

## Receipt

- Guards pass on all four trees; HTML byte-identical; `app.js` parses clean
- No new assets — the sky and its balloons are CSS and generated markup
- **dist 9.79 MB — 215 KB under the cap**
- Honours `no-anim` and `prefers-reduced-motion`: the drifting layer is dropped entirely

---

# r6d — the sky empties, and the balloons arrive one at a time, named

## 1 · The drifting balloons are gone

r6c put sixteen of them rising behind the field. The SME read them as disturbing, and they were:
sixteen soft shapes crossing behind eight bright ones is movement competing with the thing the child
is meant to be reading.

**The sky itself stays.** The gradient and the bloom were the "plain but attractive" half of that
request and nothing about them moves — only the balloons behind were the problem.

## 2 · One at a time, each one named

SME: *"I want balloon come on the screen one by one by taking the name of the balloon like patang
ghar machli."*

The old reveal dropped all eight in on a 170ms stagger, silently. Each balloon now flies in and
**says its own word**, and the next waits for that clip to finish. Measured order:

```
vo_g1_prompt → पतंग → आम → पपीता → केला → पत्ता → घर → पानी → मछली
balloons on screen: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
```

That is **eight free exposures to the words before a single tap** — the page now teaches on the way
in rather than only testing.

Taps are held until the whole set has landed, so a board that is still arriving cannot be answered
against.

## 3 · From below, from anywhere, wandering — and never through Swiftie

A transition cannot describe a path with a middle, so the entrance is a keyframed animation: it
starts below the floor at `--ex`, swings across to `--emx` around halfway, and lands on `0,0` — which
is the balloon's own flex slot, so nothing has to know where that is. Each gets its own start, swing,
tilt and duration (1.25–1.75s).

**Swiftie is the one hard constraint, and it took two passes.** The first version tested only the
START position against her box, which let one balloon begin 18px from her edge — a miss that still
reads as a near-collision. It now tests **every point of the path** (start *and* the top of the
swing) against her measured rect, with a 40px margin, and pushes any offender in from her right.
Her box is measured rather than assumed, because the field reflows with `--scale`.

Verified over **six fresh random layouts — 48 balloons, 96 path points, 0 overlaps.**

## The cost, stated plainly

**The intro now runs about 15 seconds** — the prompt, then eight words. That is the direct
consequence of naming each balloon as it arrives, and it is time the child spends listening rather
than doing. It buys eight word exposures; if it proves too long in front of children, the lever is to
drop the per-balloon clip on the SECOND round only, where the words are already familiar.

## Receipt

- Guards pass on all four trees; HTML byte-identical; `app.js` parses clean
- No new assets — the entrance is CSS, and the words are clips the page already shipped
- **dist 9.79 MB — 210 KB under the cap**
