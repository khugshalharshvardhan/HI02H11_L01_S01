# -*- coding: utf-8 -*-
"""Build lesson_vo_manifest.xlsx for HI02H11_L01_S01, in the house four-sheet shape.

    PYTHONUTF8=1 python gen_lesson_vo_manifest.py [bundle]      # bundle defaults to build/

The shape is the one used on HI02H11_L02_S03 (मात्राओं की रेल): a VO Manifest listing every
PLACEMENT in game order, a Recording list of the distinct takes, a Sound effects tab, and a
Recording spec. It is a better sheet than the one this lesson had - a placement list says where a
clip is heard and how often, which a deduplicated id list cannot, and the spec tab puts the format
and the register next to the lines instead of in somebody's memory.

WHAT IS DELIBERATELY NOT COPIED FROM THAT LESSON
    * the Folder line there says .ogg because that lesson is TTS and ships what it generates. This
      one is HUMAN VO: a studio delivers 16-bit WAV, intake renames into build/, and the build
      encodes Opus for dist. Writing .ogg here would ask for the wrong file.
    * the Voice line there names a TTS voice. This lesson BANS TTS - "there should be no way to
      fall back on tts, it is fine if we dont have audio" - so saying so is the useful thing.
Everything a studio acts on has to describe THIS lesson, or the sheet is worse than no sheet.
"""
import importlib.util, io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__)) or "."
_spec = importlib.util.spec_from_file_location("mm", os.path.join(HERE, "make_manifests.py"))
mm = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(mm)          # has a __main__ guard, so nothing is written on import

CARD, TEXT, DUR, CODE = mm.CARD, mm.TEXT, mm.DUR, mm.CODE
BUNDLE = mm.BUNDLE
OUT = os.path.join(BUNDLE, "assets", "Audio", "lesson_vo_manifest.xlsx")
TITLE_HI = CARD.get("title_hi") or "वाक्य में बार-बार आने वाली ध्वनि"

# ── naming ────────────────────────────────────────────────────────────────────────────────────
SCREEN = {
    ("SENTENCE_SOUND", "tutorial"): "Hear the repeated sound",
    ("SENTENCE_SOUND", "guided"):   "Which sound came again?",
    ("SENTENCE_SOUND", "practice"): "Which sound came again?",
    ("MEET_LETTER", None):          "Meet the letter",
    ("TAP_ALL_WITH_SOUND", None):   "Tap every word with that sound",
    ("SORT_VACHAN", None):          "Sort into the right box",
    ("TAP_BALLOON_SOUND", None):    "Balloon game",
    ("CELEBRATION", None):          "Well done",
}
def screen_of(sl):
    return (SCREEN.get((sl["type"], sl.get("phase")))
            or SCREEN.get((sl["type"], None)) or sl["type"].replace("_", " ").title())

WHAT = {
    "prompt": "page instruction", "whole_audio": "the sentence, read aloud",
    "target": "the sound being taught", "word_name": "the example word",
    "sound": "the letter's sound", "correct": "praise on a correct answer",
    "done": "closing line", "next": "line into the next round",
    "wrong": "nudge after a wrong answer", "try_again": "nudge after a wrong answer",
    "more": "asks for the ones still left", "reveal": "shows the answer after the last try",
    "hint": "hint", "h1": "Hint 1", "h2": "Hint 2", "h3": "Hint 3",
}
WHEN = {
    "prompt": "Page opens", "whole_audio": "Page opens - the sentence is read",
    "teach": "Page opens - the teaching sequence",
    "option": "When the child taps that letter", "item": "When the child taps that picture",
    "balloon": "When that balloon is popped", "bin": "When that box is named",
    "target": "Page opens - the teaching sequence",
    "word_name": "Page opens - the teaching sequence",
    "sound": "Page opens - the teaching sequence",
    "correct": "On the correct answer", "done": "When the page is finished",
    "next": "Between the two rounds",
    "wrong": "After a wrong try", "try_again": "After a wrong try",
    "more": "When some are still unfound", "reveal": "After the last wrong try",
    "hint": "After a wrong try", "h1": "After the 1st wrong try",
    "h2": "After the 2nd wrong try", "h3": "After the 3rd wrong try",
}

# Which transitions actually PLAY. Since r7h the peek gate is opt-in per slide (data.gate_before),
# plus the one the cover's play button fires directly. A gate the card declares but no slide asks
# for is not in the lesson and must not be sent for recording as though it were.
# The transition lines come IN with the kit - the recipe's INHERITED_AUDIO calls them "copied in by
# the kit / inherited - never recorded for this lesson" - and this lesson's studio must not be handed
# them. vo_status cannot tell: it looks for a .wav master beside the shipped clip, finds none because
# a kit clip never had one here, and reports "machine TTS - replace". Left alone that would put two
# lines nobody owns onto the recording list. The template lesson words these "Recorded (shared kit
# clip)" and that is exactly right; ours adds that they carry a local trim, because r8d took the
# leading silence off all three so Swiftie's mouth and her voice start together.
KIT_CLIPS = {"vo_pt_tutorial": "guided", "vo_pt_guided": "guided", "vo_pt_practice": "guided",
             "vo_pt_independent": "guided"}
KIT_STATUS = "delivered (shared kit clip, trimmed here) - do NOT re-record"


def script_of(aid):
    """The exact line to speak - or, for a kit clip, a note saying why there is none.

    The transition clips are inherited recordings; this lesson never scripted them, so audio_text
    has no entry. An empty cell in a column headed "speak exactly this" reads as a line someone
    forgot to write, which is how a studio ends up inventing one.
    """
    t = TEXT.get(aid)
    if t:
        return t
    if aid in KIT_CLIPS:
        return "(shared kit recording - already delivered, nothing to script or re-record)"
    return ""


def status_of(aid):
    if aid in KIT_CLIPS:
        return KIT_STATUS
    return mm.vo_status(aid, TEXT.get(aid, "") or "", DUR.get(aid))


GATE_TITLE = {"tutorial": "चलिए, शुरू करें!", "guided": "चलिए, साथ में करें!",
              "practice": "अब आपकी बारी!", "independent": "अब आपकी बारी!"}
GATE_VO = {"tutorial": "vo_pt_tutorial", "guided": "vo_pt_guided",
           "practice": "vo_pt_practice", "independent": "vo_pt_independent"}


def placements():
    """Every time a clip is heard, in game order. One row per placement, not per id."""
    rows = []   # dicts: page, screen, aid, what, when
    _on = set()
    def put(page, screen, aid, what, when):
        # ONE ROW PER CLIP PER SCREEN. A clip can fill two roles on the same page - on the sentence
        # pages `prompt` and `whole_audio` are the same recording, and the letter is both the sound
        # being taught and the option that is tapped - and listing it twice tells a reader it is two
        # takes. The first placement wins because the walk runs in play order, so it is also the
        # first time the clip is heard. Across pages it still appears once per page, which is the
        # point of the sheet.
        if not aid or (page, screen, aid) in _on:
            return
        _on.add((page, screen, aid))
        rows.append({"page": page, "screen": screen, "aid": aid, "what": what, "when": when})

    hero = CARD.get("landing_hero") or {}
    put("Start screen", "Start screen", CARD.get("landing_audio") or "vo_landing",
        "greeting and what the lesson is about", "Start screen opens, before the play button")
    put("Start screen", "Start screen", hero.get("picture_sfx"), "picture sound",
        "With the cover picture")

    # the cover's play button opens the tutorial gate directly - it is not a slide's gate_before
    put("Transition 1 (before page 1)", "Transition «चलिए, शुरू करें!»",
        GATE_VO["tutorial"], "transition line (shared kit clip)",
        "Swiftie rises, then says the line while the title writes in")

    for i, sl in enumerate(CARD.get("slides", [])):
        pg, scr = "Page %d" % (i + 1), screen_of(sl)
        d = sl.get("data") or {}
        if d.get("gate_before"):
            ph = sl.get("phase")
            rows.append({"page": "Transition %d (before page %d)" % (2, i + 1),
                         "screen": "Transition «%s»" % GATE_TITLE.get(ph, ""),
                         "aid": GATE_VO.get(ph), "what": "transition line (shared kit clip)",
                         "when": "Swiftie rises, then says the line while the title writes in"})

        def half(dd, roles, label=""):
            sfx = (" - " + label) if label else ""
            put(pg, scr + sfx, dd.get("whole_audio"), WHAT["whole_audio"], WHEN["whole_audio"])
            for role in ("prompt", "target", "word_name", "sound"):
                put(pg, scr + sfx, (roles or {}).get(role), WHAT.get(role, role), WHEN.get(role, "Page opens"))
            # numbered among the steps that actually SPEAK, not by position in teach_seq: the
            # sequence also holds silent steps, so the single spoken line on a teaching page was
            # coming out labelled "teaching line 4" with no 1, 2 or 3 anywhere near it
            spoken = [st for st in (dd.get("teach_seq") or [])
                      if isinstance(st, dict) and st.get("audio")]
            for si, st in enumerate(spoken):
                put(pg, scr + sfx, st.get("audio"),
                    "teaching line" if len(spoken) == 1 else "teaching line %d" % (si + 1),
                    WHEN["teach"])
            for it in (dd.get("items") or []):
                if isinstance(it, dict):
                    put(pg, scr + sfx, it.get("audio"),
                        "the word «%s»" % it.get("word_hi", "?"), WHEN["item"])
            for o in (dd.get("options") or []):
                if isinstance(o, dict):
                    put(pg, scr + sfx, o.get("audio"),
                        "the letter «%s»" % o.get("letter", "?"), WHEN["option"])
            for b in (dd.get("bins") or []):
                if isinstance(b, dict):
                    put(pg, scr + sfx, b.get("audio"), "the box «%s»" % b.get("label", "?"), WHEN["bin"])
            for li, lv in enumerate(dd.get("levels") or []):
                rl = "round %d" % (li + 1)
                for it in (lv.get("items") or []) + (lv.get("spares") or []):
                    if isinstance(it, dict):
                        put(pg, scr + sfx, it.get("audio"),
                            "the word «%s» (%s)" % (it.get("word_hi", "?"), rl), WHEN["balloon"])
                for role, aid in (lv.get("audio") or {}).items():
                    put(pg, scr + sfx, aid, "%s (%s)" % (WHAT.get(role, role), rl), WHEN.get(role, "During the round"))
            for role in ("correct", "more", "wrong", "try_again", "hint", "h1", "h2", "h3",
                         "reveal", "done", "next"):
                put(pg, scr + sfx, (roles or {}).get(role), WHAT.get(role, role), WHEN.get(role, "During the page"))

        half(d, sl.get("audio"))
        then = d.get("then") or {}
        if then:
            half(then.get("data") or {}, then.get("audio"), "the child's turn")
    return rows


def build():
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill

    rows = placements()
    pages_of = {}
    for r in rows:
        pages_of.setdefault(r["aid"], [])
        if r["page"] not in pages_of[r["aid"]]:
            pages_of[r["aid"]].append(r["page"])

    def short(pg):
        return pg.replace("Page ", "p").replace("Start screen", "start").split(" (")[0]

    HEAD = Font(name="Arial", bold=True, size=10)
    HI = Font(name="Nirmala UI", size=12)
    WRAP = Alignment(wrap_text=True, vertical="top")
    NEW = PatternFill("solid", fgColor="FFF2CC")

    wb = Workbook()

    # ── 1 · VO Manifest ───────────────────────────────────────────────────────────────────────
    ws = wb.active; ws.title = "VO Manifest"
    ws.append(["%s (%s) - voice-over manifest" % (TITLE_HI, CODE)])
    ws["A1"].font = Font(name="Arial", bold=True, size=12)
    ws.append(["Start screen -> transition -> pages 1-6 teaching -> pages 7-12 practice "
               "-> transition -> page 13 balloon game -> page 14 celebration"])
    ws.append([])
    ws.append(["S.No", "Page", "Screen", "#", "Audio ID", "Hindi script (spoken exactly)",
               "What it is", "When it plays", "Same recording also on", "Duration (s)", "Status"])
    for c in ws[4]:
        c.font = HEAD
    seq, last_screen, n = 0, None, 0
    for r in rows:
        key = (r["page"], r["screen"])
        seq = seq + 1 if key == last_screen else 1
        last_screen = key
        n += 1
        others = [short(p) for p in pages_of[r["aid"]] if p != r["page"]]
        status = status_of(r["aid"])
        ws.append([n, r["page"], r["screen"], seq, r["aid"], script_of(r["aid"]),
                   r["what"], r["when"], ", ".join(others), DUR.get(r["aid"], ""), status])
        ws.cell(ws.max_row, 6).font = HI; ws.cell(ws.max_row, 6).alignment = WRAP
        if status.startswith(("NOT RECORDED", "SYNTHESISED", "RE-RECORD")):
            for col in range(1, 12):
                ws.cell(ws.max_row, col).fill = NEW
    for col, w in (("A", 6), ("B", 26), ("C", 30), ("D", 4), ("E", 17), ("F", 60),
                   ("G", 30), ("H", 34), ("I", 16), ("J", 11), ("K", 42)):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "A5"

    # ── 2 · Recording list ────────────────────────────────────────────────────────────────────
    rl = wb.create_sheet("Recording list")
    distinct, seen = [], set()
    for r in rows:
        if r["aid"] in seen:
            continue
        seen.add(r["aid"]); distinct.append(r)
    todo = [r for r in distinct if not status_of(r["aid"]).startswith("delivered")]
    rl.append(["Recording list - one row per recording, in game order"])
    rl["A1"].font = Font(name="Arial", bold=True, size=12)
    rl.append(["%d distinct recordings. %d still to record - those rows are highlighted."
               % (len(distinct), len(todo))])
    rl.append([])
    rl.append(["S.No", "Audio ID", "File name", "Hindi script (spoken exactly)",
               "Plays on", "Duration (s)", "Status"])
    for c in rl[4]:
        c.font = HEAD
    for i, r in enumerate(distinct, 1):
        status = status_of(r["aid"])
        rl.append([i, r["aid"], r["aid"] + ".wav", script_of(r["aid"]),
                   ", ".join(short(p) for p in pages_of[r["aid"]]),
                   DUR.get(r["aid"], ""), status])
        rl.cell(rl.max_row, 4).font = HI; rl.cell(rl.max_row, 4).alignment = WRAP
        if not status.startswith("delivered"):
            for col in range(1, 8):
                rl.cell(rl.max_row, col).fill = NEW
    for col, w in (("A", 6), ("B", 17), ("C", 22), ("D", 62), ("E", 28), ("F", 11), ("G", 42)):
        rl.column_dimensions[col].width = w
    rl.freeze_panes = "A5"

    # ── 3 · Sound effects ─────────────────────────────────────────────────────────────────────
    SFX = {
        "sfx_pop":        ("Play button on the start screen, and a balloon bursting", "start, p13"),
        "sfx_tap":        ("The आगे button", "all pages"),
        "sfx_correct":    ("Correct answer", "p7-p13"),
        "sfx_wrong":      ("Wrong answer - a soft buzz, never harsh", "p7-p13"),
        "sfx_celebrate":  ("Plays with every confetti burst", "p7-p14"),
        "sfx_bal_pop":    ("A balloon bursting", "p13"),
        "sfx_bal_music":  ("The balloon game's own music bed, looped", "p13"),
        "sfx_bg_music":   ("Lesson background bed, from the play button on; ducks under every "
                           "voice line and steps aside for the balloon game", "all except p13"),
        "sfx_kanv":       ("The crow, when it appears", "p1"),
    }
    sx = wb.create_sheet("Sound effects")
    sx.append(["Sound effects and music (shipped - no recording needed)"])
    sx["A1"].font = Font(name="Arial", bold=True, size=12)
    sx.append(["Only the ones this lesson actually plays."])
    sx.append([])
    sx.append(["Audio ID", "File name", "What it is / where it plays", "Page(s)", "Duration (s)"])
    for c in sx[4]:
        c.font = HEAD
    for aid in sorted(k for k in (CARD.get("assets", {}).get("audio") or {}) if k.startswith("sfx_")):
        what, where = SFX.get(aid, ("-", "-"))
        sx.append([aid, aid + ".ogg", what, where, DUR.get(aid, "")])
    for col, w in (("A", 18), ("B", 22), ("C", 62), ("D", 22), ("E", 11)):
        sx.column_dimensions[col].width = w
    sx.freeze_panes = "A5"

    # ── 4 · Recording spec ────────────────────────────────────────────────────────────────────
    sp = wb.create_sheet("Recording spec")
    sp.append(["%s - recording spec" % TITLE_HI]); sp["A1"].font = Font(name="Arial", bold=True, size=12)
    sp.append([])
    spec = [
        ("Scope", "The whole lesson - start screen, 2 transitions, 14 pages, celebration. The "
                  "balloon game's words are in here too; it has no separate manifest."),
        ("Order", "Game order. On each page: what plays as it opens, then the board's own clips, "
                  "then the correct answer, then the 1st / 2nd / 3rd wrong try (Hint 1, 2, 3), "
                  "then the closing line. Hints only sound after a wrong answer, so that part is "
                  "the order they would be reached in, not a guarantee they are all heard."),
        ("Clips", "%d rows, %d distinct recordings (see 'Recording list'). %d still to record."
                  % (len(rows), len(distinct), len(todo))),
        ("Deliver to", "A flat folder named <Audio ID>.wav - the file name IS the Audio ID. "
                       "intake_vo.py renames into build/assets/Audio/ and the build encodes "
                       "Opus 28k mono for the delivery; do not send .ogg or .mp3."),
        ("Voice", "HUMAN, one narrator, warm and unhurried for Grade 2. This lesson does not use "
                  "TTS and has no TTS fallback - a missing clip is silent on purpose, so that a "
                  "gap is noticed rather than papered over by a robot voice."),
        ("Format", "WAV, 16-bit PCM, MONO, 48 kHz. 16-bit is a hard requirement, not a preference: "
                   "the word-by-word highlighting is timed by reading the waveform and that reader "
                   "only understands 16-bit PCM WAV. No added silence, no fades, no music bed, no "
                   "brickwall normalisation."),
        ("Register", "आप form throughout - सुनिए, कीजिए, डालिए. The closing line uses तुम, which is "
                     "the standard end-screen dialogue and the one allowed exception."),
        ("Script", "Record exactly the text in the Hindi script column - it is the build's own "
                   "text, and the on-screen wording is generated from the same source."),
        ("Bare sounds", "vo_snd_p / vo_snd_ch / vo_snd_m are a bare letter sound followed by one "
                        "example word. They are SHORT on purpose and the build guards them - do "
                        "not pad them into a sentence."),
        ("After vo_p8_prompt", "If the closing line is re-recorded, re-run "
                               "_assets_round4/make_lipsync.py. Swiftie's mouth on the end screen "
                               "is driven by a track measured from that exact clip; a new take "
                               "without it leaves her lip-sync running to the old rhythm."),
        ("Re-recording", "Keep the same file name; the build re-stamps the audio so the new take "
                         "reaches browsers."),
        ("Regenerate", "PYTHONUTF8=1 python gen_lesson_vo_manifest.py"),
    ]
    for k, v in spec:
        sp.append([k, v])
        sp.cell(sp.max_row, 1).font = Font(name="Arial", bold=True, size=10)
        sp.cell(sp.max_row, 2).alignment = WRAP
    sp.column_dimensions["A"].width = 20
    sp.column_dimensions["B"].width = 112

    wb.save(OUT)
    print("  %s" % OUT)
    print("  VO Manifest     %d placements across %d pages/screens"
          % (len(rows), len({(r["page"], r["screen"]) for r in rows})))
    print("  Recording list  %d distinct, %d still to record" % (len(distinct), len(todo)))
    print("  Sound effects   %d" % sum(1 for k in (CARD.get("assets", {}).get("audio") or {})
                                       if k.startswith("sfx_")))


if __name__ == "__main__":
    build()
