# -*- coding: utf-8 -*-
"""HI02H11_L01_S01 — "बार-बार आने वाली ध्वनि" (the repeated sound in a sentence) · Hindi · Grade 2.

RECIPE RECONSTRUCTED 2026-09-14. The SME handover shipped the built HTML + card.json but NO build
script, and the game was not in the factory's KG/ — the documented "missing recipe" case. This file
is the delivered card re-expressed as source, with the SME's round-4 deck applied on top.

ROUND 4 (this file's reason to exist) — every change is a numbered row in the bundle's CHANGES.md.
Headlines:
  * 20 pages -> 16. Slides G4, P3, P5, P6 deleted (deck pages 11, 15, 17, 18).
  * Teach order re-sequenced to च -> म -> प (deck pages 2 and 3 move to after page 7).
  * The three SENTENCE_SOUND teach pages get the word-by-word + target-letter highlighting that
    round 3 had to report as NOT BUILT; it is a new engine path (data.teach_seq).
  * The three MEET_LETTER pages lose their on-screen explanation (VO only) and gain a VO-synced
    reveal (data.reveal_flow).
  * Page 8's हाँ/नहीं check is replaced by a new balloon mechanic (TAP_BALLOON_SOUND).
  * The landing drops its heading + प/च/म strip for one worked example sentence and a crow.

THIS GAME IS ENGINE-ISOLATED (KG/HI02H11_L01_S01/engine_local). The round-4 engine work is
game-specific and the shared engine has no other consumer for it here, so it lives in the private
copy — nothing else in the fleet is touched. Build through the isolation shim, not by running this
file directly, or the guard will measure the game against the shared engine instead of its own.
"""
import io, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import unified_build

FLN_ROOT = os.path.dirname(HERE)
CODE = "HI02H11_L01_S01"
OUT = os.path.join(FLN_ROOT, "KG", CODE)

# ══════════════════════════════════════════════════════════════════════════════════════════
#  VOICE-OVER SCRIPT — shown text == spoken text. This map IS the recording brief, and the
#  engine reads it at runtime to drive the VO-synced highlighting on the MEET_LETTER pages
#  (assets.audio_text), so a line edited here changes both what is said and where the letter
#  lights up. Lines marked [r4] are new or re-scripted this round.
# ══════════════════════════════════════════════════════════════════════════════════════════
VO = {
    # ---- landing ------------------------------------------------------------------------
    # [r6l] SME, verbatim: the cover VO and text become this one sentence. It replaces the four-part
    # r4 greeting (introduction, topic, the demo line "काला कौआ काँव-काँव करता", then the explanation
    # of क) - 170 characters and ~17 seconds of it - with a single statement of what the lesson is
    # about. That is a real improvement to the cover: the demo sentence was teaching क, which is not
    # this lesson's sound, and a child had to sit through all of it before the button would release.
    #
    # THE RECORDED CLIP STILL HOLDS THE OLD LINE. It is human VO and is not regenerated here: the
    # no-TTS ruling [30o] applies most sharply to the cover, which is the first thing anyone hears.
    # So until the studio delivers a new take, the card is right and the audio is stale - see the
    # stale-take warning added to check_clip_lengths below, which now prints exactly this mismatch
    # on every build rather than leaving it to be noticed by ear.
    "vo_landing": "आज हम जानेंगे वाक्य में बार-बार आने वाली ध्वनि यानी आवाज़ के बारे में।",

    # ---- the sentences ------------------------------------------------------------------
    "vo_line_l1": "पीतल के पतीले में पपीता पीला-पीला।",
    "vo_line_l2": "चूहे ने चार चने चबाए।",          # [r4 · row 16] was "चूहा चार चने चबाए"
    "vo_line_l3": "मेरे मामा मीठी मलाई लाए।",        # [r4 · row 30] was "मामा मीठी मलाई लाए"
    # [r5n] SME-supplied replacement sentence.
    "vo_line_l6": "नानी ने नई नाव बनाई।",                # [r4 · row 99] NEW — replaces the old ल-trap line

    # ---- teach: sentence pages ----------------------------------------------------------
    # [r4 · rows 46/47] deck page 6 asks for VO 2 and VO 3 as SEPARATE beats, so the old single
    # vo_t1_explain is split: the words are named while प lights up in each of them, and only
    # then does the conclusion play.
    "vo_t1_words":   "पीतल, पतीले, पपीता, पीला।",
    # [r5k] SME: page 5 seems different, the VO and animation should be similar to page 1.
    # This was the difference. The mark beat lights the four words ONE AT A TIME, paced by this
    # clip — and on pages 1 and 3 the clip NAMES them ("चूहे, चार, चने, चबाए—..."), so each word
    # lights as it is spoken. r4 shortened this one to drop the list, leaving page 5 marking four
    # words against a sentence that names none of them. Restored to the page-1 shape.
    "vo_t1_explain": "पीतल, पतीले, पपीता, पीला-पीला—इन सब शब्दों में प की आवाज़ बार-बार आई।",
    "vo_t3_explain": "चूहे, चार, चने, चबाए—इन सब शब्दों में च की आवाज़ बार-बार आई।",   # [r4 · row 22]
    "vo_t5_explain": "मेरे, मामा, मीठी, मलाई—इन सब शब्दों में म की आवाज़ बार-बार आई।",  # [r4 · row 36]

    # ---- teach: meet-the-letter pages ---------------------------------------------------
    # [r4 · rows 52/28/38] all three re-scripted to the deck's "Final VO", which now also carries
    # the example word — that word is the cue the letter-highlight is timed to.
    "vo_t2_prompt": "हमने प की आवाज़ सुनी। यह आवाज़ प अक्षर से लिखी जाती है। जैसे—प से पपीता।",
    "vo_t4_prompt": "हमने च की आवाज़ सुनी। यह आवाज़ च अक्षर से लिखी जाती है। जैसे—च से चूहा।",
    "vo_t6_prompt": "हमने म की आवाज़ सुनी। यह आवाज़ म अक्षर से लिखी जाती है। जैसे—म से मूली।",

    # ---- guided 1 · balloons (deck page 8) ----------------------------------------------
    # [r4 · rows 55/60/62] VERBATIM from the deck, and AAP («कीजिए», «सुनिए») where every
    # other line used to be TUM. That split was flagged as OPEN-4 and is now CLOSED: [r5r] moved the
    # whole lesson to AAP on the SME's instruction, so these lines are no longer the odd ones out.
    "vo_g1_prompt":  "प की आवाज़ वाले चित्र पर टैप कीजिए।",
    "vo_g1_correct": "शाबाश! इसमें प की आवाज़ है।",
    "vo_g1_hint":    "ध्यान से सुनिए, इसमें प की आवाज़ नहीं है।",
    # [r5o] ROUND 2 hunts a DIFFERENT sound, so it cannot share round 1's praise or hint - both name
    # the letter out loud. levels[n].audio carries these.
    # [r5r] REGISTER: this lesson addresses the child as आप, not तुम. करो -> कीजिए and देखो -> देखिए
    # throughout. The SME asked for it on the ON-SCREEN text; the spoken-only lines went with it,
    # because prompt_hi IS the VO on these pages and a page that reads कीजिए then says करो two
    # seconds later is worse than either register on its own.
    "vo_g1_next":     "अब “च” की आवाज़ वाले चित्रों पर टैप कीजिए।",
    "vo_g1_correct2": "शाबाश! इसमें च की आवाज़ है।",
    "vo_g1_hint2":    "ध्यान से सुनिए, इसमें च की आवाज़ नहीं है।",

    # ---- guided 2 · tap-all प (deck page 9) ---------------------------------------------
    # [r5m] SME: put the letter in inverted commas in the instruction panel. prompt_hi IS this
    # string (shown == spoken, by construction), so the quotes live here rather than in a second
    # copy of the line. They cost nothing spoken: TTS does not voice a quotation mark, so the
    # existing clip still matches and does not need re-recording.
    "vo_g2_prompt": "\u201cप\u201d की आवाज़ वाले शब्दों पर टैप कीजिए।",
    # [r5m] SME: "after first correct selection the VO will play 'एक और प वाले शब्द पर टैप करो'".
    # The mechanic had nothing to say between the first correct tap and the last one, so a child who
    # found one word got silence where the page should have asked for the other.
    "vo_g2_more":   "एक और प वाले शब्द पर टैप कीजिए।",
    "vo_g2_hint":   "हर शब्द को ध्यान से देखिए और सुनिए। किस शब्द में प की आवाज़ आ रही है?",   # [r4 · row 72]
    "vo_g2_try":    "इस शब्द की शुरुआत में प की आवाज़ नहीं है। एक बार फिर सुनो।",
    "vo_g2_reveal": "सुनो — इसमें प की आवाज़ है।",
    "vo_g2_done":   "शाबाश! तुमने प की आवाज़ वाले सारे शब्द खोज लिए।",

    # ---- guided 3 · which sound repeats (deck page 10) ----------------------------------
    # [r5m] SME: "remove 'ध्यान से सुनो' text from instruction panel", and separately that the VO
    # heard after two wrong attempts ("ध्यान से सुनो…") should be replaced by replaying the SENTENCE
    # with the letter highlighted. That second VO was this very clip: with no `hint` key authored,
    # the 2nd-wrong rung fell through to the prompt. Cutting the phrase here fixes both at once and
    # keeps shown == spoken, which passing a separate display string would have broken.
    "vo_g3_prompt":  "इस वाक्य में कौन-सी आवाज़ बार-बार आई?",
    "vo_g3_try":     "यह च की आवाज़ नहीं है।",                          # [r4 · row 79] Hint 1, verbatim
    "vo_g3_reveal":  "ध्यान से देखिए, सही जवाब च है।",                    # [r4 · row 80] Hint 2, verbatim
    "vo_g3_correct": "चूहे, चार, चने, चबाए — इन सब शब्दों में च की आवाज़ बार-बार आई।",   # [r4 · row 82]
    "vo_g3_hint":    "हर शब्द की शुरू की आवाज़ पर ध्यान दो।",

    # ---- guided 5 · sort प vs च (deck page 12) ------------------------------------------
    # [r5n] SME: "replace the word टोकरी with डिब्बे" in the instruction panel. prompt_hi IS this
    # string, so it changes here — and the two lines that echo the word back at the child change
    # with it, or the page would say डिब्बा once and टोकरी twice.
    # [r5r] page 10 is the fourth ON-SCREEN instruction and was the only one left in तुम once
    # pages 7/11/13 moved to आप. The SME named करो and देखो; this line ends सुनो/डालो, which is the
    # same register on the same kind of text, so it travels with them rather than sitting beside
    # three कीजिए panels in तुम. The spoken-ONLY तुम lines are listed in CHANGES.md, undecided.
    "vo_g5_prompt": "हर चित्र का नाम सुनिए और उसे सही डिब्बे में डालिए।",   # [r4 · row 85]
    # CONSEQUENCE of row 83: the bins stopped being «प है / प नहीं है» and became «प / च», so a
    # hint that asks a yes-no question about प no longer fits the board it is hinting about.
    # Re-pointed at the two-way choice; logic and progression untouched, per the deck's "keep the
    # existing hint logic". Listed under CHANGED BEYOND THE DECK.
# [r5n] the watch-first page: the child does nothing here, so the line says so.
    # [r5r] SME: drop the opening "देखो," from page 9's panel. What is left is the whole
    # instruction on its own, and the page demonstrates rather than tells.
    "vo_g5_show":    "हर चित्र को उसके सही डिब्बे में ऐसे डालते हैं।",
    "vo_g5_hint":    "शब्द बोलो और सुनो — उसमें प की आवाज़ है या च की?",
    "vo_g5_try":     "यह डिब्बा सही नहीं है। शब्द की आवाज़ फिर सुनो।",
    "vo_g5_correct": "बहुत बढ़िया! सही डिब्बा।",

    # ---- practice 1 · tap-all म (deck page 13) ------------------------------------------
    "vo_p1_prompt": "\u201cम\u201d की आवाज़ वाले शब्दों पर टैप कीजिए।",
    "vo_p1_more":   "एक और म वाले शब्द पर टैप कीजिए।",
    "vo_p1_hint":   "हर शब्द सुनो — क्या उसमें म की आवाज़ सुनाई देती है?",
    "vo_p1_try":    "इस शब्द की शुरुआत में म की आवाज़ नहीं है। एक बार फिर सुनो।",
    "vo_p1_reveal": "सुनो — इसमें म की आवाज़ है।",
    "vo_p1_done":   "शाबाश! म की आवाज़ वाले सारे शब्द मिल गए।",

    # ---- practice 2 · where is the sound (deck page 14 — unchanged) ---------------------
    "vo_p2_prompt":  "सुनो — प की आवाज़ शब्द में कहाँ है?",
    "vo_p2_hint":    "पानी — प शुरू में। सपना — प बीच में। पूरा शब्द सुनो।",
    "vo_p2_try":     "पूरा शब्द फिर सुनो — आवाज़ शुरू में थी या बीच में?",
    "vo_p2_correct": "सही! आवाज़ शब्द के अलग-अलग हिस्सों में आ सकती है।",

    # ---- practice 4 · which sound starts the words (deck page 16) -----------------------
    "vo_p4_prompt": "कौन-सी आवाज़ शब्दों की शुरुआत में बार-बार आई?",
    "vo_p4_hint":   "शब्द के अंत की आवाज़ नहीं — शुरुआत की आवाज़ सुनो।",
    "vo_p4_try":    "तुमने आखिरी आवाज़ सुनी। हमें वह आवाज़ ढूँढनी है जो पूरे वाक्य में बार-बार आई है।",
    # CONSEQUENCE of row 99: the target sound on this page changed from प to न, so the two clips
    # that NAME the answer had to follow it. The hint ladder itself is untouched (row 103).
    "vo_p4_reveal":  "शुरुआत में न की आवाज़ बार-बार आई।",
    "vo_p4_correct": "सही! शुरुआत में न की आवाज़ थी।",

    # ---- practice 7 · tap-all च (deck page 19) ------------------------------------------
    "vo_p7_prompt": "\u201cच\u201d की आवाज़ वाले शब्दों पर टैप कीजिए।",
    "vo_p7_more":   "एक और च वाले शब्द पर टैप कीजिए।",
    "vo_p7_hint":   "च की आवाज़ शुरू में भी हो सकती है और बीच में भी। पूरा शब्द सुनो।",
    "vo_p7_try":    "इस शब्द में च की आवाज़ कहीं नहीं है। एक बार फिर सुनो।",
    "vo_p7_reveal": "सुनो — इसमें च की आवाज़ है।",
    "vo_p7_done":   "वाह! तुमने च की आवाज़ हर जगह पहचान ली।",

    # ---- celebration ---------------------------------------------------------------------
    "vo_p8_prompt": "शाबाश! आज हमने सीखा — वाक्य ध्यान से सुनना, बार-बार आने वाली आवाज़ पहचानना, "
                    "और प, च और म की आवाज़ ढूँढना।",

    # ---- letter sounds --------------------------------------------------------------------
    # *** RECORD A BARE SOUND, NOT THE CARRIER WORD. *** They read "<letter> से <word>" here ONLY
    # because the TTS model hard-refuses an isolated akshara (HTTP 400 on every bare variant), so
    # the carrier is a placeholder for the human reader. These are the most-heard clips in the
    # lesson: they play as each letter card lands on the teach pages and from every option reveal.
    "vo_snd_p":  "प से पतंग।",
    "vo_snd_ch": "च से चम्मच।",
    "vo_snd_m":  "म से मछली।",
    "vo_snd_l":  "ल से लट्टू।",
    "vo_snd_r":  "र से रस्सी।",
    "vo_snd_n":  "न से नाव।",       # [r4 · row 102] NEW — page 14's correct answer had no sound clip

    # [r5c] BARE letter sounds for the one-by-one option reveal. The SME ruling on page 9 was
    # "play only these च, ल, र sound not more than that — currently it plays ल से लट्टू, र से
    # रस्सी, which should not happen". G3 satisfies that because vo_snd_ch/l/r were cut down to
    # the bare akshara; P4 runs the SAME reveal mechanic but its म and न options still pointed at
    # the full carrier phrases (vo_snd_m is 2.17s of "म से मछली।"), so it reproduced exactly the
    # behaviour that was rejected. These two ids carry the bare sound for the reveal ONLY —
    # vo_snd_m keeps the carrier phrase because the TEACH page (T5) genuinely teaches "म से मछली".
    # [r5k] ...and now ALL SIX, because the SME reported the option sounds on pages 8 and 11 as
    # "not good, it feels abrupt". They were: r5c made them by TRIMMING a carrier phrase, which cuts
    # the waveform mid-decay — measured, the old clips still sat at 5-21% of their own peak at the
    # last sample, and that step to silence is the abruptness. These six are cut from a carrier that
    # REPEATS the letter ("च, च, च।"), so each one is a whole utterance with its own onset and decay,
    # taken at a silence boundary with 15ms/60ms fades. Every one now ends at 0.0% of peak.
    "vo_ltr_ch": "च",
    "vo_ltr_l":  "ल",
    "vo_ltr_r":  "र",
    "vo_ltr_p":  "प",
    "vo_ltr_m":  "म",
    "vo_ltr_n":  "न",

    # ---- object names (tap-to-hear) --------------------------------------------------------
    "vo_w_aam": "आम", "vo_w_champa": "चंपा", "vo_w_chandi": "चाँदी", "vo_w_chuha": "चूहा",
    "vo_w_laal": "लाल", "vo_w_mala": "माला", "vo_w_mama": "मामा", "vo_w_muli": "मूली",
    "vo_w_pani": "पानी", "vo_w_papita": "पपीता", "vo_w_payal": "पायल", "vo_w_sapna": "सपना",
    # [r4] new options the deck introduced
    "vo_w_patang": "पतंग", "vo_w_patta": "पत्ता", "vo_w_kela": "केला",
    # [r5o] round 2 fills its distractor side with क words. केला and कौआ were already drawn for this
    # lesson (कौआ is the cover crow), so only कमल and कबूतर are new art.
    "vo_w_kauaa": "कौआ", "vo_w_kamal": "कमल", "vo_w_kabutar": "कबूतर",
    "vo_w_ghar": "घर", "vo_w_machhli": "मछली",
    "vo_w_chand": "चाँद",      # [r4 · row 104] deck says चाँद, the old clip said चंदा
    "vo_w_chinti": "चींटी",     # [r4 · rows 89/104] deck says चींटी, the old clip said चींटा
    # [r5p] SME supplied the art for these three and named where each one goes: चिड़िया and लड्डू
    # replace चींटी and लाल on P1, चश्मा replaces चींटी on P7.
    "vo_w_chidiya": "चिड़िया", "vo_w_laddu": "लड्डू", "vo_w_chashma": "चश्मा",
    # [r5q] SME art again: चम्मच takes चाँदी's place in the प/च sort.
    "vo_w_chammach": "चम्मच",

    "vo_try_again": "एक बार फिर सुनो।",
}

# Copied in by the kit / inherited — never recorded for this lesson.
INHERITED_AUDIO = ["vo_pt_tutorial", "vo_pt_guided", "vo_pt_practice",
                   "sfx_celebrate", "sfx_correct", "sfx_wrong", "sfx_tap", "sfx_pop",
                   # [r5h] sfx_bal_pop ships and the balloon page plays it, but it was referenced
                   # ONLY from engine code, so the card never declared it and it had no entry in
                   # audio_dur - which the balloon page now needs to know how long to hold a word
                   # back behind its feedback sound.
                   "sfx_bal_pop",
                   # [r6i] The balloon page's music bed, supplied by the SME. It is declared
                   # here rather than left as a bare path in the engine for the reason r5h
                   # gives just above: an id the card does not declare gets no audio_dur row,
                   # and nothing downstream - the manifest, the receipt's VO-coverage count,
                   # the dist asset walker - can see that it exists. It is NOT in
                   # assets.audio_text, so check_clip_lengths skips it: there is no line for a
                   # twelve-second loop of music to be "too short to contain".
                   "sfx_bal_music"]
# [r4 · row 13] "A small काँव-काँव sound effect can play when the crow appears, if suitable."
# DELIVERED in r4d: an SME recording, trimmed here to one call. This list means "not scripted
# in VO" — these are sounds, not lines — not "still outstanding". sfx_kanv stays in it because a
# sound effect must never be routed to the TTS map; the untrimmed source is kept in
# _assets_round4/ so the cut can be redone without asking the SME again.
SFX_TO_RECORD = ["sfx_kanv"]

# ══════════════════════════════════════════════════════════════════════════════════════════
#  OBJECT ART
# ══════════════════════════════════════════════════════════════════════════════════════════
EMOJI = {
    "obj_aam": "🥭", "obj_champa": "🌼", "obj_chand": "🌙", "obj_chandi": "🪙", "obj_chinti": "🐜",
    "obj_chuha": "🐭", "obj_ghar": "🏠", "obj_kauaa": "🐦‍⬛", "obj_kela": "🍌", "obj_laal": "🔴",
    "obj_machhli": "🐟", "obj_mala": "📿", "obj_mama": "👨", "obj_muli": "🥕", "obj_pani": "💧",
    "obj_papita": "🍈", "obj_patang": "🪁", "obj_patta": "🍃", "obj_payal": "💍", "obj_sapna": "💭",
    # [r5p] the emoji is only the no-art fallback, but it still has to READ as the word: a
    # generic bird for चिड़िया (🐦, not the black 🐦‍⬛ that is already कौआ), a sweet for लड्डू, glasses for चश्मा.
    "obj_chidiya": "🐦", "obj_laddu": "🍬", "obj_chashma": "👓",
    "obj_chammach": "🥄",
}


# ══════════════════════════════════════════════════════════════════════════════════════════
#  SLIDE BUILDERS
# ══════════════════════════════════════════════════════════════════════════════════════════
def _item(word, img, audio, has=None, gender=None):
    """One picture option. `has` for the hunts, `gender` for the two-bin sorts."""
    d = {"word_hi": word, "img": img, "emoji": EMOJI[img], "audio": audio}
    if has is not None:
        d["has"] = has
    if gender is not None:
        d["gender"] = gender
    return d


def teach_sentence(sid, words, whole, sound, sound_clip, seq, mark_bare=False, hide_replay=False):
    """A tutorial SENTENCE_SOUND: the child watches and listens, there is nothing to pick.
    `seq` is the deck's own "Recommended Animation Flow" for that page, step by step."""
    return {
        "id": sid, "phase": "tutorial", "eis": "symbolic", "type": "SENTENCE_SOUND",
        "prompt_hi": "",
        # The deck's "Final VO" for each teach page lists the SENTENCE first and no separate question
        # line, and its "Recommended Animation Flow" opens on "Sentence appears" - so the three old
        # question prompts ("अब यह वाक्य सुनो...") are retired; after the re-order the first of them
        # would have opened the lesson with "NOW listen to THIS sentence" anyway.
        # The `prompt` ROLE still points at the sentence, because the sentence IS what this slide says
        # first. Leaving the role empty made the receipt read "SILENT prompts: T3, T5, T1" - a slide
        # that speaks plenty, reported as mute, is a false alarm nobody should have to re-litigate.
        "audio": {"prompt": whole, "target": sound_clip},
        "data": {
            "words": [{"text": w} for w in words],
            "whole_audio": whole,
            "target_sound": sound,
            # ONE letter card. The deck removes the other letters from every teach page —
            # "Remove र and ल from the current activity. Keep the focus only on the target sound"
            # / "Remove the current focus on त and ल" — and re-frames what is left as
            # "show the letter clearly on screen" rather than as a choice.
            "options": [{"letter": sound, "audio": sound_clip}],
            "teach_seq": seq,
            # mark_bare: light the CONSONANT ONLY (च, never चू/चा). Page-by-page: page 2 has it.
            "mark_bare": mark_bare,
            # hide_replay: drop the «फिर सुनो» pill. The Swiftie shoulder chip still replays the line.
            "hide_replay": hide_replay,
            "signal_name": "sentence_sound_first_try",
        },
    }


def meet_letter(sid, letter, word, img, prompt_clip, word_clip, sound_clip, cue_word):
    """A tutorial MEET_LETTER. prompt_hi is DELIBERATELY EMPTY on all three of these pages: the
    deck removes the explanatory sentence from the screen and keeps it as VO only, on every one
    ("so the screen remains clean and less text-heavy for Grade 2 FLN learners")."""
    return {
        "id": sid, "phase": "tutorial", "eis": "iconic", "type": "MEET_LETTER",
        "prompt_hi": "",
        "audio": {"prompt": prompt_clip, "word_name": word_clip, "sound": sound_clip},
        "data": {
            "letter": letter,
            "picture_img": img, "picture_emoji": EMOJI[img], "word_hi": word,
            "reveal_flow": {
                # cues are words OF THE SPOKEN LINE above; the engine fires each as that word is
                # reached, which is how "highlight ... exactly in sync with the VO" is honoured
                # without a forced aligner.
                "cues": [
                    {"at": "सुनी", "do": "letter"},   # "हमने <letter> की आवाज़ सुनी।"
                    # [r5k] SME: when the VO plays "च से", the image should appear INSTANTLY.
                    # r5j had put it after the whole line, which was the previous ask; this is the
                    # correction. The anchor matters: "से" occurs TWICE ("अक्षर से लिखी" and
                    # "च से चूहा"), and the resolver scans FORWARD from the last cue — so the "जैसे"
                    # cue below is what makes "से" resolve to the second one. It re-pulses the
                    # letter, which also gives the middle of the line a beat of its own.
                    {"at": "जैसे", "do": "letter"},   # "जैसे—<letter> से <word>।"
                    {"at": "से",   "do": "pic"},      # the picture lands ON "<letter> से"
                    {"at": cue_word, "do": "label"},  # its name appears as the word is spoken
                ],
                # [r5j] THE PICTURE WAITS FOR THE LINE TO FINISH. The SME: "whenever an image comes
                # ... it will come AFTER the vo is done - 'च से चूहा' then the mouse image comes".
                # These three used to be token cues (pic on "लिखी", label on "जैसे", mark on the
                # example word), which put the picture on screen a whole sentence BEFORE the word
                # naming it was spoken. The example word ends the line, so "after it" cannot be
                # written as a token cue at all - the engine runs these off the clip's end.
                # only the letter-mark still waits for the line to finish
                "after_line": ["mark"],
            },
        },
    }


def _bit(word, img, audio, has):
    """One balloon. Same shape as _item, but `has` is positional: the round tables below list
    twenty-two of these and the keyword form made them unreadable."""
    return {"word_hi": word, "img": img, "emoji": EMOJI.get(img, "\u2b50"),
            "audio": audio, "has": has}


def tap_all(sid, phase, sound, prompt, items, clips, allow_hand=False):
    return {
        "id": sid, "phase": phase, "eis": "iconic", "type": "TAP_ALL_WITH_SOUND",
        "prompt_hi": prompt,
        "audio": clips,
        # [r4u] allow_hand: the earned hand after two wrong taps. handOnAnswer self-gates to
        # tutorial+guided (the round-3 rule), so a PRACTICE page asks for it by name instead of
        # the rule being loosened fleet-wide. Same opt-in the balloon page already uses.
        "data": {"target_sound": sound, "items": items, "allow_hand": allow_hand,
                 "reveal_seq": True, "signal_name": "tap_all_sound_first_try"},
    }


def sort_two(sid, phase, prompt, bins, items, clips, signal, drag_demo=False, auto_demo=False,
             auto_advance=False):
    return {
        "id": sid, "phase": phase, "eis": "enactive", "type": "SORT_VACHAN",
        "prompt_hi": prompt,
        "audio": clips,
        # [r4v] drag_demo: show the hand travelling from a tile to the middle of the bins row
        # once, so the child sees HOW to drag. Points between the baskets, never at the right one.
        # [r5n] auto_demo: the page plays the drag itself and takes no input. drag_demo is the
        # older, weaker thing - a hand travelling over a board the child still has to work.
        # [r5r] auto_advance: when the demo finishes, go to the next slide instead of lighting
        # आगे. Separate from auto_demo so a demo page can still choose to wait for a tap.
        "data": {"bins": bins, "items": items, "reveal_seq": True, "signal_name": signal,
                 "drag_demo": drag_demo, "auto_demo": auto_demo, "auto_advance": auto_advance},
    }


def pick_sound(sid, phase, prompt, words, whole, sound, options, clips,
               hide_replay=False, seq_say_whole=False, fixed_order=False, mark_initial=False):
    """SENTENCE_SOUND as a real question: hear the line, pick the sound that repeats.
    reveal_seq makes the letters arrive one at a time, each speaking itself — the deck asks for
    exactly that on both of these pages ("Letters should appear one by one... play its
    corresponding sound/VO... keep a short pause")."""
    return {
        "id": sid, "phase": phase, "eis": "symbolic", "type": "SENTENCE_SOUND",
        "prompt_hi": prompt,
        "audio": clips,
        "data": {
            "words": [{"text": w} for w in words],
            "whole_audio": whole, "target_sound": sound,
            "options": options,
            "signal_name": "sentence_sound_first_try", "reveal_seq": True,
            "hide_replay": hide_replay, "seq_say_whole": seq_say_whole,
            "fixed_order": fixed_order,
            # [r5n] mark the target ONLY where it starts a word. P4 asks which sound repeats at
            # the START of words, and its new sentence carries a न mid-word in बनाई - lighting
            # that one would answer a different question than the page is asking.
            "mark_initial": mark_initial,
        },
    }


def build_card():
    slides = []

    # ══ TUTORIAL ═══════════════════════════════════════════════════════════════════════
    # Teach order is च -> म -> प (deck: pages 2 and 3 move to after page 7). The slide IDs keep
    # their ORIGINAL letters so every VO id, screenshot and tracker row still resolves; only the
    # sequence changed. Reading the list top-to-bottom gives the played order.

    # new page 2 (was page 4) — च
    slides.append(teach_sentence(
        "T3", ["चूहे", "ने", "चार", "चने", "चबाए।"], "vo_line_l2", "च", "vo_ltr_ch",
        mark_bare=True,      # [r4e] "highlight only च - no matra"
        hide_replay=True,    # [r4f] "remove the फिर सुनो button"
        # [r5z] THE LETTER ARRIVES LAST, AND IT SPEAKS. SME: "once the letter[s are] highlighted then
        # the च letter will appear on the screen and its VO will be aligned with it."
        #   * ORDER: mark before letter. The page used to show the card and then go looking for the
        #     sound in the words, which asks the child to hold an unexplained symbol in mind. Now the
        #     line is highlighted first and the card is the ANSWER to what they just saw repeating.
        #   * SOUND: `silent` is gone, so the card plays audio.target - vo_ltr_ch, the bare च - at the
        #     moment it appears. That is the alignment asked for, and it also restores the deck's own
        #     row 21 ("play only the च sound"), which r4f had dropped to keep the page to two clips.
        #     The page now has three: sentence, explanation, letter.
        seq=[
            {"step": "sentence"},                 # VO 1, word-by-word in step with the line
            {"step": "clear_words"},              # "After the sentence is completed, remove the
                                                  #  word-level highlighting."
            {"step": "pause", "ms": 900},         # "a brief pause ... a moment to notice"
            {"step": "mark", "audio": "vo_t3_explain",
             "words": ["चूहे", "चार", "चने", "चबाए।"],   # VO 2
            # [r6b] SME: show the card WHEN the voice says "च की आवाज़ बार-बार आई", and pulsate
            # it - so the card is cued to that token INSIDE this clip rather than following it,
            # and r6a's separate spoken letter beat is gone. The pulse is .ss-lit's own.
             "reveal_at": "च"},
        ]))
    # new page 3 (was page 5) — च; the ant is gone, the mouse the sentence is ABOUT takes its place
    slides.append(meet_letter("T4", "च", "चूहा", "obj_chuha",
                              "vo_t4_prompt", "vo_w_chuha", "vo_snd_ch", cue_word="चूहा"))
    # new page 4 (was page 6) — म
    slides.append(teach_sentence(
        "T5", ["मेरे", "मामा", "मीठी", "मलाई", "लाए।"], "vo_line_l3", "म", "vo_ltr_m",
        # [r4j] MATCH THE च PAGE (SME: "page 3 is the same as page 1, match the animation").
        # Row 33 asks to "highlight only म" in the same breath row 20 asks "only च", but this page
        # shipped with the WHOLE AKSHARA lit - capture 04 shows मे, मा, मी amber, matra included -
        # while the च page lights the bare consonant. Same two flags, so the two read alike; the
        # engine then also drops the green reveal-pulse and the chip lift on the mark beat.
        mark_bare=True,      # [r4j] bare म, never मे/मा
        hide_replay=True,    # [r4j] no «फिर सुनो» pill; the Swiftie shoulder chip still replays the line
        seq=[
            {"step": "sentence"},
            {"step": "clear_words"},
            {"step": "pause", "ms": 900},   # [r4j] the च page pause, so both breathe alike
            # [r5k] SME: remove the "म से मछली" VO, this page should be the same as page 1.
            # It was the ONE teach page that spoke on this beat — pages 1 and 5 have always
            # been silent here — so the म page alone said a carrier phrase the others never did.
            # "लाए" is listed nowhere here, on purpose: "Do not highlight लाए, because it does not
            # contain the target sound म."
            {"step": "mark", "audio": "vo_t5_explain",
             "words": ["मेरे", "मामा", "मीठी", "मलाई"],
            # [r6b] SME: show the card WHEN the voice says "म की आवाज़ बार-बार आई", and pulsate
            # it - so the card is cued to that token INSIDE this clip rather than following it,
            # and r6a's separate spoken letter beat is gone. The pulse is .ss-lit's own.
             "reveal_at": "म"},
        ]))
    # new page 5 (was page 7) — म
    slides.append(meet_letter("T6", "म", "मूली", "obj_muli",
                              "vo_t6_prompt", "vo_w_muli", "vo_snd_m", cue_word="मूली"))
    # new page 6 (was page 2) — प.
    # [r4l] ORDER NOW MATCHES PAGES 2 AND 4 (SME: "page 5 is similar to page 1 and 3, fix it the
    # same way"). This page used to mark the words FIRST and bring the letter in after, which is
    # what deck page 2 asked for verbatim ("VO 2 plays with प highlighted in each target word ->
    # letter प appears -> VO 3"). The reviewer has since asked for all three teach sentences to
    # read alike, and consistency across the three won out. NOTHING IS DROPPED: all three clips
    # still play, and in the same relative order to each other - only the letter card now arrives
    # before the marking instead of after, so the child sees प while the words light up.
    # Flagged in CHANGES.md against row 45 so the SME can overrule if the deck order was load-bearing.
    slides.append(teach_sentence(
        "T1", ["पीतल", "के", "पतीले", "में", "पपीता", "पीला-पीला।"], "vo_line_l1", "प", "vo_ltr_p",
        # [r4j] Row 44 asks to "highlight only प" in the same words rows 20/33 ask "only च" /
        # "only म", and the note below is explicit that only the STEP ORDER differs on this page.
        # It had shipped with the whole akshara lit (पी - matra included). All three teach
        # sentences now mark the bare consonant, as the cover does.
        mark_bare=True,      # [r4j] bare प, never पी
        hide_replay=True,    # [r4j] no «फिर सुनो» pill, matching pages 2 and 4
        seq=[
            {"step": "sentence"},
            {"step": "clear_words"},
            {"step": "pause", "ms": 900},
            # [r4n] SME: "we don't need प se Patang VO" - vo_snd_p is the phrase
            # "प से पतंग।". The card still ARRIVES on its own beat, exactly as page 2 does.
            # [r4o] ONE CLIP FOR THE MARK BEAT, so the marking is SPOKEN OVER instead of
            # running silent and being narrated afterwards. vo_t1_words.ogg has never been
            # generated (row 46), so this beat had NO audio at all: the four प lit in silence on
            # the engine fallback timeline and only THEN did vo_t1_explain speak - the SME's
            # "first it highlights all the letters then it plays the VO". Pages 2 and 4 have no
            # such seam because their ONE clip names the words and explains, with the marking
            # paced across it. Same shape here, using the clip that exists.
            # When vo_t1_words.ogg is finally produced the SME may want the two-beat script back.
            {"step": "mark", "audio": "vo_t1_explain",
             "words": ["पीतल", "पतीले", "पपीता", "पीला-पीला।"],
            # [r6b] SME: show the card WHEN the voice says "प की आवाज़ बार-बार आई", and pulsate
            # it - so the card is cued to that token INSIDE this clip rather than following it,
            # and r6a's separate spoken letter beat is gone. The pulse is .ss-lit's own.
             "reveal_at": "प"},
        ]))
    # new page 7 (was page 3) — प
    slides.append(meet_letter("T2", "प", "पपीता", "obj_papita",
                              "vo_t2_prompt", "vo_w_papita", "vo_snd_p", cue_word="पपीता"))

    # ══ GUIDED ═════════════════════════════════════════════════════════════════════════
    # new page 9 (was page 9) — 4 options: 2 correct, 2 not
    slides.append(tap_all(
        "G2", "guided", "प", VO["vo_g2_prompt"],
        [_item("पपीता", "obj_papita", "vo_w_papita", has=True),
         _item("केला",  "obj_kela",   "vo_w_kela",   has=False),
         _item("पतंग",  "obj_patang", "vo_w_patang", has=True),
         _item("आम",    "obj_aam",    "vo_w_aam",    has=False)],
        {"prompt": "vo_g2_prompt", "target": "vo_snd_p", "hint": "vo_g2_hint",
         "try_again": "vo_g2_try", "reveal": "vo_g2_reveal", "done": "vo_g2_done",
         "more": "vo_g2_more"}))
    # new page 10 (was page 10) — same sentence as the च teach page, now as a question
    slides.append(pick_sound(
        "G3", "practice", VO["vo_g3_prompt"],
        ["चूहे", "ने", "चार", "चने", "चबाए।"], "vo_line_l2", "च",
        [{"letter": "च", "audio": "vo_ltr_ch"},
         {"letter": "ल", "audio": "vo_ltr_l"},
         {"letter": "र", "audio": "vo_ltr_r"}],
        # [r4p] NO `hint` KEY ON PURPOSE. revealAnswer() speaks
        #   audioFor("hint") || audioFor("reveal") || ...
        # so while a generic `hint` was authored, the 2nd-wrong rung spoke
        # "हर शब्द की शुरू की आवाज़ पर ध्यान दो।" instead of the Hint 2 line the deck asks for.
        # Dropping it lets `reveal` through, which IS that line. The deck specifies exactly two
        # rungs on this page, so the generic third one has nothing to attach to anyway.
        {"prompt": "vo_g3_prompt", "target": "vo_ltr_ch",
         "try_again": "vo_g3_try", "reveal": "vo_g3_reveal", "correct": "vo_g3_correct"},
        hide_replay=True,      # [r4p] "remove the फिर से सुनो button"
        seq_say_whole=True,    # [r4p] ...so the sentence must play itself, before the letters
        fixed_order=True))     # [r4p] entry order is named in the flow: च -> ल -> र
    # new page 11 (was page 12) — the bins become प vs च, and every option now clearly carries
    # one of the two ("मोती" had neither, so it could not belong in either basket)
    # [r5n] WATCH FIRST, THEN DO. The SME asked for a copy of the sort page placed BEFORE it, with
    # its own two words, on which "user won't do anything - we'll just show how to do things".
    # So this page is not a hand nudge over a live board (that was drag_demo, and it is switched off
    # below): `auto_demo` locks input and plays the whole gesture - each picture is named, then
    # travels into its own box by itself, with the hand riding along. Two tiles, one per box, which
    # is the smallest set that shows "this one goes here, that one goes there".
    # Words chosen from art and clips this lesson ALREADY ships (पतंग on page 7, चाँद on page 12), so
    # the demo costs one new VO line and nothing else - dist has little headroom left.
    slides.append(sort_two(
        "G5D", "practice", VO["vo_g5_show"],
        [{"gender": "S", "label": "प"},
         {"gender": "P", "label": "च"}],
        [_item("पतंग", "obj_patang", "vo_w_patang", gender="S"),
         _item("चाँद", "obj_chand",  "vo_w_chand",  gender="P")],
        {"prompt": "vo_g5_show", "target": "vo_snd_p", "correct": "vo_g5_correct"},
        "sound_sort_demo",
        # [r5r] SME: "remove the next button from the 9th page, once the pre screen tutorial is
        # complete then it will automatically transition to the 10th page". There is nothing to
        # DO on a watch-first page, so a button that only says "I have finished watching" is a
        # gate with no question behind it. Scoped to this slide by its own flag rather than to
        # auto_demo, so a future demo page can still choose to wait for a tap.
        auto_demo=True, auto_advance=True))

    slides.append(sort_two(
        "G5", "practice", VO["vo_g5_prompt"],
        # [r5n] SME: "keep only प and च, remove every other word". The boxes are read by a
        # pre-reader, and "प की आवाज़ वाला" is a sentence; the letter alone is the label.
        [{"gender": "S", "label": "प"},
         {"gender": "P", "label": "च"}],
        # [r5q] SME swap: चाँदी -> चम्मच. Both begin च, so the च box still takes two and the प box
        # still takes two - a swap across bins would have left one box unfillable.
        # चाँदी has NOT left the lesson: page 14's second balloon round still uses it.
        [_item("पानी",  "obj_pani",     "vo_w_pani",     gender="S"),
         _item("पायल",  "obj_payal",    "vo_w_payal",    gender="S"),
         _item("चूहा",  "obj_chuha",    "vo_w_chuha",    gender="P"),
         _item("चम्मच", "obj_chammach", "vo_w_chammach", gender="P")],
        {"prompt": "vo_g5_prompt", "target": "vo_snd_p", "hint": "vo_g5_hint",
         "try_again": "vo_g5_try", "correct": "vo_g5_correct"},
        "sound_sort_first_try"))
        # [r5n] drag_demo is GONE: the page before this one now teaches the gesture in full, so a
        # hand travelling over the live board would repeat a lesson the child has just watched.

    # ══ PRACTICE ═══════════════════════════════════════════════════════════════════════
    # new page 12 (was page 13) — 5 options down to 4; माला leaves this page
    slides.append(tap_all(
        "P1", "practice", "म", VO["vo_p1_prompt"],
        # [r5p] SME swap. Both departures are DISTRACTORS on a म page, and both arrivals are too
        # (चिड़िया begins च, लड्डू begins ल), so the page still holds exactly two answers.
        [_item("मामा",   "obj_mama",    "vo_w_mama",    has=True),
         _item("चिड़िया", "obj_chidiya", "vo_w_chidiya", has=False),
         _item("मूली",   "obj_muli",    "vo_w_muli",    has=True),
         _item("लड्डू",   "obj_laddu",   "vo_w_laddu",   has=False)],
        {"prompt": "vo_p1_prompt", "target": "vo_snd_m", "hint": "vo_p1_hint", "more": "vo_p1_more",
         "try_again": "vo_p1_try", "reveal": "vo_p1_reveal", "done": "vo_p1_done"},
        allow_hand=True))   # [r4u] hand after two wrong taps, as on page 7
    # [r4u] PAGE 11 (P2 — the "शुरुआत में / बीच में" sort) REMOVED on request: "we don't want it
    # anymore in our game". Resolved by slide ID before anything renumbered — the ask named page 11
    # against the order live when it was written, and dropping a slide shifts every page after it.
    # new page 14 (was page 16) — new line, new target sound (न), new third option.
    # The deck explicitly does NOT want word-by-word highlighting here ("No word-by-word
    # highlighting is required"), so this page carries no teach_seq — it is a plain question.
    slides.append(pick_sound(
        "P4", "practice", VO["vo_p4_prompt"],
        ["नानी", "ने", "नई", "नाव", "बनाई।"], "vo_line_l6", "न",
        # [r5c] bare sounds on the reveal — see the vo_ltr_* note in the VO map above.
        # (ल already points at vo_snd_l, which was itself cut to the bare akshara for G3.)
        [{"letter": "म", "audio": "vo_ltr_m"},
         {"letter": "ल", "audio": "vo_ltr_l"},
         {"letter": "न", "audio": "vo_ltr_n"}],
        # [r5b] NO `hint` KEY, for the same reason as G3 above: the reveal path speaks
        #   audioFor("hint") || audioFor("reveal") || ...
        # so while a hint was authored, the REVEAL never reached vo_p4_reveal
        # ("शुरुआत में न की आवाज़ बार-बार आई।") - it repeated the hint, so this page never actually
        # told the child the answer. vo_p4_hint is retired; vo_p4_try already carries the
        # "you heard the LAST sound, we want the repeated one" steer that it duplicated.
        {"prompt": "vo_p4_prompt", "target": "vo_ltr_n",
         "try_again": "vo_p4_try", "reveal": "vo_p4_reveal", "correct": "vo_p4_correct"},
        mark_initial=True,     # [r5n] "शुरुआत में" - see pick_sound
        hide_replay=True,      # [r5b] page 9's treatment - no «फिर से सुनो» pill
        seq_say_whole=True,    # [r5b] ...so the sentence plays itself, before the letters
        fixed_order=True))     # [r5b] pin the entry order म -> ल -> न
    # new page 15 (was page 19) — 5 options down to 4
    slides.append(tap_all(
        "P7", "practice", "च", VO["vo_p7_prompt"],
        # [r5p] SME swap. चींटी was an ANSWER here, and चश्मा begins च too, so the count holds at two.
        [_item("चाँद",  "obj_chand",   "vo_w_chand",   has=True),
         _item("माला",  "obj_mala",    "vo_w_mala",    has=False),
         _item("चश्मा", "obj_chashma", "vo_w_chashma", has=True),
         _item("लाल",   "obj_laal",    "vo_w_laal",    has=False)],
        {"prompt": "vo_p7_prompt", "target": "vo_snd_ch", "hint": "vo_p7_hint", "more": "vo_p7_more",
         "try_again": "vo_p7_try", "reveal": "vo_p7_reveal", "done": "vo_p7_done"},
        allow_hand=True))   # [r4u] hand after two wrong taps, as on page 7
    # [r5d] MOVED TO THE END (SME: "the balloon page should be the last page"). It used to sit at
    # new page 8, between the teach block and the tap-all. Two things travel with it:
    #   - phase guided -> practice. The phase-transition gate fires on a phase BOUNDARY, so leaving
    #     it "guided" after four practice slides would have replayed the guided interstitial near
    #     the end of the lesson. Monotonic phases keep that gate firing once each.
    #   - that change also removes its hand nudge: HAND_PHASES is tutorial+guided, so a practice
    #     slide earns no hand even after 2 wrong taps. Flagged in CHANGES (OPEN-16).
    # prompt_hi is empty and stays empty: "Do not show any written instruction on the screen."
    slides.append({
        "id": "G1", "phase": "practice", "eis": "iconic", "type": "TAP_BALLOON_SOUND",
        "prompt_hi": "",
        "audio": {"prompt": "vo_g1_prompt", "target": "vo_snd_p",
                  "correct": "vo_g1_correct", "hint": "vo_g1_hint"},
        "data": {
            "target_sound": "प",
            # [r5o] TWO ROUNDS, and the sky never thins out.
            #   * popping a target REFILLS that balloon from `spares` - the SME asked for "at that
            #     place other balloon will appear with other image". A refill is always a NON-target,
            #     so the number still to find stays exactly what the round promised.
            #   * clearing a round swaps the whole set for the next one.
            # Round 2 hunts च against क distractors, which is the "words from क and च" that was
            # asked for. Its four च words, and two of its four क words, are art and clips this
            # lesson ALREADY ships (कौआ is the cover crow); only कमल and कबूतर are new pictures.
            # Its three REFILL balloons are words from elsewhere in the lesson rather than three
            # more new क images: dist has ~100 KB of headroom and five new pictures do not fit.
            # Written up in CHANGES.md - if the क/च set has to hold through the refills as well,
            # that is three more images plus a bitrate drop to pay for them.
            "levels": [
                {"target_sound": "प",
                 "items": [_bit("पतंग",  "obj_patang",  "vo_w_patang",  True),
                           _bit("आम",    "obj_aam",     "vo_w_aam",     False),
                           _bit("पपीता", "obj_papita",  "vo_w_papita",  True),
                           _bit("केला",  "obj_kela",    "vo_w_kela",    False),
                           _bit("पत्ता",  "obj_patta",   "vo_w_patta",   True),
                           _bit("घर",    "obj_ghar",    "vo_w_ghar",    False),
                           _bit("पानी",  "obj_pani",    "vo_w_pani",    True),
                           _bit("मछली",  "obj_machhli", "vo_w_machhli", False)],
                 "spares": [_bit("माला", "obj_mala", "vo_w_mala", False),
                            _bit("मूली", "obj_muli", "vo_w_muli", False),
                            _bit("लाल",  "obj_laal", "vo_w_laal", False)]},
                {"target_sound": "च",
                 "audio": {"prompt": "vo_g1_next", "correct": "vo_g1_correct2",
                           "hint": "vo_g1_hint2", "done": "vo_g1_correct2"},
                 "items": [_bit("चूहा",   "obj_chuha",   "vo_w_chuha",   True),
                           _bit("केला",   "obj_kela",    "vo_w_kela",    False),
                           _bit("चाँद",   "obj_chand",   "vo_w_chand",   True),
                           _bit("कौआ",    "obj_kauaa",   "vo_w_kauaa",   False),
                           # [r5r] SME: "don't use chandi balloon". चम्मच replaces it - also च, art and
                           # clip already ship (page 10), so the board keeps four च targets at no cost.
                           # चाँदी now leaves the lesson entirely: this was its last use.
                           _bit("चम्मच",  "obj_chammach", "vo_w_chammach", True),
                           _bit("कमल",    "obj_kamal",   "vo_w_kamal",   False),
                           _bit("चींटी",  "obj_chinti",  "vo_w_chinti",  True),
                           _bit("कबूतर",  "obj_kabutar", "vo_w_kabutar", False)],
                 "spares": [_bit("आम",   "obj_aam",     "vo_w_aam",     False),
                            _bit("घर",   "obj_ghar",    "vo_w_ghar",    False),
                            _bit("मछली", "obj_machhli", "vo_w_machhli", False)]},
            ],
            # [r5o] the hand is GONE - two misses now lights every remaining answer instead, which a
            # single pointing hand could never do on a field of four targets.
            "allow_hand": False,
            "signal_name": "balloon_sound_first_try",
        },
    })
    # new page 16 (was page 20) — no change requested
    slides.append({
        "id": "P8", "phase": "practice", "eis": "iconic", "type": "CELEBRATION",
        "prompt_hi": VO["vo_p8_prompt"],
        "audio": {"prompt": "vo_p8_prompt"},
        "data": {},
    })

    # ── [r5z] RUNNING ORDER, stated once ──────────────────────────────────────────
    # The SME asked for two moves: the sort pair (G5D, G5) to sit just before the balloons, and the
    # न question (P4) to follow the च question (G3) "because they are similar".
    # The blocks above are left where they are - each carries the review history of its own page, and
    # cutting them apart to express an order would scatter that. The order lives HERE instead, as one
    # readable line, and the assert makes a typo a build failure rather than a missing page.
    ORDER = ["T3", "T4", "T5", "T6", "T1", "T2",   # 1-6   teach: sentence, letter, x3
             "G2", "P1", "P7",                      # 7-9   the three tap-the-words pages together
             "G3", "P4",                            # 10-11 the two "which sound repeats?" questions
             "G5D", "G5",                           # 12-13 watch the sort, then do the sort
             "G1",                                  # 14    balloons
             "P8"]                                  # 15    celebration
    _by_id = {s["id"]: s for s in slides}
    assert len(_by_id) == len(slides), "duplicate slide id"
    assert set(_by_id) == set(ORDER), "ORDER does not match the slides built: %s" % (
        sorted(set(_by_id) ^ set(ORDER)),)
    slides = [_by_id[i] for i in ORDER]

    # ── assets: reference-driven, so a dropped slide cannot leave an orphan behind ──────────
    audio_ids, image_ids = set(), set()

    def walk(node):
        if isinstance(node, dict):
            for k, v in node.items():
                if k in ("img", "picture_img", "cover_img") and isinstance(v, str):
                    image_ids.add(v)
                elif k == "audio" and isinstance(v, str):
                    audio_ids.add(v)
                elif k in ("whole_audio", "letter_audio", "matra_audio", "picture_sfx") and isinstance(v, str):
                    audio_ids.add(v)
                elif k == "audio" and isinstance(v, dict):
                    audio_ids.update(x for x in v.values() if isinstance(x, str))
                else:
                    walk(v)
        elif isinstance(node, list):
            for x in node:
                walk(x)

    landing_hero = {
        # [r4 · rows 7-14] deck page 1. The heading and the प/च/म strip are gone ("avoid showing
        # multiple unrelated letters, as this may confuse the learner about the target sound") and
        # the landing now DEMONSTRATES the idea it is about: one line, its repeated sound lit in
        # every word, and the crow the line describes.
        "kind": "sentence_sound",
        "hide_title": True,
        # [r6l] `words`, `target_sound` and `mark_bare` are GONE with the demo sentence. They
        # described "काला कौआ काँव-काँव करता" and the क inside it, which the new cover line does not
        # say - and they were already inert on screen, because r6e's cover artwork replaces the word
        # strip. Leaving them would not have been merely untidy: the engine builds one karaoke cue
        # per word, findTok cannot find a word the clip never speaks, and the -1 fallback CLAMPS each
        # one to a position instead of dropping it - which pushes the crow's own cue later and later
        # through `from`. With them gone the crow cue searches from 0 and lands on the line's only
        # ध्वनि (token 8 of 14, 57% in), which is exactly where the voice names it.
        # the timeline is read off this clip, so every beat lands when its own word is spoken
        "sync_audio": "vo_landing",
        # [r6l] The `light` cue went with the strip it lit - there is no .lh-strip under the cover
        # artwork, and its own anchor was the bare क the new line does not contain. The crow stays:
        # it is the one cue with something to do, and the board it lands on is painted, not built.
        "cues": [{"at": "ध्वनि", "do": "crow"}],
        # [r6e] SME artwork for the cover: one painted board carrying the title and the crow, fitted
        # to the card. The word strip and the crow element are NOT rendered when this is set - both are
        # already in the painting. picture_img / picture_emoji stay declared because picture_sfx still
        # fires on the crow's cue, and the emoji is the no-art fallback the engine expects beside it.
        "cover_img": "cover_hero",
        "picture_img": "obj_kauaa",
        "picture_emoji": EMOJI["obj_kauaa"],
        "picture_sfx": "sfx_kanv",
        # [r5p] SME: "the voice of crow should play 2 times". The line the cover reads is
        # "काँव-काँव" - two calls - and the trimmed recording holds one, so the sound contradicted
        # the sentence on the one page whose subject IS that sound. The count lives here rather
        # than in the engine because it belongs to this line; the engine spaces the repeats by the
        # clip's own audio_dur.
        "picture_sfx_times": 2,
    }

    card = {
        "version": "0.1",
        "skill_code": CODE,
        "lo_code": "HI02H11_L01",
        "grade": "02",
        "attribute": "H11",
        "skill_type": "CORE",
        "part_label": "",
        "medium": "hi",
        "title": {"hi": "बार-बार आने वाली ध्वनि",
                  "en": "Recognise the repeated letter-sound in a line"},
        "subtitle_hi": "",
        "theme": "toybox",
        "skill_description_hi": "सुनी या पढ़ी गई पंक्ति/वाक्य में बार-बार आने वाले वर्ण या ध्वनि को पहचानता है — "
                                "जैसे 'पीतल के पतीले में पपीता पीला-पीला'।",
        "landing_audio": "vo_landing",
        "landing_hero": landing_hero,
        "phase_transition_audio": {"tutorial": "vo_pt_tutorial", "guided": "vo_pt_guided",
                                   "practice": "vo_pt_practice"},
        "phase_transition_title": {"tutorial": "चलो, शुरू करें!", "guided": "साथ में करें।",
                                   "practice": "अब तुम्हारी बारी।"},
        "scaffold_rules": {"nudge_timeout_ms": {"guided": 6000, "practice": 8000},
                           "max_attempts": 2},
        "slides": slides,
    }

    walk(slides)
    walk(landing_hero)
    audio_ids.add("vo_landing")
    audio_ids.update(card["phase_transition_audio"].values())

    # phase_distribution is DERIVED, never typed: the build/validator invariant is that it sums to
    # len(slides), and four slides were deleted this round. Typing it is how that invariant breaks.
    dist = {}
    for s in slides:
        dist[s["phase"]] = dist.get(s["phase"], 0) + 1
    card["phase_distribution"] = dist
    assert sum(dist.values()) == len(slides)

    card["signals_expected"] = [
        "slide_entered", "slide_completed", "sound_found",
        "tap_all_sound_first_try", "sentence_sound_first_try", "sentence_sound_demo",
        "sound_sort_first_try", "sound_position_first_try",
        "balloon_sound_first_try",          # [r4] the new mechanic's own signal
        "answer_wrong", "hint_shown", "answer_revealed",
        "phase_transition", "mastery_score", "lesson_completed",
    ]
    card["_emoji_fallback"] = {k: EMOJI[k] for k in sorted(image_ids) if k in EMOJI}
    card["assets"] = {
        "audio": {a: "assets/Audio/%s.ogg" % a
                  for a in sorted(audio_ids | set(INHERITED_AUDIO) | set(SFX_TO_RECORD))},
        "audio_text": {a: VO[a] for a in sorted(audio_ids) if a in VO},
        "image": {i: "assets/Images/%s.png" % i for i in sorted(image_ids)},
        "audio_ext": "ogg",
        "img_ext": "png",
    }
    # WHEN the voice is actually sounding, per clip - see the SPEECH SEGMENTS note above. Only the
    # clips that pause are listed; for the rest the engine's plain wall-clock walk is already right.
    _spm = speech_map(OUT, set(card["assets"]["audio"]))
    if _spm:
        card["assets"]["audio_speech"] = _spm
    # HOW LONG each clip runs. The engine's one-by-one option reveal advances on a per-clip safety
    # net so a missing file can never stall the page, and that net was a flat 4.5s - shorter than
    # this lesson's two 5.05s question prompts, which were therefore CUT and had the next clip
    # started over them. With the real length in hand the net can be sized to the clip.
    _dur = {}
    for _a in sorted(card["assets"]["audio"]):
        _p = os.path.join(OUT, "assets", "Audio", "%s.ogg" % _a)
        _s = _clip_seconds(_p) if os.path.exists(_p) else None
        if _s:
            _dur[_a] = round(_s, 2)
    if _dur:
        card["assets"]["audio_dur"] = _dur

    # Fail loudly rather than shipping a silent beat where a line was meant to be: every clip a
    # slide references must either have a script here or be one of the inherited/sfx assets.
    missing = sorted(a for a in audio_ids if a not in VO and a not in INHERITED_AUDIO
                     and a not in SFX_TO_RECORD)
    assert not missing, "audio ids referenced by a slide but not scripted in VO: %s" % missing
    return card


# ══════════════════════════════════════════════════════════════════════════════════════════
#  SPEECH SEGMENTS — what the karaoke highlighting needs in order to actually stay in step.
#
#  karaokePlay spreads a line's tokens across the clip's duration in proportion to akshara
#  weight. That silently assumes the voice speaks CONTINUOUSLY, and it does not: vo_landing is
#  14.97s of which only 11.21s is speech. The other 3.76s is pauses at its four dandas and its
#  em-dash. Wall-clock keeps running through a pause while the token walk keeps advancing, so the
#  highlight drifts AHEAD of the voice — by up to ~2.4s late in that line, which is the "does not
#  sync with the VO" the SME reported.
#
#  There is no forced aligner in this toolchain, so we cannot know which word is spoken when. But
#  we can measure exactly WHEN THE VOICE IS SOUNDING, which removes the whole pause error: the
#  engine advances the walk only while speech is present and holds it still through a pause.
#  Within a run of speech the uniform-rate assumption survives, and it is a far better one.
#
#  Measured here rather than in the browser because the browser cannot see inside the clip, and
#  measured in pure Python because ffmpeg is not on the build path.
# ══════════════════════════════════════════════════════════════════════════════════════════
SPEECH_NOISE_DB = -38.0      # same floor ffmpeg's silencedetect uses in this bundle's tooling
SPEECH_MIN_SIL  = 0.10       # a gap shorter than this is articulation, not a pause
SPEECH_FRAME    = 0.010


def _wav_mono16(path):
    """(samples, rate) for a 16-bit PCM WAV, else (None, 0).

    Only build-stage WAV is read: gen_tts writes RIFF under an .ogg name and the dist step is what
    re-encodes to Opus, so this sees the uncompressed original. A clip we cannot decode simply
    yields no segments and the engine falls back to its old wall-clock timing.
    """
    import array
    d = io.open(path, "rb").read()
    if d[:4] != b"RIFF":
        return None, 0
    i, rate, bits, ch = 12, 0, 16, 1
    while i + 8 <= len(d):
        cid = d[i:i + 4]
        n = int.from_bytes(d[i + 4:i + 8], "little")
        if cid == b"fmt ":
            ch   = int.from_bytes(d[i + 10:i + 12], "little")
            rate = int.from_bytes(d[i + 12:i + 16], "little")
            bits = int.from_bytes(d[i + 22:i + 24], "little")
        elif cid == b"data":
            if bits != 16 or not rate:
                return None, 0
            a = array.array("h")
            a.frombytes(d[i + 8:i + 8 + (n - (n % 2))])
            if ch > 1:
                a = array.array("h", a[::ch])       # take one channel, not a mixdown
            return a, rate
        i += 8 + n + (n & 1)
    return None, 0


def _speech_segments(path):
    """[[start, end], ...] seconds where the clip is sounding, plus its duration."""
    import math
    a, rate = _wav_mono16(path)
    if not a or not rate:
        return None, 0.0
    fl  = max(1, int(rate * SPEECH_FRAME))
    thr = (10.0 ** (SPEECH_NOISE_DB / 20.0)) * 32768.0
    try:                                   # audioop is C-speed; gone in 3.13, so never required
        import warnings
        with warnings.catch_warnings():    # it is deprecated, and the fallback below covers its loss
            warnings.simplefilter("ignore", DeprecationWarning)
            import audioop
        raw = a.tobytes()
        loud = [audioop.rms(raw[s * 2:(s + fl) * 2], 2) >= thr
                for s in range(0, len(a) - fl + 1, fl)]
    except Exception:
        loud = []
        for s in range(0, len(a) - fl + 1, fl):
            acc = 0
            for v in a[s:s + fl]:
                acc += v * v
            loud.append(math.sqrt(acc / fl) >= thr)
    dur  = len(a) / float(rate)
    need = int(round(SPEECH_MIN_SIL / SPEECH_FRAME))
    segs, i, n = [], 0, len(loud)
    while i < n:
        if not loud[i]:
            i += 1
            continue
        j = i
        while j < n:
            if loud[j]:
                j += 1
                continue
            k = j
            while k < n and not loud[k]:
                k += 1
            if (k - j) < need and k < n:   # too short to be a pause - keep walking
                j = k
                continue
            break
        segs.append([round(i * SPEECH_FRAME, 3), round(min(dur, j * SPEECH_FRAME), 3)])
        i = j
    return (segs or None), round(dur, 3)


def speech_map(out_dir, audio_ids):
    """{id: [[start, end], ...]} for every clip we can measure — the card's audio_speech block.

    Clips whose whole body is one unbroken run of speech are LEFT OUT: for those the engine's
    existing wall-clock timing is already correct, and carrying them would grow the card for
    nothing. Only clips that actually pause need describing.
    """
    out = {}
    for aid in sorted(audio_ids):
        p = os.path.join(out_dir, "assets", "Audio", "%s.ogg" % aid)
        if not os.path.exists(p):
            continue
        segs, dur = _speech_segments(p)
        if not segs:
            continue
        speech = sum(e - s for s, e in segs)
        # one segment covering essentially the whole clip tells the engine nothing new
        if len(segs) == 1 and speech >= 0.95 * dur:
            continue
        out[aid] = segs
    return out


# ══════════════════════════════════════════════════════════════════════════════════════════
#  BARE-SOUND GUARD — the one regression this card cannot catch by reading itself.
#
#  vo_snd_ch/l/r are BARE aksharas on disk (0.38-0.41s), but their VO text above still reads the
#  carrier phrase "<letter> से <word>", because that text doubles as the human VO team's recording
#  script. So the card DESCRIBES a phrase while the disk HOLDS a letter, on purpose.
#
#  That gap is a trap: `gen_tts --force` re-synthesises every clip FROM assets.audio_text, which
#  turns these three back into 1.5-2.2s phrases and silently undoes the SME's page-9 ruling —
#  "play only these च, ल, र sound not more than that". Nothing downstream would notice: the ids
#  still resolve, the clips still play, and the receipt still reports every line as having real
#  audio, because it counts files rather than listening to them.
#
#  So measure the clips instead of trusting the text. A bare akshara runs ~0.4s and a carrier
#  phrase ~1.5s or more, so the two are nearly four times apart and 0.8s sits in open space
#  between them — wide enough that a slower take or a different voice will not trip it.
# ══════════════════════════════════════════════════════════════════════════════════════════
BARE_SOUND_IDS = ("vo_snd_ch", "vo_snd_l", "vo_snd_r",
                  "vo_ltr_ch", "vo_ltr_l", "vo_ltr_r", "vo_ltr_p", "vo_ltr_m", "vo_ltr_n")
# [r5x] 0.8 -> 1.6. The threshold has to separate "a bare अक्षर" from "the लेटर से शब्द carrier",
# and 0.8 was really measuring "spoken by the TTS". The human delivery says one letter in
# 0.84-1.36s and the carrier phrase in 2.24-2.36s, so the two populations are far apart and the
# discriminator belongs between them, not below both. At 1.6 the guard still catches the exact
# regression it was written for - it caught vo_snd_ch's 2.36s carrier in this very delivery -
# while no longer failing a correct human take for being human.
BARE_SOUND_MAX_SEC = 1.6


def _clip_seconds(path):
    """Length of a build-stage clip, stdlib only — ffprobe is not on the build path.

    Both containers turn up here: gen_tts writes RIFF/WAV under an .ogg name and only the dist
    step re-encodes to real Opus, so build/ is mostly WAV. An unrecognised container returns
    None, and the caller treats that as "cannot tell" rather than guessing a number.
    """
    with io.open(path, "rb") as f:
        data = f.read()
    if data[:4] == b"RIFF":
        # Walk the chunks rather than assuming a 44-byte header, so a WAV carrying a LIST or
        # fact chunk reports its real length instead of a slightly wrong one.
        i, byte_rate = 12, 0
        while i + 8 <= len(data):
            cid = data[i:i + 4]
            n = int.from_bytes(data[i + 4:i + 8], "little")
            if cid == b"fmt ":
                byte_rate = int.from_bytes(data[i + 16:i + 20], "little")
            elif cid == b"data":
                return n / byte_rate if byte_rate else None
            i += 8 + n + (n & 1)
        return None
    if data[:4] == b"OggS":
        # Opus counts its granule at 48 kHz whatever the input rate was; the last page carries
        # the running total, and pre-skip is decoder priming that is never heard.
        h = data.find(b"OpusHead")
        skip = int.from_bytes(data[h + 10:h + 12], "little") if h >= 0 else 0
        last = data.rfind(b"OggS")
        if last < 0 or last + 14 > len(data):
            return None
        gran = int.from_bytes(data[last + 6:last + 14], "little", signed=True)
        return max(0.0, (gran - skip) / 48000.0)
    return None


def check_bare_sounds(out_dir):
    """Refuse to finish a build in which a bare letter sound has grown back into its phrase."""
    regressed, unreadable = [], []
    for a in BARE_SOUND_IDS:
        p = os.path.join(out_dir, "assets", "Audio", "%s.ogg" % a)
        if not os.path.exists(p):
            continue                 # a missing clip is the receipt's VO-coverage row to report
        sec = _clip_seconds(p)
        if sec is None:
            unreadable.append(a)
        elif sec > BARE_SOUND_MAX_SEC:
            regressed.append("%s = %.2fs" % (a, sec))
    if regressed:
        raise AssertionError("\n".join([
            "BARE-SOUND REGRESSION — %s." % ", ".join(regressed),
            '        These ids must hold the bare akshara, not the full "<letter> से <word>"',
            "        carrier. The usual cause is `gen_tts --force`, which rebuilds them from",
            "        assets.audio_text — still the carrier phrase, because it doubles as the",
            "        human VO team's recording script. Restore the clips from git and re-run",
            "        gen_tts WITHOUT --force. The ruling being undone is the SME's on page 9;",
            "        see CHANGES.md.",
        ]))
    if unreadable:
        print("  !!  bare-sound guard could not read: %s" % ", ".join(unreadable))
    else:
        print("  ok  bare letter sounds still bare (%d clips under %.1fs)"
              % (len(BARE_SOUND_IDS), BARE_SOUND_MAX_SEC))

def check_clip_lengths(out_dir, card):
    """Flag any clip too short to CONTAIN the line the card says it speaks.

    This is the companion to the bare-sound guard, and it exists because two real defects reached
    a reviewer's ears in r5d:

      * vo_landing still held the ROUND-3 line. The r4 re-record list named 20 ids whose text had
        changed, but gen_tts skips an id whose file already exists, so a run WITHOUT --force
        silently left every one of them on the old take.
      * vo_p1_try held a PARTIAL take — 1.45s of a line needing ~4s, the model having obeyed the
        trailing imperative and spoken only part. Its near-twin vo_p7_try runs 3.97s.

    Neither was visible to the receipt, whose "every line has real audio" row counts FILES. A file
    was present in both cases; it just said the wrong thing.

    The floor is gen_tts's own min_pcm_bytes rule (~14 Devanagari chars/sec, required at 55% of
    that). It is deliberately generous — it catches a clip that cannot possibly hold its line, not
    one that merely sounds rushed — so a failure here is a real defect, never a judgement call.
    """
    text = (card.get("assets") or {}).get("audio_text") or {}
    short, missing, stale = [], [], []
    for aid, line in sorted(text.items()):
        if aid in BARE_SOUND_IDS:
            continue            # their text is a placeholder by design - the other guard owns them
        n = len((line or "").strip())
        if not n:
            continue
        p = os.path.join(out_dir, "assets", "Audio", "%s.ogg" % aid)
        if not os.path.exists(p):
            missing.append(aid)
            continue
        sec = _clip_seconds(p)
        if sec is None:
            continue            # unreadable container - not something to fail a build over
        floor = max(0.3, 0.55 * (n / 14.0))
        if sec < floor:
            short.append("%s = %.2fs (needs >=%.2fs for %d chars)" % (aid, sec, floor, n))
        # [r6l] ...and the same arithmetic run the other way. n/14 is this guard's own estimate of
        # how long the line SHOULD take; 2.5x that is generous enough to absorb a slow reading and
        # every danda pause (vo_landing's old take was 16.9s against a 12.1s estimate, i.e. 1.4x, and
        # was correct), while still catching a clip carrying a line that is no longer there.
        elif sec > 2.5 * max(1.0, n / 14.0):
            stale.append("%s = %.2fs for a %d-char line (~%.1fs expected)" % (aid, sec, n, n / 14.0))
    if stale:
        print("  !!  STALE TAKE? %d clip(s) far longer than their line needs:" % len(stale))
        for t in stale:
            print("        " + t)
        print("      Each of these is a clip that was recorded for a DIFFERENT, longer line. The")
        print("      guard above catches a clip too short to hold its text; this is the other half,")
        print("      and it is the case that actually happened twice on this lesson - a line was")
        print("      re-scripted and the recording was not, so the card and the audio disagreed with")
        print("      nothing to show for it. A WARNING and not a failure: real speech has pauses, and")
        print("      a line written short but read slowly is not a defect. Listen before re-recording.")
    if short:
        raise AssertionError("\n".join([
            "CLIP TOO SHORT FOR ITS LINE — %d clip(s):" % len(short)]
            + ["          " + s for s in short]
            + ["        Either the clip is a PARTIAL take, or the card's text was rewritten and the",
               "        clip was never re-recorded (gen_tts skips existing files unless you pass",
               "        --force). Re-run gen_tts --force --only <id> for each, then listen to it."]))
    if missing:
        print("  !!  no clip on disk for: %s" % ", ".join(missing))
    print("  ok  every authored line has a clip long enough to contain it (%d checked)"
          % (len([a for a in text if a not in BARE_SOUND_IDS and (text[a] or '').strip()]) - len(missing)))

def check_speech_map(out_dir, card):
    """The card's speech map must describe the audio sitting next to it.

    This catches a DELIVERY that has drifted from the build it claims to be. It was written after
    exactly that: 40 clips in the handover's build/ turned out to be different takes from the
    factory's, so the card shipped a speech map measured against audio the player would never hear,
    and the marking would have been keyed to pauses that were not there. Segments running past the
    end of the clip is the cheap, unambiguous symptom.
    """
    segs_by_id = (card.get("assets") or {}).get("audio_speech") or {}
    wrong = []
    for aid, segs in sorted(segs_by_id.items()):
        p = os.path.join(out_dir, "assets", "Audio", "%s.ogg" % aid)
        if not os.path.exists(p):
            wrong.append("%s: described but not present" % aid)
            continue
        dur = _clip_seconds(p)
        if dur is None:
            continue
        if any(e <= s for s, e in segs):
            wrong.append("%s: a segment does not advance" % aid)
        elif any(segs[i][0] < segs[i - 1][1] for i in range(1, len(segs))):
            wrong.append("%s: segments overlap" % aid)
        elif segs[-1][1] > dur + 0.05:
            wrong.append("%s: speech map ends at %.2fs but the clip is %.2fs"
                         % (aid, segs[-1][1], dur))
    if wrong:
        raise AssertionError("\n".join([
            "SPEECH MAP DOES NOT MATCH THE AUDIO — %d clip(s):" % len(wrong)]
            + ["          " + w for w in wrong]
            + ["        The card was built against different audio than the bundle now holds. Copy the",
               "        intended clips in and rebuild, so assets.audio_speech is measured from what",
               "        actually ships - the karaoke marking is timed off these numbers."]))
    print("  ok  speech map matches the audio on disk (%d clips described)" % len(segs_by_id))


def main():
    # ENGINE GUARD — FLN guards through unified_build (engine_guard is the maths-side module and is
    # not importable here). Under the isolation shim this resolves to THIS GAME's engine_local copy.
    unified_build.require_current_engine()
    card = build_card()
    unified_build.build_bundle(card, OUT, html_name="%s.html" % CODE)
    check_bare_sounds(OUT)
    check_clip_lengths(OUT, card)
    check_speech_map(OUT, card)
    print("  OK  %s — %d slides  %s" % (CODE, len(card["slides"]), card["phase_distribution"]))
    print("      audio ids: %d   images: %d"
          % (len(card["assets"]["audio"]), len(card["assets"]["image"])))


if __name__ == "__main__":
    main()
