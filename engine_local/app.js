const CARD = JSON.parse(document.getElementById('cardData').textContent);
  const AUDIO_EXT = (CARD.assets && CARD.assets.audio_ext) || "mp3";  // 32c-b: THE RUNG-2 HINT WAS BEING KILLED BY ITS OWN REVEAL, 1ms IN. revealOne() opened with play(audioFor(slide,'reveal')) while dragWrong(slide) had started hint2 in the SAME event, and play() begins with stopAudio() -- so the longest, most informative clip in the lesson (the one that NAMES the order) was cut at ~1ms of 5931-8651ms, measured on all four parts of HIKGH04_L01_S02. A child who got it wrong twice heard nothing of the help authored for exactly that moment. It also spoke 'यह सही क्रम है।' before anything was placed -- the same premature-reveal defect 25d removed from MATCH_DRAG_N. Now guarded: `if(!isPlaying) play(reveal)`, so a revealOne() reached in silence still speaks it, and the reveal line is not lost either way -- celebrateThenAdvance(slide, revealed=true) speaks it when the child then places the tile. Applied to BOTH copies (SEQUENCE_DRAG + MATCH_GENDER_PAIRS hold byte-identical revealOne()s; leaving one copy of a copy-pasted bug is how 31o's missing clearHold survived in these same two mechanics). SCOPE MEASURED before landing, not claimed: _tools/prove_scope.py --type SEQUENCE_DRAG MATCH_GENDER_PAIRS -> 6 of 33 bundles can reach it, 27 provably cannot. Patch C of vo_no_cut_standard.py was NOT applied: 32b nocut had already unified the reveal path into one celebrateThenAdvance(slide, revealed) behind a single word-wait, which is C's intent in a better shape -- the script now recognises that instead of refusing the whole run and blocking this BLOCKING patch behind it. · 32d: max_attempts fallback ||3 -> ||2 in 10 sites. The engine's own default contradicted the house value and would have silently handed a 3rd attempt with an empty third rung to any new game that omitted the field -- the defect closed fleet-wide on 08-03. Inert today (all 33 cards set it explicitly); this closes the door, it does not change a shipping game. · .mp3 (maths) / .ogg (Hindi FLN)
  const IMG_EXT   = (CARD.assets && CARD.assets.img_ext)   || "png";  // .png (working) / .webp (delivered/FLN) — twin of AUDIO_EXT (fixes A3)
  const ENGINE_VERSION = "2026.08.04b-r4-unified";  // 31o: TERMINAL HELP LEFT THE TRAY PERMANENTLY DEAD IN TWO MECHANICS. revealOne() -> terminalHold() disables every OTHER tile with inline pointer-events:none !important and opacity:.4 so the child can only act on the revealed one. clearHold() has existed to release that since [28l] and PATTERN_BUILD, SEQUENCE_COMPLETE and SORT_GENDER all call it — but SEQUENCE_DRAG and MATCH_GENDER_PAIRS never did. So after two wrong tries, placing the revealed tile CORRECTLY left every remaining tile dead and faded for the rest of the slide: the game simply stopped accepting input, with the tray visibly greyed. Yasir hit it twice on HIKGH04_L01_S02 P3's SEQUENCE_DRAG and named the precondition exactly — "even after placing the correct after two wrong attempts, the cards remain blocked". MATCH_DRAG_N was never affected because it has its own local clearHelp() on the correct path. Both now call clearHold(tileRow) before settle(). NOTE for future engine work: terminalHold and clearHold must be added in the SAME edit — a mechanic that dims without releasing looks fine in every static check and only fails after a specific 3-step sequence (wrong, wrong, right), which no existing harness walked. · 31n: REVERTS 31m's 20s DRAG-GATE WINDOW (my regression, Yasir caught it in minutes) AND STOPS A FILLED SEQUENCE_DRAG SLOT SHRINKING. (a) 31m widened installDragVoGate's window from 4000ms to 20000ms reasoning that real clips outlast 4s. True, but it misread the window's PURPOSE: blocking during a live clip is the CSS lock's job (body.vo-lock is exact — on for precisely as long as isPlaying); this window is the ESCAPE HATCH. Widening it turned a stalled or slow-to-end clip into a twenty-second dead screen — place one letter correctly, then every remaining tile refuses to move. Back to 4000ms. The gap 31m was really chasing (.cdm-objtile/.cdm-card/.combine-drag having no CSS entry, so relying on this gate alone) stays closed in the CSS rule, which is where it belonged. LESSON: widening a safety valve is not the same as tightening a gate. (b) .seq-slot 104px -> 150px. SEQUENCE_DRAG's settle() does zone.classList.remove('dd-zone') so a filled slot stops accepting drops, and .dd-zone was the ONLY rule sizing it at 150 — so a correctly placed letter's box instantly shrank to 104 beside its 150px empty neighbours (measured 79 vs 114 on screen at the 0.757 fit-scale). Sizing now lives on .seq-slot itself and no longer depends on a class the mechanic deliberately removes. · 31m: THE DRAG VO-GATE'S SAFETY WINDOW WAS SHORTER THAN THE CLIPS IT GUARDED. installDragVoGate decided `isPlaying && now-_voStart < 4000`, so it stopped blocking FOUR SECONDS into every line while the child was still being spoken to — and real VO is routinely longer (this game's own placeholder clip is 4.41s). It never surfaced on .dd-tile or .sort-item because the CSS lock covers those and CSS has no escape hatch; but .cdm-objtile, .cdm-card and .combine-drag appear in the gate's SEL list with NO CSS entry, so they were live on the JS gate alone and grabbable mid-sentence. Both halves fixed: those three classes join the body.vo-lock rule (CSS is now the primary gate for every draggable the gate names), and the JS window becomes 20s — purely a stall backstop so a clip that never ends cannot freeze the tiles forever, not a mid-clip escape. play()'s existing 800ms/1200ms fallbacks already handle missing and undecodable clips. Measured with a stubbed 6s Audio (headless here cannot decode, which is why a real-clip window never appeared in earlier tests): tile stays pointer-events:none for the full clip and the drag is refused at t=4.5s, freeing only when the clip ends. · 31l: two more mechanics onto the vo-lock list — COMBINE_COUNT (.combine-grp, cursor:grab) and ORDER_BY_ATTR (.ord-item, five slides across guided AND practice on MTKGA02_L02_S02). Both were found by RE-RUNNING _tools/vo_lock_audit.py after 31k, which is the point: the lock is a denylist and a denylist cannot tell you what it is missing — only walking every slide with the lock forced on can. Run that audit whenever a mechanic is added. Children need no entry (.ord-obj-img is inside .ord-item; pointer-events:none blocks descendants). · 31k: THE VO LOCK WAS SHORT BY NINE MECHANICS (style.css). Yasir 2026-08-02: "even when the VO is being played the student can drag/tap the card." body.vo-lock is a DENYLIST of interactive classes, so any mechanic not named in it stayed fully live while a clip spoke — and adding a mechanic never failed loudly. Audited every slide of HIKGH04_L01_S02 P1-P4 and the 6 maths games with the lock forced on (_tools/vo_lock_audit.py): drag/drop and tap-option slides WERE locked correctly, but INTRO (.intro-letter), MEET_LETTER (.meet-letter-box), SHAPE_INTRO (.intro-shape), TRACE_SEQUENCE (.tseq-box), TRACE_SHAPE (.trace-box), ROTATE_SHAPES (.rot-tile), COUNT_TAP (.count-item) and MAKE_EQUAL (.cobj/.balance-add) were not. TRACE_SHAPE runs in guided AND independent, COUNT_TAP in practice: a stray tap there spends one of the child's two attempts while the instruction is still being read to them. Parents only — pointer-events:none blocks descendants, so .cobj-img/.count-badge/.rot-art/.rot-name need no entry. .tut-audio stays reachable on purpose (it is the replay control) and already refuses mid-VO in JS. STILL POINTER-EVENTS ONLY: no opacity, no filter, no pale board — the screen must look identical, the cards simply do not respond. · 31j: THE CAPTION CHIP IS FOR TILES THAT CANNOT FIT THE BADGE, nothing else — supersedes 31h, 31i and two private fixes. The constraint is TWO-SIDED: never bury the zone's word, never smother the picture. 31h keyed on the .zone-lbl ELEMENT (always emitted, empty when unlabelled -> 15 word tiles would have been clipped into a 62px badge). 31i keyed on label TEXT (lifted from HI01H02_L01_S01's private fix) but protects only the label, so on HIKGH02_L02_S01 — zones with no label — single letters got the caption chip, which that game's own engine_local had MEASURED at 47.1% of the tile over the art vs 9.4% for the corner badge. HIKGH02_L02_S01/S02's private [...text].length>1 counts CODE POINTS, so अं and अः (HIKGH04_L01_S01 P2, labelled zones) read as words and would caption straight onto the label. Now: a single BASE character always fits the badge and always gets it; only a genuine multi-character word takes the caption, and only where no label would be buried. Base characters means stripping the Devanagari combining block (matras/anusvara/visarga/virama/nukta) before counting. Fleet census of all 90 MATCH_DRAG_N tiles: 68 letters on labelled zones, 7 letters on unlabelled zones, 15 words on unlabelled zones, ZERO words on a labelled zone — the two clauses never fight; the label clause is a guard for a future card. · 31i: 31h's LABEL TEST WAS WRONG FOR WORD TILES. The zone builder always emits `<span class="zone-lbl">${p.picture||""}</span>`, so an UNLABELLED zone still carries the span, empty — and `!zone.querySelector('.zone-lbl')` read it as LABELLED and gave it the 62px corner badge. Measured 15 word tiles that would have been clipped: HIKGH04_L02_S02 (घर नल कप बस जग) and HI01H04_L03_S01 (घास माला दादा पापा नाक कान). Now tests the label's TEXT. Found by reading HI01H02_L01_S01's engine_local before sweeping it: that game had diagnosed and fixed this exact bug on 2026-07-28 ("after getting the letter placed on the correct answer card it overlaps the images") with the correct textContent check, and HIKGH02_L02_S01/S02 had a weaker grapheme-count variant from 2026-07-29 — three private fixes for one engine bug, none upstreamed, which is the isolation tax in one line. The canonical fix now supersedes all three. · 31h: TWO MATCH_DRAG_N DEFECTS YASIR CAUGHT ON HIKGH04_L01_S02 P1 G4, 2026-08-02. (a) THE GUIDE HAND OUTLIVED THE TASK. travelNudge loops iterations:Infinity from coordinates captured ONCE, and only stopNudge() cancels it. The correct-drop path ran leaveTrayGhost -> clearHelp -> settle and none of them called it; clearHelp only strips CSS classes. So once terminal help had fired, the child placing that very tile correctly left the hand looping over the ghost slot the tile came from — pointing at an empty box, and still pointing at a FINISHED pair while they worked the remaining ones. stopNudge() now runs in settle(), the single correct-placement path (drop AND reveal). (b) THE PLACED LETTER COVERED THE PICTURE'S WORD. settle() added `md-word` unconditionally while its own comment called it the caption look "for WORD tiles (not the letter badge)" — there is no word/letter branch here, every tile comes from p.letter. md-word is bottom:6px/left:50%, exactly where .zone-lbl sits: measured a 40x21px chip over a 40x21px label, 100% occlusion, so matching घ to the house DELETED the word घर — the reinforcement the exercise exists for. .dd-tile.snapped's top-right corner badge had consequently never shipped. The new test is NOT letter-vs-word (Devanagari makes length useless: अं is one letter in two code points) but "is there a label to cover" — checked per zone at settle time. Every word-tile card in the fleet (HI01H04_L03_S01, HIKGH04_L02_S02) renders no .zone-lbl and keeps the caption chip unchanged; labelled cards get the corner badge. · 31g: TWO AUTONOMY RULINGS FROM YASIR, 2026-08-02. (a) SHAPE_INTRO GETS AN AUTONOMOUS PATH. It was the last teaching mechanic with none at all — it unlocked आगे only at tapped.size >= shapes.length, so the child was held hostage by the lesson that is supposed to teach them. This is INTRO's [16h] chain shape-for-letter: each tile highlights and speaks itself, the instruction VO plays, _autoDone flips, आगे unlocks, and taps THEN become per-shape replays (taps are ignored before that so the lesson cannot be cut off). Gated on data.auto, so no card changes behaviour until it opts in. A missing clip is a silent beat that still advances — play() fires its callback on both the no-src and the error path — so an un-recorded build teaches itself rather than stalling on a dead screen. (b) NO आगे ON SELF-ADVANCING SLIDES: "we dont need the buttons in guided and independent". Every tap mechanic already hid the button; MATCH_DRAG_N and SEQUENCE_DRAG were the only non-tutorial slides still showing one, so a run read as button-free and then sprouted a button on the drag pages. It was never a completion signal there — filling the last zone / placing the last tile calls celebrateThenAdvance -> completeSlide unaided, so the button could only skip the child PAST their own finished work. Verified before removing: nothing is stranded, which is the same contract the tap slides have had all along. · 31f: INTRO TILE SIZER NOW CLAMPS BY HEIGHT — the tutorial heading was sitting BEHIND the letters. Yasir 2026-08-01 on HIKGH04_L01_S02 P1. The sizer only ever considered WIDTH: when n letters could not fit one row at the 110px touch floor it wrapped to two rows and then RE-EXPANDED each tile back toward the 184px cap, because 4 of 8 do fit a 960px row. Result: a 392px grid inside the 318px .tut-content box. That box centres its overflow, so half the excess (37px layout / 28px on screen at the 0.757 fit-scale) rode UP into .tut-prompt. Measured, not guessed: P1 (8 letters) and P2 (9) overlap by 28px and 22px; P3 (5) and P4 (6) stay on one row and are clean — which is exactly why it looked intermittent. FIX: row COUNT still comes from width alone (behaviour unchanged for every already-correct slide); only the tile SIZE is now additionally clamped to the real available height, host.clientHeight, falling back to 318 when a phase-gate blur has the card hidden and clientHeight reads 0. TOUCH=110 stays a hard floor: a viewport too short for that overflows rather than shrink a KG tile below a reliable target. Two-row grids now compute (availH-GAP)/2 = 149px instead of 184px. · 30o: THE TTS FALLBACK IS REMOVED ENGINE-WIDE. Yasir 2026-07-31, urgent, after hearing a robot voice on a game whose VO is 100% human: "there should be no way to fall back on tts, it is fine if we dont have audio, we will know if an audio is missing but having tts is worse." _ttsSay was added at 20a as a REVIEW PLACEHOLDER so an un-recorded build was never silent. That reasoning was backwards and this ruling corrects it: a synthetic voice MASKS a missing clip. It made a broken build sound finished, so nobody could hear the gap the placeholder existed to cover — and worse, it spoke over 60-of-60 HUMAN VO whenever autoplay was refused (see 30n). Silence is diagnostic; a missing clip must read as missing. WHAT CHANGED: both call sites now go straight to the silent beat they already had as their alternative (onFail -> setTimeout(fire,1200); no-src -> setTimeout(fire,800)), and _ttsSay's body is replaced by `return false`. The browser speech API is unreachable from engine code: zero SpeechSynthesisUtterance constructions, zero speechSynthesis.speak, zero live call sites, all measured on comment-stripped code. WHY A STUB AND NOT A DELETION: any call site this sweep did not find — a per-game engine_local, an older isolated copy, a build script — would throw ReferenceError on a deleted function and take the entire slide chain down with it, turning a wrong-voice bug into a dead game. Returning false routes every caller into the silent path that already exists. Same trade as the unused @keyframes kept at 30j/30l: the stub is the safe half. stopAudio()'s speechSynthesis.cancel() is deliberately KEPT — nothing should be speaking now, but a browser still holding an utterance from a CACHED older build gets silenced by it, and cancelling is not speaking. NOTE ON SCOPE, because a parallel session reported this as a two-game fix: 30n already removed the autoplay trigger on all 28 games, and this removes the fallback itself on all 28 — neither was ever per-game, and a per-game edit to engine_local would have left 26 games speaking. Swept by _tools/no_tts_standard.py. Consequence to accept knowingly: on the ~26 games whose clips are still Gemini TTS FILES (measured 2 of 28 fully human, _tools/vo_provenance.py), those files still play — this ruling removes the browser-voice FALLBACK, not TTS content. Un-recorded lines that had no file at all are now silent, which is exactly what he asked for.  30n: THE LANDING SPOKE IN THE OS VOICE BEFORE THE HUMAN CLIP. Yasir 2026-07-31, on multiple games: "the first time audio being played on the landing screen is the tts audio, and when i click the volume button again on the landing page then the human recorded audio is played." Confirmed HI01H07_L01_S02 and HI01H01_L02_S05. CAUSE: a.play() rejects for TWO different reasons and onFail treated them alike. A missing or undecodable file SHOULD fall through to _ttsSay — that is the deliberate review placeholder for un-recorded lines. But the browser ALSO rejects with NotAllowedError under its autoplay policy, and that fires on every single load before the child's first gesture. So on a game whose VO is 60/60 human, the landing spoke browser speech-synthesis, and the gesture that finally let the real file play was his tap on the volume button. Now NotAllowedError/AbortError are told apart from a real failure and stay SILENT; onerror and every other rejection still route to onFail, so the placeholder keeps working where it is wanted. fire() is still called on the silent path and is NOT optional: play() has already run setPlaying(true), so returning without it would leave body.vo-lock on and the entire screen untappable — a soft-lock traded for a wrong voice. WHAT THIS COST, WRITTEN DOWN: _ttsSay's own header asserted it was "SELF-DISABLING - fires only when the MP3 is missing; once real clips ship, play() succeeds and this never runs". That is true only AFTER a user gesture, which a landing screen by definition does not have. I READ THAT COMMENT EARLIER THE SAME NIGHT while answering his TTS question, repeated its claim back to him as an aside — "no TTS file ships, but a clip that fails to load will be spoken by the OS voice" — and never tested the autoplay path, so he found it by pressing play. A comment asserting a safety property is not the property; when a docstring claims something is self-disabling, that is the line to go and prove. Related and still true: 30m guarded the pointerdown fallback so the greeting no longer RESTARTS on the first tap; these are two different landing-audio bugs and both sweeps live in _tools/landing_vo_standard.py.  30m: TWO LANDING FIXES — MY 30l REGRESSION, AND THE GREETING RESTARTING. Yasir 2026-07-30: "shuru karein is not perfectly in the button. also the landing VO does not seem fine." (1) TEXT OFF-CENTRE IN THE START BUTTON — MINE, from 30l. I set height:64px with padding:12px 36px on a 4.54px border, which leaves 64-24-9.08 = 30.9px of content box for a 32px font: the line box does not fit, so the text is pushed off-centre. Before 30l the pill had NO fixed height and grew to its text, so padding-centring happened to work; copying his approved build's HEIGHT without copying centring with it is what broke it. Now box-sizing:border-box + inline-flex + align-items:center + line-height:1 + padding 0 36px — the line box is centred rather than balanced by padding. Devanagari is why padding-centring can never be trusted here: matras rise above the em box and conjuncts drop below it, so one padding value reads differently per string. (2) THE LANDING GREETING RESTARTED ON THE FIRST TAP. `window.addEventListener("pointerdown", ... playLanding())` is an autoplay-POLICY fallback: if the browser refused the greeting on load, the first gesture is our chance to start it. It fired UNCONDITIONALLY, so whenever autoplay HAD worked the child's first tap anywhere restarted the 9.04s greeting from the top, and on a tap that happened to be शुरू करें it bled into the tutorial. Now guarded on whether sound is genuinely moving (currentAudio && !paused && !ended && currentTime>0) rather than on "did we call play()" — on a BLOCKED autoplay we did call play(), so a call-flag would have killed the very fallback the line exists for. The सुनो chip's own playLanding() is deliberately untouched: an explicit replay must always replay. MEASURED while diagnosing, and worth recording because it answers a standing question: HI01H07_L01_S02 ships ZERO TTS. All 60 wired clips match Downloads\HI01H07_L01_S02_VO_FINAL.zip on duration to within 0.15s, vo_landing is 9.04s identical across human WAV -> factory ogg -> dist ogg, and the only non-VO asset is sfx_celebrate. Its CHANGES.md note about 34 Kore TTS placeholders is SUPERSEDED — a later session wired the FINAL human drop on 07-29. Note the drop names files `<id>.ogg.wav` (double extension); stripping one extension makes every id mismatch and reports 0 overlap, which cost me one false alarm. Engine caveat: play()'s onFail still routes to _ttsSay(), a BROWSER speech-synthesis fallback — no TTS file ships, but a clip that fails to load will be spoken by the OS voice. Isolated copies swept by _tools/start_btn_standard.py (1) and _tools/landing_vo_standard.py (2).  30l: THE START BUTTON (शुरू करें) STANDS STILL, AND IS NOT FAT. Yasir 2026-07-30, and this was his THIRD ask. The first two times I read "the volume button hovers ... make it a little slim" plus a landing screenshot and fixed `.audio-chip`/`.tut-audio` (30j), reporting 28/28 twice. He finally spelled it out: "i am not talking about the audio button — i am talking about the start button". THREE round buttons live on that one screen — .sg-btn (the शुरू करें pill), .sg-vo (the small blue listen chip at Swiftie's hip, hardcoded 58px, does NOT read --chip-size), and .audio-chip (question slides, --chip-size) — and I matched the wrong one twice. THE LESSON IS NOT "ask more", IT IS THAT MY AUDIT CONFIRMED MY OWN EDIT: both green receipts measured the element I had just changed, never the element in his screenshot. A sweep proves a value was written; it says nothing about whether it was the right value to write. When a ruling comes with a screenshot, identify the ELEMENT from the screenshot before choosing the selector. (1) NOT HOVERING: `animation:sgBtnPulse 1.4s ease-in-out infinite` sits on the BASE .sg-btn rule, so the pill breathes continuously from the moment the landing paints — it is not VO-linked at all, which is why chasing VO state found nothing. Killed engine-wide; @keyframes sgBtnPulse stays DEFINED but unused, since a dangling `animation:` naming a deleted keyframe fails silently. His own approved Strilling/Pulling build ALSO runs sgBtnPulse — when his words and his older approved build disagree, the words are the newer ruling and win. (2) NOT FAT: ours shipped `padding:14px 54px` with NO height, so the pill grew to its text at ~76px tall against the 64px his approved build ships — 19% taller, which is what "fatty" meant. Now padding 12px 36px + height 64px + min-width 186px + bottom 34->40px, every number measured off Downloads\HI01H08_L01_S02_Pulling_Streeling_Pehchano.zip. Width is deliberately NOT pinned to his width:250px: that belongs to the IMAGE variant (.sg-btn img, display:none on the text variant) and forcing it would make the pill WIDER than the one he called fat. Content width lands ~202px — slimmer than his reference on both axes. Isolated copies swept by _tools/start_btn_standard.py.  30k: THE FIGMA GREY ON THE TRANSITION SCREEN, THE UNFRAMED STIMULUS, THE SMALLER ANSWER CARD. Three Yasir rulings 2026-07-30, all engine-wide. (1) GATE SCRIM = rgba(57,55,55,.6) — #393737 at 60%, which he read off the ORIGINAL FIGMA transition frame with an eyedropper and sent as a screenshot. It replaces rgba(64,64,70,.58), which was MY approximation of the meeting's "dark 60% blur". This does NOT reopen 30b: he removed the grayscale FILTER, which desaturates the whole scene behind the gate, and kept the grey SCRIM, which only darkens it — the two read identically in prose and completely differently on screen, which is exactly why 28b/30b flip-flopped. All SIX real .phase-gate blocks were normalised to the one value (base rule, the is-start override that used to be `transparent`, and the late overrides), because the LAST declaration wins and a stale override left behind is invisible until someone screenshots it. (2) THE STIMULUS PICTURE IS NEVER FRAMED — "remove the container surrounding the cat image ... apply this for other pages with same mechanic". It was already unframed in TUTORIAL only; the 27c note says so in writing ("the same stimulus stays framed in guided/independent/mastery"). That scoping is now dropped: it is the same teaching art in every phase. Chrome only, sizing untouched, so nothing reflows. (3) ANSWER CARDS ~12% SMALLER — "make the answer card a little bit smaller": .opt-cell min-height 210->184, column caps 300/260/230->264/229/202, option picture 134->118, and the no-stimulus override 300->264 so it keeps its ratio to the base card. .big-glyph STAYS at 96px — on a letter/numeral card the glyph is the thing being learned, 96+22px of label still fits inside 184px, and nobody asked for a legibility cut; the option PICTURE shrinks because a photo is a referent, not a taught letterform. Also only helps the 27h tutorial-fit work, which fights overflow. Isolated copies swept by _tools/gate_standard.py (1) and _tools/card_standard.py (2,3); both audit the LAST EFFECTIVE declaration on comment-stripped CSS, never a marker string — and both now mask comments in BOTH directions, because this file's changelogs QUOTE the rules they supersede, so a raw-text sweep would have silently rewritten the project's own record of the 28b ruling. Measured: 1 of 7 .phase-gate blocks existed only inside a comment. NOTE FOR THE NEXT SESSION: the deny-ACE guard is on app.js ONLY — style.css took all three of these edits with no unguard step at all. Half a guard.  30j: THE AUDIO CHIP STOPS MOVING, AND GETS SLIMMER. Yasir 2026-07-30: "the volume button hovers when VO is being played, it should be just at one place and not hovering not moving" + "the volume button is to be a little slim". (1) Removed `animation:audioPulse 1s ease-in-out infinite` from BOTH .audio-chip.playing and .tut-audio.playing — a 12% scale throb that ran for the whole duration of every clip, which on the landing is most of the screen time. The @keyframes block is deliberately KEPT though now unused: a dangling `animation:` naming a deleted keyframe fails SILENTLY, so leaving the definition is the safe side of that trade. The .playing class is still toggled by setPlaying and still drives the wave arcs (.wv1/.wv2) inside the icon — those signal playback WITHOUT moving the button, which is the distinction he drew; if he wants them still too it is one more rule. (2) --chip-size 70px -> 66px. NOT my guess: 66px is what BOTH of his reference builds ship (HI01H08_L01_S02 Strilling/Pulling and HI01H08_L01_S01 Ekvachan). Ekvachan also already had NO .audio-chip.playing rule at all, i.e. the design had already dropped the throb and our engine was the straggler — fourth time now that reading his approved build gave the exact value where guessing would have cost a round trip (bird height, VO lock shape, mascot ring, this). ASK FOR THE BUILD THAT LOOKS RIGHT. Isolated copies swept by _tools/audio_chip_standard.py.  30i: THE CELEBRATION PAGE — BUTTON IMMEDIATE, NO TEXT. Two Yasir rulings 2026-07-30. (1) "the button appears after the VO is completed. the button should be there as we get on that screen." CELEBRATION.mount used to hide #endBtn and set state.endBtnPending, which autoPlayChain's onDone released — so on a long celebration clip, or a missing one that fell through to the TTS placeholder, the child sat on a dead end screen with nothing to press. Same silent-non-response family as the VO tap gate. Now shown at mount with hint-glow, endBtnPending left false. The onDone branch is deliberately NOT deleted: it is the flag's only consumer, so anything that still sets it keeps working instead of silently never showing a button. (2) "there should be no sentence on the last page, no praising nothing. the only writings allowed on that page is inside the button." #endTitle (was slide.prompt_hi at 44px) and #endSubtitle (was data.end_subtitle) are now set to "" rather than removed — `.end-title:empty` / `.end-subtitle:empty` are already display:none, so they collapse WITH their margins, and a card still carrying end_subtitle just stops rendering it instead of needing 28 cards edited. The celebration VO is untouched: he banned writing, not the spoken praise, and verify_bundle's "every slide SPEAKS its prompt (incl. celebration)" gate reads the card's audio map, not the DOM. Isolated copies swept by _tools/celebration_standard.py — a shared bump reaches none of the 19.  30h: WHITE RING AROUND THE HEADER SWIFTIE. Yasir 2026-07-30: "see the round white ring around swiftie? none of our games have that. it is necessary." Verified he was right: shared .mascot-circle was border-radius:50% + overflow:hidden with no ring, and the avatar art itself is a plain light-blue disc (rendered sw_anim_rest / sw_head_talking / mascot / sw_head_neutral onto the page bg to confirm no ring is baked in, and the art is byte-identical across all 28 games), so NO game could have shown one. Added background:#9DDBF5 + border:4px solid #FFFFFF + box-shadow:0 6px 14px rgba(0,47,118,.20) — values taken from THREE of his own reference builds that agree exactly (HI01H08_L01_S02 Strilling/Pulling, HI01H08_L01_S01 Ekvachan, Final_Deployed_Sorting_Objects_Skill_2/r4_reference); a fourth (MTKGA02_L01_S01_Final) draws the same ring via box-shadow:0 0 0 4px instead. box-sizing:border-box is global so the 4px sits INSIDE the 132px wrap — the disc shrinks 8px, the avatar does not grow, which is the reference look. METHOD NOTE: this is the third look-ruling in a row where reading his own approved build gave the exact value and guessing would have cost a round trip (bird height 172->clamp, VO lock pointer-events-only, now the ring). ASK FOR THE BUILD THAT LOOKS RIGHT. Isolated copies swept by _tools/mascot_ring.py; a shared bump reaches none of the 19.  30g: THE VO LOCK IS BACK, THE PALE BOARD IS NOT. Yasir 2026-07-30, twice, the second time bluntly: "just red glow on card on wrong tap and cards untappable when VO being played, you dont need to show any affect for untappable, just make it untappable." 28u had bundled TWO things under body.vo-lock — `pointer-events:none` (the LOCK, which he wants) and `opacity:.55` on 27 selectors (the PALE BOARD, which he does not). My 30f removed BOTH, so for one bump nothing was untappable while a clip spoke. 30g restores the class with pointer-events ONLY. RULE GOING FORWARD: never put opacity/filter/grayscale under body.vo-lock; if a "wait" cue is ever wanted it goes on the ONE card the child touched, never on the board. HIKGH07_L01_S02's session had independently reached exactly this shape (pointer-events + cursor, no opacity) before I did — I had stripped its JS toggle in 30f, leaving its correct CSS inert, which is why that game looked unfixed. On 28t: with the lock live a feedback-audio tap is not registered, but it is also not CONSUMED — 28t's real bug was the attempt vanishing, and the child can simply tap again when the hint ends. AND THE REASON HE SAW IT "STILL" BROKEN AFTER 30f: the pale effect survives in 16 stale dists and 16 delivered zips cut before 30f. A fleet CSS fix is not visible until the artifacts are re-cut — _tools/recut_all.py.  30f: THE PAGE-WIDE VO DIM IS REMOVED, AND IT WAS MASKING A REGRESSION I CAUSED. Yasir 2026-07-30: "when VO are being said, the whole game goes like blocked mode. it shouldnt be that way, only the red glow should be on the tapped card, if the answer is wrong. dont block the entire screen fam." This reverses 28u's visible half of CIL-2107 / RULING_no_tapping_during_VO: body.vo-lock dimmed 27 selectors to opacity .55 with pointer-events:none for the duration of ANY clip, so one wrong tap greyed the whole board while the hint spoke. THE SERIOUS PART: that pointer-events:none meant a tap during FEEDBACK audio never reached the tap gate — and the gate is `(isPlaying && !_fb)`, i.e. 28t had deliberately made feedback-audio taps COUNT because it found retries being silently discarded and the 2-attempt ladder defeated through that side door. So my CSS from 28u silently killed a JS fix from 28t, one bump earlier, with every check green. Third time a guard inherited from replaced code has caused this class of bug (28r's helpShown early-return, 28e's .crossed bleaching the flash, now this) — and the first time it was CSS undoing JS, which no test we own would have caught. WHAT REMAINS OPEN: the JS half still refuses taps during the PROMPT clip (24a anti-spam), so a prompt tap is still silently refused, which is literally CIL-2107's original complaint. NOT decided here: making prompt taps land would reverse 24a, which is Yasir's call. Isolated copies are swept by _tools/vo_dim_remove.py — a shared bump reaches none of the 19.  30d: GATE BIRD HEIGHT IS NOW YASIR'S OWN MEASURED VALUE, not my guess. `.phase-gate #phaseGateImg` height 215px -> clamp(120px,26vh,250px). He named the build where the peek "was first seen and it was working just right" — Strilling/Pulling — and that build (Downloads\HI01H08_L01_S02_Pulling_Streeling_Pehchano.zip, index.html) renders the gate at clamp(120px,26vh,250px) and references ONLY assets/UI/peeking_pal.gif, which is byte-identical to the pal_2 gif he sent (500x500, 73 frames, final opaque area 96401, 1286 KB). So the art was never at fault: our gate rendered it at 172px, ~31% under its approved size, crushing the flank feather tufts to 1px rows that read as scratch marks. THREE THINGS I GOT WRONG FIRST, so nobody repeats them: (a) I pre-scaled the asset to force an exact 0.5 render scale — moved banding 2% and made the worst row WORSE; (b) 30c's 215px was my own halfway guess; (c) I read a 66.9% mid-animation area collapse in a session-supplied encode as a peek-a-boo animation in the art, when the SOURCE gif measures 0.0% — it was a genuinely broken encode. The clamp being responsive also fixes the small-window check that a fixed 250px would have failed on a 400px stage. The GIF is deliberately not adopted: 1286 KB vs our 676 KB WebP, the 10 MB decimal cap is a hard gate, and the WebP measures faithful to source (worst frame-to-frame opaque-area drop 0.1%). IF THE BIRD LOOKS WRONG AGAIN, CHECK THE HEIGHT BEFORE THE ENCODE. Standardising this across the 19 isolated copies is what _tools/gate_standard.py exists for.  30c: GATE BIRD RENDERS AT 215px, was 172px. Yasir: "the gif is just leaving such marks badly". Chased this to ground and the marks are NOT ours: both WebP encodes measure byte-faithful to his source GIF (0 ghost px and 0 hole px across all 73 frames, diffed against a cumulative composite of the GIF itself). The marks are the SPIKY FEATHER TUFTS down both flanks of the new yellow-jacket art - at 172px the bird is only 146px wide, each spike lands on about one pixel, and the row reads as scratches. Rendering taller fixes it without touching the art: measured side by side, 215px makes the tufts legible and 260px makes them fully clean; 215 chosen because 260 is a 51% increase on a mascot the design lead already approved. WHAT DID NOT WORK, recorded so nobody repeats it: pre-scaling the asset from 330x389 to 292x344 to hit an exact 0.5 render scale changed row-to-row banding by 2% (12.30 -> 12.01) and made the worst row WORSE (41.9 -> 55.7). The constraint is tuft geometry vs render height, not the encode. Also do NOT flatten the animation to fix it - a session did exactly that during this bump, wrote a 1-frame 68 KB peeking.webp over the MASTER chrome_assets, and every future build would have shipped a static bird; chrome_assets now carries a write-deny ACE on all 24 files because isolation covers engine CODE only and never covered the shared art kit.  30b: TWO LOOK FIXES ON THE TRANSITION GATE, both from Yasir seeing 30a live. (1) GRAYSCALE REMOVED from the phase-gate backdrop - "the bg needs just to be blurred, no need of this gray filter". This reverses point 3 of the 2026-07-28 desaturation note: blur plus the dark scrim carry the gate on their own, and grayscale(.9) drained the colour out of the whole scene behind it so it read as broken rather than as depth. brightness(.92) went with it - it existed only to compensate for the grayscale. The rgba(64,64,70,.58) scrim STAYS: that is the "dark 60% blur" meeting ruling and it is what closes flag S2-a. (2) THE GATE BIRD ASSET was re-encoded, not a code change - logged here only so the pairing is traceable. Yasir: "the gif is just leaving such marks badly". The marks were NOT in the file: all four candidate encodes decode clean via ImageDecoder (348 opaque rows on the centre column, 0 hole rows), so the artefact came from the browser downscaling 330px-wide art with dense feather strokes into the gate's 146px box, per animation frame, inside a backdrop-filter compositing layer. Fixed at the source: assets/UI/peeking.webp is now pre-scaled to 292x344 (2x the height:172px render) with LANCZOS at encode time, so the browser only does a DPR scale. Also dropped minimize_size, which enables WebP frame-diffing and is a real alpha-edge hazard even though it was not the cause here. 676 KB, still under the old 824 KB asset. NOTE for anyone re-encoding this: PIL gives GIF frames as PARTIAL TILES with disposal=None, so they must be composited CUMULATIVELY or you extract feet-only frames; and canvas drawImage() on an animated WebP always draws FRAME 1 (nearly empty here), which makes a naive pixel test report every candidate identical - use ImageDecoder with an explicit frameIndex.  28u: FOUR FLEET FIXES IN ONE BUMP, batched deliberately after 28p-28s showed what per-change bumping costs. (1) THE RED WRONG-ANSWER FLASH WAS INVISIBLE ON 23 OF 27 GAMES. `.stage.thm-toybox .opt-cell` is specificity (0,3,0) and sets background + border-color; `.opt-cell.wrong-flash` is (0,2,0). The theme rule therefore won REGARDLESS of source order and painted cream over the red, so 28p's ruling - the thing Yasir explicitly asked for - rendered on almost nothing for a week while every static check passed and check_system stayed happy. Four sessions found it independently on 2026-07-29; 18 had already patched their own engine_local with !important, which is why those copies carry it and why several handoffs say "the !important is NOT laziness". Fixed here by SPECIFICITY - a theme-scoped (0,4,0) twin selector - not by spreading !important. Any future `.stage.thm-x .opt-cell` needs the same twin: that is the real lesson, and it is the second time this exact cascade trap has cost a week. Same bump also gives `.sentence-word.wrong-flash`/`.tap-all-item.wrong-flash` the `transition:none` their .opt-cell twin has had since 28p - without it the chips EASED into red instead of snapping, and the class is removed after 700ms so the ease ate most of its own lifetime. (2) CONFETTI NOW FALLS FROM THE TOP OF THE PAGE (Yasir 2026-07-29, stated final: "confetti is supposed to come from top of the screen and not from the sides", then "it should drop from the top of the entire page"). Replaces the two bottom-corner cannons that shipped r4 through 28t. Parented to <body> in VIEWPORT coords with position:fixed - NOT to .slide-stage, which is inset, so spawning at the stage top edge visibly began part-way down - and z-indexed above the end-screen overlay. Element and --tx/--ty contract unchanged, so the existing .conf-shot keyframes still drive it. Lifted from HI01H01_L02_S04/S05 where it was built and verified first. `.confetti i{top:-24px;animation:confettiFall}` is still DEAD CSS from the pre-r4 implementation - nothing creates those <i> elements - and is left alone deliberately rather than deleted in the same bump. (3) SORT_GENDER SOFT-LOCK: slides were UNWINNABLE. 28p armed the terminal rung here but the correct-drop branch cleared none of it - .reveal-hold on the tile, .tile-disabled plus INLINE pointer-events:none/opacity:.4 on every other tile, the bins marked, and travelNudge's hand still looping - so `placed === need` could never be reached. Found and reproduced with real pointer drags on G3 and G6 by HI01H05_L01_S01, which asked for it to be fixed first; an unwinnable slide is a straight QA fail, not a cosmetic bug. clearHold() already existed for exactly this and also removes the INLINE styles, which a class-only cleanup would leave behind (looking correct while the tiles stay dead). Guarded on state.helpShown - a guard on CLEANUP, not the early-RETURN that stranded a card red in 28r. SORT_SHAPE checked: it never arms terminalHold, so it was never affected. Deliberately did NOT lift the `speak_on_drop` gate from the same local diff: that was a per-game ruling, and defaulting speak-on-match off fleet-wide would silently mute games that rely on it. (4) THE VO LOCK NOW HAS ITS VISIBLE HALF (CIL-2107 / RULING_no_tapping_during_VO). Taps were already refused while a clip played, but nothing on screen changed, so a child tapped an alive-looking card and got silence - and the ruling is explicit that the silent non-response IS the defect. body.vo-lock is toggled from setPlaying(), the one function every playback exit passes through (stopAudio, and fire() for natural end / supersede / cancelled TTS / missing-file fallback), NOT from a timer, so the lock cannot outlive the audio and strand a slide. Grey never red; replay chips stay live; opacity .55 reads as "wait" not "dead". Lifted verbatim from HIKGH04_L02_S02 (also shipped in HIKGH07_L01_S02). PROCESS: only 8 games build from shared now, so this bump rebuilds 8, not 27 - that is the whole point of isolation. The 19 isolated games do NOT receive any of this automatically and must be told.  28t: A TAP DURING FEEDBACK AUDIO COUNTS INSTEAD OF VANISHING. The tap gate ignored a tap while ANY VO sounded — correct for the PROMPT (24a added it to stop spam-tapping), wrong for the hint clip that plays right after a wrong answer: a child who tapped again while hint1 was still speaking had that attempt SILENTLY DISCARDED. They tapped twice, the engine counted once, terminal help never came — the 2-attempt ladder defeated through a side door, on every tap mechanic in the fleet. `_fb` now marks feedback audio specifically: during it a tap is accepted and interrupts the clip (stopAudio first, so never two voices); during the prompt, taps are still ignored. Cleared on every ladder exit so it cannot leak into later prompt audio. Verified: attempts go 1 -> 2 on the second tap and terminal help fires. I could NOT reproduce the exact audio-mid-flight instant headless (clips end in <60ms there), so that specific moment rests on the 3-line gate being reviewable rather than on a measurement — stated plainly rather than claimed. PROCESS NOTE, because Yasir called out the churn and he was right: 28p-28s were four bumps in an hour and TWO of them existed only to fix regressions from the previous one (SORT_SHAPE misplacement, the stranded red state). The cost was never batching, it was shipping before verifying. This bump was made with the engine edited, the monolith regenerated and the game rebuilt at the OLD stamp, behaviour checked, and the version moved only once at the end — which is how the next ones should go.  28s: THE RED NEVER SETTLED TO GREY — my own 28r bug, caught by behavioural verification 20 minutes after writing it. The 700ms flash->lock timer opened with `if(state.helpShown) return;`, inherited from the code it replaced. But at the 2nd wrong, terminal help fires in the SAME beat, so helpShown was already true and the swap was skipped: measured on HI01H01_L02_S05 G1, the card sat RED and untappable at +1.7s and would have stayed that way. That is precisely the stuck-red-ring bug I fixed in 28d and have now reintroduced in a new form. The guard was correct for the OLD behaviour (do not UNBLOCK a card once terminal help owns the board) and wrong for the new one (swap the flash for the lock), and I copied it without re-deriving whether it still applied. Removed from all three paths; only the 'this cell turned out to be the answer' check remains. THE LESSON, written down for the third time: a guard inherited from replaced code must be re-justified against the new behaviour, not carried over.  28r: BOTH WRONG ATTEMPTS FLASH RED FIRST; ONLY THE SECOND ALSO DISABLES. Yasir 2026-07-28: "on second wrong attempt as well we are supposed to give the red glow first and then disable." He is right and 28p was half a fix: it restored red on the 1st wrong but sent the 2nd straight to the grey lock, so the child lost the 'that is not it' signal at the exact moment they most needed it. The red IS the feedback; the grey lock is an EXTRA consequence the 2nd attempt earns. Sequence now, every wrong tap: red buzz for 700ms -> then (2nd only) settle to grey and untappable. SAME FIX IN TWO MORE MECHANICS, where it turned out to be worse: SENTENCE_FIND and TAP_ALL_WITH_SOUND locked their chip PERMANENTLY ON THE FIRST WRONG TAP (.crossed / .nope, both pointer-events:none), so 27a's ruling 'a wrong card must NOT lock on the first miss' had never reached them at all — a child lost a chip for one miss on those slides while every other mechanic gave them a retry. All three paths now share the same flash-then-lock shape. Checked the whole class rather than only the site Yasir named: those were the only three places a wrong tap adds a lock class.  28q: FIXES MY OWN 28p BUG BEFORE IT SHIPPED. The SORT_GENDER terminal rung landed in SORT_SHAPE — I applied it with a first-occurrence string replace, and the `dragWrong(slide); // buzz + Swiftie...` + answer_wrong pair it keyed on is IDENTICAL in both modules, so it went to the wrong one. SORT_SHAPE then referenced `_sgWrong`, which does not exist in its scope: a ReferenceError on any wrong drop, on MTKGA03_L01_S01 P1/P2. Caught by BEHAVIOURAL verification (three real wrong drops on a SORT_GENDER slide showed attempts climbing 1-2-3 with no glow, no dim, no hand) — a syntax check and a rebuild both passed it, and static checks always would have. Nothing shipped: the dists and zips were still on 28o. Moved to SORT_GENDER and addressed via the module BLOCK rather than a global first-match, so the same class of mistake cannot repeat. LESSON, again: when two modules share boilerplate, never target it with an unanchored replace — extract the module's own text first, as the MEET_LETTER edit in 28p did.  28p (batch, 8 items, closes 8 requests): (1) THE HINT BULB IS REMOVED ENTIRELY — Yasir 2026-07-28 "we do not need that idea glow button at all". It appeared WITH A GLOW on the FIRST wrong (the add was above the ladder branch, not inside it) and was never phase-gated — 10 of 10 show-sites ungated — so it also offered help in round 3; on several mechanics TAPPING it flashed the answer ghost, i.e. reveal-on-demand with zero attempts. Hidden via CSS rather than deleting the node, because $("hintBtn") is dereferenced unguarded at all 10 sites and removing it would throw on the first wrong answer in every mechanic. (2) 1st WRONG IS RED AGAIN, ON A LIVE CARD — his ruling, and my own 28e over-correction: 28e said a DISABLED option is never red but implemented it on `.crossed`, the class used for BOTH the momentary buzz and the permanent lock, so it bleached the first-wrong flash too and left a grey disable with no red anywhere. Split into `.wrong-flash` (red, glowing, STILL TAPPABLE, removed after 700ms) and `.crossed` (28e's grey lock, from attempt 2). (3) LANDING HERO CAN GROW — raised THREE times (Yasir + the SME on both games) and also mine: 28i's max-height:180px cap was measured to be exactly the overflow boundary, because .sg-content.has-hero's 206px bottom margin shifted the block up so growth ate the title's headroom instead of the dead space below. Margin 206->120 and cap 180->250. MEASURED at Yasir's own 1919x977: title 7.7px -> 18px below the card edge, hero 166 -> 230px tall, dead space hero->button 92 -> 16px. (4) SORT_GENDER FINALLY HAS A TERMINAL RUNG — it was the sixth terminal-help path with NONE: buzz + try_again forever, no ceiling, no glow, no dim, no hand, so a child could be wrong indefinitely and a guided sort could never earn the hand. Counted PER TILE (a slide-wide streak resets on any correct drop) and routed through the shared terminalHold/travelNudge contract. (5) STORY_SCENE fits OUTSIDE the tutorial too — 27h was scoped to .stage.tut, so on test phases the caption sat behind the आगे pill (measured: 19px under a 136px-wide button on 5 slides of HIKGH07_L01_S02). (6) the tut teach picture may use the room it has (261px of art in a 581px card with 607px of width unused) without reintroducing 27h's overflow. (7) MEET_LETTER: the hardcoded '→' is gone (markup, so no card could remove it) and the auto demo no longer plants a hand on a single-letter slide — "points at the obvious and adds nothing". MEET_SHAPE/NUMBER/GENDER keep their arrows; he named MEET_LETTER. (8) bare .intro-letter glyph tiles are box-free like the pictures beside them.  STILL OPEN, deliberately not rushed into this bump: the other TWO MEET_LETTER asks — a word taught for both sounds (जल = ज + ल) must DISPLAY both letters, and the hand must sync to the glyph being spoken. The existing data.pair mode is not a substitute (it renders 1536px inside 1329px), so it needs real layout work and measurement; item (7) deliberately left no guessed 'is this two-letter' condition behind. Also still open: DEMO_COUNT before->after (a new capability), HIKGH07's baked-in scene backgrounds (art regen), Pehli's 11 dead .webp paths (card fix).  28o: TWO DRAG RULINGS FROM YASIR (2026-07-28). (1) THE HAND SHOWS THE MOVE. "on drag, the hand nudge guides the student precisely... move the hand nudge from the question card to the answer card." A static hand on the tile says 'this one' but never says WHERE it goes — which on a matching slide is the actual thing the child must work out. travelNudge() now slides the hand from the tile to its correct zone on a loop; terminalHold() takes an optional destination, so all three drag modules (MATCH_DRAG_N, MATCH_GENDER_PAIRS, SEQUENCE_DRAG) demonstrate the gesture while every TAP mechanic passes no destination and keeps the static point. Same phase rule as handOnAnswer (tutorial/guided only, never round 3), and the animation is stored on state so stopNudge cancels it — an infinite animation left running would follow the child into the next slide. Falls back to a static point without .animate(). (2) EVERY CARD THE SAME SIZE. "all the cards, both question and answer cards are to be of the same size in matching/dragging." They were three sizes: .dd-zone 150, .dd-tile 104, .dd-tile.pic-tile 134 — the thing you drag was smaller than the thing you drop onto. Unified on 150 (the largest, so nothing shrinks and the drag target gets easier). Deliberately excluded: .dd-tile.snapped (the 62px badge parked inside a filled zone — not a card) and .dd-stage.seq-words (word tiles size to their text; equal squares would clip long words, and sentence-building is not the matching mechanic).  28n: A NO-STIMULUS QUESTION RECLAIMS THE EMPTY SPACE (CSS only). After 28m stripped the 🔊 chip from the four audio-only stimuli, those slides looked half-empty and I flagged it to Yasir as a centring problem; he asked for a centring pass. I MEASURED FIRST and my flag was WRONG — the cells were already centred exactly (142px above, 142px below a 210px row in a 494px grid; .opt-grid already carries align-items:center + align-content:center), so a centring change would have done nothing. The real problem was that the tiles kept their with-a-stimulus size while the stimulus slot stood empty, so the space read as a void. The tiles now grow into it (min-height 210->300, glyph 96->112, pic 134->158), which also gives a KG thumb a bigger target. Scoped with :has() to rows WITHOUT a .stimulus-pic and excluding .stage.tut, so every slide that has a stimulus — and all the 27h tutorial-fit work — is untouched. Also RULED this round: the Swiftie header volume chip is template furniture and STAYS (Yasir 2026-07-28), which closes the flag 28m left open; 'no vol button' means the stimulus chips, not the shell's replay control.  28m: NO VOLUME BUTTON ANYWHERE. Yasir 2026-07-28: "we use vol button nowhere. if nothing then we keep question only." This closes the flag 28c deliberately left open: four stimuli have NO image (TAP_SHAPE_BY_NAME, TAP_LETTER_BY_SOUND, MASTERY_SILENT_PICK sound_to_letter + name_to_shape), so stripping their 🔊 + 'नाम सुनो'/'ध्वनि सुनो' chip looked like it would leave a blank card and I asked rather than guessed. The ruling is that a slide with nothing to show shows the QUESTION only — stimulus is now null on all four. The chip was ALSO the only way to re-hear the sound, so the FUNCTION moved to the header replay (state.replayAudio, set AFTER mount so mountTapOptions cannot overwrite it) rather than being deleted along with the affordance — a KG child must be able to hear the sound again. The 🔊 glyph also came off the three read-aloud BUTTONS (SENTENCE_READ 'पूरा पढ़ो', SENTENCE_SOUND and SENTENCE_PICK_PIC 'फिर सुनो'); those keep the button and their Hindi text, so nothing loses function there either. Touches 4 games: HI01H04_L02_S02 (8 slides), HI01H06_L01_S01 (7), HIKGH02_L01_S03_P2 (8), MTKGA03_L01_S01 (2). NOT TOUCHED, flagged for a ruling: the HEADER replay chip and the LANDING .sg-vo chip are still speaker icons. I left them because they are the only remaining way to re-hear a prompt, and because Yasir and the SME both reviewed screenshots showing the header chip today without flagging it — but if "nowhere" includes those, they need a text affordance first, not deletion.  28l: HARD RULE — NO QUESTION IS EVER SOLVED AUTOMATICALLY IN A TEST PHASE. Yasir 2026-07-28: "regardless of what interaction, as long as we in guided or practice, no question will be solved automatically." Only a tutorial slide may finish a question itself (there it is a demonstration). Two mechanics were still answering FOR the child on the last wrong attempt: PATTERN_BUILD and SEQUENCE_COMPLETE both ran `setTimeout(placeCorrect, 1000)`, so the engine filled the blank in and moved on — the child never answered. Yasir caught SEQUENCE_COMPLETE live on HIKGH04_L02_S02's build slides. Both now glow the correct tray tile, disable the rest, show the hand (phase-gated, so round 3 still gets none) and WAIT. MATCH_GENDER_PAIRS and SEQUENCE_DRAG already held the glow (25d) but never dimmed the distractors or pointed, so they route through the same helper now. The point of this bump is that the rule lives in ONE place — maySolveFor()/terminalHold()/clearHold() — because it has now drifted three times: 25d fixed two mechanics and left two auto-solving and two half-done, and each was re-reported separately (SORT_GENDER 06:32, SEQUENCE_COMPLETE 13:32) after I had already called the class closed. A new mechanic inherits the contract instead of re-deciding it. clearHold() releases the tray when the child does place it, or the disabled tiles would stay dead for the remaining blanks. STILL OPEN and deliberately not in this bump: SORT_GENDER has no terminal rung at all (a 6th path, different structure — bins not tiles); it does not auto-solve, it just gives audio only, so it is queued rather than rushed into this one.  28k: OPTIONAL MIDDLE HINT RUNG (`hint2`). The SME on Pehli Dhwani specified a THREE-rung ladder — rung 1 'फिर से कोशिश कीजिए।', rung 2 'शब्द को बोलकर देखिए, और पहली ध्वनि चुनिए।' (a strategy, NOT the answer), rung 3 the answer. Our ladder had two rungs, so rung 2 spoke `hint`, the level that names the answer; there was nowhere to put a strategy line. Six rung-2 sites (mountTapOptions, dragWrong, wrongClip, SORT, SENTENCE_FIND, TAP_ALL_WITH_SOUND) now call midHint(), which prefers `hint2` and falls back to `hint` — so a card that authors no hint2 behaves EXACTLY as before and the rest of the fleet keeps two rungs. CONFLICT, RAISED AND RULED: a third rung means the answer arrives on the 3rd wrong, so that deck's max_attempts goes to 3 and the card blocks after the 3rd attempt — which contradicts Yasir's standing 'blocks only after the 2nd wrong attempt'. I flagged it; he ruled 2026-07-28 'implement as per written by the SME'. It is therefore DECK-SCOPED to HIKGH02_L02_S01 only. Do not raise max_attempts or author hint2 on another game without the same explicit ask on that game's deck.  28j: THE GUIDING HAND, FIXED AT THE CHOKE POINT INSTEAD OF PER MECHANIC. Yasir found a hand in round 3 again (MTKGA01_L04_S01 P5, a COUNT_TAP practice slide) after I had gated handOnAnswer in 28f and startNudge in 28i. Cause: ~25 sites call pointNudgeAt DIRECTLY and bypassed both gates. Gating call sites one at a time is what produced three rounds of 'fixed'; the rule now lives in pointNudgeAt itself, default TUTORIAL ONLY, so every existing raw site becomes correct by construction and any future mechanic inherits it. handOnAnswer passes earned=true for terminal help, the one case Yasir allows in guided because two failed attempts paid for it. Round 3 gets no hand by ANY route. ALSO FIXED, both regressions from my own 28h placement change: (a) EMPTY SKY — the 'flip above if it would run off the stage' clamp put the hand 100-395px above a tall TAP_IN_SCENE hotspot, pointing at open air on 4 of 6 guided slides of HI01H07_L01_S02. Flipping is simply wrong for a hand that points UP; it now clamps INSIDE the stage instead, worst case overlapping the target's lower edge as it always used to. (b) A LABEL BELOW THE ANCHOR — anchoring to the passed element's bottom only helps if that element contains the text, and GENDER_INTRO passes the cat IMAGE while .cat-word sits below it, so 'below the image' landed on the word (56% covered on T3; 100% before 28h). Rather than teach each mechanic a smarter anchor, placement now MEASURES real text rects in the tile and drops below the lowest one that shares the column. Also: check_system's 'hand on answer, all phases' marker was a FALSE GREEN asserting the opposite of the live rule — renamed and re-keyed to the 28j choke point.  28i: WHY THE ROUND-3 HAND KEPT COMING BACK, plus four fleet-wide gaps. (1) THE ROUND-3 HAND BAN IS NOW ENGINE-ENFORCED. I reported this fixed three times and Yasir kept seeing it, because 28f only closed the answer/tap paths (handOnAnswer + HAND_PHASES) while the drag/count PROGRESS cue reaches the hand through startNudge, whose only round-3 guard was the CARD's scaffold_rules.nudge_timeout_ms — and 22 of 27 cards set `independent: 8000` (two also set practice). So on any drag or count slide in round 3, eight seconds of hesitation still produced a hand, in nearly every game in the fleet. Card data cannot be the guard for a hard rule: startNudge now refuses outside TUTORIAL and ignores a card that arms round 3. Tutorial-only, not {tutorial,guided}: the idle hand is UN-EARNED (a mount timer), and Yasir's rule is that any visual hint waits for 2 failed attempts — guided still gets its hand, but only through handOnAnswer at terminal help, which is where it is earned. Verified with a real 10.6s untouched wait on round-3 drag slides (P1/P3 SORT_GENDER, card arming practice+independent at 8000): no hand. (2) THE SAME FIX, ONE COPY OF IT — startNudge carried its own duplicate of the old positioning formula, so 28h's 'hand sits below the tile, never on its word' never reached a single progress cue; it delegates to pointNudgeAt now, so placement cannot drift between the two paths again. (3) SENTENCE_FIND SPEAKS THE TARGET WORD, NOT ALL FOUR (Yasir): the slide says 'जो शब्द सुनो, उस पर टैप करो।' and the engine read every option aloud, so nothing identified the word to tap — the task was unanswerable by design. Target-only is the default; the word-by-word read is opt-in via data.read_along:true. This REVERSES an SME ask from that same deck (21c flag #5) — flagged for Yasir, not silently dropped. Its trailing startNudge(slide,_tgt) — a pre-attempt hand on the answer, the third form 28f missed — is gone. (4) THE TWO-HINT LADDER REACHES THE PRODUCE MECHANICS. Yasir's 2026-07-25 'two hints everywhere, every game, every interaction type' landed for taps (24a) and drags (25a), but MAKE_SET / MAKE_EQUAL / BUILD_TO_NUMBER / TAP_ALL_WITH_SOUND grade their own wrong answers and inherited neither — and BUILD_TO_NUMBER passed `null`, i.e. its wrong-answer feedback was SILENT, text-only, to a child who cannot read. All four now call wrongClip(), one grader in one place; with no hint1/hint authored it returns the same try_again as before, so no card regresses. MAKE_NUMBER and COMBINE_COUNT reach completeSlide(true) only — no wrong path exists, so demanding a ladder was a checker false positive and they are excluded by name. (5) LANDING IMAGE HERO IS SIZED AT ALL — `.sg-hero img{height:118px}` has never matched anything (the element is .sg-art), so an image hero rendered at natural size: 1244x695 in a 1069x438 card, shoving the landing title to top:-106px, off screen. Same selector mismatch 16e fixed for count hands and left for images. (6) WIDTH-FIT MEASURES INK, NOT ADVANCE — the SME's original 'make the words fit inside the box', still unfixed. Devanagari paints wider than it advances, and the real bug was the BRANCH: a word whose advance fit never entered the shrink path, so its ink overflow was never considered (यह 66 ink vs 59 box, बकरी 138/132, एक 91/85, कहाँ 184/180 — all four had fitting advances). Fits whichever actually paints wider, so Latin/numerals are untouched. Also: engine_guard now WARNS (never blocks) when another session holds the engine lock — the stale-local-copy trap that produced a request against already-fixed 28g code.  28h: TWO FIXES Yasir named directly. (1) THE HAND NO LONGER COVERS THE WORD — pointNudgeAt planted the fingertip 56 design-px INSIDE the tile's bottom edge, which is fine on a bare picture tile (its only caller for years) and fatal the moment 28f started pointing it at an .opt-cell, whose bottom strip IS the label: measured 92x27px of the answer's word hidden under the hand, i.e. we glowed the answer and then covered it. The hand now starts just past the tile's bottom edge, clamped to flip ABOVE the tile if that would run off the stage foot rather than being silently clipped. Verified by measurement AND by looking: G1 hand t646 vs tile b641, label b627, vertical overlap 0, still centred, still tappable. (2) ONE GATE PER ROUND, NOT PER PHASE NAME — 28a made `independent` an alias of practice to fix a MISSING round-3 gate, and thereby created a DUPLICATE one: a card using both names crossed two 'different phases' and showed the identical 'अब आपकी बारी!' gate twice, back to back. 7 of 27 cards use both. Gates now dedupe on a ROUND id (PHASE_ROUND), so that pair collapses to one and any unmapped phase (mastery, or a future name) fails safe to NO gate — which is the ruling: three rounds, no round 4. Also closed as NOT-A-DEFECT: a report that the round-3 hand ban was still broken. Measured on P1 at 28h — terminal help fires, answer glows, stays tappable, handShown FALSE. 28f had already fixed it; the report read a stale source. The raw pointNudgeAt calls left in MEET_ORDER/COMPARE_TWO/the demo step chain are auto-DEMO teaching animations, not hints, and stay.  28g: 'going back from last screen gets swiftie stuck' — clearHost() dropped body.is-end but never removed .show from #endScreen, so the celebration layer (cheering Swiftie + 'बहुत बढ़िया!') stayed overlaid on the slide you navigated back to, covering the middle option. I had hit this myself and mis-triaged it as low severity ('a child cannot go back from celebration') — but REVIEW uses the dev nav, so it hit every review pass, and it also caused 60 phantom overlap findings in my audit sweep. Deliberately scoped to the end screen only: also clearing stage.blurred/gating here would un-blur the gray phase gate mid-flight, since mountSlide runs inside the gate's callback.  28f: ONE RULE FOR THE GUIDING HAND, in one place (handOnAnswer()) — Yasir 2026-07-28, two rulings merged: tutorial may show the hand (teaching); guided ONLY after 2 failed attempts; round 3 (practice / independent / mastery) NEVER, 'regardless of whatever name we save it by'. Also DELETED the idle/mount hand on answerable slides: startNudge fired at nudge_timeout_ms (guided 5000ms) — right after the prompt VO — pointing at the stimulus before the child had tried anything. A visual hint is now earned only by 2 failed attempts. All 5 terminal-help paths route through handOnAnswer, so the phase rule cannot drift per-mechanic again (27d put the hand in 1 of 5 and I reported it as 'every phase'). Demo/progress nudges inside the count and drag mechanics are untouched — teaching animations, not hints.  28e: (1) A DISABLED OPTION IS NEVER RED — .crossed / .sentence-word.crossed / .tap-all-item.nope now match the plain grey .faded lock. Two looks for one meaning was the complaint; this supersedes the red ring 27a introduced. 1st-wrong buzz/shake unaffected (28d unblocks that card after 700ms so it never rests as disabled). (2) TAP_IN_SCENE no longer PULSES the correct hotspot 6s after mount — that handed the answer over before the child tried (measured: identical at t=1s, only .correct-hot pulsing at t=7s). The glow now comes only from terminal help, where distractors also fade. (3) FIXED MY OWN 28a REGRESSION: the new SEQUENCE_COMPLETE picture stimulus pushed .seq-tray under the आगे pill (bottom ~30% of two tiles a dead zone on all 4 build slides). .seq-stage now top-anchors, tightens its gap and reserves the pill's lane.  NOT DONE, needs care: the fleet-default 'remove handnudge on idle' ruling — startNudge is also used by drag/count mechanics for PROGRESS cues, so disarming it globally would remove useful guidance, not just idle hints. Filed.  28d (three REGRESSIONS of my own, re-reported by Yasir): (1) the stuck RED RING — the 700ms unblock was guarded by `if(!state.locked)`, but state.locked is also set TRANSIENTLY while reveal_seq narrates, so a 700ms landing in that window skipped the removal and .crossed stayed FOREVER (permanent red ring, permanently dead card). Now keyed off this cell only (.correct / state.helpShown). I had found that same state.locked trap while fixing the idle-VO ticker, documented it there, and failed to propagate it back. (2) HAND NUDGE only existed on ONE of FIVE terminal-help paths — 27d added it to mountTapOptions.revealAnswer and I reported it as 'every phase', but practice/independent rounds are drags / sentence-finds / scene-taps. Added to MATCH_DRAG_N.terminalHelp, SENTENCE_FIND and TAP_IN_SCENE, each with stopNudge() first so the flow nudge cannot drag the hand off the answer. (3) STORY_SCENE picture drifted via `storyKenBurns` — killed engine-wide; a teaching picture must not move under a KG child. Root cause common to (1) and (2): verified narrowly, reported broadly.  28c: STORY_QUESTION stimulus is the IMAGE ONLY — the 🔊 glyph and the 'प्रश्न सुनो' label were hardcoded in the module (d.stim_hi only reworded the label), so no card could remove them. Tapping the picture still replays the question and the header chip still works: the affordance is gone, not the function. No thumb (mastery / hide_recall) now passes a null stimulus instead of rendering an empty card. The four AUDIO-ONLY chips (TAP_SHAPE_BY_NAME, TAP_LETTER_BY_SOUND, MASTERY_SILENT_PICK x2) are untouched — they have no image, so stripping them leaves a blank card; flagged for a ruling.  28b: PHASE GATE BACKGROUND GOES GRAY (Yasir + Figma ref). Scrim 35% -> rgba(64,64,70,.58) and backdrop-filter gains grayscale(.9) brightness(.92), so a colourful KG scene actually DESATURATES instead of merely dimming; grayscale rides the BACKDROP so the peeking Swiftie and the headline keep full colour. Also kills `body.is-start .phase-gate{background: transparent !important}` — the FIRST gate (landing->tutorial) had NO scrim at all, open as flag S2-a; this closes it. Verified by SCREENSHOTTING the gate (capture_pages cannot — it is a ~2s transient) on both the mid-lesson and is-start paths.  28a [code tags read `[27j]` — written before midnight, engine_bump rolled the date; grep [27j] for these six changes] (batched wave fixes, 6 module changes, all ADDITIVE — a card that does not opt in behaves exactly as before): SEQUENCE_COMPLETE takes an opt-in picture stimulus (d.img/picture/emoji) so build-the-word slides can show the thing being spelled; TAP_IN_SCENE gains the two-rung hint ladder + terminal help that GLOWS the target instead of solving it, and .tis-hot is now VISIBLE on every candidate (it was border:none/transparent, so a child had nothing to aim at); mountTapOptions finally speaks audio.correct after the tapped word (12 STORY_QUESTION slides were silent); MATCH_DRAG_N drop-zones speak on tap, reusing pair.match_audio; SENTENCE_FIND: rung 1 now plays hint1 (it played try_again), `hint` is spoken as the terminal line, and terminal help NO LONGER locks+completes the slide — RULE-9 breach, it was solving the answer for the child; PHASE_GATE_TITLE/VO gain `independent` as an ALIAS of practice — three rounds, not four: round 3 is named practice OR independent and a card using the latter got no round-3 gate. `mastery` is deliberately NOT gated (no round 4), so vo_pt_mastery stays unplayed and that verify_bundle warn is a checker artifact. Also: _tools/check_system.py now verifies the ENGINE READS hint1/hint per mechanic, closing a false green where authored hints could never play.  27h: F1 tutorial-frame fit — tall teach modules (STORY_SCENE .story-frame 900x432, GENDER_INTRO .gender-cat 430px) overflowed the 318px .tut-content and, because it is justify-content:center, split the overflow BOTH ways: heading 78-100% covered above, caption/word-chip behind the आगे pill below. Regression from the 25e/27c change that shortened every tut-card 87px. Now the picture SHRINKS (what the SME asked) instead of pushing the layout apart; scoped to .stage.tut so guided/practice are untouched. Cleared 6 requests across 4 games. · F2 shared baseline — centerInkGlyph ink-centred EACH glyph, so a word with an above-line matra sat up to 23px lower than a plain word inside one row (the SME's 'text alignment is not right', 7 of 17 pages). A row with >1 .ink-glyph now uses constant FONT metrics; a lone showcase glyph keeps ink-centring. Both verified by LOOKING at headless captures, not only by measuring.  ENGINE STAMP — the receipt (verify_bundle.py) asserts a built game carries THIS exact string; a stale/divergent engine → hard FAIL, so the wrong engine can never silently ship. BUMP IN LOCKSTEP with engine_guard.py + swiftpal_build.py + unified_build.py + verify_bundle.py on EVERY engine change (r2: drag/pattern feedback standard + PHASE_TRANSITION; r3c: off-white toybox bg, dual-coded counting options numeral+hand, full-body landing mascot, true-corner square/rect; r3d: Swiftie mouth-stops-when-silent (still frame), Arabic display numerals 1/2/3, landing shows full 1..n hand row, volume-chip aligned in header pill); r4: additive number-sequence path modules MEET_SEQUENCE + SEQUENCE_COMPLETE + SEQUENCE_NEXT (MTKGA01_L02_S04 "completes a number sequence within 20") — purely additive, existing lessons untouched. r4-landing (16c): landing recomposed to match reference — small corner mascot (230px, was 300), content re-centered (dropped padding-left:300 right-shift hack), VO chip moved from top-right to the mascot's shoulder (left:150/bottom:34, 58px). CSS-only; supersedes the 16b right-shift overlap fix.; 16d: TRUNK MERGE — unified the two diverged engine lines at base 12d: the 15e mechanics trunk (CONSERVE_COUNT + COUNT_ACTION + COUNT_DRAG_MATCH + ORDER_BY_WEIGHT + PICK_SET_BY_NUMBER, per_row/dense count-set grouping, bigNumCell numeral-only test options, title_first landing order) + the 16c r4 design trunk (boot loader, peek phase-transition, concept-strip landing, DS header, flat CTAs, sunburst/star-burst celebration, recomposed corner-mascot landing). Nothing dropped from either line. 16e: landing count-hero hand sizing FIXED — the .sg-hero sizing selectors never matched (template uses .sg-art); hands rendered natural-size, overflowing the card (title pushed outside the box, numeral-1 hidden behind the mascot — user-visible on MTKGA01_L02_S01). Retargeted to .sg-art .sg-hand/.sg-hand-cell/.sg-hand-num (112px; image-hero landings untouched). CSS-only. 16f: INTRO strip fit-or-wrap — old sizing assumed 1220px + a -100px breakout and punched wide strips (10 numerals, 7+ letters) through the tut-frame borders; now sized to the frame (960) and wrapping into two balanced rows below the 110px touch floor. Fixes MTKGA01_L02_S01 s00 (user-caught live) AND the HIKGH04_P2 letter-row daylight item. 21a (20a Figma-polish port): production expression heads (setSwMood sw_head_<expr>[_anim].webp + mascot.webp fallback), body-level start/end edge-layers + full-viewport dark blur phase-gate, inline SVG audio/hint/sg-vo chips, nudge_hand_new/nudge_tap_v2, SORT-01 opt-in one-by-one tray reveal + speak-on-match, INTRO picture mode (data.pics) + auto-INTRO instruction VO, transition-audio AUDIO_EXT fix, landing shape-tiles, self-disabling browser-TTS fallback for missing clips (ruled SHIP), F2F7FA ground + red/green-reserved sweep; merged WITH the live in-word-matra colouring + reveal_seq _sayThen strict-VO + MATCH_DRAG_N md-word WIP (nothing reverted). 21c (consolidated wave bump): +COMBINE_COUNT (Put-Together: drag group B onto A, merge to one row, tap-count total ≤10) and +TRACE_SHAPE (finger-trace the outline — a PRODUCE gesture; forgiving corridor, ~80% coverage → success, idle demo, upright/sharp/fixed-colour, no score/timer); MATCH_DRAG_N tap→LETTER (tap_audio) / correct-drop→WORD (match_audio) split (gated+fallback, siblings untouched); SEQUENCE_DRAG word-mode tap-a-tile→speak-word + glow-order + whole-sentence-read-at-end, SENTENCE_READ/SENTENCE_FIND word-by-word read-along hand-nudge (word-mode gated; letter-sequence untouched); landing gate cursor:default (hand-pointer on buttons only). All additive. 24a (HI01H08-fork port + N7-N10 audit bump): AUDIO GEN-TOKEN (_audioGen) — stopAudio/play supersede pattern kills echo/double-voice, orphaned clips, stale fallback-timer resume + cancelled-TTS resume (N7a); replay chips get navUnlock + guards (isPlaying / revealing / demoRunning / ownsAudio-without-replay) so फिर-सुनो mid-VO can no longer brick gated teach slides or gen-kill self-driving demo chains (N7b/N8); state.revealing gates drag + replay during reveal_seq/sortSeqReveal (N8 drag path); capture-phase DRAG VO-GATE on draggable tiles (isPlaying + 4s _voStart cap — speak-on-press tiles NOT over-blocked) (A1); mountTapOptions tap gate: one-tap-at-a-time _busy + 4s _vb + no taps during ANY VO + additive hint1 first-wrong clip (A2); auto walk-through INTRO/GENDER_INTRO ignore card taps until taught, then tap=replay (A3); playbackRate pinned 1.0 (A4); SORT tray ghost-slot .sort-ghost on placement (A5); MATCH_DRAG_N final-drop word no longer truncated by the celebrate VO (C); viewport pinch-zoom lock (N9); star-burst spark fill-mode both (N10). N11 (asset preload) deferred. 25a (drag hint ladder): dragWrong() now grades its spoken feedback like the tap path — 1st wrong plays the slide's hint1, 2nd+ plays hint (the level that GIVES the answer); all 12 drag wrong-drop sites inherit it with no call-site change, and cards without hint1/hint authored still play try_again unchanged (additive, zero sibling regression). Yasir ruling 2026-07-25: two hints everywhere, every game, every interaction type. 27c (autonomous teaching + tutorial fit): mountTapOptions honours slide.data.auto — a TEACHING slide now runs the whole beat itself (prompt on the picture -> teaching line on the right choice -> that choice goes green+pulses, wrong ones fade, its letter sounds -> आगे unlocks), taps dead throughout, no confetti/sfx; opt-in, and SENTENCE_SOUND/INTRO/GENDER_INTRO/MEET_* keep their own pre-existing auto paths (they return before mountTapOptions). CSS: .stage.tut q-rows that carry a picture stimulus lay it BESIDE the options — the 25e card leaves 273 design px and stimulus+gap+opt-cell need 434, so the grid track squashed to 43px and the cells spilled onto the picture (Yasir 2026-07-27, Antim T2/T3). 27g-fix (relabelled — 27d was taken by the terminal-help hand): the auto chain no longer points the hand at the picture stimulus — pointNudgeAt plants the fingertip 56px above an element bottom, i.e. straight over a .stimulus-pic .lbl, so the hand hid the very word being taught for the whole prompt beat.
  try { window.SWIFTPAL_ENGINE = ENGINE_VERSION; } catch(e){}
const $ = id => document.getElementById(id);

/* ---------- 1. SCALE THE 1333x750 STAGE ---------- */
function fit(){
  const vw = (window.visualViewport ? window.visualViewport.width  : document.documentElement.clientWidth)  || window.innerWidth;
  const vh = (window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight) || window.innerHeight;
  // contain-fit, scaling UP to fill the screen (no 1× cap, no margin) so a 16:9
  // viewport is covered edge-to-edge. Any leftover bars on non-16:9 are blue, not white.
  const s = Math.min(vw/1333, vh/750);
  document.documentElement.style.setProperty("--scale", s);
}
window.addEventListener("resize", fit);
window.addEventListener("load", fit);
if(window.visualViewport) window.visualViewport.addEventListener("resize", fit);
fit();

/* ---------- 2. SIGNAL BUS + OFFLINE TELEMETRY ---------- */
/* TELEMETRY: offline self-capture. Every signal is buffered to localStorage so
   the run survives a reload / works with NO host app. A full results record can
   be pulled via SwiftPAL.downloadResults() (or the ?dev=1 button on the end
   screen). If `endpoint` is set AND the device is online, the final record is
   also POSTed — left null so the lesson is fully offline by default. */
const TELEMETRY = {
  endpoint: null,   // e.g. "https://lrs.example.com/swiftpal" — null = offline only
  storageKey: "swiftpal:run:" + CARD.skill_code + "_" + (CARD.part_label || "P1")
};
const SwiftPAL = window.SwiftPAL = {
  signals: [],
  validatorReport: { missing_signals: [], errors: [], passed: false },
  firedSet: new Set(),
  startedAt: Date.now(),
  emit(name, payload){
    const evt = Object.assign({
      ts: Date.now(),
      skill_code: CARD.skill_code,
      lo_code: CARD.lo_code,
      signal: name
    }, payload || {});
    this.signals.push(evt);
    this.firedSet.add(name);
    try{ console.log("[signal]", name, evt); }catch(e){}
    try{ window.parent?.postMessage({type:"swiftpal:signal", payload: evt}, "*"); }catch(e){}
    this.persist();
  },
  /* full results record (used for download / POST / end-of-lesson dump) */
  exportResults(){
    const ms = (typeof state!=="undefined") ? state.masteryAttempts : 0;
    const mh = (typeof state!=="undefined") ? state.masteryHits : 0;
    return {
      skill_code: CARD.skill_code, lo_code: CARD.lo_code, part: CARD.part_label || null,
      started_at: this.startedAt, exported_at: Date.now(),
      mastery: { hits: mh, attempts: ms, score: ms ? mh/ms : 0 },
      validatorReport: this.validatorReport,
      signals: this.signals
    };
  },
  /* silent: flush the running buffer to localStorage (survives reload / offline) */
  persist(){
    try{ localStorage.setItem(TELEMETRY.storageKey, JSON.stringify(this.exportResults())); }
    catch(e){ /* private mode / quota — non-fatal, postMessage + memory still work */ }
  },
  /* pull the run as a JSON file (teacher/dev; not in the child's flow) */
  downloadResults(){
    try{
      const blob = new Blob([JSON.stringify(this.exportResults(), null, 2)], {type:"application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = CARD.skill_code + "_" + (CARD.part_label||"P1") + "_results.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=> URL.revokeObjectURL(url), 1000);
    }catch(e){ console.error("[telemetry] download failed", e); }
  }
};

/* ---------- 3. AUDIO ---------- */
let isPlaying=false, currentAudio=null, _audioGen=0, _voStart=0;
let isMuted = false;
function setMuted(m){ isMuted = m; if(m && typeof stopAudio==="function") stopAudio();
  document.querySelectorAll(".audio-chip").forEach(c => c.classList.toggle("muted", m)); }
function setPlaying(on){
  // the dynamic Swiftie sits header-left; the audio chips pulse to signal playback. r4/F1: share the
  // .playing toggle across the header chip AND the tut-card replay chip (the header is hidden in the
  // tut frame, so the in-card .tut-audio is the only visible affordance and must react to VO too).
  isPlaying=on;
  if(on) _voStart = Date.now();   // drag VO-gate 4s safety: stamp when a VO began so a stalled clip can't soft-lock the tiles
  document.querySelectorAll(".audio-chip, .tut-audio, .sg-vo").forEach(c => c.classList.toggle("playing", on && !isMuted));
  /* [30g] VO LOCK — UNTAPPABLE, ZERO VISUAL. Yasir 2026-07-30: "cards untappable when VO being
     played, you dont need to show any affect for untappable, just make it untappable."
     28u bundled a lock (pointer-events:none) with a pale board (opacity:.55). 30f removed BOTH, which
     went too far — nothing was untappable any more. The class is back; its CSS now carries only
     pointer-events. Never re-add opacity/filter under it: a "wait" cue, if ever wanted, belongs on the
     single card the child touched.
     Driven off setPlaying and NOT a timer, deliberately: this is the one function every playback exit
     passes through (stopAudio, and fire() for natural end / supersede / cancelled TTS / missing-file
     fallback), so the lock can never outlive the audio and leave a slide permanently dead.
     Toggled on `on` alone, NOT `on && !isMuted` like the chips above: the tap gate keys off isPlaying
     regardless of mute, so gating this on mute would let taps land while muted and diverge from it. */
  document.body.classList.toggle("vo-lock", !!on);
}
/* stopAudio(): hard-stop the current clip AND bump the playback generation so any in-flight
   callback (a chain's onended, a fallback timer, a cancelled TTS onend) becomes a no-op. This is
   what prevents the "voice echo": a stale callback from an earlier tap/slide can no longer fire a
   NEW clip on top of the current one, or resume onto the next screen. */
function stopAudio(){
  _audioGen++;
  if(currentAudio){ try{ currentAudio.onended=null; currentAudio.onerror=null; currentAudio.pause(); }catch(e){} currentAudio=null; }
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}   // [20a] also stop the TTS placeholder
  setPlaying(false);
}
/* [20a REVIEW PLACEHOLDER] TTS fallback: until real VO is recorded, speak the clip's authored Hindi text
   (CARD.assets.audio_text[id]) via the browser so the game is audible for review. SELF-DISABLING — fires
   only when the MP3 is missing; once real clips ship, play() succeeds and this never runs. Returns true if
   it took over (so play() doesn't ALSO schedule a silent beat). */
function _ttsSay(src, onDone){
  /* [30o] THE TTS FALLBACK IS GONE. Yasir 2026-07-31, after hearing a robot voice on a game whose VO
     is 100% human: "there should be no way to fall back on tts, it is fine if we dont have audio, we
     will know if an audio is missing but having tts is worse."
     That is a product ruling, and it is the right one: a synthetic voice MASKS a missing clip. It made
     a broken build sound finished, so nobody could hear the gap the placeholder was invented to cover.
     Silence is diagnostic. A missing clip now reads as missing.
     KEPT AS A STUB rather than deleted on purpose. Any call site I have not found — a per-game
     engine_local, an older isolated copy, something in a build script — would throw ReferenceError on
     a deleted function and take the whole slide chain down with it. Returning false routes every caller
     into the silent-beat path it already handles. Same trade as the unused @keyframes: the stub is the
     safe half. The browser speech API is never touched from here again. */
  return false;
}

/* play(src, onEnd): real MP3 if path exists; silent 1.5s beat if missing/blocked.
   ECHO GUARD [24a N7]: each call captures a generation token after stopAudio()'s bump; if a newer
   play()/stopAudio() has since run, this call's fire/onFail/fallback-beat bail — a superseded chain
   can never start a clip over the current one, orphan the new clip (stale onFail nulling currentAudio),
   or resume onto the next slide (fallback timers + cancelled-TTS onend die with the token too). */
function play(src, onEnd){
  stopAudio(); setPlaying(true);
  const myGen=_audioGen;
  let done=false; const fire=()=>{ if(done || myGen!==_audioGen)return; done=true; setPlaying(false); if(onEnd) onEnd(); };
  if(src){
    const a=new Audio(src); currentAudio=a;
    a.playbackRate = 1.0;   // natural recorded pace — any pep-up factor makes HUMAN VO too fast (Yasir 2026-07-24)
    let handled=false;
    const onFail=()=>{ if(handled || myGen!==_audioGen)return; handled=true; currentAudio=null; setTimeout(fire, 1200); }; /* [30o] silent beat — never a synthetic voice (Yasir); [30p] brace restored outside the comment */
    a.onended=fire;
    a.onerror=onFail;
    /* [30n] AN AUTOPLAY REFUSAL IS NOT A MISSING FILE. Yasir: "the first time audio being played on the
       landing screen is the tts audio, and when i click the volume button then the human recorded audio
       is played" — on multiple games. Cause: a.play() rejects for TWO different reasons and onFail
       treated them alike. A missing/undecodable file SHOULD fall through to _ttsSay (that is the review
       placeholder). But the browser also rejects with NotAllowedError under its AUTOPLAY POLICY, which
       happens on every load before the child's first gesture — so a game with perfect human VO spoke the
       OS voice on the landing, and the tap that finally let real audio through was the volume button.
       _ttsSay's own header claimed it was "SELF-DISABLING ... once real clips ship, play() succeeds and
       this never runs": true only AFTER a user gesture, which the landing does not have.
       fire() on this path is NOT optional — play() has already run setPlaying(true), so returning without
       it leaves body.vo-lock on and the whole screen untappable. */
    a.play().catch((err)=>{
      const nm = err && err.name;
      if(nm === "NotAllowedError" || nm === "AbortError"){
        if(handled || myGen!==_audioGen) return;
        handled=true; currentAudio=null; fire(); return;   // silent; the first gesture starts the real clip
      }
      onFail();
    });
  } else { setTimeout(fire, 800); }   // [30o] no src: silent beat, never TTS
}
/* playSfx(id): fire-and-forget sound effect on its OWN Audio element so it can
   overlap the spoken VO (does NOT touch currentAudio / the play() chain).
   Silently no-ops if the file is missing or playback is blocked. */
function playSfx(id){
  if(!id) return;
  try{
    const a = new Audio("assets/Audio/" + id + "." + AUDIO_EXT);
    a.volume = 0.7;
    a.play().catch(()=>{});
  }catch(e){}
}
/* [S01r4t] SPEAK A WORD WITHOUT TAKING THE VO LOCK.
   play() calls setPlaying(true), which puts body.vo-lock on, and the stylesheet locks `.sort-item`,
   `.sort-bin` AND `.dd-zone` to pointer-events:none for as long as a clip sounds. On a tap mechanic
   that is exactly right. On a DRAG mechanic it is fatal, and r4s walked straight into it: pressing a
   tile to hear its name muted that tile's own pointer events before makeDraggable's mousedown could
   fire, so nothing could be picked up at all. Even had the grab survived, onMove/onUp find the
   basket with elementFromPoint, which skips pointer-events:none, so no drop would have registered
   either - the lock covers the bins too.
   So the word rides its own element the way playSfx does, but honours mute and cancels the previous
   word so two quick presses cannot talk over each other. The instruction line stays protected:
   installDragVoGate swallows the entire press while a prior VO is still sounding. */
let _wordVoice = null;
function speakNoLock(id){
  if(!id || isMuted) return;
  try{
    if(_wordVoice){ _wordVoice.pause(); _wordVoice = null; }
    const a = new Audio("assets/Audio/" + id + "." + AUDIO_EXT);
    _wordVoice = a;
    a.play().catch(()=>{});
  }catch(e){}
}
/* ---------- game-feel: procedural SFX (no audio files) + success particle burst ----------
   WebAudio resumes on the first user tap (autoplay policy), so taps/answers always sound. */
let _juiceAC = null;
function _ac(){ if(!_juiceAC){ try{ _juiceAC = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} }
  if(_juiceAC && _juiceAC.state === "suspended"){ try{ _juiceAC.resume(); }catch(e){} } return _juiceAC; }
function _tone(freqs, type, dur, vol){ const c = _ac(); if(!c) return; const t0 = c.currentTime;
  freqs.forEach((f, i)=>{ const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f;
    const t = t0 + i*(dur/freqs.length); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur/freqs.length); o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur/freqs.length); }); }
const sfxTap       = ()=> _tone([520], "sine", 0.09, 0.09);
/* [S01r4q · fln-animation-toolkit recipe 22] REAL RECORDINGS, not synthesized tones.
   sfxCorrect/sfxWrongSoft were two-and-three-note WebAudio arpeggios, and this bundle's EAR-CHECK
   has carried them as a known weakness since round 4 ("synthesized tones, inherited"). The kit ships
   measured, licensed recordings — correct rises 10.7 semitones, wrong falls 5.1, both peak-normalised
   to 0.89 and fade-trimmed (see _assets_round4/anim_kit/SFX_LICENCE.txt; Kenney CC0 + a Pixabay clip
   supplied by the team). They are chosen on pitch contour, not filename: a rising cue reads as "yes",
   a falling one as "not that".
   The tone stays as the fallback, so a missing/blocked file degrades to exactly today's behaviour
   rather than to silence — and the WebAudio path is still what unlocks on first gesture. */
function _sfxFile(id, fallback){
  try{
    const a = new Audio("assets/Audio/" + id + "." + AUDIO_EXT);
    a.volume = 0.7;
    /* decode/404/autoplay all land here; the synthesized cue then covers for it */
    a.onerror = ()=>{ try{ fallback(); }catch(e){} };
    const p = a.play();
    if(p && p.catch) p.catch(()=>{ try{ fallback(); }catch(e){} });
  }catch(e){ try{ fallback(); }catch(_){} }
}
const _toneCorrect = ()=> _tone([660, 880, 1180], "sine", 0.42, 0.13);   // rising major arpeggio
const _toneWrong   = ()=> _tone([300, 235], "triangle", 0.20, 0.08);      // gentle, never harsh
const sfxCorrect   = ()=> _sfxFile("sfx_correct", _toneCorrect);
const sfxWrongSoft = ()=> _sfxFile("sfx_wrong",   _toneWrong);
/* a joyful star/confetti pop, centred on the play stage (upper-middle) */
function burstStars(){ const stage = document.querySelector(".slide-stage") || document.body;
  const cx = stage.offsetWidth/2, cy = stage.offsetHeight*0.38, emo = ["⭐","✨","🌟","💫","🎉"];
  for(let i=0;i<14;i++){ const s = document.createElement("span"); s.className = "spark"; s.textContent = emo[i % emo.length];
    const ang = (Math.PI*2)*(i/14) + Math.random()*0.5, dist = 70 + Math.random()*110;
    s.style.left = cx + "px"; s.style.top = cy + "px";
    s.style.setProperty("--dx", (Math.cos(ang)*dist).toFixed(0) + "px");
    s.style.setProperty("--dy", (Math.sin(ang)*dist).toFixed(0) + "px");
    s.style.animationDelay = (i*10) + "ms"; stage.appendChild(s); setTimeout(()=> s.remove(), 950); } }
/* dynamic Swiftie buddy: swap pose + a little pop on every reaction (correct/wrong/explain/celebrate) */
// [20a mascot-01] moods -> production EXPRESSIONS (head webp), not idle-gif basenames.
const SW_POSE = { talk:"talking", point:"talking", idle:"talking", happy:"celebrate", celebrate:"celebrate",
                  hint:"hint", teach:"hint", idea:"hint", tryagain:"tryagain" };
const SW_STILL = (() => { try { const q=new URLSearchParams(location.search);
  return q.has("still") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); } catch(e){ return false; } })();
let swMood = "point";
/* Swiftie's mouth animates ONLY while a voice clip is sounding; the instant audio ends we freeze to
   the still closed-mouth frame. Driven off isPlaying (toggled by setPlaying at every clip start/end). */
function swApplyPose(){ /* [20a] retired: heads no longer couple to isPlaying (setSwMood drives them). */ }
function _swApplyPose_dead(){ const img = document.getElementById("swBuddyImg"); if(!img) return;
  img.src = "assets/UI/" + (isPlaying ? (SW_POSE[swMood] || SW_POSE.talk) + ".gif" : SW_REST + ".png");
  img.style.display = ""; }
function setSwMood(m){ swMood = m;
  const img = document.getElementById("swBuddyImg"), w = document.getElementById("swBuddy");
  if(!img) return;
  const expr = SW_POSE[m] || "talking";
  const animated = expr !== "talking" && !SW_STILL;   // resting face is the static talking head
  img.onerror = () => { img.onerror = null; img.src = "assets/UI/mascot.webp"; };   // [mascot-10]
  const bust = (animated && expr === "celebrate") ? ("?r=" + (state.slideStart || 1)) : "";  // [mascot-08] replay play-once
  img.src = "assets/UI/sw_head_" + expr + (animated ? "_anim" : "") + ".webp" + bust;
  if(w) w.dataset.expr = expr; }
/* [28u] CONFETTI FALLS FROM THE TOP OF THE PAGE — the correct-answer celebration (replaces the popup).
   Yasir 2026-07-29, stated final: "confetti is supposed to come from top of the screen and not from the
   sides", then the follow-up "it should drop from the top of the entire page". This REPLACES the two
   bottom-corner cannons that shipped from r4 through 28t.
   Two details that are load-bearing, both learned the hard way on HI01H01_L02_S04/S05 where this was
   first built and verified before being lifted here:
     - parent to <body> in VIEWPORT coords with position:fixed, NOT to .slide-stage. The stage is inset
       inside the viewport, so spawning at the stage's top edge visibly began part-way down the page.
     - z-index above the end-screen overlay, or the celebration that matters most is the one you cannot
       see.
   The element and the --tx/--ty custom-property contract are unchanged, so the existing .conf-shot
   keyframes still drive it — only the origin and the vectors moved. Note `.confetti i{top:-24px;
   animation:confettiFall}` in style.css remains DEAD CSS from the pre-r4 implementation: nothing
   creates those <i> elements. Left alone deliberately rather than deleted in the same bump. */
/* [S01r4q · fln-animation-toolkit recipe 7] PAPER PHYSICS, not falling rectangles.
   The old cannon dropped 48 single elements down a fixed diagonal at one speed: they read as
   coloured tickets, because a real piece of paper does four things at once and one element cannot
   animate three transforms. Each piece is now three nested elements — .p falls at CONSTANT speed
   (paper hits terminal velocity almost immediately, so `linear`, never ease-out), .w swings, .f
   tumbles about two axes and shows a darkened BACK face. ~22% go end-over-end and drift steadily;
   the rest flutter and barely drift, which is how the two regimes actually differ.
   Same call signature and the same ~2.6s lifetime, so every existing caller is unchanged. */
const CONF_PAIRS = [
  ["#8B2FC9","#5E1C8C"], ["#3F51B5","#27358A"], ["#1E88E5","#135FA6"], ["#22B24C","#157A34"],
  ["#FFD21E","#D9A800"], ["#FF8A1E","#C75F00"], ["#E5322D","#A81F1B"]
];
/* weighted: star 40%, rectangle 20%, line 20%, square 20% — the sizes are deliberately far
   apart, because at 7-11px a square and a rectangle are indistinguishable while spinning */
const CONF_SHAPES = ["st","st","st","st","rc","rc","ln","ln","sq","sq"];
function confettiCannon(n){
  const host = document.body;
  if(document.documentElement.classList.contains("no-anim")) return;   // R5
  const R = (a, b)=> a + Math.random() * (b - a);
  const count = n || 56;
  host.querySelectorAll(".fx-confetti").forEach(x => x.remove());
  const dist = (window.innerHeight || 800) + 60;
  let maxLife = 0;
  const wrap = document.createElement("div"); wrap.className = "fx-confetti";
  for(let i = 0; i < count; i++){
    const z = R(0.75, 1.15);               /* depth: nearer pieces are bigger... */
    const fall = R(1.1, 1.8) / z;          /* ...and fall faster (parallax)       */
    const delay = R(0, 0.35);
    if(fall + delay > maxLife) maxLife = fall + delay;
    const pair = CONF_PAIRS[i % CONF_PAIRS.length];
    /* a fluttering plate zigzags but barely drifts; an autorotating one drifts but hardly zigzags */
    const flutter = Math.random() > 0.22;
    const rockT = flutter ? R(0.6, 1.2) : R(0.75, 1.5);
    const sway  = flutter ? R(10, 34)   : R(2, 8);
    const drift = flutter ? R(-12, 12)  : R(-45, 45);
    const bob   = flutter ? R(3, 7)     : R(2, 4);
    const p = document.createElement("i"); p.className = "p";
    p.style.cssText =
      "--x:" + R(-2, 98).toFixed(1) + "%;--dist:" + dist + "px;" +
      "--fall:" + fall.toFixed(2) + "s;--delay:" + delay.toFixed(2) + "s;" +
      "--drift:" + drift.toFixed(0) + "px;--sway:" + sway.toFixed(0) + "px;" +
      "--bob:" + bob.toFixed(1) + "px;--rockT:" + rockT.toFixed(2) + "s;" +
      "--amp:" + Math.round(R(28, 52)) + "deg;" +     /* capped short of edge-on so the face reads */
      "--yaw:" + Math.round(R(-30, 30)) + "deg;--tilt:" + Math.round(R(-25, 25)) + "deg;" +
      "--z:" + z.toFixed(2) + ";--dim:" + (0.72 + (z - 0.75) / 0.4 * 0.28).toFixed(2) + ";" +
      "--c:" + pair[0] + ";--c2:" + pair[1] + ";";
    const w = document.createElement("i"); w.className = "w";
    const f = document.createElement("i");
    f.className = "f " + CONF_SHAPES[Math.floor(Math.random() * CONF_SHAPES.length)] +
                  (flutter ? "" : " tum");
    w.appendChild(f); p.appendChild(w); wrap.appendChild(p);
  }
  host.appendChild(wrap);
  setTimeout(()=> wrap.remove(), (maxLife + 0.3) * 1000);
}
/* [S01r4q · fln-animation-toolkit recipe 19] TILE-LEVEL CONFIRM, alongside the confetti.
   The tile presses IN (scale .966 at 11%) before it pops — that anticipation dip is small enough
   to be below conscious threshold and is what makes the pop read as caused by the child's finger
   rather than as the screen celebrating at them. Then a few sparks lift off the TOP ARC only: a
   full 360° ring competes with the screen-wide confetti and crosses the letter being read.
   Additive — the existing `.correct` class (green border, ✓ badge) is untouched and still carries
   the mark; this only adds motion on top. */
function ckCorrect(el, crown){
  if(!el) return;
  if(document.documentElement.classList.contains("no-anim")) return;   // R5: mark stays, motion goes
  try{
    el.querySelectorAll(":scope > .ck-crown").forEach(x => x.remove());
    el.classList.remove("ck-correct");
    void el.offsetWidth;                                  /* forced reflow — restarts the pop */
    el.classList.add("ck-correct");
    const n = (crown == null) ? 5 : crown;
    if(!n) return;
    /* clientWidth is layout px INSIDE the transform-scaled stage, i.e. design px already.
       getBoundingClientRect() here would come back multiplied by --scale. */
    const w = el.clientWidth || 96, h = el.clientHeight || 96;
    const rx = w * 0.46, ry = h * 0.46;                    /* the tile's own edge */
    const R = (a, b)=> a + Math.random() * (b - a);
    const cr = document.createElement("span"); cr.className = "ck-crown";
    cr.setAttribute("aria-hidden", "true");
    for(let i = 0; i < n; i++){
      const t = (n === 1) ? 0.5 : i / (n - 1);
      const a = (-158 + t * 136 + R(-7, 7)) * Math.PI / 180;   /* TOP arc only */
      const x0 = Math.cos(a) * rx, y0 = Math.sin(a) * ry;      /* start ON the edge */
      const out = R(0.20, 0.34);
      const s = document.createElement("i");
      s.style.cssText =
        "--ss:" + R(7, 12).toFixed(1) + "px;" +
        "--x0:" + x0.toFixed(1) + "px;--y0:" + y0.toFixed(1) + "px;" +
        "--sx:" + (x0 + Math.cos(a) * w * out).toFixed(1) + "px;" +
        "--sy:" + (y0 + Math.sin(a) * h * out).toFixed(1) + "px;" +
        "--sr:" + Math.round(R(-140, 140)) + "deg;";
      cr.appendChild(s);
    }
    el.appendChild(cr);
    /* sweep only the TRANSIENT layer; .ck-correct and the tile's own mark stay put */
    setTimeout(()=>{ try{ cr.remove(); }catch(e){} }, 900);
  }catch(e){}
}
/* [S01r5u · fln-animation-toolkit recipes 1 + 2] START-SCREEN SKY, TO THE REFERENCE.
   Source: github.com/ananya-goswami/fln-animation-toolkit — ANIMATIONS.md §1 "Start screen stars
   (drift)" and §2 "Start screen stars (tap to burst)". The SME supplied the repo; this is now a
   port of it rather than an interpretation of it.

   WHAT EVERY EARLIER ROUND GOT WRONG, AND WHY IT COULD NOT BE FIXED BY TUNING.
   r4r ported §1 but dropped its CSS mask, reasoning that the spawn radius r0 could keep the centre
   clear "by construction". It cannot: the kit's hole is the shape of the CARD, a wide rectangle,
   and r0 describes a CIRCLE. Everything after that was a chase:
     · r5l made the start radius per-lane so it cleared the card's rectangle — correct geometry,
       but the card fills most of the window, so the lanes began at the screen rim (18 of 87
       stars visible) and the sky read as absent.
     · r5r capped the radius to pull them back on screen — which put 26 of them over the card.
     · r5s traded the other way again.
   The kit does not choose. Stars fly from the CENTRE, straight out, and a mask hole the size of the
   card OCCLUDES them while they are behind it (§1: "hole punched over the centre card ... Hard
   edge: a real occlusion boundary"). That is why the reference is both dense and clean, and it is
   the one thing our port never had. The mask lives in style.css; the geometry here is now the kit's
   verbatim r0:22 / r1:72.

   §2 is what the SME meant by "the star popping animation": tapping a drifting star bursts it into
   16 particles in 6 hues, arcing under gravity, with a synthesised pop. It was never installed
   here. (r5s added a burst of my own invention; this replaces it.) */
const SKY = {
  lanes: 29, r0: 22, r1: 72,
  layers: [{rot: 0, scale: 1}, {rot: 6.2, scale: 0.62}, {rot: -6.2, scale: 0.55}],
  size: [0.8, 2.6], dur: [18, 34], glow: [3.0, 4.8], opacity: [0.62, 0.92],
  shapes: ["s1", "s2", "s3", "s4", "s5"],
};
/* §2 defaults, verbatim. NOTE the kit's own gotcha: the shipped code called the gravity variable
   --g, which collides with the sky's glow-duration --g. The kit renames it --gy; so do we. */
const SKY_BURST = {
  rings: [{n: 9, rad: 3.1, size: 0.58, dur: 0.80}, {n: 7, rad: 1.8, size: 0.78, dur: 0.62}],
  hues: ["#FCB717", "#3B7DD8", "#21A74A", "#E5484D", "#7048D6", "#F1781D"],
  kind: {s1: "k-star", s2: "k-star", s3: "k-spark", s4: "k-dot", s5: "k-dot"},
  gravity: 0.42, pad: 12, padRatio: 0.7, minAlpha: 0.08, life: 1200,
  volume: 0.22, crackles: 4,
};
function _skyStill(){
  if(document.documentElement.classList.contains("no-anim")) return true;
  try{ return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; }
}

/* §2 boom(): sine thud + filtered noise tail + square crackles. Synthesised rather than a clip -
   the kit ships no audio for this, and a generated pop costs nothing against our 10MB budget. */
function skyBoom(){
  const actx = _ac(); if(!actx || isMuted) return;
  try{
    const t = actx.currentTime, out = actx.createGain();
    out.gain.value = SKY_BURST.volume; out.connect(actx.destination);

    const tg = actx.createGain();
    tg.gain.setValueAtTime(0.9, t);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    tg.connect(out);
    const osc = actx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.16);
    osc.connect(tg); osc.start(t); osc.stop(t + 0.18);

    const n = actx.sampleRate * 0.45;
    const buf = actx.createBuffer(1, n, actx.sampleRate), d = buf.getChannelData(0);
    for(let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6);
    const src = actx.createBufferSource(); src.buffer = buf;

    for(let c = 0; c < SKY_BURST.crackles; c++){
      const cg = actx.createGain(), ct = t + 0.10 + Math.random() * 0.30;
      cg.gain.setValueAtTime(0.0001, ct);
      cg.gain.exponentialRampToValueAtTime(0.18, ct + 0.006);
      cg.gain.exponentialRampToValueAtTime(0.0001, ct + 0.07);
      cg.connect(out);
      const co = actx.createOscillator();
      co.type = "square";
      co.frequency.setValueAtTime(1500 + Math.random() * 2200, ct);
      co.connect(cg); co.start(ct); co.stop(ct + 0.08);
    }
    const bp = actx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 3400; bp.Q.value = 0.8;
    const ng = actx.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.exponentialRampToValueAtTime(0.5, t + 0.03);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    src.connect(bp); bp.connect(ng); ng.connect(out); src.start(t + 0.02);
  }catch(e){}
}

/* [S01r4s · fln-animation-toolkit recipe 4] Give the nudge hand its tap ripple: two wavefronts and
   a spark pop breaking from the fingertip at the moment of contact. Built once, into the existing
   #nudgeHand, and left there — the layers are opacity-0 for most of the cycle, so they cost nothing
   while the hand is hidden. Inserted BEFORE the <img> so the ring passes behind the finger, which is
   how the source artwork reads. */
function buildHandFx(){
  try{
    const nh = document.getElementById("nudgeHand");
    if(!nh || nh.querySelector(".nh-tapfx")) return;
    if(document.documentElement.classList.contains("no-anim")) return;   // R5
    const fx = document.createElement("span");
    fx.className = "nh-tapfx"; fx.setAttribute("aria-hidden", "true");
    fx.innerHTML = '<i class="fx-ro"></i><i class="fx-ri"></i><i class="fx-sp"></i>';
    nh.insertBefore(fx, nh.firstChild);
  }catch(e){}
}
/* [S01r4s · fln-animation-toolkit recipe 20] The outward spark ring on a wrong tap. The red flash,
   the shake and the grey-lock-only-on-the-2nd are this engine's own and are NOT touched — three SME
   rounds settled them. This adds the ring the kit contributes, on the shared --fx-beat, and it is
   gone within that one beat because a wrong answer RELEASES: another attempt is coming. */
function wgWrong(el, n){
  try{
    if(!el) return;
    if(document.documentElement.classList.contains("no-anim")) return;
    el.querySelectorAll(":scope > .wg-fx").forEach(x => x.remove());
    const count = n || 8;
    const w = el.clientWidth || 96, h = el.clientHeight || 96;
    const fx = document.createElement("span");
    fx.className = "wg-fx"; fx.setAttribute("aria-hidden", "true");
    for(let i = 0; i < count; i++){
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.25;
      const out = 0.42 + Math.random() * 0.16;
      const s = document.createElement("i");
      s.style.cssText =
        "--ws:" + (5 + Math.random() * 4).toFixed(1) + "px;" +
        "--wx:" + (Math.cos(a) * w * out).toFixed(1) + "px;" +
        "--wy:" + (Math.sin(a) * h * out).toFixed(1) + "px;" +
        "animation-delay:" + (Math.random() * 60).toFixed(0) + "ms;";
      fx.appendChild(s);
    }
    el.appendChild(fx);
    setTimeout(()=>{ try{ fx.remove(); }catch(e){} }, 700);   /* inside the flash's own lifetime */
  }catch(e){}
}
/* §2 pop(). The star is HIDDEN, not removed, and comes back on its next lap - the kit listens for
   `animationiteration` and filters on the animation NAME, because the glow cycle on ::after fires
   its own iterations far more often than the flight does. */
function popStar(el, r){
  try{
    el.classList.add("popped");
    el.addEventListener("animationiteration", function back(e){
      if(e.animationName !== "sgFly") return;
      el.classList.remove("popped");
      el.removeEventListener("animationiteration", back);
    });

    let kind = "k-dot";
    el.classList.forEach ? el.classList.forEach(c => { if(SKY_BURST.kind[c]) kind = SKY_BURST.kind[c]; })
                         : null;
    const bs = Math.max(11, r.width);
    const b = document.createElement("div");
    b.className = "sg-burst " + kind;
    b.style.left = (r.left + r.width / 2) + "px";
    b.style.top  = (r.top  + r.height / 2) + "px";
    b.style.setProperty("--bs", bs + "px");
    b.appendChild(document.createElement("div")).className = "fl";

    let k = 0;
    for(let g = 0; g < SKY_BURST.rings.length; g++){
      const R = SKY_BURST.rings[g], off = Math.random() * Math.PI * 2;
      for(let i = 0; i < R.n; i++, k++){
        const a = off + i / R.n * Math.PI * 2;
        const dist = bs * R.rad * (0.78 + Math.random() * 0.44);
        const p = document.createElement("i");
        p.style.cssText =
          "--ps:"  + (bs * R.size * (0.8 + Math.random() * 0.5)).toFixed(1) + "px;" +
          "--dx:"  + (Math.cos(a) * dist).toFixed(1) + "px;" +
          "--dy:"  + (Math.sin(a) * dist).toFixed(1) + "px;" +
          "--gy:"  + (dist * SKY_BURST.gravity).toFixed(1) + "px;" +
          "--sd:"  + (R.dur + Math.random() * 0.22).toFixed(2) + "s;" +
          "--sdl:" + (Math.random() * 0.06).toFixed(3) + "s;" +
          "color:" + SKY_BURST.hues[k % SKY_BURST.hues.length];
        b.appendChild(p);
      }
    }
    document.body.appendChild(b);
    skyBoom();
    setTimeout(()=>{ try{ b.remove(); }catch(e){} }, SKY_BURST.life);
  }catch(e){}
}

/* §2's hit-test. The kit is explicit about why this is done by hand: "making .sg-sky interactive
   would put an invisible full-screen layer over every button". r5s did exactly that; this reverts
   it. The layer stays pointer-events:none and we test the pointer against each star's rect on a
   CAPTURE-phase document listener, claiming the tap only when one is actually hit. */
function armSkyBurst(){
  if(window.__skyBurstArmed) return;
  window.__skyBurstArmed = true;
  document.addEventListener("pointerdown", (e)=>{
    try{
      if(_skyStill()) return;
      /* [S01r5v] the kit's default is when:["is-start","is-end"] - the end screen is poppable
         too, and r5u had narrowed this to the cover. */
      const bc = document.body.classList;
      if(!bc.contains("is-start") && !bc.contains("is-end")) return;
      const sky = document.querySelector(".sg-sky"); if(!sky) return;
      const els = sky.querySelectorAll("i:not(.popped)");
      for(let i = 0; i < els.length; i++){
        const el = els[i], r = el.getBoundingClientRect();
        if(r.width < 2) continue;
        const pad = Math.max(SKY_BURST.pad, r.width * SKY_BURST.padRatio);   /* ~4px targets need slack */
        if(e.clientX < r.left - pad || e.clientX > r.right  + pad ||
           e.clientY < r.top  - pad || e.clientY > r.bottom + pad) continue;
        if(parseFloat(getComputedStyle(el).opacity) < SKY_BURST.minAlpha) continue;
        e.stopPropagation(); e.preventDefault();   /* or the tap also fires the button underneath */
        popStar(el, r);
        return;
      }
    }catch(err){}
  }, true);
}

/* [S01r6i] THE BALLOON PAGE'S MUSIC — THE SME'S OWN CLIP, REPLACING r6g's SYNTHESISER.
   r6g synthesised a pad because a music file would not fit: dist had ~112 KB of headroom and the
   supplied track is 3.16 MB. That was the right call then and it is the wrong call now, because the
   track has structure worth keeping. What ships is ONE 12.00s phrase of it, not the whole 98s:
   autocorrelation over the quiet opening section puts the musical period at exactly 12.00s (r=0.966),
   and the two phrases inside the first 24s are near-identical - so a 24s cut would have cost double
   the bytes for no extra variety. The loop is crossfaded onto itself over 0.25s at the head, which
   puts the splice step at 454 against the material's own 99th-percentile step of 4709: inaudible.
   At 40 kbps mono Opus that is 70 KB of the 106 KB that was free.

   AN <audio> ELEMENT, NOT WEB AUDIO. decodeAudioData needs fetch(), and this bundle is deliberately
   fetch-free everywhere except telemetry so it runs from file:// - routing the bed through Web Audio
   would have made it the one asset that goes silent when the HTML is opened off a disk. The price is
   that the level has to be ramped by hand instead of with setTargetAtTime; balGate does that.

   THREE RULES, and rules 1 and 2 are the SME's words:
     1. "the audio will only sound when the vo is finish" - it stays silent until the opening
        sequence has finished naming every balloon, which is balMusicOpen().
     2. "when the ballon pop or swift ai is saying something they will sound correctly" - it drops to
        SILENCE under any clip, not to r6g's 0.34 duck. Pops are exempt on purpose: playSfx runs on
        its own element and never sets isPlaying, so a 0.2s pop cannot make the bed pump, and at 0.7
        against the bed's 0.34 it cuts straight through anyway.
     3. it honours mute, continuously rather than once at the start, and it never outlives the page. */
const BAL_MUSIC = {
  id: "sfx_bal_music",
  vol: 0.34,           /* resting level, once the page has stopped talking */
  up: 0.010,           /* per 40ms tick: ~1.4s to swell back in */
  down: 0.100,         /* per 40ms tick: ~140ms to get out of a word's way */
  el: null, gate: 0, open: false,
};
function balMusicStart(){
  try{
    if(BAL_MUSIC.el) return;
    if(document.documentElement.classList.contains("no-anim")) return;
    const a = new Audio("assets/Audio/" + BAL_MUSIC.id + "." + AUDIO_EXT);
    a.loop = true; a.volume = 0; a.preload = "auto";
    BAL_MUSIC.el = a; BAL_MUSIC.open = false;
    /* ONE interval owns the level, and it recomputes the target every tick rather than being told
       when to duck. A clip can end half a dozen ways here - natural end, stopAudio, a superseded
       chain, a missing file, a refused autoplay - and only a poll sees all of them. Being told
       would eventually leave the bed silent for the rest of the page after an ending nobody wired. */
    BAL_MUSIC.gate = setInterval(()=>{
      const el = BAL_MUSIC.el; if(!el) return;
      const target = (isMuted || !BAL_MUSIC.open || isPlaying) ? 0 : BAL_MUSIC.vol;
      const d = target - el.volume;
      const v = Math.max(0, Math.min(1, el.volume + (d > 0 ? Math.min(d, BAL_MUSIC.up)
                                                           : Math.max(d, -BAL_MUSIC.down))));
      try{ el.volume = v; }catch(e){}
    }, 40);
  }catch(e){}
}
/* Opened once the board has finished introducing itself. Idempotent: round 2 calls it again and it
   does nothing, which is what we want - the bed should carry ACROSS rounds, and it silences itself
   under round 2's prompt through isPlaying without being told to. */
function balMusicOpen(){
  try{
    const el = BAL_MUSIC.el;
    if(!el || BAL_MUSIC.open) return;
    BAL_MUSIC.open = true;
    el.play().catch(()=>{});      /* refused autoplay is not an error worth surfacing - it is a bed */
  }catch(e){}
}
function balMusicStop(){
  try{
    const el = BAL_MUSIC.el; if(!el) return;
    BAL_MUSIC.el = null; BAL_MUSIC.open = false;
    clearInterval(BAL_MUSIC.gate);
    /* fade rather than cut, then stop for real - a paused element at volume 0 still holds a decoder */
    let v = el.volume;
    const f = setInterval(()=>{
      v -= 0.08;
      if(v <= 0){ clearInterval(f); try{ el.pause(); el.currentTime = 0; el.src = ""; }catch(e){} }
      else { try{ el.volume = v; }catch(e){} }
    }, 40);
  }catch(e){}
}
function buildSky(){
  try{
    if(_skyStill()) return;                                              // kit R5
    if(document.querySelector(".sg-sky")) return;                        // idempotent
    const bg = document.querySelector(".start-bg");
    if(!bg || !bg.parentNode) return;
    const R = (a, b)=> a + Math.random() * (b - a);

    /* §1 ships a breathing radial wash under the stars; we never had it. */
    const glow = document.createElement("div");
    glow.className = "sg-glow"; glow.setAttribute("aria-hidden", "true");

    const sky = document.createElement("div");
    sky.className = "sg-sky"; sky.setAttribute("aria-hidden", "true");
    let maxSize = 0;
    SKY.layers.forEach((L, li)=>{
      for(let i = 0; i < SKY.lanes; i++){
        const a = ((360 / SKY.lanes) * i + L.rot) * Math.PI / 180;
        const cos = Math.cos(a), sin = Math.sin(a);
        const size = +((R(SKY.size[0], SKY.size[1])) * L.scale).toFixed(2);
        if(size > maxSize) maxSize = size;
        const dur = +R(SKY.dur[0], SKY.dur[1]).toFixed(1);
        const n = document.createElement("i");
        n.className = SKY.shapes[(i + li) % SKY.shapes.length];
        /* r0/r1 are FIXED vmax radii, exactly as the kit has them: the card is cleared by the
           mask, not by the geometry, so nothing here needs to know where the card is - which is
           also why this layer needs no resize handler any more. */
        n.style.cssText =
          "--s:"  + size + "vmax;" +
          "--x1:" + (SKY.r0 * cos).toFixed(2) + "vmax;--y1:" + (SKY.r0 * sin).toFixed(2) + "vmax;" +
          "--x2:" + (SKY.r1 * cos).toFixed(2) + "vmax;--y2:" + (SKY.r1 * sin).toFixed(2) + "vmax;" +
          "--t:"  + dur + "s;" +
          /* a NEGATIVE delay starts each lane mid-flight, so the field is full on the first frame */
          "--d:-" + (Math.random() * dur).toFixed(1) + "s;" +
          "--g:"  + R(SKY.glow[0], SKY.glow[1]).toFixed(1) + "s;" +
          "--gd:-" + (Math.random() * 4).toFixed(1) + "s;" +
          "--o:"  + R(SKY.opacity[0], SKY.opacity[1]).toFixed(2) + ";";
        sky.appendChild(n);
      }
    });
    /* the kit's collision proof: the lane arc at the tightest radius must clear the biggest element */
    const arc = (2 * Math.PI * SKY.r0) / SKY.lanes;
    if(arc < maxSize * 1.5)
      console.warn("[animation-kit] sky lanes too tight: arc " + arc.toFixed(2) +
                   "vmax vs element " + maxSize.toFixed(2) + "vmax.");

    bg.parentNode.insertBefore(glow, bg.nextSibling);
    bg.parentNode.insertBefore(sky, glow.nextSibling);   // both above the plate, below the gate
    armSkyBurst();
  }catch(e){}
}

/* ---------- Block Town helpers (flagship) ---------- */
const BT_COLORS = ["#F9695E","#FDC23C","#4EBE6A","#4EA3F0","#9B7BE8"];
function btBlock(i){ const b = document.createElement("div"); b.className = "blk"; b.style.background = BT_COLORS[i % BT_COLORS.length]; return b; }
function btThunk(n){ _tone([360 + n*46], "sine", 0.12, 0.10); }   // pitch climbs one step per block — HEAR the count
function btDust(plot){ const d = document.createElement("span"); d.className = "bt-dust"; d.textContent = "💨"; plot.appendChild(d); setTimeout(()=> d.remove(), 520); }
function btSkyline(done, total){ const s = document.createElement("div"); s.className = "bt-skyline";
  for(let i=0;i<total;i++){ const b = document.createElement("div"); b.className = "bt-bldg" + (i < done ? " done" : "");
    b.style.height = (26 + ((i*17) % 32)) + "px"; s.appendChild(b); } return s; }
/* the teach scene: the crane drops N blocks ONE AT A TIME (ascending thunk + spoken count) then a
   cardinality "freeze" (vo_total_N). Reached from MEET_NUMBER via data.present==='crane'. */
function btCraneMeet(host, slide){
  const d = slide.data, N = d.count;
  state.ownsAudio = true;   // the crane drops+counts blocks on its own timed VO — skip autoPlayChain
  const stage = document.createElement("div"); stage.className = "bt-stage";
  const board = document.createElement("div"); board.className = "bt-board";
  board.innerHTML = `<span class="bt-numeral">${N}</span>` + (d.word ? `<span class="bt-goallbl">${d.word}</span>` : "");   // Arabic numeral (from the integer, not card Devanagari)
  const track = document.createElement("div"); track.className = "bt-track"; const cells = [];
  for(let i=1;i<=N;i++){ const c = document.createElement("div"); c.className = "bt-nt"; track.appendChild(c); cells.push(c); }
  const yard = document.createElement("div"); yard.className = "bt-yard";
  const crane = document.createElement("div"); crane.className = "bt-crane"; crane.innerHTML = `<img src="assets/Images/obj_crane.png" alt="">`;
  const plotwrap = document.createElement("div"); plotwrap.className = "bt-plotwrap";
  const plot = document.createElement("div"); plot.className = "bt-plot ground";
  plot.style.setProperty("--bh", Math.max(20, Math.min(46, Math.floor(230/N) - 2)) + "px");
  plotwrap.appendChild(plot); yard.appendChild(crane); yard.appendChild(plotwrap);
  stage.appendChild(board); stage.appendChild(track); stage.appendChild(yard);
  host.appendChild(stage);
  state.gateNavUntilAudio = false; setNavActive(false);
  $("navBtn").onclick = ()=> completeSlide(true);
  let i = 0;
  const step = ()=>{
    if(i >= N){ if(d.topper){ const t = document.createElement("div"); t.className = "bt-topper snap"; t.innerHTML = `<img src="assets/Images/${d.topper}.png" alt="">`; plot.appendChild(t); }
      burstStars(); play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT, ()=> setNavActive(true)); return; }
    const b = btBlock(i); b.classList.add("drop"); plot.appendChild(b); i++;
    if(cells[i-1]){ cells[i-1].classList.add("lit"); cells[i-1].textContent = i; }
    btThunk(i); btDust(plot);
    play("assets/Audio/vo_num_" + i + "." + AUDIO_EXT, ()=> setTimeout(step, 340));
  };
  // play the slide prompt FIRST, then start the crane count sequence — so the count VO never cuts the
  // prompt off (we own the audio here; mountSlide's autoPlayChain is skipped via state.ownsAudio).
  play(audioFor(slide, "prompt") || null, ()=> setTimeout(step, 400));
}
/* slide audio path: per slide, we look at slide.audio.prompt / .phoneme / etc.
   In this v0.1 the embedded card holds short ids; the compiler would replace
   them with base64 data URIs. We resolve to assets/Audio/{id}.mp3 with fallback. */
function audioFor(slide, key){
  if(!slide.audio || !slide.audio[key]) return null;
  return "assets/Audio/" + slide.audio[key] + "." + AUDIO_EXT;
}
/* audioText(slide,key): the exact Hindi line the VO for this slot speaks, so a
   popup can SHOW what it SAYS (shown == spoken). Looks up the build-injected
   CARD.assets.audio_text map by the slot's audio_id. null if unknown. */
function audioText(slide, key){
  const id = slide.audio && slide.audio[key];
  if(!id) return null;
  return (CARD.assets && CARD.assets.audio_text && CARD.assets.audio_text[id]) || null;
}
/* Play a SEQUENCE of audio sources back-to-back. Each one finishes (or
   falls back to silent beat if missing) before the next starts. */
function playChain(srcs, i, onDone){
  i = i || 0;
  if(i >= srcs.length){ if(onDone) onDone(); return; }
  play(srcs[i], () => playChain(srcs, i+1, onDone));
}
/* On slide mount, play prompt → phoneme/word_name → instruction in order.
   KG learners can't read prompt_hi — the chain gives them both the
   instruction AND the cue (letter sound or picture name) audibly.
   onDone fires after the whole chain finishes (used to gate the नav button). */
function autoPlayChain(slide, onDone){
  const order = ["prompt","phoneme","shape_name","word_name","instruction"];
  const chain = [];
  for(const k of order){
    const src = audioFor(slide, k);
    if(src) chain.push(src);
  }
  if(chain.length) playChain(chain, 0, onDone);
  else if(onDone) onDone();
}

/* nav button: enable/disable the kit-style pill. When it becomes active (the
   activity is done) but the child doesn't tap आगे, the hand-nudge points at it. */
function setNavActive(on){
  const btn = $("navBtn");
  btn.disabled = !on;
  btn.classList.toggle("active", on);
  clearTimeout(state.navNudgeTimer);
  /* [20a nudge-03] no auto-nudge on आगे — buttons are known affordances (ruling); nudge is for learning elements only. */
}
function nudgeNavBtn(){
  const btn = $("navBtn");
  if(!btn.classList.contains("active") || state.hintActive) return;
  const nh = $("nudgeHand");
  const r = btn.getBoundingClientRect();
  const sw = document.querySelector(".slide-stage").getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  nh.style.left = ((r.left - sw.left)/scale + r.width/scale/2 - 48) + "px";
  nh.style.top  = ((r.top  - sw.top )/scale + r.height/scale/2 - 6) + "px";
  nh.classList.add("show","hint-glow");
}

/* ---------- 4. STATE ---------- */
const state = {
  idx: 0,
  slideStart: Date.now(),
  attempts: 0,
  audioReplays: 0,
  hintUsed: false,
  nudgeUsed: false,
  scaffoldLevel: 0,   // 0 none, 1 nudge, 2 hint, 3 reveal
  selectedKey: null,
  locked: false,
  hintActive: false,
  helpShown: false,   // [25d] terminal-help rung shown for this slide (no auto-answer)
  masteryHits: 0,
  masteryAttempts: 0,
  nudgeTimer: null
};

/* ---------- 5. NUDGE ----------
   target may be a CSS selector OR an element. Used for flow guidance (e.g. the "listen" button /
   prompt). It used to be forbidden to point at the correct answer; as of [27b] there is ONE
   sanctioned exception — a TUTORIAL slide whose answer is already being revealed (the .reveal-hold
   glow after the 2nd wrong attempt) also gets the hand, because at that rung the answer is on
   screen anyway. See revealAnswer() in mountTapOptions. Everywhere else the old rule stands. */
function startNudge(slide, target){
  clearTimeout(state.nudgeTimer);
  if(!target) return;
  /* [28i] THE ROUND-3 HAND BAN IS ENFORCED HERE, NOT LEFT TO CARD DATA.
     This is why Yasir's "no hand nudge in the 3rd round" kept coming back after I kept reporting it
     fixed. 28f closed the answer/tap paths (handOnAnswer + HAND_PHASES), but the drag/count PROGRESS
     cue arrives through here, and the only round-3 guard was the card's own
     scaffold_rules.nudge_timeout_ms[phase] — which 22 of 27 games set to `independent: 8000`
     (two also set practice). So on a drag or count slide in round 3, 8s of hesitation still produced
     a hand. Card data cannot be the guard for a hard rule; the engine refuses now, and a card that
     still arms round 3 is simply ignored rather than silently obeyed. */
  /* IDLE is stricter than TERMINAL HELP. handOnAnswer() allows guided, because there the hand is
     EARNED by two failed attempts. This path is the un-earned one — armed by a timer at mount — and
     Yasir's rule covers it exactly: "any form of visual hint will only be given after 2 failed
     attempts", and separately "in guided, a hand nudge appears right after VO is played but the hand
     nudge should appear only after 2 failed attempts". So the idle/progress hand lives in TUTORIAL
     only, where it is teaching rather than hinting. Round 2 keeps its hand via terminal help; round 3
     has none by either route. */
  if(!IDLE_HAND_PHASES.has(slide.phase)) return;
  const ms = (CARD.scaffold_rules.nudge_timeout_ms || {})[slide.phase];
  if(!ms) return;
  state.nudgeTimer = setTimeout(()=>{
    // [27e] ...and never once TERMINAL HELP owns the hand. The flow nudge is armed at mount, so at
    // guided (5000ms) it fired AFTER a 2-wrong reveal and re-pointed the hand away from the glowing
    // answer to the flow target — the hand was visible but pointing at nothing useful. Caught by
    // measuring the hand's rect against the correct cell's; `handShown:true` alone hid the bug, and
    // it silently affected the 27b tutorial hand too.
    if(state.locked || state.hintActive || state.helpShown) return;
    const el = (typeof target === "string") ? document.querySelector(target) : target;
    if(!el) return;
    /* [28i] ONE POSITIONING RULE, ONE COPY OF IT. This function carried its own duplicate of the old
       formula (top = elementBottom - 30), so the 28h "hand sits BELOW the tile, never on its word" fix
       landed in pointNudgeAt and silently did NOT apply to any progress cue — the same fingertip-over-
       the-label bug, still live on every drag and count tile. Delegated instead of re-implemented, so
       the next placement change cannot miss one of the two call paths again. */
    pointNudgeAt(el);
    state.nudgeUsed = true;
    state.scaffoldLevel = Math.max(state.scaffoldLevel, 1);
    SwiftPAL.emit("nudge_invoked", { slide_id: slide.id, phase: slide.phase });
  }, ms);
}
function stopNudge(){
  clearTimeout(state.nudgeTimer);
  if(state._handTravel){ try { state._handTravel.cancel(); } catch(e){} state._handTravel = null; }
  $("nudgeHand").classList.remove("show");
}
/* [28o] ON A DRAG, THE HAND SHOWS THE MOVE — it does not just sit on the tile.
   Yasir 2026-07-28: "on drag, the hand nudge guides the student precisely... move the hand nudge from
   the question card to the answer card." A static hand on the tile says "this one" but never says WHERE
   it goes, which on a matching slide is the actual thing the child has to work out. The hand now starts
   on the tile and slides to the correct zone, on a loop, so the gesture itself is demonstrated.
   Positions are computed in DESIGN px against .slide-stage, exactly like pointNudgeAt, so it survives
   --scale. Kept as ONE WAAPI animation stored on state so stopNudge can cancel it — an infinite
   animation left running would follow the child into the next slide. Falls back to a static point if
   either element is missing or the browser has no .animate(). */
/* [S01r5n] FLY A TILE INTO ITS BOX. The watch-first sort page has to SHOW the drag, and a
   travelling hand alone does not: r4v/r4x already tried that (data.drag_demo) and the SME still
   reported the gesture as unclear, because nothing ever moved except the hand.
   The tile is translated to the drop zone and then handed over to the SAME code a real drop uses —
   leaveTrayGhost to hold the tray slot open, `.snapped`, appended into .bin-items — so the page
   ends in exactly the state a child's own drop would leave it in, not a lookalike.
   `land` is reachable twice (transitionend AND the fail-safe), hence the guard: a double landing
   would append the tile a second time and fire the sound twice. */
function flyTileTo(tile, bin, done){
  const zone = bin.querySelector(".bin-items") || bin;
  const from = tile.getBoundingClientRect(), to = zone.getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  const dx = ((to.left + to.width / 2) - (from.left + from.width / 2)) / scale;
  const dy = ((to.top + to.height / 2) - (from.top + from.height / 2)) / scale;
  let landed = false;
  const land = ()=>{
    if(landed) return; landed = true;
    tile.removeEventListener("transitionend", land);
    tile.classList.remove("demo-fly"); tile.style.transform = "";
    try{ leaveTrayGhost(tile); }catch(e){}
    tile.classList.add("snapped");
    zone.appendChild(tile);
    sfxCorrect();
    if(done) done();
  };
  tile.addEventListener("transitionend", land, { once: true });
  tile.classList.add("demo-fly");
  requestAnimationFrame(()=>{
    tile.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(.86)";
  });
  setTimeout(land, 1600);                       /* fail-safe: a dropped transitionend must not stall */
}
function travelNudge(fromEl, toEl, slide, loops){
  if(!fromEl) return;
  if(!toEl || typeof $("nudgeHand").animate !== "function"){ handOnAnswer(fromEl, slide); return; }
  if(!slide || !HAND_PHASES.has(slide.phase)) return;      // same phase rule as handOnAnswer
  stopNudge();
  const nh = $("nudgeHand");
  const sw = document.querySelector(".slide-stage").getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  const at = (el)=>{ const r = el.getBoundingClientRect();
    return { left: (r.left - sw.left)/scale + r.width/scale/2 - 48,
             top:  (r.top  - sw.top )/scale + r.height/scale + 4 }; };
  /* [S01r4y] THE DESTINATION SITS IN THE MIDDLE OF THE BOX, NOT PARKED UNDER IT.
     at() places the hand just BELOW an element, which is the correct pose for POINTING AT a tile -
     the fingertip is at the TOP of the hand image, so the hand hangs under the thing it indicates.
     But the destination of a drag is a box the picture goes INTO, and both ends were using at(), so
     the hand finished under the basket's bottom edge: it read as "drag PAST the box" rather than
     "drop it in here". The SME asked for the centre of the box in BOTH cases, so the fix lives in
     this shared helper and therefore reaches the terminal hint (terminalHold, and the tile -> zone
     travel on the match mechanics) as well as page 10's first-time demo.
     Only the DESTINATION moves. The start still points at the tile from below, because that end IS
     an "this one" gesture. -8 lifts the fingertip a touch above dead centre so the hand's body hangs
     inside the box rather than straddling its lower edge. */
  const into = (el)=>{ const r = el.getBoundingClientRect();
    return { left: (r.left - sw.left)/scale + r.width/scale/2 - 48,
             top:  (r.top  - sw.top )/scale + r.height/scale/2 - 8 }; };
  const a = at(fromEl), b = into(toEl);
  nh.style.left = a.left + "px"; nh.style.top = a.top + "px";
  nh.classList.add("show","hint-glow");
  /* [S01r4x] `loops` is OPTIONAL and defaults to the infinite loop this has always had, so
     terminalHold - which passes nothing - is byte-for-byte unchanged: a child who has already failed
     twice should keep being shown the move until they make it. The page-10 drag DEMO passes a count,
     because a demo that never stops becomes wallpaper; when it finishes the hand puts itself away
     instead of freezing over the basket. */
  const _anim = nh.animate(
    [ { left: a.left+"px", top: a.top+"px", offset: 0 },
      { left: a.left+"px", top: a.top+"px", offset: .18 },
      { left: b.left+"px", top: b.top+"px", offset: .72 },
      { left: b.left+"px", top: b.top+"px", offset: 1 } ],
    { duration: 1800, iterations: (loops > 0 ? loops : Infinity), easing: "ease-in-out" });
  state._handTravel = _anim;
  if(loops > 0) _anim.onfinish = ()=>{ if(state._handTravel === _anim) stopNudge(); };
}
/* [28i] THE GRADED WRONG-ANSWER CLIP, for mechanics that grade their own feedback.
   Yasir's 2026-07-25 ruling is "two hints everywhere, every game, every interaction type". The tap path
   got it in 24a (mountTapOptions) and the drag path in 25a (dragWrong), but the PRODUCE mechanics grade
   their own wrong answers and so inherited neither: MAKE_SET played try_again on rung 1, MAKE_EQUAL had
   no ladder at all, TAP_ALL_WITH_SOUND played only try_again, and BUILD_TO_NUMBER passed `null` — its
   wrong-answer feedback was SILENT, text-only, to a pre-reader who cannot read it.
   Callers increment state.attempts BEFORE speaking, so attempts===1 is the first wrong. Additive: with
   no hint1/hint authored this returns exactly the try_again it returned before, so no card regresses —
   but check_system will now stop reporting these six games' authored hints as unreadable. */
/* [28k] OPTIONAL MIDDLE RUNG — the SME's three-hint ladder (Pehli Dhwani, Bindu 2026-07-28):
     rung 1  "फिर से कोशिश कीजिए।"                           (try again)
     rung 2  "शब्द को बोलकर देखिए, और पहली ध्वनि चुनिए।"       (a STRATEGY, not the answer)
     rung 3  the correct answer
   Our ladder had only two rungs, so rung 2 spoke `hint` — the level that NAMES the answer. A middle
   rung lets a card withhold the answer for one more attempt.
   ADDITIVE AND DECK-SCOPED: with no `hint2` authored this returns exactly the `hint` it returned
   before, so every other game keeps two rungs and Yasir's 2-attempt standard. Only a card that
   authors hint2 AND raises max_attempts to 3 gets a third rung — a deliberate deck-specific override,
   ruled by Yasir 2026-07-28 ("implement as per written by the SME") after the conflict with "blocks
   after the 2nd wrong attempt" was raised with him. Do NOT roll this out fleet-wide without the same
   explicit ask on that deck. */
function midHint(slide){
  return audioFor(slide, "hint2") || audioFor(slide, "hint") || audioFor(slide, "try_again") || null;
}
function wrongClip(slide){
  return (state.attempts <= 1)
    ? (audioFor(slide, "hint1") || audioFor(slide, "try_again") || null)
    : (midHint(slide));                                     /* [28k] rung 2 */
}
/* Show the hand-nudge immediately on a specific element (INTRO uses it to guide
   tapping each letter). Finger points up; fingertip sits just inside the tile's
   lower edge. References .slide-stage (the nudge's positioning context). */
/* [28f] THE ONE RULE FOR THE GUIDING HAND (Yasir 2026-07-28, two rulings merged):
     round 1 tutorial  -> hand allowed (it is teaching)
     round 2 guided    -> hand ONLY after 2 failed attempts (terminal help), never on idle
     round 3 practice / independent / mastery -> NO HAND AT ALL, "regardless of whatever name we
                          save it by"
   Every terminal-help path calls THIS, so the rule lives in one place. That matters: 27d put the hand
   in one of five paths and I reported it as "every phase", which is exactly how this drifted. Any new
   mechanic gets the rule for free by calling handOnAnswer() instead of pointNudgeAt().
   Also note the hand was COVERING the option label in Yasir's capture — another reason round 3 is
   better off without it. */
/* [28l] HARD RULE (Yasir 2026-07-28): "regardless of what interaction, as long as we in guided or
   practice, no question will be solved automatically."
   Only a TUTORIAL slide may finish a question by itself — there it is a teaching demonstration. In every
   test phase the terminal rung must GLOW the answer, DISABLE the other candidates, put the hand on it
   (handOnAnswer is itself phase-gated, so round 3 still gets no hand) and WAIT for the child.
   This existed per-mechanic and drifted three times: 25d fixed MATCH_DRAG_N and SENTENCE_FIND, and left
   PATTERN_BUILD and SEQUENCE_COMPLETE still calling placeCorrect() on a 1s timer — the engine filling in
   the answer. MATCH_GENDER_PAIRS and SEQUENCE_DRAG held the glow but never dimmed the distractors or
   showed the hand. One contract in one place so a new mechanic inherits it instead of re-deciding. */
const MAY_AUTOSOLVE = new Set(["tutorial"]);
function maySolveFor(slide){ return !!slide && MAY_AUTOSOLVE.has(slide.phase); }
function terminalHold(target, others, slide, dest){
  if(!target) return;
  target.classList.add("reveal-hold");
  [...(others || [])].forEach(x=>{
    if(x !== target && !x.classList.contains("used") && !x.classList.contains("snapped")
       && !x.classList.contains("matched")){
      x.classList.add("tile-disabled");
      x.style.setProperty("pointer-events","none","important");
      x.style.setProperty("opacity",".4","important");
    }
  });
  /* [28o] on a DRAG the caller passes the destination zone, so the hand demonstrates the move
     (tile -> its correct zone) instead of only naming the tile. Tap mechanics pass no dest and keep
     the static point. */
  if(dest) travelNudge(target, dest, slide); else handOnAnswer(target, slide);
}
function clearHold(container){
  if(!container) return;
  [...container.children].forEach(x=>{
    x.classList.remove("reveal-hold","tile-disabled");
    x.style.removeProperty("pointer-events"); x.style.removeProperty("opacity");
  });
}
const HAND_PHASES = new Set(["tutorial", "guided"]);
/* [28i] the UN-EARNED hand (idle timer / progress cue) is tutorial-only — see startNudge. */
const IDLE_HAND_PHASES = new Set(["tutorial"]);
function handOnAnswer(el, slide, force){
  /* [S01r5f] `force` is an explicit, per-slide opt-in and nothing else passes it.
     The balloon page moved to the END of the lesson (r5d), which meant its phase had to become
     `practice` or the phase-transition gate would have replayed the guided interstitial near the
     finish. But HAND_PHASES is tutorial+guided, so that move silently killed the hand nudge its own
     deck asks for ("if the learner continues to struggle, show a subtle hand nudge towards one
     correct balloon") - the code was still there and could never fire. Rather than widen the phase
     rule for the whole fleet, the ONE slide that needs it says so on its card (`data.allow_hand`).
     Still earned: this page only calls it after a THIRD wrong tap. */
  if(!el || !slide) return;
  if(!force && !HAND_PHASES.has(slide.phase)) return;
  stopNudge();          // the flow nudge must not drag the hand off the answer
  if(force){ const nh = $("nudgeHand"); if(nh) pointNudgeAtForced(el); return; }
  pointNudgeAt(el, true);   // earned by 2 failed attempts — the one case allowed outside tutorial
}
/* [S01r5f] pointNudgeAt carries the phase rule itself (28j put it there deliberately, because ~25
   call sites bypassed every other gate). So a forced hand cannot go through it - it re-checks and
   returns. This is the same placement maths with the phase check lifted, and it is reachable ONLY
   from handOnAnswer(..., force). */
function pointNudgeAtForced(el){
  const nh = $("nudgeHand");
  if(!nh || !el) return;
  const sw = document.querySelector(".slide-stage");
  if(!sw) return;
  const s = sw.getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  /* [S01r4x] DELEGATE, do not duplicate. This carried its own copy of the placement - centred on the
     tile and dropped `height + 4` below it - so the forced path (practice pages that opt in through
     data.allow_hand, and the balloon page) kept the old below-the-box position even after
     _placeNudge was rewritten to put the fingertip ON the target. Measured: pages 10 and 12 still
     had the tip 8.4px BELOW the tile at 46% across, exactly the old signature, while page 7 through
     the unforced path was already correct. One placement function, one behaviour. */
  const place = ()=> _placeNudge(el, nh);
  place(); requestAnimationFrame(place);
  nh.classList.add("show", "hint-glow");
}
function pointNudgeAt(el, earned){
  if(!el) return;
  /* [28j] THE PHASE RULE LIVES HERE, because this is the only function that can enforce it.
     I gated startNudge (28i) and handOnAnswer (28f) and Yasir STILL found a hand in round 3 — on
     MTKGA01_L04_S01 P5, a COUNT_TAP practice slide. Reason: ~25 call sites call pointNudgeAt DIRECTLY,
     and every one of them bypassed both gates. COUNT_TAP's nudgeNext is the clearest case: the slide is
     child-driven in round 3, nothing is being demonstrated, and the hand points at the very object the
     child is meant to find. Gating each call site is what produced three rounds of "fixed" that were
     not; the rule has to sit at the single choke point instead.
     Default is TUTORIAL ONLY — so every existing raw call site (demo chains, progress cues, count
     nudges) becomes correct by construction, and any future mechanic inherits the rule for free.
     `earned` is the one opt-in: handOnAnswer passes it for terminal help, which Yasir does allow in
     guided because two failed attempts paid for it. Round 3 gets no hand by ANY route. */
  const _ph = (CARD.slides[state.idx] || {}).phase;
  if(!(earned ? HAND_PHASES : IDLE_HAND_PHASES).has(_ph)) return;
  const nh = $("nudgeHand");
  /* Placement is computed TWICE: now, and once more on the next frame. Measuring text rects only helps
     if the text has stopped moving, and a teach slide places the hand while its card is still animating
     in — GENDER_INTRO T3 measured 0% coverage on the first sample and 17% on the next, as .cat-word
     settled underneath an already-positioned hand. One rAF re-place costs nothing and makes the
     measurement match what the child actually sees. */
  requestAnimationFrame(()=>{ if(nh.classList.contains("show")) _placeNudge(el, nh); });
  _placeNudge(el, nh);
  nh.classList.add("show","hint-glow");
}
function _placeNudge(el, nh){
  if(!el || !el.getBoundingClientRect) return;
  const r = el.getBoundingClientRect();
  const sw = document.querySelector(".slide-stage").getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  /* [S01r4x] THE FINGERTIP GOES ON THE TARGET.
     It used to sit BELOW the tile: [28h] moved it there because the hand covered the word, and [28j]
     then measured text rects to push it below the label too. Both fixed a real defect, but the cure
     left the hand pointing at the GAP under the tile — on pages 7/10/12 it hovered underneath with
     its finger touching nothing, which is the report.
     The hand's own geometry is why below-the-tile was tempting: the fingertip sits near the TOP of
     the 96px box (measured by rasterising the art at 8x: 39.93, 6.38) and the palm hangs DOWN-RIGHT
     from it, so centring the box on a tile buries the tile under the palm.
     So anchor the FINGERTIP, not the box, and anchor it to the tile's RIGHT side: the finger lands
     inside the tile near its right edge and the palm swings off to the right and below, where there
     is nothing to cover. The label is centred at the bottom, so it stays readable — the thing [28h]
     was protecting — while the finger is unambiguously ON the thing to tap. */
  const FX = 39.93, FY = 6.38;                 // fingertip inside the 96x96 hand box
  const HAND = 96, stageH = sw.height/scale, stageW = sw.width/scale;
  const L = (r.left - sw.left)/scale, T = (r.top - sw.top)/scale;
  const W = r.width/scale, Hh = r.height/scale;
  /* [S01r5m] BELOW THE CARD, when the card asks for it. The default above puts the fingertip ON
     the tile, which is right for a bare letter but not for these picture cards: the SME asked for
     the hand "just below the text of the card (below the पपीता word) so that it does not cover
     anything". Opted in per element with data-nudge-below, so the default placement is untouched
     everywhere else. Centred horizontally and dropped just under the card, so it covers neither the
     picture nor the word and still unmistakably points at that card. */
  if(el.dataset && el.dataset.nudgeBelow === "1"){
    let bl = (L + W / 2) - FX, bt = (T + Hh + 10) - FY;
    bl = Math.max(0, Math.min(bl, stageW - HAND));
    bt = Math.max(0, Math.min(bt, stageH - HAND));
    nh.style.left = bl.toFixed(1) + "px";
    nh.style.top  = bt.toFixed(1) + "px";
    return;
  }
  let tipX = L + W * 0.78;
  let tipY = T + Hh * 0.52;                    // above centre: the picture, not the word
  /* on a wide target the 78% point can still sit far from the right edge; keep the finger within
     34px of it so the palm always clears the tile, however wide it is */
  tipX = Math.min(Math.max(tipX, L + W - 34), L + W - 6);
  let left = tipX - FX, top = tipY - FY;
  /* never off-stage — an off-stage hand points at nothing at all, which is strictly worse than one
     nudged a few px off the ideal spot */
  left = Math.max(0, Math.min(left, stageW - HAND));
  top  = Math.max(0, Math.min(top,  stageH - HAND));
  nh.style.left = left + "px";
  nh.style.top = top + "px";
}

/* ---------- 6. IDLE VO REPLAY [27b] ----------
   Yasir 2026-07-27: "in guided and practice, when no interaction, make the vo play again at exactly
   after 7 seconds of no interaction." A child who stalls hears the question again instead of sitting
   in silence. Distinct from the hand-nudge above (that POINTS, this SPEAKS) and from the manual
   replay chip — same guards as the chip, but fired by inactivity rather than a tap.

   SCOPE = EVERY test phase (27d, Yasir 2026-07-27: the 7s replay "needs to be all uniform and done
   and perfected" for the 50-game batch). Was guided+practice only, which silently skipped
   `independent` and `mastery` — Antim's I1/I2 + M1-M3 had no idle replay while its G/P slides did.
   Inconsistency across a 50-game fleet is worse than either behaviour, so all four test phases now
   behave identically. `tutorial` stays excluded on purpose: teaching slides either self-play
   (data.auto) or gate on the child tapping through, so an idle timer there would talk over the
   lesson. CELEBRATION is excluded by type: it expects no interaction and self-narrates.

   FIRES EXACTLY ONCE PER SLIDE (27f, Yasir 2026-07-27: "it only needs to be repeated once ... once
   the audio is played after 7 second, no need to be replayed after that"). The first cut re-armed
   after every fire, so a child — or an unattended tab — heard the prompt again every 7s forever;
   he caught it as sound coming from a test tab I had left open. One reminder, then silence.
   A correct answer (state.locked) holds it, and the slide teardown clears it, so a timer can never
   leak across slides. 7000ms is the default, overridable per card via
   scaffold_rules.idle_vo_replay_ms. */
const IDLE_VO_PHASES = new Set(["guided", "independent", "practice", "mastery"]);
// 100ms tick so the fire lands within 0.1s of the target (a 500ms tick measured 7.1-8.0s in-browser,
// and he asked for EXACTLY 7s). Cost is 10 boolean checks/sec on test slides only.
const IDLE_VO_TICK = 100;
let _idleVoTimer = null, _idleSince = 0, _idleVoFired = false;
function stopIdleVo(){ clearInterval(_idleVoTimer); _idleVoTimer = null; _idleSince = 0; }
/* Called by mountSlide so the ONE allowed reminder is per SLIDE, not per lesson. Kept separate from
   stopIdleVo() on purpose: stopIdleVo is also called for transient reasons (wrong phase, teardown)
   and must NOT hand a slide a second reminder. */
function resetIdleVo(){ stopIdleVo(); _idleVoFired = false; }
/* The 7s is 7s of SILENCE AND no touching — the clock only runs while the game is quiet, so the
   replay lands 7s after the prompt stops, never on top of it. (First cut used a plain 7s setTimeout
   that re-armed a FULL 7s whenever it found audio playing, which stretched the real delay to as much
   as 14s — measured in-browser, it never fired. A ticker that resets the silence clock is exact.) */
function armIdleVo(){
  if(_idleVoFired){ stopIdleVo(); return; }      // [27f] one reminder per slide — already spent
  _idleSince = 0;                                // any (re)arm restarts the silence clock
  const slide = CARD.slides[state.idx];
  if(!slide || slide.type === "CELEBRATION" || !IDLE_VO_PHASES.has(slide.phase)){ stopIdleVo(); return; }
  if(_idleVoTimer) return;                       // ticker already running for this slide
  const ms = (CARD.scaffold_rules && CARD.scaffold_rules.idle_vo_replay_ms) || 7000;
  _idleVoTimer = setInterval(()=>{
    const s = CARD.slides[state.idx];
    if(!s || s.type === "CELEBRATION" || !IDLE_VO_PHASES.has(s.phase)){ stopIdleVo(); return; }
    // HOLD (not stop) on every transient busy flag. state.locked MUST be a hold: besides "answered
    // correctly" it is also set TRANSIENTLY while reveal_seq narrates the options one by one (see the
    // _enableAll() that clears it). Treating it as terminal killed the ticker 0.6s into every guided
    // slide — measured in-browser, which is the only way this was visible. Slide teardown is what
    // really ends the watch, and after a correct answer the hold simply means nothing more is spoken.
    if(state.locked || state.hintActive || isPlaying || state.revealing || state.demoRunning){ _idleSince = 0; return; }
    if(!_idleSince){ _idleSince = Date.now(); return; }
    if(Date.now() - _idleSince < ms) return;
    // [27f] ONE reminder, then done for this slide. Mark spent and stop the ticker BEFORE speaking,
    // so a pointerdown arriving during the replay cannot re-arm it.
    _idleVoFired = true;
    stopIdleVo();
    SwiftPAL.emit("idle_vo_replay", { slide_id: s.id, phase: s.phase });
    if(state.replayAudio) state.replayAudio(); else autoPlayChain(s);
  }, IDLE_VO_TICK);
}
// ONE document-level listener for the whole session (a per-slide listener would pile up across the
// drag slides — the same trap the drag mechanics warn about). armIdleVo() itself re-checks phase, so
// a pointerdown on a tutorial slide is a cheap no-op.
document.addEventListener("pointerdown", ()=>{ armIdleVo(); }, true);

/* ---------- 7. HINT / FEEDBACK BOX ----------
   No button: the popup plays its VO, then auto-dismisses. onEnd runs after it
   closes (callers add a short pause there so the revealed answer shows). */
function showBox(emoji, text, theme, audioSrc, onEnd){
  { const hb=document.getElementById("hintBtn"); if(hb) hb.classList.remove("hint-glow"); }
  // CORRECT: no popup (lead review) — confetti cannons from both sides + Swiftie cheer, then onEnd.
  if(theme === "correct"){
    sfxCorrect(); confettiCannon(); setSwMood("celebrate");
    play(audioSrc || null, ()=> setTimeout(()=>{ if(onEnd) onEnd(); }, 300));
    return;
  }
  state.hintActive = true;
  // wrong/hint/reveal keep a light card (mechanics use it for a short cue); Swiftie reacts too.
  // one-Swiftie rule: the popup shows the reacting Swiftie (animated), so HIDE the header buddy
  // while it's open — never two Swifties on screen at once (MoM flag).
  const swMap = { wrong:"sw_lg_hint_anim", hint:"sw_lg_hint_anim", reveal:"sw_lg_hint_anim" };  // [20a mascot-11] overlay mascot: retired non-existent sw_anim_*.gif → production's shipped sw_lg_hint_anim.webp
  const sw = $("hintMascot");
  if(sw){ sw.style.display=""; sw.src = "assets/UI/" + (swMap[theme] || "sw_lg_hint_anim") + ".webp"; }
  const buddy = $("swBuddy"); if(buddy) buddy.style.visibility = "hidden";
  setSwMood(theme === "wrong" ? "tryagain" : "hint");
  $("hintBox").classList.remove("celebrate");
  sfxWrongSoft();
  const ht = $("hintText"); ht.textContent = text; ht.className = "hint-text " + theme;
  $("stage").classList.add("blurred");
  $("hintOverlay").classList.add("show","hint-glow");
  $("hintBtn").disabled = true;
  const hi = $("hintImg"); if(hi) hi.src = "assets/UI/hint_active.png";
  const close = ()=>{
    $("hintOverlay").classList.remove("show");
    $("stage").classList.remove("blurred");
    if(buddy) buddy.style.visibility = "";   // header Swiftie returns when the popup closes
    state.hintActive = false;
    if(hi) hi.src = "assets/UI/hint.png";
    if(!state.locked) $("hintBtn").disabled = false;
    if(onEnd) onEnd();
  };
  // auto-dismiss after the VO finishes (small buffer so it never just flashes); freeze the popup
  // Swiftie's mouth to the still frame the instant its line ends
  play(audioSrc, ()=>{ if(sw) sw.src = "assets/UI/sw_head_talking.webp"; setTimeout(close, 300); });
}

/* ---------- 8. TAP-OPTION HELPER (shared by 5 slide types) ---------- */
function mountTapOptions({slide, host, signalName, stimulus, options, isCorrect, optionRenderer, columnsHint, mastery, hintAction, nudgeTarget, shuffle, nudgeBelow}){
  state.attempts = 0; state.selectedKey = null; state.locked = false;
  state.audioReplays = 0; state.hintUsed = false; state.nudgeUsed = false; state.scaffoldLevel = 0; state.helpShown = false;
  // idle hand-nudge target: defaults to the stimulus (re-listen), but a slide can pass
  // nudgeTarget:null to suppress it entirely (e.g. "how many?" — nothing to re-tap).
  const _nudge = (nudgeTarget !== undefined) ? nudgeTarget : (stimulus || null);
  // optional custom hint (runs on the live slide instead of a text popup), e.g. a
  // count-demonstration. Wrapped to block option taps while it plays.
  const runHint = hintAction ? (after)=>{ state.hintActive = true; hintAction(()=>{ state.hintActive = false; if(after) after(); }); } : null;

  // Shuffle options once so the correct answer isn't pinned to one position (engine-wide anti
  // positional-bias — otherwise "always tap the same spot" can pass mastery). Opt out with
  // shuffle:false for inherently-ordered options (e.g. a number line).
  const _opts = (shuffle === false) ? options.slice()
    : (function(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a; })(options);

  const wrap = document.createElement("div"); wrap.className = "q-row";
  if(stimulus){ wrap.appendChild(stimulus); }
  const grid = document.createElement("div");
  const cols = columnsHint || (_opts.length <= 2 ? 2 : _opts.length <= 3 ? 3 : 4);
  grid.className = "opt-grid cols-" + cols;
  // [24a A2] TAP GATE (fork-proven, gender #53+#56): one tap at a time — the tapped word must END
  // before the next tap counts (_busy, 4s _vb fail-safe so a superseded onEnd can't soft-lock), AND
  // taps are ignored while ANY VO sounds (prompt / feedback / idle-replay) — silent-VO spam-tap fix.
  let _busy = false;
  /* [28t] A TAP DURING FEEDBACK AUDIO MUST COUNT, NOT VANISH. The gate below ignores taps while ANY VO
     sounds — added in 24a to stop spam-tapping during the PROMPT, which is right. But the hint clip after
     a wrong answer is also "VO sounds", so a child who taps again while hint1 is still speaking had that
     attempt SILENTLY DISCARDED: they tapped twice, the engine counted once, and terminal help never
     arrived. That defeats the whole 2-attempt ladder through a side door.
     `_fb` marks feedback audio specifically. During it a tap is accepted and interrupts the clip (one
     voice at a time is preserved by stopAudio); during the prompt, taps are still ignored. */
  let _fb = false;
  _opts.forEach((opt, i) => {
    const cell = optionRenderer(opt, i);
    cell.classList.add("opt-cell");
    if(nudgeBelow) cell.dataset.nudgeBelow = "1";   /* [S01r5m] hand under the letter, not on it */
    cell.dataset.key = String(i);
    cell.onclick = ()=>{
      if(state.locked || state.hintActive || _busy || (isPlaying && !_fb) || cell.classList.contains("crossed") || cell.classList.contains("correct") || cell.classList.contains("faded")) return;   /* [25d] .faded = an option disabled by terminal help; refuse it in JS too */
      stopNudge();
      if(_fb){ stopAudio(); _fb = false; }   /* [28t] a retry interrupts the hint — never two voices */
      // SME rule: SPEAK THE TAPPED WORD on EVERY tap (right or wrong), then the feedback — never two
      // voices at once (buzz/confetti are sfx, they ride alongside the word). opt.audio = word clip id.
      // Fallback wiring for LETTER options (SME: the tapped item's own sound speaks EVERYWHERE): options
      // authored as {letter:"आ"} carry no audio id, but the slide's data.phonemes map has each letter's
      // clip — derive it here centrally so every TAP_LETTER_* / mastery module inherits speak-on-tap
      // without per-module or per-card changes. Explicit opt.audio always wins.
      const _aid = opt.audio ||
                   (opt.letter && slide.data && slide.data.phonemes && slide.data.phonemes[opt.letter]) || null;
      const _word = _aid ? ("assets/Audio/" + _aid + "." + AUDIO_EXT) : null;
      // [24a A2] _busy covers the word-speak beat; the 4s _vb fail-safe clears the gate even if the
      // word's onEnd is superseded (e.g. the volume chip tapped mid-word) — gender #53 soft-lock fix.
      _busy = true;
      const _vb = setTimeout(()=>{ _busy = false; }, 4000);
      /* [32a] SPEAKING HIGHLIGHT — Bindu Gupta (HIKGH01_L02_S02 deck, page 10): "हर एक tab पर
         आवाज़ आनी चाहिए, जिस tab को बोल रहा है उसकी light change हो जाए" (every tab should sound,
         and the one currently talking should visibly change). `.opt-speaking` is on ONLY for the
         word-speak beat below and is removed before `cb()` runs, so it can never linger under or
         fight `.correct` / `.wrong-flash` / `.crossed`. */
      const _afterWord = (cb)=>{ const done = ()=>{ clearTimeout(_vb); _busy = false; cell.classList.remove("opt-speaking"); cb(); };
        if(_word){ cell.classList.add("opt-speaking"); play(_word, done); } else done(); };
      if(isCorrect(opt, i)){
        state.locked = true; cell.classList.add("correct"); ckCorrect(cell); sfxCorrect(); confettiCannon(); setSwMood("happy");
        if(mastery){ state.masteryAttempts++; if(state.attempts === 0) state.masteryHits++; }
        SwiftPAL.emit(signalName, { slide_id: slide.id, phase: slide.phase, value: true,
          first_try: state.attempts === 0, attempts: state.attempts + 1,
          scaffold_level: state.scaffoldLevel, latency_ms: Date.now()-state.slideStart });
        /* [27j] SPEAK audio.correct AFTER the tapped word. It was never read here: the correct branch
           only spoke the option's own word and went straight to completeSlide, so an SME's
           per-question correct feedback ("शाबाश! रवि ने सुबह दूध पिया।") was silent on every
           STORY_QUESTION — 12 slides across 2 games. It cannot be folded into the option's own audio
           because those slides use data.reveal_seq. TAP_IN_SCENE already played this id, which is why
           the ids are authored and valid, just unread. A card with no `correct` id behaves exactly as
           before (play(null) is a silent beat), so this is additive. */
        _afterWord(()=> play(audioFor(slide, "correct") || null,
                            ()=> setTimeout(()=> completeSlide(true), 700)));
      } else {
        state.attempts++; sfxWrongSoft(); setSwMood("tryagain");
        /* [28p] 1st WRONG = A RED FLASH ON A STILL-LIVE CARD. 2nd = GREY AND DISABLED.
           Yasir 2026-07-28: "1st wrong must flash a RED GLOW on a still-live card; disabling/greying
           belongs ONLY at 2 wrong attempts. Today it is the opposite." He is right, and it was my own
           28e over-correction: 28e ruled that a DISABLED option is never red, but implemented it on
           `.crossed`, which is the class used for BOTH states — so it also bleached the momentary
           first-wrong feedback and left a ~700ms grey disable with no red anywhere.
           Two classes now, one per meaning: `.wrong-flash` is the transient red buzz and keeps the card
           TAPPABLE (nothing is being taken away on a first miss), `.crossed` stays the grey permanent
           lock from the 2nd attempt. 28e's ruling is preserved exactly — red never rests on a disabled
           card — while red returns to the one place it belongs. */
        /* [28r] BOTH wrong attempts flash RED FIRST. Yasir 2026-07-28: "on second wrong attempt as
           well we are supposed to give the red glow first and then disable." The red IS the "that is
           not it" feedback, so it belongs on every wrong tap; the grey lock is an EXTRA consequence
           that only the 2nd earns. 28p gave the 2nd wrong the grey lock with no red at all, so the
           child lost the feedback exactly when they most needed it. Sequence now: red buzz -> (2nd
           only) settle to the grey disabled state. */
        cell.classList.add("wrong-flash");
        wgWrong(cell);   // [S01r4s] the kit's outward spark ring; the red flash + shake above are this engine's own
        // [27a] RETRYABLE WRONG TAP (Yasir ruling 2026-07-27 — resolves the blocked behavioural
        // ruling (a) in _ENGINE_GAPS_CONFIRMED_2026-07-27.md, and matches the blessed strilling
        // fork): a wrong card must NOT lock on the first miss. It buzzes red, then UNBLOCKS so the
        // child can try that same card again — "they should only be blocked after 2nd wrong
        // attempt ... just disable the button after 2nd wrong attempt". From attempt 2 onward the
        // .crossed lock stays, so a single card cannot burn every attempt. Ships with the CSS half
        // (the ✕ ::after is gone from .opt-cell.crossed) — without it the giant ✕ would flash and
        // vanish, which the gaps doc flags as worse than either end state.
        /* [28d] THE UNBLOCK MUST NOT DEPEND ON state.locked. Yasir calls the stuck red ring "a
           constantly repeated issue", and this guard is why: state.locked is NOT only "answered
           correctly" — it is also set TRANSIENTLY while reveal_seq narrates the options (see the
           _enableAll() that clears it). If the 700ms landed inside that window the removal was
           SKIPPED, so .crossed stayed forever: a permanent red ring on a permanently dead card.
           I found that same state.locked trap later while fixing the idle-VO ticker and wrote it
           down there, but never propagated it back here — and I had SEEN the red persist in testing
           and wrongly explained it away as a frozen-timeline artifact.
           Now it keys off THIS cell only: it is still crossed, was never answered correctly, and
           terminal help has not taken over. Nothing shared, nothing transient. */
        setTimeout(()=>{
          if(cell.classList.contains("correct")) return;   // this cell ended up being the answer
          /* [28s] NO state.helpShown EARLY-RETURN HERE. That guard exists to stop the old code UNBLOCKING
             a card once terminal help owns the board — but this timer no longer unblocks, it swaps the RED
             FLASH for the GREY LOCK. At the 2nd wrong, terminal help fires in the same beat, so helpShown
             was already true and the swap was skipped: the card stayed RED FOREVER. That is the exact
             stuck-red-ring failure I fixed in 28d and reintroduced in a new form 700ms later. Removing the
             flash and applying the lock is correct whether or not terminal help is up — a wrong card should
             read the same as the distractors terminal help fades. */
          cell.classList.remove("wrong-flash");
          if(state.attempts >= 2) cell.classList.add("crossed");
        }, 700);
        // (do NOT count masteryAttempts here — the correct branch counts one attempt PER ITEM.)
        SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
        // LAYERED SCAFFOLD (A1): L1 re-listen → L2 hint → L3 REVEAL at max_attempts (never stuck).
        const _maxA = (CARD.scaffold_rules && CARD.scaffold_rules.max_attempts) || 3;
        $("hintBtn").classList.add("show","hint-glow");
        _afterWord(()=>{   // speak the tapped word FIRST, then the layered feedback VO (no overlap)
          _fb = true;                        /* [28t] from here the audio is FEEDBACK — a retry may interrupt it */
          if(state.attempts >= _maxA){ revealAnswer("wrong"); _fb = false; }
          else if(state.attempts >= 2){ state.scaffoldLevel = Math.max(state.scaffoldLevel, 2);
            if(runHint) runHint(); else play(midHint(slide), ()=>{ _fb = false; }); }   /* [28k] rung 2 */
          // [24a A2] 1st wrong: the slide's OWN hint1 clip when authored ("यह … नहीं है…"), else the
          // generic try_again — additive, cards without hint1 are byte-for-byte unchanged.
          else { state.scaffoldLevel = Math.max(state.scaffoldLevel, 1); play(audioFor(slide, "hint1") || audioFor(slide, "try_again") || null, ()=>{ _fb = false; }); }
        });
      }
    };
    grid.appendChild(cell);
  });
  wrap.appendChild(grid);
  host.appendChild(wrap);

  // ---- layered-hint helpers (A1/B2): reveal-on-max + a wired manual hint button ----
  function _correctCell(){ return [...grid.querySelectorAll(".opt-cell")].find(c => isCorrect(_opts[+c.dataset.key], +c.dataset.key)); }
  /* [25d] TERMINAL HELP — never hand the child the answer (Yasir 2026-07-27: "we are not supposed to
     give the correct answer by ourself anywhere at all, it is always the student who has to finalize
     it"). This used to lock the slide, mark the correct cell .correct, and auto-advance after 800ms —
     i.e. the game solved it for them. Now: the wrong options are hard-disabled, the correct one keeps
     an infinite glow and STAYS TAPPABLE, and nothing advances until the child taps it. Same contract
     as the drag mechanics' terminalHelp(). `state.locked` is deliberately NOT set, or the correct cell
     could not be tapped; `state.helpShown` marks the rung for telemetry + prevents re-entry. */
  function revealAnswer(reason){
    if(state.helpShown || state.locked) return;
    state.helpShown = true; state.scaffoldLevel = 3; setSwMood("hint");
    const el = _correctCell();
    [...grid.querySelectorAll(".opt-cell")].forEach(c => {
      if(c !== el){
        c.classList.add("faded");
        c.style.setProperty("pointer-events","none","important");   // CSS alone is defeatable
        c.style.setProperty("opacity",".35","important");
      }
    });
    if(el){
      el.classList.remove("pop-in");
      /* [S01r5m] NO GLOW ON THE ANSWER. `.reveal-hold` runs `revealPulse`, which animates a GREEN
         box-shadow - the same green the card gets when the CHILD picks it correctly. On the hint
         rung that paints the answer as though it had been answered, and the SME asked for the pulse
         and the green glow to come off. What identifies the answer is now only what terminal help
         already did: the other options fade, and the hand points. Green stays reserved for a real
         correct tap. */
      // [27d] The hand lands on the glowing answer in EVERY phase (Yasir 2026-07-27: "hand nudge in
      // guided ... needs to be all uniform and done and perfected"). 27b gated this to tutorial on
      // his earlier wording; that made guided/practice/independent/mastery reveal the answer with a
      // glow but no hand, which is exactly the inconsistency the 50-game batch must not ship.
      // Safe in every phase because we only reach here via terminal help — the glow has ALREADY
      // revealed the answer, so the hand gives nothing away; it just makes "tap THIS one"
      // unmissable for a 5-year-old. The child still has to tap it (terminal help never
      // auto-completes), and the cell's own onclick calls stopNudge(), so the hand clears on tap.
      // stopNudge() FIRST kills any flow-nudge timer already in flight, so it cannot fire a moment
      // later and drag the hand off the answer (see the [27e] guard in startNudge).
      stopNudge();
      handOnAnswer(el, slide);
    }
    SwiftPAL.emit("answer_revealed", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts, reason });
    /* [S01r5m] THE HELP IS THE SLIDE'S OWN HINT WHEN IT HAS ONE. This spoke the reveal clip, and
       on the two question pages `max_attempts` is 2 — so the SECOND wrong tap lands here, not on
       the rung below, and what the child got was "ध्यान से देखो, सही जवाब च है।" That is the VO the
       SME asked to replace with the sentence played again and the letter lit. hintAction is exactly
       that, already written for the rung below, so terminal help now runs it instead of naming the
       answer aloud. Slides without one keep the clip ladder they always had. */
    if(runHint) runHint();
    else play(audioFor(slide, "hint") || audioFor(slide, "reveal") || audioFor(slide, "correct") || audioFor(slide, "try_again") || null, ()=>{});
  }
  $("hintBtn").onclick = ()=>{ if(state.locked || state.hintActive) return;
    state.hintUsed = true; if(state.attempts < 1) state.attempts = 1;
    SwiftPAL.emit("hint_shown", { slide_id: slide.id, manual: true });
    if(runHint) runHint(); else play(audioFor(slide, "hint") || audioFor(slide, "try_again") || null, ()=>{}); };

  // Tap-to-answer standard: a WRONG tap = soft buzz + red ring, and the card UNBLOCKS after 700ms so
  // the child may retry it; from the 2nd wrong attempt the card stays disabled. NO red ✕ anywhere.
  // (Supersedes the earlier lead-review standard "soft buzz + ✕ + that card LOCKS" — reversed by
  // Yasir's ruling 2026-07-27, which also matches the blessed strilling fork. See [27a] above.)
  // a RIGHT tap = confetti cannons + Swiftie cheer, then auto-advance. No select-then-आगे for pick questions.
  $("navBtn").style.display = "none"; setNavActive(false);
  // [27c] AUTONOMOUS TEACHING (data.auto) — a TEACHING slide must run with ZERO child interaction
  // (Yasir 2026-07-27: "in teaching we need to have 0 student interaction ... the tapping part to be
  // done by student is also to be done by us itself"). Same contract as the INTRO / GENDER_INTRO /
  // MEET_WORD demos: we own the audio, every option tap is dead, and the chain answers the question
  // ITSELF — point at the picture and say the prompt → point at the right choice and say the teaching
  // line → mark it correct as its letter sounds → आगे unlocks. No confetti and no sfx: those are the
  // child's reward for answering, and nobody answered. Opt-in, so every non-auto slide is unchanged.
  if(slide.data && slide.data.auto){
    state.locked = true;              // option taps are no-ops for the life of the slide
    state.ownsAudio = true;           // suppress mountSlide's autoPlayChain — the chain plays the prompt
    state.demoRunning = true;         // [24a N8] a replay-chip tap must not gen-kill our own chain
    setSwMood("teach");
    $("navBtn").style.display = ""; setNavActive(false);   // आगे is the only control, and only once taught
    $("navBtn").onclick = ()=> completeSlide(true);
    const _correct = _correctCell();
    const _cOpt = _correct ? _opts[+_correct.dataset.key] : null;
    const _cAid = _cOpt && (_cOpt.audio ||
      (_cOpt.letter && slide.data.phonemes && slide.data.phonemes[_cOpt.letter]) || null);
    // NOTE the stimulus deliberately gets NO hand: pointNudgeAt() plants the fingertip 56px above
    // an element's bottom edge, which on a .stimulus-pic is exactly where its .lbl sits — the hand
    // covered the very word being taught ("घर") for the whole prompt beat. The hand's job here is to
    // carry the eye to the ANSWER, and there is nothing to tap on the picture anyway.
    const steps = [
      [null, audioFor(slide, "prompt")],
      [_correct || null, audioFor(slide, "instruction")],
      [_correct || null, _cAid ? "assets/Audio/" + _cAid + "." + AUDIO_EXT : null]
    ];
    // reveal = the same shape SENTENCE_SOUND's demo already uses: the answer goes green + pulses,
    // the other choices fade back, so a 5-year-old cannot mistake which one is being taught.
    const _reveal = ()=>{ if(!_correct) return;
      _correct.classList.add("correct", "reveal-pulse");
      [...grid.querySelectorAll(".opt-cell")].forEach(c => { if(c !== _correct) c.classList.add("faded"); }); };
    let si = 0, _demoDone = false;
    const finish = ()=>{ if(_demoDone) return; _demoDone = true;
      stopNudge(); state.demoRunning = false;
      _reveal();                                          // idempotent — the last step usually ran it
      setNavActive(true); };
    const step = ()=>{
      if(CARD.slides[state.idx] !== slide) return;        // navigated away → drop the chain
      if(si >= steps.length){ finish(); return; }
      const el = steps[si][0], src = steps[si][1]; si++;
      if(si === steps.length) _reveal();                  // answer lands WITH its sound
      if(el) pointNudgeAt(el);
      play(src || null, ()=> setTimeout(step, 500));
    };
    state.replayAudio = ()=> playChain(steps.map(s => s[1]).filter(Boolean), 0, ()=>{});
    setTimeout(step, 400);
    setTimeout(()=>{ if(CARD.slides[state.idx] === slide) finish(); }, steps.length * 5000 + 3000);   // FAIL-SAFE: never a dead आगे
    return;
  }
  // 16j: OPT-IN staggered option reveal + narrate-each-on-entry (SME wave "options एक-एक करके + सारे
  // बोलना"). Gate on slide.data.reveal_seq — ABSENT ⇒ default behaviour (all options at once), so every
  // existing/non-opted slide is byte-for-byte unchanged. When on: hide the cells, fade them in one by
  // one speaking each option's own clip (opt.audio, or the letter's phoneme), THEN enable taps + nudge.
  if(slide.data && slide.data.reveal_seq){
    // Options reveal one-by-one and each is spoken — but STRICTLY SEQUENCED so no VO ever overlaps
    // another: the prompt plays to COMPLETION, THEN each option word plays only after the previous
    // one ends (fixes "option words spoken before the prompt line finishes"). Every step carries a
    // hard fallback timer, plus a global force-enable, so a missing/blocked/late clip can never
    // soft-lock the game (the failure the old fixed-cadence version was guarding against).
    const _cells = [...grid.querySelectorAll(".opt-cell")];
    _cells.forEach(c => c.classList.add("opt-seq-hidden"));         // class controls hide (opacity+pointer) — reveal = remove class → natural state
    state.locked = true; state.ownsAudio = true;   // we narrate the prompt + options ourselves
    state.revealing = true;   // [24a N8] replay chip ignores taps mid-reveal (no stomping the reveal narration)
    let _done = false;
    const _enableAll = ()=>{ if(_done) return; _done = true; state.locked = false;
      state.revealing = false; state.ownsAudio = false;   // [24a N8] reveal over → the chip may replay the chain again
      _cells.forEach(c => c.classList.remove("opt-seq-hidden")); };   /* [28f] no idle hand */
    // play `src`, then run `next` when it ENDS; a per-clip fallback guarantees the chain always advances
    const _sayThen = (src, next)=>{
      if(_done || CARD.slides[state.idx] !== slide) return;         // [24a bug-hunt F1] _done → the 16s net already force-enabled; STOP the chain so its next play() can't gen-kill a correct tap's advance callback (soft-lock)
      let advanced = false, fb = null;
      const go = ()=>{ if(advanced || _done) return; advanced = true; if(fb) clearTimeout(fb); next(); };
      play(src || null, go);
      fb = setTimeout(go, _clipNetMs(src));                                    // safety net: never stall on one clip
    };
    const _revStep = (i)=>{
      if(_done || CARD.slides[state.idx] !== slide) return;         // [24a bug-hunt F1] navigated away OR net fired → abort the chain
      if(i >= _cells.length){ _enableAll(); return; }
      const c = _cells[i]; c.classList.remove("opt-seq-hidden");
      const opt = _opts[+c.dataset.key];
      const aid = (opt && opt.audio) || (opt && opt.letter && slide.data.phonemes && slide.data.phonemes[opt.letter]) || null;
      _sayThen(aid ? "assets/Audio/" + aid + "." + AUDIO_EXT : null, ()=> setTimeout(()=> _revStep(i + 1), 180));
    };
    /* [S01r4p] SPEAK THE STIMULUS BETWEEN THE PROMPT AND THE OPTIONS, when the slide asks for it.
       The chain was prompt -> options. On a SENTENCE_SOUND question that leaves the SENTENCE itself
       unspoken: it was only ever reachable through the «फिर सुनो» pill, so a page that hides the pill
       (hide_replay) would ask "which sound repeats?" about a line the child never heard. The deck's
       flow for this page is explicit — "instruction text + VO -> sentence VO -> 'च' appears with
       sound -> ...". Gated on data.seq_say_whole, so every other reveal_seq slide is unchanged; the
       chips are marked .said as it plays, the same thing the replay pill did. */
    const _wholeSrc = (slide.data.seq_say_whole && slide.data.whole_audio)
      ? "assets/Audio/" + slide.data.whole_audio + "." + AUDIO_EXT : null;
    const _optsFirst = ()=> _revStep(0);
    _sayThen(audioFor(slide, "prompt") || null, ()=>{
      if(!_wholeSrc) return _optsFirst();
      host.querySelectorAll(".sentence-word").forEach(c => c.classList.add("said"));
      _sayThen(_wholeSrc, _optsFirst);
    });
    // global safety net — never soft-lock. One more clip in the chain needs a longer net.
    setTimeout(()=>{ if(CARD.slides[state.idx] === slide) _enableAll(); },
      _chainNetMs([(slide.audio && slide.audio.prompt) || null]
        .concat(_wholeSrc ? [slide.data.whole_audio] : [])
        .concat(_opts.map(o => (o && o.audio) || null)), _wholeSrc ? 22000 : 16000));
    return;
  }
  /* [28f] idle hand REMOVED on answerable slides — it fired at nudge_timeout_ms (guided 5000ms),
     i.e. right after the prompt VO, pointing at the stimulus before the child had tried anything.
     A visual hint is earned only by 2 failed attempts. Demo/progress nudges in the count and drag
     mechanics are untouched — those are teaching animations, not hints. */
}

/* ---------- 10. RENDER HELPERS ---------- */
/* Render a picture as the real PNG (assets/Images/<key>.png); if the file is
   missing it falls back to the emoji. Pass the image id (e.g. "pic_anaar"). */
/* [20a SORT-01] opt-in one-by-one tray reveal for SORT_GENDER/SORT_SHAPE (SME g3 pg12/17, asked 4x).
   Gated by slide.data.reveal_seq: hides the draggable tiles, fades them in one at a time speaking each
   item's own clip (tile.dataset.audio), then a SAFETY NET force-shows all so a missing/late clip can
   never soft-lock (mirrors the mountTapOptions reveal_seq). Sort games without reveal_seq are untouched. */
function sortSeqReveal(tray, slide){
  const tiles = [...tray.children];
  tiles.forEach(t => t.classList.add("sort-seq-hidden"));
  state.revealing = true;   // [24a N8] drag + replay chip both blocked while the tray is still revealing
  // [24a bug-hunt F2] narrate prompt→tiles OURSELVES (ownsAudio) so mountSlide's autoPlayChain does NOT
  // fire the prompt concurrently. The old fixed-cadence version let the prompt get CUT at 500ms and
  // TRUNCATED each tile clip at the 760ms tick (live in HI01H04_L03_S04 P1/M2). Now the prompt chain
  // plays to COMPLETION, THEN each tile reveals only after the previous tile's clip ENDS — mirroring the
  // mountTapOptions reveal_seq audio sequencing (not just its safety net).
  state.ownsAudio = true;
  state.replayAudio = ()=> autoPlayChain(slide);
  let i = 0, done = false;
  const enableAll = ()=>{ if(done) return; done = true; state.revealing = false; state.ownsAudio = false;
    tiles.forEach(t => t.classList.remove("sort-seq-hidden")); };
  // play `src`, run `next` when it ENDS; per-clip fallback so a missing/slow clip never stalls the chain
  const sayThen = (src, next)=>{
    if(done || CARD.slides[state.idx] !== slide) return;
    let advanced = false, fb = null;
    const go = ()=>{ if(advanced || done) return; advanced = true; if(fb) clearTimeout(fb); next(); };
    play(src || null, go); fb = setTimeout(go, _clipNetMs(src));
  };
  const step = ()=>{
    if(done || CARD.slides[state.idx] !== slide) return;         // navigated away / net fired -> abort
    if(i >= tiles.length){ enableAll(); return; }
    const t = tiles[i]; t.classList.remove("sort-seq-hidden"); i++;
    sayThen(t.dataset.audio ? "assets/Audio/" + t.dataset.audio + "." + AUDIO_EXT : null, ()=> setTimeout(step, 180));
  };
  autoPlayChain(slide, ()=> setTimeout(step, 250));               // prompt chain FULLY, then tiles one at a time
  setTimeout(()=>{ if(CARD.slides[state.idx] === slide) enableAll(); }, 16000);   // global safety net — never soft-lock
}
function imgOrEmoji(imgKey, emoji, imgClass, emojiClass){
  if(imgKey){
    const fb = String(emoji||"❓").replace(/'/g,"");
    return `<img class="${imgClass}" src="assets/Images/${imgKey}.${IMG_EXT}" alt="" `+
      `onerror="var s=document.createElement('span');s.className='${emojiClass}';s.textContent='${fb}';this.replaceWith(s);">`;
  }
  return `<span class="${emojiClass}">${emoji||"❓"}</span>`;
}
function letterCell(letter){
  const cell = document.createElement("div");
  cell.innerHTML = `<span class="big-glyph ink-glyph">${letter}</span>`;
  return cell;
}
/* ordering/seriation render (MTKGA02_L02_S02): an object at a given magnitude. by="size" scales the
   picture uniformly; by="length" draws a content-true rounded bar of width∝mag; by="weight" shows the
   picture at a uniform size (weight is not visual — the child uses known heaviness / the balance cue). */
function imgOrEmojiSized(img, emoji, px){
  const fb = String(emoji||"❓").replace(/'/g,"");
  if(img) return `<img class="ord-obj-img" style="width:${px}px;height:${px}px" src="assets/Images/${img}.${IMG_EXT}" alt="" `+
    `onerror="var s=document.createElement('span');s.className='ord-obj-emoji';s.style.fontSize='${Math.round(px*0.82)}px';s.textContent='${fb}';this.replaceWith(s);">`;
  return `<span class="ord-obj-emoji" style="font-size:${Math.round(px*0.82)}px">${emoji||"❓"}</span>`;
}
function renderOrdObj(o, by){
  if(by === "length"){ const w = {1:130,2:210,3:300}[o.mag] || 200;
    return `<div class="ord-bar" style="width:${w}px;background:${o.color||"#F5A623"}"></div>`; }
  // size AND weight scale the picture by visual magnitude — so a BIG-but-LIGHT balloon looks big and
  // tempts the child (bigger=heavier misconception), while the small stone is the correct heaviest pick.
  const px = {1:80, 2:116, 3:154}[o.mag] || 116;
  return imgOrEmojiSized(o.img, o.emoji, px);
}
function pictureCell(picture, emoji, imgKey){
  const cell = document.createElement("div");
  cell.innerHTML = imgOrEmoji(imgKey, emoji, "pic-img", "pic-emoji") + `<span class="lbl">${picture||""}</span>`;
  return cell;
}
function stimulusLetter(letter){
  const el = document.createElement("div"); el.className = "stimulus-letter";
  el.innerHTML = `<span class="ink-glyph">${letter}</span>`;
  return el;
}
function stimulusPic(picture, emoji, imgKey){
  const el = document.createElement("div"); el.className = "stimulus-pic";
  el.innerHTML = imgOrEmoji(imgKey, emoji, "img", "emoji") + `<span class="lbl">${picture||""}</span>`;
  return el;
}
/* gender helpers: an option card showing a gender label (पुल्लिंग/स्त्रीलिंग),
   and a stimulus card showing the target gender label. */
function genderLabelCell(label, gender){
  const cell = document.createElement("div");
  cell.innerHTML = `<span class="gender-label${gender==="F"?" fem":""}">${label}</span>`;
  return cell;
}
function stimulusGender(label, gender){
  const el = document.createElement("div");
  el.className = "stimulus-gender" + (gender==="F"?" fem":"");
  el.textContent = label;
  return el;
}

/* shape helpers (maths): render circle/square/triangle/rectangle as inline SVG in
   any colour / size / rotation (LO: recognise regardless of orientation or size).
   No image assets needed — shapes are pure geometry, so the sample renders offline. */
function shapeSVG(shape, opts){
  opts = opts || {};
  const color = opts.color || "#386AF6";
  const size  = opts.size  || 120;
  const rot   = opts.rotate || 0;
  let inner = "";
  if(shape === "circle")         inner = `<circle cx="50" cy="50" r="42" fill="${color}"/>`;
  else if(shape === "square")    inner = `<rect x="12" y="12" width="76" height="76" rx="0" fill="${color}"/>`;   // TRUE corners — teachable geometry is never rounded
  else if(shape === "triangle")  inner = `<polygon points="50,9 91,89 9,89" fill="${color}"/>`;
  else if(shape === "rectangle") inner = `<rect x="6" y="28" width="88" height="44" rx="0" fill="${color}"/>`;    // TRUE corners
  const g = rot ? `<g transform="rotate(${rot} 50 50)">${inner}</g>` : inner;
  return `<svg class="shape-svg" viewBox="0 0 100 100" width="${size}" height="${size}" `+
         `xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${g}</svg>`;
}
function shapeCell(o){
  const cell = document.createElement("div");
  cell.innerHTML = shapeSVG(o.shape, {color:o.color, size:130, rotate:o.rotate});
  return cell;
}
function stimulusShape(o){
  const el = document.createElement("div"); el.className = "stimulus-shape";
  el.innerHTML = shapeSVG(o.shape, {color:o.color, size:150, rotate:o.rotate});
  return el;
}

/* counting helpers (maths): a numeral option card (big numeral + small number word),
   and a stimulus box showing a set of `count` identical objects to be counted. */
function numberCell(numeral, word){
  const cell = document.createElement("div");
  cell.innerHTML = `<span class="num-glyph">${numeral}</span>` + (word ? `<span class="num-word">${word}</span>` : "");
  return cell;
}
/* VISUAL-FIRST quantity: a HAND showing n fingers up (assets/UI/hand_1..5) — pre-reader,
   NO number-word text. Falls back to the numeral only if n is outside 1..5 or the art is missing. */
function fingerCount(n, cls){ cls = cls || "finger-hand";
  if(!(n>=1 && n<=5)) return `<span class="num-glyph">${n}</span>`;
  return `<img class="${cls}" src="assets/UI/hand_${n}.png" alt="" ` +
    `onerror="var s=document.createElement('span');s.className='num-glyph';s.textContent='${n}';this.replaceWith(s);">`;
}
function fingerCell(n){ const c = document.createElement("div"); c.innerHTML = fingerCount(n, "opt-hand"); return c; }
/* DISPLAY numeral: ALWAYS Arabic (1 2 3) on screen — kids learn the universal digit.
   Spoken VO stays Hindi (एक/दो/तीन) via the separate vo_num_/vo_total_ audio files. */
function devNumeral(n){ return String(n); }
/* DUAL-CODED counting option: the Devanagari NUMERAL the child is learning, big and on top,
   with a smaller finger-hand beneath it as a visual anchor. The point of counting is to learn the
   NUMBER SYMBOL, not just read a hand-sign — so the numeral leads and the hand supports. Falls back
   to the numeral alone if the hand art (1..5) is missing. */
function numFingerCell(n){
  // outer div BECOMES the .opt-cell (mountTapOptions adds that class), so the stack lives in an
  // INNER .numfinger wrapper — otherwise ".opt-cell .numfinger x" selectors wouldn't match.
  const c = document.createElement("div");
  // hand art exists only for 1..5; beyond that fingerCount would fall back to a SECOND numeral
  // (numeral shown twice — hit when the counting range grew to 10), so skip the hand entirely.
  c.innerHTML = `<div class="numfinger"><span class="num-glyph">${devNumeral(n)}</span>${(n>=1&&n<=5) ? fingerCount(n, "nf-hand") : ""}</div>`;
  return c;
}
function stimulusCountSet(count, obj, scatter, perRow){
  // counts >10 render DENSE (smaller objects, wrapping); perRow groups the set in rows of exactly
  // N (the curriculum's "rows of 5/10" organisation for sets up to 20 — MTKGA01_L01_S04).
  const dense = count > 10 || !!perRow;
  const el = document.createElement("div"); el.className = "count-set" + (scatter ? " scattered" : "") + (dense ? " dense" : "");
  if(perRow && !scatter){ el.style.display = "grid"; el.style.gridTemplateColumns = `repeat(${perRow}, auto)`; }
  for(let i=0;i<count;i++){
    const c = document.createElement("span"); c.className = "cobj";
    // SCATTERED arrangement (SME/misconception: "total changes when objects are scattered") —
    // deterministic per-index jitter (stable across mounts/captures), never so large items overlap-hide.
    if(scatter) c.style.transform = `translateY(${((i*23)%25)-12}px) rotate(${((i*37)%21)-10}deg)`;
    c.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji");
    el.appendChild(c);
  }
  return el;
}
/* SME (S01 review deck): outside the tutorial, numeral options show the NUMBER ONLY, larger —
   no finger-hand support (fingers are a TEACHING aid, not a test aid). */
function bigNumCell(n){
  const c = document.createElement("div");
  c.innerHTML = `<span class="bignum-glyph">${devNumeral(n)}</span>`;
  return c;
}
/* COMPARE_SETS helpers (one-to-one matching → ज़्यादा / कम / बराबर).
   Two left-aligned rows (columns line up), a dashed connector drawn top[i]↔bottom[i]
   for each matched pair, and the unmatched leftover item(s) in the longer row glow —
   that glow IS the "which has more" proof. Offsets (not getBoundingClientRect) so it
   works even when the preview tab is throttled. */
function cmpObj(obj){
  const c = document.createElement("span"); c.className = "cobj";
  c.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji");
  return c;
}
function stimulusCompareSets(data){
  const nA = data.a_count, nB = data.b_count, A = data.a_object, B = data.b_object;
  const NS = "http://www.w3.org/2000/svg";
  const stage = document.createElement("div"); stage.className = "compare-stage";
  const rowA = document.createElement("div"); rowA.className = "cmp-row top";
  const rowB = document.createElement("div"); rowB.className = "cmp-row bot";
  const svg  = document.createElementNS(NS, "svg"); svg.setAttribute("class", "cmp-lines");
  for(let i=0;i<nA;i++) rowA.appendChild(cmpObj(A));
  for(let i=0;i<nB;i++) rowB.appendChild(cmpObj(B));
  stage.appendChild(rowA); stage.appendChild(svg); stage.appendChild(rowB);
  const btn = document.createElement("button"); btn.type = "button"; btn.className = "cmp-match-btn";
  btn.textContent = "🔗 मिलाओ"; stage.appendChild(btn);
  const min = Math.min(nA, nB);
  let drawn = false;
  function draw(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    const IA = [...rowA.children], IB = [...rowB.children];
    const y1 = rowA.offsetTop + rowA.offsetHeight - 4;
    const y2 = rowB.offsetTop + 4;
    for(let i=0;i<min;i++){
      const x = IA[i].offsetLeft + IA[i].offsetWidth/2;
      const ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", x); ln.setAttribute("y1", y1);
      ln.setAttribute("x2", x); ln.setAttribute("y2", y2);
      ln.setAttribute("class", "cmp-line"); svg.appendChild(ln);
      setTimeout(()=> ln.classList.add("show"), 130*i);
    }
    const longer = nA > nB ? IA : nB > nA ? IB : null;   // null when equal (nothing left over)
    if(longer) for(let i=min;i<longer.length;i++)
      setTimeout(()=> longer[i].classList.add("leftover"), 130*min + 160);
  }
  // reveal the matching (child taps मिलाओ, or the hint/tutorial calls this). cb fires after it settles.
  stage._revealMatches = (cb)=>{ if(!drawn){ drawn = true; btn.disabled = true; draw(); }
    if(cb) setTimeout(cb, 130*min + 800); };
  btn.onclick = ()=> stage._revealMatches();
  if(data.show_matches){ btn.style.display = "none"; setTimeout(()=> stage._revealMatches(), 420); }
  return stage;
}
/* HINT for "how many": instead of a text popup, COUNT the set FOR the child —
   highlight each object left→right, say एक/दो/तीन, show the numeral on top of it.
   The child sees + hears the count modelled, then answers from the options. */
function demoCount(items, numerals, onDone){
  numerals = numerals || [];
  const clear = ()=> items.forEach(o=>{ o.classList.remove("counting"); const c=o.querySelector(".count-callout"); if(c) c.remove(); });
  clear();
  let i = 0;
  (function step(){
    if(i >= items.length){                       // last count landed → clear, then continue
      setTimeout(()=>{ clear(); if(onDone) onDone(); }, 1000);
      return;
    }
    const o = items[i];
    o.classList.add("counting");
    let cal = o.querySelector(".count-callout");
    if(!cal){ cal = document.createElement("span"); cal.className = "count-callout"; o.appendChild(cal); }
    cal.textContent = String(i+1);   // Arabic count callout; Hindi number-word is spoken separately
    play("assets/Audio/vo_num_" + (i+1) + "." + AUDIO_EXT, ()=>{ i++; setTimeout(step, 320); });
  })();
}
function demoCountSet(setEl, count, numerals, onDone){   // count the "how many?" stimulus set
  demoCount([...setEl.querySelectorAll(".cobj")].slice(0, count), numerals, onDone);
}

/* ---------- 10b. DEVANAGARI GLYPH INK-CENTERING ----------
   Devanagari glyphs carry matras above (ओ, औ, अं) and below (ऋ) the shirorekha,
   so plain flex `align-items:center` leaves them sitting high with a gap below —
   and the offset differs per glyph. Measure each glyph's real ink box (canvas
   actualBoundingBox) + its baseline in the DOM, then translateY so the INK is
   truly centred in its tile/box. Font-agnostic; recomputed on mount + fonts.ready. */
let _inkCtx = null;
function centerInkGlyph(span){
  if(!span || !span.parentElement) return;
  /* [S01r4h] Read the WORD, not the word plus its overlay. A bare-marking sentence chip now
     holds the layered form (.sw-base + one .sw-lit per occurrence) inside this very span, so
     textContent would read "चूहेच" and the width-fit below would shrink the word to buy room for
     a letter that is painted ON TOP of it and occupies no advance at all. */
  const _swBase = span.querySelector && span.querySelector(".sw-base");
  const glyph = ((_swBase ? _swBase.textContent : span.textContent) || "").trim();
  if(!glyph) return;
  const box = span.parentElement;
  const cs = getComputedStyle(span);
  const fpx = parseFloat(cs.fontSize);
  if(!fpx) return;
  _inkCtx = _inkCtx || document.createElement("canvas").getContext("2d");
  // --- WIDTH-FIT (16m+): shrink font so the word never spills its box. Applies to EVERY
  // ink-glyph (drag tiles, mastery stimulus, tap tiles), not just MEET_LETTER's _mlFit —
  // that fix only touched the teaching slide, so माला/नाक/पापा still overflowed dd-tile /
  // stimulus-letter on the practice slides (Yasir catch #6). Baseline size captured once in
  // data-ink-base so this is idempotent across re-runs (mount + fonts.ready + resize).
  const _base = span.dataset.inkBase ? parseFloat(span.dataset.inkBase) : fpx;
  if(!span.dataset.inkBase) span.dataset.inkBase = String(_base);
  const _bcs = getComputedStyle(box);
  const _availW = box.clientWidth - (parseFloat(_bcs.paddingLeft)||0) - (parseFloat(_bcs.paddingRight)||0);
  _inkCtx.font = `${cs.fontWeight} ${_base}px ${cs.fontFamily}`;
  /* [28i] FIT THE INK, NOT THE ADVANCE — the SME's original "decrease the size of the words so that
     they all fit perfectly inside the box", which the 16m width-fit did not actually achieve.
     Devanagari PAINTS wider than it advances: the shirorekha and the matras overhang, so ink runs
     ~4-11px past measureText().width. The failure was not a wrong scale factor, it was the BRANCH: a
     word whose advance fits `_availW` never entered the shrink path at all, so its ink overflow was
     never even considered. Measured with this same canvas API at the real computed size on
     HI01H04_L02_S02: P6 यह ink 66 vs box 59, बकरी 138/132, एक 91/85, T4 कहाँ 184/180 — all four had a
     fitting advance and were therefore left alone. Fit whichever of the two actually paints wider, so
     a Latin/numeral glyph (ink <= advance) behaves exactly as before and nothing else in the fleet
     shifts. The 0.94 safety margin is kept; with ink as the base it is now margin rather than the
     only thing standing between the word and the border. */
  const _mB = _inkCtx.measureText(glyph);
  const _inkW = (isFinite(_mB.actualBoundingBoxLeft) && isFinite(_mB.actualBoundingBoxRight))
    ? (_mB.actualBoundingBoxLeft + _mB.actualBoundingBoxRight) : _mB.width;
  /* TWO BUDGETS, because ink and advance are not competing for the same space.
     The ADVANCE must fit the CONTENT box (unchanged from 16m — that is the layout contract).
     The INK must merely not cross the BORDER, and padding is exactly the room provided for overhang:
     .sentence-word carries 30px each side, so a word whose ink runs 5px past the content edge is
     2.5px into a 30px cushion — invisible. My first pass fitted ink to the content box and would have
     shrunk almost every Devanagari word in the fleet to buy nothing; for a KG reader, needlessly
     smaller text is a real cost. So each budget constrains its own measure and the tighter of the two
     wins. A word only shrinks for ink when the ink would actually reach the border. */
  const _availInk = box.clientWidth;                       // padding box = inside the border
  let _sc = 1;
  if(_availW   > 8 && _mB.width > _availW)   _sc = Math.min(_sc, _availW   / _mB.width);
  if(_availInk > 8 && _inkW     > _availInk) _sc = Math.min(_sc, _availInk / _inkW);
  let _fpx = _base;
  if(_sc < 1) _fpx = Math.max(20, _base * _sc * 0.94);
  if(Math.abs(_fpx - fpx) > 0.5) span.style.fontSize = _fpx + "px";
  _inkCtx.font = `${cs.fontWeight} ${_fpx}px ${cs.fontFamily}`;
  const m = _inkCtx.measureText(glyph);
  /* [27h] F2 — SHARED BASELINE FOR A ROW OF WORDS.
     Ink-centring (actualBoundingBox*) is measured from THIS glyph's own ink, so every word lands
     differently: a word with an above-line matra (और/मैं/की/कौन) has a taller ascent, gets pushed
     further DOWN, and one with a below-line matra (तुम/फूल) sits HIGHER. Measured on 27g in one row:
     T1 एक 39 / घर 43 / और 59 · G2 यह 55 / वह 55 / मैं 75 · P5 तुम 45 / फूल 46 / गेंद 68 / आम 61.
     That is a 23px spread inside a single row and it is exactly the SME's "text alignment of the
     words is not right" — written on 7 of 17 pages of one deck alone.
     Words in a row must share a BASELINE, so use FONT metrics (fontBoundingBox*), which are constant
     for a given font+size and therefore give every tile in the row the same dy.
     A LONE showcase glyph (MEET_LETTER's 200px letter) still uses ink metrics: there is no row to
     align with, and at that size font-box centring would sit it visibly low because the font box
     reserves descender room the letter does not use. */
  const _row = box.parentElement;
  const _inRow = !!_row && _row.querySelectorAll(".ink-glyph").length > 1;
  let a = m.actualBoundingBoxAscent, d = m.actualBoundingBoxDescent;
  if(_inRow && isFinite(m.fontBoundingBoxAscent) && isFinite(m.fontBoundingBoxDescent)){
    a = m.fontBoundingBoxAscent; d = m.fontBoundingBoxDescent;
  }
  if(!isFinite(a) || !isFinite(d)) return;
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  span.style.transform = "";   // reset before measuring baseline
  const probe = document.createElement("span");
  probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline;";
  span.appendChild(probe);
  const baseScreen = probe.getBoundingClientRect().top;
  span.removeChild(probe);
  const br = box.getBoundingClientRect();
  if(br.height < 5) return;    // not laid out yet
  const boxCenter = br.top + br.height/2;
  const inkCenter = baseScreen + ((d - a)/2) * scale;   // screen px
  const dy = (boxCenter - inkCenter) / scale;           // css px to move glyph down
  span.style.transform = `translateY(${dy}px)`;
}
function centerAllGlyphs(root){
  (root || document).querySelectorAll(".ink-glyph").forEach(centerInkGlyph);
}

/* ---------- 10c. IN-WORD MATRA COLOURING (AA / right-spacing matras) ----------
   Colour the matra RED *inside the word itself* (e.g. the ा in दादा) with no artifacts.
   Per-character fill CANNOT do this: द+ा shape as ONE cluster the browser colours as a
   unit — a <span>/<tspan> on the ा is ignored (colours by the base consonant), and forcing
   the ा into its own run inserts a dotted circle (◌ा). Verified at the pixel level. The clean
   way is a two-layer overlay: the whole word in the base colour + a RED copy of the SAME word
   clipped to just the matra's x-column(s). Both layers are the identical string at identical
   coords, so shaping is identical and the red lands exactly on the matra strokes (100% ink
   match vs the plain word, no ◌, no shift, no duplicate आ).
   ONLY valid for RIGHT-SPACING matras (matra owns its own right-hand column). Above/below/left
   matras (े ै ि ु ृ …) have no such column, so callers fall back to the old coloured callout.
   Extend the set ONLY after pixel-verifying the new matra's geometry. */
const RIGHT_SPACING_MATRAS = new Set(["ा"]);
const _COMB = /[ऀ-ःऺ-ॏ॑-ॗॢॣ]/;   // Devanagari combining marks
let _matraUid = 0, _mCv = null, _mCx = null;
/* Pixel-accurate RED column(s) for the matra(s) in `word`. The matra's vertical stroke ends at
   its advance, but its shirorekha (top bar) overhangs — a navy end-cap on the last matra, or the
   connector toward the next letter on a medial one. So: left = consonant advance; right = the next
   consonant's BODY left (found by scanning the LOWER band, below the continuous top bar) or the
   word's ink-right for the last cluster. That paints the whole matra + its bar red with no navy
   sliver, and stops before the next letter's body. Canvas raster uses the real Baloo 2 (recomputed
   on fonts.ready by refreshMatraWords, so fallback-metric first paints self-correct). */
function _matraClipCols(word, matra, fontPx){
  _mCx = _mCx || (_mCv = document.createElement("canvas")).getContext("2d");
  const ctx = _mCx, font = `800 ${fontPx}px "Baloo 2","Noto Sans Devanagari",sans-serif`;
  ctx.font = font;
  const ch = [...word], cl = []; let x = 0, i = 0;
  while(i < ch.length){ let j = i + 1, hasM = false;
    while(j < ch.length && _COMB.test(ch[j])){ if(ch[j] === matra) hasM = true; j++; }
    const cw = ctx.measureText(ch.slice(i, j).join("")).width;
    cl.push({ start: x, consW: ctx.measureText(ch[i]).width, cw, hasM }); x += cw; i = j; }
  const W = Math.ceil(x) + 4, H = Math.ceil(fontPx * 1.4);
  _mCv.width = W; _mCv.height = H; ctx.font = font; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#000";
  ctx.clearRect(0, 0, W, H); ctx.fillText(word, 0, Math.round(fontPx));
  const d = ctx.getImageData(0, 0, W, H).data, ink = (X, Y)=> d[(Y * W + X) * 4 + 3] > 40;
  let y0 = H, y1 = 0;
  for(let Y = 0; Y < H; Y++) for(let X = 0; X < W; X++){ if(ink(X, Y)){ if(Y < y0) y0 = Y; if(Y > y1) y1 = Y; break; } }
  const bTop = Math.round(y0 + (y1 - y0) * 0.40), bBot = Math.round(y1 - (y1 - y0) * 0.02);   // below the shirorekha
  const colInk = new Array(W).fill(false);
  for(let X = 0; X < W; X++) for(let Y = bTop; Y <= bBot; Y++){ if(ink(X, Y)){ colInk[X] = true; break; } }
  const runs = []; let s = null;
  for(let X = 0; X < W; X++){ if(colInk[X] && s === null) s = X; else if(!colInk[X] && s !== null){ runs.push([s, X - 1]); s = null; } }
  if(s !== null) runs.push([s, W - 1]);
  let inkRight = 0; for(let X = W - 1; X >= 0; X--){ let a = false; for(let Y = 0; Y < H; Y++){ if(ink(X, Y)){ a = true; break; } } if(a){ inkRight = X; break; } }
  const cols = [];
  cl.forEach((c, idx)=>{ if(!c.hasM) return;
    const advEnd = c.start + c.cw, left = c.start + c.consW;
    let right;
    if(idx === cl.length - 1){ right = inkRight + Math.max(4, fontPx * 0.06); }    // last cluster → generously past the end-cap (nothing to the right, so free)
    else { const before = runs.filter(r => r[0] < advEnd);                         // medial → the next consonant's body-left + ~1px, so the whole
           const matraRight = before.length ? before[before.length - 1][1] : advEnd; //   connector bar is red (only the body's faint AA edge is grazed)
           const next = runs.find(r => r[0] > matraRight);
           right = (next ? next[0] : advEnd) + Math.max(1, fontPx * 0.012); }
    cols.push([left, Math.max(right, advEnd)]);
  });
  return cols;
}
function _matraWordSVG(word, matra, fontPx){
  _mCx = _mCx || (_mCv = document.createElement("canvas")).getContext("2d");
  _mCx.font = `800 ${fontPx}px "Baloo 2","Noto Sans Devanagari",sans-serif`;
  const totalW = _mCx.measureText(word).width;
  const cols = _matraClipCols(word, matra, fontPx);
  const padX = fontPx * 0.12, asc = fontPx * 0.92, desc = fontPx * 0.30;
  const W = totalW + padX * 2, H = asc + desc, uid = "mw" + (++_matraUid);
  const esc = (s)=> String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const tAttr = `x="${padX.toFixed(2)}" y="${asc.toFixed(2)}" text-anchor="start" font-family="'Baloo 2','Noto Sans Devanagari',sans-serif" font-weight="800" font-size="${fontPx}"`;
  const clip = cols.map(([a,b])=>`<rect x="${(a+padX).toFixed(2)}" y="0" width="${Math.max(0,b-a).toFixed(2)}" height="${H.toFixed(2)}"/>`).join("");
  return `<svg class="matra-word" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(2)} ${H.toFixed(2)}" width="${W.toFixed(2)}" height="${H.toFixed(2)}" role="img" aria-label="${esc(word)}">`
    + (cols.length ? `<defs><clipPath id="${uid}">${clip}</clipPath></defs>` : "")
    + `<text class="mw-base" ${tAttr}>${esc(word)}</text>`
    + (cols.length ? `<g class="mw-red" clip-path="url(#${uid})"><text ${tAttr}>${esc(word)}</text></g>` : "")
    + `</svg>`;
}
/* rebuild the matra SVGs (clip columns depend on font metrics — recompute once the web font
   has actually loaded, so a first paint with fallback metrics can't leave the red mis-clipped). */
function refreshMatraWords(root){
  (root || document).querySelectorAll(".meet-letter-box[data-mw-word]").forEach(box=>{
    box.innerHTML = _matraWordSVG(box.dataset.mwWord, box.dataset.mwMatra, parseFloat(box.dataset.mwFs) || 120);
  });
}

/* ---------- 11. DRAG-DROP PRIMITIVE ---------- */
function makeDraggable(tileEl, onDrop, opts){
  let startX=0, startY=0, dx=0, dy=0, dragging=false;
  let scale = 1;
  const refScale = ()=> scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  function onDown(e){
    if(tileEl.classList.contains("snapped") || tileEl.classList.contains("matched")) return;
    if(state.revealing) return;   // [24a N8] tray still revealing one-by-one → no grabs yet (parity with the tap path's lock)
    refScale();
    dragging = true;
    // bind move/up on the document ONLY while dragging (removed in onUp) — otherwise every tile leaves
    // stale document listeners that pile up across the 11 drag slides.
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, {passive:false});
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    document.addEventListener("touchcancel", onCancel);     // [24a bug-hunt F3] a cancelled touch (call, gesture-nav) must abort, not orphan listeners + leave the tile stuck mid-drag
    document.addEventListener("pointercancel", onCancel);
    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX; startY = p.clientY;
    dx = 0; dy = 0;
    tileEl.classList.add("dragging");
    if(opts && opts.onPick) opts.onPick();   // e.g. show a nudge at the slot this tile belongs in
    e.preventDefault();
  }
  function onMove(e){
    if(!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    dx = (p.clientX - startX) / scale; dy = (p.clientY - startY) / scale;
    tileEl.style.transform = `translate(${dx}px,${dy}px) scale(1.08)`;
    // highlight zone under — hide the tile from hit-testing so the dragged tile
    // (z-index 50, now covering the zone) doesn't mask the zone beneath it.
    const cx = p.clientX, cy = p.clientY;
    document.querySelectorAll(".dd-zone").forEach(z => z.classList.remove("hover"));
    tileEl.style.pointerEvents = "none";
    const under = document.elementFromPoint(cx, cy);
    tileEl.style.pointerEvents = "";
    const zone = under?.closest?.(".dd-zone");
    if(zone && !zone.classList.contains("filled")) zone.classList.add("hover");
    e.preventDefault();
  }
  function _unbind(){
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("mouseup", onUp);
    document.removeEventListener("touchend", onUp);
    document.removeEventListener("touchcancel", onCancel);
    document.removeEventListener("pointercancel", onCancel);
  }
  function onCancel(){   // [24a bug-hunt F3] abort an interrupted drag: unbind + spring the tile back, never drop
    if(!dragging) return;
    dragging = false; _unbind();
    tileEl.classList.remove("dragging"); tileEl.style.transform = "";
    document.querySelectorAll(".dd-zone,.sort-bin").forEach(z => z.classList.remove("hover"));
  }
  function onUp(e){
    if(!dragging) return;
    dragging = false;
    _unbind();
    tileEl.classList.remove("dragging");
    const p = e.changedTouches ? e.changedTouches[0] : e;
    // hide the tile from hit-testing so we detect the zone underneath it
    tileEl.style.pointerEvents = "none";
    const under = document.elementFromPoint(p.clientX, p.clientY);
    tileEl.style.pointerEvents = "";
    const zone = under?.closest?.(".dd-zone");
    document.querySelectorAll(".dd-zone").forEach(z => z.classList.remove("hover"));
    if(zone && !zone.classList.contains("filled")){
      // snap
      tileEl.style.transform = "";
      onDrop(zone, tileEl);
    } else {
      tileEl.style.transform = "";
      if(Math.abs(dx) < 6 && Math.abs(dy) < 6 && opts && opts.onTap) opts.onTap();   // a tap (not a drag) → speak the word
    }
  }
  tileEl.addEventListener("mousedown", onDown);
  tileEl.addEventListener("touchstart", onDown, {passive:false});
}
/* [24a A1] DRAG VO-GATE (Yasir 2026-07-24, fork-proven in the HI01H08 gender file): while a VO is
   sounding, a press that would start a NEW drag is IGNORED, so picking up a tile can't cut the
   prompt/feedback voice — the drag equivalent of the tap gate in mountTapOptions. MUST run in the
   CAPTURE phase: MATCH_DRAG_N tiles carry their OWN speak-on-press listener (pointerdown, registered
   before makeDraggable's onDown) — an in-onDown `if(isPlaying)` check would see the tile's OWN audio
   and block every grab (total soft-lock). At capture time isPlaying still reflects the genuinely
   PRIOR VO. Gated on pointerdown + mousedown + touchstart so both the speak listener and onDown are
   swallowed. 4s safety via _voStart: a stalled clip must never freeze the tiles. Scoped to draggable
   game tiles only — replay chips, nav and tap-answer cells take presses as usual. */
(function installDragVoGate(){
  const SEL = ".sort-item, .dd-tile, .cdm-objtile, .cdm-card, .combine-drag";
  // ONE decision PER PRESS, made at pointerdown (the earliest event, BEFORE the tile's own
  // speak-on-press listener can flip isPlaying). The same press's trailing mousedown/touchstart
  // INHERIT that decision — re-evaluating them would see the press's OWN audio and block the very
  // grab that was just allowed (the trap, resurrected through event-type ordering).
  let _decision = 0, _decidedAt = 0;   // 0 = none · 1 = allow · 2 = block
  function decide(e, now){
    const t = e.target && e.target.closest && e.target.closest(SEL);
    if(!t || t.classList.contains("snapped") || t.classList.contains("matched")){ _decision = 0; return 0; }
    _decidedAt = now;
    /* [31n] BACK TO 4000ms. 31m widened this to 20s reasoning that real clips outlast 4s — true,
       but it misread what this window is FOR. Blocking during a live clip is the CSS lock's job
       (body.vo-lock, exact: on for precisely as long as isPlaying). This window is the escape
       hatch, and widening it turned a stalled or slow-to-end clip into a twenty-second dead
       screen: Yasir hit it on SEQUENCE_DRAG, placing one letter correctly and then finding every
       remaining tile refusing to move. A press must never be swallowed longer than the child will
       wait before deciding the game is broken. The gap 31m was actually chasing — .cdm-objtile,
       .cdm-card and .combine-drag having no CSS entry and so relying on this gate alone — is
       closed properly in the CSS rule, which is where it belonged. Leave this at 4s. */
    _decision = (isPlaying && now - _voStart < 4000) ? 2 : 1;
    return _decision;
  }
  function gate(e){
    const now = Date.now();
    let d;
    if(e.type === "pointerdown" || !_decision || now - _decidedAt > 400){
      d = decide(e, now);                                      // fresh press (or no pointer events on this browser)
    } else {
      d = _decision;                                           // trailing event of the SAME press → inherit
    }
    if(d === 2){ e.stopImmediatePropagation(); if(e.cancelable) e.preventDefault(); }   // swallow before speak-on-press + onDown
  }
  document.addEventListener("pointerdown", gate, true);
  document.addEventListener("mousedown", gate, true);
  document.addEventListener("touchstart", gate, {capture:true, passive:false});
})();
/* [24a A5] When a sort card is placed in a bin it LEAVES a faint, same-size dashed placeholder in
   the tray at its exact original spot (Yasir 2026-07-24, parity with the production gender game).
   The ghost holds the flex slot so the remaining tray cards don't shift, and marks where the card
   came from. Sized BEFORE the tile moves/shrinks (offsetWidth is read while it still sits in the tray). */
function leaveTrayGhost(tile){
  if(!tile || tile._ghosted) return;
  const tray = tile.parentElement;
  // [25c] The guard used to accept ONLY ".sort-tray", so calling this from MATCH_DRAG_N silently
  // did nothing — match tiles live in a ".dd-row". Accept every drag-SOURCE row so "ghost slots
  // wherever we have dragging" (Yasir 2026-07-25) actually holds. .sort-ghost is plain flex CSS,
  // so it lays out correctly in either container.
  const SOURCE_ROWS = ["sort-tray", "dd-row", "tile-row", "match-row"];
  if(!tray || !SOURCE_ROWS.some(c => tray.classList.contains(c))) return;
  const g = document.createElement("div");
  g.className = "sort-ghost";
  g.style.width = tile.offsetWidth + "px";
  g.style.height = tile.offsetHeight + "px";
  tray.insertBefore(g, tile);
  tile._ghosted = true;
}
/* shared wrong-drop response for drag/sort/sequence modules: soft buzz + Swiftie try-again pose + the
   authored spoken recovery. Pre-readers need the SPOKEN recovery, not just the visual spring-back.
   [24b] TWO-LEVEL DRAG HINTS (Yasir 2026-07-25: "everywhere, regardless of game or type of
   interaction, we are going to have two hints"). The tap path already graded its feedback in
   mountTapOptions; drag had NO hint clip at all (only try_again). Now: 1st wrong -> the slide's
   `hint1`; 2nd and later -> `hint` (the level that GIVES the answer). Every drag mechanic inherits
   this because all 12 wrong-drop sites funnel through here. The count is tracked per-slide inside
   this helper, so NO call site changes. Fully ADDITIVE: a card with no hint1/hint authored still
   plays try_again exactly as before, so sibling games are byte-for-byte unchanged in behaviour. */
let _dwSlide = null, _dwN = 0;
function dragWrong(slide, tile){
  sfxWrongSoft(); setSwMood("tryagain");
  const sid = slide && slide.id;
  if(sid !== _dwSlide){ _dwSlide = sid; _dwN = 0; }   // new slide -> restart the ladder
  _dwN++;
  // [25b] PER-PAIR hint2 on drag (Yasir 2026-07-25): the 2nd hint must name the tile the child is
  // holding AND the picture it belongs to — "यह 'क' है, यह 'कमल' की पहली ध्वनि है।" A single
  // slide-level clip can't do that, so when the caller passes the dragged tile we look up that
  // pair's own `hint2_audio`. Falls through to the slide-level hint when a pair has none authored.
  if(_dwN > 1 && tile && slide && slide.data && Array.isArray(slide.data.pairs)){
    const L = (tile.textContent || "").trim();
    const pr = slide.data.pairs.find(p => String(p.letter || "").trim() === L);
    if(pr && pr.hint2_audio){
      play("assets/Audio/" + pr.hint2_audio + "." + AUDIO_EXT, ()=>{});
      return;
    }
  }
  const clip = (_dwN <= 1)
    ? (audioFor(slide, "hint1") || audioFor(slide, "try_again"))
    : (midHint(slide) || audioFor(slide, "hint1"));          /* [28k] rung 2 (drag) */
  play(clip || null, ()=>{});
}

/* shared SUCCESS response — the engine-wide answer-feedback standard (lead-confirmed): side confetti
   cannons + rising sfx + Swiftie celebrates + the authored "correct" VO, then AUTO-ADVANCE. Never a
   celebration popup, never a "press आगे to continue" gate on a solved activity. `revealed` = the child
   got there via the reveal scaffold → quieter settle (no confetti/cheer) + completeSlide(false) so
   mastery telemetry stays honest. */
function celebrateThenAdvance(slide, revealed){
  /* [32b nocut] ADVANCE WHEN THE CLIP ENDS, NOT ON A BLIND TIMER. Both branches used to fire
     completeSlide() 1400ms after starting a clip, and mountSlide() then stopAudio()d whatever was
     still speaking — measured on HIKGH04_L01_S02: every reveal line (1.92-3.16s) truncated at
     ~1403ms, losing 27-35% of the sentence mid-word. Yasir reported it on G4 and P3.
     The floor keeps the old feel (confetti lands, the beat does not snap); onEnd does the advancing;
     the cap means a stalled clip can never hold the lesson. play() fires its callback on the
     error/no-src/blocked paths too, so a missing clip still advances on its silent beat. */
  var MIN_HOLD = 1400, CAP = 9000, t0 = Date.now(), fired = false;
  var go = function(){
    if(fired) return; fired = true;
    setTimeout(function(){ completeSlide(!revealed); }, Math.max(0, MIN_HOLD - (Date.now() - t0)));
  };
  if(!revealed){ sfxCorrect(); confettiCannon(); setSwMood("celebrate"); }
  play(audioFor(slide, revealed ? "reveal" : "correct") || null, go);
  setTimeout(go, CAP);
}

/* ---------- 11b. REPEATED-SOUND HELPERS (HI02H11_L01_S01 · SME round 4) ----------
   Three asks recur on nearly every page of this deck and none of them existed in the engine:
     (1) "play the sentence with word-by-word highlighting synced with the VO"
     (2) "highlight ONLY the target letter in each word - do not highlight the complete word"
     (3) "play only the <letter> sound and show the letter on screen at the same time"
   (1) and (2) are exactly what round 3 reported as NOT BUILT ("SENTENCE_SOUND has no per-word audio
   and no per-word timing to hang a highlight on"). They are built here.

   ON (2) AND DEVANAGARI: a bare consonant CANNOT be wrapped away from its own matra - that splits the
   orthographic cluster and the browser renders an orphaned mark. This is the same shaping trap that
   killed the "colour the aa-matra" attempt on HI01H04, so it is not re-attempted. The unit here is the
   AKSHARA: peetal marks "पी", not "प" and not the whole word. That is the only technically sound
   reading of the ask, and it still contrasts sharply against the rest of the word.

   ON (1) AND TIMING: there is no forced aligner in this toolchain, so boundaries are PROPORTIONAL -
   each token takes a share of the clip's REAL measured duration, weighted by akshara count with a
   bump for long matras. Close, not frame-exact; see OPEN-6 in CHANGES.md. */

const _DEV_VIRAMA = "\u094D";
function _devIsMark(ch){
  const c = ch.codePointAt(0);
  return (c >= 0x0900 && c <= 0x0903)      /* candrabindu / anusvara / visarga */
      || c === 0x093C                      /* nukta */
      || (c >= 0x093A && c <= 0x094C)      /* dependent vowel signs (matras) */
      || c === 0x094E || c === 0x094F
      || (c >= 0x0951 && c <= 0x0957)
      || (c >= 0x0962 && c <= 0x0963)
      || c === 0x200C || c === 0x200D;     /* ZWNJ / ZWJ */
}
/* Split a Devanagari word into orthographic clusters (aksharas): a base letter, plus any combining
   marks, plus (virama + the consonant it joins) for conjuncts. Hand-rolled rather than
   Intl.Segmenter because Indic conjunct clustering (InCB) is only in newer ICU and this has to
   behave identically in every browser the lesson ships to. */
function splitAksharas(word){
  const out = []; let cur = "", joinNext = false;
  for(const ch of [...(word || "")]){
    if(!cur){ cur = ch; continue; }
    if(joinNext){ cur += ch; joinNext = false; continue; }   /* the consonant after a virama */
    if(ch === _DEV_VIRAMA){ cur += ch; joinNext = true; continue; }
    if(_devIsMark(ch)){ cur += ch; continue; }
    out.push(cur); cur = ch;
  }
  if(cur) out.push(cur);
  return out;
}
/* Does this word carry the target sound as the BASE of some akshara? */
function wordHasSound(word, target){
  return splitAksharas(word).some(a => a[0] === target);
}
/* Word markup with ONLY the target marked. Runs of unmarked aksharas are emitted as one plain text
   node - fewer inline boundaries, fewer chances to disturb shaping.

   `bare` = mark the CONSONANT ALONE and leave its matra in the ink colour, i.e. क not का. Spiked
   before it was wired (SME round 4b): rendered in the real embedded Baloo 2 and MEASURED - काला,
   कौआ, काँव-काँव and करता। all come back with advance widths identical to the unwrapped word, and
   the capture confirms the colour lands on the consonant only. So a post-base matra (ा ी ो ौ) and
   a combining mark (ँ ं) BOTH separate cleanly, and the earlier blanket caution was too broad.
   What genuinely does NOT separate: a PRE-BASE matra (ि is stored after its consonant and drawn
   before it) and a virama conjunct - splitting either reorders or breaks the cluster. Those fall
   back to marking the whole cluster rather than rendering something wrong. */
function aksharaHTML(word, target, bare){
  let out = "", buf = "";
  for(const a of splitAksharas(word)){
    if(target && a[0] === target){
      if(buf){ out += buf; buf = ""; }
      const reorders = a.length > 1 && (a.indexOf("ि") >= 0 || a.indexOf(_DEV_VIRAMA) >= 0);
      out += (bare && !reorders)
        ? '<span class="tgt-akshara">' + a[0] + '</span>' + a.slice(1)
        : '<span class="tgt-akshara">' + a + '</span>';
    } else buf += a;
  }
  return out + buf;
}
/* Relative spoken length of one token, in akshara-beats. */
function _tokenWeight(t){
  let n = 0;
  for(const a of splitAksharas(t)){
    n += 1;
    if(/[\u093E\u0940\u0942\u0947\u0948\u094B\u094C]/.test(a)) n += 0.35;   /* aa ii uu e ai o au carry length */
  }
  return Math.max(1, n);
}
/* [S01r5h] HOW LONG A FEEDBACK SOUND OWNS THE SPEAKER.
   sfxCorrect/sfxWrongSoft/playSfx each ride their OWN Audio element, so play()'s stopAudio() cannot
   see them and a word started in the same breath sounds UNDER them. On the balloon page that is
   fatal to the word: sfx_wrong runs 0.73s and every wrong-answer clip has ~0.27s of leading silence
   and ~0.5s of speech, so the buzzer covered 80-100% of आम, घर, मछली and केला. The SME heard it as
   "the machli/aam/ghar sound is not coming properly" - the clips were fine, they were buried.
   Hold the word until the effect is done. Lengths come from the card (assets.audio_dur); an id the
   card does not carry falls back to a short, safe hold rather than guessing long. */
function _sfxHoldMs(){
  var map = (CARD && CARD.assets && CARD.assets.audio_dur) || {}, max = 0;
  for(var i = 0; i < arguments.length; i++){
    var id = arguments[i];
    if(!id) continue;
    var sec = map[id];
    max = Math.max(max, sec ? Math.round(sec * 1000) : 250);
  }
  return max ? max + 60 : 0;      /* a hair of air, so the two do not butt against each other */
}
/* [S01r5g] SIZE THE PER-CLIP SAFETY NET TO THE CLIP.
   The one-by-one option reveals advance on a fallback timer so a missing or blocked clip can never
   stall the page. That timer was a flat 4500ms, which silently assumes every clip is shorter than
   4.5s. Two of this lesson's question prompts are 5.05s ("ध्यान से सुनो — इस वाक्य में कौन-सी आवाज़
   बार-बार आई?" on G3, and P4's), so on those pages the net fired while the prompt was still
   speaking: the chain moved on, play() stopped the prompt mid-word and started the next clip over
   it. That is the "mix up of VO in the whole page" the SME reported on page 8.
   The build now writes each clip's real length to CARD.assets.audio_dur, so the net can be the
   clip's own length plus a margin. Unknown clip => the original 4500ms, unchanged. */
function _clipNetMs(src){
  var DEFAULT = 4500;
  if(!src) return DEFAULT;
  var t = String(src), q = Math.max(t.lastIndexOf("/"), t.lastIndexOf("\\")),
      base = t.slice(q + 1), dot = base.lastIndexOf(".");
  var id = dot > 0 ? base.slice(0, dot) : base;
  var map = CARD && CARD.assets && CARD.assets.audio_dur;
  var sec = map && map[id];
  if(!sec) return DEFAULT;
  return Math.max(DEFAULT, Math.round(sec * 1000) + 1500);   /* margin covers decode + a slow start */
}
/* [S01r5g] The GLOBAL backstop has to outlast the per-clip nets it is backing up, or raising one
   makes the other fire first and force-enable the page mid-narration. Sum the nets for the clips
   this chain will actually play, and keep the old flat value as a floor. */
function _chainNetMs(ids, floorMs){
  var total = 0;
  for(var i = 0; i < (ids || []).length; i++){
    total += _clipNetMs(ids[i] ? ("assets/Audio/" + ids[i] + ".x") : null) + 300;
  }
  return Math.max(floorMs || 16000, total + 2000);
}
/* [S01r5f] Tokenise a spoken line for the karaoke walk.
   Plain whitespace splitting glues an em-dash pair into ONE token, and a cue that names the word
   AFTER the dash then fires when the word BEFORE it starts. On the landing line the spoken script
   reads "...है। सुनो—काला कौआ...", so the hero word काला was cued at the onset of सुनो - about
   half a token early. Splitting after the dash makes each cue land on its own word. Where the cued
   word already STARTS its token ("चबाए—इन"), this changes nothing. */
function _voTokens(line){
  return String(line || "").replace(/([—–])/g, "$1 ").split(/\s+/).filter(Boolean);
}
/* [S01r5f] THE HIGHLIGHT RAN AHEAD OF THE VOICE, AND A PAUSE IS WHY.
   The walk below is proportional: it spreads the tokens across the clip in proportion to akshara
   weight. That assumes the voice speaks CONTINUOUSLY. It does not. vo_landing is 14.97s of which
   only 11.21s is speech — the rest is the pauses at its four dandas and its em-dash. Wall-clock
   keeps running through those pauses while the token walk keeps advancing, so the marking creeps
   ahead of the voice and finishes early; measured on that line the drift reaches ~2.4s by the end.
   The SME reported it as "the highlighting does not sync with the VO".
   The build now measures WHEN each clip is actually sounding (assets.audio_speech, written by
   speech_map() in the recipe) and the walk is driven by SPEECH elapsed instead of wall-clock:
   it advances while the voice sounds and HOLDS STILL through a pause. Within a run of speech the
   uniform-rate assumption survives, and there it is a good one.
   No map for this clip (unmeasurable container, or one unbroken run of speech) => `_speechFrac`
   returns null and the original wall-clock walk runs unchanged. */
function _speechSegsFor(src){
  if(!src) return null;
  var t = String(src), q = Math.max(t.lastIndexOf("/"), t.lastIndexOf("\\")),
      base = t.slice(q + 1), dot = base.lastIndexOf(".");
  var id = dot > 0 ? base.slice(0, dot) : base;
  var sp = CARD && CARD.assets && CARD.assets.audio_speech;
  return (sp && sp[id]) || null;
}
/* Fraction of the clip's TOTAL speech that has been heard by time `t` (seconds).
   Time inside a pause returns the fraction at the pause's start, so the walk parks there. */
function _speechFrac(segs, t){
  if(!segs || !segs.length) return null;
  var total = 0, i;
  for(i = 0; i < segs.length; i++) total += (segs[i][1] - segs[i][0]);
  if(total <= 0) return null;
  var acc = 0;
  for(i = 0; i < segs.length; i++){
    var s = segs[i][0], e = segs[i][1];
    if(t >= e){ acc += (e - s); continue; }
    if(t > s)  acc += (t - s);
    break;
  }
  return Math.min(1, acc / total);
}
/* Play `src` and call apply(i) as each token becomes the one being spoken.
   Anchored to the engine's own currentAudio, so stopAudio() and the generation guard still own the
   clip exactly as they do for every other beat. Falls back to a synthetic timeline when the clip is
   missing or its duration is unknown, so the animation still reads with placeholder/absent VO. */
function karaokePlay(src, tokens, apply, onDone){
  const w = (tokens || []).map(_tokenWeight);
  const tot = w.reduce((a, b) => a + b, 0) || 1;
  const segs = _speechSegsFor(src);       /* [S01r5f] when this clip is actually sounding */
  const FALLBACK_MS = 420 * tot;          /* ~one akshara-beat per 420ms when we cannot measure */
  const t0 = performance.now();
  let raf = 0, cur = -2, ended = false, finished = false;
  const stop = ()=>{ if(raf) cancelAnimationFrame(raf); raf = 0; };
  const finish = ()=>{ if(finished) return; finished = true; stop(); if(onDone) onDone(); };
  const tick = ()=>{
    const a = currentAudio;
    const dur = (a && isFinite(a.duration) && a.duration > 0) ? a.duration * 1000 : FALLBACK_MS;
    const el  = (a && a.currentTime > 0) ? a.currentTime * 1000 : (performance.now() - t0);
    /* [S01r5f] Prefer SPEECH-elapsed over wall-clock: a pause must not advance the marking.
       Only meaningful against the clip's own clock, so the synthetic fallback timeline (no audio,
       autoplay refused, capture tool) keeps the plain proportional walk it always had. */
    const sfrac = (segs && a && a.currentTime > 0) ? _speechFrac(segs, a.currentTime) : null;
    const frac = (sfrac === null) ? Math.min(1, el / dur) : sfrac;
    let acc = 0, k = 0;
    for(; k < w.length - 1; k++){ acc += w[k] / tot; if(frac < acc) break; }
    if(k !== cur){ cur = k; apply(k); }
    /* [S01r4m] A CLIP THAT NEVER PLAYED MUST NOT TRUNCATE THE WALK.
       play() reports "ended" 1.2s after an onerror, so a MISSING file ended this ticker while it was
       still on token 0 - and the caller's onDone ran, moving the flow on. Measured on the pi page:
       vo_t1_words.ogg does not exist yet (CHANGES row 46 is still generation-pending), so the mark
       beat lit ONLY the first word and left the other three navy. Same trap for an autoplay refusal,
       which also ends instantly and on every page's first beat.
       So "the clip ended" is no longer sufficient to stop: the walk also has to have REACHED the last
       token. With no audio, currentAudio is null and the tick already falls back to the synthetic
       420ms-per-akshara timeline, so the marking still reads - silently, but complete. When the clip
       DOES play, frac is ~1 by the time it ends, cur is already the last token, and this finishes
       exactly as before. */
    if(ended && cur >= w.length - 1){ finish(); return; }
    raf = requestAnimationFrame(tick);
  };
  play(src || null, ()=>{ ended = true;
    if(!tokens || !tokens.length || cur >= w.length - 1) finish(); });
  if(tokens && tokens.length) raf = requestAnimationFrame(tick);
  return stop;
}

/* [S01r4c] COLOURING *ONLY* THE CONSONANT — क, NOT का.
   r4b wrapped the bare consonant in its own span and the measured render came back unchanged: the
   whole का was still amber. The span was correct; the assumption was not. Chrome SHAPES DEVANAGARI
   ACROSS INLINE ELEMENT BOUNDARIES, so क and its ा still form one cluster, and the cluster paints in
   the style of the element that opens it. Identical advance widths — which r4b read as proof that
   the boundary was safe — were in fact the symptom: the browser had ignored the boundary entirely.
   Markup cannot solve this, because any boundary that WOULD split the cluster also breaks its
   rendering (a ZWNJ leaves an orphaned matra).

   So don't split the text — split the PAINT. Same two-layer trick the engine already uses to redden
   a matra in `_matraWordSVG`: draw the whole word, then draw the whole word again in the highlight
   colour, clipped to the x-range the target consonant occupies. Both layers contain identical text,
   so both shape identically and register exactly; only the paint is cut. */
const _COMB_SND = /[ऀ-ःऺ-ॏ॑-ॗॢॣ‌‍़]/;
let _sndCv = null, _sndCx = null;

/* x-ranges (in CSS px from the word's left edge) of every BARE occurrence of `target`.
   A cluster's consonant always starts at the cluster's own advance origin and runs for the
   consonant's advance — the matra is placed after it — so no ink analysis is needed here, unlike
   the matra case which has to hunt for the boundary. */
/* Where each bare occurrence of `target` SITS in the word: its x offset, in CSS px from the word's
   left edge. Offsets are advance sums, which is exactly how the shaper places the glyphs. */
function _soundOffsets(word, target, fontPx){
  if(!target) return [];
  _sndCx = _sndCx || (_sndCv = document.createElement("canvas")).getContext("2d");
  _sndCx.font = '800 ' + fontPx + 'px "Baloo 2","Noto Sans Devanagari",sans-serif';
  const ch = [...(word || "")], hits = [];
  let x = 0, i = 0;
  while(i < ch.length){
    let j = i + 1, joined = false;
    while(j < ch.length){
      if(_COMB_SND.test(ch[j])){ joined = (ch[j] === "\u094D"); j++; continue; }
      if(joined){ joined = false; j++; continue; }
      break;
    }
    const cluster = ch.slice(i, j).join("");
    /* only a PLAIN base takes the overlay: a conjunct (क् + …) has no separable letterform, so it
       would be a different glyph and must not be painted as if it were a standalone क */
    if(ch[i] === target && cluster.indexOf("\u094D") < 0) hits.push(x);
    x += _sndCx.measureText(cluster).width; i = j;
  }
  return hits;
}

/* How far the target letter's INK actually reaches, in CSS px from its own origin.
   The overlay holds only the letter, but a standalone Devanagari letter draws its shirorekha across
   its whole ADVANCE - right side bearing included - so an unclipped overlay lays an orange bar over
   the neighbour. In चार that bar reached across the ा and read, correctly, as "you are highlighting
   the AA matra". Clipping the overlay to its own ink stops the bar where the letter stops. Safe in a
   way the earlier whole-word clip was not: there is nothing in this element BUT the letter, so a clip
   here cannot catch a matra or a floating mark. */
function _soundInkW(target, fontPx){
  return _soundInkBox(target, fontPx).right;
}
/* The target letter's INK BOX in CSS px, relative to its own origin and baseline — measured by
   RASTERISING the letter and scanning the alpha channel, not by trusting TextMetrics.
   Why: measureText("च") reports actualBoundingBoxDescent = 1 at 48px, and the glyph plainly hangs
   further than that. A patch sized from those numbers cut the letter across the middle — orange on
   top, the navy original showing below. The same scan-the-pixels technique the engine already uses
   in _matraClipCols, for the same reason: the metrics lie, the raster does not. */
const _sndBoxCache = Object.create(null);
function _soundInkBox(target, fontPx){
  const key = target + "|" + Math.round(fontPx * 100);
  if(_sndBoxCache[key]) return _sndBoxCache[key];
  const font = '800 ' + fontPx + 'px "Baloo 2","Noto Sans Devanagari",sans-serif';
  const pad = Math.ceil(fontPx * 0.6), base = Math.ceil(fontPx * 1.5);
  const cv = document.createElement("canvas");
  cv.width = Math.ceil(fontPx * 3); cv.height = Math.ceil(fontPx * 2.6);
  const cx = cv.getContext("2d");
  cx.font = font; cx.textBaseline = "alphabetic"; cx.fillStyle = "#000";
  cx.clearRect(0, 0, cv.width, cv.height);
  cx.fillText(target, pad, base);
  const d = cx.getImageData(0, 0, cv.width, cv.height).data;
  let x0 = cv.width, x1 = -1, y0 = cv.height, y1 = -1;
  for(let y = 0; y < cv.height; y++){
    for(let x = 0; x < cv.width; x++){
      if(d[(y * cv.width + x) * 4 + 3] > 24){
        if(x < x0) x0 = x; if(x > x1) x1 = x;
        if(y < y0) y0 = y; if(y > y1) y1 = y;
      }
    }
  }
  cx.font = font;
  const box = (x1 < 0)
    ? { left: 0, right: cx.measureText(target).width, asc: fontPx * 0.8, desc: 0 }
    : { left: x0 - pad, right: x1 - pad + 1, asc: base - y0, desc: y1 - base + 1 };
  _sndBoxCache[key] = box;
  return box;
}

/* One word, layered: the word itself, plus a copy of JUST THE LETTER laid over each occurrence.

   Two earlier attempts painted more than the letter, and the reason is the same both times — they
   tried to CUT a rectangle out of the whole word, and the letter is not a rectangle:
     · clipping at the consonant's ADVANCE swept in the stretch of headline that bridges the gap to
       the matra, so an orange bar hung past the क with nothing under it;
     · clipping at its INK fixed that, but a full-height cut still caught anything FLOATING ABOVE the
       letter's column — measured: 1078 orange px on कौआ's ौ arm, 919 on काँव's ँ.
   So stop cutting. The overlay is now the letter and nothing else, positioned at the letter's own
   offset: the matra and the candrabindu are not in the overlay's text at all, so no geometry can
   accidentally include them. A leading consonant with a post-base matra renders the same glyph
   standalone as it does in the word, which is what makes the two register. */
function soundWordHTML(word, target, fontPx){
  const esc = (s)=> String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const hits = _soundOffsets(word, target, fontPx);
  const box  = _soundInkBox(target, fontPx);
  /* [S01r4j] COVER THE LEFT SIDE BEARING. The glyph's ink starts at box.left, which is NEGATIVE for
     च (-2px at 48px) — the stroke reaches back past the text origin. Clipping from 0 therefore shaved
     that sliver off the overlay and left the navy base showing through as a nub on the left end of
     the headline bar: measured 132 navy px in a 4px band left of the orange, on चार at 8x.
     Shift the box left by the bearing plus a hairline for the base's antialiasing, pad it back by the
     same amount so the glyph still sits on its own origin, and widen the clip to match. Extending
     LEFT is safe: the overlay's text is the target letter alone, so the only ink that can be revealed
     out there is the target's own — never the preceding glyph's. */
  const lead = Math.max(0, -box.left) + Math.max(0.5, fontPx * 0.02);
  const w = lead + box.right;
  return '<span class="sw-base">' + esc(word) + '</span>'
    + hits.map(x => '<span class="sw-lit" data-ch="' + esc(target) + '" aria-hidden="true" style="left:'
        + (x - lead).toFixed(2) + 'px;padding-left:' + lead.toFixed(2)
        + 'px;clip-path:inset(-0.5em calc(100% - ' + w.toFixed(2) + 'px) -0.5em 0)">'
        + esc(target) + '</span>').join("");
}

/* [S01r4h] DEAD — no longer called; kept only so the reasoning below stays on the record.
   Superseded by the nested .sound-layered form (see the SENTENCE_SOUND chip setup). Do NOT rewire
   this: positioning the overlay against the chip is what put the orange letter ~9px off the navy
   one, and no amount of offset arithmetic fixes two boxes with different half-leading.
   Lay the letter-overlay over a sentence chip whose .sw-text has ALREADY been fitted and centred.
   Reads the fitted font and the centring transform off the glyph span and copies both, so the
   overlay tracks whatever centerInkGlyph decided — including its per-word shrink. */
function layerSoundOnChip(chip){
  const word = chip.dataset.swWord, target = chip.dataset.swTarget;
  const t = chip.querySelector(".sw-text");
  if(!t || !word || !target) return;
  chip.querySelectorAll(":scope > .sw-lit").forEach(e => e.remove());
  const cs = getComputedStyle(t);
  const fs = parseFloat(cs.fontSize);
  if(!fs) return;
  const offs = _soundOffsets(word, target, fs);
  if(!offs.length) return;
  /* Align to where the base text is ACTUALLY PAINTED, not to its layout offset.
     offsetTop on an inline element is the top of its line box, and centerInkGlyph then shifts the
     glyph with a translateY on top of that — so positioning at offsetTop AND re-applying the same
     transform double-counted the shift and left the overlay ~1px low. At 48px bold that is a visible
     navy fringe along the top of the orange letter: reported as the highlight "overlapping".
     getBoundingClientRect already includes the transform, so read the painted box and copy NO
     transform. Divide by --scale because the stage is transform-scaled; subtract the chip's border
     because an absolutely-positioned child is placed against the PADDING box. */
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  const tr = t.getBoundingClientRect(), cr = chip.getBoundingClientRect();
  if(tr.height < 2) return;                       // not laid out yet — a later refresh will catch it
  const L = (tr.left - cr.left) / scale - chip.clientLeft;
  /* ALIGN BASELINES, NOT TOPS. The base .sw-text and the overlay are different heights — the base's
     box runs to the font's full line metrics (76.8px at fs 48) while the overlay is sized by its
     line-height (52.8px). Matching their TOP edges therefore misaligns their BASELINES by the
     difference, putting the overlay ~12px high: measured at 8x on चार, the base glyph's ink occupies
     rows 198-440 while the orange only reached 102-343 — the bottom of the च left navy. THAT is the
     "highlight is cut / still overlapping" report; it was never the clip height (च's real descent is
     1px, and the rasteriser and TextMetrics agree on that).
     So measure the base's baseline directly with a throwaway zero-size probe — an empty span adds
     nothing to textContent, so centerInkGlyph's measurement is untouched, and it is removed at once —
     then place each overlay by its OWN measured baseline below. */
  const bprobe = document.createElement("span");
  bprobe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline;";
  t.appendChild(bprobe);
  const bpR = bprobe.getBoundingClientRect();
  t.removeChild(bprobe);
  const baseY = (bpR.top - cr.top) / scale - chip.clientTop;   // base text's baseline, chip coords
  /* STOP RELYING ON REGISTRATION. Two copies of the same glyph, positioned by different mechanisms
     (the base flows inline, the overlay is absolutely placed), do not land on the same sub-pixel -
     and a bold 48px letter offset by ~1px shows the one underneath as a full navy outline. Measured
     at 8x on चार: 8483 navy pixels INSIDE the orange letter. No amount of arithmetic makes two
     independently-rasterised glyphs identical.
     So hide the one underneath: the overlay carries the chip's OWN background colour, clipped to the
     target letter's ink box (plus a hairline bleed for the base's antialiasing). Nothing navy is left
     to peek out, and a sub-pixel offset stops mattering entirely.
     The patch is the LETTER'S ink box - not a tall band - so a matra above or below it is never
     covered: चूहे's ू sits under the baseline, outside the च's box, and stays navy. */
  const box = _soundInkBox(target, fs);
  const bg = getComputedStyle(chip).backgroundColor;
  const BLEED = Math.max(1, fs * 0.03);
  offs.forEach(x => {
    const o = document.createElement("span");
    o.className = "sw-lit"; o.dataset.ch = target;
    o.setAttribute("aria-hidden", "true");
    o.textContent = target;
    o.style.left = (L + x - BLEED) + "px";
    o.style.top = "0px";                          // provisional — corrected to the baseline below
    o.style.fontFamily = cs.fontFamily; o.style.fontSize = cs.fontSize;
    o.style.fontWeight = cs.fontWeight; o.style.lineHeight = cs.lineHeight;
    if(bg && bg !== "transparent" && bg.replace(/\s/g, "") !== "rgba(0,0,0,0)") o.style.backgroundColor = bg;
    /* Pad the box on the LEFT and shift it back by the same amount: the glyph still lands on its own
       origin, but the patch now extends past the base letter's left side-bearing and antialiasing.
       Without this the base's left edge survived as a hairline (measured: 174 px at 8x). */
    o.style.paddingLeft = BLEED.toFixed(2) + "px";
    chip.appendChild(o);
    /* the baseline inside the overlay, measured the same way centerInkGlyph does it */
    const probe = document.createElement("span");
    probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline;";
    o.appendChild(probe);
    const oR = o.getBoundingClientRect(), pR = probe.getBoundingClientRect();
    o.removeChild(probe);
    const scl = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
    const baseFromTop = (pR.top - oR.top) / scl;
    /* drop the overlay so ITS baseline sits on the base text's baseline */
    o.style.top = (baseY - baseFromTop).toFixed(2) + "px";
    const top = Math.max(0, baseFromTop - box.asc - BLEED);
    const bottom = baseFromTop + box.desc + BLEED;
    /* the glyph origin now sits BLEED in from the box's left edge, so the ink's right edge is at
       BLEED + box.right; add one more BLEED to clear the base's antialiasing on that side too */
    o.style.clipPath = "inset(" + top.toFixed(2) + "px calc(100% - "
      + (BLEED * 2 + box.right).toFixed(2) + "px) calc(100% - " + bottom.toFixed(2) + "px) 0)";
  });
}
function refreshSoundChips(root){
  /* [S01r4h] The chips are layered in place now, so this is the job refreshSoundWords already
     does for the landing: re-cut every layered word from its LIVE computed size, after the fit and
     the centring have run. Kept under its own name because the mount path calls it by that name,
     and because the root scope matters — an unscoped refreshSoundWords() would also re-cut the
     landing hero on every slide mount. */
  refreshSoundWords(root || document);
}

/* Re-lay every layered word from the LIVE element, and never from an assumed size.
   Two ways the offsets go wrong if this is skipped:
     · the web font has not loaded yet, so canvas metrics are the fallback font's;
     · the size in the card does not match the size on screen. Measured: the teach sentence's
       .sw-text computes to 20px inside the tutorial card, not the 60px its base rule declares, so
       hardcoding 60 put every overlay at 3x its true offset — invisible on a word whose target sits
       at offset 0, and badly wrong on any other.
   Reading getComputedStyle here makes both impossible: the size used to place the overlay is by
   definition the size it is drawn at. */
function refreshSoundWords(root){
  (root || document).querySelectorAll("[data-sw-word]").forEach(el=>{
    const fs = parseFloat(getComputedStyle(el).fontSize) || parseFloat(el.dataset.swFs) || 52;
    el.innerHTML = soundWordHTML(el.dataset.swWord, el.dataset.swTarget, fs);
  });
}
try{ if(document.fonts && document.fonts.ready) document.fonts.ready.then(()=> refreshSoundWords()); }catch(e){}

/* ---------- 12. SLIDE MODULES ---------- */
const SlideModules = {
  INTRO: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "intro-stage";
      // [20a INTRO-PICS] additive PICTURE mode (g2 deck: demo with pictures, speak each word
      // one-by-one) — gated on data.pics [{img,emoji,audio},...]; letters mode untouched.
      const pics = Array.isArray(slide.data.pics) && slide.data.pics.length ? slide.data.pics : null;
      const items = pics || slide.data.letters;
      const clipOf = i => pics ? (pics[i].audio || null)
                               : ((slide.data.phonemes && slide.data.phonemes[items[i]]) || null);
      const keyOf  = i => pics ? (pics[i].img || String(i)) : items[i];
      const tapped = new Set();
      let _autoDone = false;   // [24a A3] auto mode: flips true once every card has been taught → taps become replays
      const tiles = [];
      // [16f] Size tiles to the REAL container (tut-card frame ~990px inside). Fit one row at
      // MAXW=960; below the 110px touch floor, WRAP into two balanced rows. Pics may run larger.
      const GAP = 20, MAXW = 960, n = items.length;
      let rowsOf;
      const CAP = pics ? 250 : 184;
      /* [31f] THE SIZER WAS WIDTH-ONLY, so a wrapped grid overlapped the heading. On wrap it
         re-expanded tiles back toward CAP (4 of 8 letters fit the row at 184px), building a 392px
         grid inside the 318px .tut-content box. That box centres its overflow, so half of it (37px
         layout, 28px on screen at the 0.757 fit-scale) rode UP and the prompt sat behind the
         letters. Yasir caught it on HIKGH04_L01_S02 P1; measured on P2 too. 8 and 9 letters wrap,
         5 and 6 do not — which is why only two of the four parts showed it.
         Row COUNT still comes from width alone (unchanged behaviour); only the SIZE is clamped by
         the real available height. TOUCH is the floor: below it a tile stops being a reliable
         KG-sized target, so a genuinely too-short viewport overflows rather than shrink past it. */
      const TOUCH = 110;
      /* ROWGAP is the gap BETWEEN the two rows and it is NOT GAP. GAP=20 is the in-row gap this
         function writes onto each .intro-letters; the row gap comes from CSS, `.intro-stage{gap:24px}`.
         Using GAP for both left the grid 4px taller than computed and the heading still 2px behind
         the letters — the same width-only carelessness this fix exists to remove, one level down.
         Keep this in step with style.css if that rule ever changes. */
      const ROWGAP = 24;
      const availH = (host && host.clientHeight) || 318;   // 0 while a phase-gate blur hides the card
      const fitW = k => Math.floor((MAXW - (k-1)*GAP) / k);
      let tSize = Math.min(CAP, fitW(n));
      if (tSize >= TOUCH) {
        rowsOf = [n];
        tSize = Math.max(TOUCH, Math.min(tSize, availH));
      } else {
        const top = Math.ceil(n/2), bot = n - top;
        rowsOf = [top, bot];
        tSize = Math.max(TOUCH, Math.min(CAP, fitW(top), Math.floor((availH - ROWGAP) / 2)));
      }
      const tFont = Math.round(tSize * 0.565);
      const rowEls = rowsOf.map(() => {
        const r = document.createElement("div"); r.className = "intro-letters";
        r.style.gap = GAP + "px"; return r;
      });
      const rowFor = i => (rowsOf.length === 1 || i < rowsOf[0]) ? rowEls[0] : rowEls[1];
      function nudgeNext(){
        for(let i=0;i<items.length;i++){
          if(!tapped.has(keyOf(i))){ pointNudgeAt(tiles[i]); return; }
        }
        stopNudge();
      }
      items.forEach((it, i) => {
        const tile = document.createElement("div");
        tile.className = pics ? "intro-letter intro-pic" : "intro-letter";
        tile.style.width = tile.style.height = tSize + "px";
        if(!pics) tile.style.fontSize = tFont + "px";
        /* [32c] LETTER **WITH** ITS PICTURE. The pics branch was a hard either/or — a tile could show
           the art or the glyph, never both — so a teach slide that names the letter beside its primer
           word was not expressible at all. HIKGH04_L01_S01's round-2 SME deck asks for exactly that on
           T1 ("Add letters with image": अनार-अ, आम-आ, इमली-इ, ईख-ई, उल्लू-उ, ऊँट-ऊ). Gated on the cell
           carrying a `letter`, so every existing pics/letters INTRO renders byte-identically. */
        tile.innerHTML = pics
          ? (imgOrEmoji(it.img, it.emoji, "intro-pic-img", "intro-pic-emoji")
             + (it.letter ? `<span class="intro-pic-letter ink-glyph">${it.letter}</span>` : ""))
          : `<span class="ink-glyph">${it}</span>`;
        if(pics && it.letter) tile.classList.add("has-letter");
        tile.onclick = ()=>{
          // [24a A3] auto walk-through: card taps are IGNORED until every card has been taught
          // (the child can't cut the lesson off / jump ahead mid-teaching); once teaching completes,
          // a tap REPLAYS that card (vachan NUMBER_INTRO parity — tap-to-replay unlocks after teach).
          if(slide.data.auto){
            if(!_autoDone) return;
            tile.classList.add("played");
            const clip = clipOf(i);
            play(clip ? "assets/Audio/" + clip + "." + AUDIO_EXT : null);
            SwiftPAL.emit(pics ? "intro_pic_tap" : "intro_letter_tap", { slide_id: slide.id, letter: keyOf(i), replay: true });
            return;
          }
          tile.classList.add("played");
          const clip = clipOf(i);
          play(clip ? "assets/Audio/" + clip + "." + AUDIO_EXT : null);
          SwiftPAL.emit(pics ? "intro_pic_tap" : "intro_letter_tap", { slide_id: slide.id, letter: keyOf(i) });
          tapped.add(keyOf(i));
          if(tapped.size >= items.length){ stopNudge(); setNavActive(true); }
          else { nudgeNext(); }
        };
        rowFor(i).appendChild(tile); tiles.push(tile);
      });
      rowEls.forEach(r => wrap.appendChild(r));
      host.appendChild(wrap);

      setNavActive(false);
      $("navBtn").onclick = ()=>{ if(tapped.size >= items.length) completeSlide(true); };
      nudgeNext();
      // [16h] Phase-1 autonomous mode: tiles highlight + speak one by one BY THEMSELVES.
      if(slide.data.auto){
        stopNudge(); state.ownsAudio = true;
        let ai = 0;
        const aStep = ()=>{
          if(CARD.slides[state.idx] !== slide) return;
          if(ai >= items.length){ stopNudge();
            // [20a INTRO-AUDIO-FIX] the auto chain DROPPED the instruction VO (Yasir live catch #7,
            // verified on HIKGH02_L02_S01) — play it after the self-play, before आगे unlocks.
            // A missing clip falls back to a silent beat and still unlocks.
            play(audioFor(slide, "instruction") || null, ()=>{
              if(CARD.slides[state.idx] !== slide) return;
              _autoDone = true;   // [24a A3] teaching complete → card taps become per-card replays
              state.replayAudio = ()=> play(audioFor(slide, "prompt") || audioFor(slide, "instruction") || null, ()=>{});   // [24a N8] chip replays post-teach
              $("navBtn").onclick = ()=> completeSlide(true); setNavActive(true);
            });
            return; }
          const tile = tiles[ai];
          tile.classList.add("played"); pointNudgeAt(tile);
          const clip = clipOf(ai);
          ai++;
          play(clip ? "assets/Audio/" + clip + "." + AUDIO_EXT : null, ()=> setTimeout(aStep, 380));
        };
        play(audioFor(slide, "prompt") || null, ()=> setTimeout(aStep, 500));
      }   // start by guiding the first tile
    }
  },

  MEET_LETTER: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "meet-stage";
      // 16L: fit the glyph to the box (MEET here shows whole WORDS like काम, not single letters →
      // 200px overflowed the 300px box). Size by cluster count.
      // data.matra = the matra char (e.g. "ा"). For RIGHT-SPACING matras we now colour it RED
      // INSIDE the word itself (_matraWordSVG two-layer overlay); other matras keep the callout.
      const _mlFit = (s)=>{ const n=[...(s||"")].length; return n<=1?200 : n<=2?152 : n<=3?120 : n<=4?96 : 78; };
      /* [32c] fsOverride: the glyph size is written INLINE here, so no stylesheet rule can reach it —
         a two-up `pair` row therefore carried two 200px glyphs and could not be made to fit the
         tutorial card from CSS (measured: 210px tall each, which is what pushed .tut-card past the
         stage). The pair path now asks for a compact size; every single-letter caller is unchanged. */
      const _box = (txt, matra, fsOverride)=> {
        const iw = matra && RIGHT_SPACING_MATRAS.has(matra);
        const fs = fsOverride || _mlFit(txt);
        return `<div class="meet-letter-box"${iw ? ` data-mw-word="${txt}" data-mw-matra="${matra}" data-mw-fs="${fs}"` : ""}>`
          + (iw ? _matraWordSVG(txt, matra, fs)
                : `<span class="glyph ink-glyph" style="font-size:${fs}px">${txt}</span>`)
          + `</div>`;
      };
      if(slide.data.pair){
        const pair = document.createElement("div"); pair.className = "meet-pair";
        // two-up (or wider) rows get the compact glyph; a 1-item pair keeps the full 200px.
        const _pairFs = slide.data.pair.length > 1 ? 104 : null;
        slide.data.pair.forEach(p => {
          const item = document.createElement("div"); item.className = "meet-pair-item";
          item.innerHTML = `
            ${_box(p.letter, null, _pairFs)}
            
            <div class="meet-pic-box">
              ${imgOrEmoji(p.picture_img, p.picture_emoji, "pic-img", "pic-emoji")}
              <span class="pic-label">${p.word_hi}</span>
            </div>`;
          pair.appendChild(item);
        });
        wrap.appendChild(pair);
      } else {
        wrap.innerHTML = `
          ${_box(slide.data.letter, slide.data.matra)}
          
          <div class="meet-pic-box">
            ${imgOrEmoji(slide.data.picture_img, slide.data.picture_emoji, "pic-img", "pic-emoji")}
            <span class="pic-label">${slide.data.word_hi}</span>
          </div>`;
      }
      // Right-spacing matras (ा …) are now coloured RED in-word by _box → no callout needed.
      // Other matras (े ै ि …) can't be recoloured in-word, so keep the coloured ◌<matra> callout.
      if(slide.data.matra && !RIGHT_SPACING_MATRAS.has(slide.data.matra)){
        const col = document.createElement("div"); col.className = "meet-col";
        col.appendChild(wrap);
        const mh = document.createElement("div"); mh.className = "matra-hint";
        mh.innerHTML = `इस शब्द की मात्रा — <span class="matra-hl ink-glyph">◌${slide.data.matra}</span>`;
        col.appendChild(mh);
        host.appendChild(col);
      } else {
        host.appendChild(wrap);
      }
      if(slide.data.reveal_flow){
        /* [S01r4] VO-SYNCED REVEAL (SME "Recommended Animation Flow" on all three MEET_LETTER pages):
             letter appears -> VO explains -> letter lights up -> picture appears -> label appears
             -> the target akshara inside the label lights up.
           The deck asks for the letter to light "exactly in sync with the word <x> in the VO", and
           these pages have ONE clip, not one per beat. So the cues are anchored to WORDS OF THE SPOKEN
           LINE: the line is read from CARD.assets.audio_text (shown==spoken, so it IS the script) and
           karaokePlay reports which word is being spoken; a cue fires when its word is reached.
           Proportional, not force-aligned - see OPEN-6 in CHANGES.md.
           Absent => the legacy d.auto demo below runs exactly as before. */
        const rf  = slide.data.reveal_flow;
        state.ownsAudio = true; state.demoRunning = true; setNavActive(false); setSwMood("teach");
        const boxEl = host.querySelector(".meet-letter-box");
        const picEl = host.querySelector(".meet-pic-box");
        const lblEl = host.querySelector(".pic-label");
        const imgEl = picEl && picEl.querySelector(".pic-img, .pic-emoji");
        if(picEl) picEl.classList.add("seq-hidden");        /* same shared class as every other reveal */
        if(lblEl) lblEl.classList.add("seq-hidden");

        const lit = ()=>{ if(!boxEl) return; boxEl.classList.remove("ml-lit");
          void boxEl.offsetWidth; boxEl.classList.add("ml-lit"); };      /* restart the pulse */
        const act = {
          letter: lit,
          pic:    ()=>{ if(picEl){ picEl.classList.remove("seq-hidden"); picEl.classList.add("ml-in"); } },
          label:  ()=>{ if(lblEl){ lblEl.classList.remove("seq-hidden"); lblEl.classList.add("ml-in"); } },
          /* "highlight 'म' in 'मूली' again to reinforce the sound-letter connection" */
          mark:   ()=>{ lit(); if(lblEl) lblEl.classList.add("ml-marked"); }
        };
        /* [S01r4k] THE LABEL MARKS THE BARE CONSONANT, NOT THE WHOLE AKSHARA. aksharaHTML wraps the
           cluster — च AND its ू — so चूहा came up with the matra coloured too; the ask is the letter
           and nothing else. aksharaHTML's own `bare` flag is NOT the answer: it splits the span
           between the consonant and its matra, and Chrome shapes a Devanagari cluster ACROSS inline
           boundaries and paints the whole thing in the opening element's colour, which is the bug
           this page started from. Use the same layered form the cover and the sentence chips use —
           the word once as .sw-base, the letter again on top as .sw-lit — where the overlay's text is
           the consonant ALONE, so no matra can be caught by it. refreshSoundWords re-cuts any
           [data-sw-word] from its live font size, so the label is picked up with the rest. */
        if(lblEl){
          const _w = slide.data.word_hi || "", _t = slide.data.letter || "";
          if(_w && _t && wordHasSound(_w, _t)){
            lblEl.classList.add("sound-layered");
            lblEl.dataset.swWord = _w;
            lblEl.dataset.swTarget = _t;
            lblEl.innerHTML = soundWordHTML(_w, _t,
                                parseFloat(getComputedStyle(lblEl).fontSize) || 36);
          } else {
            lblEl.innerHTML = aksharaHTML(_w, _t);   // conjunct/absent: leave the old path alone
          }
        }

        const line = (CARD.assets && CARD.assets.audio_text &&
                      CARD.assets.audio_text[(slide.audio || {}).prompt]) || "";
        const toks = line ? _voTokens(line) : [];
        /* resolve each cue to a token index, scanning forward so a repeated word maps in order */
        const cues = []; let from = 0;
        (rf.cues || []).forEach(c => {
          let k = -1;
          for(let j = from; j < toks.length; j++){ if(toks[j].indexOf(c.at) >= 0){ k = j; break; } }
          if(k < 0) k = Math.min(from, Math.max(0, toks.length - 1));
          cues.push({ k, do: c.do }); from = k + 1;
        });
        const fired = new Set();
        const alive = ()=> CARD.slides[state.idx] === slide;
        let done = false;
        /* [S01r5j] BEATS THAT WAIT FOR THE WHOLE LINE. The SME: "whenever an image comes ... it will
           come AFTER the vo is done - 'च से चूहा' then the mouse image comes". The example word ENDS
           the spoken line, so no token cue can express "after it": anchoring the picture to चूहा
           would land it ON the word, not after. These run off the clip's end instead, staggered so
           the picture, its label and the letter-mark read as three beats rather than one jump. */
        const afterLine = (rf.after_line || []).slice();
        const runAfter = (i)=>{
          if(!alive() || i >= afterLine.length) return;
          (act[afterLine[i]] || (()=>{}))();
          setTimeout(()=> runAfter(i + 1), 520);
        };
        const finish = ()=>{ if(done) return; done = true;
          /* anything the clip never reached still has to happen - a stalled clip must not leave the
             picture hidden forever (that is a blank teach slide, and it is invisible to every gate) */
          cues.forEach(c => { if(!fired.has(c)) { fired.add(c); (act[c.do] || (()=>{}))(); } });
          runAfter(0);
          state.demoRunning = false; setNavActive(true); $("navBtn").onclick = ()=> completeSlide(true); };

        const src = audioFor(slide, "prompt") || audioFor(slide, "word_name") || null;
        if(toks.length){
          karaokePlay(src, toks, (k)=>{
            cues.forEach(c => { if(!fired.has(c) && k >= c.k){ fired.add(c); (act[c.do] || (()=>{}))(); } });
          }, ()=>{ if(alive()) finish(); });
        } else {
          /* no script on record (VO not yet written) - still run the beats, evenly spaced */
          let i = 0;
          const tickCue = ()=>{ if(!alive() || i >= cues.length){ finish(); return; }
            const c = cues[i++]; fired.add(c); (act[c.do] || (()=>{}))(); setTimeout(tickCue, 1100); };
          play(src, ()=>{}); setTimeout(tickCue, 500);
        }
        state.replayAudio = ()=> play(src, ()=>{});
        $("navBtn").onclick = ()=> completeSlide(true);
        setTimeout(()=>{ if(alive()) finish(); }, 22000);      /* FAIL-SAFE: आगे never stays dead */
        return;
      }
      // 16m: AUTONOMOUS demo (data.auto) — the 3-phase contract kills passive show-and-tell
      // ("यह काम है"). The hand POINTS at the word + speaks it, then POINTS at the matra callout +
      // speaks its sound (the matra being pointed/spoken is the feasible "highlight the matra"),
      // then the picture; आगे is locked till the demo finishes, then explicitly wired (dead-button).
      if(slide.data.auto){
        state.ownsAudio = true; state.demoRunning = true; setNavActive(false); setSwMood("teach");   // [24a N8]
        const boxEl = host.querySelector(".meet-letter-box");
        const pillEl = host.querySelector(".matra-hl");   // exists only in the callout (non-right-spacing) path
        const picEl = host.querySelector(".meet-pic-box");
        const steps = [];
        if(boxEl) steps.push([boxEl, audioFor(slide, "prompt") || audioFor(slide, "word_name")]);
        if(slide.data.matra){
          // point at the matra + speak its sound. In-word (red) matra → point the word box and
          // PULSE the red matra; callout matra → point the ◌<matra> pill (old behaviour).
          const mAudio = slide.data.matra_audio ? "assets/Audio/" + slide.data.matra_audio + "." + AUDIO_EXT : null;
          steps.push([pillEl || boxEl, mAudio, pillEl ? null : "matra"]);
        }
        if(picEl) steps.push([picEl, audioFor(slide, "word_name")]);
        let si = 0, _done = false;
        const finish = ()=>{ if(_done) return; _done = true; stopNudge(); state.demoRunning = false; $("navBtn").onclick = ()=> completeSlide(true); setNavActive(true); };
        const step = ()=>{
          if(CARD.slides[state.idx] !== slide) return;                 // navigated away → abort
          if(si >= steps.length){ finish(); return; }
          /* [28p] TWO OF YASIR'S FOUR MEET_LETTER ASKS (2026-07-28, कप + जल screenshots).
             ARROW: the literal "→" between the letter box and the picture was markup inside this module,
             so no card could ever remove it. Gone from both MEET_LETTER paths. MEET_SHAPE / MEET_NUMBER /
             MEET_GENDER keep theirs — he named MEET_LETTER.
             HAND: the demo planted the hand on the letter box and then the picture; on a slide with one
             letter and one picture that "points at the obvious and adds nothing". Dropped. The one place
             it earns its keep is a word taught for BOTH sounds (जल = ज + ल), synced to whichever glyph is
             being spoken — that depends on displaying both letters, which is STILL OPEN, so no
             "is this two-letter" condition is guessed at here. */
          const stp = steps[si]; si++;
          const mw = stp[2] === "matra" ? stp[0].querySelector(".matra-word") : null;
          if(mw) mw.classList.add("mw-pulse");
          play(stp[1] || null, ()=>{ if(mw) mw.classList.remove("mw-pulse"); setTimeout(step, 450); });
        };
        $("navBtn").onclick = ()=> completeSlide(true);                 // explicit (dead-button lesson)
        state.replayAudio = ()=> play(audioFor(slide, "prompt") || null, ()=>{});
        setTimeout(step, 400);
        setTimeout(()=>{ if(CARD.slides[state.idx] === slide) finish(); }, steps.length * 4000 + 3000);   // FAIL-SAFE: आगे never stays dead if audio blocks/stalls
        return;
      }
      // नav unlocks only after the VO has played once (students can't skip the model)
      state.gateNavUntilAudio = true;
      setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  /* ===== SHAPES (maths) — reuse the same scaffold/nudge/feedback as letters ===== */
  SHAPE_INTRO: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "intro-stage";
      const row  = document.createElement("div"); row.className = "intro-shapes";
      const shapes = slide.data.shapes; const tapped = new Set(); const tiles = [];
      let _autoDone = false;   // [31g] flips true once every shape has been taught -> taps become replays
      const GAP = 28, MAXW = 1220, n = shapes.length;
      const tSize = Math.max(120, Math.min(184, Math.floor((MAXW - (n-1)*GAP) / n)));
      row.style.gap = GAP + "px";
      function nudgeNext(){
        for(let i=0;i<shapes.length;i++){ if(!tapped.has(i)){ pointNudgeAt(tiles[i]); return; } }
        stopNudge();
      }
      shapes.forEach((sh, i) => {
        const tile = document.createElement("div"); tile.className = "intro-shape";
        tile.style.width = tile.style.height = tSize + "px";
        // name label (revealed on tap — child hears the name AND sees it on top of the shape)
        tile.innerHTML = `<span class="shape-name">${sh.name || ""}</span>` +
                         shapeSVG(sh.shape, {color: sh.color, size: Math.round(tSize*0.62), rotate: sh.rotate});
        tile.onclick = ()=>{
          /* [31g] auto mode mirrors INTRO: taps are IGNORED until every shape has been taught, then
             a tap REPLAYS that shape. The child cannot cut the lesson off or race ahead. */
          if(slide.data.auto){
            if(!_autoDone) return;
            tile.classList.add("played");
            play(sh.name_audio ? "assets/Audio/" + sh.name_audio + "." + AUDIO_EXT : null);
            SwiftPAL.emit("intro_shape_tap", { slide_id: slide.id, shape: sh.shape, replay: true });
            return;
          }
          tile.classList.add("played");
          play(sh.name_audio ? "assets/Audio/" + sh.name_audio + "." + AUDIO_EXT : null);
          SwiftPAL.emit("intro_shape_tap", { slide_id: slide.id, shape: sh.shape });
          tapped.add(i);
          if(tapped.size >= shapes.length){ stopNudge(); setNavActive(true); }
          else { nudgeNext(); }
        };
        row.appendChild(tile); tiles.push(tile);
      });
      wrap.appendChild(row); host.appendChild(wrap);
      setNavActive(false);
      $("navBtn").onclick = ()=>{ if(tapped.size >= shapes.length) completeSlide(true); };
      nudgeNext();
      /* [31g] AUTONOMOUS TEACHING — Yasir 2026-08-01: "tutorial/teaching should be completely
         autonomous, complete teaching without kid interacting." SHAPE_INTRO was the last teaching
         mechanic with NO auto path at all: it unlocked आगे only at tapped.size >= shapes.length, so
         the child was held hostage by the lesson. This is INTRO's [16h] chain, shape-for-letter.
         A missing clip is a silent beat that still advances the chain (play() fires its callback on
         both the no-src and the error path), so an un-recorded build teaches itself and unlocks
         rather than stalling on a dead screen. */
      if(slide.data.auto){
        stopNudge(); state.ownsAudio = true;
        let ai = 0;
        const aStep = ()=>{
          if(CARD.slides[state.idx] !== slide) return;
          if(ai >= shapes.length){
            stopNudge();
            play(audioFor(slide, "instruction") || null, ()=>{
              if(CARD.slides[state.idx] !== slide) return;
              _autoDone = true;
              state.replayAudio = ()=> play(audioFor(slide, "prompt") || audioFor(slide, "instruction") || null, ()=>{});
              $("navBtn").onclick = ()=> completeSlide(true); setNavActive(true);
            });
            return;
          }
          const tile = tiles[ai];
          tile.classList.add("played"); pointNudgeAt(tile);
          const clip = shapes[ai].name_audio;
          ai++;
          play(clip ? "assets/Audio/" + clip + "." + AUDIO_EXT : null, ()=> setTimeout(aStep, 380));
        };
        play(audioFor(slide, "prompt") || null, ()=> setTimeout(aStep, 500));
      }
    }
  },

  MEET_SHAPE: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "meet-stage";
      wrap.innerHTML = `
        <div class="meet-shape-box">
          ${shapeSVG(slide.data.shape, {color: slide.data.color, size: 190, rotate: slide.data.rotate})}
          <span class="label">${slide.data.name}</span>
        </div>
        <div class="meet-arrow">→</div>
        <div class="meet-pic-box">
          ${imgOrEmoji(slide.data.object_img, slide.data.object_emoji, "pic-img", "pic-emoji")}
          <span class="pic-label">${slide.data.object_hi}</span>
        </div>`;
      host.appendChild(wrap);
      state.gateNavUntilAudio = true; setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  TRACE_SHAPE: {
    // [21c flag#2] PRODUCE gesture (re-adds the game's original trace, breaks pick-dominance): the child
    // FINGER-TRACES the named shape's outline — not a pick. Forgiving hit-corridor; ~80% of the outline
    // covered → success + side-confetti. Idle → a marker animates along the stroke to demonstrate. Shape
    // is UPRIGHT with SHARP corners (rotate forced 0, no rx — honours the locked 2D-shapes direction) and
    // a FIXED colour per shape. NO score / timer / number is ever shown. guide:"dotted" = full visible
    // dotted outline (Guided); guide:"faint" = low-opacity outline (Independent, less scaffold).
    // data:{shape, color, name?, name_audio?, guide:"dotted"|"faint"}
    // audio:{prompt, shape_name?, done, try_again?}   signals:{on_complete:["shape_trace_complete"]}
    mount(host, slide){
      const d = slide.data;
      const PATHS = {   // viewBox 0 0 100 100, matches shapeSVG geometry; TRUE corners
        circle:    "M 8,50 a 42,42 0 1 0 84,0 a 42,42 0 1 0 -84,0 Z",
        square:    "M 12,12 H 88 V 88 H 12 Z",
        triangle:  "M 50,9 L 91,89 L 9,89 Z",
        rectangle: "M 6,28 H 94 V 72 H 6 Z"
      };
      const shape = d.shape, color = d.color || "#386AF6";
      const dPath = PATHS[shape] || PATHS.square;
      const faint = d.guide === "faint";
      state.ownsAudio = true; setNavActive(false); setSwMood("point");

      const wrap = document.createElement("div"); wrap.className = "trace-stage";
      const box  = document.createElement("div"); box.className = "trace-box";
      box.innerHTML =
        `<svg class="trace-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
           <path class="trace-guide${faint ? " faint" : ""}" d="${dPath}" stroke="${color}" stroke-width="6"
                 ${faint ? "" : `stroke-dasharray="2 7"`}/>
           <path class="trace-ink" d="${dPath}" stroke="${color}" stroke-width="9"/>
           <g class="trace-dots"></g>
           <circle class="trace-marker" r="6" fill="${color}" style="display:none"/>
         </svg>`;
      wrap.appendChild(box); host.appendChild(wrap);

      const svg   = box.querySelector(".trace-svg");
      const guide = box.querySelector(".trace-guide");
      const inkP  = box.querySelector(".trace-ink");
      const dotsG = box.querySelector(".trace-dots");
      const marker= box.querySelector(".trace-marker");

      const total = inkP.getTotalLength();
      const N = 96, CORRIDOR = 11;   // user-units; a generous corridor for little fingers
      const pts = [], hit = new Array(N).fill(false);
      for(let i=0;i<N;i++) pts.push(inkP.getPointAtLength(total * i / N));
      pts.forEach(p=>{ const c = document.createElementNS("http://www.w3.org/2000/svg","circle");
        c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", faint ? 1.5 : 2.1);
        c.setAttribute("fill", color); c.setAttribute("class","trace-dot"); dotsG.appendChild(c); });
      const dotEls = [...dotsG.children];
      inkP.style.strokeDasharray = String(total); inkP.style.strokeDashoffset = String(total);   // ink hidden until success flourish

      let done = false, active = false;
      const covered = ()=> hit.reduce((a,b)=> a + (b?1:0), 0);
      const toSvg = (cx, cy)=>{ const m = svg.getScreenCTM(); if(!m) return null;
        const p = svg.createSVGPoint(); p.x = cx; p.y = cy; return p.matrixTransform(m.inverse()); };

      // idle → demonstrate: a marker travels the outline ("trace like this")
      let idleTimer = null, demoRAF = null;
      const stopIdle = ()=>{ clearTimeout(idleTimer); if(demoRAF){ cancelAnimationFrame(demoRAF); demoRAF = null; } marker.style.display = "none"; };
      const runDemo = ()=>{ let s = 0; marker.style.display = "";
        const stepD = ()=>{ if(done || active){ marker.style.display = "none"; demoRAF = null; return; }
          s += total / 90; if(s > total) s = 0;
          const p = inkP.getPointAtLength(s); marker.setAttribute("cx", p.x); marker.setAttribute("cy", p.y);
          demoRAF = requestAnimationFrame(stepD); };
        stepD(); };
      const kickIdle = ()=>{ stopIdle(); idleTimer = setTimeout(()=>{ if(!done && !active) runDemo(); }, 2600); };

      function finish(){
        done = true; stopIdle(); stopNudge();
        guide.classList.add("done"); dotEls.forEach(x=> x.classList.add("on"));
        inkP.style.strokeDashoffset = "0";   // draw the full outline as the success flourish
        SwiftPAL.emit("shape_trace_complete", { slide_id: slide.id, phase: slide.phase, shape, value: true,
          latency_ms: Date.now()-state.slideStart });
        sfxCorrect(); confettiCannon(); setSwMood("celebrate");
        play(audioFor(slide, "done") || null, ()=> setNavActive(true));
      }
      const markAt = (sp)=>{ if(!sp) return; let any = false;
        for(let i=0;i<N;i++){ if(hit[i]) continue;
          const dx = pts[i].x - sp.x, dy = pts[i].y - sp.y;
          if(dx*dx + dy*dy <= CORRIDOR*CORRIDOR){ hit[i] = true; dotEls[i].classList.add("on"); any = true; } }
        if(any && !done && covered() / N >= 0.8) finish();
      };

      const onDown = (e)=>{ if(done) return; active = true; stopIdle(); const t = e.touches ? e.touches[0] : e;
        markAt(toSvg(t.clientX, t.clientY)); if(e.cancelable) e.preventDefault(); };
      const onMove = (e)=>{ if(!active || done) return; const t = e.touches ? e.touches[0] : e;
        markAt(toSvg(t.clientX, t.clientY)); if(e.cancelable) e.preventDefault(); };
      const onUp   = ()=>{ if(active){ active = false; if(!done) kickIdle(); } };
      box.addEventListener("mousedown", onDown); box.addEventListener("touchstart", onDown, {passive:false});
      box.addEventListener("mousemove", onMove); box.addEventListener("touchmove", onMove, {passive:false});
      window.addEventListener("mouseup", onUp);   box.addEventListener("touchend", onUp);

      state.replayAudio = ()=> play(audioFor(slide, "prompt") || null, ()=>{});
      $("navBtn").onclick = ()=>{ if(done) completeSlide(true); };
      // prompt → shape name → arm the idle-demo (no auto-play double-fire: state.ownsAudio set above)
      play(audioFor(slide, "prompt") || null, ()=> play(audioFor(slide, "shape_name") || null, ()=> kickIdle()));
    }
  },

  TAP_SHAPE_BY_NAME: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "shape_name_first_try",
          /* [28m] NO VOLUME BUTTON, ANYWHERE. Yasir 2026-07-28: "we use vol button nowhere. if
             nothing then we keep question only." This stimulus had NO image, so 28c left its 🔊 +
             "सुनो" chip alone and flagged it — stripping it looked like it would leave a blank card.
             The ruling settles it: nothing to show => show the QUESTION only, no chip. The chip was
             also the only way to re-hear the sound, so that function moves to the header replay
             (state.replayAudio, set after mount) instead of dying with the affordance. */
          stimulus: null,
        options: slide.data.options,
        isCorrect: (opt) => opt.shape === slide.data.target,
        optionRenderer: (opt) => shapeCell(opt)
      });
        /* [28m] the removed chip was the only way to re-hear the sound — keep the FUNCTION on the
           header replay. Set AFTER mount so mountTapOptions cannot overwrite it. */
        state.replayAudio = ()=>{ state.audioReplays++; play(audioFor(slide,"shape_name") || null, ()=>{}); };
    }
  },

  TAP_SHAPE_BY_PICTURE: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "shape_env_first_try",
        stimulus: stimulusPic(slide.data.object_hi, slide.data.object_emoji, slide.data.object_img),
        options: slide.data.options,
        isCorrect: (opt) => opt.shape === slide.data.target,
        optionRenderer: (opt) => shapeCell(opt)
      });
    }
  },

  TAP_PICTURE_BY_SHAPE: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "shape_object_first_try",
        stimulus: stimulusShape({shape: slide.data.shape, color: slide.data.color, rotate: slide.data.rotate}),
        options: slide.data.options,
        isCorrect: (opt) => opt.correct === true,
        optionRenderer: (opt) => pictureCell(opt.object_hi, opt.object_emoji, opt.object_img)
      });
    }
  },

  SORT_SHAPE: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "sort-stage shape-sort";
      const binsRow = document.createElement("div");
      binsRow.className = "sort-bins" + (slide.data.bins.length >= 4 ? " many" : "");
      slide.data.bins.forEach(b => {
        const bin = document.createElement("div");
        bin.className = "sort-bin dd-zone";            // dd-zone → drop detection
        bin.dataset.shape = b.shape;
        // header (faint reference shape + label) INSIDE the box, then a clear drop area
        bin.innerHTML = `<div class="bin-head-row"><span class="bin-ref">${shapeSVG(b.shape, {color:"#AEB9CC", size:34})}</span><span class="bin-title">${b.label}</span></div>`+
          `<div class="bin-items"></div>`;
        binsRow.appendChild(bin);
      });
      const tray = document.createElement("div"); tray.className = "sort-tray";
      const items = slide.data.items.slice().sort(()=> Math.random() - 0.5);
      items.forEach(it => {
        const t = document.createElement("div"); t.className = "sort-item"; t.dataset.shape = it.shape; if(it.audio) t.dataset.audio = it.audio;   // [20a SORT-01]
        t.innerHTML = shapeSVG(it.shape, {color: it.color, size: 70, rotate: it.rotate});
        tray.appendChild(t);
      });
      wrap.appendChild(binsRow); wrap.appendChild(tray);
      host.appendChild(wrap);

      state.attempts = 0; state.locked = false;
      let placed = 0; const need = slide.data.items.length;
      if(slide.data.reveal_seq) sortSeqReveal(tray, slide);   // [20a SORT-01] opt-in
      [...tray.children].forEach(tile => {
        makeDraggable(tile, (zone, t) => {
          const bin = zone.closest(".sort-bin"); if(!bin) return;
          state.attempts++;
          if(bin.dataset.shape === t.dataset.shape){
            leaveTrayGhost(t);   // [24a A5] capture the tray-slot size before .snapped shrinks/moves it
            t.classList.add("snapped");
            bin.querySelector(".bin-items").appendChild(t);
            placed++;
            if(t.dataset.audio && placed < need) play("assets/Audio/" + t.dataset.audio + "." + AUDIO_EXT, ()=>{});   // [20a SORT-01] speak-on-match
            SwiftPAL.emit("shape_sort_item", { slide_id: slide.id, shape: t.dataset.shape, attempts: state.attempts });
            if(placed === need){
              state.locked = true;
              SwiftPAL.emit("shape_sort_correct", {
                slide_id: slide.id, phase: slide.phase, value: true,
                attempts: state.attempts, latency_ms: Date.now() - state.slideStart
              });
              setTimeout(()=> celebrateThenAdvance(slide, false), 250);   // standard: confetti + VO + auto-advance, no popup
            }
          } else {
            bin.classList.add("hover"); bin.style.borderColor = "var(--wrong)";
            setTimeout(()=>{ bin.classList.remove("hover"); bin.style.borderColor = ""; }, 500);
            dragWrong(slide);   // buzz + Swiftie + spoken try_again (pre-readers need the spoken recovery)
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
          }
        });
      });
    }
  },

  /* ===== COUNTING (maths) — OTO tap-count, cardinality, meet-number, make-set ===== */
  COUNT_TAP: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "count-stage";
      const row  = document.createElement("div"); row.className = "count-row";
      const N = slide.data.count, obj = slide.data.object, nums = slide.data.numerals || [];
      // large sets (S04, up to 20): smaller tiles + optional rows-of-N grouping (curriculum: rows of 5/10)
      if(N > 10 || slide.data.per_row) row.classList.add("dense");
      if(slide.data.per_row){ row.style.display = "grid"; row.style.gridTemplateColumns = `repeat(${slide.data.per_row}, auto)`; }
      const items = []; let c = 0;
      for(let i=0;i<N;i++){
        const it = document.createElement("div"); it.className = "count-item";
        it.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji") + `<span class="count-badge"></span>`;
        row.appendChild(it); items.push(it);
      }
      wrap.appendChild(row); host.appendChild(wrap);

      function nudgeNext(){ const nx = items.find(x=>!x.classList.contains("counted")); if(nx) pointNudgeAt(nx); else stopNudge(); }
      items.forEach(it => {
        it.onclick = ()=>{
          if(it.classList.contains("counted")) return;   // one-to-one: never double-count
          c++; it.classList.add("counted");
          it.querySelector(".count-badge").textContent = String(c);   // Arabic running count; Hindi word spoken separately
          SwiftPAL.emit("count_tap", { slide_id: slide.id, phase: slide.phase, n: c });
          if(c >= N){
            stopNudge();
            SwiftPAL.emit("count_oto_complete", { slide_id: slide.id, phase: slide.phase,
              total: N, value: true, latency_ms: Date.now()-state.slideStart });
            // say the LAST number, then the total; enable आगे ONLY after "कुल N" finishes
            play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT, ()=> setTimeout(()=>
              play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT, ()=> setNavActive(true)), 300));
          } else {
            play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT);    // one number word per touch
            nudgeNext();
          }
        };
      });
      setNavActive(false);
      $("navBtn").onclick = ()=>{ if(c >= N) completeSlide(true); };
      nudgeNext();
    }
  },

  COMBINE_COUNT: {
    // [21c] PUT-TOGETHER (MTKGA01_L03_S01 "Combines two small groups and counts the total, within 10").
    // The child DRAGS group B onto group A; the two sets visibly MERGE into ONE row, then the child
    // tap-counts the combined total one-by-one. The EVIDENCE is the set the child builds + counts, never
    // a numeral pick — the LO's mandated drag-and-combine. Misconception guards baked in:
    //   • one-to-one count: re-tapping a counted item is INERT → no double-counting the overlap where the
    //     two groups meet (the map's #1 error);
    //   • the merged set is a single clean row (never a pile) so the child can't lose track at the seam.
    // data.mode "demo" runs it AUTONOMOUSLY for the Phase-1 tutorial (a hand pushes B onto A, then it
    // counts itself — KG children who can't yet count WATCH the put-together happen).
    // data:{a, b, object, numerals?, mode?}   audio:{prompt, conclude?(demo)}
    mount(host, slide){
      const d = slide.data, A = d.a|0, B = d.b|0, N = A + B, obj = d.object;
      const demo = d.mode === "demo";
      state.ownsAudio = true; setNavActive(false); setSwMood(demo ? "teach" : "point");
      const wrap = document.createElement("div"); wrap.className = "combine-stage" + (demo ? " is-demo" : "");
      const layout = document.createElement("div"); layout.className = "combine-layout";
      const mat = document.createElement("div"); mat.className = "combine-mat dd-zone";   // group A = the fixed drop target
      const grpA = document.createElement("div"); grpA.className = "combine-grp";
      const grpB = document.createElement("div"); grpB.className = "combine-grp combine-drag";   // group B = the draggable cluster
      const mkItem = ()=>{ const it = document.createElement("div"); it.className = "count-item combine-item";
        it.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji") + `<span class="count-badge"></span>`; return it; };
      for(let i=0;i<A;i++) grpA.appendChild(mkItem());
      for(let i=0;i<B;i++) grpB.appendChild(mkItem());
      mat.appendChild(grpA);
      const plus = document.createElement("div"); plus.className = "combine-plus"; plus.textContent = "और";
      const bWrap = document.createElement("div"); bWrap.className = "combine-bwrap"; bWrap.appendChild(grpB);
      layout.appendChild(mat); layout.appendChild(plus); layout.appendChild(bWrap);
      wrap.appendChild(layout); host.appendChild(wrap);

      let c = 0; const merged = []; let counting = false;
      const stale = ()=> (state.idx !== undefined && CARD.slides[state.idx] !== slide);

      function finish(){   // last number already spoken by the caller → say the cardinal total, then settle
        SwiftPAL.emit("combine_count_correct", { slide_id: slide.id, phase: slide.phase,
          a: A, b: B, total: N, value: true, latency_ms: Date.now()-state.slideStart });
        play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT, ()=>{
          if(demo){ play(audioFor(slide, "conclude") || null, ()=>{ state.demoRunning = false; setNavActive(true); }); }   // [24a N8] demo chain over → chip live
          else { sfxCorrect(); confettiCannon(); setSwMood("celebrate"); setNavActive(true); }   // produce: celebrate in place, then unlock आगे
        });
      }
      function startCount(){
        counting = true;
        // collapse the two groups into ONE clean row (A first, then B), badges cleared — nothing to
        // double-count at the seam because it's a single continuous row the child counts straight through.
        const items = [...grpA.querySelectorAll(".combine-item"), ...grpB.querySelectorAll(".combine-item")];
        const row = document.createElement("div"); row.className = "count-row combine-merged" + (N > 8 ? " dense" : "");
        items.forEach(it=>{ it.classList.remove("counted","demo-hit"); const b = it.querySelector(".count-badge"); if(b) b.textContent = ""; row.appendChild(it); merged.push(it); });
        layout.className = "combine-layout merged"; layout.innerHTML = ""; layout.appendChild(row);
        const nudgeNext = ()=>{ const nx = merged.find(x=>!x.classList.contains("counted")); if(nx) pointNudgeAt(nx); else stopNudge(); };
        if(demo){
          (function stepC(){
            if(stale()) return;
            if(c >= N){ setTimeout(finish, 380); return; }
            const it = merged[c]; c++; it.classList.add("counted","demo-hit");
            it.querySelector(".count-badge").textContent = String(c); pointNudgeAt(it);
            play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT, ()=> setTimeout(stepC, 430));
          })();
        } else {
          merged.forEach(it=>{ it.onclick = ()=>{
            if(it.classList.contains("counted")) return;   // one-to-one; re-tap INERT → never double-count the overlap
            c++; it.classList.add("counted"); it.querySelector(".count-badge").textContent = String(c);
            SwiftPAL.emit("count_tap", { slide_id: slide.id, phase: slide.phase, n: c });
            if(c >= N){ stopNudge(); play("assets/Audio/vo_num_" + N + "." + AUDIO_EXT, finish); }
            else { play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT); nudgeNext(); }
          }; });
          nudgeNext();
        }
      }
      function merge(){ if(counting) return; stopNudge(); grpB.classList.add("merging"); sfxTap();
        setTimeout(startCount, 600); }   // let the slide-in play, then count

      if(demo){
        state.demoRunning = true;   // [24a N8] a replay tap mid-demo would gen-kill the prompt→merge→count chain (soft-lock)
        pointNudgeAt(grpB);
        play(audioFor(slide, "prompt") || null, ()=> setTimeout(()=>{ if(!stale()) merge(); }, 750));
        state.replayAudio = ()=> play(audioFor(slide, (counting && c >= N) ? "conclude" : "prompt") || null, ()=>{});
      } else {
        makeDraggable(grpB, (zone)=>{ if(counting || zone !== mat) return; merge(); });   // drag group B onto group A
        $("navBtn").onclick = ()=>{ if(c >= N) completeSlide(true); };
        play(audioFor(slide, "prompt") || null, ()=>{ if(!counting) pointNudgeAt(grpB); });
        state.replayAudio = ()=> play(audioFor(slide, "prompt") || null, ()=>{});
      }
    }
  },

  CONSERVE_COUNT: {
    // MTKGA01_L01_S03 "the LAST counted number IS the total" + its core misconception ("the total
    // changes when objects move"). One slide, two beats: (A) the child tap-counts the set one-to-one
    // (badges + spoken एक/दो/…, ending "कुल N" — the freeze-the-final-number teach), then (B) the SAME
    // objects visibly MOVE to scattered spots (badges clear), the move line asks "अब कितनी हैं?" and
    // numeral options appear — correct is the SAME N; options include N±1 (the moved-so-changed error).
    // data:{count, object, numerals, options:[{value,audio}]} · audio:{prompt, move, try_again, hint, reveal}.
    // GENERALISED count-then-pick engine (S03 conservation + S02's tap-count items). One slide:
    // tap-count the set one-to-one (badges + spoken एक/दो/… → frozen "कुल N"), then numeral options.
    // data: {count, object, options, arrange?("row"|"scatter"|"circle"|"two_groups"), groups?[a,b],
    //        move?(default true = objects drift after counting; false = count-then-pick, no drift)}.
    // move:false emits cardinality_first_try; move:true emits conserve_count_first_try.
    mount(host, slide){
      const d = slide.data, N = d.count, obj = d.object;
      const arrange = d.arrange || "row";
      const doMove  = d.move !== false;
      state.ownsAudio = true; setNavActive(false);
      const wrap = document.createElement("div"); wrap.className = "count-stage conserve";
      const row  = document.createElement("div"); row.className = "count-row arr-" + arrange + (N > 8 ? " dense" : "");
      const items = []; let c = 0;
      const mkItem = ()=>{ const it = document.createElement("div"); it.className = "count-item";
        it.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji") + `<span class="count-badge"></span>`;
        items.push(it); return it; };
      if(arrange === "two_groups"){
        const g = d.groups || [Math.ceil(N/2), Math.floor(N/2)];
        g.forEach((gn, gi)=>{ const cl = document.createElement("div"); cl.className = "count-cluster";
          for(let i=0;i<gn;i++) cl.appendChild(mkItem()); row.appendChild(cl);
          if(gi === 0){ const plus = document.createElement("div"); plus.className = "count-plus"; plus.textContent = "और"; row.appendChild(plus); } });
      } else if(arrange === "circle"){
        for(let i=0;i<N;i++){ const it = mkItem(); const a = -Math.PI/2 + i*2*Math.PI/N, R = N > 6 ? 176 : 140;
          it.style.position = "absolute";
          it.style.left = `calc(50% + ${Math.round(Math.cos(a)*R)}px)`;
          it.style.top  = `calc(50% + ${Math.round(Math.sin(a)*R)}px)`;
          it.style.marginLeft = "-48px"; it.style.marginTop = "-48px"; row.appendChild(it); }
      } else {
        for(let i=0;i<N;i++){ const it = mkItem();
          if(arrange === "scatter") it.style.transform = `translateY(${((i*23)%25)-12}px) rotate(${((i*37)%21)-10}deg)`;
          row.appendChild(it); }
      }
      wrap.appendChild(row); host.appendChild(wrap);
      const nudgeNext = ()=>{ const nx = items.find(x=>!x.classList.contains("counted")); if(nx) pointNudgeAt(nx); else stopNudge(); };
      const askOptions = ()=>{
        mountTapOptions({
          slide, host, signalName: doMove ? "conserve_count_first_try" : "cardinality_first_try",
          stimulus: null, nudgeTarget: null,
          options: d.options,
          columnsHint: Math.min(d.options.length, 5),
          isCorrect: (opt) => opt.value === N,
          optionRenderer: (opt) => slide.phase === "tutorial" ? numFingerCell(opt.value) : bigNumCell(opt.value),
          mastery: slide.phase === "mastery"
        });
      };
      const afterCount = ()=>{
        if(doMove){
          items.forEach((it,i)=>{ const keep = slide.phase === "tutorial" &&
              it.querySelector(".count-badge").textContent === String(N);
            if(!keep) it.querySelector(".count-badge").textContent = "";
            it.classList.add("moved");
            it.style.transform = `translate(${((i*53)%81)-40}px, ${((i*37)%61)-30}px) rotate(${((i*29)%25)-12}deg)`; });
          sfxTap();
          setTimeout(()=>{ play(audioFor(slide, "move") || null, ()=>{}); askOptions(); }, 950);
        } else {
          play(audioFor(slide, "ask") || null, ()=>{}); askOptions();
        }
      };
      items.forEach(it => {
        it.onclick = ()=>{
          if(it.classList.contains("counted") || it.classList.contains("moved")) return;   // one-to-one; inert once moved
          c++; it.classList.add("counted");
          it.querySelector(".count-badge").textContent = String(c);
          SwiftPAL.emit("count_tap", { slide_id: slide.id, phase: slide.phase, n: c });
          if(c >= N){
            stopNudge();
            play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT, ()=> setTimeout(()=>
              play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT, ()=> setTimeout(afterCount, 450)), 300));
          } else {
            play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT);
            nudgeNext();
          }
        };
      });
      state.replayAudio = ()=> play(audioFor(slide, c >= N ? (doMove ? "move" : "ask") : "prompt") || null, ()=>{});
      play(audioFor(slide, "prompt") || null, ()=>{});
      nudgeNext();
    }
  },

  COUNT_ACTION: {
    // S02 themed tap-count: tap each object and it ENACTS to a target while counting — pop (balloon
    // vanishes), feed (flies to the monster's mouth), or basket (drops into the basket). After the last
    // one the frozen "कुल N" plays and numeral options appear. data:{count, object, options, theme
    // ("pop"|"feed"|"basket")}. audio:{prompt, ask, try_again, hint, reveal}.
    mount(host, slide){
      const d = slide.data, N = d.count, obj = d.object, theme = d.theme || "pop";
      state.ownsAudio = true; setNavActive(false);
      const wrap = document.createElement("div"); wrap.className = "count-stage act act-" + theme;
      let target = null;
      if(theme === "feed"){ target = document.createElement("div"); target.className = "act-target act-monster"; target.textContent = "👹"; wrap.appendChild(target); }
      if(theme === "basket"){ target = document.createElement("div"); target.className = "act-target act-basket";
        target.innerHTML = imgOrEmoji("obj_basket", "🧺", "act-basket-img", "act-basket-emoji"); wrap.appendChild(target); }
      const row = document.createElement("div"); row.className = "count-row act-row" + (N > 8 ? " dense" : "");
      const items = []; let c = 0;
      for(let i=0;i<N;i++){ const it = document.createElement("div"); it.className = "count-item act-item";
        it.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji") + `<span class="count-badge"></span>`;
        row.appendChild(it); items.push(it); }
      wrap.appendChild(row); host.appendChild(wrap);
      const nudgeNext = ()=>{ const nx = items.find(x=>!x.classList.contains("done")); if(nx) pointNudgeAt(nx); else stopNudge(); };
      const askOptions = ()=>{ mountTapOptions({
        slide, host, signalName: "cardinality_first_try", stimulus: null, nudgeTarget: null,
        options: d.options, columnsHint: Math.min(d.options.length, 5),
        isCorrect: (opt) => opt.value === N,
        optionRenderer: (opt) => slide.phase === "tutorial" ? numFingerCell(opt.value) : bigNumCell(opt.value),
        mastery: slide.phase === "mastery" }); };
      items.forEach(it => {
        it.onclick = ()=>{
          if(it.classList.contains("done")) return;
          c++; it.classList.add("done", "act-go");   // act-go = fly/pop animation (theme-scoped CSS)
          it.querySelector(".count-badge").textContent = String(c);
          if(theme === "feed" && target) target.classList.add("chomp");
          sfxTap();
          SwiftPAL.emit("count_tap", { slide_id: slide.id, phase: slide.phase, n: c });
          if(c >= N){
            stopNudge();
            play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT, ()=> setTimeout(()=>
              play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT, ()=> setTimeout(()=>{
                play(audioFor(slide, "ask") || null, ()=>{}); askOptions(); }, 450)), 300));
          } else { play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT); nudgeNext(); }
        };
      });
      state.replayAudio = ()=> play(audioFor(slide, c >= N ? "ask" : "prompt") || null, ()=>{});
      play(audioFor(slide, "prompt") || null, ()=>{});
      nudgeNext();
    }
  },

  COUNT_DRAG_MATCH: {
    // S02 drag items. mode "num_to_box": count the set, then DRAG the correct NUMBER CARD into the
    // answer box (#2, #9). mode "obj_to_num": count, then DRAG the object onto the correct NUMBER (#11).
    // data:{count, object, options:[{value}], mode}. audio:{prompt, ask, try_again, reveal}.
    mount(host, slide){
      const d = slide.data, N = d.count, obj = d.object, mode = d.mode || "num_to_box";
      state.ownsAudio = true; setNavActive(false);
      const wrap = document.createElement("div"); wrap.className = "count-stage dragmatch";
      const setRow = document.createElement("div"); setRow.className = "count-row show-set" + (N > 8 ? " dense" : "");
      const items = []; let c = 0;
      for(let i=0;i<N;i++){ const it = document.createElement("div"); it.className = "count-item";
        it.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji") + `<span class="count-badge"></span>`;
        setRow.appendChild(it); items.push(it); }
      wrap.appendChild(setRow);
      const dz = document.createElement("div"); dz.className = "cdm-zone";   // built after counting
      const tray = document.createElement("div"); tray.className = "cdm-tray";
      wrap.appendChild(dz); wrap.appendChild(tray); host.appendChild(wrap);
      const nudgeNext = ()=>{ const nx = items.find(x=>!x.classList.contains("counted")); if(nx) pointNudgeAt(nx); else stopNudge(); };
      const settleWin = (revealed)=>{ state.locked = true;
        SwiftPAL.emit("cardinality_first_try", { slide_id: slide.id, phase: slide.phase, value: !revealed, latency_ms: Date.now()-state.slideStart });
        celebrateThenAdvance(slide, revealed); };
      const buildDrag = ()=>{
        // shuffle the numeral options
        const opts = d.options.slice(); for(let i=opts.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [opts[i],opts[j]]=[opts[j],opts[i]]; }
        if(mode === "obj_to_num"){
          // number cards are the DROP ZONES; a single draggable object-chip is the tile
          dz.className = "cdm-numrow";
          opts.forEach(o=>{ const z = document.createElement("div"); z.className = "cdm-numzone dd-zone"; z.dataset.val = String(o.value);
            z.innerHTML = `<span class="bignum-glyph">${devNumeral(o.value)}</span>`; dz.appendChild(z); });
          const tile = document.createElement("div"); tile.className = "cdm-objtile";
          tile.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji"); tray.appendChild(tile);
          makeDraggable(tile, (zone)=>{ if(state.locked || !zone) return;
            if(parseInt(zone.dataset.val,10) === N){ zone.classList.add("filled","correct"); tile.classList.add("snapped"); settleWin(false); }
            else { zone.classList.add("wrong"); setTimeout(()=>zone.classList.remove("wrong"),500); dragWrong(slide);
            /* [32d] HOUSE DEFAULT IS 2, NOT 3. This fallback read ||3 in 10 places, contradicting the ruling that a 3rd attempt is only legitimate when a hint2 is authored (feedback_max_attempts_needs_hint2, closed fleet-wide 2026-08-03 and enforced by _tools/attempts_check.py). No card hits the fallback today — all 33 set max_attempts explicitly — so this is provably inert now; it exists so a NEW game that omits the field cannot silently regain a 3rd attempt with an empty third rung, which is the exact defect that was just closed. */
        state.attempts=(state.attempts||0)+1; if(state.attempts>=(CARD.scaffold_rules.max_attempts||2)){ const zc=[...dz.children].find(z=>parseInt(z.dataset.val,10)===N); if(zc){zc.classList.add("filled","correct","reveal-glow"); tile.classList.add("snapped"); play(audioFor(slide,"reveal")||null,()=>{}); settleWin(true);} } }
          });
        } else {
          // one BOX is the drop zone; number cards are the draggable tiles
          dz.className = "cdm-box dd-zone"; dz.innerHTML = `<span class="cdm-box-q">?</span>`;
          opts.forEach(o=>{ const tile = document.createElement("div"); tile.className = "cdm-card"; tile.dataset.val = String(o.value);
            tile.innerHTML = `<span class="bignum-glyph">${devNumeral(o.value)}</span>`; tray.appendChild(tile);
            makeDraggable(tile, (zone)=>{ if(state.locked || zone !== dz) return;
              if(o.value === N){ dz.classList.add("filled","correct"); dz.innerHTML = `<span class="bignum-glyph">${devNumeral(N)}</span>`; tile.classList.add("snapped"); settleWin(false); }
              else { dz.classList.add("wrong"); setTimeout(()=>dz.classList.remove("wrong"),500); dragWrong(slide);
                state.attempts=(state.attempts||0)+1; if(state.attempts>=(CARD.scaffold_rules.max_attempts||2)){ dz.classList.add("filled","correct","reveal-glow"); dz.innerHTML=`<span class="bignum-glyph">${devNumeral(N)}</span>`; play(audioFor(slide,"reveal")||null,()=>{}); settleWin(true); } }
            });
          });
        }
        play(audioFor(slide, "ask") || null, ()=>{});
      };
      items.forEach(it => { it.onclick = ()=>{ if(it.classList.contains("counted")) return;
        c++; it.classList.add("counted"); it.querySelector(".count-badge").textContent = String(c);
        SwiftPAL.emit("count_tap", { slide_id: slide.id, phase: slide.phase, n: c });
        if(c >= N){ stopNudge(); play("assets/Audio/vo_num_"+c+"."+AUDIO_EXT, ()=> setTimeout(()=>
          play("assets/Audio/vo_total_"+N+"."+AUDIO_EXT, ()=> setTimeout(buildDrag, 450)), 300)); }
        else { play("assets/Audio/vo_num_"+c+"."+AUDIO_EXT); nudgeNext(); }
      }; });
      state.attempts = 0; state.locked = false;
      state.replayAudio = ()=> play(audioFor(slide, c >= N ? "ask" : "prompt") || null, ()=>{});
      play(audioFor(slide, "prompt") || null, ()=>{});
      nudgeNext();
    }
  },

  DEMO_COUNT: {
    // [16h] PHASE-1 AUTONOMOUS TEACH (the lead's 3-phase contract, 2026-07-17): the game counts
    // BY ITSELF — KG children who cannot count yet WATCH the counting happen. All N objects are
    // visible; the demo hand moves to each in turn; a BIG running count above updates 1..N with
    // vo_num_N per touch; then the conclusion line plays ("ये पाँच सेब हैं!") and आगे unlocks.
    // NO required interaction, NO options — never a test. Zero (N=0): empty tray, straight to the
    // conclusion ("यहाँ कुछ नहीं — शून्य!"). data:{count, object} audio:{prompt?, conclude}
    mount(host, slide){
      const d = slide.data, N = d.count, obj = d.object;
      state.ownsAudio = true; setNavActive(false); setSwMood("teach");
      const wrap = document.createElement("div"); wrap.className = "demo-stage";
      const counter = document.createElement("div"); counter.className = "demo-count";
      counter.textContent = N === 0 ? "0" : "";
      const row = document.createElement("div"); row.className = "count-row demo-row" + (N > 8 && !d.per_row ? " dense" : "");
      if(d.per_row){ row.classList.add("perrow"); row.style.gridTemplateColumns = `repeat(${d.per_row}, auto)`; }
      const items = [];
      for(let k = 0; k < N; k++){
        const it = document.createElement("div"); it.className = "count-item demo-item";
        it.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji") + `<span class="count-badge"></span>`;
        row.appendChild(it); items.push(it);
      }
      if(N === 0){ row.classList.add("demo-empty"); }
      wrap.appendChild(counter); wrap.appendChild(row); host.appendChild(wrap);
      let i = 0;
      const conclude = ()=>{ stopNudge();
        play(audioFor(slide, "conclude") || null, ()=> setNavActive(true)); };
      const step = ()=>{
        if(state.idx !== undefined && CARD.slides[state.idx] !== slide) return;   // slide changed — stop
        if(i >= N){ setTimeout(conclude, 400); return; }
        const it = items[i];
        it.classList.add("counted", "demo-hit");
        it.querySelector(".count-badge").textContent = String(i + 1);
        counter.textContent = String(i + 1);
        counter.classList.remove("demo-pop"); void counter.offsetWidth; counter.classList.add("demo-pop");
        pointNudgeAt(it);
        i++;
        play("assets/Audio/vo_num_" + i + "." + AUDIO_EXT, ()=> setTimeout(step, 420));
      };
      play(audioFor(slide, "prompt") || null, ()=> setTimeout(step, 500));
      state.replayAudio = ()=> play(audioFor(slide, i >= N ? "conclude" : "prompt") || null, ()=>{});
    }
  },

  MEET_NUMBER: {
    mount(host, slide){
      if(slide.data && slide.data.present === "crane"){ return btCraneMeet(host, slide); }   // Block Town teach
      const wrap = document.createElement("div"); wrap.className = "meet-stage number-meet";
      const n = slide.data.count;
      // [16d] dual-code the numeral: hands for 1..5; for bigger numbers (teens) the Hindi number WORD.
      // Never the numeral twice — fingerCount's out-of-range fallback IS the numeral, which rendered
      // the "12 over 12" teach card the SME flagged on MTKGA01_L01_S04.
      const word = (slide.data.numerals || [])[n-1] || "";
      const second = (n>=1 && n<=5) ? fingerCount(n,'meet-hand') : (word ? `<span class="num-word">${word}</span>` : "");
      wrap.innerHTML = `
        <div class="meet-number-box"><span class="num-glyph">${n}</span>${second}</div>
        <div class="meet-arrow">→</div>`;
      // [16d] the teach set honors data.per_row (rows of 10 → a teen visibly reads as ten-and-ones)
      const setEl = stimulusCountSet(n, slide.data.object, false, slide.data.per_row);
      setEl.classList.add("meet-set");
      wrap.appendChild(setEl);
      host.appendChild(wrap);
      state.gateNavUntilAudio = true; setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  COUNT_HOW_MANY: {
    mount(host, slide){
      const setEl = stimulusCountSet(slide.data.count, slide.data.object, slide.data.scatter, slide.data.per_row);
      mountTapOptions({
        slide, host, signalName: "cardinality_first_try",
        stimulus: setEl,
        nudgeTarget: null,   // nothing to re-tap here → no idle hand
        options: slide.data.options,
        columnsHint: Math.min(slide.data.options.length, 5),
        isCorrect: (opt) => opt.value === slide.data.count,
        // SME (S01 review deck): finger-hands are a TUTORIAL teaching aid only — in guided/
        // independent/practice/mastery the options are the NUMBER ALONE, larger.
        optionRenderer: (opt) => slide.phase === "tutorial" ? numFingerCell(opt.value) : bigNumCell(opt.value),
        mastery: slide.phase === "mastery",
        // HINT = count the set FOR the child (highlight + say एक/दो/तीन + numeral on top)
        hintAction: (done) => demoCountSet(setEl, slide.data.count, slide.data.numerals, done)
      });
    }
  },

  PICK_SET_BY_NUMBER: {
    // SME-designed REVERSE how-many (S01 review deck, new pages): a big NUMBER is the stimulus;
    // the options are small OBJECT SETS — tap the set with that many. Speak-on-tap = each set's own
    // count line ("इसमें तीन चीज़ें हैं।"), which doubles as the SME's wrong-tap hint; the ladder then
    // runs try_again → hint → reveal-glow as everywhere. data:{target, options:[{count, object:{img,emoji},
    // audio, correct}]}.
    mount(host, slide){
      const d = slide.data;
      const stim = document.createElement("div"); stim.className = "psn-stimulus";
      stim.innerHTML = `<span class="psn-num">${devNumeral(d.target)}</span>`;
      mountTapOptions({
        slide, host, signalName: "pick_set_first_try",
        stimulus: stim,
        nudgeTarget: null,
        options: d.options,
        columnsHint: Math.min(d.options.length, 3),
        isCorrect: (opt) => opt.correct === true,
        optionRenderer: (opt) => {
          const c = document.createElement("div"); c.className = "psn-cell";
          let inner = "";
          for(let i=0;i<opt.count;i++) inner += `<span class="psn-obj">${imgOrEmoji(opt.object.img, opt.object.emoji, "psn-img", "psn-emoji")}</span>`;
          c.innerHTML = `<div class="psn-set">${inner}</div>`;
          return c;
        },
        mastery: slide.phase === "mastery"
      });
    }
  },

  MAKE_SET: {
    mount(host, slide){
      const N = slide.data.target, obj = slide.data.object;
      const wrap = document.createElement("div"); wrap.className = "makeset-stage";
      wrap.innerHTML = `
        <div class="makeset-target"><span class="ms-label">डालो</span><span class="num-glyph">${devNumeral(slide.data.target)}</span>${imgOrEmoji(obj.img, obj.emoji, "ms-goal-obj", "ms-goal-emoji")}</div>
        <div class="makeset-frame" id="msFrame"></div>
        <button class="makeset-add" id="msAdd"><span class="ms-add-plus">＋</span>${imgOrEmoji(obj.img, obj.emoji, "ms-add-obj", "ms-add-emoji")}</button>`;
      host.appendChild(wrap);
      const frame = wrap.querySelector("#msFrame"), addBtn = wrap.querySelector("#msAdd");
      const numerals = slide.data.numerals || [];
      const MAXITEMS = 5;                          // never allow more than 5
      let c = 0; state.attempts = 0; state.locked = false; state.hintActive = false;
      const refreshNav = ()=> setNavActive(!state.locked && !state.hintActive && c === N);  // आगे activates ONLY at exactly N — no premature/wrong submit; child self-corrects by adding more / removing (×). Nudge on the add-button guides an idle child.
      function makeItem(){
        const it = document.createElement("div"); it.className = "ms-item";
        it.innerHTML = imgOrEmoji(obj.img, obj.emoji, "cobj-img", "cobj-emoji") + `<span class="ms-del" aria-label="हटाओ">×</span>`;
        const remove = (e)=>{ if(e) e.stopPropagation(); if(state.locked || state.hintActive) return; it.remove(); c--; refreshNav(); };
        // remove ONLY via the explicit × badge — tapping the object itself must NOT delete it
        // (the count tutorial teaches "tap the object to count it"; a placed apple that vanishes on tap
        //  would silently destroy the child's work)
        it.querySelector(".ms-del").onclick = remove;
        frame.appendChild(it); return it;
      }
      addBtn.onclick = ()=>{
        if(state.locked || state.hintActive) return;
        if(c >= MAXITEMS){ addBtn.classList.add("shake"); setTimeout(()=> addBtn.classList.remove("shake"), 420); return; }  // cap at 5
        c++; makeItem();
        play("assets/Audio/vo_num_" + c + "." + AUDIO_EXT);   // count up as you add
        SwiftPAL.emit("make_set_add", { slide_id: slide.id, count: c });
        refreshNav();
      };
      // HINT = count what the child actually placed (highlight + say the number)
      const runHint = (after)=>{
        state.hintActive = true; refreshNav();
        demoCount([...frame.querySelectorAll(".ms-item")], numerals, ()=>{ state.hintActive = false; refreshNav(); if(after) after(); });
      };
      $("hintBtn").onclick = ()=>{ if(state.locked || state.hintActive) return;
        SwiftPAL.emit("hint_shown", { slide_id: slide.id, manual: true }); runHint(); };
      // आगे = SUBMIT. correct → celebrate & advance. wrong → graduated scaffold, same as
      // everywhere: 1st = try again, 2nd = count-demo hint, 3rd = REVEAL (auto-fix to N,
      // count 1..N automatically, then move to the next slide).
      $("navBtn").onclick = ()=>{
        if(state.locked || state.hintActive || c !== N) return;   // gated to exactly N → only the correct-set path runs (self-correcting design)
        if(c === N){
          state.locked = true; refreshNav();
          SwiftPAL.emit("make_set_correct", { slide_id: slide.id, phase: slide.phase,
            value: true, target: N, attempts: state.attempts + 1, latency_ms: Date.now()-state.slideStart });
          play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT, ()=>
            celebrateThenAdvance(slide, false));   // standard: confetti + VO + auto-advance, no popup
          return;
        }
        state.attempts++;
        SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts, made: c, target: N });
        const maxA = (CARD.scaffold_rules && CARD.scaffold_rules.max_attempts) || 3;
        $("hintBtn").classList.add("show","hint-glow");
        if(state.attempts >= maxA){
          // 3rd wrong → reveal: correct the set to exactly N, count it 1..N, then advance
          state.locked = true; state.scaffoldLevel = 3; refreshNav();
          while(frame.querySelectorAll(".ms-item").length > N) frame.querySelector(".ms-item:last-child").remove();
          while(frame.querySelectorAll(".ms-item").length < N) makeItem();
          c = N;
          SwiftPAL.emit("answer_revealed", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
          state.hintActive = true;
          // count the (now-correct) set 1..N, then say the total "कुल N", then advance
          demoCount([...frame.querySelectorAll(".ms-item")], numerals, ()=>{
            state.hintActive = false;
            play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT, ()=> setTimeout(()=> completeSlide(false), 500));
          });
        } else if(state.attempts === 2){
          runHint();                                                   // 2nd wrong → count what they made
        } else {
          // 1st wrong → try again, WITH the spoken VO (was silent)
          showBox("", audioText(slide,"try_again") || "फिर से कोशिश करो।", "wrong", wrongClip(slide), ()=>{});   /* [28i] graded: hint1 on rung 1 */
        }
      };
      setNavActive(false);
      pointNudgeAt(addBtn);
    }
  },

  COMPARE_SETS: {
    // Two visible groups, TWO picture options — the child taps the object that has MORE (or LESS).
    // No बराबर chip (lead review): equality is taught in MEET_COMPARE + produced on the see-saw, so
    // a judge question always has one clear answer between the two objects. Tap-to-answer: a wrong
    // tap buzzes + crosses + locks that card; the right one confetti-cheers + advances.
    mount(host, slide){
      const d = slide.data;
      const stage = stimulusCompareSets(d);
      // JUDGE (test): hide the "मिलाओ" reveal button — its one-to-one reveal + leftover glow gives the
      // answer away (and on a "less" question it glows the MORE set, pointing at the WRONG option).
      // The two rows stay visible so the child still compares by eye. (Reveal stays only on MEET_COMPARE.)
      const mb = stage.querySelector(".cmp-match-btn"); if(mb) mb.style.display = "none";
      const answer = (d.ask === "less") ? (d.a_count < d.b_count ? "a" : "b")
                                        : (d.a_count > d.b_count ? "a" : "b");
      const options = [ {kind:"a", obj:d.a_object}, {kind:"b", obj:d.b_object} ];
      // (option shuffle is now centralized in mountTapOptions — no per-module reverse needed)
      mountTapOptions({
        slide, host, signalName: "compare_first_try",
        stimulus: stage,
        nudgeTarget: null,
        options,
        columnsHint: 2,
        isCorrect: (opt)=> opt.kind === answer,
        optionRenderer: (opt)=>{
          const cell = document.createElement("div");
          cell.innerHTML = imgOrEmoji(opt.obj.img, opt.obj.emoji, "pic-img", "cmp-chip-emoji")
            + `<span class="cmp-chip-lbl">${opt.obj.word_hi || ""}</span>`;
          return cell;
        },
        mastery: slide.phase === "mastery"
      });
    }
  },

  MEET_COMPARE: {
    // TEACH BY DOING (lead review): the child COUNTS each group by tapping its objects one-by-one
    // (running numeral + spoken एक/दो/तीन), the top group then the bottom. Then the one-to-one
    // match reveals, the leftover glows, and Swiftie EXPLAINS the outcome by name — e.g.
    // "एक सेब बच गया, सेब ज़्यादा हैं, केले कम" / "कुछ नहीं बचा, दोनों बराबर". आगे appears after.
    mount(host, slide){
      const d = slide.data;
      const wrap = document.createElement("div"); wrap.className = "meet-compare";
      const stage = stimulusCompareSets({a_object:d.a_object, a_count:d.a_count,
                                          b_object:d.b_object, b_count:d.b_count, show_matches:false});
      const mb = stage.querySelector(".cmp-match-btn"); if(mb) mb.style.display = "none";
      const verdict = document.createElement("div");
      verdict.className = "cmp-verdict " + (d.outcome || "more");
      verdict.textContent = d.label_hi || "";
      wrap.appendChild(stage); wrap.appendChild(verdict);
      host.appendChild(wrap);

      state.gateNavUntilAudio = false; state.locked = false; state.ownsAudio = true; setNavActive(false);
      $("navBtn").onclick = ()=>{ if(state.locked) completeSlide(true); };

      // 🔊 replay: re-hear the teach line (and, once revealed, the explanation). autoPlayChain skips
      // count_intro/explain, so without this the header chip would be silent on teach slides.
      let revealed = false;
      state.replayAudio = ()=>{ const chain = [audioFor(slide, "count_intro")];
        if(revealed) chain.push(audioFor(slide, "explain"));
        playChain(chain.filter(Boolean), 0); };

      const rowA = [...stage.querySelectorAll(".cmp-row.top .cobj")];
      const rowB = [...stage.querySelectorAll(".cmp-row.bot .cobj")];

      // make one row countable-by-tapping; cb fires once every item in it is counted
      function countRow(items, cb){
        const nudgeNext = ()=>{ const nx = items.find(o=>!o.classList.contains("counted"));
          if(nx) pointNudgeAt(nx); else stopNudge(); };
        let n = 0;
        items.forEach(o=>{
          o.classList.add("tappable");
          o.onclick = ()=>{
            if(state.locked || o.classList.contains("counted")) return;
            o.classList.add("counted", "counting"); n++; sfxTap();
            let cal = o.querySelector(".count-callout");
            if(!cal){ cal = document.createElement("span"); cal.className = "count-callout"; o.appendChild(cal); }
            cal.textContent = n;
            play("assets/Audio/vo_num_" + n + "." + AUDIO_EXT, ()=>{});
            if(items.every(x=>x.classList.contains("counted"))){ stopNudge(); setTimeout(cb, 550); }
            else nudgeNext();
          };
        });
        nudgeNext();
        // [16h] Phase-1 autonomous mode (lead's 3-phase contract): the demo hand counts the row
        // BY ITSELF — drives the same handlers a child would, so behavior is identical.
        if(slide.data.auto){
          items.forEach(o=> o.classList.remove("tappable"));
          let ai = 0;
          (function autoTap(){
            if(CARD.slides[state.idx] !== slide || ai >= items.length) return;
            const o = items[ai++]; pointNudgeAt(o); if(o.onclick) o.onclick();
            setTimeout(autoTap, 950);
          })();
        }
      }

      // intro VO → count group A → count group B → reveal match + explain the outcome.
      // NB: uses non-autochain role names (count_intro / explain) so mountSlide's autoPlayChain
      // does NOT also fire the intro — this module owns its own audio sequence.
      play(audioFor(slide, "count_intro") || null, ()=>{
        countRow(rowA, ()=> countRow(rowB, ()=>{
          stage._revealMatches(()=>{
            verdict.classList.add("show","hint-glow"); setSwMood("point");
            state.locked = true; revealed = true; setNavActive(true);
            play(audioFor(slide, "explain") || null, ()=>{});
          });
        }));
      });
    }
  },

  MAKE_EQUAL: {
    // PRODUCE mechanic (see-saw): the left pan holds a fixed group; the child taps + जोड़ो to
    // add to the right pan (tap an added item to take it back). The beam tilts toward the heavier
    // side in real time; at equal it levels, locks, celebrates. Overshoot is enacted (invite to
    // remove), never a red ✗ — the KG "produce, don't pick" model.
    mount(host, slide){
      const d = slide.data, L = d.a_count, fixedObj = d.a_object, addObj = d.b_object;
      const MAXR = d.max || Math.max(L + 2, 6);
      const wrap = document.createElement("div"); wrap.className = "balance-stage";
      wrap.innerHTML = `
        <div class="balance">
          <div class="beam-wrap" id="beamWrap"><div class="beam"></div>
            <div class="pan pan-left"><div class="pan-grid" id="panL"></div></div>
            <div class="pan pan-right"><div class="pan-grid" id="panR"></div></div></div>
          <div class="fulcrum"></div>
        </div>
        <button class="balance-add" id="balAdd" type="button"></button>`;
      host.appendChild(wrap);
      const panL = wrap.querySelector("#panL"), panR = wrap.querySelector("#panR");
      const beam = wrap.querySelector("#beamWrap"), addBtn = wrap.querySelector("#balAdd");
      const balance = wrap.querySelector(".balance");
      addBtn.innerHTML = imgOrEmoji(addObj.img, addObj.emoji, "cobj-img", "cobj-emoji") + `<span>+ जोड़ो</span>`;
      for(let i=0;i<L;i++){ const c=document.createElement("span"); c.className="cobj";
        c.innerHTML = imgOrEmoji(fixedObj.img, fixedObj.emoji, "cobj-img", "cobj-emoji"); panL.appendChild(c); }
      let right = 0; state.locked = false; state.attempts = 0; let tipT = 0;
      const TILT = 6, TMAX = 15;
      const tilt = ()=>{ const diff = right - L; const deg = Math.max(-TMAX, Math.min(TMAX, diff*TILT));
        beam.style.transform = `translateX(-50%) rotate(${deg}deg)`; balance.classList.toggle("level", diff===0 && right>0); };
      const check = ()=>{ if(state.locked) return; const diff = right - L;
        if(diff===0 && right>0){ state.locked = true; setNavActive(true);
          SwiftPAL.emit("make_equal_correct", { slide_id: slide.id, phase: slide.phase, value: true,
            count: right, target: L, attempts: state.attempts + 1, latency_ms: Date.now()-state.slideStart });
          showBox("⚖️", audioText(slide,"balanced") || "बराबर! दोनों बराबर हैं।", "correct", audioFor(slide,"balanced") || null, ()=>{});
        } else if(diff > 0){ state.attempts++;
          SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, made: right, target: L });
          if(Date.now()-tipT > 1200){ tipT = Date.now();
            showBox("", audioText(slide,"too_many") || "बहुत ज़्यादा! एक हटाओ।", "hint", audioFor(slide,"too_many") || wrongClip(slide), ()=>{}); } }   /* [28i] ladder fallback */
      };
      const addItem = ()=>{ const c=document.createElement("span"); c.className="cobj added";
        c.innerHTML = imgOrEmoji(addObj.img, addObj.emoji, "cobj-img", "cobj-emoji");
        c.onclick = ()=>{ if(state.locked) return; c.remove(); right = Math.max(0, right-1); tilt(); check(); };
        panR.appendChild(c); right++; };
      addBtn.onclick = ()=>{ if(state.locked) return;
        if(right >= MAXR){ addBtn.classList.add("shake"); setTimeout(()=> addBtn.classList.remove("shake"), 400); return; }
        addItem(); tilt(); sfxTap();
        // count EVERY added item aloud INCLUDING the final/target one (एक, दो, तीन) — then, on the
        // last count, the "बराबर" VO follows (check runs in the count's onEnd so the number isn't cut).
        if(right <= L) play("assets/Audio/vo_num_" + right + "." + AUDIO_EXT, right === L ? ()=> check() : ()=>{});
        else check();   // overshoot → "एक हटाओ" hint
      };
      setNavActive(false);
      $("navBtn").onclick = ()=>{ if(state.locked) completeSlide(true); };
      tilt();                 // START tilted toward the heavier (left) group — the see-saw is NOT level yet
      pointNudgeAt(addBtn);
    }
  },

  MEET_PATTERN: {
    // TEACH: show a repeating pattern and pulse the repeating UNIT (first data.unit_len cells) a few
    // times so the child sees "this part comes again". Nav gated on the VO, like MEET_NUMBER.
    mount(host, slide){
      const d = slide.data;
      const wrap = document.createElement("div"); wrap.className = "pattern-stage";
      const lbl = document.createElement("div"); lbl.className = "pat-unit-lbl"; lbl.textContent = "यह हिस्सा दोहराता है 🔁";
      const row = document.createElement("div"); row.className = "pattern-row";
      d.items.forEach(o=>{ const c = document.createElement("div"); c.className = "pat-cell";
        c.innerHTML = imgOrEmoji(o.img, o.emoji, "cobj-img", "cobj-emoji"); row.appendChild(c); });
      wrap.appendChild(lbl); wrap.appendChild(row); host.appendChild(wrap);
      state.gateNavUntilAudio = true; setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
      const cells = [...row.children]; let rep = 0;
      const glow = ()=>{ cells.forEach((c,i)=> { if(i < d.unit_len) c.classList.add("unit-glow"); });
        setTimeout(()=> cells.forEach(c=> c.classList.remove("unit-glow")), 1100); };
      glow(); const t = setInterval(()=>{ if(rep++ >= 2){ clearInterval(t); return; } glow(); }, 1700);
    }
  },

  PATTERN_BUILD: {
    // PRODUCE: a pattern with empty ghost slot(s) — at the END (extend) or in the MIDDLE (fill the
    // gap). Tap a tray item to drop it into the active slot; the correct item = data.items[slot].
    // Wrong taps bounce (enacted, no ✗). Fill every blank → complete. data:{items[],blanks[],tray[]}.
    mount(host, slide){
      const d = slide.data;
      const wrap = document.createElement("div"); wrap.className = "pattern-stage";
      const row = document.createElement("div"); row.className = "pattern-row";
      const cells = d.items.map((o,i)=>{
        const c = document.createElement("div");
        if(d.blanks.includes(i)){ c.className = "pat-ghost"; c.innerHTML = `<span class="qmark">?</span>`; }
        else { c.className = "pat-cell"; c.innerHTML = imgOrEmoji(o.img, o.emoji, "cobj-img", "cobj-emoji"); }
        row.appendChild(c); return c;
      });
      const tray = document.createElement("div"); tray.className = "pattern-tray";
      d.tray.forEach(o=>{ const t = document.createElement("div"); t.className = "pat-tray-item"; t._obj = o;
        t.innerHTML = imgOrEmoji(o.img, o.emoji, "cobj-img", "cobj-emoji"); tray.appendChild(t); });
      wrap.appendChild(row); wrap.appendChild(tray); host.appendChild(wrap);
      const blanks = d.blanks.slice(); let bi = 0, wrongStreak = 0, revealedAny = false;
      state.locked = false; state.attempts = 0;
      const key = (o)=> o.img || o.emoji;
      const activeGhost = ()=> cells[blanks[bi]];
      const markActive = ()=>{ cells.forEach(c=> c.classList.remove("active"));
        // idle nudge points at the ACTIVE BLANK ('?' slot = "put one here"), re-armed per blank —
        // NEVER at a tray answer; startNudge is phase-aware so it's silent in practice/mastery.
        if(bi < blanks.length){ activeGhost().classList.add("active"); startNudge(slide, activeGhost()); } else stopNudge(); };
      const flashHint = ()=>{ const want = d.items[blanks[bi]], g = activeGhost(); const prev = g.innerHTML;
        g.innerHTML = imgOrEmoji(want.img, want.emoji, "cobj-img", "cobj-emoji"); g.style.opacity = ".4";
        setTimeout(()=>{ if(g.classList.contains("pat-ghost")){ g.innerHTML = prev; g.style.opacity = ""; } }, 950); };
      const placeCorrect = ()=>{                      // one placement path (tap AND reveal)
        clearHold(tray);                                     /* [28l] release the terminal hold */
        const want = d.items[blanks[bi]], g = activeGhost();
        g.className = "pat-cell"; g.innerHTML = imgOrEmoji(want.img, want.emoji, "cobj-img", "cobj-emoji");
        g.classList.add("unit-glow"); setTimeout(()=> g.classList.remove("unit-glow"), 700); bi++;
        if(bi >= blanks.length){
          state.locked = true; stopNudge();
          SwiftPAL.emit("pattern_extend_correct", { slide_id: slide.id, phase: slide.phase, value: !revealedAny,
            attempts: state.attempts + 1, latency_ms: Date.now()-state.slideStart });
          // engine standard: confetti + cheer + correct VO + AUTO-advance — no popup, no आगे gate.
          celebrateThenAdvance(slide, revealedAny);
        } else markActive();
      };
      markActive();
      tray.querySelectorAll(".pat-tray-item").forEach(t=>{
        t.onclick = ()=>{
          if(state.locked || bi >= blanks.length) return;
          stopNudge();
          const want = d.items[blanks[bi]];
          if(key(t._obj) === key(want)){
            wrongStreak = 0;
            placeCorrect();
          } else {
            state.attempts++;
            t.classList.add("shake"); setTimeout(()=> t.classList.remove("shake"), 420);
            activeGhost().classList.add("shake"); setTimeout(()=> activeGhost().classList.remove("shake"), 420);
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            $("hintBtn").classList.add("show","hint-glow");
            // layered ladder, standard-aligned: L1 spoken try-again (buzz + Swiftie, no popup) →
            // L2 flash the answer ghost + spoken hint → L3 reveal ceiling: DEMONSTRATE the placement.
            if(++wrongStreak >= (CARD.scaffold_rules.max_attempts||2)){
              revealedAny = true; wrongStreak = 0;
              activeGhost().classList.add("reveal-glow");
              play(audioFor(slide,"reveal") || audioFor(slide,"hint") || null, ()=>{});
              /* [28l] was: setTimeout(placeCorrect, 1000) — the engine ANSWERED for the child. */
              if(maySolveFor(slide)) setTimeout(()=>{ placeCorrect(); }, 1000);
              else terminalHold([...tray.children].find(x=> key(x._obj) === key(d.items[blanks[bi]])
                                  && !x.classList.contains("used")), tray.children, slide);
            }
            else if(state.attempts >= 2){ flashHint(); play(midHint(slide), ()=>{}); }   /* [28k] rung 2 */
            else dragWrong(slide);
          }
        };
      });
      setNavActive(false);
      $("navBtn").onclick = ()=>{};   // completion is automatic now — आगे never gates a solved pattern
      $("hintBtn").onclick = ()=>{ if(!state.locked && bi < blanks.length) flashHint(); };
      // NB: the idle nudge is armed by markActive() → startNudge(activeGhost) above — it points at the
      // BLANK, phase-aware. (Bug fix: was pointNudgeAt(first tray tile) = an immediate hand on the WRONG
      // answer on most slides, and it showed even in mastery.)
    }
  },

  /* ===== NUMBER-SEQUENCE PATH (MTKGA01_L02_S04 — "completes a number sequence within 20") =====
     Three additive modules that share the .seq-* number-path skin. Numerals are crisp text glyphs
     (Baloo), only the tile chrome is rounded — content-true geometry (never round the number). */

  MEET_SEQUENCE: {
    // TEACH BY DOING: a number path; a token sits on the first cell. The child taps the glowing NEXT
    // cell to hop the token forward, each number spoken (vo_num_N) with an ascending thunk — so the
    // child ENACTS "numbers move forward one step at a time" (curriculum teach spec). Nav gates until
    // the token reaches the end, then Swiftie's explain line plays. data:{path:[n…], token?}.
    mount(host, slide){
      const d = slide.data, nums = d.path;
      state.ownsAudio = true; setNavActive(false); setSwMood("teach");
      const stage = document.createElement("div"); stage.className = "seq-stage";
      const path  = document.createElement("div"); path.className = "seq-path";
      const cw = nums.length > 7 ? 74 : 90;
      const cells = nums.map((n,i)=>{
        if(i){ const con = document.createElement("div"); con.className = "seq-connector"; path.appendChild(con); }
        const cell = document.createElement("div"); cell.className = "seq-cell";
        cell.style.width = cell.style.height = cw+"px"; cell.style.fontSize = Math.round(cw*0.56)+"px";
        cell.textContent = n; path.appendChild(cell); return cell;
      });
      stage.appendChild(path); host.appendChild(stage);
      const token = document.createElement("span"); token.className = "seq-token"; token.textContent = d.token || "🐤";
      let pos = 0;
      const place = ()=>{ cells.forEach((c,i)=> c.classList.toggle("lit", i <= pos));
        if(!cells[pos].contains(token)) cells[pos].appendChild(token); };
      const glowNext = ()=>{ cells.forEach((c,i)=> c.classList.toggle("active", i === pos+1));
        if(pos+1 < cells.length) startNudge(slide, cells[pos+1]); else stopNudge(); };
      place(); btThunk(1); play("assets/Audio/vo_num_" + nums[0] + "." + AUDIO_EXT, ()=>{}); glowNext();
      const advance = ()=>{
        if(pos >= cells.length-1) return;
        pos++; cells[pos].classList.remove("active"); place(); btThunk(pos+1);
        play("assets/Audio/vo_num_" + nums[pos] + "." + AUDIO_EXT, ()=>{});
        if(pos >= cells.length-1){ stopNudge();
          SwiftPAL.emit("meet_sequence_done", { slide_id: slide.id, phase: slide.phase });
          setTimeout(()=> play(audioFor(slide, "explain") || null, ()=> setNavActive(true)), 500);
        } else glowNext();
      };
      cells.forEach((c,i)=>{ c.onclick = ()=>{ if(i === pos+1) advance(); }; });
      // 🔊 replay re-speaks the current number (module owns its audio; autoPlayChain is skipped)
      state.replayAudio = ()=> play("assets/Audio/vo_num_" + nums[pos] + "." + AUDIO_EXT, ()=>{});
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  SEQUENCE_COMPLETE: {
    // PRODUCE test: a number path with blank(s); tap a tray numeral into the active blank. Correct =
    // path[blankIdx]. Wrong = shake + soft buzz + spoken try_again; reveal (demonstrate) after
    // max_attempts. Fills left→right. data:{path:[n… , with the blank positions still holding the true
    // number], blanks:[idx…], tray:[n…] (numerals incl. misconception distractors)}.
    mount(host, slide){
      const d = slide.data;
      const stage = document.createElement("div"); stage.className = "seq-stage";
      const path  = document.createElement("div"); path.className = "seq-path";
      const cw = d.path.length > 7 ? 74 : 90;
      const cells = d.path.map((n,i)=>{
        if(i){ const con = document.createElement("div"); con.className = "seq-connector"; path.appendChild(con); }
        const cell = document.createElement("div");
        cell.style.width = cell.style.height = cw+"px"; cell.style.fontSize = Math.round(cw*0.56)+"px";
        if(d.blanks.includes(i)){ cell.className = "seq-cell seq-ghost"; cell.innerHTML = '<span class="seq-q">?</span>'; }
        else { cell.className = "seq-cell filled"; cell.textContent = n; }
        path.appendChild(cell); return cell;
      });
      const tray = document.createElement("div"); tray.className = "seq-tray";
      d.tray.forEach(n=>{ const t = document.createElement("div"); t.className = "seq-tile"; t._num = n; t.textContent = n; tray.appendChild(t); });
      /* [27j] OPT-IN PICTURE STIMULUS. HIKGH04_L02_S02's deck asks "Give the Picture of house/tap/
         BUS/JUG" on all 4 build-the-word slides, and the module had nowhere to hang one — it read
         only path/blanks/tray and never called mountTapOptions, so authoring d.img was inert.
         Reuses the same stimulusPic() every other module uses, so the picture looks identical to the
         rest of the fleet. Purely additive: a card without img/picture/emoji renders exactly as before,
         and .seq-stage is already a flex column so the picture simply stacks above the path. */
      if(d.img || d.picture || d.emoji){
        stage.appendChild(stimulusPic(d.picture, d.emoji, d.img));
      }
      stage.appendChild(path); stage.appendChild(tray); host.appendChild(stage);

      const blanks = d.blanks.slice(); let bi = 0, wrongStreak = 0, revealedAny = false;
      state.locked = false; state.attempts = 0;
      const activeGhost = ()=> cells[blanks[bi]];
      const markActive = ()=>{ cells.forEach(c=> c.classList.remove("active"));
        if(bi < blanks.length){ activeGhost().classList.add("active"); startNudge(slide, activeGhost()); } else stopNudge(); };
      const placeCorrect = ()=>{
        clearHold(tray);                                     /* [28l] release the terminal hold */
        const want = d.path[blanks[bi]], g = activeGhost();
        g.className = "seq-cell filled unit-glow"; g.textContent = want; setTimeout(()=> g.classList.remove("unit-glow"), 700);
        const tile = [...tray.children].find(x=> x._num === want && !x.classList.contains("used")); if(tile) tile.classList.add("used");
        bi++;
        if(bi >= blanks.length){
          state.locked = true; stopNudge();
          SwiftPAL.emit("sequence_complete_correct", { slide_id: slide.id, phase: slide.phase, value: !revealedAny,
            attempts: state.attempts + 1, latency_ms: Date.now()-state.slideStart });
          celebrateThenAdvance(slide, revealedAny);
        } else markActive();
      };
      markActive();
      tray.querySelectorAll(".seq-tile").forEach(t=>{
        t.onclick = ()=>{
          if(state.locked || bi >= blanks.length || t.classList.contains("used")) return;
          stopNudge();
          if(t._num === d.path[blanks[bi]]){ wrongStreak = 0; placeCorrect(); }
          else {
            state.attempts++;
            t.classList.add("shake"); setTimeout(()=> t.classList.remove("shake"), 420);
            activeGhost().classList.add("shake"); setTimeout(()=> activeGhost().classList.remove("shake"), 420);
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            $("hintBtn").classList.add("show","hint-glow");
            if(++wrongStreak >= (CARD.scaffold_rules.max_attempts || 2)){
              revealedAny = true; wrongStreak = 0;
              activeGhost().classList.add("reveal-glow");
              play(audioFor(slide, "reveal") || audioFor(slide, "hint") || null, ()=>{});
              /* [28l] was: setTimeout(placeCorrect, 1000) — the engine ANSWERED for the child. */
              if(maySolveFor(slide)) setTimeout(()=> placeCorrect(), 1000);
              else terminalHold([...tray.children].find(x=> x._num === d.path[blanks[bi]]
                                  && !x.classList.contains("used")), tray.children, slide);
            } else dragWrong(slide);
          }
        };
      });
      setNavActive(false); $("navBtn").onclick = ()=>{};   // completion is automatic — never gate a solved path
      $("hintBtn").onclick = ()=>{ if(!state.locked && bi < blanks.length){ const g = activeGhost();
        g.classList.add("reveal-glow"); setTimeout(()=> g.classList.remove("reveal-glow"), 800); } };
    }
  },

  SEQUENCE_NEXT: {
    // PICK test (what comes next / before): a number path with ONE '?' cell (null in data.path) is the
    // stimulus; the child taps the correct numeral option. Reuses mountTapOptions → full tap-to-answer
    // contract (wrong=buzz+✗+lock+try_again, right=confetti+advance) + speak-the-number-on-tap +
    // mastery scoring. data:{path:[n…,null,…], options:[{num, audio:"vo_num_N", correct}]}.
    mount(host, slide){
      const d = slide.data;
      const stim = document.createElement("div"); stim.className = "seq-stage";
      const path = document.createElement("div"); path.className = "seq-path";
      const cw = d.path.length > 7 ? 74 : 90;
      d.path.forEach((n,i)=>{
        if(i){ const con = document.createElement("div"); con.className = "seq-connector"; path.appendChild(con); }
        const cell = document.createElement("div");
        cell.style.width = cell.style.height = cw+"px"; cell.style.fontSize = Math.round(cw*0.56)+"px";
        if(n === null){ cell.className = "seq-cell seq-ghost active"; cell.innerHTML = '<span class="seq-q">?</span>'; }
        else { cell.className = "seq-cell filled"; cell.textContent = n; }
        path.appendChild(cell);
      });
      stim.appendChild(path);
      mountTapOptions({
        slide, host, signalName: "sequence_next_correct", stimulus: stim,
        options: d.options,
        optionRenderer: (o)=>{ const cell = document.createElement("div"); const s = document.createElement("span");
          s.className = "seq-optnum"; s.textContent = o.num; cell.appendChild(s); return cell; },
        isCorrect: (o)=> o.correct === true,
        mastery: slide.phase === "mastery",
        columnsHint: d.options.length,
        nudgeTarget: null
      });
    }
  },

  /* ===== ORDERING / SERIATION (MTKGA02_L02_S02 — "orders three objects by size, length, or weight") =====
     Additive modules sharing the .ord-* skin. Objects render at true magnitude (size scale / bar length);
     weight is assessed by 'pick the heaviest' (weight is not visual) — targeting the bigger=heavier
     misconception with a big-but-light distractor. */

  MEET_ORDER: {
    // TEACH BY DOING: the 3 objects are shown already in order (small→big / short→long / light→heavy);
    // the child taps each left→right to hear its rank name (सबसे छोटा / बीच का / सबसे बड़ा etc.), then an
    // explain line plays and नav unlocks. data:{by, items:[{mag,img/emoji/color}] (ascending), rank_audio:[id…],
    // arrow_lo, arrow_hi, hint_icon?}.
    mount(host, slide){
      const d = slide.data; state.ownsAudio = true; setNavActive(false); setSwMood("teach");
      const stage = document.createElement("div"); stage.className = "ord-stage ord-" + d.by;
      const arrow = document.createElement("div"); arrow.className = "ord-arrow";
      arrow.innerHTML = `<span>${d.arrow_lo||""}</span><span class="ord-arrowline"></span><span>${d.arrow_hi||""}</span>`;
      const row = document.createElement("div"); row.className = "ord-tray";
      const cells = d.items.map((o,i)=>{ const el = document.createElement("div"); el.className = "ord-item";
        el.style.opacity = ".5"; el.innerHTML = renderOrdObj(o, d.by); row.appendChild(el); return el; });
      if(d.hint_icon){ const hi = document.createElement("div"); hi.className = "ord-hint-icon"; hi.textContent = d.hint_icon; stage.appendChild(hi); }
      stage.appendChild(arrow); stage.appendChild(row); host.appendChild(stage);
      let tapped = 0;
      const nudgeNext = ()=>{ cells.forEach((c,i)=> c.classList.toggle("active", i === tapped));
        if(tapped < cells.length) startNudge(slide, cells[tapped]); else stopNudge(); };
      if(d.auto){
        // 16j: Phase-1 AUTONOMOUS mode (3-phase contract) — the demo touches each item L→R by
        // ITSELF, speaks its rank, then explains + unlocks आगे. Child watches. (Mirrors auto-INTRO.)
        stopNudge();
        state.demoRunning = true;   // [24a N8] replay chip must not gen-kill the rank chain
        let ai = 0;
        const aStep = ()=>{
          if(CARD.slides[state.idx] !== slide) return;
          if(ai >= cells.length){ stopNudge();
            SwiftPAL.emit("meet_order_done", { slide_id: slide.id, phase: slide.phase });
            setTimeout(()=> play(audioFor(slide, "explain") || null, ()=>{ state.demoRunning = false; setNavActive(true); }), 300);
            return; }
          const c = cells[ai]; cells.forEach((x,j)=> x.classList.toggle("active", j === ai));
          c.style.opacity = "1"; c.classList.add("reveal-glow"); pointNudgeAt(c);
          setTimeout(()=> c.classList.remove("reveal-glow"), 600);
          const rid = d.rank_audio[ai]; ai++;
          play(rid ? "assets/Audio/" + rid + "." + AUDIO_EXT : null, ()=> setTimeout(aStep, 520));
        };
        setTimeout(aStep, 400);
      } else {
        nudgeNext();
        cells.forEach((c,i)=>{ c.onclick = ()=>{ if(i !== tapped) return; stopNudge();
          c.classList.remove("active"); c.style.opacity = "1"; c.classList.add("reveal-glow");
          setTimeout(()=> c.classList.remove("reveal-glow"), 600);
          play("assets/Audio/" + (d.rank_audio[i]) + "." + AUDIO_EXT, ()=>{}); tapped++;
          if(tapped >= cells.length){ stopNudge();
            SwiftPAL.emit("meet_order_done", { slide_id: slide.id, phase: slide.phase });
            setTimeout(()=> play(audioFor(slide, "explain") || null, ()=> setNavActive(true)), 450);
          } else nudgeNext();
        }; });
      }
      state.replayAudio = ()=> play(audioFor(slide, "explain") || null, ()=>{});
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  /* 16j NEW (g6 ordering tutorial): teach a 2-way attribute (बड़ा/छोटा · लंबा/छोटा · भारी/हल्का)
     BEFORE ordering three. Autonomous — points at each of 2 objects, speaks its label, then concludes
     + unlocks आगे. Reuses ord-stage. data:{by, items:[{img/emoji/color,mag}], label_audio:[id,id]}. */
  COMPARE_TWO: {
    mount(host, slide){
      const d = slide.data; state.ownsAudio = true; state.demoRunning = true; setNavActive(false); setSwMood("teach");   // [24a N8]
      const stage = document.createElement("div"); stage.className = "ord-stage cmp2-stage ord-" + (d.by || "size");
      const row = document.createElement("div"); row.className = "ord-tray";
      const cells = d.items.map((o)=>{ const el = document.createElement("div"); el.className = "ord-item";
        el.style.opacity = ".5"; el.innerHTML = renderOrdObj(o, d.by); row.appendChild(el); return el; });
      stage.appendChild(row); host.appendChild(stage);
      let ai = 0;
      const aStep = ()=>{
        if(CARD.slides[state.idx] !== slide) return;
        if(ai >= cells.length){ stopNudge();
          SwiftPAL.emit("compare_two_done", { slide_id: slide.id, phase: slide.phase });
          setTimeout(()=> play(audioFor(slide, "explain") || audioFor(slide, "conclude") || null, ()=>{ state.demoRunning = false; setNavActive(true); }), 300);
          return; }
        const c = cells[ai]; cells.forEach((x,j)=> x.classList.toggle("active", j === ai));
        c.style.opacity = "1"; c.classList.add("reveal-glow"); pointNudgeAt(c);
        setTimeout(()=> c.classList.remove("reveal-glow"), 600);
        const lid = (d.label_audio || [])[ai]; ai++;
        play(lid ? "assets/Audio/" + lid + "." + AUDIO_EXT : null, ()=> setTimeout(aStep, 520));
      };
      setTimeout(aStep, 400);
      state.replayAudio = ()=> play(audioFor(slide, "explain") || audioFor(slide, "conclude") || null, ()=>{});
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  ORDER_BY_ATTR: {
    // PRODUCE test: 3 scrambled objects + a left→right strip (arrow छोटा→बड़ा). Tap the smallest-remaining
    // → it fills the next slot. Wrong (not the current smallest) = shake + soft buzz + spoken try_again;
    // demonstrate after max_attempts. data:{by, items:[{mag,img/emoji/color}], arrow_lo, arrow_hi}.
    mount(host, slide){
      const d = slide.data;
      const stage = document.createElement("div"); stage.className = "ord-stage ord-" + d.by;
      const arrow = document.createElement("div"); arrow.className = "ord-arrow";
      arrow.innerHTML = `<span>${d.arrow_lo||""}</span><span class="ord-arrowline"></span><span>${d.arrow_hi||""}</span>`;
      const strip = document.createElement("div"); strip.className = "ord-strip";
      const n = d.items.length; const slots = [];
      for(let i=0;i<n;i++){ const sl = document.createElement("div"); sl.className = "ord-slot"; strip.appendChild(sl); slots.push(sl); }
      const tray = document.createElement("div"); tray.className = "ord-tray";
      const disp = d.items.slice(); for(let i=disp.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [disp[i],disp[j]]=[disp[j],disp[i]]; }
      const sortedMags = d.items.map(o=>o.mag).slice().sort((a,b)=>a-b);
      const tiles = disp.map(o=>{ const el = document.createElement("div"); el.className = "ord-item"; el._mag = o.mag;
        el.innerHTML = renderOrdObj(o, d.by); tray.appendChild(el); return el; });
      stage.appendChild(arrow); stage.appendChild(strip); stage.appendChild(tray); host.appendChild(stage);
      let placed = 0, wrongStreak = 0, revealed = false; state.locked = false; state.attempts = 0;
      const wantMag = ()=> sortedMags[placed];
      const nextTile = ()=> tiles.find(x=> !x.classList.contains("used") && x._mag === wantMag());
      const markActive = ()=>{ slots.forEach((s,i)=> s.classList.toggle("active", i === placed));
        if(placed < n) startNudge(slide, nextTile()); else stopNudge(); };
      const placeInto = (tile)=>{ const slot = slots[placed]; slot.classList.remove("active"); slot.classList.add("filled");
        slot.innerHTML = tile.innerHTML; tile.classList.add("used"); placed++;
        if(placed >= n){ state.locked = true; stopNudge();
          SwiftPAL.emit("order_by_attr_correct", { slide_id: slide.id, phase: slide.phase, value: !revealed,
            attempts: state.attempts + 1, latency_ms: Date.now()-state.slideStart });
          celebrateThenAdvance(slide, revealed);
        } else markActive();
      };
      markActive();
      tiles.forEach(t=>{ t.onclick = ()=>{ if(state.locked || t.classList.contains("used")) return; stopNudge();
        if(t._mag === wantMag()){ wrongStreak = 0; placeInto(t); }
        else { state.attempts++; t.classList.add("shake"); setTimeout(()=> t.classList.remove("shake"), 420);
          SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
          $("hintBtn").classList.add("show","hint-glow");
          if(++wrongStreak >= (CARD.scaffold_rules.max_attempts || 2)){ revealed = true; wrongStreak = 0;
            const c = nextTile(); if(c){ c.classList.add("reveal-glow"); play(audioFor(slide,"reveal")||null, ()=>{});
              setTimeout(()=>{ c.classList.remove("reveal-glow"); placeInto(c); }, 1000); }
          } else dragWrong(slide);
        }
      }; });
      setNavActive(false); $("navBtn").onclick = ()=>{};
      $("hintBtn").onclick = ()=>{ if(!state.locked){ const t = nextTile(); if(t){ t.classList.add("reveal-glow"); setTimeout(()=> t.classList.remove("reveal-glow"), 800); } } };
    }
  },

  PICK_EXTREME: {
    // PICK test: tap the object that is the MOST (सबसे बड़ा / सबसे लंबा / सबसे भारी). For weight, options
    // include a big-but-light distractor to break the bigger=heavier misconception. Reuses mountTapOptions
    // → tap-to-answer + speak-the-word-on-tap + mastery. data:{by, options:[{img/emoji/color,mag,label,audio,correct}]}.
    mount(host, slide){
      const d = slide.data;
      mountTapOptions({
        slide, host, signalName: "pick_extreme_correct", stimulus: null,
        options: d.options,
        optionRenderer: (o)=>{ const cell = document.createElement("div"); cell.className = "ord-pick";
          cell.innerHTML = renderOrdObj(o, d.by) + (o.label ? `<span class="lbl">${o.label}</span>` : ""); return cell; },
        isCorrect: (o)=> o.correct === true,
        mastery: slide.phase === "mastery",
        columnsHint: d.options.length,
        nudgeTarget: null
      });
    }
  },

  ORDER_BY_WEIGHT: {
    // PRODUCE test — WEIGHT seriation via A-vs-B COMPARISON (weight is not visual). Two pans: tap a tray
    // object → it loads the next empty pan; with BOTH loaded the beam tilts toward the heavier (it DROPS)
    // + thunk, and the lighter one RISES + pulses. Tap the lighter (risen) object to send it to the next
    // हल्का→भारी slot — accepted only if it is the lightest still unplaced; else it is the lighter of a
    // heavy pair (an even lighter one exists) → soft buzz + try_again, both return. The last object
    // auto-places (it is forced). Objects render at sizes that DON'T match weight (a big balloon can be
    // light) so the SCALE is the only cue. data:{items:[{wmag,dmag,img,emoji}], arrow_lo, arrow_hi}.
    mount(host, slide){
      const d = slide.data;
      const stage = document.createElement("div"); stage.className = "ord-stage ord-weight";
      const arrow = document.createElement("div"); arrow.className = "ord-arrow";
      arrow.innerHTML = `<span>${d.arrow_lo||"हल्का"}</span><span class="ord-arrowline"></span><span>${d.arrow_hi||"भारी"}</span>`;
      const scale = document.createElement("div"); scale.className = "owt-scale";
      scale.innerHTML = `<div class="owt-foot"></div><div class="owt-post"></div>` +
        `<div class="owt-beamwrap"><div class="owt-beam"></div><div class="owt-cap"></div>` +
        `<div class="owt-arm l"></div><div class="owt-arm r"></div>` +
        `<div class="owt-pan l"><div class="owt-load"></div></div><div class="owt-pan r"><div class="owt-load"></div></div></div>`;
      const beamwrap = scale.querySelector(".owt-beamwrap");
      const panEl = { l: scale.querySelector(".owt-pan.l"), r: scale.querySelector(".owt-pan.r") };
      const loadEl = { l: panEl.l.querySelector(".owt-load"), r: panEl.r.querySelector(".owt-load") };
      const strip = document.createElement("div"); strip.className = "ord-strip";
      const n = d.items.length; const slots = [];
      for(let i=0;i<n;i++){ const sl = document.createElement("div"); sl.className = "ord-slot"; strip.appendChild(sl); slots.push(sl); }
      const tray = document.createElement("div"); tray.className = "ord-tray";
      const disp = d.items.slice(); for(let i=disp.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [disp[i],disp[j]]=[disp[j],disp[i]]; }
      const sortedW = d.items.map(o=>o.wmag).slice().sort((a,b)=>a-b);
      const tiles = disp.map(o=>{ const el = document.createElement("div"); el.className = "ord-item"; el._o = o; el._w = o.wmag; el._onpan = false;
        el.innerHTML = renderOrdObj({ mag: o.dmag, img: o.img, emoji: o.emoji }, "size"); tray.appendChild(el); return el; });
      stage.appendChild(arrow); stage.appendChild(scale); stage.appendChild(strip); stage.appendChild(tray);
      host.appendChild(stage);

      let placed = 0, wrongStreak = 0, revealed = false, busy = false; state.locked = false; state.attempts = 0;
      const pans = { l: null, r: null };
      const wantW = ()=> sortedW[placed];
      const nextTile = ()=> tiles.find(x=> !x.classList.contains("used") && x._w === wantW());
      const remaining = ()=> tiles.filter(x=> !x.classList.contains("used"));
      const markActive = ()=>{ slots.forEach((s,i)=> s.classList.toggle("active", i === placed));
        if(placed < n && !pans.l && !pans.r){ const t = nextTile(); if(t && !t._onpan) startNudge(slide, t); } else stopNudge(); };
      const resetPans = ()=>{ ["l","r"].forEach(k=>{ const t = pans[k]; if(t){ t._onpan = false; t.style.visibility = ""; }
        loadEl[k].innerHTML = ""; loadEl[k].classList.remove("lighter"); pans[k] = null; }); beamwrap.style.transform = "rotate(0deg)"; };
      const loadPan = (k, t)=>{ pans[k] = t; t._onpan = true; t.style.visibility = "hidden"; loadEl[k].innerHTML = imgOrEmojiSized(t._o.img, t._o.emoji, 56); };
      const compare = ()=>{ beamwrap.style.transform = `rotate(${(pans.r._w - pans.l._w) * 7}deg)`;   // heavier side drops
        btThunk(Math.max(pans.l._w, pans.r._w)); const lightK = pans.l._w < pans.r._w ? "l" : "r";
        loadEl[lightK].classList.add("lighter"); loadEl[lightK === "l" ? "r" : "l"].classList.remove("lighter"); };
      const placeToSlot = (t, cb)=>{ const slot = slots[placed]; slot.classList.remove("active"); slot.classList.add("filled");
        slot.innerHTML = renderOrdObj({ mag: t._o.dmag, img: t._o.img, emoji: t._o.emoji }, "size"); t.classList.add("used"); t._onpan = false; placed++;
        if(placed >= n){ state.locked = true; stopNudge();
          SwiftPAL.emit("order_by_weight_correct", { slide_id: slide.id, phase: slide.phase, value: !revealed,
            attempts: state.attempts + 1, latency_ms: Date.now()-state.slideStart });
          celebrateThenAdvance(slide, revealed);
        } else markActive();
        if(cb) cb();
      };
      // when only one object remains it is forced — weigh it alone briefly, then place it.
      const autoLast = ()=>{ if(state.locked) return; const rem = remaining(); if(rem.length !== 1){ markActive(); return; }
        busy = true; const t = rem[0]; loadPan("l", t); beamwrap.style.transform = "rotate(-9deg)"; btThunk(t._w);
        setTimeout(()=>{ loadEl.l.innerHTML = ""; beamwrap.style.transform = "rotate(0deg)"; placeToSlot(t, ()=>{ busy = false; }); }, 850); };
      // tray tap → load the next empty pan (compare once both are full)
      tiles.forEach(t=>{ t.onclick = ()=>{ if(state.locked || busy || t.classList.contains("used") || t._onpan) return; stopNudge();
        if(!pans.l){ loadPan("l", t); }
        else if(!pans.r){ loadPan("r", t); compare(); }
      }; });
      // pan tap → try to place that pan's object (must be the LIGHTER of the two AND the lightest unplaced)
      ["l","r"].forEach(k=>{ panEl[k].onclick = ()=>{ if(state.locked || busy || !pans.l || !pans.r) return;
        const t = pans[k], other = pans[k === "l" ? "r" : "l"];
        if(t._w > other._w){ const lk = pans.l._w < pans.r._w ? "l" : "r";   // tapped the heavier one → re-pulse the lighter (hint), no penalty
          loadEl[lk].classList.remove("lighter"); void loadEl[lk].offsetWidth; loadEl[lk].classList.add("lighter"); return; }
        if(t._w === wantW()){ busy = true; wrongStreak = 0;   // correct: lighter AND globally lightest
          other._onpan = false; other.style.visibility = "";
          loadEl.l.innerHTML = ""; loadEl.r.innerHTML = ""; loadEl.l.classList.remove("lighter"); loadEl.r.classList.remove("lighter");
          pans.l = null; pans.r = null; beamwrap.style.transform = "rotate(0deg)";
          placeToSlot(t, ()=> setTimeout(()=>{ busy = false; autoLast(); }, 250));
        } else {   // lighter of the pair, but an even lighter one is still unplaced
          state.attempts++; SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts }); $("hintBtn").classList.add("show","hint-glow");
          if(++wrongStreak >= (CARD.scaffold_rules.max_attempts || 2)){ revealed = true; wrongStreak = 0; resetPans();
            const c = nextTile(); if(c){ c.classList.add("reveal-glow"); play(audioFor(slide, "reveal") || null, ()=>{});
              setTimeout(()=>{ c.classList.remove("reveal-glow"); busy = true; placeToSlot(c, ()=> setTimeout(()=>{ busy = false; autoLast(); }, 250)); }, 900); } }
          else { dragWrong(slide); resetPans(); }
        }
      }; });
      markActive();
      setNavActive(false); $("navBtn").onclick = ()=>{};
      $("hintBtn").onclick = ()=>{ if(!state.locked && !busy){ const t = nextTile(); if(t && !t._onpan){ t.classList.add("reveal-glow"); setTimeout(()=> t.classList.remove("reveal-glow"), 800); } } };
    }
  },

  BUILD_TO_NUMBER: {
    // Signature produce module. data: {target, mode:'guided'|'independent', topper, friend, goal_hi,
    // skyline_done, skyline_total}. Guided = dashed blueprint, auto-completes on fill. Independent =
    // free stack + "बन गया!" serve with world-enacted feedback (short/teeter, never a ✗). Ascending-
    // pitch thunk + spoken एक/दो/… per block. Geometry via offsets (throttle-safe).
    mount(host, slide){
      const d = slide.data, N = d.target, mode = d.mode || "independent";
      const stage = document.createElement("div"); stage.className = "bt-stage";
      const board = document.createElement("div"); board.className = "bt-board";
      board.innerHTML = `<span class="bt-numeral">${N}</span>` +
        (d.topper ? `<img class="bt-goalpic" src="assets/Images/${d.topper}.png" alt="">` : "") +
        (d.goal_hi ? `<span class="bt-goallbl">${d.goal_hi}</span>` : "");
      const track = document.createElement("div"); track.className = "bt-track"; const cells = [];
      for(let i=1;i<=N;i++){ const c = document.createElement("div"); c.className = "bt-nt"; track.appendChild(c); cells.push(c); }
      const yard = document.createElement("div"); yard.className = "bt-yard";
      const crane = document.createElement("div"); crane.className = "bt-crane"; crane.innerHTML = `<img src="assets/Images/obj_crane.png" alt="">`;
      const pile = document.createElement("div"); pile.className = "bt-pile";
      pile.innerHTML = `<div class="bt-pile-blocks"></div><span class="bt-pile-lbl">＋ ब्लॉक</span>`;
      const pb = pile.querySelector(".bt-pile-blocks");
      for(let i=0;i<3;i++){ const b = btBlock(i+1); b.style.left = (i*12) + "px"; b.style.bottom = (i*18) + "px"; pb.appendChild(b); }
      const plotwrap = document.createElement("div"); plotwrap.className = "bt-plotwrap";
      const plot = document.createElement("div"); plot.className = "bt-plot ground " + mode;
      plot.style.setProperty("--bh", Math.max(20, Math.min(46, Math.floor(230/N) - 2)) + "px");   // tall towers auto-shrink to fit
      plotwrap.appendChild(plot);
      const friend = document.createElement("div"); friend.className = "bt-friend";
      if(d.friend) friend.innerHTML = `<img src="assets/Images/${d.friend}.png" alt="">`;
      yard.appendChild(crane); yard.appendChild(pile); yard.appendChild(plotwrap); if(d.friend) yard.appendChild(friend);
      stage.appendChild(board); stage.appendChild(track); stage.appendChild(yard);
      if(d.skyline_total) stage.appendChild(btSkyline(d.skyline_done || 0, d.skyline_total));
      let serveBtn = null;
      if(mode === "independent"){ serveBtn = document.createElement("button"); serveBtn.type = "button"; serveBtn.className = "bt-serve"; serveBtn.textContent = "बन गया!"; stage.appendChild(serveBtn); }
      host.appendChild(stage);

      let count = 0; state.locked = false; state.attempts = 0;
      const lit = ()=> cells.forEach((c,i)=>{ const on = i < count; c.classList.toggle("lit", on); c.textContent = on ? (i+1) : ""; });
      const addSound = ()=>{ btThunk(count); btDust(plot); play("assets/Audio/vo_num_" + count + "." + AUDIO_EXT); };

      function success(){
        state.locked = true; if(serveBtn) serveBtn.disabled = true;
        if(d.topper){ const t = document.createElement("div"); t.className = "bt-topper snap"; t.innerHTML = `<img src="assets/Images/${d.topper}.png" alt="">`; plot.appendChild(t);
          if(d.topper === "top_rocket") setTimeout(()=> t.classList.add("rocket-go"), 750); }
        if(d.friend) friend.classList.add("hop");
        sfxCorrect(); burstStars();
        const lots = [...stage.querySelectorAll(".bt-bldg")]; const nextLot = lots[d.skyline_done || 0];
        if(nextLot) setTimeout(()=> nextLot.classList.add("done"), 380);
        SwiftPAL.emit("build_to_number_correct", { slide_id: slide.id, phase: slide.phase, value: true, target: N, attempts: state.attempts + 1, latency_ms: Date.now()-state.slideStart });
        play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT); setNavActive(true);
      }

      if(mode === "guided"){
        const ghosts = [];
        for(let i=0;i<N;i++){ const g = document.createElement("div"); g.className = "bp-slot"; plot.appendChild(g); ghosts.push(g); }
        ghosts[0].classList.add("next");
        pile.onclick = ()=>{ if(state.locked) return;
          const g = ghosts.find(x=> x.classList.contains("bp-slot"));
          if(!g){ showBox("", "बस इतने ही चाहिए!", "hint", null, ()=>{}); return; }
          g.className = "blk drop"; g.style.background = BT_COLORS[count % 5];
          count++; lit(); addSound();
          const nx = ghosts.find(x=> x.classList.contains("bp-slot")); if(nx) nx.classList.add("next");
          if(count === N) setTimeout(success, 280);
        };
      } else {
        pile.onclick = ()=>{ if(state.locked) return;
          const b = btBlock(count); b.classList.add("drop");
          b.onclick = (e)=>{ e.stopPropagation(); if(state.locked) return; b.remove(); count--; lit(); };
          plot.appendChild(b); count++; lit(); addSound(); };
        serveBtn.onclick = ()=>{ if(state.locked) return;
          if(count === N){ success(); return; }
          state.attempts++;
          SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts, made: count, target: N });
          if(count < N){ if(d.friend) friend.classList.add("peer");
            showBox("", "थोड़े और चाहिए!", "hint", wrongClip(slide),   /* [28i] was SILENT */ ()=>{ if(d.friend) friend.classList.remove("peer"); }); }
          else { const bs = [...plot.querySelectorAll(".blk")]; const top = bs[bs.length-1];
            if(top){ top.classList.add("wobble"); setTimeout(()=> top.classList.remove("wobble"), 520); }
            showBox("", "अरे! एक ब्लॉक हटाओ।", "hint", wrongClip(slide), ()=>{}); } };   /* [28i] was SILENT */
      }
      setNavActive(false);
      $("navBtn").onclick = ()=>{ if(state.locked) completeSlide(true); };
      pointNudgeAt(pile);
    }
  },

  MAKE_NUMBER: {
    // produce-the-numeral dial (grafted from Firefly Valley). A set of N built blocks; ＋/− dials a
    // 1–10 numeral; wrong is inert (build dim), exact match ignites the build + snaps its topper.
    mount(host, slide){
      const d = slide.data, N = d.count;
      const stage = document.createElement("div"); stage.className = "bt-stage";
      if(d.prompt2_hi){ const lbl = document.createElement("div"); lbl.className = "pat-unit-lbl"; lbl.textContent = d.prompt2_hi; stage.appendChild(lbl); }
      const yard = document.createElement("div"); yard.className = "bt-yard";
      const plotwrap = document.createElement("div"); plotwrap.className = "bt-plotwrap";
      const plot = document.createElement("div"); plot.className = "bt-plot ground"; plot.style.filter = "grayscale(.35) brightness(.95)";
      plot.style.setProperty("--bh", Math.max(20, Math.min(46, Math.floor(230/N) - 2)) + "px");
      for(let i=0;i<N;i++){ plot.appendChild(btBlock(i)); }
      plotwrap.appendChild(plot); yard.appendChild(plotwrap);
      const dial = document.createElement("div"); dial.className = "bt-dial";
      dial.innerHTML = `<button class="bt-dial-btn" data-d="-1" type="button">−</button><div class="bt-dial-val">1</div><button class="bt-dial-btn" data-d="1" type="button">＋</button>`;
      stage.appendChild(yard); stage.appendChild(dial); host.appendChild(stage);
      let val = 1; state.locked = false; const valEl = dial.querySelector(".bt-dial-val");
      const check = ()=>{ if(val === N && !state.locked){ state.locked = true; valEl.classList.add("match"); plot.style.filter = "";
        if(d.topper){ const t = document.createElement("div"); t.className = "bt-topper snap"; t.innerHTML = `<img src="assets/Images/${d.topper}.png" alt="">`; plot.appendChild(t); }
        sfxCorrect(); burstStars(); play("assets/Audio/vo_total_" + N + "." + AUDIO_EXT);
        SwiftPAL.emit("make_number_correct", { slide_id: slide.id, phase: slide.phase, value: true, count: N, latency_ms: Date.now()-state.slideStart });
        setNavActive(true); } };
      dial.querySelectorAll(".bt-dial-btn").forEach(btn=> btn.onclick = ()=>{ if(state.locked) return;
        val = Math.max(1, Math.min(10, val + parseInt(btn.dataset.d, 10))); valEl.textContent = val; sfxTap(); check(); });
      setNavActive(false); $("navBtn").onclick = ()=>{ if(state.locked) completeSlide(true); };
    }
  },

  TAP_LETTER_BY_NAME: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "letter_name_first_try",
        stimulus: null,
        options: slide.data.options,
        isCorrect: (opt) => opt.letter === slide.data.target,
        optionRenderer: (opt) => letterCell(opt.letter)
      });
    }
  },

  TAP_LETTER_BY_SOUND: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "letter_sound_first_try",
          /* [28m] NO VOLUME BUTTON, ANYWHERE. Yasir 2026-07-28: "we use vol button nowhere. if
             nothing then we keep question only." This stimulus had NO image, so 28c left its 🔊 +
             "सुनो" chip alone and flagged it — stripping it looked like it would leave a blank card.
             The ruling settles it: nothing to show => show the QUESTION only, no chip. The chip was
             also the only way to re-hear the sound, so that function moves to the header replay
             (state.replayAudio, set after mount) instead of dying with the affordance. */
          stimulus: null,
        options: slide.data.options,
        isCorrect: (opt) => opt.letter === slide.data.target,
        optionRenderer: (opt) => letterCell(opt.letter)
      });
        /* [28m] the removed chip was the only way to re-hear the sound — keep the FUNCTION on the
           header replay. Set AFTER mount so mountTapOptions cannot overwrite it. */
        state.replayAudio = ()=>{ state.audioReplays++; play(audioFor(slide,"phoneme") || null, ()=>{}); };
    }
  },

  TAP_PICTURE_BY_LETTER: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "letter_image_match_first_try",
        stimulus: stimulusLetter(slide.data.target_letter),
        options: slide.data.options,
        isCorrect: (opt) => opt.correct === true,
        optionRenderer: (opt) => pictureCell(opt.picture, opt.emoji, opt.img)
      });
    }
  },

  TAP_LETTER_BY_PICTURE: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "image_letter_match_first_try",
        stimulus: stimulusPic(slide.data.picture, slide.data.emoji, slide.data.img),
        options: slide.data.options,
        isCorrect: (opt) => opt.letter === slide.data.target,
        optionRenderer: (opt) => letterCell(opt.letter)
      });
    }
  },

  ODD_ONE_OUT: {
    mount(host, slide){
      const sig = (slide.signals && slide.signals.on_complete && slide.signals.on_complete[0]) || "letter_recognise_first_try";
      const useShape = slide.data.options.some(o => o.shape);
      const usePic = slide.data.options.some(o => o.picture || o.word_hi || o.img);
      mountTapOptions({
        slide, host, signalName: sig,
        stimulus: null,
        options: slide.data.options,
        columnsHint: 4,
        isCorrect: (opt) => opt.is_odd === true,
        optionRenderer: (opt) => useShape
          ? shapeCell(opt)
          : usePic
            ? pictureCell(opt.word_hi || opt.picture, opt.emoji, opt.img)
            : letterCell(opt.letter),
        mastery: slide.phase === "mastery"
      });
    }
  },

  TAP_GENDER: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "gender_match_first_try",
        stimulus: stimulusPic(slide.data.noun.word_hi, slide.data.noun.emoji, slide.data.noun.img),
        options: slide.data.options,
        columnsHint: 2,
        isCorrect: (opt) => opt.gender === slide.data.target_gender,
        optionRenderer: (opt) => genderLabelCell(opt.label, opt.gender),
        mastery: slide.phase === "mastery"
      });
    }
  },

  TAP_PICTURE_BY_GENDER: {
    mount(host, slide){
      mountTapOptions({
        slide, host, signalName: "gender_match_first_try",
        stimulus: stimulusGender(slide.data.label, slide.data.target_gender),
        options: slide.data.options,
        // tap-to-answer needs ONE unambiguous key — author marks the single intended picture
        // with correct:true (matches every other TAP_* module). The old `|| gender===target`
        // fallback silently accepted any same-gender distractor, defeating buzz+✗+lock.
        isCorrect: (opt) => opt.correct === true,
        optionRenderer: (opt) => pictureCell(opt.word_hi, opt.emoji, opt.img),
        mastery: slide.phase === "mastery"
      });
    }
  },

  GENDER_INTRO: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "gender-cats";
      const cats = slide.data.categories;
      const tapped = new Set();
      let _autoDone = false;   // [24a A3] auto walk-through: taps ignored until every category is taught
      const cardEls = [];
      cats.forEach(cat => {
        const card = document.createElement("div");
        card.className = "gender-cat " + (cat.gender === "F" ? "fem" : "masc");
        card.innerHTML =
          `<div class="cat-title">${cat.label}</div>` +
          imgOrEmoji(cat.anchor.img, cat.anchor.emoji, "cat-pic", "cat-emoji") +
          `<div class="cat-word">${cat.anchor.word_hi}</div>`;
        card.onclick = ()=>{
          // [24a A3] during the auto walk-through the cards are NOT tappable — a tap would gen-kill
          // the demo's own chain (echo guard) and stall it. After teaching completes, tap = replay.
          if(slide.data.auto && !_autoDone) return;
          card.classList.add("played");
          playChain(["assets/Audio/" + cat.label_audio + "." + AUDIO_EXT, "assets/Audio/" + cat.name_audio + "." + AUDIO_EXT], 0);
          tapped.add(cat.gender);
          SwiftPAL.emit("gender_intro_tap", { slide_id: slide.id, gender: cat.gender });
          if(tapped.size >= cats.length){ stopNudge(); setNavActive(true); }
        };
        wrap.appendChild(card); cardEls.push(card);
      });
      host.appendChild(wrap);
      // 16m: AUTONOMOUS demo (data.auto) — point at each category, auto-play its label + anchor word,
      // then unlock आगे. Replaces passive touch-to-hear (3-phase contract).
      if(slide.data.auto){
        state.ownsAudio = true; state.demoRunning = true; setNavActive(false); setSwMood("teach");
        let ci = 0, _done = false;
        const finish = ()=>{ if(_done) return; _done = true; stopNudge();
          _autoDone = true; state.demoRunning = false;   // [24a A3/N8] teaching over → taps replay, chip re-enabled
          state.replayAudio = ()=> playChain(cats.reduce((a,c)=> a.concat(["assets/Audio/" + c.label_audio + "." + AUDIO_EXT, "assets/Audio/" + c.name_audio + "." + AUDIO_EXT]), []), 0, ()=>{});
          $("navBtn").onclick = ()=> completeSlide(true); setNavActive(true); };
        const step = ()=>{
          if(CARD.slides[state.idx] !== slide) return;
          if(ci >= cats.length){ finish(); return; }
          const cat = cats[ci], el = cardEls[ci]; el.classList.add("played"); pointNudgeAt(el); ci++;
          playChain(["assets/Audio/" + cat.label_audio + "." + AUDIO_EXT, "assets/Audio/" + cat.name_audio + "." + AUDIO_EXT], 0, ()=> setTimeout(step, 500));
        };
        $("navBtn").onclick = ()=> completeSlide(true);
        setTimeout(step, 400);
        setTimeout(()=>{ if(CARD.slides[state.idx] === slide) finish(); }, cats.length * 4500 + 3000);   // FAIL-SAFE: never dead-button
        return;
      }
      state.gateNavUntilAudio = true;   // nav unlocks after the concept VO
      setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  MEET_GENDER: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "meet-gender";
      const n = slide.data.noun;
      wrap.innerHTML =
        `<div class="meet-pic-box">${imgOrEmoji(n.img, n.emoji, "pic-img", "pic-emoji")}<span class="pic-label">${n.word_hi}</span></div>` +
        `<div class="meet-arrow">→</div>` +
        `<div class="gender-badge${slide.data.gender === "F" ? " fem" : ""}">${slide.data.label}</div>`;
      host.appendChild(wrap);
      // 16m: AUTONOMOUS demo (data.auto) — point at the word + speak the model line, then point at the
      // ए/ऐ matra badge + speak it, then unlock आगे. Kills passive show-and-tell (3-phase contract).
      if(slide.data.auto){
        state.ownsAudio = true; state.demoRunning = true; setNavActive(false); setSwMood("teach");   // [24a N8]
        const steps = [];
        const picEl = wrap.querySelector(".meet-pic-box"), badgeEl = wrap.querySelector(".gender-badge");
        if(picEl) steps.push([picEl, audioFor(slide, "prompt")]);
        if(badgeEl) steps.push([badgeEl, slide.data.label_audio ? "assets/Audio/" + slide.data.label_audio + "." + AUDIO_EXT : null]);
        let si = 0, _done = false;
        const finish = ()=>{ if(_done) return; _done = true; stopNudge(); state.demoRunning = false; $("navBtn").onclick = ()=> completeSlide(true); setNavActive(true); };
        const step = ()=>{
          if(CARD.slides[state.idx] !== slide) return;
          if(si >= steps.length){ finish(); return; }
          const p = steps[si]; si++; pointNudgeAt(p[0]); play(p[1] || null, ()=> setTimeout(step, 450));
        };
        $("navBtn").onclick = ()=> completeSlide(true);
        state.replayAudio = ()=> play(audioFor(slide, "prompt") || null, ()=>{});
        setTimeout(step, 400);
        setTimeout(()=>{ if(CARD.slides[state.idx] === slide) finish(); }, steps.length * 4000 + 3000);   // FAIL-SAFE: never dead-button
        return;
      }
      state.gateNavUntilAudio = true;   // nav unlocks after the model VO
      setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  SORT_GENDER: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "sort-stage";
      const binsRow = document.createElement("div"); binsRow.className = "sort-bins";
      slide.data.bins.forEach(b => {
        const bin = document.createElement("div");
        bin.className = "sort-bin dd-zone" + (b.gender === "F" ? " fem" : "");   // dd-zone → drop detection
        bin.dataset.gender = b.gender;
        bin.innerHTML = `<div class="bin-title">${b.label}</div><div class="bin-items"></div>`;
        binsRow.appendChild(bin);
      });
      const tray = document.createElement("div"); tray.className = "sort-tray";
      const items = slide.data.items.slice().sort(()=> Math.random() - 0.5);
      items.forEach(it => {
        const t = document.createElement("div"); t.className = "sort-item";
        t.dataset.gender = it.gender; if(it.audio) t.dataset.audio = it.audio;   // [20a SORT-01]
        t.innerHTML = imgOrEmoji(it.img, it.emoji, "img", "emoji") + `<span class="lbl">${it.word_hi}</span>`;
        tray.appendChild(t);
      });
      wrap.appendChild(binsRow); wrap.appendChild(tray);
      host.appendChild(wrap);

      state.attempts = 0; state.locked = false;
      let placed = 0; const need = slide.data.items.length;
      /* [28p] SORT_GENDER WAS THE SIXTH TERMINAL-HELP PATH WITH NO TERMINAL HELP AT ALL.
         Measured: its wrong branch buzzed and spoke try_again and did nothing else — no attempt
         ceiling, no glow, no dimming, no hand — so a child could be wrong indefinitely with no
         escalation, and a GUIDED sort could never earn the hand that Yasir's 2026-07-28 ruling
         grants after 2 failed attempts. Counted PER TILE, like MATCH_DRAG_N (25d): a slide-wide
         streak that any correct drop resets lets one hard item ride on the others' successes. */
      const _sgWrong = new Map();
      if(slide.data.reveal_seq) sortSeqReveal(tray, slide);   // [20a SORT-01] opt-in
      /* [S01r4v] DRAG DEMO - SME: "show how to drag the element into the box, currently it feels
         confusing". travelNudge already animates the hand from one element to another, and its own
         gate is HAND_PHASES (tutorial + guided), so this page qualifies; it has simply never been
         called from anywhere but terminalHold, i.e. only as help EARNED by two wrong drops.
         Two deliberate choices:
           - it travels to the BINS ROW, not to the correct basket. travelNudge centres on whatever
             element it is handed, so the row's centre is the midpoint BETWEEN the two baskets: the
             child is shown the GESTURE without being shown the ANSWER.
           - opt-in on data.drag_demo, so no other sort slide changes behaviour.
         FOR REVIEW: [28f] says guided earns a hand only after 2 failed attempts. That ruling is about
         hints carrying the ANSWER; this one carries the MECHANIC and deliberately points nowhere
         useful. Flagged in CHANGES.md so the SME can overrule. It waits out the one-by-one reveal and
         the prompt VO, then stops on the very first press and never comes back. */
      /* [S01r5n] WATCH FIRST. The SME asked for a page before the sort where "user won't do
         anything - we'll just show how to do things". So this one narrates itself: it waits out the
         tray reveal and the instruction, then for each tile names the picture, sends the hand
         travelling to the right box and flies the tile along with it. Input is off throughout (see
         the auto_demo return in the tile loop above), and आगे unlocks once the board is full. */
      if(slide.data.auto_demo){
        state.ownsAudio = true; state.demoRunning = true; setNavActive(false);
        let di = 0, demoEnded = false;
        const demoTiles = [...tray.children];
        const endDemo = ()=>{
          if(demoEnded) return; demoEnded = true;
          stopNudge(); state.demoRunning = false; state.locked = true;   /* stays locked: nothing to do here */
          /* [S01r5r] AUTO-ADVANCE. On a watch-first page there is nothing to do, so आगे would be a
             gate with no question behind it - the SME asked for the page to hand over by itself.
             The stage class hides the pill for the whole slide (see .stage.auto-adv), so it never
             appears and then vanishes. The beat lets the last tile settle before the screen moves. */
          if(slide.data.auto_advance){
            setTimeout(()=>{ if(CARD.slides[state.idx] === slide) completeSlide(true); }, 1100);
            return;
          }
          setNavActive(true); $("navBtn").onclick = ()=> completeSlide(true);
        };
        const flyNext = ()=>{
          if(CARD.slides[state.idx] !== slide) return;
          if(di >= demoTiles.length){
            play(audioFor(slide, "correct") || null, ()=> setTimeout(endDemo, 500));
            return;
          }
          const t = demoTiles[di++];
          const goal = [...binsRow.children].find(b => b.dataset.gender === t.dataset.gender) || binsRow;
          speakNoLock(t.dataset.audio);                       /* name it, without taking the VO lock */
          setTimeout(()=>{
            if(CARD.slides[state.idx] !== slide) return;
            travelNudge(t, goal, slide, 1);                   /* the hand leads... */
            setTimeout(()=> flyTileTo(t, goal, ()=> setTimeout(flyNext, 600)), 320);  /* ...the tile follows */
          }, 950);
        };
        const armAuto = ()=>{
          if(CARD.slides[state.idx] !== slide) return;
          if(state.revealing || isPlaying){ setTimeout(armAuto, 300); return; }
          state.locked = true;                                 /* belt and braces over the tile guard */
          flyNext();
        };
        setTimeout(armAuto, 600);
        setTimeout(()=>{ if(CARD.slides[state.idx] === slide) endDemo(); }, 26000);   /* never a dead आगे */
      }
      if(slide.data.drag_demo){
        const _demoOff = ()=>{ stopNudge(); document.removeEventListener("pointerdown", _demoOff, true); };
        const _armDemo = ()=>{
          if(CARD.slides[state.idx] !== slide) return;                            // navigated away
          if(state.revealing || isPlaying){ setTimeout(_armDemo, 300); return; }   // reveal/prompt still running
          if(state.locked || placed > 0) return;                                   // solved or locked already
          /* [S01r4x] aim at the BASKET the first tile belongs in, not at the bins ROW. r4v pointed
             at the row so the demo could not reveal an answer - but the row's centre is the empty gap
             BETWEEN the two boxes, so the gesture read as "drag upwards into nothing". The SME asked
             to "show the hand going towards the box". This does reveal one of the four pairings; the
             child still makes every drop themselves and the demo stops after 3 passes. In CHANGES so
             it can be overruled. */
          const _first = tray.children[0];
          const _goal = [...binsRow.children].find(b => b.dataset.gender === _first.dataset.gender) || binsRow;
          travelNudge(_first, _goal, slide, 3);
          document.addEventListener("pointerdown", _demoOff, true);
        };
        setTimeout(_armDemo, 600);
      }
      [...tray.children].forEach(tile => {
        /* [S01r5n] the watch-first page takes no input at all - no pick-up speech, no drag. */
        if(slide.data.auto_demo) return;
        /* [S01r4s] SPEAK ON PICK-UP - "when the child taps or picks up an image, play its name",
           so the child can decide which basket BEFORE dragging. makeDraggable exposes opts.onTap for
           a tap but nothing for a grab, and this mechanic passed no opts at all: the only places the
           word was ever spoken were the one-by-one tray reveal and the correct-drop echo below.
           A pointerdown listener is the idiom MATCH_DRAG_N already uses and that installDragVoGate
           is written around - the gate runs in the CAPTURE phase and swallows the press while a
           prior VO is still sounding, so this can never cut the instruction line. */
        tile.addEventListener("pointerdown", ()=>{
          if(state.locked || state.revealing) return;
          if(tile.classList.contains("snapped")) return;
          speakNoLock(tile.dataset.audio);   /* [S01r4t] NOT play() - see speakNoLock */
        });
        makeDraggable(tile, (zone, t) => {
          const bin = zone.closest(".sort-bin"); if(!bin) return;
          state.attempts++;
          if(bin.dataset.gender === t.dataset.gender){
            leaveTrayGhost(t);   // [24a A5] capture the tray-slot size before .snapped shrinks/moves it
            t.classList.add("snapped");
            bin.querySelector(".bin-items").appendChild(t);
            placed++; _sgWrong.delete(t);          /* [28p] this tile is done */
            /* [28u] RELEASE THE TERMINAL HOLD ON A CORRECT DROP — this slide was UNWINNABLE.
               28p armed the terminal rung here but the correct-drop branch cleared none of it:
               terminalHold() puts .reveal-hold on the tile, .tile-disabled plus INLINE
               pointer-events:none/opacity:.4 on every OTHER tile, marks the bins, and starts
               travelNudge's looping hand. So once the child finally got the drop right, the hand kept
               looping over the empty ghost slot and every remaining tile stayed dead — `placed === need`
               could never be reached, which is a soft-lock, i.e. a straight QA fail rather than a
               cosmetic bug. Found and reproduced with real pointer drags on G3 and G6 by
               HI01H05_L01_S01, which asked for this to be fixed first.
               clearHold() already existed for exactly this and also removes the INLINE styles — the
               class alone would not, which is why a class-only cleanup looks right and still leaves the
               tiles dead. helpShown/scaffoldLevel reset so the NEXT hard tile can earn its own rung:
               the ladder in this mechanic is per-tile (_sgWrong), not per-slide.
               Guarded on state.helpShown so a slide that never armed a rung is untouched — and note
               this is a guard on CLEANUP, not the `state.helpShown` early-RETURN that stranded a card
               red in 28r. Deliberately NOT lifting the sibling `speak_on_drop` gate from the same local
               diff: that was a per-game ruling, and defaulting speak-on-match off fleet-wide would
               silently mute games that rely on it. */
            if(state.helpShown){
              stopNudge();
              t.classList.remove("reveal-hold");
              clearHold(tray); clearHold(binsRow);
              state.helpShown = false; state.scaffoldLevel = 0;
            }
            /* [S01r4s] speak-on-match dropped: the name is spoken on PICK-UP now, so saying it
               again a second later on the drop is an echo, not information. */
            SwiftPAL.emit("gender_sort_item", { slide_id: slide.id, gender: t.dataset.gender, attempts: state.attempts });
            if(placed === need){
              state.locked = true;
              SwiftPAL.emit("gender_sort_correct", {
                slide_id: slide.id, phase: slide.phase, value: true,
                attempts: state.attempts, latency_ms: Date.now() - state.slideStart
              });
              setTimeout(()=> celebrateThenAdvance(slide, false), 250);   // standard: confetti + VO + auto-advance, no popup
            }
          } else {
            bin.classList.add("hover"); bin.style.borderColor = "var(--wrong)";
            setTimeout(()=>{ bin.classList.remove("hover"); bin.style.borderColor = ""; }, 500);
            /* [S01r4s] "gently shake and return to its original position". Only the BIN flashed red;
               the tile itself had no feedback at all. makeDraggable already clears the transform on a
               rejected drop, so the return home was free - this adds the shake it was missing. */
            t.classList.add("sort-shake"); setTimeout(()=> t.classList.remove("sort-shake"), 430);
            dragWrong(slide);   // buzz + Swiftie + spoken try_again (pre-readers need the spoken recovery)
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            /* [28p] terminal rung, via the SAME contract every other mechanic uses (28l/28o): glow the
               correct bin, dim the other bins, travel the hand from the tile to that bin, and WAIT — the
               child still makes the drop. maySolveFor() is not consulted because nothing is auto-solved
               here; terminalHold/travelNudge carry the phase rule themselves. */
            const _n = (_sgWrong.get(t) || 0) + 1; _sgWrong.set(t, _n);
            if(_n >= ((CARD.scaffold_rules && CARD.scaffold_rules.max_attempts) || 3)){
              const _goal = [...binsRow.children].find(b => b.dataset.gender === t.dataset.gender);
              if(_goal){
                _goal.classList.add("reveal-hold");
                [...binsRow.children].forEach(b => { if(b !== _goal) b.classList.add("tile-disabled"); });
                terminalHold(t, tray.children, slide, _goal);
                state.helpShown = true; state.scaffoldLevel = 3;
                SwiftPAL.emit("answer_revealed", { slide_id: slide.id, phase: slide.phase,
                                                   attempts: state.attempts, reason: "wrong" });
              }
            }
          }
        });
      });
    }
  },

  MATCH_GENDER_PAIRS: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "dd-stage";
      const zoneRow = document.createElement("div"); zoneRow.className = "dd-row";
      const zones = slide.data.pairs.slice().sort(()=> Math.random() - 0.5);
      zones.forEach(p => {
        const z = document.createElement("div"); z.className = "dd-zone"; z.dataset.accept = p.id;
        z.innerHTML = imgOrEmoji(p.f.img, p.f.emoji, "zone-img", "zone-emoji") + `<span class="zone-lbl">${p.f.word_hi}</span>`;
        zoneRow.appendChild(z);
      });
      const tileRow = document.createElement("div"); tileRow.className = "dd-row"; tileRow.style.marginTop = "34px";
      const tiles = slide.data.pairs.slice().sort(()=> Math.random() - 0.5);
      tiles.forEach(p => {
        const t = document.createElement("div"); t.className = "dd-tile pic-tile"; t.dataset.pairId = p.id;
        t.innerHTML = imgOrEmoji(p.m.img, p.m.emoji, "zone-img", "zone-emoji") + `<span class="zone-lbl">${p.m.word_hi}</span>`;
        tileRow.appendChild(t);
      });
      wrap.appendChild(zoneRow); wrap.appendChild(tileRow);
      host.appendChild(wrap);

      state.attempts = 0; state.locked = false;
      let filled = 0, wrongStreak = 0, revealed = false; const need = slide.data.pairs.length;
      const settle = (zone, t)=>{                       // the one correct-placement path (drop AND reveal)
        zone.classList.add("filled","correct");
        // grey the matched masculine tile in place (pictures don't badge well)
        t.classList.add("matched"); t.style.transform = "";
        filled++;
        if(filled === need){ state.locked = true; setTimeout(()=> celebrateThenAdvance(slide, revealed), 250); }
      };
      // A8 reveal ceiling: after max consecutive misses, DEMONSTRATE one pair (pulse + auto-settle) so
      // the child is guided forward instead of dead-ending; run counts success=false via `revealed`.
      const revealOne = ()=>{
        const zone = [...zoneRow.children].find(z=> !z.classList.contains("filled")); if(!zone) return;
        const t = [...tileRow.children].find(x=> !x.classList.contains("matched") && x.dataset.pairId === zone.dataset.accept); if(!t) return;
        revealed = true; wrongStreak = 0;
        zone.classList.add("reveal-glow"); t.classList.add("reveal-glow");
        /* [32b nocut] DO NOT SPEAK THE REVEAL OVER THE RUNG-2 HINT. This runs in the SAME event as
           dragWrong(slide), which has just started hint2 — the longest clip in the lesson and the
           one that names the order — so play() here stopAudio()d it after ONE MILLISECOND and the
           child who failed twice heard none of it (measured 1ms of 5931-8651ms on all four parts of
           HIKGH04_L01_S02). It also spoke "यह सही क्रम है।" while nothing was placed yet, which is
           the same premature-reveal defect [25d] removed from MATCH_DRAG_N. The reveal line is not
           lost: celebrateThenAdvance(slide, revealed=true) speaks it when the child then places the
           tile correctly. Guarded on isPlaying so a revealOne() reached with nothing speaking still
           says it. */
        if(!isPlaying) play(audioFor(slide,"reveal") || null, ()=>{});
        zone.classList.add("reveal-hold");                 /* [25d] glow and WAIT — never settle() it for the child */
        terminalHold(t, tileRow.children, slide, zone);   /* [28l] dim distractors + [28o] hand travels to the zone */
      };
      [...tileRow.children].forEach(tile => {
        makeDraggable(tile, (zone, t) => {
          if(state.locked || zone.classList.contains("filled")) return;
          state.attempts++;
          if(zone.dataset.accept === t.dataset.pairId){
            wrongStreak = 0;
            SwiftPAL.emit("gender_pair_match", {
              slide_id: slide.id, phase: slide.phase, value: true,
              pair: t.dataset.pairId, attempts: state.attempts
            });
            clearHold(tileRow);   /* [31o] same leak as SEQUENCE_DRAG — see the note there */
            settle(zone, t);
          } else {
            zone.classList.add("filled","wrong");
            setTimeout(()=> zone.classList.remove("filled","wrong"), 600);
            dragWrong(slide);
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            if(++wrongStreak >= (CARD.scaffold_rules.max_attempts||2)) revealOne();
          }
        });
      });
    }
  },

  MATCH_DRAG_1: {
    mount(host, slide){
      const wrap = document.createElement("div"); wrap.className = "dd-stage";
      // zone (target picture)
      const zoneRow = document.createElement("div"); zoneRow.className = "dd-row";
      const zone = document.createElement("div"); zone.className = "dd-zone";
      zone.innerHTML = imgOrEmoji(slide.data.target.img, slide.data.target.emoji, "zone-img", "zone-emoji") + `<span class="zone-lbl">${slide.data.target.picture||""}</span>`;
      zone.dataset.accept = slide.data.letter.letter;
      zoneRow.appendChild(zone);
      // tile
      const tileRow = document.createElement("div"); tileRow.className = "dd-row"; tileRow.style.marginTop = "30px";
      const tile = document.createElement("div"); tile.className = "dd-tile"; tile.innerHTML = `<span class="ink-glyph">${slide.data.letter.letter}</span>`;
      tileRow.appendChild(tile);
      wrap.appendChild(zoneRow); wrap.appendChild(tileRow);
      host.appendChild(wrap);

      state.attempts = 0; state.locked = false;
      makeDraggable(tile, (zone, t) => {
        state.attempts++;
        const ok = (zone.dataset.accept === t.textContent.trim());
        if(ok){
          zone.classList.add("filled","correct");
          // snap tile into zone (badge is small — drop the ink-centering transform)
          t.classList.add("snapped");
          t.querySelector(".ink-glyph")?.style.removeProperty("transform");
          zone.appendChild(t);
          state.locked = true;
          SwiftPAL.emit("letter_image_match_first_try", {
            slide_id: slide.id, phase: slide.phase, value: true,
            first_try: state.attempts === 1, attempts: state.attempts,
            latency_ms: Date.now()-state.slideStart
          });
          celebrateThenAdvance(slide, false);
        } else {
          zone.classList.add("filled","wrong");
          setTimeout(()=> zone.classList.remove("filled","wrong"), 600);
          dragWrong(slide);
          SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
          if(state.attempts >= (CARD.scaffold_rules.max_attempts||2)){
            state.locked = true;
            // reveal = DEMONSTRATE, don't just tell: snap the letter into its picture (dimmed pulse)
            // with the spoken reveal line, then move on as success=false.
            showBox("", audioText(slide,"reveal") || "कोई बात नहीं! इसे यहाँ रखो।", "reveal", audioFor(slide,"reveal"), ()=>{});
            setTimeout(()=>{
              zone.classList.add("filled","correct","reveal-glow");
              t.classList.add("snapped");
              t.querySelector(".ink-glyph")?.style.removeProperty("transform");
              zone.appendChild(t);
              setTimeout(()=> completeSlide(false), 1300);
            }, 900);
          }
        }
      });
    }
  },

  MATCH_DRAG_N: {
    mount(host, slide){
      /* [31g] no आगे on a self-advancing task. Yasir 2026-08-02: "we dont need the buttons in
         guided and independent." Every tap mechanic already hid it (see the `no आगे on a pick`
         line); these two drag mechanics were the only non-tutorial slides still showing one, so a
         run read as button-free then sprouted a button on the drag pages. It was never a completion
         signal here: filling the last zone calls celebrateThenAdvance -> completeSlide by itself,
         so the button could only skip the child PAST their own finished work. Nothing is stranded —
         same contract the tap slides have had all along. */
      $("navBtn").style.display = "none"; setNavActive(false);
      const wrap = document.createElement("div"); wrap.className = "dd-stage";
      const zoneRow = document.createElement("div"); zoneRow.className = "dd-row";
      // shuffle zones so order ≠ tile order
      const zones = slide.data.pairs.slice().sort(()=> Math.random()-0.5);
      zones.forEach(p => {
        const z = document.createElement("div"); z.className = "dd-zone";
        z.innerHTML = imgOrEmoji(p.img, p.emoji, "zone-img", "zone-emoji") + `<span class="zone-lbl">${p.picture||""}</span>`;
        z.dataset.accept = p.letter;
        /* [27j] SPEAK-ON-TAP for the picture/word DROP-ZONE. Only the letter TILE had a listener, so
           a child could hear the letter but never the word — they had to guess which letter to drag.
           The SME deck asks for it on all 4 match slides: "शब्द पर छूने पर शब्द का नाम बोलना चाहिए".
           Reuses the pair's existing match_audio (the word clip already played on a correct drop), so
           no new VO is needed; p.zone_audio overrides if a card wants a different line. Gated on
           isPlaying so a tap cannot stomp the prompt, and dead once the zone is filled. Additive —
           a pair with neither id behaves exactly as before. */
        const zoneSrc = p.zone_audio || p.match_audio || p.word_audio;
        if(zoneSrc) z.addEventListener("pointerdown", ()=>{
          if(z.classList.contains("filled") || isPlaying) return;
          play("assets/Audio/" + zoneSrc + "." + AUDIO_EXT, ()=>{});
        });
        zoneRow.appendChild(z);
      });
      const tileRow = document.createElement("div"); tileRow.className = "dd-row"; tileRow.style.marginTop = "30px";
      const tiles = slide.data.pairs.slice().sort(()=> Math.random()-0.5);
      tiles.forEach(p => {
        const t = document.createElement("div"); t.className = "dd-tile"; t.innerHTML = `<span class="ink-glyph">${p.letter}</span>`;
        // [21c flag#4] TAP → LETTER sound, correct DROP → WORD (SME split). tap_audio = vo_ltr_<letter>,
        // match_audio = vo_word_<word>. Additive + gated: fall back to legacy letter_audio so sibling
        // MATCH games (no tap_audio/match_audio fields) stay byte-for-byte identical. Fire-and-forget on tap.
        const tapSrc = p.tap_audio || p.letter_audio;
        if(tapSrc) t.addEventListener("pointerdown", ()=>{ if(t.classList.contains("snapped")) return; play("assets/Audio/" + tapSrc + "." + AUDIO_EXT, ()=>{}); });   // [24a bug-hunt F5] a placed tile must not replay-and-cut the current VO (the A1 gate exempts snapped tiles)
        if(p.match_audio) t.dataset.matchAudio = p.match_audio;
        tileRow.appendChild(t);
      });
      wrap.appendChild(zoneRow); wrap.appendChild(tileRow);
      host.appendChild(wrap);

      state.attempts = 0; state.locked = false;
      let filled = 0, wrongStreak = 0, revealed = false; const need = slide.data.pairs.length;
      const settle = (zone, t)=>{                       // one correct-placement path (drop AND reveal)
        /* [31h] THE GUIDE HAND HAS TO DIE WHEN THE CHILD SUCCEEDS. travelNudge loops with
           iterations:Infinity and captures the tile's position ONCE; only stopNudge() cancels it
           (it holds the handle in state._handTravel). The correct-drop path ran leaveTrayGhost ->
           clearHelp -> settle and NONE of them stopped it — clearHelp only strips CSS classes. So
           after terminal help fired, the child placing that tile correctly left the hand looping
           over the ghost slot the tile came from, pointing at nothing, for the rest of the slide —
           and still pointing at a FINISHED pair while they worked on the remaining ones. Yasir
           caught it on HIKGH04_L01_S02 P1 G4. settle() is the single correct-placement path (drop
           AND reveal), so the kill belongs here rather than in one of the two callers. */
        stopNudge();
        zone.classList.add("filled","correct");
        /* [31h] AND THE CHIP MUST NOT SIT ON THE WORD. `md-word` is the caption-chip layout
           (bottom:6px; left:50%) and this line added it UNCONDITIONALLY, though its own comment
           said it was "for WORD tiles (not the letter badge)" — there is no word/letter branch in
           this mechanic at all, every tile is built from p.letter. Bottom-centre is exactly where
           .zone-lbl sits, so the placed letter covered the picture's word 100% (measured: 40x21px
           chip over a 40x21px label) and the child lost the word the moment they got it right. The
           designed alternative, .dd-tile.snapped's top-right corner badge, had therefore never
           shipped — dead CSS.
           The test is NOT "letter vs word" — Devanagari makes length useless (अं is one letter in
           two code points). It is "is there a label to cover": every word-tile card in the fleet
           (HI01H04_L03_S01, HIKGH04_L02_S02) renders no .zone-lbl, so those keep the caption chip
           and lose nothing, while every labelled card gets the corner badge. */
        /* [31j] THE CAPTION CHIP IS FOR TILES THAT CANNOT FIT THE BADGE — nothing else.
           Four attempts converged here, each killed by a measurement:
             * 31h  "no .zone-lbl element"  -> the zone builder ALWAYS emits the span
                    (`<span class="zone-lbl">${p.picture||""}</span>`), empty when unlabelled, so
                    every word-tile zone read as labelled and 15 words would have been clipped into
                    a 62px badge (HIKGH04_L02_S02 घर नल कप बस जग · HI01H04_L03_S01 घास माला दादा
                    पापा नाक कान).
             * 31i  "no label TEXT" (lifted from HI01H02_L01_S01's private fix) -> better, but it
                    only protects the LABEL and forgets the PICTURE: on HIKGH02_L02_S01, whose zones
                    carry no label, that hands single letters the caption chip, which its own
                    engine_local had measured at 47.1% of the tile over the art vs 9.4% for the
                    corner badge.
             * HIKGH02_L02_S01/S02's private `[...text].length > 1` -> counts CODE POINTS, so अं and
                    अः (HIKGH04_L01_S01 P2, on LABELLED zones) read as words and would caption the
                    chip straight onto the label.
           The constraint is two-sided: never bury the word, never smother the picture. A single
           base character always fits the corner badge, so it always gets it; only a genuine
           multi-character word needs the caption, and then only where there is no label to bury.
           Counted over the fleet's 90 MATCH_DRAG_N tiles: 68 letters on labelled zones, 7 letters
           on unlabelled zones, 15 words on unlabelled zones, and ZERO words on a labelled zone —
           so the two clauses never fight. The label clause is kept as a guard for a future card.
           Base characters, not code points: strip the Devanagari combining block (matras, anusvara,
           visarga, virama) before counting, or every matra word miscounts. */
        const _zl = zone.querySelector(".zone-lbl");
        const _labelled = !!(_zl && _zl.textContent.trim());
        const _units = (t.textContent || "").trim().normalize("NFC")
                         .replace(/[ऀ-ःऺ-ॏ॑-ॗॢॣ]/g, "").length;
        t.classList.add("snapped");
        if(_units > 1 && !_labelled) t.classList.add("md-word");
        const ig = t.querySelector(".ink-glyph");
        if(ig){ ig.style.removeProperty("transform"); ig.style.removeProperty("font-size"); delete ig.dataset.inkBase; }
        zone.appendChild(t);
        if(ig) requestAnimationFrame(()=> centerInkGlyph(ig));   // re-fit the word into the small chip
        filled++;
        if(filled === need){ state.locked = true;
          // [24a C-fix] the LAST correct DROP also speaks its WORD (flag#4) — wait for it to end
          // before the celebrate VO (play() would cut it at ~250ms). 4s cap: a stalled clip can
          // never hold the celebration hostage.
          /* [32b nocut] WAIT FOR THE WORD ON THE REVEAL PATH TOO. [bug-hunt F6] skipped the wait when
             the child got there via terminal help, on the stated grounds that "revealOne already spoke
             reveal and played no word to protect". BOTH halves of that are false: the last correct DROP
             always speaks its pair's word (flag#4, right above), and MATCH_DRAG_N's terminalHelp() never
             speaks reveal at all (that fires once, later, from celebrateThenAdvance). So the shortcut
             fired the reveal 250ms into a 0.77-1.20s word clip and cut 66-78% of it — measured on all
             four parts of HIKGH04_L01_S02 (vo_word_rail 263ms of 1080ms, vo_word_hathi 264ms of 771ms,
             vo_word_dibba 263ms of 1200ms...). One path now: let the word finish, then celebrate. */
          {
            const t0 = Date.now();
            setTimeout(function waitWord(){
              if(CARD.slides[state.idx] !== slide) return;                // navigated away → abort
              if(!isPlaying || Date.now() - t0 > 4000){ celebrateThenAdvance(slide, revealed); return; }
              setTimeout(waitWord, 150);
            }, 250);
          }
        }
      };
      /* [25d] TERMINAL HELP replaces the old auto-solve (Yasir 2026-07-27, live-caught).
         The old `revealOne()` was three bugs in one: (a) it AUTO-PLACED the answer, which the blessed
         reference forbids — the child must always place it themselves; (b) it picked the FIRST unfilled
         zone, so after failing on म it silently solved क/कमल, a pair the child was not even attempting;
         (c) it spoke `reveal` = "सभी जोड़ियाँ सही हैं।" ("all the pairs are correct") when nothing was
         complete and the child had just been wrong twice. Lowering max_attempts to 2 made it fire sooner
         and this became very visible.
         New behaviour: the count is PER TILE (not a slide-wide streak that any correct drop reset), and
         on the last attempt we glow that tile + its correct zone, dim the other tiles, and wait — the
         child completes it. A drop on any other zone while locked springs back with no extra penalty. */
      const clearHelp = ()=>{
        [...zoneRow.children].forEach(z=> z.classList.remove("reveal-hold"));
        [...tileRow.children].forEach(x=>{
          x.classList.remove("reveal-hold","tile-disabled");
          x.style.removeProperty("pointer-events"); x.style.removeProperty("opacity");
        });
      };
      const terminalHelp = (t)=>{
        t._guideLock = true; revealed = true;   // revealed -> quieter settle + honest telemetry
        const gz = [...zoneRow.children].find(z=> z.dataset.accept === t.textContent.trim());
        if(gz) gz.classList.add("reveal-hold");
        t.classList.add("reveal-hold");
        /* [28d] THE HAND BELONGS ON EVERY TERMINAL-HELP PATH, NOT JUST THE TAP ONE.
           27d put pointNudgeAt in mountTapOptions.revealAnswer and I reported it as "the hand on the
           answer in every phase" — but there are FIVE terminal-help paths and only that one had it.
           Practice and independent rounds in these games are drags / sentence-finds / scene-taps, so
           they glowed with no hand, which is what Yasir is seeing. Point at the TILE the child must
           move (the actionable thing), and stop the flow nudge first so it cannot drag the hand away. */
        travelNudge(t, gz, slide);          /* [28o] tile -> its correct zone, looping */
        [...tileRow.children].forEach(x=>{
          if(x !== t && !x.classList.contains("snapped")){
            x.classList.add("tile-disabled");
            x.style.setProperty("pointer-events","none","important");
            x.style.setProperty("opacity",".4","important");
          }
        });
      };
      [...tileRow.children].forEach(tile => {
        tile._wrong = 0; tile._guideLock = false;
        makeDraggable(tile, (zone, t) => {
          if(state.locked || zone.classList.contains("filled")) return;
          const want = (zone.dataset.accept === t.textContent.trim());
          // guide-locked tile dropped on the WRONG box: penalty-free spring-back, keep guiding
          if(t._guideLock && !want){
            const gz = [...zoneRow.children].find(z=> z.dataset.accept === t.textContent.trim());
            if(gz) gz.classList.add("reveal-hold");
            t.classList.add("reveal-hold");
            return;
          }
          state.attempts++;
          if(want){
            wrongStreak = 0; t._wrong = 0; t._guideLock = false;
            SwiftPAL.emit("letter_image_match_first_try", {
              slide_id: slide.id, phase: slide.phase, value: true,
              letter: t.textContent, attempts: state.attempts
            });
            if(t.dataset.matchAudio) play("assets/Audio/" + t.dataset.matchAudio + "." + AUDIO_EXT, ()=>{});   // [21c flag#4] correct drop → speak the WORD
            leaveTrayGhost(t);   // [25c] ghost slot: placeholder stays where the tile came from
            clearHelp();
            settle(zone, t);
          } else {
            zone.classList.add("filled","wrong");
            dragWrong(slide, t);   // [25b] per-pair hint2 names the tile + its picture
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            setTimeout(()=> zone.classList.remove("filled","wrong"), 600);
            t._wrong++;
            if(t._wrong >= (CARD.scaffold_rules.max_attempts || 2) && !t._guideLock) terminalHelp(t);
          }
        });
      });
    }
  },

  SEQUENCE_DRAG: {
    mount(host, slide){
      /* [31g] no आगे — placing the last tile hits `placed === need` and celebrateThenAdvance
         advances on its own. See the MATCH_DRAG_N note above for the full reasoning. */
      $("navBtn").style.display = "none"; setNavActive(false);
      const wrap = document.createElement("div"); wrap.className = "dd-stage" + (slide.data.word_mode ? " seq-words" : "");
      // slots row
      const slots = document.createElement("div"); slots.className = "seq-slots";
      slide.data.correct_order.forEach((L,i) => {
        const sl = document.createElement("div"); sl.className = "seq-slot";
        sl.dataset.accept = L; sl.dataset.idx = String(i);
        sl.classList.add("dd-zone");      // reuse drop logic
        sl.innerHTML = `<span class="ordinal">${i+1}</span>`;
        slots.appendChild(sl);
      });
      const tileRow = document.createElement("div"); tileRow.className = "dd-row"; tileRow.style.marginTop = "40px";
      slide.data.tiles.forEach(t => {
        const tl = document.createElement("div"); tl.className = "dd-tile"; tl.innerHTML = `<span class="ink-glyph">${t.letter}</span>`;
        if(t.audio) tl.dataset.audio = t.audio;   // tap-to-hear (SME: "शब्द पर click करने पर आवाज़ आनी चाहिए")
        tileRow.appendChild(tl);
      });
      wrap.appendChild(slots); wrap.appendChild(tileRow);
      host.appendChild(wrap);

      const wordMode = !!slide.data.word_mode;   // [21c flag#5] read-along/glow-order/whole-sentence gated to word mode; letter-sequence siblings untouched
      let placed = 0, wrongStreak = 0, revealed = false; const need = slide.data.correct_order.length;
      state.attempts = 0; state.locked = false;
      const settle = (zone, t)=>{ stopNudge();          // one correct-placement path (drop AND reveal)
        zone.classList.remove("dd-zone");
        zone.classList.add("filled","correct");
        zone.innerHTML = `<span class="ordinal">${parseInt(zone.dataset.idx,10)+1}</span><span class="ink-glyph">${t.textContent.trim()}</span>`;
        centerInkGlyph(zone.querySelector(".ink-glyph"));
        t.remove();
        placed++;
        if(placed === need){
          state.locked = true;
          SwiftPAL.emit("letter_sequence_correct", {
            slide_id: slide.id, phase: slide.phase, value: !revealed,
            attempts: state.attempts, latency_ms: Date.now()-state.slideStart
          });
          if(wordMode){
            // deck (word mode): read the WHOLE sentence aloud at the end, THEN celebrate + advance
            play(audioFor(slide, "reveal") || null, ()=> setTimeout(()=> celebrateThenAdvance(slide, revealed), 300));
          } else {
            setTimeout(()=> celebrateThenAdvance(slide, revealed), 250);
          }
        } else if(wordMode){ glowNext(); }
      };
      // progressive sequence hint, WORD MODE only (SME "पहले आने वाला शब्द पहले glow करेगा फिर दूसरा, तीसरा..."):
      // glow the tile that belongs in the NEXT empty slot, guiding the child one word at a time, in order.
      const glowNext = ()=>{
        [...tileRow.children].forEach(x => x.classList.remove("reveal-glow"));
        const zone = [...slots.children].find(z => !z.classList.contains("filled")); if(!zone) return;
        const t = [...tileRow.children].find(x => x.textContent.trim() === zone.dataset.accept);
        if(t) t.classList.add("reveal-glow");
      };
      // A8 reveal ceiling: after max consecutive misses, demonstrate the NEXT slot in the order.
      const revealOne = ()=>{
        const zone = [...slots.children].find(z=> !z.classList.contains("filled")); if(!zone) return;
        const t = [...tileRow.children].find(x=> x.textContent.trim() === zone.dataset.accept); if(!t) return;
        revealed = true; wrongStreak = 0;
        zone.classList.add("reveal-glow"); t.classList.add("reveal-glow");
        /* [32b nocut] DO NOT SPEAK THE REVEAL OVER THE RUNG-2 HINT. This runs in the SAME event as
           dragWrong(slide), which has just started hint2 — the longest clip in the lesson and the
           one that names the order — so play() here stopAudio()d it after ONE MILLISECOND and the
           child who failed twice heard none of it (measured 1ms of 5931-8651ms on all four parts of
           HIKGH04_L01_S02). It also spoke "यह सही क्रम है।" while nothing was placed yet, which is
           the same premature-reveal defect [25d] removed from MATCH_DRAG_N. The reveal line is not
           lost: celebrateThenAdvance(slide, revealed=true) speaks it when the child then places the
           tile correctly. Guarded on isPlaying so a revealOne() reached with nothing speaking still
           says it. */
        if(!isPlaying) play(audioFor(slide,"reveal") || null, ()=>{});
        zone.classList.add("reveal-hold");                 /* [25d] glow and WAIT — never settle() it for the child */
        terminalHold(t, tileRow.children, slide, zone);   /* [28l] dim distractors + [28o] hand travels to the zone */
      };
      [...tileRow.children].forEach(tile => {
        makeDraggable(tile, (zone, t) => {
          if(state.locked || zone.classList.contains("filled")) return;
          state.attempts++;
          const ok = (zone.dataset.accept === t.textContent.trim());
          if(ok){
            wrongStreak = 0;
            /* [31o] RELEASE THE TERMINAL HOLD. revealOne() -> terminalHold() disables every OTHER
               tile with inline pointer-events:none !important + opacity:.4, and nothing here ever
               undid it — so after two wrong tries, placing the revealed letter correctly left the
               whole rest of the tray dead and faded for the remainder of the slide. Yasir hit it
               twice on P3's SEQUENCE_DRAG. clearHold() has existed for exactly this since [28l];
               PATTERN_BUILD, SEQUENCE_COMPLETE and SORT_GENDER all call it, this mechanic and
               MATCH_GENDER_PAIRS were simply never wired up. */
            clearHold(tileRow);
            settle(zone, t);
          } else {
            zone.classList.add("wrong");
            setTimeout(()=> zone.classList.remove("wrong"), 600);
            dragWrong(slide);
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            if(++wrongStreak >= (CARD.scaffold_rules.max_attempts||2)) revealOne();
          }
        }, wordMode ? { onTap: ()=>{ if(tile.dataset.audio) play("assets/Audio/" + tile.dataset.audio + "." + AUDIO_EXT, ()=>{}); } } : undefined);   // [21c flag#5] tap a word-tile → speak that word
      });
      if(wordMode) glowNext();   // [21c flag#5] glow the first word immediately; the auto-played prompt speaks over it
    }
  },

  MASTERY_SILENT_PICK: {
    mount(host, slide){
      const mode = slide.data.mode;
      let stimulus = null, options = null, isCorrect = null, optionRenderer = null;
      if(mode === "sound_to_letter"){
          /* [28m] NO VOLUME BUTTON, ANYWHERE. Yasir 2026-07-28: "we use vol button nowhere. if
             nothing then we keep question only." This stimulus had NO image, so 28c left its 🔊 +
             "सुनो" chip alone and flagged it — stripping it looked like it would leave a blank card.
             The ruling settles it: nothing to show => show the QUESTION only, no chip. The chip was
             also the only way to re-hear the sound, so that function moves to the header replay
             (state.replayAudio, set after mount) instead of dying with the affordance. */
          stimulus = null;
        options = slide.data.options;
        isCorrect = (opt) => opt.letter === slide.data.target;
        optionRenderer = (opt) => letterCell(opt.letter);
      } else if(mode === "picture_to_letter"){
        stimulus = stimulusPic(slide.data.picture, slide.data.emoji, slide.data.img);
        options = slide.data.options;
        isCorrect = (opt) => opt.letter === slide.data.target;
        optionRenderer = (opt) => letterCell(opt.letter);
      } else if(mode === "name_to_shape"){
          /* [28m] NO VOLUME BUTTON, ANYWHERE. Yasir 2026-07-28: "we use vol button nowhere. if
             nothing then we keep question only." This stimulus had NO image, so 28c left its 🔊 +
             "सुनो" chip alone and flagged it — stripping it looked like it would leave a blank card.
             The ruling settles it: nothing to show => show the QUESTION only, no chip. The chip was
             also the only way to re-hear the sound, so that function moves to the header replay
             (state.replayAudio, set after mount) instead of dying with the affordance. */
          stimulus = null;
        options = slide.data.options;
        isCorrect = (opt) => opt.shape === slide.data.target;
        optionRenderer = (opt) => shapeCell(opt);
      } else if(mode === "object_to_shape"){
        stimulus = stimulusPic(slide.data.object_hi, slide.data.object_emoji, slide.data.object_img);
        options = slide.data.options;
        isCorrect = (opt) => opt.shape === slide.data.target;
        optionRenderer = (opt) => shapeCell(opt);
      } else if(mode === "shape_to_object"){
        stimulus = stimulusShape({shape: slide.data.shape, color: slide.data.color, rotate: slide.data.rotate});
        options = slide.data.options;
        isCorrect = (opt) => opt.correct === true;
        optionRenderer = (opt) => pictureCell(opt.object_hi, opt.object_emoji, opt.object_img);
      } else { // letter_to_picture
        stimulus = stimulusLetter(slide.data.letter);
        options = slide.data.options;
        isCorrect = (opt) => opt.correct === true;
        optionRenderer = (opt) => pictureCell(opt.picture, opt.emoji, opt.img);
      }
      // SAME scaffold as the rest of the lesson — hint button after 1st wrong,
      // correct/incorrect feedback popups, reveal-on-3rd-wrong. Not silent.
      // `mastery:true` keeps the mastery_score tracking (first-try = hit).
      mountTapOptions({
        slide, host, signalName: "mastery_item",
        stimulus, options, isCorrect, optionRenderer, mastery: true
      });
        /* [28m] the removed chip was the only way to re-hear the sound — keep the FUNCTION on the
           header replay. Set AFTER mount so mountTapOptions cannot overwrite it. */
        state.replayAudio = ()=>{ state.audioReplays++; play(audioFor(slide,"phoneme") || audioFor(slide,"shape_name") || null, ()=>{}); };
    }
  },

  STORY_SCENE: {
    // TEACH: one picture-story beat. Scene image fills the frame; narration VO plays on mount;
    // slow Ken-Burns pan keeps it alive for a pre-reader. Chain several in order for the story.
    mount(host, slide){
      const d = slide.data || {};
      const wrap = document.createElement("div"); wrap.className = "story-scene";
      const fb = String(d.emoji || "📖").replace(/'/g,"");
      wrap.innerHTML =
        '<div class="story-frame">' +
          '<img class="story-img" src="assets/Images/' + d.image_id + '.' + IMG_EXT + '" alt="' + (d.alt_hi||'') + '" ' +
            'onerror="var s=document.createElement(\'span\');s.className=\'story-fallback\';s.textContent=\'' + fb + '\';this.replaceWith(s);"/>' +
        '</div>' +
        (d.caption_hi ? '<div class="story-caption">' + d.caption_hi + '</div>' : '');
      host.appendChild(wrap);
      state.ownsAudio = true; setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
      state.replayAudio = ()=>{ play(audioFor(slide, "narration") || null, ()=>{}); };
      setSwMood("talk");
      let _armed = false;
      const _armNav = ()=>{ if(_armed) return; _armed = true; setNavActive(true); setSwMood("point"); };
      play(audioFor(slide, "narration") || null, _armNav);
      setTimeout(_armNav, 30000);   // watchdog: nav always eventually opens if VO buffers slowly
    }
  },

  STORY_QUESTION: {
    // TEST: a comprehension question after story beats. A recall thumb (visual anchor) + 🔊 chip
    // form the stimulus; options are 2–3 picture chips. Tap-to-answer feedback is inherited from
    // mountTapOptions. Recall thumb is a CUE, hidden at mastery / when data.hide_recall so the
    // answer isn't leaked by thumb-reading.
    mount(host, slide){
      const d = slide.data || {};
      const stim = document.createElement("div"); stim.className = "story-q-stim"; stim.style.cursor = "pointer";
      const hideRecall = slide.phase === "mastery" || d.hide_recall === true;
      const thumb = (!hideRecall && d.recall_image_id)
        ? '<img class="story-q-thumb" src="assets/Images/' + d.recall_image_id + '.' + IMG_EXT + '" alt="" ' +
          'onerror="this.style.display=\'none\';"/>'
        : '';
      /* [28c] IMAGE ONLY IN THE STIMULUS CARD (Yasir 2026-07-28: "we are not supposed to have both
         the prashn suno and volume icon on the screen anywhere at all. only image in the
         container/card"). The 🔊 glyph and the label were HARDCODED here, so no card could remove
         them — `d.stim_hi` only reworded the label. Now the card holds the recall thumb and nothing
         else.
         The REPLAY still works: stim.onclick is kept, so tapping the picture replays the question,
         and the header volume chip on Swiftie replays it too — the affordance is removed, not the
         function. If the thumb is absent (mastery / d.hide_recall) there is nothing left to show, so
         pass null rather than render an empty card; mountTapOptions already guards `if(stimulus)`.
         NOT applied to the four audio-only chips (TAP_SHAPE_BY_NAME, TAP_LETTER_BY_SOUND,
         MASTERY_SILENT_PICK x2) — those have no image, so stripping the chip would leave a blank card
         and no cue that there is anything to listen to. Flagged for a ruling instead of guessed. */
      stim.innerHTML = thumb;
      stim.onclick = ()=>{ state.audioReplays++; play(audioFor(slide, "prompt") || null); };
      mountTapOptions({
        slide, host,
        signalName: d.signal_name || "story_question_first_try",
        stimulus: thumb ? stim : null,
        options: d.options,
        isCorrect: (opt) => opt.correct === true,
        optionRenderer: (opt) => {
          const cell = document.createElement("div");
          cell.innerHTML =
            imgOrEmoji(opt.img, opt.emoji, "story-q-opt-img", "story-q-opt-emoji") +
            (opt.label_hi ? '<span class="story-q-opt-label">' + opt.label_hi + '</span>' : '');
          return cell;
        },
        mastery: d.mastery === true,
        columnsHint: (d.options && d.options.length) <= 2 ? 2 : 3
      });
    }
  },

  TAP_IN_SCENE: {
    // "Tap the thing in the picture" — a PRODUCE-style comprehension mechanic (NOT an MCQ). A story
    // scene fills the frame; the child taps the target region(s) (e.g. the monkeys who took the caps).
    // A correct hotspot → confetti + advance; a miss → soft buzz + try_again VO; after a few idle
    // seconds the target gently pulses (hint). Data: {image_id, alt_hi, prompt, hotspots:[{x,y,w,h,
    // correct}] (as % of the frame), audio:{prompt,correct,try_again}}. Reusable for any "find X".
    mount(host, slide){
      const d = slide.data || {};
      const wrap = document.createElement("div"); wrap.className = "tis-scene";
      const frame = document.createElement("div"); frame.className = "tis-frame";
      const img = document.createElement("img"); img.className = "tis-img";
      img.src = "assets/Images/" + d.image_id + "." + IMG_EXT; img.alt = d.alt_hi || "";
      frame.appendChild(img);
      let done = false, _tisAttempts = 0;
      /* [27j] TWO-RUNG HINT LADDER + TERMINAL HELP for TAP_IN_SCENE.
         It previously played try_again ONLY, so authored audio.hint1/audio.hint were never spoken —
         and because check_system passes on "ids authored + files exist", a 15/15 TAP_IN_SCENE game
         reported COMPLIANT while no hint could ever play. Same graded shape as mountTapOptions
         (24a A2) and dragWrong (25a): 1st wrong -> hint1, 2nd -> hint, at max_attempts -> terminal
         help. Terminal help GLOWS the correct hotspot and the child STILL TAPS IT — never auto-solve
         (rule 9: "never hand the child the answer"). */
      const miss = ()=>{
        if(done) return;
        _tisAttempts++; sfxWrongSoft(); setSwMood("tryagain");
        const _maxA = (CARD.scaffold_rules && CARD.scaffold_rules.max_attempts) || 3;
        if(_tisAttempts >= _maxA){
          frame.querySelectorAll(".tis-hot.correct-hot").forEach(el => el.classList.add("reveal-hold"));
          frame.querySelectorAll(".tis-hot:not(.correct-hot)").forEach(el => el.classList.add("faded"));
          const _hot = frame.querySelector(".tis-hot.correct-hot");
          if(_hot) handOnAnswer(_hot, slide);   /* [28d] hand on the answer, all paths */
          SwiftPAL.emit("answer_revealed", { slide_id: slide.id, phase: slide.phase, attempts: _tisAttempts, reason: "wrong" });
          play(audioFor(slide,"hint") || audioFor(slide,"reveal") || audioFor(slide,"try_again") || null, ()=>{});
        } else if(_tisAttempts >= 2){
          play(midHint(slide), ()=>{});                        /* [28k] rung 2 */
        } else {
          play(audioFor(slide,"hint1") || audioFor(slide,"try_again") || null, ()=>{});
        }
        SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: _tisAttempts });
      };
      (d.hotspots || []).forEach(h => {
        const hs = document.createElement("button"); hs.className = "tis-hot" + (h.correct ? " correct-hot" : "");
        hs.style.left=h.x+"%"; hs.style.top=h.y+"%"; hs.style.width=h.w+"%"; hs.style.height=h.h+"%";
        hs.onclick = (e)=>{ e.stopPropagation(); if(done) return;
          if(h.correct){ done=true; hs.classList.add("hit"); sfxCorrect(); confettiCannon(); setSwMood("happy");
            SwiftPAL.emit(d.signal_name || "scene_tap_first_try", {slide_id:slide.id, phase:slide.phase, correct:true});
            play(audioFor(slide,"correct")||null, ()=> setTimeout(()=>completeSlide(true), 900)); }
          else { hs.classList.add("shake"); miss(); } };
        frame.appendChild(hs);
      });
      frame.onclick = miss;   // tapping empty scene = gentle try_again
      wrap.appendChild(frame); host.appendChild(wrap);
      $("navBtn").style.display = "none";   // advance on the correct tap — no आगे on a pick
      state.replayAudio = ()=> play(audioFor(slide,"prompt")||null, ()=>{});
      setSwMood("point");
      play(audioFor(slide,"prompt")||null, ()=>{});
      /* [28e] REMOVED: a 6s timer that pulsed the CORRECT hotspot alone, before the child had tried
         anything. Measured on the built game — at t=1s all three hotspots are identical; at t=7s only
         .correct-hot carries `tisPulse`. That hands over the answer for free (rule-9 class breach).
         Yasir 2026-07-28: "this is just like giving hints for the correct answer right from start ...
         only glow after second wrong attempt when all other options get disabled." The glow now comes
         ONLY from terminal help in miss() at max_attempts, where the distractors also fade. */
    }
  },

  PHASE_TRANSITION: {
    // Additive "learning journey" beat between arc phases (the MoM "no sense of progression" fix).
    // Full-screen friendly panel: badge + "अब हम ___ करेंगे" headline + a 5-dot journey map with the
    // current step lit. The header Swiftie presents it (ONE-Swiftie rule — no second mascot). Learner-
    // paced: no auto-advance timer; आगे unlocks when the beat's VO ends (immediately if silent).
    // data:{ headline_hi, icon?, step (1-based), total_steps?, to_phase? }. Build scripts weave one of
    // these before each phase change; older cards without it are untouched (purely additive).
    mount(host, slide){
      const d = slide.data || {};
      const panel = document.createElement("div"); panel.className = "phase-transition";
      const total = d.total_steps || 5, step = Math.min(d.step || 1, total);
      let map = '<div class="pt-map">';
      for(let i = 1; i <= total; i++){
        map += `<span class="pt-step ${i < step ? 'done' : i === step ? 'current' : ''}"></span>`;
        if(i < total) map += '<span class="pt-connector"></span>';
      }
      map += '</div>';
      panel.innerHTML =
        `<div class="pt-badge">${d.icon || '🎯'}</div>` +
        `<div class="pt-headline">${d.headline_hi || slide.prompt_hi || ''}</div>` + map;
      host.appendChild(panel);
      setSwMood("teach");
      SwiftPAL.emit("phase_transition_shown", { slide_id: slide.id, to_phase: d.to_phase || slide.phase, step });
      state.ownsAudio = true; state.locked = false; setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
      const vo = audioFor(slide, "prompt");
      if(vo) play(vo, ()=> setNavActive(true)); else setNavActive(true);
    }
  },

  CELEBRATION: {
    mount(host, slide){
      // celebration SFX — own Audio element so it overlaps the spoken VO chain
      playSfx(slide.audio && slide.audio.sfx ? slide.audio.sfx : "sfx_celebrate");
      /* [30i] NO TEXT ON THE LAST PAGE — Yasir 2026-07-30: "there should be no sentence on the last
         page, no praising nothing. the only writings allowed on that page is inside the button, other
         than that, no other sentences, no other words."
         This used to paint slide.prompt_hi as a 44px headline plus an optional data.end_subtitle. Both
         are now deliberately set EMPTY rather than deleted from the DOM: `.end-title:empty` and
         `.end-subtitle:empty` are already `display:none` in style.css, so they collapse and take their
         margins with them — and any card still carrying an `end_subtitle` simply stops rendering it,
         instead of needing all 28 cards edited.
         The celebration VO is untouched: he banned writing on the page, not the spoken praise. And
         verify_bundle's "every slide SPEAKS its prompt (incl. celebration)" gate reads the card's audio
         map, not the DOM, so clearing the visible text cannot turn that green check red. */
      const et = $("endTitle"); if(et) et.textContent = "";
      const st = $("endSubtitle"); if(st) st.textContent = "";
      const es = $("endScreen"); es.classList.add("show","hint-glow");
      document.body.classList.add("is-end");   // r4: immersive sunburst backdrop (end_screen.webp)
      const c = $("confetti"); c.innerHTML = "";
      starBurst();   // r4: gold star burst from centre (replaces flat falling confetti)
      const masteryScore = state.masteryAttempts ? (state.masteryHits/state.masteryAttempts) : 0;
      SwiftPAL.emit("mastery_score", { value: masteryScore, hits: state.masteryHits, attempts: state.masteryAttempts });
      SwiftPAL.emit("lesson_completed", { skill_code: CARD.skill_code, total_signals: SwiftPAL.signals.length });
      runValidator();
      setNavActive(false);
      /* [30i] THE BUTTON IS THERE THE MOMENT THE SCREEN IS — Yasir 2026-07-30: "on the last
         screen/the celebration page, the button appears after the VO is completed. the button should be
         there as we get on that screen."
         It used to hide the button and set state.endBtnPending, which autoPlayChain's onDone released
         (see the `if(state.endBtnPending)` line further down). On a long celebration clip — or a missing
         one that fell back to the TTS placeholder — the child sat on a dead end screen with nothing to
         press, which is exactly the "silent non-response" failure we keep hitting elsewhere.
         Shown immediately, and endBtnPending is left FALSE so the onDone branch is a no-op. That branch
         is deliberately NOT deleted: it is the only consumer of the flag, and leaving it means a card or
         a future mechanic that still sets the flag keeps working rather than silently never showing its
         button. `hint-glow` is kept so the button still draws the eye. */
      const eb = $("endBtn"); eb.classList.add("show","hint-glow");
      state.endBtnPending = false;
      // dev-only: a small "download results" button (teacher/QA), never in child flow
      if(new URLSearchParams(location.search).has("dev") && !$("dlResults")){
        const dl = document.createElement("button"); dl.id = "dlResults"; dl.textContent = "⬇ results JSON";
        dl.style.cssText = "position:absolute;bottom:20px;left:20px;z-index:5;font-family:var(--font-hi);font-weight:700;font-size:16px;padding:8px 16px;border-radius:12px;border:2px solid #B7DCFB;background:#fff;color:var(--navy);cursor:pointer;";
        dl.onclick = ()=> SwiftPAL.downloadResults();
        es.appendChild(dl);
      }
      eb.onclick = ()=>{
        SwiftPAL.emit("proceed_next", { skill_code: CARD.skill_code, part: CARD.part_label });
        try{ window.parent?.postMessage({type:"swiftpal:proceed", skill_code:CARD.skill_code, part:CARD.part_label}, "*"); }catch(e){}
      };
    }
  },

  /* ===== 16j: FLN sentence + repeated-sound modules — PORTED from the delivered 15b/15d engines.
     Fingerprinted first (two-diverged-engines lesson): same `-unified` lineage, IDENTICAL helper
     contracts (audioFor, setNavActive, completeSlide, mountTapOptions, state fields, sfxCorrect, sfxWrongSoft,
     confettiCannon/setSwMood/imgOrEmoji/letterCell/pictureCell). Verified each call resolves in 16i
     before porting — not a blind paste. Used by HI01H06 (READ/FIND/PICK_PIC) + HIKGH02_L01_S03_P2
     (SOUND/TAP_ALL). ===== */
  SENTENCE_READ: {
    mount(host, slide){
      const d = slide.data;
      const wrap = document.createElement("div"); wrap.className = "sentence-read";
      if(d.image || d.image_emoji){ const im = document.createElement("div"); im.className = "sentence-img";   // 16k: optional illustration above the line
        im.innerHTML = imgOrEmoji(d.image, d.image_emoji, "s-img", "s-emoji"); wrap.appendChild(im); }
      const strip = document.createElement("div"); strip.className = "sentence-strip";
      (d.words || []).forEach(w => {
        const chip = document.createElement("div"); chip.className = "sentence-word";
        chip.innerHTML = `<span class="sw-text ink-glyph">${w.text}</span>`;
        chip.onclick = ()=>{ chip.classList.add("said"); state.audioReplays++;
          if(w.audio) play("assets/Audio/" + w.audio + "." + AUDIO_EXT); };
        strip.appendChild(chip);
      });
      const readBtn = document.createElement("button"); readBtn.className = "read-whole-btn";
      readBtn.innerHTML = `पूरा पढ़ो`;                          /* [28m] no volume glyph */
      const wholeSrc = d.whole_audio ? ("assets/Audio/" + d.whole_audio + "." + AUDIO_EXT) : null;
      readBtn.onclick = ()=>{ state.audioReplays++; readBtn.classList.add("playing");
        strip.querySelectorAll(".sentence-word").forEach(c => c.classList.add("said"));
        play(wholeSrc, ()=>{ readBtn.classList.remove("playing"); readBtn.classList.add("done"); setNavActive(true); }); };
      wrap.appendChild(strip); wrap.appendChild(readBtn);
      host.appendChild(wrap);
      if(d.auto){
        // 16k: AUTONOMOUS tutorial read (3-phase contract) — the sentence reads ITSELF word-by-word,
        // then the whole line, then आगे unlocks. Child watches/listens (no required tap).
        state.ownsAudio = true; state.demoRunning = true; setNavActive(false); readBtn.style.display = "none";   // [24a N8]
        const chips = [...strip.querySelectorAll(".sentence-word")];
        let wi = 0;
        const wStep = ()=>{
          if(CARD.slides[state.idx] !== slide) return;                     // navigated away → abort
          if(wi >= chips.length){ chips.forEach(c => c.classList.add("said")); stopNudge();
            play(wholeSrc, ()=>{ state.demoRunning = false; setNavActive(true); }); return; }
          // read-along: the hand-nudge points at each word AS it is spoken (SME: "hand nudge on words being spoken")
          const c = chips[wi]; c.classList.add("said"); pointNudgeAt(c); const w = (d.words || [])[wi]; wi++;
          play(w && w.audio ? "assets/Audio/" + w.audio + "." + AUDIO_EXT : null, ()=> setTimeout(wStep, 300));
        };
        state.replayAudio = ()=> play(wholeSrc, ()=>{});
        $("navBtn").onclick = ()=> completeSlide(true);                     // explicit — dead-button lesson
        setTimeout(wStep, 450);
        return;
      }
      state.replayAudio = ()=> play(wholeSrc, ()=>{});
      setNavActive(false);
      $("navBtn").onclick = ()=> completeSlide(true);
    }
  },

  SENTENCE_FIND: {
    mount(host, slide){
      const d = slide.data;
      const wrap = document.createElement("div"); wrap.className = "sentence-find";
      if(d.image || d.image_emoji){ const im = document.createElement("div"); im.className = "sentence-img";   // 16k: optional illustration above the line
        im.innerHTML = imgOrEmoji(d.image, d.image_emoji, "s-img", "s-emoji"); wrap.appendChild(im); }
      const strip = document.createElement("div"); strip.className = "sentence-strip";
      state.attempts = 0; state.locked = false; state.scaffoldLevel = 0;
      const maxA = (CARD.scaffold_rules && CARD.scaffold_rules.max_attempts) || 3;
      const chips = [];
      (d.words || []).forEach(w => {
        const chip = document.createElement("div"); chip.className = "sentence-word tappable";
        chip.innerHTML = `<span class="sw-text ink-glyph">${w.text}</span>`;
        chip.__target = (w.target === true);
        const wordSrc = w.audio ? ("assets/Audio/" + w.audio + "." + AUDIO_EXT) : null;
        chip.onclick = ()=>{
          if(state.locked || chip.classList.contains("crossed") || chip.classList.contains("correct")) return;
          const after = (cb)=>{ if(wordSrc) play(wordSrc, cb); else cb(); };
          if(w.target === true){
            state.locked = true; chip.classList.add("correct"); sfxCorrect(); confettiCannon(); setSwMood("happy");
            if(slide.phase === "mastery"){ state.masteryAttempts++; if(state.attempts === 0) state.masteryHits++; }
            SwiftPAL.emit("sentence_word_first_try", { slide_id: slide.id, phase: slide.phase, value: true,
              first_try: state.attempts === 0, attempts: state.attempts + 1, latency_ms: Date.now()-state.slideStart });
            after(()=> setTimeout(()=> completeSlide(true), 700));
          } else {
            /* [28r] same rule as the tap path: RED FIRST, and the lock only from the 2nd wrong.
               This mechanic locked the chip permanently on the FIRST wrong tap, so 27a ("a wrong card
               must not lock on the first miss") and Yasir's "red glow first, then disable" had never
               reached it at all. */
            state.attempts++; chip.classList.add("wrong-flash"); sfxWrongSoft(); setSwMood("tryagain");
            setTimeout(()=>{
              if(chip.classList.contains("correct")) return;   /* [28s] no helpShown guard — see the tap path */
              chip.classList.remove("wrong-flash");
              if(state.attempts >= 2) chip.classList.add("crossed");
            }, 700);
            $("hintBtn").classList.add("show","hint-glow");
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            /* [27j] Three faults fixed here, all reported against HI01H04_L02_S02:
               1. rung 1 played try_again and NEVER looked up hint1, so the authored level-1 hint was
                  dead on every slide;
               2. the `attempts >= 2` rung was unreachable under the house max_attempts:2 because the
                  terminal branch fires first — so `hint` (the rung that NAMES the answer) never played
                  either. It is now spoken AS the terminal line, matching the pick path;
               3. RULE-9 BREACH: terminal help set state.locked, marked the target .correct and called
                  completeSlide(false) — it solved the slide FOR the child. Now it only GLOWS the target
                  and fades the rest; nothing locks and nothing advances until the child taps it,
                  exactly like mountTapOptions' revealAnswer. */
            after(()=>{
              if(state.attempts >= maxA){
                state.scaffoldLevel = 3; state.helpShown = true; setSwMood("hint");
                chips.forEach(c => {
                  if(c.__target){ c.classList.remove("crossed"); c.classList.add("reveal-hold"); }
                  else if(!c.classList.contains("correct")){
                    c.classList.add("faded");
                    c.style.setProperty("pointer-events","none","important");
                  }
                });
                const _tgt = chips.find(c => c.__target);
                if(_tgt) handOnAnswer(_tgt, slide);   /* [28d] hand on the answer, all paths */
                SwiftPAL.emit("answer_revealed", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts, reason: "wrong" });
                play(audioFor(slide, "hint") || audioFor(slide, "reveal") || audioFor(slide, "try_again") || null, ()=>{});
              } else if(state.attempts >= 2){ state.scaffoldLevel = Math.max(state.scaffoldLevel, 2);
                play(midHint(slide), ()=>{}); }               /* [28k] rung 2 */
              else { state.scaffoldLevel = Math.max(state.scaffoldLevel, 1);
                play(audioFor(slide, "hint1") || audioFor(slide, "try_again") || null, ()=>{}); }
            });
          }
        };
        strip.appendChild(chip); chips.push(chip);
      });
      wrap.appendChild(strip); host.appendChild(wrap);
      $("hintBtn").onclick = ()=>{ if(state.locked) return; state.hintUsed = true;
        SwiftPAL.emit("hint_shown", { slide_id: slide.id, manual: true });
        play(audioFor(slide, "hint") || audioFor(slide, "try_again") || null, ()=>{}); };
      $("navBtn").style.display = "none"; setNavActive(false);
      // [21c flag#5] read-along (SME deck P6/P7): speak the sentence word-by-word, glowing each word as it is heard,
      // THEN a hand-nudge points at the TARGET word to guide the tap ("hand nudge की help से बच्चा घर
      // शब्द पहचानेगा"). state.ownsAudio so the entry auto-play chain doesn't ALSO fire the prompt.
      /* [28i] SPEAK THE TARGET WORD, NOT THE WHOLE SENTENCE.
         Yasir 2026-07-28: the slide says "जो शब्द सुनो, उस पर टैप करो।" and the engine then read ALL
         FOUR words aloud — so nothing told the child which one to tap. The task is "tap the word you
         hear"; reading every option destroys it. Target-only is now the DEFAULT and the full
         word-by-word read is opt-in via data.read_along:true.
         NOTE FOR YASIR — this reverses an earlier SME ask: the read-along came from that deck's own
         P6/P7 note (21c flag #5, "hand nudge की help से बच्चा घर शब्द पहचानेगा"). Your ruling wins,
         but the SME will see their request gone, so it is flagged rather than silently dropped. Any
         card that still wants it sets data.read_along:true.
         The target is spoken with NO visual mark: adding .said to it (as the read-along does per word)
         would GLOW the answer before the child has tried, which is the thing we keep removing.
         ALSO REMOVED: the read-along ended in startNudge(slide, _tgt) — a hand planted on the answer
         right after the prompt VO, pre-attempt. 28f deleted the two startNudge(slide,_nudge) forms and
         missed this third one, which is exactly the "hand nudge appears right after VO" complaint. A
         visual hint here is earned only through handOnAnswer() at terminal help. */
      state.ownsAudio = true;
      const _tgt = chips.find(c => c.__target);
      const _clipFor = (i)=>{ const w = (d.words || [])[i];
        return w && w.audio ? "assets/Audio/" + w.audio + "." + AUDIO_EXT : null; };
      const _readAlong = ()=>{                                   // opt-in: data.read_along === true
        let i = 0;
        const step = ()=>{
          if(CARD.slides[state.idx] !== slide || state.locked) return;    // navigated away / already answered
          if(i >= chips.length) return;                                   // NO hand at the end (see above)
          const c = chips[i]; const src = _clipFor(i); i++;
          c.classList.add("said");
          play(src, ()=> setTimeout(step, 220));
        };
        step();
      };
      const _sayTarget = ()=>{
        if(CARD.slides[state.idx] !== slide || state.locked) return;
        play(_clipFor(chips.indexOf(_tgt)), ()=>{});                      // no .said, no nudge
      };
      const _speak = (d.read_along === true) ? _readAlong : _sayTarget;
      state.replayAudio = _speak;                                          // header 🔊 repeats the same thing
      play(audioFor(slide, "prompt") || null, ()=> setTimeout(_speak, 250));   // instruction, then the word to find
    }
  },

  TAP_ALL_WITH_SOUND: {
    mount(host, slide){
      const d = slide.data || {};
      const items = d.items || [];
      const need = items.filter(it => it.has === true).length;
      state.attempts = 0; state.locked = false;
      let found = 0;
      const wrap = document.createElement("div"); wrap.className = "tap-all";
      const head = document.createElement("div"); head.className = "tap-all-head";
      const badge = document.createElement("div"); badge.className = "tap-all-sound"; badge.style.cursor = "pointer";
      badge.innerHTML = `<span class="ink-glyph">${d.target_sound || ""}</span>`;
      badge.onclick = ()=>{ state.audioReplays++; play(audioFor(slide, "target") || null); };
      /* [S01r4q] SME: "remove 0/2". The running tally is off the screen; `found` and `need` still
         drive completion, they just no longer have a readout. The badge keeps the row. */
      head.appendChild(badge);
      const strip = document.createElement("div"); strip.className = "tap-all-strip";
      const chips = [];
      items.forEach(it => {
        const chip = document.createElement("div"); chip.className = "tap-all-item";
        chip.dataset.nudgeBelow = "1";   /* [S01r5m] the earned hand sits under the word, not on it */
        chip.innerHTML = imgOrEmoji(it.img, it.emoji, "img", "emoji") + `<span class="lbl">${it.word_hi}</span>`;
        const src = it.audio ? ("assets/Audio/" + it.audio + "." + AUDIO_EXT) : null;
        chip.onclick = ()=>{
          if(state.locked || chip.classList.contains("got") || chip.classList.contains("nope")) return;
          /* [S01r4x] the hand has done its job the moment the child acts on it. mountTapOptions has
             cleared it on tap since [27d]; this mechanic never did, so on pages 7/10/12 the hand
             stayed on screen pointing at a tile that had already been answered. */
          stopNudge();
          const after = (cb)=>{ if(src) play(src, cb); else cb(); };
          if(it.has === true){
            chip.classList.add("got"); sfxCorrect(); found++;
            /* [S01r5m] A CORRECT FIND REOPENS THE BOARD. A wrong tap locks that card from the 2nd
               attempt (.nope), and the lock used to outlive the rest of the round - so a child who
               mis-tapped early and then found a correct word was left with a dead card they could
               never revisit. The SME: "after one correct if any other element is disabled then
               enable it so user can tap on that too". Clearing the lock, not the attempt count:
               another wrong tap re-locks immediately, so the scaffold ladder is unchanged. */
            chips.forEach(c => c.classList.remove("nope", "wrong-flash"));
            /* [S01r5m] ...and this card leaves play. It was already untappable (the guard above
               returns on .got), but it still LOOKED live, so the child had no way to tell which
               cards were still in question. Two seconds is long enough for the green to register as
               feedback before it fades back. */
            setTimeout(()=>{ if(CARD.slides[state.idx] === slide) chip.classList.add("spent"); }, 2000);
            SwiftPAL.emit("sound_found", { slide_id: slide.id, phase: slide.phase, word: it.word_hi });
            after(()=>{
              /* [S01r5m] "after first correct selection the VO will play एक और … पर टैप करो".
                 Nothing was said between the first find and the last, so the page went quiet
                 exactly when it should have been asking for the other one. */
              if(found < need && CARD.slides[state.idx] === slide){
                play(audioFor(slide, "more") || null, ()=>{});
              }
              if(found >= need){
                state.locked = true; setSwMood("celebrate"); confettiCannon();
                if(slide.phase === "mastery"){ state.masteryAttempts++; if(state.attempts === 0) state.masteryHits++; }
                SwiftPAL.emit(d.signal_name || "tap_all_correct", { slide_id: slide.id, phase: slide.phase,
                  value: state.attempts === 0, attempts: state.attempts, latency_ms: Date.now()-state.slideStart });
                play(audioFor(slide, "done") || audioFor(slide, "correct") || null,
                  ()=> setTimeout(()=> completeSlide(state.attempts === 0), 700));
              }
            });
          } else {
            /* [28r] same rule as the tap path: RED FIRST, and the lock only from the 2nd wrong.
               This mechanic locked the chip permanently on the FIRST wrong tap, so 27a ("a wrong card
               must not lock on the first miss") and Yasir's "red glow first, then disable" had never
               reached it at all. */
            state.attempts++; chip.classList.add("wrong-flash"); sfxWrongSoft(); setSwMood("tryagain");
            setTimeout(()=>{
              if(chip.classList.contains("correct")) return;   /* [28s] no helpShown guard — see the tap path */
              chip.classList.remove("wrong-flash");
              if(state.attempts >= 2) chip.classList.add("nope");
            }, 700);
            $("hintBtn").classList.add("show","hint-glow");
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            /* [S01r4] EARNED HAND, SME deck page 9: "After repeated incorrect attempts, show a
               subtle hand nudge on one remaining correct option... Do not auto-select the answer."
               This mechanic had NO hand at all - mountTapOptions grew one in [27d] but TAP_ALL never
               routed through it, so the deck's "retain the same behaviour" was describing something
               that did not exist here. handOnAnswer self-gates to tutorial/guided, so this lands on
               page 9 (guided) and stays absent in practice, per the round-3 no-hand-in-practice rule.
               It only points: the chip's own onclick is untouched, so the child still taps it. */
            /* [S01r4q] SME: "play only this Hint VO" - the slide's own `hint` clip (vo_g2_hint),
               NOT the vo_g2_try rung the ladder used to open with, and not the tapped word's own
               clip either: the deck's wrong-tap flow is shake -> red -> hint -> retry, with no word
               in it. Reading it off the slide means P1/P7 get their own; wrongClip is the fallback. */
            play(audioFor(slide, "hint") || wrongClip(slide), ()=>{
              if(state.attempts < 2 || state.locked) return;
              if(CARD.slides[state.idx] !== slide) return;
              const t = chips.find((c, ix) => items[ix] && items[ix].has === true && !c.classList.contains("got"));
              /* [S01r4u] honour data.allow_hand here too. handOnAnswer self-gates to tutorial+guided
                 (Yasir's round-3 rule), which is why page 7 shows the hand and pages 10 and 13 — the
                 same mechanic in the practice phase — never did. allow_hand is the per-slide opt-in
                 the balloon page already uses, so a practice slide can ask for the hand by name
                 rather than the rule being loosened for the whole fleet. */
              if(t){ handOnAnswer(t, slide, !!d.allow_hand); state.nudgeUsed = true;
                     state.scaffoldLevel = Math.max(state.scaffoldLevel, 3);
                     SwiftPAL.emit("nudge_invoked", { slide_id: slide.id, phase: slide.phase }); }
            });
          }
        };
        strip.appendChild(chip); chips.push(chip);
      });
      wrap.appendChild(head); wrap.appendChild(strip);
      host.appendChild(wrap);
      $("hintBtn").onclick = ()=>{ if(state.locked) return; state.hintUsed = true;
        SwiftPAL.emit("hint_shown", { slide_id: slide.id, manual: true });
        play(audioFor(slide, "hint") || audioFor(slide, "try_again") || null, ()=>{}); };
      $("navBtn").style.display = "none"; setNavActive(false);
      state.replayAudio = ()=> play(audioFor(slide, "prompt") || null, ()=>{});

      /* [S01r4p] OPTION ENTRY - "after the instruction VO finishes, show the options one by one".
         The card has carried `reveal_seq` since round 4 and CHANGES row 67 recorded it as already
         satisfied, but ONLY mountTapOptions and sortSeqReveal ever read that flag: this mechanic
         never did, so all four chips were on screen from mount, underneath the instruction VO.
         Deliberately the SAME shape as mountTapOptions' reveal rather than a second one - the prompt
         plays to COMPLETION, then each chip fades in speaking its own word, then taps open. Every
         step carries a per-clip fallback and there is a global net, so a missing or blocked clip can
         never soft-lock the page; this deck still has ungenerated clips, so that matters.
         ownsAudio is read by mountSlide AFTER mount returns, so setting it here is what stops
         autoPlayChain starting a second, overlapping copy of the prompt. */
      if(d.reveal_seq){
        chips.forEach(c => c.classList.add("tap-seq-hidden"));
        state.locked = true; state.ownsAudio = true; state.revealing = true;
        let revDone = false;
        const enableAll = ()=>{ if(revDone) return; revDone = true;
          state.locked = false; state.revealing = false; state.ownsAudio = false;
          chips.forEach(c => c.classList.remove("tap-seq-hidden")); };
        const sayThen = (src, next)=>{
          if(revDone || CARD.slides[state.idx] !== slide) return;
          let advanced = false, fb = null;
          const go = ()=>{ if(advanced || revDone) return; advanced = true; if(fb) clearTimeout(fb); next(); };
          play(src || null, go);
          fb = setTimeout(go, _clipNetMs(src));
        };
        const revStep = (i)=>{
          if(revDone || CARD.slides[state.idx] !== slide) return;
          if(i >= chips.length){ enableAll(); return; }
          chips[i].classList.remove("tap-seq-hidden");
          const aid = items[i] && items[i].audio;
          sayThen(aid ? ("assets/Audio/" + aid + "." + AUDIO_EXT) : null,
                  ()=> setTimeout(()=> revStep(i + 1), 180));
        };
        sayThen(audioFor(slide, "prompt") || null, ()=> revStep(0));
        setTimeout(()=>{ if(CARD.slides[state.idx] === slide) enableAll(); },
          _chainNetMs([(slide.audio && slide.audio.prompt) || null]
            .concat(items.map(t => (t && t.audio) || null)), 16000));
      }
    }
  },

  SENTENCE_SOUND: {
    mount(host, slide){
      const d = slide.data || {};
      const stim = document.createElement("div"); stim.className = "sentence-sound-stim";
      const strip = document.createElement("div"); strip.className = "sentence-strip";
      (d.words || []).forEach(w => {
        const chip = document.createElement("div"); chip.className = "sentence-word";
        chip.innerHTML = `<span class="sw-text ink-glyph">${(typeof w === "string") ? w : w.text}</span>`;
        strip.appendChild(chip);
      });
      const whole = d.whole_audio ? ("assets/Audio/" + d.whole_audio + "." + AUDIO_EXT) : null;
      stim.appendChild(strip);
      /* [S01r4f] hide_replay: a self-driving teach page can drop the pill entirely. The Swiftie
         shoulder chip still replays the line, so nothing is lost - this only removes the second,
         redundant control sitting between the sentence and the letter card. */
      if(!d.hide_replay){
        const spk = document.createElement("button"); spk.className = "read-whole-btn"; spk.innerHTML = "फिर सुनो";   /* [28m] no volume glyph */
        spk.onclick = ()=>{ if(state.demoRunning || isPlaying) return;   // [24a N8] a mid-demo/mid-VO replay would gen-kill the reveal chain (आगे brick)
          state.audioReplays++; strip.querySelectorAll(".sentence-word").forEach(c => c.classList.add("said"));
          play(whole, ()=>{}); };
        stim.appendChild(spk);
      }
      if(d.teach_seq){
        /* [S01r4] TEACH SEQUENCE - the SME's "Recommended Animation Flow", authored per page.
           Round 3 had to report the two highlight asks as NOT BUILT; this is them. The flow differs
           per page (the cha/ma pages emphasise the letter BEFORE marking the words, the pa page marks
           the words first and emphasises the letter after), so it is DATA, not a hardcoded order:
             {step:"sentence"}            play whole_audio, karaoke-highlighting word by word
             {step:"clear_words"}         drop the word-level highlighting  ("never leave whole words highlighted")
             {step:"letter", audio:id}    reveal + emphasise the letter card, playing ONLY that sound
             {step:"mark", audio:id, words:[...]}  play a clip while the target akshara lights up in
                                          each listed word, one at a time, in step with the clip
             {step:"say", audio:id}       just speak
             {step:"pause", ms:n}         the SME's "brief pause ... so the child gets a moment"
           Absent => the legacy d.auto reveal below is untouched. */
        state.ownsAudio = true; state.demoRunning = true; setNavActive(false);
        /* [S01r5k] ss-teach: the hook the stylesheet needs to lift the sentence clear of the
           letter card on the three teach pages, without touching the question pages. */
        const qrow = document.createElement("div"); qrow.className = "q-row ss-teach"; qrow.appendChild(stim);
        const grid = document.createElement("div");
        grid.className = "opt-grid ss-letter-card cols-" + ((d.options || []).length || 1);
        const cells = (d.options || []).map(opt => {
          const c = letterCell(opt.letter); c.classList.add("opt-cell", "seq-hidden");
          grid.appendChild(c); return { c, opt };
        });
        qrow.appendChild(grid); host.appendChild(qrow);

        const chips = [...strip.querySelectorAll(".sentence-word")];
        const texts = (d.words || []).map(w => (typeof w === "string") ? w : w.text);
        const clearWords = ()=> chips.forEach(c => c.classList.remove("said", "saying"));
        /* Pre-render each word so the "mark" beat can light just the target.
           mark_bare => the letter-overlay (only च, never चू/चा — the matra is not in the overlay's
           text, so it cannot be caught); otherwise the older whole-akshara span. The size passed here
           must match the rendered size or every overlay lands in the wrong place: the chip's own
           .sw-text is 60px, set in the stylesheet, NOT inherited from this module. */
        chips.forEach((c, i) => {
          const t = c.querySelector(".sw-text");
          if(!t) return;
          if(d.mark_bare){
            /* [S01r4h] SAME STRUCTURE AS THE COVER. The overlay now lives INSIDE .sw-text, exactly
               as the landing hero's .lh-word does, instead of being a sibling positioned by measured
               geometry.
               Why the sibling had to go: it was absolutely positioned against the CHIP, from
               getBoundingClientRect() on .sw-text. An inline span's rect is its FONT BOX, but an
               absolutely-positioned box is blockified and its text sits in a LINE BOX — so the two
               differ by the half-leading, (line-height − (ascent+descent))/2. .sentence-word sets
               line-height:1.1 and Baloo 2's Devanagari font box is ~1.4em, so at 48px the orange
               letter landed ~9px off the navy one: the doubled glyph in the report. Every earlier
               round moved that number without removing the reason the two boxes disagree.
               Nested, the question cannot arise — .sw-base and .sw-lit share one line box and one
               baseline (top:0), so they register by construction, and because .sound-layered is
               inline-block centerInkGlyph's translateY now moves BOTH together.
               centerInkGlyph reads .sw-base, so the width-fit still sees "चूहे", not "चूहेच". */
            t.classList.add("sound-layered");
            t.dataset.swWord = texts[i];
            t.dataset.swTarget = d.target_sound || "";
            t.innerHTML = soundWordHTML(texts[i], d.target_sound,
                                        parseFloat(getComputedStyle(t).fontSize) || 48);
            /* the chip-level hook the CSS used to get from data-sw-word, which now sits on .sw-text */
            c.classList.add("bare-mark");
          } else {
            t.innerHTML = aksharaHTML(texts[i], d.target_sound);
          }
        });

        const alive = ()=> CARD.slides[state.idx] === slide;
        let done = false;
        const finish = ()=>{ if(done) return; done = true;
          state.demoRunning = false; setNavActive(true); $("navBtn").onclick = ()=> completeSlide(true); };

        const STEPS = d.teach_seq.slice();
        /* [S01r6b] The letter card used to be revealed only by the `letter` step. It is now also
           revealed from INSIDE the mark step, on the token where the voice names the sound, so the
           two need one shared definition rather than a copy each. Idempotent: whichever beat gets
           there first shows the card, the other is a no-op. */
        let _cardShown = false;
        const showLetterCard = ()=>{
          if(_cardShown) return; _cardShown = true;
          cells.forEach(x => { x.c.classList.remove("seq-hidden"); x.c.classList.add("ss-show"); });
          const t = cells.find(x => x.opt.letter === d.target_sound) || cells[0];
          /* [S01r4f] NOT `.correct`. That class paints the card green AND hangs a checkmark badge off
             it, which on a teach slide reads as "you answered right" when nothing has been answered.
             `ss-lit` is neutral emphasis - and it carries the amber ssLitPulse, which is the
             pulsation the SME asked for; no extra class is needed for that. */
          if(t){ t.c.classList.add("ss-lit");
                 if(!d.mark_bare) t.c.classList.add("reveal-pulse");
                 cells.forEach(x => { if(x !== t) x.c.classList.add("faded"); }); }
          SwiftPAL.emit("sentence_sound_demo", { slide_id: slide.id, phase: slide.phase, sound: d.target_sound });
        };
        const run = (i)=>{
          if(!alive()) return;
          if(i >= STEPS.length){ finish(); return; }
          const st = STEPS[i] || {};
          const next = ()=> setTimeout(()=> run(i + 1), 260);
          if(st.step === "sentence"){
            /* word-by-word, in step with the VO; the spoken word is `saying`, the ones already read
               stay `said` so the child can see the line accumulating. */
            karaokePlay(whole, texts, (k)=>{
              chips.forEach((c, j) => { c.classList.toggle("saying", j === k); if(j <= k) c.classList.add("said"); });
            }, ()=>{ chips.forEach(c => c.classList.remove("saying")); next(); });
            return;
          }
          if(st.step === "clear_words"){ clearWords(); next(); return; }
          if(st.step === "pause"){ setTimeout(()=> run(i + 1), st.ms || 700); return; }
          if(st.step === "letter"){
            showLetterCard();
            const t = cells.find(x => x.opt.letter === d.target_sound) || cells[0];
            /* [S01r4f] NOT `.correct`. That class paints the card green AND hangs a checkmark badge
               off it (.opt-cell.correct::after), which on a teach slide reads as "you answered right"
               when the child has not answered anything - there is nothing to answer here. `ss-lit` is
               neutral emphasis: the card is simply the letter, being shown. */
            /* [S01r4g] `reveal-pulse` animates a GREEN box-shadow - a leftover from when this card
               was `.correct`. On an amber card it is both the wrong colour and one more thing moving
               on a page asked to simply highlight. Dropped wherever the letter is marked bare. */
            /* `silent` shows the letter without speaking it. The deck asked for the bare sound on this
               beat; a later review asked for the sentence and the explanation ONLY, so the card can
               arrive without a clip. Absent => unchanged (the target sound plays, as before). */
            if(st.silent){ next(); return; }
            const a = st.audio ? ("assets/Audio/" + st.audio + "." + AUDIO_EXT) : (audioFor(slide, "target") || null);
            play(a, next);
            return;
          }
          if(st.step === "mark"){
            /* Light the target akshara in each listed word, one at a time, paced by the clip that
               names them. Words NOT listed are never marked - the deck is explicit about this on the
               ma page: "Do not highlight लाए, because it does not contain the target sound". */
            const listed = st.words || texts.filter(t => wordHasSound(t, d.target_sound));
            const order  = listed.map(t => texts.indexOf(t)).filter(k => k >= 0);
            const a = st.audio ? ("assets/Audio/" + st.audio + "." + AUDIO_EXT) : null;
            /* `lift` is the travelling emphasis (.mark-now); `n` is how many listed words have been
               reached. Every reached word KEEPS its mark - the ask is that the child sees the same
               sound recurring across the whole line, not one lamp moving along it. */
            const markUpTo = (n, lift)=>{
              chips.forEach(c => c.classList.remove("mark-now"));
              const j = Math.min(Math.max(n, 0), order.length - 1);
              if(lift && chips[order[j]]) chips[order[j]].classList.add("mark-now");
              for(let q = 0; q <= j; q++){
                if(chips[order[q]]) chips[order[q]].classList.add("marked");
              }
            };
            /* [S01r4i] PACE AGAINST THE WHOLE SPOKEN LINE, NOT JUST THE WORDS BEING MARKED.
               karaokePlay spreads the tokens it is given across the FULL duration of the clip. Handed
               only the four listed words, it therefore stretched them over a clip that says
               "चूहे, चार, चने, चबाए—इन सब शब्दों में च की आवाज़ बार-बार आई।" - the four words are spoken in
               roughly its first third and the rest names none of them. चबाए duly lit at ~63% of
               the clip, half a sentence after the voice had said it.
               The landing hero already had the answer: tokenise the SPOKEN SCRIPT from
               CARD.assets.audio_text, find where each shown word falls in it, and let karaokePlay
               run the whole token list. Proportional to the real script, so the tail carries its own
               weight instead of being handed to the last word. Same approach, same data, and no
               forced aligner in this toolchain either way.
               Only engages when the script is LONGER than the words being marked (T3, T5). T1's
               vo_t1_words is exactly its four words, so it keeps the original pacing untouched. */
            const line = (st.audio && CARD.assets && CARD.assets.audio_text &&
                          CARD.assets.audio_text[st.audio]) || "";
            const toks = line ? _voTokens(line) : [];
            if(toks.length > listed.length){
              /* Trailing danda / comma / dash differ between the chip and the script - the chip reads
                 "चबाए।" while the script runs it into "चबाए—इन" - so compare on the bare word. */
              const bare = (s)=> String(s).replace(/[।॥,.!?—–-]+$/g, "");
              const findTok = (needle, start)=>{
                const nb = bare(needle);
                for(let j = start; j < toks.length; j++) if(bare(toks[j]) === nb) return j;
                for(let j = start; j < toks.length; j++) if(toks[j].indexOf(nb) >= 0) return j;
                return -1;
              };
              const at = []; let from = 0;
              listed.forEach(w => {
                let k = findTok(w, from);
                if(k < 0) k = Math.min(from, toks.length - 1);   // unmatched: keep the reading order
                at.push(k); from = k + 1;
              });
              const last = at[at.length - 1];
              /* [S01r6b] SME: "when the VO says '<letter> की आवाज़ बार-बार आई' then show the letter on
                 screen and pulsate it". `reveal_at` names the token to wait for - the standalone
                 अक्षर, which findTok matches EXACTLY before it falls back to a substring, so the same
                 letter sitting inside चूहे / चार / चने never steals the cue. The card therefore lands
                 on the word that names it instead of after the clip, and r6a's separate spoken
                 letter beat is retired with it. */
              const revealIdx = st.reveal_at ? findTok(st.reveal_at, 0) : -1;
              karaokePlay(a, toks, (k)=>{
                let n = -1;
                for(let j = 0; j < at.length; j++) if(k >= at[j]) n = j;
                /* past the last named word the voice has moved on to the explanation, so drop the
                   travelling emphasis - the marks themselves stay lit for the rest of the clip */
                if(n >= 0) markUpTo(n, k <= last);
                if(revealIdx >= 0 && k >= revealIdx) showLetterCard();
              }, ()=>{ chips.forEach(c => c.classList.remove("mark-now"));
                       /* a clip that stalls, or a token that never matched, must not cost the child
                          the card entirely - it is the point of the page */
                       if(st.reveal_at) showLetterCard();
                       next(); });
              return;
            }
            karaokePlay(a, listed, (k)=> markUpTo(k, true),
                        ()=>{ chips.forEach(c => c.classList.remove("mark-now")); next(); });
            return;
          }
          /* "say" (and any unknown step) = just speak it */
          play(st.audio ? ("assets/Audio/" + st.audio + "." + AUDIO_EXT) : null, next);
        };

        state.replayAudio = ()=> play(whole, ()=>{});
        $("navBtn").onclick = ()=> completeSlide(true);
        setTimeout(()=> run(0), 400);
        /* FAIL-SAFE: आगे never stays dead if a clip blocks or stalls */
        setTimeout(()=>{ if(alive()) finish(); }, STEPS.length * 9000 + 6000);
        return;
      }
      if(d.auto){
        // 16k: AUTONOMOUS tutorial demo (test-in-tutorial fix) — play the line, then REVEAL the
        // repeating sound (highlight the correct sound chip); no child pick. Then explain + आगे.
        state.ownsAudio = true; state.demoRunning = true; setNavActive(false);   // [24a N8]
        const qrow = document.createElement("div"); qrow.className = "q-row"; qrow.appendChild(stim);
        const grid = document.createElement("div"); grid.className = "opt-grid cols-" + ((d.options || []).length || 3);
        const cells = (d.options || []).map(opt => { const c = letterCell(opt.letter); c.classList.add("opt-cell"); grid.appendChild(c); return { c, opt }; });
        qrow.appendChild(grid); host.appendChild(qrow);
        const chips = [...strip.querySelectorAll(".sentence-word")];
        const reveal = ()=>{
          if(CARD.slides[state.idx] !== slide) return;                      // navigated away → abort
          chips.forEach(c => c.classList.add("said"));
          const t = cells.find(x => x.opt.letter === d.target_sound);
          if(t){ t.c.classList.add("correct", "reveal-pulse"); cells.forEach(x => { if(x !== t) x.c.classList.add("faded"); }); }
          SwiftPAL.emit("sentence_sound_demo", { slide_id: slide.id, phase: slide.phase, sound: d.target_sound });
          setTimeout(()=> play(audioFor(slide, "explain") || audioFor(slide, "conclude") || null, ()=>{ state.demoRunning = false; setNavActive(true); }), 300);
        };
        state.replayAudio = ()=> play(whole, ()=>{});
        $("navBtn").onclick = ()=> completeSlide(true);                     // explicit — dead-button lesson
        play(whole, ()=> setTimeout(reveal, 400));
        return;
      }
      /* [S01r5m] THE HINT IS THE SENTENCE AGAIN, WITH THE LETTER LIT.
         With no `hint` id authored on these two pages the 2nd-wrong rung fell through to the PROMPT
         clip, so the help a struggling child got was the question re-read at them — the SME heard it
         as "ध्यान से सुनो…" and asked for it to be replaced by "play the sentence again and highlight
         the च letter just like we did in pages 1, 3 and 5".
         So it now does what those teach pages do: the target akshara is overlaid on each word (the
         two-layer form, so only the consonant lights and never its matra), and the line is replayed
         with each word lighting as it is spoken. The overlay is built HERE rather than at mount
         because this is a question — lighting the answer inside the stimulus before the child has
         tried would hand it to them. */
      const _hintReplay = (done)=>{
        const chips = [...stim.querySelectorAll(".sentence-word")];
        const texts = (d.words || []).map(w => (typeof w === "string") ? w : w.text);
        const tgt = d.target_sound || "";
        chips.forEach((c, i)=>{
          const t = c.querySelector(".sw-text");
          if(!t || t.classList.contains("sound-layered")) return;
          t.classList.add("sound-layered");
          t.dataset.swWord = texts[i]; t.dataset.swTarget = tgt;
          t.innerHTML = soundWordHTML(texts[i], tgt, parseFloat(getComputedStyle(t).fontSize) || 48);
          c.classList.add("bare-mark");
        });
        chips.forEach(c => c.classList.remove("marked", "said", "saying"));
        const wholeSrc = d.whole_audio ? ("assets/Audio/" + d.whole_audio + "." + AUDIO_EXT) : null;
        karaokePlay(wholeSrc, texts, (k)=>{
          chips.forEach((c, j)=>{
            c.classList.toggle("saying", j === k);
            if(j <= k){ c.classList.add("said");
              /* [S01r5n] `mark_initial` marks ONLY a word that BEGINS with the target. P4's new
                 sentence is "नानी ने नई नाव बनाई।" and its question is about the sound at the START
                 of words - but बनाई carries a न in the MIDDLE, so the plain contains-the-letter rule
                 would light it and quietly contradict the question being asked. */
              const _hit = d.mark_initial
                ? (splitAksharas(texts[j])[0] || "")[0] === tgt
                : wordHasSound(texts[j], tgt);
              if(_hit) c.classList.add("marked"); }
          });
        }, ()=>{ chips.forEach(c => c.classList.remove("saying")); if(done) done(); });
      };
      mountTapOptions({
        slide, host, signalName: d.signal_name || "sentence_sound_first_try",
        stimulus: stim, columnsHint: (d.options || []).length,
        options: d.options,
        isCorrect: (opt)=> opt.letter === d.target_sound,
        optionRenderer: (opt)=> letterCell(opt.letter),
        mastery: slide.phase === "mastery",
        nudgeTarget: null,
        hintAction: _hintReplay,
        nudgeBelow: true,
        /* [S01r4p] data.fixed_order pins the authored option order. mountTapOptions shuffles by
           default, on purpose, so the answer is never pinned to one position — keep that everywhere
           it is not explicitly overridden. This page's flow names the entry order literally
           ("च -> ल -> र", each letter speaking as it lands), and a shuffled reveal contradicted it
           (observed: च, र, ल). Opt-in only; absent => shuffled exactly as before.
           NOTE the tradeoff is real: the authored order puts the CORRECT letter first. */
        shuffle: (d.fixed_order ? false : undefined)
      });
      state.replayAudio = ()=> play(whole, ()=>{});
    }
  },

  /* 16j NEW: sentence -> pick the matching picture (HI01H06 "वाक्य के लिए सही चित्र चुनो"). Sentence
     chips as the stimulus + 2 picture options via the tap-to-answer contract. */
  /* [S01r4] TAP_BALLOON_SOUND - NEW MECHANIC, SME deck page 8: "Remove the existing haan/nahin
     activity and replace it with an interactive balloon-based activity for identifying the 'pa' sound."
     It is a multi-select hunt like TAP_ALL_WITH_SOUND, but deliberately NOT that module, because the
     deck's defining ask is the one TAP_ALL cannot honour: "Do not show any written instruction on the
     screen. Do not show feedback text... Do not add object names or any text inside the balloons.
     All instructions, hints, and feedback should come through VO only." TAP_ALL prints a word label
     under every picture and a found/needed counter above them - i.e. it is a READING task wearing a
     listening task's clothes, which is exactly what the deck is removing here.
     Feedback ladder is the deck's, not the engine default: 1st wrong = shake + buzz and NO voice
     line ("a short negative feedback sound only"); 2nd = shake + the hint clip; 3rd = the earned hand
     on a balloon that is still correct. handOnAnswer self-gates by phase, so the hand appears in this
     guided slide and would not in practice - the round-3 no-hand-in-practice ruling still holds. */
  /* [S01r4] TAP_BALLOON_SOUND - NEW MECHANIC, SME deck page 8: "Remove the existing haan/nahin
     activity and replace it with an interactive balloon-based activity for identifying the 'pa' sound."
     It is a multi-select hunt like TAP_ALL_WITH_SOUND, but deliberately NOT that module, because the
     deck's defining ask is the one TAP_ALL cannot honour: "Do not show any written instruction on the
     screen. Do not show feedback text... Do not add object names or any text inside the balloons.
     All instructions, hints, and feedback should come through VO only."

     [S01r5o] ROUNDS. The SME asked for the page to keep going: a popped balloon is replaced in place
     so the sky never thins out, and when every target in a round has been found the whole set is
     swapped for the next one. `data.levels` carries those rounds; a card with only `data.items`
     still works and behaves exactly as before, as one round. */
  TAP_BALLOON_SOUND: {
    mount(host, slide){
      const d = slide.data || {};
      const LEVELS = (d.levels && d.levels.length)
        ? d.levels
        : [{ target_sound: d.target_sound, items: d.items || [], spares: d.spares || [] }];
      let li = 0, found = 0, need = 0, spares = [], cells = [];
      state.attempts = 0; state.locked = false; state.ownsAudio = true;

      const field = document.createElement("div"); field.className = "balloon-field";
      /* [S01r5g] SWIFTEE HOLDING THE BALLOONS, bottom-left, exactly where the SME's reference puts
         her. TWO images, not one: a GIF cannot be paused, so the animated frame and a still of its
         first frame are both in the DOM and CSS swaps them on `body.vo-lock` - which setPlaying()
         toggles for precisely as long as a clip is sounding. So she gestures while the VO talks and
         freezes the moment it stops, with no timer of our own to drift. */
      const sw = document.createElement("div"); sw.className = "bal-swiftee";
      /* [S01r4w] ANIMATED WEBP, not GIF: 2,145 KB -> 456 KB at 408px/10fps, alpha intact.
         Originals in _assets_round4/sme_originals/. */
      sw.innerHTML = '<img class="bsw-anim" src="assets/gif/swifty_with_balloons.webp" alt="">' +
                     '<img class="bsw-still" src="assets/gif/swifty_with_balloons_still.webp" alt="">';
      /* [S01r5h] SHE IS ALSO THE REPLAY CONTROL - the reference screen has no audio chip. */
      sw.onclick = ()=>{
        if(state.locked || isPlaying) return;
        state.audioReplays++;
        play(audioFor(slide, "prompt") || null, ()=>{});
      };
      field.appendChild(sw);
      host.appendChild(field);
      /* the deck's reference screen is a bare stage: no prompt band, no hint chip, no आगे */
      $("stage").classList.add("vo-only");
      document.body.classList.add("bal-page");
      balMusicStart();          /* [S01r6i] loads the bed and holds it SILENT; balMusicOpen opens it */
      $("hintBtn").classList.remove("show"); $("hintBtn").style.display = "none";
      $("navBtn").style.display = "none"; setNavActive(false);

      const alive = ()=> CARD.slides[state.idx] === slide;
      /* [S01r5o] A ROUND CAN OVERRIDE THE SLIDE'S LINES. The praise and the hint name the sound
         being hunted ("इसमें प की आवाज़ है"), so they cannot be shared across rounds that hunt
         different sounds. `levels[n].audio` carries the round's own ids; anything it does not name
         falls back to the slide's, so a single-round card needs no audio block at all. */
      const lvlAudio = (key)=>{
        const a = (LEVELS[li] || {}).audio;
        if(a && a[key]) return "assets/Audio/" + a[key] + "." + AUDIO_EXT;
        return audioFor(slide, key);
      };
      const sparkle = (el, hue)=>{
        if(document.documentElement.classList.contains("no-anim")) return;
        /* [S01r4u] two rings, 22 particles: a fast outer throw and a slower inner spray, each with
           its own angle jitter, distance, size, spin and hue. Two rings at different speeds is what
           reads as debris; one ring at one speed reads as a diagram.
           [S01r5o] ...plus SHARDS in the balloon's OWN colour. Sparks alone read as a firework; what
           says "balloon" is torn rubber, so six curved slivers are thrown with the sparks, tumbling
           as they go. `hue` is the popped balloon's fill, so the debris matches what burst. */
        const s = document.createElement("div"); s.className = "bal-sparkle";
        const R = (a, b)=> a + Math.random() * (b - a);
        const HUES = ["#FFD86B","#FFC93C","#FFE9A8","#FFB01F","#FFF4D0"];
        [{n:13, d:[92,132], sz:[7,12], t:[.62,.86]},
         {n:9,  d:[44,76],  sz:[4,8],  t:[.48,.70]}
        ].forEach((ring, ri)=>{
          for(let i = 0; i < ring.n; i++){
            const p = document.createElement("i");
            p.style.cssText =
              "--a:" + ((i * (360 / ring.n)) + R(-13, 13) + ri * 18).toFixed(1) + "deg;" +
              "--d:" + R(ring.d[0], ring.d[1]).toFixed(0) + "px;" +
              "--sz:" + R(ring.sz[0], ring.sz[1]).toFixed(1) + "px;" +
              "--sp:" + Math.round(R(-160, 160)) + "deg;" +
              "--t:" + R(ring.t[0], ring.t[1]).toFixed(2) + "s;" +
              "--dl:" + Math.round(R(0, 90)) + "ms;" +
              "background:" + HUES[(i + ri) % HUES.length] + ";";
            s.appendChild(p);
          }
        });
        for(let i = 0; i < 6; i++){
          const f = document.createElement("b");                 /* a shard, not a spark */
          f.style.cssText =
            "--a:" + ((i * 60) + R(-22, 22)).toFixed(1) + "deg;" +
            "--d:" + R(58, 104).toFixed(0) + "px;" +
            "--sz:" + R(9, 16).toFixed(1) + "px;" +
            "--sp:" + Math.round(R(-420, 420)) + "deg;" +
            "--t:" + R(.54, .78).toFixed(2) + "s;" +
            "--dl:" + Math.round(R(0, 70)) + "ms;" +
            "background:" + (hue || "#FFC93C") + ";";
          s.appendChild(f);
        }
        el.appendChild(s); setTimeout(()=>{ try{ s.remove(); }catch(e){} }, 1200);
      };
      /* [S01r5i] a shockwave ring, dropped in behind the balloon for the length of the pop */
      const burstRing = (el)=>{
        if(document.documentElement.classList.contains("no-anim")) return;
        const r = document.createElement("span"); r.className = "bal-ring";
        el.appendChild(r); setTimeout(()=>{ try{ r.remove(); }catch(e){} }, 700);
      };
      const remainingCorrect = ()=> cells.filter(c => c.it.has === true && !c.b.classList.contains("popped"));
      /* [S01r5o] After two misses the balloons that ARE the answer breathe. This replaces the hand:
         the SME asked for it to go, and on a field of eight floating targets a single pointing hand
         could only ever indicate one of the four - the glow can mark them all at once, which is what
         "which ones am I looking for" actually needs. */
      const glowCorrect = ()=> remainingCorrect().forEach(c => c.b.classList.add("bal-hot"));

      const fillBalloon = (b, it)=>{
        /* [S01r5c] .bal-lift wraps the balloon so the IDLE FLOAT and the ENTRANCE live on different
           elements - an animation beats a transition on the same property, so with both on .balloon
           the `seq-hidden` rise never ran and they only faded in. */
        b.innerHTML = '<div class="bal-lift"><div class="bal-body">' +
                      imgOrEmoji(it.img, it.emoji, "bal-img", "bal-emoji") +
                      '<span class="bal-shine"></span></div><span class="bal-tie"></span></div>';
      };

      let busy = false;

      let revealing = false;
      /* [S01r6e] flightPath lives HERE, not inside renderLevel. wireTap's REFILL path needs it too,
         and when it was scoped to renderLevel that call threw `flightPath is not defined` - the
         refilled balloon kept .seq-hidden and stayed parked below the floor at opacity 0. Measured
         before the fix: 7 of 8 balloons on the board after one correct pop, so every correct answer
         quietly cost the child a balloon. Nothing in it depends on the level, only on `sw`. */
      const swRect = ()=>{ try{ return sw.getBoundingClientRect(); }catch(e){ return null; } };
      /* [S01r6j] Release everything still flying, then hand over. Lives up here beside flightPath
         because wireTap's round-complete path calls it, and r6e is the standing lesson about what
         happens when one of these helpers is scoped inside renderLevel instead.
         `:not(.popped)` because a popped balloon has already gone - balPop took it - and animating
         a burst balloon back into the air would undo the child's own answer in front of them.
         Every balloon gets its own drift, spin, duration and delay: eight identical exits would read
         as one sheet of balloons sliding off, which is the lockstep problem r6c fixed at the other
         end of the round. The callback is timed off the slowest of them rather than a fixed guess,
         and it re-checks alive() - a child who leaves mid-exit must not land on a rebuilt board. */
      const clearField = (done)=>{
        const live = [...field.querySelectorAll(".balloon:not(.popped)")];
        if(!live.length){ done(); return; }
        const R = (lo, hi)=> lo + Math.random() * (hi - lo);
        let last = 0;
        live.forEach((b)=>{
          const dur = R(1.15, 1.55), del = R(0, 0.34);
          b.style.setProperty("--lx",   R(-58, 58).toFixed(0) + "px");
          b.style.setProperty("--lr",   R(-11, 11).toFixed(0) + "deg");
          b.style.setProperty("--ldur", dur.toFixed(2) + "s");
          b.style.setProperty("--ldel", del.toFixed(2) + "s");
          /* bal-entering is dropped, not left to fight: both rules set `animation` on the same
             element. For a settled balloon this is seamless - balLeave's 0% is translate(0,0), which
             is exactly where balEnter's `forwards` fill left it. */
          b.classList.remove("bal-entering", "bal-hot");
          b.classList.add("bal-leaving");
          last = Math.max(last, (dur + del) * 1000);
        });
        setTimeout(()=>{ if(alive()) done(); }, last + 90);
      };
      const flightPath = (b)=>{
        /* Start below the floor, somewhere else horizontally, and swing on the way up. The one
           hard constraint is Swiftie: she stands at the lower left, and a balloon rising through
           her reads as a collision. Measure her box and push any start that would cross it to the
           RIGHT of her, rather than trusting a fixed safe range - the field reflows with --scale. */
        const R = (lo, hi)=> lo + Math.random() * (hi - lo);
        const bb = b.getBoundingClientRect(), sr = swRect();
        let ex  = R(-210, 210);
        let emx = -ex * R(0.25, 0.55);                  /* swing back across on the way up */
        if(sr && sr.width){
          /* Test the WHOLE path, not just the start: the balloon is at rest+ex when it appears and
             rest+emx at the top of its swing, so either can put it over her. Clear her right edge
             by a visible margin - an 18px miss still reads as a near-collision on screen. */
          const PAD = 40;
          const leftAt = (dx)=> bb.left + dx;
          const crosses = (dx)=> (bb.right + dx) > (sr.left - PAD) && leftAt(dx) < (sr.right + PAD);
          if(crosses(ex) || crosses(emx)){
            ex = Math.min((sr.right + PAD) - bb.left + R(10, 90), 260);  /* come in from her right */
            if(ex < 0) ex = R(60, 180);
            emx = -ex * R(0.18, 0.38);
            if(crosses(emx)) emx = Math.abs(emx);       /* and do not swing back into her */
          }
        }
        b.style.setProperty("--ex", ex.toFixed(0) + "px");
        b.style.setProperty("--emx", emx.toFixed(0) + "px");
        b.style.setProperty("--er", R(-9, 9).toFixed(0) + "deg");
        b.style.setProperty("--edur", R(1.25, 1.75).toFixed(2) + "s");
      };
      const wireTap = (cell)=>{
        const b = cell.b;
        b.onclick = ()=>{
          const it = cell.it;                                     /* re-read: a balloon can be refilled */
          if(state.locked || busy || b.classList.contains("popped") || b.classList.contains("seq-hidden")) return;
          if(isPlaying && !state._balFb) return;                  /* never talk over the prompt */
          if(state._balFb){ stopAudio(); state._balFb = false; }
          stopNudge(); busy = true;
          const vb = setTimeout(()=>{ busy = false; }, 6500);      /* fail-safe: a superseded onEnd must not soft-lock */
          const name = it.audio ? ("assets/Audio/" + it.audio + "." + AUDIO_EXT) : null;
          /* [S01r5o] THE WORD COMES FIRST, then everything else. r5h had the feedback sound land on
             the tap and held the word back behind it, because the buzzer was drowning the word. The
             SME's ruling settles the order the other way: "the VO of that particular word should play
             like पतंग and THEN the rest of the VO". So the name plays alone on the tap, and the pop
             or the buzz - and the line after it - waits for the word to finish. Nothing overlaps, and
             no hold constant is needed any more. */
          const afterName = (cb)=>{
            const go = ()=>{ clearTimeout(vb); busy = false; if(alive()) cb(); };
            if(name) play(name, go); else setTimeout(go, 120);
          };

          if(it.has === true){
            /* the balloon does not burst until it has been NAMED - see afterName above */
            afterName(()=>{
              /* the balloon's fill is NOT its background: `.balloon[class*="bcol-"] .bal-body`
                 resets background to none and the skin is drawn by a hue-rotated ::before.
                 What each bcol- DOES still set is `color`, so that is the accent to throw. */
              const _bb = b.querySelector(".bal-body");
              const hue = _bb ? getComputedStyle(_bb).color : "#FFC93C";
              /* [S01r6j] bal-entering comes OFF before popped goes on. A refilled balloon carries
                 it for up to 1.75s (r6e), and a child can certainly tap one inside that window -
                 but `.balloon.bal-entering` sits BELOW `.balloon.popped` in the stylesheet at equal
                 specificity, so it won the `animation` property and balPop never ran: the balloon
                 the child had just correctly popped stayed on screen at full opacity, merely
                 untappable. Popping is the one piece of feedback this game cannot afford to lose. */
              b.classList.remove("bal-entering");
              b.classList.add("popped"); sparkle(b, hue); burstRing(b);
              /* [S01r4v] the SME's own pop recording, trimmed 1.97s -> 0.21s with the peak 30ms in.
                 sfxCorrect stays - the pop and the "that was right" ding are two different messages. */
              playSfx("sfx_bal_pop"); sfxCorrect(); setSwMood("happy");
              found++;
              SwiftPAL.emit("sound_found", { slide_id: slide.id, phase: slide.phase, img: it.img });
              if(found >= need){
                state.locked = true; setSwMood("celebrate"); confettiCannon();
                SwiftPAL.emit(d.signal_name || "balloon_sound_first_try", {
                  slide_id: slide.id, phase: slide.phase, value: state.attempts === 0,
                  attempts: state.attempts, latency_ms: Date.now() - state.slideStart, level: li + 1 });
                const last = (li >= LEVELS.length - 1);
                play(lvlAudio(last ? "done" : "correct") || lvlAudio("correct") || null,
                     ()=>{ if(!alive()) return;
                           if(last) setTimeout(()=> completeSlide(state.attempts === 0), 700);
                           /* [S01r6j] let the board go up before the next one comes up */
                           else     setTimeout(()=> clearField(()=> { li++; renderLevel(); }), 500); });
              } else {
                /* [S01r5o] the popped balloon is REFILLED rather than left as a hole: the SME asked
                   for "at that place other balloon will appear with other image". It always refills
                   with a NON-target word, so the number still to find stays exactly what the round
                   promised and the child cannot be handed a free extra. */
                const spare = spares.length ? spares.shift() : null;
                if(spare) setTimeout(()=>{
                  if(!alive()) return;
                  /* [S01r6e] SME: "when we pop a balloon the new balloon also come from the bottom
                     of the screen". It used to fade back in on the spot, which read as the same
                     balloon changing its mind rather than a new one arriving. It now takes the same
                     flight the opening set takes - own start, own swing, and the same clearance
                     around Swiftie, because flightPath measures her every time. */
                  cell.it = spare; fillBalloon(b, spare);
                  b.classList.remove("popped", "bal-hot", "bal-entering");
                  b.classList.add("seq-hidden");
                  flightPath(b);
                  requestAnimationFrame(()=> requestAnimationFrame(()=>{
                    b.classList.remove("seq-hidden");
                    b.classList.add("bal-entering");
                  }));
                }, 560);
                play(lvlAudio("correct") || null, ()=>{});
              }
            });
          } else {
            state.attempts++; b.classList.add("bal-shake");
            setTimeout(()=> b.classList.remove("bal-shake"), 620);
            SwiftPAL.emit("answer_wrong", { slide_id: slide.id, phase: slide.phase, attempts: state.attempts });
            const n = state.attempts;
            afterName(()=>{
              sfxWrongSoft(); setSwMood("tryagain");
              /* 1st wrong: the buzz IS the feedback - the deck asks for no voice line here */
              if(n < 2) return;
              /* [S01r5o] two misses earns the glow on every remaining answer. The hand is gone. */
              glowCorrect();
              state._balFb = true; state.scaffoldLevel = Math.max(state.scaffoldLevel, 3);
              SwiftPAL.emit("hint_shown", { slide_id: slide.id, attempts: n });
              play(lvlAudio("hint") || lvlAudio("try_again") || null,
                   ()=>{ state._balFb = false; });
            });
          }
        };
      };

      /* instruction is VO-only, and the balloons float in after it so the child hears before they act */
      state._balFb = false;
      const renderLevel = ()=>{
        if(!alive()) return;
        const L = LEVELS[li] || {};
        const its = (L.items || []).slice();
        spares = (L.spares || []).slice();
        need = its.filter(it => it.has === true).length;
        found = 0; state.locked = false; busy = false; revealing = false;
        [...field.querySelectorAll(".balloon")].forEach(b => b.remove());
        cells = its.map((it, i) => {
          const b = document.createElement("div");
          /* seq-hidden, NOT a private class: capture tooling settles staggered reveals by stripping
             .seq-hidden, and a mechanic that invents its own name captures BLANK instead. */
          b.className = "balloon bcol-" + (i % 6) + " seq-hidden";
          b.style.setProperty("--bi", String(i));
          /* [S01r6c] its own float, so the set does not breathe in lockstep. Ranges are deliberately
             narrow: this is buoyancy, not drift - the balloon must still be where the child aimed. */
          b.style.setProperty("--bt",  (3.0 + Math.random() * 2.4).toFixed(2) + "s");
          b.style.setProperty("--bamp", (11 + Math.random() * 9).toFixed(0) + "px");
          b.style.setProperty("--bsway", (Math.random() * 12 - 6).toFixed(0) + "px");
          fillBalloon(b, it);
          field.insertBefore(b, sw);
          const cell = { b, it };
          wireTap(cell);
          return cell;
        });
        /* [S01r6d] ONE AT A TIME, EACH ANNOUNCED. SME: "I want balloon come on the screen one by one
           by taking the name of the balloon like patang ghar machli."
           The old reveal dropped all eight in on a 170ms stagger, silently. Now each balloon flies in
           and says its own word, and the next one waits for that clip - so the child hears पतंग, घर,
           मछली as the board is built, which is eight free exposures to the words before a single tap.
           Taps are held until the whole set has landed (`busy`), so a board still arriving cannot be
           answered against. */
        const reveal = ()=>{
          if(!alive() || revealing) return;
          revealing = true; busy = true;
          const step = (i)=>{
            if(!alive()) return;
            if(i >= cells.length){ busy = false;
              balMusicOpen();   /* [S01r6i] "the audio will only sound when the vo is finish" */
              return; }
            const { b, it } = cells[i];
            flightPath(b);
            b.classList.remove("seq-hidden");
            b.classList.add("bal-entering");
            /* name it as it flies: the word starts with the balloon, not after it has landed */
            const w = it.audio ? ("assets/Audio/" + it.audio + "." + AUDIO_EXT) : null;
            const after = ()=> setTimeout(()=> step(i + 1), 120);
            if(w) play(w, after); else setTimeout(after, 520);
          };
          step(0);
        };
        const say = lvlAudio("prompt") || audioFor(slide, "prompt") || null;
        play(say, reveal);
        setTimeout(()=>{ if(alive()) reveal(); }, 9000);   /* FAIL-SAFE: balloons always arrive */
      };
      renderLevel();
      state.replayAudio = ()=> play(audioFor(slide, "prompt") || null, ()=>{});
    }
  },

  SENTENCE_PICK_PIC: {
    mount(host, slide){
      const d = slide.data || {};
      const stim = document.createElement("div"); stim.className = "sentence-sound-stim";
      const strip = document.createElement("div"); strip.className = "sentence-strip";
      (d.sentence_words || []).forEach(w => {
        const chip = document.createElement("div"); chip.className = "sentence-word";
        chip.innerHTML = `<span class="sw-text ink-glyph">${(typeof w === "string") ? w : w.text}</span>`;
        strip.appendChild(chip);
      });
      const whole = d.whole_audio ? ("assets/Audio/" + d.whole_audio + "." + AUDIO_EXT) : null;
      stim.appendChild(strip);
      if(whole){ const spk = document.createElement("button"); spk.className = "read-whole-btn"; spk.innerHTML = "फिर सुनो";   /* [28m] no volume glyph */
        spk.onclick = ()=>{ state.audioReplays++; strip.querySelectorAll(".sentence-word").forEach(c => c.classList.add("said")); play(whole, ()=>{}); };
        stim.appendChild(spk); }
      mountTapOptions({
        slide, host, signalName: d.signal_name || "sentence_pick_pic_first_try",
        stimulus: stim, columnsHint: (d.options || []).length,
        options: d.options,
        isCorrect: (opt)=> opt.correct === true,
        optionRenderer: (opt)=> pictureCell(opt.word_hi || "", opt.emoji, opt.img),
        mastery: slide.phase === "mastery",
        nudgeTarget: null
      });
      state.replayAudio = ()=> play(whole, ()=>{});
    }
  }
};

/* VACHAN (एकवचन/बहुवचन) + any 2-category attribute reuse the GENERIC gender modules — identical
   mechanic, just different labels. A vachan game authors these types with the category in the
   "gender" field (e.g. "S"/"P"), the two labels, and (for pairs) f=singular / m=plural; it then
   inherits immediate tap-to-answer feedback, speak-word-on-tap, layered hints, and the engine
   guard for free. Named *_VACHAN (not *_NUMBER) to avoid colliding with MEET_NUMBER = counting. */
SlideModules.VACHAN_INTRO          = SlideModules.GENDER_INTRO;
SlideModules.MEET_VACHAN           = SlideModules.MEET_GENDER;
SlideModules.TAP_VACHAN            = SlideModules.TAP_GENDER;
SlideModules.TAP_PICTURE_BY_VACHAN = SlideModules.TAP_PICTURE_BY_GENDER;
SlideModules.SORT_VACHAN           = SlideModules.SORT_GENDER;
SlideModules.MATCH_VACHAN_PAIRS    = SlideModules.MATCH_GENDER_PAIRS;

/* ---------- 13. CONTROLLER ---------- */
/* r4: gold star burst for the celebration finale (adopted from Shruti's build) */
function starBurst(){
  if(document.documentElement.classList.contains("no-anim")) return;
  const host = $("confetti"); if(!host) return;
  const cv = document.createElement("canvas");
  cv.width = 1333; cv.height = 750;
  cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
  host.appendChild(cv);
  const ctx = cv.getContext("2d");
  const COLORS = ["#FFE400","#FFBD00","#E89400","#FFCA6C","#FDFFB8"];
  /* [S01r4r · fln-animation-toolkit recipe 8] RETUNED: fewer, slower, longer-lived. 300 particles
     leaving centre at 22px/frame read as one bright flash that is over before the child looks up.
     Gravity stays 0 by design - these float and fade; the confetti is what falls. */
  const TICKS = 150, DECAY = 0.975, START_V = 14, SPIN = 0.18;
  const SHOTS = [0, 220, 440];
  const parts = [];
  function starPath(r){
    ctx.beginPath();
    for(let i=0;i<10;i++){
      const rad = (i % 2 === 0) ? r : r/2;
      const a = Math.PI/5*i - Math.PI/2;
      ctx[i === 0 ? "moveTo" : "lineTo"](Math.cos(a)*rad, Math.sin(a)*rad);
    }
    ctx.closePath();
  }
  function shoot(){
    const add = (n, scalar, shape) => {
      for(let i=0;i<n;i++){
        const a = Math.random()*Math.PI*2;
        parts.push({ x:cv.width/2, y:cv.height/2, ax:Math.cos(a), ay:Math.sin(a),
          vel:START_V*(0.5 + Math.random()), tick:0, scalar, shape,
          color:COLORS[Math.floor(Math.random()*COLORS.length)],
          rot:Math.random()*Math.PI*2, spin:(Math.random()-.5)*SPIN });
      }
    };
    add(32, 1.8, "star");
    add(8,  1.0, "circle");
  }
  SHOTS.forEach(ms => ms ? setTimeout(shoot, ms) : shoot());
  /* derived from the LAST shot, so retiming SHOTS can never end the loop before it fires */
  const MIN_FRAMES = Math.max(...SHOTS) / 16 + 20;
  let frames = 0;
  (function frame(){
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = false;
    for(const p of parts){
      if(p.tick >= TICKS) continue;
      alive = true;
      p.x += p.ax*p.vel; p.y += p.ay*p.vel; p.vel *= DECAY; p.rot += p.spin; p.tick++;
      ctx.globalAlpha = 1 - p.tick/TICKS;
      ctx.fillStyle = p.color;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if(p.shape === "star"){ starPath(8*p.scalar); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(0, 0, 6*p.scalar, 0, Math.PI*2); ctx.fill(); }
      ctx.restore();
    }
    frames++;
    if(alive || frames < MIN_FRAMES) requestAnimationFrame(frame);
    else setTimeout(()=> cv.remove(), 300);
  })();
}
function clearHost(){
  document.body.classList.remove("is-end");   // r4: clear immersive end state when leaving celebration
  /* [28g] "going back from last screen gets swiftie stuck" — clearHost dropped body.is-end but never
     took .show off #endScreen, so the celebration layer (big cheering Swiftie + "बहुत बढ़िया!") stayed
     ON TOP of whatever slide you landed on, covering the middle option card.
     I found this myself earlier tonight and mis-triaged it as low severity — "a child can never go back
     from celebration" — forgetting that REVIEW uses the dev nav, so it hits every review pass. It also
     produced 60 phantom overlap findings in my own audit sweep before I understood it.
     Tear the layer down here, where every slide mount already passes.
     Scoped to the END SCREEN only, on purpose: I first also cleared stage.blurred/gating and the
     phase gate here, but mountSlide runs INSIDE the gate's callback, so that would have un-blurred
     the gray gate mid-flight — breaking the transition built two bumps ago to fix a different report. */
  const _es = $("endScreen");
  if(_es) _es.classList.remove("show", "hint-glow");
  $("slideHost").innerHTML = "";
  $("hintBtn").classList.remove("show");
  $("hintBtn").disabled = false;
  setNavActive(false);
  stopNudge();
  resetIdleVo();   // [27b] no idle-replay timer survives into the next slide; [27f] and the next
                   // slide gets its own single reminder (teardown is the one place the fired flag clears)
  stopAudio();
}

function mountSlide(idx){
  state.idx = idx;
  state.slideStart = Date.now();
  state.attempts = 0; state.selectedKey = null; state.locked = false;
  state.hintUsed = false; state.nudgeUsed = false; state.scaffoldLevel = 0; state.hintActive = false; state.helpShown = false;
  state.audioReplays = 0; state.gateNavUntilAudio = false; state.endBtnPending = false;
  state.replayAudio = null;   // a module may set a slide-specific replay (e.g. teach slides whose
                              // audio roles aren't in the autoPlayChain order); else the chip replays the chain
  state.ownsAudio = false;    // a module that drives its OWN audio sequence sets this → skip autoPlayChain
                              // (else the auto prompt-chain stomps/truncates the module's timed VO)
  state.revealing = false;    // [24a N8] true while a reveal_seq/sortSeqReveal is mid-flight (blocks replay + drag)
  state.demoRunning = false;  // [24a N8] true while a self-driving teach chain runs (blocks the replay chips)
  const slide = CARD.slides[idx];
  clearHost();

  // header prompt
  $("promptText").textContent = slide.prompt_hi || "";
  /* [S01r4] An EMPTY prompt band still painted its box, so the deck's "keep the screen
     visually clean ... do not show any written instruction" (page 8) was unreachable from the
     card. A band with nothing in it is chrome with no content; collapse it. */
  { const _pb = $("promptText").parentElement;
    if(_pb) _pb.style.display = (slide.prompt_hi ? "" : "none"); }
  $("stage").classList.remove("vo-only");
  /* [S01r5r] a slide that ends itself hides the आगे pill for its whole life, rather than letting it
     appear and then be taken away. Cleared here with the other per-slide stage classes. */
  $("stage").classList.toggle("auto-adv", !!(slide.data && slide.data.auto_advance));
  document.body.classList.remove("bal-page");   /* [S01r5i] */
  balMusicStop();                               /* [S01r6i] and it never outlives the page */

  // Hint button stays HIDDEN until the learner makes a wrong attempt, then it is
  // exposed (graduated scaffold). Mastery uses the SAME scaffold — not excluded.
  $("hintBtn").classList.remove("show");
  $("hintBtn").style.display = "";
  $("navBtn").style.display = "";        // restored by default; tap-to-answer slides hide it themselves
  // [16i] DEFAULT nav wiring — a module that enables आगे without overriding onclick still advances.
  // (DEMO_COUNT shipped an enabled-but-dead button; auto-INTRO inherited an unfulfillable tap guard.)
  $("navBtn").onclick = ()=> completeSlide(true);
  setSwMood("point");                    // Swiftie turns to present each new slide

  SwiftPAL.emit("slide_entered", { slide_id: slide.id, phase: slide.phase, eis: slide.eis, type: slide.type, idx });

  // audio chip = replay the slide audio. Prefer a module-supplied replay (teach slides own their
  // count_intro/explain sequence, which autoPlayChain deliberately skips), else replay the chain.
  // [24a N7b] navUnlock is defined ONCE so BOTH the mount chain AND every replay re-apply it —
  // otherwise a replay's stopAudio() (echo guard) gen-kills the mount chain's onDone and आगे stays
  // stuck disabled forever (the फिर-सुनो-mid-VO brick on gated teach slides). Also releases a
  // pending celebration end-button for the same reason.
  const navUnlock = ()=>{
    if(state.gateNavUntilAudio) setNavActive(true);
    if(state.endBtnPending){ $("endBtn").classList.add("show","hint-glow"); state.endBtnPending = false; }
  };
  // [24a N8] replay chips ignore taps: while a VO is SOUNDING (a replay can no longer orphan a
  // mid-clip onDone → the "unlock rides the last clip's onEnd" modules can't be bricked); while a
  // reveal_seq/sort reveal runs (no stomping the one-by-one narration); while a self-driving demo
  // chain runs (a replay would gen-kill its chain); and on self-driving slides that offer no replay.
  const replaySlideAudio = ()=>{
    if(isPlaying || state.revealing || state.demoRunning || (state.ownsAudio && !state.replayAudio)) return;
    state.audioReplays++;
    SwiftPAL.emit("audio_replay", { slide_id: slide.id, phase: slide.phase, count: state.audioReplays });
    if(state.replayAudio){ state.replayAudio(); navUnlock(); } else autoPlayChain(slide, navUnlock);
  };
  $("audioChip").onclick = replaySlideAudio;

  // mount the type
  const mod = SlideModules[slide.type];
  if(!mod){ console.error("[engine] no module for", slide.type); return; }
  // [engine JS] r4/F1 TEACHING FRAME: tutorial slides mount inside a grid-paper .tut-card (header hidden,
  // prompt in-card, standing Swiftie bottom-left + shoulder audio chip). Type-agnostic — any tutorial-phase
  // module renders into the card. Non-tutorial slides mount bare into slideHost as before.
  const isTut = (slide.phase === "tutorial" && slide.type !== "PHASE_TRANSITION" && slide.type !== "CELEBRATION");
  $("stage").classList.toggle("tut", isTut);
  document.body.classList.toggle("tut-page", isTut);
  let mountHost = $("slideHost");
  if(isTut){
    const card = document.createElement("div"); card.className = "tut-card";
    card.innerHTML = `<div class="tut-prompt">${slide.prompt_hi || ""}</div>` +
      `<img class="tut-mascot" src="assets/UI/start_mascot.webp" alt="" onerror="this.style.display='none'">` +
      `<span class="tut-audio" role="button" aria-label="फिर से सुनो"><svg viewBox="0 0 62 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Audio"><g filter="url(#tutChipShadow)"><rect x="8" y="4" width="46" height="44" rx="22" fill="url(#tutChipGrad)"/><rect x="6" y="2" width="50" height="48" rx="24" stroke="white" stroke-width="4"/><path d="M29.8466 19.0574C29.8804 19.0524 29.9145 19.0496 29.9487 19.0488C30.6094 19.0317 31.0021 19.5124 31.0015 20.1414C31.0008 20.9661 31.0003 21.7911 31.0005 22.6158L31.001 27.7212L31.0009 30.5591C31.0009 31.0364 31.0122 31.5472 30.9863 32.0228C30.9662 32.2709 30.902 32.4608 30.7251 32.643C30.3831 32.9952 29.8337 33.0842 29.4386 32.7671C29.0784 32.4781 28.7473 32.1159 28.4181 31.7862L26.4414 29.8087C26.1771 29.5426 25.9071 29.2636 25.6339 29.0081C25.0227 28.9649 24.3645 29.017 23.7487 28.9979C23.445 28.9885 23.1625 29.0211 22.8589 28.9606C22.3751 28.8616 22.0618 28.4823 22.0642 27.9824C22.0706 26.5937 22.0287 25.1949 22.0828 23.8081C22.0884 23.6626 22.2302 23.4334 22.3309 23.3252C22.454 23.1907 22.6146 23.0963 22.792 23.0543C23.0567 22.9904 23.5328 23.016 23.8224 23.0128C24.4143 23.0063 25.0171 23.0277 25.609 23.0073C25.6794 22.9529 25.8505 22.7743 25.919 22.706L26.5305 22.0945L28.5396 20.0838C28.9157 19.7059 29.3217 19.1749 29.8466 19.0574Z" fill="white"/><path class="wv wv2" d="M36.2367 18.6905C36.8783 18.6449 37.3041 19.231 37.6725 19.6829C38.7675 21.0046 39.4982 22.5894 39.7923 24.2804C40.2503 26.8763 39.6548 29.5478 38.1378 31.7035C37.8393 32.1274 37.508 32.5324 37.149 32.9063C36.9404 33.1236 36.7646 33.2558 36.4622 33.3081C36.2013 33.3412 35.9378 33.2717 35.7272 33.1144C35.5185 32.9615 35.3816 32.7298 35.3483 32.4733C35.2786 31.9235 35.5696 31.6821 35.8914 31.3297C36.0448 31.1639 36.1901 30.9908 36.3269 30.811C38.3669 28.136 38.4986 24.4654 36.6555 21.6511C36.4826 21.3899 36.2966 21.1376 36.0984 20.8951C35.8252 20.5652 35.3947 20.2691 35.3472 19.8184C35.2845 19.2225 35.6439 18.768 36.2367 18.6905Z" fill="white"/><path class="wv wv1" d="M33.3868 21.5044C33.9769 21.4549 34.2563 21.7845 34.5981 22.1981C35.1982 22.924 35.6149 23.7691 35.8211 24.6886C36.171 26.2384 35.8867 27.8637 35.0314 29.2026C34.7421 29.6568 34.2333 30.3745 33.6937 30.4946C33.1633 30.5437 32.6759 30.2927 32.5495 29.7376C32.3921 29.0462 32.9849 28.6956 33.3274 28.1763C34.2088 26.833 34.1932 25.0908 33.288 23.7635C33.0747 23.4522 32.6159 23.0564 32.5518 22.7133C32.4377 22.1027 32.7745 21.619 33.3868 21.5044Z" fill="white"/></g><defs><filter id="tutChipShadow" x="0" y="0" width="62" height="60" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter><linearGradient id="tutChipGrad" x1="8" y1="26" x2="54" y2="26" gradientUnits="userSpaceOnUse"><stop stop-color="#1987FC"/><stop offset="1" stop-color="#1565F4"/></linearGradient></defs></svg></span>`;
    const inner = document.createElement("div"); inner.className = "tut-content";
    card.insertBefore(inner, card.querySelector(".tut-mascot"));
    card.querySelector(".tut-audio").onclick = replaySlideAudio;   // [24a N7b/N8] same guard + navUnlock as the header chip
    $("slideHost").appendChild(card);
    mountHost = inner;
  }
  mod.mount(mountHost, slide);
  // game-feel: animate the slide content in on every mount
  { const _sh = $("slideHost"); _sh.classList.remove("slide-in"); void _sh.offsetWidth; _sh.classList.add("slide-in"); }

  // fit-to-box + vertically ink-centre every Devanagari glyph. SYNC pass first so tiles are
  // correct immediately even when rAF is throttled (background / non-painting tab) or a module
  // built its tiles synchronously at mount; rAF second pass re-fits after slide-in layout +
  // font-load settle. (16n: the lone rAF pass could skip drag-tile / stimulus glyphs — Yasir #6.)
  centerAllGlyphs($("slideHost"));
  requestAnimationFrame(()=>{ centerAllGlyphs($("slideHost")); refreshMatraWords($("slideHost"));
    refreshSoundChips($("slideHost")); });   /* AFTER the fit+centre, never before */

  // play the full VO chain automatically (prompt → phoneme/word_name → instruction).
  // If the slide gated its nav button on audio, enable it once the chain finishes
  // (so students can't skip before hearing it). SKIP when the module owns its audio
  // (state.ownsAudio) — else this chain stomps/truncates the module's own timed VO.
  if(!state.ownsAudio){
    autoPlayChain(slide, navUnlock);   // [24a N7b] same unlock the replay chips re-apply
  }
  armIdleVo();   // [27b] start the 7s silent-inactivity watch (all four TEST phases; no-op elsewhere)
                 // [27f] fires at most ONCE per slide
}

/* ---------- [engine JS] r4/P1 PHASE-TRANSITION PEEK GATE (Shruti's peek beat) ----------
   An automatic interstitial fired ON A PHASE BOUNDARY (not a slide type): blur the stage, Swiftie
   peeks up from the bottom under a big headline, hold ≥2s, then mount the next slide. Kept ALONGSIDE
   our journey-map PHASE_TRANSITION module (a distinct, author-placed slide type) — the gate below
   skips PHASE_TRANSITION + CELEBRATION so the two never double-fire. */
function afterConfetti(fn){
  // let a correct-answer confetti burst (.conf-shot) finish falling before we move on; 8s hard cap.
  const started = Date.now();
  (function check(){
    if(!document.querySelector(".conf-shot") || Date.now() - started > 8000){ fn(); return; }
    setTimeout(check, 200);
  })();
}
/* onscreen headline per gate (display only; distinct from any narration). Eligibility = phase IN this map. */
/* [27j] THERE ARE THREE ROUNDS, NOT FOUR (Yasir 2026-07-28).
   Round 3 is called `practice` in some cards and `independent` in others — the SAME round under two
   names — so `independent` is an ALIAS of practice and takes the identical headline. The earlier bug
   was that a card naming round 3 `independent` got NO round-3 gate at all (the gate is conditional on
   PHASE_GATE_TITLE[next.phase] existing); the fix is the alias, NOT a fourth gate. My first attempt
   added `independent` with its own wording plus a `mastery` gate — both wrong: distinct wording would
   make one round look like two, and there is no round 4.
   `mastery` is deliberately ABSENT: mastery slides continue round 3 without a transition. That also
   means vo_pt_mastery is never played, so a card shipping it carries dead audio — verify_bundle's
   "silent gates: [vo_pt_mastery]" warn is a CHECKER ARTIFACT, not a defect.
   VO ids stay optional: play() treats a missing clip as a silent beat and the 2s peek still holds. */
const PHASE_GATE_TITLE = { tutorial:"चलिए, शुरू करें!", guided:"चलिए, साथ में करें!",
                           practice:"अब आपकी बारी!", independent:"अब आपकी बारी!" };   // [16h] the lead’s official transition lines (VO = full sentences in the card manifest; NOTE aap-register — flagged)
const PHASE_GATE_VO    = { tutorial:"vo_pt_tutorial", guided:"vo_pt_guided",
                           practice:"vo_pt_practice", independent:"vo_pt_independent" };
/* [28h] which ROUND each phase belongs to — the dedup key for gates. practice === independent === the
   one round 3; `mastery` is absent on purpose (it continues round 3), and so is any future phase name,
   which fails safe to "no gate" rather than to a spurious extra one. */
const PHASE_ROUND = { tutorial:"tutorial", guided:"guided", practice:"round3", independent:"round3" };
const _gatedPhases = new Set();   // each ROUND gate plays ONCE (Start→tutorial, →guided, →round 3)
let _gateToken = 0;
function phaseBlurTransition(cb, toPhase){
  const tok = ++_gateToken;
  stopNudge(); stopAudio();
  const gate = $("phaseGate"), img = $("phaseGateImg");
  if(img) img.src = "assets/UI/peeking.webp?r=" + Date.now();   // restart the loop each time (cache-bust)
  const title = $("phaseGateTitle"); if(title) title.textContent = PHASE_GATE_TITLE[toPhase] || "";
  $("stage").classList.add("blurred", "gating");
  document.body.classList.add("gating");
  gate.classList.add("show","hint-glow");
  SwiftPAL.emit("phase_transition", { to: toPhase });
  const closeGate = ()=>{ gate.classList.remove("show"); $("stage").classList.remove("blurred", "gating"); document.body.classList.remove("gating"); };
  // VO only if the card actually ships it; else a silent beat — the 2s min-hold keeps the peek visible.
  const voId = PHASE_GATE_VO[toPhase];
  const voSrc = voId ? ("assets/Audio/" + voId + "." + AUDIO_EXT) : null;   // [20a] use AUDIO_EXT path so generated clips resolve (was: assets.audio .mp3 map -> silent)
  const openedAt = Date.now();
  play(voSrc, ()=>{
    if(tok !== _gateToken){ closeGate(); return; }               // a newer gate superseded us
    const hold = Math.max(200, 2000 - (Date.now() - openedAt));  // Swiftie peeks ≥2s even with no/short VO
    setTimeout(()=>{
      if(tok !== _gateToken){ closeGate(); return; }
      gate.classList.remove("show");
      $("stage").classList.remove("blurred");
      if(cb) cb();                              // mounts the next slide
      $("stage").classList.remove("gating");    // header returns once the slide is in
      document.body.classList.remove("gating");
    }, hold);
  });
}

function completeSlide(success){
  const slide = CARD.slides[state.idx];
  SwiftPAL.emit("slide_completed", {
    slide_id: slide.id, phase: slide.phase, success: !!success,
    attempts: state.attempts, latency_ms: Date.now()-state.slideStart,
    scaffold_level: state.scaffoldLevel, hint_used: state.hintUsed,
    nudge_used: state.nudgeUsed, audio_replays: state.audioReplays
  });
  if(state.idx >= CARD.slides.length - 1){
    // last slide is CELEBRATION; nothing more
    return;
  }
  // advance only AFTER the correct-answer confetti has landed (to the gate AND to the next slide alike).
  const fromIdx = state.idx, nextIdx = state.idx + 1;
  const next = CARD.slides[nextIdx];
  /* [28h] ONE GATE PER ROUND, NOT PER PHASE NAME.
     `independent` and `practice` are two names for round 3 (Yasir 2026-07-28), so a card that uses
     BOTH crossed two "different phases" and got the identical 'अब आपकी बारी!' gate TWICE, back to
     back — the alias fixed the missing gate and introduced a duplicate one. Deduping by ROUND instead
     of by phase string collapses that pair, and a phase with no round (mastery) still gets no gate,
     which is the ruling: three rounds, no round 4. */
  const nextRound = PHASE_ROUND[next && next.phase], curRound = PHASE_ROUND[slide.phase];
  if(next && nextRound && nextRound !== curRound
     && next.type !== "CELEBRATION" && next.type !== "PHASE_TRANSITION"
     && PHASE_GATE_TITLE[next.phase] && !_gatedPhases.has(nextRound)){
    _gatedPhases.add(nextRound);
    afterConfetti(()=>{ if(state.idx === fromIdx) phaseBlurTransition(()=> mountSlide(nextIdx), next.phase); });
    return;
  }
  afterConfetti(()=>{ if(state.idx === fromIdx) mountSlide(nextIdx); });
}

/* ---------- 14. VALIDATOR (runtime self-check) ---------- */
function runValidator(){
  const missing = (CARD.signals_expected || []).filter(s => !SwiftPAL.firedSet.has(s));
  SwiftPAL.validatorReport.missing_signals = missing;
  SwiftPAL.validatorReport.passed = missing.length === 0;
  console.log("[validator]", SwiftPAL.validatorReport);
  try{ window.parent?.postMessage({type:"swiftpal:lesson_complete", signals: SwiftPAL.signals, validatorReport: SwiftPAL.validatorReport}, "*"); }catch(e){}
  // offline self-capture: write the final record to localStorage; optionally POST
  // it to a learning-record endpoint if one is configured AND the device is online.
  SwiftPAL.persist();
  if(TELEMETRY.endpoint && navigator.onLine){
    try{ fetch(TELEMETRY.endpoint, {method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(SwiftPAL.exportResults()), keepalive:true}).catch(()=>{}); }catch(e){}
  }
  // dev banner
  if(new URLSearchParams(location.search).has("dev")){
    const b = $("devBanner");
    if(missing.length === 0){ b.textContent = "✓ all expected signals fired"; b.className = "dev-banner show ok"; }
    else { b.textContent = "✗ missing signals: " + missing.join(", "); b.className = "dev-banner show"; }
  }
}

/* ---------- [engine JS] r4/#2 DATA-DRIVEN LANDING CONCEPT STRIP ----------
   A landing_hero of kind "concept_strip" renders N visual-example tiles from card data, so any game
   declares its landing preview in card.json instead of hand-editing HTML. Tile types: discs (size),
   bars (length), balance (weight — equal-size objects, heavier lower, never a size cue), image. */
const SG_BALANCE_SVG =
  '<svg viewBox="0 0 124 112" xmlns="http://www.w3.org/2000/svg">' +
  '<line x1="62" y1="30" x2="62" y2="86" stroke="#8AA0C8" stroke-width="6" stroke-linecap="round"/>' +
  '<polygon points="62,60 44,100 80,100" fill="#8AA0C8"/>' +
  '<g transform="rotate(-13 62 34)">' +
  '<rect x="14" y="30" width="96" height="11" rx="5.5" fill="#4EA3F0"/>' +
  '<circle cx="22" cy="20" r="14" fill="#FBD24B" stroke="#D9A21A" stroke-width="2.5"/>' +
  '<circle cx="102" cy="20" r="14" fill="#98A2B3" stroke="#5B6577" stroke-width="2.5"/>' +
  '</g></svg>';
function conceptTileHTML(c){
  const lbl = c && c.label ? ` aria-label="${c.label}"` : "";   // a11y only; not shown (pre-reader → visual+VO)
  switch(c && c.type){
    case "discs": {
      const sizes = c.sizes || [34, 54, 76];
      return `<div class="sg-ex sg-ex-size" role="img"${lbl}>` +
        sizes.map(s => `<span class="sg-disc" style="width:${s}px;height:${s}px"></span>`).join("") + `</div>`;
    }
    case "bars": {
      const widths = c.widths || [42, 72, 102];
      return `<div class="sg-ex sg-ex-len" role="img"${lbl}>` +
        widths.map(w => `<span class="sg-bar" style="width:${w}px"></span>`).join("") + `</div>`;
    }
    case "balance":
      return `<div class="sg-ex sg-ex-wt" role="img"${lbl}>` + SG_BALANCE_SVG + `</div>`;
    case "image":
      return `<div class="sg-ex" role="img"${lbl}><img src="${c.src}" alt="${c.label || ''}"></div>`;
    default:
      return "";
  }
}

/* ---------- 15. BOOT ---------- */
function boot(){
  buildHandFx();   // [S01r4s] nudge-hand tap ripple — wrapped internally, cannot strand the loader
  buildSky();   // [S01r4r] start-screen sky — wrapped internally, can never strand #bootLoader (kit R4)
  // god-mode visual theme (opt-in via CARD.theme) — warms the whole stage; scoped CSS under .thm-*
  if(CARD.theme) $("stage").classList.add("thm-" + CARD.theme);
  // banner title = skill name only (strip "(भाग…)" and the ": letters" list)
  $("sgTitle").textContent = (CARD.title.hi || "").split(/[:：(]/)[0].trim();
  // 16j: landing subtitle line (r4 dropped it) + fix the stale document <title> (was hardcoded to
  // the ordering game on every FLN build). Both come from the card now.
  { const _sub = $("sgSub"); if(_sub) _sub.textContent = (CARD.subtitle_hi || ""); }
  try{ document.title = "SwiftPAL · " + (CARD.skill_code || "") + " · " + (CARD.title.hi || "").split(/[:：(]/)[0].trim(); }catch(e){}
  // VISUAL-FIRST landing hero: SHOW the concept (shapes row / a finger-hand / an image), not just the title text
  (function(){ const hero = CARD.landing_hero, el = $("sgHero"); if(!hero || !el) return;
    if(hero.kind === "sentence_sound"){
      /* [S01r4b] SME deck page 1, re-cut to run IN STEP WITH THE GREETING.
         The flow is the deck's, verbatim: "Sentence appears -> words appear one by one -> क gets
         highlighted in each word -> crow appears -> crow sound plays -> VO continues", and its rider
         "the highlighting should sync with the VO so the child can hear and visually notice the
         repeated sound at the same time".
         r4 ran this on fixed CSS delays, which cannot satisfy that rider - it looked right and was
         synchronised to nothing. It is now driven off the greeting clip itself: the spoken line is
         read from CARD.assets.audio_text (shown == spoken, so it IS the script), karaokePlay reports
         which word is being spoken, and each beat fires when its own word is reached. Proportional,
         not force-aligned (no forced aligner in this toolchain). */
      const words = hero.words || [];
      /* mark_bare => the layered paint-clip (only क); otherwise the plain akshara span (का). The
         layered form carries its own data-sw-* so refreshSoundWords can re-cut the clips once the
         real font has loaded. */
      const _lhWord = (w)=> hero.mark_bare
        ? ('<span class="lh-word sound-layered seq-hidden" data-sw-word="' + w
             + '" data-sw-target="' + (hero.target_sound || "") + '" data-sw-fs="52">'
             + soundWordHTML(w, hero.target_sound, 52) + '</span>')
        : ('<span class="lh-word seq-hidden">' + aksharaHTML(w, hero.target_sound) + '</span>');
      /* [S01r6e] COVER ARTWORK. The SME supplied one painted board carrying the title and the crow,
         to fill the card. When `cover_img` is set it replaces the word strip and the picture, because
         both are already IN the painting - rendering them over it would double the crow and print the
         line twice.
         The greeting machinery below is deliberately KEPT even though there is now nothing to
         highlight: it is what times the crow's caw to the moment the voice names it, and it is what
         releases the play button when the greeting ends (see [S01r5y]). Removing it to save a
         karaoke pass would silently break both. The word cues simply find no element and do nothing. */
      el.innerHTML = hero.cover_img ? ""
        : ('<div class="lh-strip lh-dim">' + words.map(_lhWord).join("") + '</div>' +
           (hero.picture_img ? '<div class="lh-pic seq-hidden">' +
               imgOrEmoji(hero.picture_img, hero.picture_emoji, "lh-img", "lh-emoji") + '</div>' : ""));
      if(hero.cover_img){
        /* [S01r6e] The art is appended to the CARD, not to this hero element. `inset:0` resolves
           against the nearest POSITIONED ancestor, and that is .sg-content - which is a collapsed
           flex box (measured 0x11), so an image placed here came out 0px wide. .sg-card is the box
           the art is meant to fill, so it is the box it hangs off. First child, so it paints under
           Swiftie, the chip and the play button. */
        const _card = el.closest && el.closest(".sg-card");
        if(_card && !_card.querySelector(".lh-cover")){
          const ci = document.createElement("img");
          ci.className = "lh-cover"; ci.alt = "";
          ci.src = "assets/Images/" + hero.cover_img + "." + IMG_EXT;
          _card.insertBefore(ci, _card.firstChild);
        }
      }
      el.classList.add("show", "lh-hero");
      [...el.querySelectorAll(".lh-word")].forEach((w, i)=> w.dataset.i = i);
      if(hero.mark_bare) refreshSoundWords(el);   // re-lay from the real rendered size
      /* "Remove the existing heading from this screen" - REMOVE, not hide. A display:none node still
         reports a 0x0 rect, which sweep_overlap scores as an element spilling outside the card.
         document.title is set from CARD.title.hi above, not from this node. */
      if(hero.hide_title){ const t = $("sgTitle"); if(t) t.remove(); }
      const c0 = el.closest && el.closest(".sg-content");
      if(c0) c0.classList.add("has-hero", "lh-content");
      /* [S01r5i] the CARD needs its own hook: .sg-btn is its child, not .sg-content's, so no
         selector rooted at .sg-content can reach it and the stylesheet has to scope the button
         nudge from here. */
      { const k0 = el.closest && el.closest(".sg-card"); if(k0) k0.classList.add("lh-card"); }

      window._landingSentence = (src)=>{
        window._lhRan = true;
        const strip = el.querySelector(".lh-strip");
        const ws = [...el.querySelectorAll(".lh-word")];
        const pic = el.querySelector(".lh-pic");
        const onLanding = ()=>{ const sg = $("startGate"); return sg && !sg.classList.contains("hidden"); };

        ws.forEach(w => { w.classList.add("seq-hidden"); w.classList.remove("lh-in"); });
        if(strip) strip.classList.add("lh-dim");
        if(pic){ pic.classList.add("seq-hidden"); pic.classList.remove("lh-in"); }

        /* The call belongs to the crow's ARRIVAL, not to a timer running alongside it: fired here,
           in the same statement that reveals the picture, it cannot drift and it cannot outlive the
           screen. (r4 scheduled it on a setTimeout and it was measured landing on the CELEBRATION.) */
        /* [S01r5p] THE LINE SAYS IT TWICE. The cover reads "काँव-काँव" and the recording holds a
           SINGLE call, so the picture that arrives on that word answered it once - the sound and the
           words disagreed on the one page whose whole job is "listen to this sound". How many times
           is the card's call (`picture_sfx_times`), not the engine's, because it belongs to the line.
           The gap is read from audio_dur so a re-cut clip cannot make the calls overlap or straggle,
           and every repeat re-checks onLanding(): tapping the play button mid-call must not leave a
           caw to bark over slide 0, which is the same trap the cue timeline documents below. */
        const sfxTimes = Math.max(1, hero.picture_sfx_times || 1);
        const sfxGapMs = Math.round(((CARD.assets && CARD.assets.audio_dur
                                      && CARD.assets.audio_dur[hero.picture_sfx]) || 0.6) * 1000) + 90;
        const callCrow = ()=>{
          playSfx(hero.picture_sfx);
          for(let n = 1; n < sfxTimes; n++)
            setTimeout(()=>{ if(onLanding()) playSfx(hero.picture_sfx); }, n * sfxGapMs);
        };
        /* [S01r6e] With cover artwork there is no .lh-pic to reveal - the crow is painted into the
           board - but the CAW still belongs on its cue, and the old guard returned early when the
           element was missing, so it fell silent. Fire once either way. */
        let _crowDone = false;
        const showCrow = (withSound)=>{
          if(pic){
            if(!pic.classList.contains("seq-hidden")) return;
            pic.classList.remove("seq-hidden"); pic.classList.add("lh-in");
          } else if(_crowDone) return;
          _crowDone = true;
          if(withSound && onLanding()) callCrow();
        };
        const acts = {
          light: ()=>{ if(strip) strip.classList.remove("lh-dim"); },   // every क lights at once
          crow:  ()=>  showCrow(true)
        };

        const line = (CARD.assets && CARD.assets.audio_text &&
                      CARD.assets.audio_text[hero.sync_audio || "vo_landing"]) || "";
        const toks = line ? _voTokens(line) : [];
        /* exact token first, then substring - "काला" lives inside the token "सुनो—काला", while a
           bare "क" cue must land on the standalone word क and not on the क buried in "वाक्य" */
        const findTok = (needle, start)=>{
          for(let j = start; j < toks.length; j++) if(toks[j] === needle) return j;
          for(let j = start; j < toks.length; j++) if(toks[j].indexOf(needle) >= 0) return j;
          return -1;
        };
        const cues = []; let from = 0;
        words.forEach((w, i)=>{
          let k = findTok(w, from);
          if(k < 0) k = Math.min(from, Math.max(0, toks.length - 1));
          cues.push({ k, do: "word", i }); from = k + 1;
        });
        (hero.cues || []).forEach(c => {
          let k = findTok(c.at, from);
          if(k < 0) k = Math.min(from, Math.max(0, toks.length - 1));
          cues.push({ k, do: c.do }); from = k + 1;
        });

        /* [S01r5p] SME: "after completion of VO if user remains inactive for more than 5 seconds".
           r5l armed the 5s timer at load, but the greeting itself is ~15s - so the hand appeared
           while Swiftie was still talking, nudging a child who was not idle at all, merely listening.
           The timer is disarmed for the whole greeting and armed from its END. Both endings count:
           the karaoke run (finish), and the no-token fallback, which fires finish() BEFORE its clip
           plays and so must arm from the clip instead - hence armOnFinish. */
        if(window.__disarmStartNudge) window.__disarmStartNudge();
        /* [S01r5y] lock the button for the FIRST telling only. The SME's rule was "inactive during
           the voice over"; a child who has already sat through it and then asks to hear it again
           (the 🔊 chip) must not be sent to the back of the queue - and, more importantly, nothing
           that replays the greeting should ever be able to take away a way in that was already
           granted. That is what trapped the cover. */
        if(!window.__greetingDone && window.__setStartBtnReady) window.__setStartBtnReady(false);
        /* [S01r5r] DEAD-BUTTON WATCHDOG. Every ordinary ending releases the button, but they all run
           off play()'s onEnd - and a clip that stalls rather than errors never fires it. The cover is
           now the only way into the lesson, so that case would be a total block, not a degraded one.
           Sized off the clip's own length with a wide margin; it only ever fires when something has
           already gone wrong, and releasing early costs nothing worse than a skippable greeting. */
        {
          const _dur = (CARD.assets && CARD.assets.audio_dur
                        && CARD.assets.audio_dur[hero.sync_audio || "vo_landing"]) || 20;
          setTimeout(()=>{
            if(!onLanding()) return;
            const b = document.getElementById("sgBtn");
            if(b && b.disabled && window.__setStartBtnReady){
              window.__greetingDone = true;
              window.__setStartBtnReady(true);
              if(window.__armStartNudge) window.__armStartNudge();
            }
          }, Math.round(_dur * 1000) + 8000);
        }
        const armAfterGreeting = ()=>{
          if(!onLanding()) return;
          window.__greetingDone = true;
          if(window.__setStartBtnReady) window.__setStartBtnReady(true);
          if(window.__armStartNudge) window.__armStartNudge(); };
        let armOnFinish = true;

        const fired = new Set();
        const run = (c)=>{
          if(fired.has(c)) return; fired.add(c);
          if(c.do === "word"){ const w = ws[c.i];
            /* [S01r5h] the word arrives AND its own क lights, both on the token the voice is
               speaking - "highlight the क letter with sync of the vo". The later whole-strip
               `light` cue is left in place as a catch-all: by then every word is already lit, so
               it is a no-op on a normal run and still finishes the line if a word cue was missed
               (no audio, autoplay refused, a capture tool freezing the page). */
            if(w){ w.classList.remove("seq-hidden"); w.classList.add("lh-in", "lh-lit"); } }
          else (acts[c.do] || (()=>{}))();
        };
        let done = false, stopK = null;
        /* Nothing to sync TO means show the finished sentence, not an empty card: an autoplay refusal
           before the first gesture and a missing clip BOTH land here (play() fires its onEnd in both
           cases), and so does a capture tool that freezes the page. The crow still arrives - silently,
           because its call is meant to accompany a narrated arrival, not to bark on a cold load. */
        const finish = ()=>{
          if(done) return; done = true;
          if(stopK) stopK();
          if(!onLanding()) return;
          cues.forEach(c => { if(c.do === "crow") { fired.add(c); showCrow(false); } else run(c); });
          if(armOnFinish) armAfterGreeting();
        };

        if(!toks.length){ armOnFinish = false; finish(); play(src || null, armAfterGreeting); return; }
        /* The timeline is only meaningful while ITS OWN clip is sounding. Tapping शुरू करें calls
           stopAudio() (so currentAudio goes null) but the start gate stays up for the length of the
           blur transition — so "is the gate still visible" is NOT a sufficient stop condition, and a
           late crow cue could still fire its call over the first slide. Stop on either signal. */
        let heard = false;
        stopK = karaokePlay(src || null, toks, (k)=>{
          if(currentAudio) heard = true;
          if(!onLanding() || (heard && !currentAudio)){   // tapped through, or the greeting was cut
            if(stopK) stopK(); done = true; return;
          }
          cues.forEach(c => { if(k >= c.k) run(c); });
        }, finish);
      };
      /* Deliberately NOT invoked here: the greeting is owned by playLanding() (boot-loader dismissal,
         or the first gesture when autoplay was refused), and starting a second copy from here would
         put two voices on the landing. This is only the safety net - if the greeting never runs at
         all, the cover must still show its sentence rather than an empty card. */
      setTimeout(()=>{
        if(window._lhRan) return;
        el.querySelectorAll(".lh-word").forEach(w => { w.classList.remove("seq-hidden"); w.classList.add("lh-in"); });
        const st = el.querySelector(".lh-strip"); if(st) st.classList.remove("lh-dim");
        const pc = el.querySelector(".lh-pic"); if(pc){ pc.classList.remove("seq-hidden"); pc.classList.add("lh-in"); }
        /* [S01r5p] the greeting never ran at all, so nothing will ever arm the idle timer from its
           end - arm it here, or an idle child on a silent cover gets no nudge whatsoever.
           [S01r5r] and RELEASE THE BUTTON. It is disabled from first paint, so a cover whose
           greeting never starts would otherwise be a dead end with no way into the lesson. */
        window.__greetingDone = true;
        if(window.__setStartBtnReady) window.__setStartBtnReady(true);
        if(window.__armStartNudge) window.__armStartNudge();
      }, 6000);
      return;
    }
    if(hero.kind === "concept_strip"){
      // r4/#2: each cell is a .sg-acell (keeps the staggered fingerPop pop-in) wrapping a visual example.
      el.innerHTML = (hero.cells || []).map(c => `<div class="sg-acell">${conceptTileHTML(c)}</div>`).join("");
      return;   // keep the landing's tuned title size + spacing (this strip is sized for the full card)
    }
    if(hero.kind === "shapes" && typeof shapeSVG === "function")
      el.innerHTML = (hero.shapes||[]).map(s=> shapeSVG(s.shape, {color:s.color, size:104, rotate:s.rotate||0})).join("");
    else if(hero.kind === "count"){
      // counting game: preview the WHOLE 1..n sequence — a row of hands (1,2,3…), each with its Arabic numeral
      const hi = Math.min(Math.max(parseInt(hero.n,10)||3, 1), 5);   // clamp to available hand art (1..5)
      let cells = "";
      for(let i=1;i<=hi;i++){
        cells += `<div class="sg-hand-cell">${fingerCount(i, "sg-hand")}<span class="sg-hand-num">${devNumeral(i)}</span></div>`;
      }
      el.innerHTML = cells;
    }
    else if(hero.kind === "image") el.innerHTML = `<img src="${hero.src}" alt="">`;
    if(el.innerHTML){ el.classList.add("show","hint-glow"); $("sgTitle").classList.add("compact");
      const c = el.closest && el.closest(".sg-content"); if(c){ c.classList.add("has-hero");
        // SME (S01 review deck): landing reads TITLE first, image BELOW it, image smaller.
        if(hero.title_first) c.classList.add("title-first"); } }
  })();

  // [20a landing] shape-recognition games ship NO landing_hero -> the card fell back to a plain WORD
  // subtitle (unreadable to pre-readers). Derive icon tiles from shape_set instead (labels from the
  // card's own bins; colours are neutral brand tones, never red/green per ruling B5). Additive: only
  // fires when sgHero is still empty AND the card is a shape game.
  (function(){ const el = $("sgHero");
    if(!el || el.innerHTML || typeof shapeSVG !== "function" || !Array.isArray(CARD.shape_set) || !CARD.shape_set.length) return;
    const lab = {}; (CARD.slides||[]).forEach(s => ((s.data && s.data.bins) || []).forEach(b => { if(b.shape && b.label) lab[b.shape] = b.label; }));
    const DEF = { circle:"गोल", square:"चौकोर", triangle:"तिकोना", rectangle:"आयत" };
    const COL = { circle:"#386AF6", square:"#F0A020", triangle:"#9B7BE8", rectangle:"#12A0B8" };
    el.innerHTML = CARD.shape_set.map(sh =>
      `<div class="sg-acell">${shapeSVG(sh, {color: COL[sh] || "#386AF6", size:96})}<span class="sg-alabel">${lab[sh] || DEF[sh] || ""}</span></div>`).join("");
    el.classList.add("show","hint-glow"); $("sgTitle").classList.add("compact");
    const c = el.closest && el.closest(".sg-content"); if(c) c.classList.add("has-hero");   // hides the word subtitle
  })();

  // ----- landing-screen welcome VO (lead review) -----
  // A warm greeting on the title screen. Autoplay is often blocked before a gesture, so we also
  // (a) expose a pulsing 🔊 "listen" button, and (b) fire it on the first pointer-down. The whole
  // greeting lives HERE now (not on slide 0), which also kills the old overlap glitch where the
  // landing VO and slide-0 VO could talk over each other.
  const landSrc = (CARD.assets && CARD.assets.audio && CARD.assets.audio["vo_landing"]) || ("assets/Audio/vo_landing." + AUDIO_EXT);
  /* [S01r5r] SME: "button is inactive during the voice over, once voice over is complete then the
     play button will activate". So the greeting is no longer skippable - it is the lesson's opening
     instruction and the cover is the one screen with nothing else to do. setStartBtnReady(false) is
     called as the greeting starts and (true) at its end, by the same two paths that arm the idle
     timer, so the button and the pulse can never disagree about whether the VO is still running. */
  const setStartBtnReady = (ready)=>{
    const b = $("sgBtn"); if(!b) return;
    b.disabled = !ready;
    b.classList.toggle("sg-waiting", !ready);
    if(!ready) b.classList.remove("idle-pulse");
  };
  window.__setStartBtnReady = setStartBtnReady;
  setStartBtnReady(false);          /* dead from first paint - the greeting starts within 1.6s */

  const playLanding = ()=>{ if($("startGate").classList.contains("hidden")) return;
    /* [S01r4] the sentence animation is meant to run WITH the greeting ("the highlighting
       should sync with the VO"), so it restarts on every play - including the listen chip,
       which is the first time it is heard whenever autoplay was blocked. */
    if(typeof window._landingSentence === "function"){ window._landingSentence(landSrc); return; }
    /* [S01r5p] no landing sentence (another card, or the hero block never ran) - the greeting is a
       plain clip, and the idle timer still belongs at its end. */
    play(landSrc, ()=>{ window.__greetingDone = true;
                        if(window.__setStartBtnReady) window.__setStartBtnReady(true);
                        if(window.__armStartNudge) window.__armStartNudge(); }); };
  const sgVo = $("sgVo"); if(sgVo) sgVo.onclick = (e)=>{ e.stopPropagation(); playLanding(); };
  // ---- [engine JS] r4/P2 boot loader: loader.gif until assets warm, then it dismisses ITSELF into
  // the landing (NO tap gate). DUAL auto-dismiss (window 'load' OR a 2.5s watchdog — never strand the
  // child), deduped by .done. The same handler adds body.loaded (unblocks the concept-strip stagger)
  // and fires the landing VO. play() absorbs an autoplay block; the pulsing 🔊 chip is the fallback. ----
  (function(){
    const bl = $("bootLoader"); if(!bl){ document.body.classList.add("loaded"); playLanding(); return; }
    // [16l] BRAND SPLASH MIN-HOLD: locally, window.load fires in ~100ms and the CG loader was
    // removed before it ever painted ("no CG logo at the start"). The loader now holds for a
    // minimum beat so the ConveGenius mark is always seen; the watchdog still caps the worst case.
    const T0 = performance.now(), MIN_MS = 1600;
    let fired = false;   // .done is the CSS fade trigger, so it must NOT double as the dedup flag
    const ready = ()=>{
      if(fired) return;   // load event + watchdog both land here → dedup
      fired = true;
      setTimeout(()=>{
        bl.classList.add("done");                  // NOW start the fade (after the brand beat)
        document.body.classList.add("loaded");     // starts the .sg-acell pop chain
        playLanding();
        setTimeout(()=> bl.remove(), 450);
      }, Math.max(0, MIN_MS - (performance.now() - T0)));
    };
    if(document.readyState === "complete") ready();
    else window.addEventListener("load", ready);
    setTimeout(ready, 2500);   // watchdog: never strand the child on the loader
  })();
  // landing VO best-effort on first interaction too (some browsers block autoplay pre-gesture)
  window.addEventListener("pointerdown", function once(){ window.removeEventListener("pointerdown", once);
    /* [30m] THE LANDING GREETING MUST NOT RESTART ON THE FIRST TAP (Yasir: "the landing VO does not
       seem fine"). This listener exists ONLY as an autoplay-policy fallback: if the browser refused
       the greeting on load, the first real user gesture is our chance to start it. But it fired
       UNCONDITIONALLY, so when autoplay HAD worked, the child's first tap anywhere restarted the 9s
       greeting from the top — and on a tap that happened to be शुरू करें, it bled into the tutorial.
       Guard on whether audio is genuinely audible right now, NOT on "did we call play()": on a blocked
       autoplay we DID call it, so a call-flag would kill the very fallback this line is for.
       currentAudio is set inside play(); paused/ended/currentTime tell us if sound is actually moving.
       The सुनो chip's own playLanding() is untouched — an explicit replay must always replay. */
    const _a = (typeof currentAudio !== "undefined") ? currentAudio : null;
    const _audible = _a && !_a.paused && !_a.ended && _a.currentTime > 0;
    /* [S01r5y] ...AND IT MUST NOT FIRE ONCE THE GREETING HAS ALREADY FINISHED.
       "is audio audible right now" is false in TWO different situations: autoplay was blocked (this
       listener's whole purpose) and the greeting simply ENDED. Before r5r that second case was
       unreachable in practice, because the child could tap through mid-clip and the first pointerdown
       therefore landed while audio was sounding. r5r disabled the button until the greeting ends -
       which GUARANTEES the first pointerdown happens after it, so this fired every time, replayed the
       15-second greeting, and (because a replay calls setStartBtnReady(false)) disabled the button in
       the middle of the child's gesture. A disabled element gets no click event, so the cover also
       stopped advancing. One listener, both symptoms the SME reported.
       Releasing the button IS the signal that the greeting is done, so that is the thing to test. */
    const _btn = $("sgBtn");
    const _greetingDone = _btn && !_btn.disabled;
    if(!_audible && !_greetingDone) playLanding(); }, { once:true });

  /* [S01r5l] SME: "if user remains inactive for more than 5 seconds then add hand nudge on the play
     button". The cover has no other affordance now that the wording is gone, so an idle child has
     nothing telling them the pill is the way in.
     The hand lives inside .slide-stage at z-index 55 and the start gate is 80, so it would be drawn
     BEHIND the cover — `nh-start` lifts it over the gate for this one use and is taken off again by
     the disarm, so nothing else that nudges is affected. */
  let _startNudgeT = 0;
  const _onLandingNow = ()=>{ const sg = $("startGate"); return sg && !sg.classList.contains("hidden"); };
  /* [S01r5r] THE HAND IS OFF THE COVER. SME: "remove the hand nudge from the cover page, the button
     will pulsate after the user is inactive for 5 seconds". A hand pointing at the only affordance
     on an otherwise empty screen was saying what the button can say by itself, and it covered the
     ▶ it was pointing at. The idle timer and its reset are r5p's, unchanged - all that changes is
     what happens when it fires: .sg-btn gets .idle-pulse instead of a hand being flown in.
     disarmStartNudge still tidies the hand away, because an OLD build may have left it shown and
     because the same helper is what the play button calls on its way out. */
  const disarmStartNudge = ()=>{
    clearTimeout(_startNudgeT); _startNudgeT = 0;
    const b = $("sgBtn"); if(b) b.classList.remove("idle-pulse");
    const nh = $("nudgeHand");
    if(!nh) return;
    nh.classList.remove("show", "hint-glow", "nh-start");
    /* put it back where every other nudge expects to find it */
    const home = document.querySelector(".slide-stage");
    if(home && nh.parentNode !== home) home.appendChild(nh);
  };
  const armStartNudge = ()=>{
    clearTimeout(_startNudgeT);
    _startNudgeT = setTimeout(()=>{
      if(!_onLandingNow()) return;
      const btn = $("sgBtn");
      /* a button the child cannot press yet must not beg to be pressed */
      if(!btn || btn.disabled) return;
      btn.classList.add("idle-pulse");
    }, 5000);
  };
  window.__armStartNudge = armStartNudge;
  window.__disarmStartNudge = disarmStartNudge;
  /* [S01r5p] Any touch of the cover counts as activity - and activity RESTARTS the wait rather than
     ending it. Cancelling outright meant one stray tap on the card bought permanent silence, which is
     not what "inactive for more than 5 seconds" describes. Tapping the play button is unaffected: its
     own onclick disarms, and the timer body re-checks that the cover is still up before it shows. */
  { const sg = $("startGate");
    if(sg) sg.addEventListener("pointerdown", ()=>{ disarmStartNudge(); armStartNudge(); }, true); }
  /* NOT armed here any more - the greeting's end owns it now. See [S01r5p] in _landingSentence. */

  $("sgBtn").onclick = ()=>{
    disarmStartNudge();
    stopAudio();          // silence the landing greeting BEFORE slide 0 speaks (no VO overlap)
    _ac();                // unlock/resume WebAudio on the start gesture so the first clip never clips
    // [engine JS] r4/P1: peek gate into the tutorial. The landing stays visible-and-BLURRED behind the
    // peeking Swiftie + "चलिए शुरू करें"; it hides once the tutorial mounts (in the callback).
    _gatedPhases.add("tutorial");
    phaseBlurTransition(()=>{
      $("startGate").classList.add("hidden");
      document.body.classList.remove("is-start");   // blue bg only on the title screen
      mountSlide(0);
    }, "tutorial");
  };
  // tapping आगे clears any pending nav-nudge
  $("navBtn").addEventListener("click", ()=>{ clearTimeout(state.navNudgeTimer); stopNudge(); });
  // [engine JS] r4 dev jump: ?slide=N skips the loader+gate and mounts slide N directly (QA/capture only)
  (function(){
    const j = parseInt(new URLSearchParams(location.search).get("slide"), 10);
    if(isNaN(j)) return;
    const bl = $("bootLoader"); if(bl) bl.remove();
    document.body.classList.add("loaded");
    $("startGate").classList.add("hidden");
    document.body.classList.remove("is-start");
    mountSlide(Math.max(0, Math.min(j, CARD.slides.length - 1)));
  })();
  // when the web font finishes loading, re-centre glyphs (metrics change vs fallback)
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(()=>{ centerAllGlyphs(); refreshMatraWords(); refreshSoundChips(); }); }
  // dev banner if ?dev=1 — show empty initially
  if(new URLSearchParams(location.search).has("dev") || new URLSearchParams(location.search).has("nav")){
    if($("devBanner")){ $("devBanner").textContent = "engine ready · slides=" + CARD.slides.length; $("devBanner").className = "dev-banner show"; }
    buildDevNav();
  }
}

/* [engine JS] DEV NAV — a review/QA slide navigator. Shows ONLY with ?dev=1 or ?nav=1 (children never
   see it). Jump to any slide by dropdown, step ◀▶, first/last, or back to the landing. Uses the
   engine's own mountSlide + state.idx; a light poll keeps the label synced when the game self-advances. */
function buildDevNav(){
  if(document.getElementById("devNav")) return;
  const bar = document.createElement("div"); bar.id = "devNav"; bar.className = "dev-nav";
  const mk = (txt, title)=>{ const b = document.createElement("button"); b.className = "dev-nav-btn"; b.textContent = txt; if(title) b.title = title; return b; };
  const land = mk("⌂", "landing"), first = mk("⏮", "first"), prev = mk("◀", "prev"), next = mk("▶", "next"), last = mk("⏭", "last");
  const sel = document.createElement("select"); sel.className = "dev-nav-sel"; sel.title = "jump to slide";
  CARD.slides.forEach((s, i)=>{ const o = document.createElement("option"); o.value = i; o.textContent = (i+1) + ". " + s.id + " · " + s.type; sel.appendChild(o); });
  const lbl = document.createElement("span"); lbl.className = "dev-nav-lbl";
  const cur = ()=> (state && typeof state.idx === "number") ? state.idx : 0;
  const leaveStart = ()=>{ const sg = $("startGate"); if(sg) sg.classList.add("hidden"); document.body.classList.remove("is-start"); document.body.classList.add("loaded"); const bl = $("bootLoader"); if(bl) bl.remove(); };
  const sync = ()=>{ const i = cur(); const s = CARD.slides[i]; if(document.activeElement !== sel) sel.value = i;
    lbl.textContent = (i+1) + "/" + CARD.slides.length + (s ? " · " + s.id : ""); };
  const go = (i)=>{ i = Math.max(0, Math.min(i, CARD.slides.length - 1)); leaveStart(); mountSlide(i); sync(); };
  land.onclick = ()=>{ const sg = $("startGate"); if(sg){ sg.classList.remove("hidden"); document.body.classList.add("is-start"); } if(window.__armStartNudge) window.__armStartNudge(); };
  first.onclick = ()=> go(0); prev.onclick = ()=> go(cur() - 1); next.onclick = ()=> go(cur() + 1); last.onclick = ()=> go(CARD.slides.length - 1);
  sel.onchange = ()=> go(parseInt(sel.value, 10));
  bar.append(land, first, prev, sel, lbl, next, last);
  document.body.appendChild(bar);
  setInterval(sync, 300); sync();
}
boot();
