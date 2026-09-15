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
    # [r4 · row 15] verbatim from deck page 1, "Final VO"
    "vo_landing": "नमस्ते दोस्त! मैं हूँ Swiftee। आज हम जानेंगे कि वाक्य में कौन-सी ध्वनि बार-बार सुनाई देती है। "
                  "सुनो—काला कौआ काँव-काँव करता। इस वाक्य में क की ध्वनि यानी आवाज़ बार-बार आ रही है।",

    # ---- the sentences ------------------------------------------------------------------
    "vo_line_l1": "पीतल के पतीले में पपीता पीला-पीला।",
    "vo_line_l2": "चूहे ने चार चने चबाए।",          # [r4 · row 16] was "चूहा चार चने चबाए"
    "vo_line_l3": "मेरे मामा मीठी मलाई लाए।",        # [r4 · row 30] was "मामा मीठी मलाई लाए"
    "vo_line_l6": "नानी नई नाव लाई।",                # [r4 · row 99] NEW — replaces the old ल-trap line

    # ---- teach: sentence pages ----------------------------------------------------------
    # [r4 · rows 46/47] deck page 6 asks for VO 2 and VO 3 as SEPARATE beats, so the old single
    # vo_t1_explain is split: the words are named while प lights up in each of them, and only
    # then does the conclusion play.
    "vo_t1_words":   "पीतल, पतीले, पपीता, पीला।",
    "vo_t1_explain": "इन सब शब्दों में प की आवाज़ बार-बार आई।",
    "vo_t3_explain": "चूहे, चार, चने, चबाए—इन सब शब्दों में च की आवाज़ बार-बार आई।",   # [r4 · row 22]
    "vo_t5_explain": "मेरे, मामा, मीठी, मलाई—इन सब शब्दों में म की आवाज़ बार-बार आई।",  # [r4 · row 36]

    # ---- teach: meet-the-letter pages ---------------------------------------------------
    # [r4 · rows 52/28/38] all three re-scripted to the deck's "Final VO", which now also carries
    # the example word — that word is the cue the letter-highlight is timed to.
    "vo_t2_prompt": "हमने प की आवाज़ सुनी। यह आवाज़ प अक्षर से लिखी जाती है। जैसे—प से पपीता।",
    "vo_t4_prompt": "हमने च की आवाज़ सुनी। यह आवाज़ च अक्षर से लिखी जाती है। जैसे—च से चूहा।",
    "vo_t6_prompt": "हमने म की आवाज़ सुनी। यह आवाज़ म अक्षर से लिखी जाती है। जैसे—म से मूली।",

    # ---- guided 1 · balloons (deck page 8) ----------------------------------------------
    # [r4 · rows 55/60/62] VERBATIM from the deck. NOTE these three lines are AAP («कीजिए»,
    # «सुनिए») while every other line in the lesson is TUM. That is the deck's own wording and
    # the reviewer's phrasing is authoritative, so it is preserved — flagged as OPEN-4.
    "vo_g1_prompt":  "प की आवाज़ वाले चित्र पर टैप कीजिए।",
    "vo_g1_correct": "शाबाश! इसमें प की आवाज़ है।",
    "vo_g1_hint":    "ध्यान से सुनिए, इसमें प की आवाज़ नहीं है।",

    # ---- guided 2 · tap-all प (deck page 9) ---------------------------------------------
    "vo_g2_prompt": "जिन शब्दों में प की आवाज़ सुनाई दे, उन पर टैप करो।",
    "vo_g2_hint":   "हर शब्द को ध्यान से देखो और सुनो। किस शब्द में प की आवाज़ आ रही है?",   # [r4 · row 72]
    "vo_g2_try":    "इस शब्द की शुरुआत में प की आवाज़ नहीं है। एक बार फिर सुनो।",
    "vo_g2_reveal": "सुनो — इसमें प की आवाज़ है।",
    "vo_g2_done":   "शाबाश! तुमने प की आवाज़ वाले सारे शब्द खोज लिए।",

    # ---- guided 3 · which sound repeats (deck page 10) ----------------------------------
    "vo_g3_prompt":  "ध्यान से सुनो — इस वाक्य में कौन-सी आवाज़ बार-बार आई?",
    "vo_g3_try":     "यह च की आवाज़ नहीं है।",                          # [r4 · row 79] Hint 1, verbatim
    "vo_g3_reveal":  "ध्यान से देखो, सही जवाब च है।",                    # [r4 · row 80] Hint 2, verbatim
    "vo_g3_correct": "चूहे, चार, चने, चबाए — इन सब शब्दों में च की आवाज़ बार-बार आई।",   # [r4 · row 82]
    "vo_g3_hint":    "हर शब्द की शुरू की आवाज़ पर ध्यान दो।",

    # ---- guided 5 · sort प vs च (deck page 12) ------------------------------------------
    "vo_g5_prompt": "हर चित्र का नाम सुनो और उसे सही टोकरी में डालो।",     # [r4 · row 85]
    # CONSEQUENCE of row 83: the bins stopped being «प है / प नहीं है» and became «प / च», so a
    # hint that asks a yes-no question about प no longer fits the board it is hinting about.
    # Re-pointed at the two-way choice; logic and progression untouched, per the deck's "keep the
    # existing hint logic". Listed under CHANGED BEYOND THE DECK.
    "vo_g5_hint":    "शब्द बोलो और सुनो — उसमें प की आवाज़ है या च की?",
    "vo_g5_try":     "यह टोकरी सही नहीं है। शब्द की आवाज़ फिर सुनो।",
    "vo_g5_correct": "बहुत बढ़िया! सही टोकरी।",

    # ---- practice 1 · tap-all म (deck page 13) ------------------------------------------
    "vo_p1_prompt": "जिन शब्दों में म की आवाज़ सुनाई दे, उन पर टैप करो।",
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
    "vo_p4_prompt": "ध्यान से सुनो — कौन-सी आवाज़ शब्दों की शुरुआत में बार-बार आई?",
    "vo_p4_hint":   "शब्द के अंत की आवाज़ नहीं — शुरुआत की आवाज़ सुनो।",
    "vo_p4_try":    "तुमने आखिरी आवाज़ सुनी। हमें वह आवाज़ ढूँढनी है जो पूरे वाक्य में बार-बार आई है।",
    # CONSEQUENCE of row 99: the target sound on this page changed from प to न, so the two clips
    # that NAME the answer had to follow it. The hint ladder itself is untouched (row 103).
    "vo_p4_reveal":  "शुरुआत में न की आवाज़ बार-बार आई।",
    "vo_p4_correct": "सही! शुरुआत में न की आवाज़ थी।",

    # ---- practice 7 · tap-all च (deck page 19) ------------------------------------------
    "vo_p7_prompt": "जिन शब्दों में च की आवाज़ सुनाई दे, उन पर टैप करो।",
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

    # ---- object names (tap-to-hear) --------------------------------------------------------
    "vo_w_aam": "आम", "vo_w_champa": "चंपा", "vo_w_chandi": "चाँदी", "vo_w_chuha": "चूहा",
    "vo_w_laal": "लाल", "vo_w_mala": "माला", "vo_w_mama": "मामा", "vo_w_muli": "मूली",
    "vo_w_pani": "पानी", "vo_w_papita": "पपीता", "vo_w_payal": "पायल", "vo_w_sapna": "सपना",
    # [r4] new options the deck introduced
    "vo_w_patang": "पतंग", "vo_w_patta": "पत्ता", "vo_w_kela": "केला",
    "vo_w_ghar": "घर", "vo_w_machhli": "मछली",
    "vo_w_chand": "चाँद",      # [r4 · row 104] deck says चाँद, the old clip said चंदा
    "vo_w_chinti": "चींटी",     # [r4 · rows 89/104] deck says चींटी, the old clip said चींटा

    "vo_try_again": "एक बार फिर सुनो।",
}

# Copied in by the kit / inherited — never recorded for this lesson.
INHERITED_AUDIO = ["vo_pt_tutorial", "vo_pt_guided", "vo_pt_practice",
                   "sfx_celebrate", "sfx_correct", "sfx_wrong", "sfx_tap", "sfx_pop"]
# [r4 · row 13] "A small काँव-काँव sound effect can play when the crow appears, if suitable."
# Needs a real recording; until one lands the landing simply stays silent at that beat (playSfx
# no-ops on a missing file), which is the right failure — never a synthesized bird.
SFX_TO_RECORD = ["sfx_kanv"]

# ══════════════════════════════════════════════════════════════════════════════════════════
#  OBJECT ART
# ══════════════════════════════════════════════════════════════════════════════════════════
EMOJI = {
    "obj_aam": "🥭", "obj_champa": "🌼", "obj_chand": "🌙", "obj_chandi": "🪙", "obj_chinti": "🐜",
    "obj_chuha": "🐭", "obj_ghar": "🏠", "obj_kauaa": "🐦‍⬛", "obj_kela": "🍌", "obj_laal": "🔴",
    "obj_machhli": "🐟", "obj_mala": "📿", "obj_mama": "👨", "obj_muli": "🥕", "obj_pani": "💧",
    "obj_papita": "🍈", "obj_patang": "🪁", "obj_patta": "🍃", "obj_payal": "💍", "obj_sapna": "💭",
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
                    {"at": "लिखी", "do": "pic"},      # "...अक्षर से लिखी जाती है।"
                    {"at": "जैसे", "do": "label"},    # "जैसे—<letter> से <word>।"
                    {"at": cue_word, "do": "mark"},   # the example word itself
                ]
            },
        },
    }


def tap_all(sid, phase, sound, prompt, items, clips):
    return {
        "id": sid, "phase": phase, "eis": "iconic", "type": "TAP_ALL_WITH_SOUND",
        "prompt_hi": prompt,
        "audio": clips,
        "data": {"target_sound": sound, "items": items,
                 "reveal_seq": True, "signal_name": "tap_all_sound_first_try"},
    }


def sort_two(sid, phase, prompt, bins, items, clips, signal):
    return {
        "id": sid, "phase": phase, "eis": "enactive", "type": "SORT_VACHAN",
        "prompt_hi": prompt,
        "audio": clips,
        "data": {"bins": bins, "items": items, "reveal_seq": True, "signal_name": signal},
    }


def pick_sound(sid, phase, prompt, words, whole, sound, options, clips):
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
        "T3", ["चूहे", "ने", "चार", "चने", "चबाए।"], "vo_line_l2", "च", "vo_snd_ch",
        mark_bare=True,      # [r4e] "highlight only च - no matra"
        hide_replay=True,    # [r4f] "remove the फिर सुनो button"
        # [r4f] EXACTLY TWO CLIPS ON THIS PAGE, per review: VO 1 the sentence, a brief pause, VO 2 the
        # explanation. The letter card still arrives on its own beat but is now SILENT - which means
        # this page no longer satisfies the deck's own "play only the च sound" for row 21. The later
        # instruction wins; the conflict is written up in CHANGES.md so the SME can see it.
        seq=[
            {"step": "sentence"},                 # VO 1, word-by-word in step with the line
            {"step": "clear_words"},              # "After the sentence is completed, remove the
                                                  #  word-level highlighting."
            {"step": "pause", "ms": 900},         # "a brief pause ... a moment to notice"
            {"step": "letter", "silent": True},   # the letter appears; nothing is spoken
            {"step": "mark", "audio": "vo_t3_explain",
             "words": ["चूहे", "चार", "चने", "चबाए।"]},   # VO 2
        ]))
    # new page 3 (was page 5) — च; the ant is gone, the mouse the sentence is ABOUT takes its place
    slides.append(meet_letter("T4", "च", "चूहा", "obj_chuha",
                              "vo_t4_prompt", "vo_w_chuha", "vo_snd_ch", cue_word="चूहा"))
    # new page 4 (was page 6) — म
    slides.append(teach_sentence(
        "T5", ["मेरे", "मामा", "मीठी", "मलाई", "लाए।"], "vo_line_l3", "म", "vo_snd_m",
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
            {"step": "letter", "audio": "vo_snd_m"},
            # "लाए" is listed nowhere here, on purpose: "Do not highlight लाए, because it does not
            # contain the target sound म."
            {"step": "mark", "audio": "vo_t5_explain",
             "words": ["मेरे", "मामा", "मीठी", "मलाई"]},
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
        "T1", ["पीतल", "के", "पतीले", "में", "पपीता", "पीला-पीला।"], "vo_line_l1", "प", "vo_snd_p",
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
            {"step": "letter", "silent": True},
            # [r4o] ONE CLIP FOR THE MARK BEAT, so the marking is SPOKEN OVER instead of
            # running silent and being narrated afterwards. vo_t1_words.ogg has never been
            # generated (row 46), so this beat had NO audio at all: the four प lit in silence on
            # the engine fallback timeline and only THEN did vo_t1_explain speak - the SME's
            # "first it highlights all the letters then it plays the VO". Pages 2 and 4 have no
            # such seam because their ONE clip names the words and explains, with the marking
            # paced across it. Same shape here, using the clip that exists.
            # When vo_t1_words.ogg is finally produced the SME may want the two-beat script back.
            {"step": "mark", "audio": "vo_t1_explain",
             "words": ["पीतल", "पतीले", "पपीता", "पीला-पीला।"]},
        ]))
    # new page 7 (was page 3) — प
    slides.append(meet_letter("T2", "प", "पपीता", "obj_papita",
                              "vo_t2_prompt", "vo_w_papita", "vo_snd_p", cue_word="पपीता"))

    # ══ GUIDED ═════════════════════════════════════════════════════════════════════════
    # new page 8 (was page 8) — the हाँ/नहीं check is GONE; balloons replace it.
    # prompt_hi is empty and stays empty: "Do not show any written instruction on the screen."
    slides.append({
        "id": "G1", "phase": "guided", "eis": "iconic", "type": "TAP_BALLOON_SOUND",
        "prompt_hi": "",
        "audio": {"prompt": "vo_g1_prompt", "target": "vo_snd_p",
                  "correct": "vo_g1_correct", "hint": "vo_g1_hint"},
        "data": {
            "target_sound": "प",
            # the deck's own option list, correct and incorrect
            "items": [
                _item("पतंग",  "obj_patang",   "vo_w_patang",   has=True),
                _item("आम",    "obj_aam",      "vo_w_aam",      has=False),
                _item("पपीता", "obj_papita",   "vo_w_papita",   has=True),
                _item("केला",  "obj_kela",     "vo_w_kela",     has=False),
                _item("पत्ता",  "obj_patta",    "vo_w_patta",    has=True),
                _item("घर",    "obj_ghar",     "vo_w_ghar",     has=False),
                _item("पानी",  "obj_pani",     "vo_w_pani",     has=True),
                _item("मछली",  "obj_machhli",  "vo_w_machhli",  has=False),
            ],
            "signal_name": "balloon_sound_first_try",
        },
    })
    # new page 9 (was page 9) — 4 options: 2 correct, 2 not
    slides.append(tap_all(
        "G2", "guided", "प", VO["vo_g2_prompt"],
        [_item("पपीता", "obj_papita", "vo_w_papita", has=True),
         _item("केला",  "obj_kela",   "vo_w_kela",   has=False),
         _item("पतंग",  "obj_patang", "vo_w_patang", has=True),
         _item("आम",    "obj_aam",    "vo_w_aam",    has=False)],
        {"prompt": "vo_g2_prompt", "target": "vo_snd_p", "hint": "vo_g2_hint",
         "try_again": "vo_g2_try", "reveal": "vo_g2_reveal", "done": "vo_g2_done"}))
    # new page 10 (was page 10) — same sentence as the च teach page, now as a question
    slides.append(pick_sound(
        "G3", "guided", VO["vo_g3_prompt"],
        ["चूहे", "ने", "चार", "चने", "चबाए।"], "vo_line_l2", "च",
        [{"letter": "च", "audio": "vo_snd_ch"},
         {"letter": "ल", "audio": "vo_snd_l"},
         {"letter": "र", "audio": "vo_snd_r"}],
        {"prompt": "vo_g3_prompt", "target": "vo_snd_ch", "hint": "vo_g3_hint",
         "try_again": "vo_g3_try", "reveal": "vo_g3_reveal", "correct": "vo_g3_correct"}))
    # new page 11 (was page 12) — the bins become प vs च, and every option now clearly carries
    # one of the two ("मोती" had neither, so it could not belong in either basket)
    slides.append(sort_two(
        "G5", "guided", VO["vo_g5_prompt"],
        [{"gender": "S", "label": "प की आवाज़ वाला"},
         {"gender": "P", "label": "च की आवाज़ वाला"}],
        [_item("पानी",  "obj_pani",   "vo_w_pani",   gender="S"),
         _item("पायल",  "obj_payal",  "vo_w_payal",  gender="S"),
         _item("चूहा",  "obj_chuha",  "vo_w_chuha",  gender="P"),
         _item("चाँदी", "obj_chandi", "vo_w_chandi", gender="P")],
        {"prompt": "vo_g5_prompt", "target": "vo_snd_p", "hint": "vo_g5_hint",
         "try_again": "vo_g5_try", "correct": "vo_g5_correct"},
        "sound_sort_first_try"))

    # ══ PRACTICE ═══════════════════════════════════════════════════════════════════════
    # new page 12 (was page 13) — 5 options down to 4; माला leaves this page
    slides.append(tap_all(
        "P1", "practice", "म", VO["vo_p1_prompt"],
        [_item("मामा",  "obj_mama",   "vo_w_mama",   has=True),
         _item("चींटी", "obj_chinti", "vo_w_chinti", has=False),
         _item("मूली",  "obj_muli",   "vo_w_muli",   has=True),
         _item("लाल",   "obj_laal",   "vo_w_laal",   has=False)],
        {"prompt": "vo_p1_prompt", "target": "vo_snd_m", "hint": "vo_p1_hint",
         "try_again": "vo_p1_try", "reveal": "vo_p1_reveal", "done": "vo_p1_done"}))
    # new page 13 (was page 14) — UNCHANGED: the deck asks only to keep this page as it is
    slides.append(sort_two(
        "P2", "practice", VO["vo_p2_prompt"],
        [{"gender": "S", "label": "शुरुआत में"},
         {"gender": "P", "label": "बीच में"}],
        [_item("पानी",  "obj_pani",   "vo_w_pani",   gender="S"),
         _item("पायल",  "obj_payal",  "vo_w_payal",  gender="S"),
         _item("सपना",  "obj_sapna",  "vo_w_sapna",  gender="P"),
         _item("चंपा",  "obj_champa", "vo_w_champa", gender="P")],
        {"prompt": "vo_p2_prompt", "target": "vo_snd_p", "hint": "vo_p2_hint",
         "try_again": "vo_p2_try", "correct": "vo_p2_correct"},
        "sound_position_first_try"))
    # new page 14 (was page 16) — new line, new target sound (न), new third option.
    # The deck explicitly does NOT want word-by-word highlighting here ("No word-by-word
    # highlighting is required"), so this page carries no teach_seq — it is a plain question.
    slides.append(pick_sound(
        "P4", "practice", VO["vo_p4_prompt"],
        ["नानी", "नई", "नाव", "लाई।"], "vo_line_l6", "न",
        [{"letter": "म", "audio": "vo_snd_m"},
         {"letter": "ल", "audio": "vo_snd_l"},
         {"letter": "न", "audio": "vo_snd_n"}],
        {"prompt": "vo_p4_prompt", "target": "vo_snd_n", "hint": "vo_p4_hint",
         "try_again": "vo_p4_try", "reveal": "vo_p4_reveal", "correct": "vo_p4_correct"}))
    # new page 15 (was page 19) — 5 options down to 4
    slides.append(tap_all(
        "P7", "practice", "च", VO["vo_p7_prompt"],
        [_item("चाँद",  "obj_chand",  "vo_w_chand",  has=True),
         _item("माला",  "obj_mala",   "vo_w_mala",   has=False),
         _item("चींटी", "obj_chinti", "vo_w_chinti", has=True),
         _item("लाल",   "obj_laal",   "vo_w_laal",   has=False)],
        {"prompt": "vo_p7_prompt", "target": "vo_snd_ch", "hint": "vo_p7_hint",
         "try_again": "vo_p7_try", "reveal": "vo_p7_reveal", "done": "vo_p7_done"}))
    # new page 16 (was page 20) — no change requested
    slides.append({
        "id": "P8", "phase": "practice", "eis": "iconic", "type": "CELEBRATION",
        "prompt_hi": VO["vo_p8_prompt"],
        "audio": {"prompt": "vo_p8_prompt"},
        "data": {},
    })

    # ── assets: reference-driven, so a dropped slide cannot leave an orphan behind ──────────
    audio_ids, image_ids = set(), set()

    def walk(node):
        if isinstance(node, dict):
            for k, v in node.items():
                if k in ("img", "picture_img") and isinstance(v, str):
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
        "words": ["काला", "कौआ", "काँव-काँव", "करता।"],
        "target_sound": "क",
        # [r4b] mark the CONSONANT ONLY - क, not का. Spiked in the real font first: all four words
        # keep their exact advance width and the colour lands on the क alone.
        "mark_bare": True,
        # the timeline is read off this clip, so every beat lands when its own word is spoken
        "sync_audio": "vo_landing",
        # ...after the four sentence words, which are cued from `words` automatically:
        #   "क"     -> the greeting's own «इस वाक्य में क की ध्वनि…», where every क lights at once
        #   "ध्वनि" -> the crow arrives (and calls) while the sentence stays up; the VO plays on
        "cues": [{"at": "क", "do": "light"}, {"at": "ध्वनि", "do": "crow"}],
        "picture_img": "obj_kauaa",
        "picture_emoji": EMOJI["obj_kauaa"],
        "picture_sfx": "sfx_kanv",
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

    # Fail loudly rather than shipping a silent beat where a line was meant to be: every clip a
    # slide references must either have a script here or be one of the inherited/sfx assets.
    missing = sorted(a for a in audio_ids if a not in VO and a not in INHERITED_AUDIO
                     and a not in SFX_TO_RECORD)
    assert not missing, "audio ids referenced by a slide but not scripted in VO: %s" % missing
    return card


def main():
    # ENGINE GUARD — FLN guards through unified_build (engine_guard is the maths-side module and is
    # not importable here). Under the isolation shim this resolves to THIS GAME's engine_local copy.
    unified_build.require_current_engine()
    card = build_card()
    unified_build.build_bundle(card, OUT, html_name="%s.html" % CODE)
    print("  OK  %s — %d slides  %s" % (CODE, len(card["slides"]), card["phase_distribution"]))
    print("      audio ids: %d   images: %d"
          % (len(card["assets"]["audio"]), len(card["assets"]["image"])))


if __name__ == "__main__":
    main()
