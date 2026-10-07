# -*- coding: utf-8 -*-
"""Write this game's two delivery manifests from the built card.

    PYTHONUTF8=1 python make_manifests.py [bundle_dir]        (default: build)

  * assets/Audio/audio_manifest.xlsx  — the VO recording brief: every spoken line, the exact
    filename to deliver it as, and where the child hears it.
  * assets/Images/image_manifest.xlsx — the illustration inventory: every picture the card
    references, where it is used, and what ships today.

WHY THIS FILE EXISTS rather than a one-off run:
  1. The manifests must be REGENERATED whenever a line of text changes, or they quietly describe a
     lesson that no longer exists. The r5r register pass rewrote eleven lines; a manifest cut before
     it would have sent a voice artist the old wording.
  2. The shared generator resolves "Used by" from slide["audio"] and data["options"] ONLY. This card
     also keeps clips in data["items"], data["levels"][n]["items"]/["spares"]/["audio"],
     data["teach_seq"], data["whole_audio"] and landing_hero["sync_audio"] - 28 of 81 rows came out
     as "engine/shared", including all 20 picture words, which is exactly the column a voice artist
     reads to know what they are naming. Resolved here rather than by editing the shared tool,
     which serves the whole fleet.
  3. The shared generator labels usage by SLIDE ID ("G1:correct", "P7:prompt"). Nobody outside this
     repo can turn G1 into a page number, so every row is relabelled "page N · role".

The audio sheet's own format - columns, colours, the pink MISSING fill - is the shared tool's and is
deliberately not re-invented here; only the usage column is rewritten.
"""
import filecmp, io, importlib.util, json, os, sys

SKILL_BUILD = r"C:\Users\harsh\.claude\skills\swiftpal-game-revise\scripts\build"
BUNDLE = (sys.argv[1] if len(sys.argv) > 1 else "build").rstrip("/\\")
CARD = json.load(io.open(os.path.join(BUNDLE, "card.json"), encoding="utf-8"))
CODE = CARD.get("skill_code", "HI02H11_L01_S01")


# ── where is each clip actually heard? ───────────────────────────────────────────────────────────
def play_index():
    """{audio id: (page, seq)} - where a clip is FIRST heard, and how far into that page.

    The reviewer asked for the sheet "page-wise, with all audio files listed sequentially according
    to the corresponding game page numbers" and for the clips inside a page to sit "in the exact
    order in which they appear/play in the game". Page order is exact - page N is slides[N-1], and
    the cover is page 0 because it is not a slide. Order WITHIN a page is a clean run: what a child
    hears if they get everything right, and then the clips that only a mistake can reach.

    It cannot be more exact than that, and the sheet says so rather than implying a precision it
    does not have: hints only sound after a wrong answer, a word clip only when that picture is
    tapped, and on the balloon board the order depends on which balloon the child reaches first. A
    clip heard on several pages is listed under the FIRST one, which is the take the studio is
    recording for.

    The ranks below are the running order of a page, not a preference:
      0  the instruction, and the sentence it is about
      1  the guided narration that walks through it
      2  the things on the board, in the order they are laid out
      3  the letter or sound being taught
      4  success
      5  the error path - buzz, then the hint ladder in rung order
      6  the closing line
    """
    seen, out = {}, []
    def add(aid, page, rank, sub=0):
        if not aid or aid in seen:
            return
        seen[aid] = (page, rank * 1000 + sub)
        out.append(aid)

    hero = CARD.get("landing_hero") or {}
    add(hero.get("sync_audio"), 0, 0)
    add(hero.get("picture_sfx"), 0, 2)
    add(CARD.get("landing_audio") or "vo_landing", 0, 0)

    def walk(d, roles, page):
        """One half of a page: its role map plus everything hanging off its data."""
        R = {"prompt": 0, "whole_audio": 0, "line": 0,
             "target": 3, "word_name": 3, "sound": 3,
             "correct": 4, "done": 6, "next": 6,
             "wrong": 5, "try_again": 5,
             "hint": 5, "h1": 5, "h2": 5, "h3": 5}
        SUB = {"prompt": 0, "whole_audio": 1, "correct": 0, "done": 0, "next": 1,
               "wrong": 0, "try_again": 1, "hint": 2, "h1": 3, "h2": 4, "h3": 5,
               "target": 0, "word_name": 1, "sound": 2}
        add(d.get("whole_audio"), page, 0, 1)
        for role, aid in (roles or {}).items():
            add(aid, page, R.get(role, 4), SUB.get(role, 9))
        for i, step in enumerate(d.get("teach_seq") or []):
            if isinstance(step, dict):
                add(step.get("audio"), page, 1, i)
        for i, it in enumerate(d.get("items") or []):
            if isinstance(it, dict):
                add(it.get("audio"), page, 2, i)
        for i, o in enumerate(d.get("options") or []):
            if isinstance(o, dict):
                add(o.get("audio"), page, 2, 100 + i)
        for i, b in enumerate(d.get("bins") or []):
            if isinstance(b, dict):
                add(b.get("audio"), page, 2, 200 + i)
        for li, lv in enumerate(d.get("levels") or []):
            for role, aid in (lv.get("audio") or {}).items():
                add(aid, page, R.get(role, 4), 300 + li * 20 + SUB.get(role, 9))
            for i, it in enumerate(lv.get("items") or []):
                add(it.get("audio"), page, 2, 400 + li * 50 + i)
            for i, it in enumerate(lv.get("spares") or []):
                add(it.get("audio"), page, 2, 460 + li * 50 + i)

    for i, sl in enumerate(CARD.get("slides", [])):
        pg = i + 1
        d = sl.get("data") or {}
        walk(d, sl.get("audio"), pg)
        # [r6s] a page can carry a second half - G5D demonstrates the sort and then BECOMES it, and
        # everything that half needs travels inside data["then"]. It is the same PAGE to the child,
        # so it stays under this page number and simply sorts after the first half.
        then = d.get("then") or {}
        if then:
            walk(then.get("data") or {}, then.get("audio"), pg)

    # anything the card declares but no page reaches - engine sounds, the phase transitions - is
    # not page-wise by nature and goes in its own block at the end rather than being guessed at
    for aid in sorted((CARD.get("assets", {}).get("audio") or {})):
        add(aid, 99, 0)
    return seen


def usage_map():
    use = {}
    def add(aid, where):
        if aid:
            use.setdefault(aid, [])
            if where not in use[aid]:
                use[aid].append(where)

    hero = CARD.get("landing_hero") or {}
    add(hero.get("sync_audio"), "cover \u00b7 narration")
    add(hero.get("picture_sfx"), "cover \u00b7 picture sound")

    for i, s in enumerate(CARD.get("slides", [])):
        pg = "page %d" % (i + 1)          # the cover is not a slide, so page N == slides[N-1]
        d = s.get("data") or {}
        for role, aid in (s.get("audio") or {}).items():
            add(aid, "%s \u00b7 %s" % (pg, role))
        add(d.get("whole_audio"), "%s \u00b7 whole line" % pg)
        for it in (d.get("items") or []):
            if isinstance(it, dict):
                add(it.get("audio"), "%s \u00b7 picture %s" % (pg, it.get("word_hi", "?")))
        for opt in (d.get("options") or []):
            if isinstance(opt, dict):
                add(opt.get("audio"), "%s \u00b7 option %s" % (pg, opt.get("letter", opt.get("word_hi", "?"))))
        for li, lv in enumerate(d.get("levels") or []):
            rnd = "%s \u00b7 round %d" % (pg, li + 1)
            for role, aid in (lv.get("audio") or {}).items():
                add(aid, "%s %s" % (rnd, role))
            for it in (lv.get("items") or []):
                add(it.get("audio"), "%s balloon %s" % (rnd, it.get("word_hi", "?")))
            for it in (lv.get("spares") or []):
                add(it.get("audio"), "%s refill %s" % (rnd, it.get("word_hi", "?")))
        for si, step in enumerate(d.get("teach_seq") or []):
            if isinstance(step, dict):
                add(step.get("audio"), "%s \u00b7 teach step %d" % (pg, si + 1))
        for b in (d.get("bins") or []):
            if isinstance(b, dict):
                add(b.get("audio"), "%s \u00b7 box %s" % (pg, b.get("label", "?")))
        # [r6s] A PAGE CAN NOW CARRY A SECOND HALF. G5D demonstrates the sort and then BECOMES the
        # sort, and everything that half needs \u2014 its own prompt, its own clips, its own board \u2014
        # travels inside data["then"]. Without walking it, four clips that are very much heard on
        # page 12 came out as "engine/shared", which is the one column a voice artist reads to know
        # what they are naming. The unresolved count caught it the moment the merge landed.
        t = d.get("then") or {}
        for role, aid in (t.get("audio") or {}).items():
            add(aid, "%s \u00b7 %s (2nd half)" % (pg, role))
        for it in (t.get("items") or []):
            if isinstance(it, dict):
                add(it.get("audio"), "%s \u00b7 picture %s (2nd half)" % (pg, it.get("word_hi", "?")))
        for b in (t.get("bins") or []):
            if isinstance(b, dict):
                add(b.get("audio"), "%s \u00b7 box %s (2nd half)" % (pg, b.get("label", "?")))
    return use


def image_usage():
    use = {}
    def add(img, where):
        if img:
            use.setdefault(img, [])
            if where not in use[img]:
                use[img].append(where)
    hero = CARD.get("landing_hero") or {}
    add(hero.get("picture_img"), "cover \u00b7 picture")
    for i, s in enumerate(CARD.get("slides", [])):
        pg = "page %d" % (i + 1)
        d = s.get("data") or {}
        add(d.get("picture_img"), "%s \u00b7 picture" % pg)
        for it in (d.get("items") or []):
            if isinstance(it, dict): add(it.get("img"), "%s \u00b7 %s" % (pg, it.get("word_hi", "?")))
        for li, lv in enumerate(d.get("levels") or []):
            for it in (lv.get("items") or []):  add(it.get("img"), "%s \u00b7 round %d %s" % (pg, li + 1, it.get("word_hi", "?")))
            for it in (lv.get("spares") or []): add(it.get("img"), "%s \u00b7 round %d refill %s" % (pg, li + 1, it.get("word_hi", "?")))
        for st in (d.get("teach_seq") or []):
            if isinstance(st, dict): add(st.get("img"), "%s \u00b7 teach" % pg)
    return use


# [r6l] WHICH LINES ACTUALLY NEED RECORDING.
# The shared make_vo_sheets.py stamps every row "machine TTS - replace", because it was written for a
# bundle whose audio is all generated and it has no way to know a studio delivery has landed. After
# r5x that is wrong for 80 of the 81 rows, and wrong in the expensive direction: handed over as-is,
# the brief asks for the whole lesson to be re-recorded when a single line has changed.
#
# So the column is rewritten from evidence rather than assumption:
#   * no master in the delivery folder            -> it really is a generated clip
#   * master present but build/ holds something else -> the two have drifted; say so
#   * master present, shipping, and the card's line still fits it -> done, leave it alone
#   * master present and shipping, but the clip is far longer than the line now needs -> the line was
#     re-scripted under a finished take. Same 2.5x ratio the build's own stale-take warning uses, so
#     the sheet and the build can never disagree about which lines are outstanding.
HUMAN_VO = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "_assets_round4", "voiceovers_SME_20260922")
TEXT = (CARD.get("assets") or {}).get("audio_text") or {}
DUR  = (CARD.get("assets") or {}).get("audio_dur") or {}
# Clips that are SUPPOSED to differ from their master. These carry a bare अक्षर on the SME's own
# ruling ("play only these च, ल, र sound not more than that"), and the delivered takes are the full
# "<letter> से <word>" carrier — so build/ holds a trim, by design, and every one of them would
# otherwise be reported as drift. vo_snd_ch is the visible case: a 2.36s carrier cut to 0.75s.
# Kept in step with BARE_SOUND_IDS in build_skill_HI02H11_L01_S01.py.
TRIMMED_ON_PURPOSE = {"vo_snd_ch", "vo_snd_l", "vo_snd_r",
                      "vo_ltr_ch", "vo_ltr_l", "vo_ltr_r", "vo_ltr_p", "vo_ltr_m", "vo_ltr_n",
                      }

# [r6o] LINES THAT SHIP SYNTHESISED BECAUSE NO HUMAN TAKE OF THEM EXISTS.
# r6n held the SME's requested wording here instead, because the clip still spoke the old line and
# the card had to describe what was actually said. That is no longer the case: vo_landing now IS
# their line, so the card, the clip and the brief all carry the same words and there is nothing to
# hold apart. What is left to record is the VOICE.
# This is the one clip in the lesson that is not the SME's own, and the cover is the first thing a
# child hears - which is exactly where a different timbre is most audible - so it gets its own
# status rather than being lumped in with "build differs from the delivered take", which would read
# as drift rather than as a deliberate, flagged substitution.
SYNTHESISED = {"vo_landing"}

def vo_status(aid, line, dur):
    if aid in SYNTHESISED:
        return "SYNTHESISED - record a human take of the line in column D"
    master = os.path.join(HUMAN_VO, aid + ".wav")
    if not os.path.exists(master):
        # [r7a] "machine TTS - replace" is only true of a line that HAS a generated clip. The review
        # doc's hint ladder added lines that have no audio of any kind yet, and telling a studio to
        # "replace" something that was never there reads as optional cleanup rather than as work.
        if not os.path.exists(os.path.join(BUNDLE, "assets", "Audio", aid + ".ogg")):
            return "NOT RECORDED - new line, needs a first take"
        return "machine TTS - replace"
    if aid in TRIMMED_ON_PURPOSE:
        return "delivered - build holds a deliberate TRIM; do NOT re-record"
    shipped = os.path.join(BUNDLE, "assets", "Audio", aid + ".ogg")
    if not (os.path.exists(shipped) and filecmp.cmp(master, shipped, shallow=False)):
        return "RE-RECORD - build differs from the delivered take"
    n = len((line or "").strip())
    if n and dur and dur > 2.5 * max(1.0, n / 14.0):
        return "RE-RECORD - the line was re-scripted after this take"
    return "delivered - do NOT re-record"


# ── 1 · audio ────────────────────────────────────────────────────────────────────────────────────
def audio_manifest():
    out = os.path.join(BUNDLE, "assets", "Audio", "audio_manifest.xlsx")
    spec = importlib.util.spec_from_file_location("mvs", os.path.join(SKILL_BUILD, "make_vo_sheets.py"))
    mvs = importlib.util.module_from_spec(spec); spec.loader.exec_module(mvs)
    mvs.build(out, [BUNDLE])

    from openpyxl import load_workbook
    from openpyxl.styles import Font
    use = usage_map()
    wb = load_workbook(out)
    ws = wb[CODE] if CODE in wb.sheetnames else wb[wb.sheetnames[-1]]
    unresolved = []
    for r in range(2, ws.max_row + 1):
        aid = ws.cell(r, 2).value
        if not aid: continue
        # [r5w] COLUMN C SAYS .wav, NOT .ogg. The shared tool derives the extension from the card's
        # audio paths, which say .ogg - but that is the name the ENGINE loads, not the format a
        # person records. gen_tts writes RIFF/WAV content under an .ogg name (its own note: Chromium
        # sniffs it), so build/ is 124 WAV files wearing an .ogg extension, and the karaoke speech
        # map only parses 16-bit RIFF: hand it a real Ogg and _wav_mono16 returns nothing, the word
        # highlighting silently falls back to wall-clock timing, and we are back to the desync the
        # SME reported in r5e. So the sheet asks for what a studio should actually deliver - a WAV -
        # and intake_vo.py does the renaming into build/.
        ws.cell(r, 3).value = str(aid) + ".wav"
        # [r6l] and column F stops claiming the whole lesson is unrecorded — see vo_status above
        ws.cell(r, 6).value = vo_status(aid, (TEXT.get(aid) or ""), DUR.get(aid))
        places = use.get(aid)
        if places:
            ws.cell(r, 5).value = "; ".join(places[:4]) + (" (+%d more)" % (len(places) - 4) if len(places) > 4 else "")
            ws.cell(r, 5).font = Font(name="Arial", size=10)
        elif (ws.cell(r, 5).value or "") == "engine/shared":
            unresolved.append(aid)
    ws.column_dimensions["E"].width = 46
    # a format block the artist cannot miss, on both tabs
    from openpyxl.styles import Font as _F
    summ = wb[wb.sheetnames[0]]
    r0 = summ.max_row + 2
    for j, line in enumerate([
            "AUDIO FORMAT - please deliver exactly this:",
            "    WAV, 16-bit PCM, MONO, 48 kHz.  One file per row, named as column C (e.g. vo_landing.wav).",
            "    16-bit WAV is a hard requirement, not a preference: the word-by-word highlighting is timed by",
            "    reading the waveform, and that reader only understands 16-bit PCM WAV. An MP3/OGG/M4A delivery",
            "    still plays, but the highlighting silently falls back to guessed timing and drifts out of sync.",
            "    No added silence, no fades, no music bed, no normalisation to a brickwall - a clean room take.",
            "    Send the folder as-is; the build renames and encodes (Opus 28k mono) on its own."]):
        summ.cell(r0 + j, 1, line).font = _F(name="Arial", bold=(j == 0), size=10)
    # ── page order, on both sheets ─────────────────────────────────────────────────────────────
    # Reviewer: "organize the Excel page-wise, with all audio files listed sequentially according to
    # the corresponding game page numbers" and "audios within each page arranged in the exact order
    # in which they appear/play in the game."
    # The shared tool emits rows in card-declaration order, which is neither. Rather than shuffle
    # its layout we rewrite the sheet with a PAGE column of our own, because a page-ordered sheet
    # whose rows do not say which page they belong to just moves the guesswork.
    from openpyxl.utils import get_column_letter
    PI = play_index()
    LAST = 10 ** 6

    def sort_key(aid):
        pg, sq = PI.get(aid, (98, 0))
        return (pg if pg != 99 else 98.5, sq, str(aid))

    def page_label(aid):
        pg = PI.get(aid, (None, 0))[0]
        if pg == 0:   return "cover"
        if pg == 99:  return "engine"
        if pg is None or pg == 98: return "-"
        return "page %d" % pg

    harvest = []
    for r in range(2, ws.max_row + 1):
        aid = ws.cell(r, 2).value
        if not aid:
            continue
        harvest.append({"id": aid, "file": ws.cell(r, 3).value, "text": ws.cell(r, 4).value,
                        "where": ws.cell(r, 5).value, "status": ws.cell(r, 6).value,
                        "chars": ws.cell(r, 7).value})
    harvest.sort(key=lambda h: sort_key(h["id"]))

    HEAD = ["#", "Page", "VO ID", "Deliver as (exact filename)",
            "Hindi line (speak exactly this)", "Heard on", "Status", "Chars"]

    def write_sheet(sh, rows, highlight_new):
        sh.delete_rows(1, sh.max_row)
        sh.append(HEAD)
        for c in sh[1]:
            c.font = Font(name="Arial", bold=True, size=10)
        fill = PatternFill("solid", fgColor="FFF2CC")
        prev = None
        for i, h in enumerate(rows, 1):
            pg = page_label(h["id"])
            sh.append([i, pg if pg != prev else "", h["id"], h["file"],
                       h["text"], h["where"], h["status"], h["chars"]])
            prev = pg
            rr = sh.max_row
            sh.cell(rr, 5).alignment = Alignment(wrap_text=True, vertical="top")
            sh.cell(rr, 5).font = Font(name="Nirmala UI", size=12)
            if highlight_new and str(h["status"] or "").startswith("NOT RECORDED"):
                for col in range(1, 9):
                    sh.cell(rr, col).fill = fill
        for col, w in (("A", 5), ("B", 10), ("C", 16), ("D", 26),
                       ("E", 64), ("F", 32), ("G", 44), ("H", 7)):
            sh.column_dimensions[col].width = w
        sh.freeze_panes = "A2"

    from openpyxl.styles import Alignment, PatternFill
    write_sheet(ws, harvest, highlight_new=True)

    # ── a sheet that IS the recording session ──────────────────────────────────────────────────
    # The full tab lists all 95 lines because the build needs every id accounted for. Nobody records
    # from that: 73 of those rows are already delivered and must NOT be re-read, and the ones that
    # matter are scattered among them. This tab carries only the lines that still need a take, in
    # the order a session would work through them, so the sheet can be sent as-is.
    # [page-order] the session follows the GAME, not the status. An earlier version led with the
    # new takes on the grounds that they block the build - true, but it fought the reviewer's
    # ask, and reading in game order is what keeps a voice consistent across a page: the prompt and
    # its three hints are the same breath, and recording them an hour apart is audible.
    todo = [h for h in harvest if not str(h["status"] or "").startswith("delivered")]

    rec = wb.create_sheet("TO RECORD", 0)
    write_sheet(rec, todo, highlight_new=True)
    rec.cell(1, 7).value = "Why it is on this list"

    # A line can have a consequence beyond itself, and the sheet has to say so where it does -
    # otherwise the take arrives, gets dropped in, and something downstream is quietly wrong. Only
    # one such line exists today: the closing line drives Swiftie's mouth on the end screen, and her
    # lip-sync is a track MEASURED from that exact recording.
    AFTER = {"vo_p8_prompt":
             "AFTER this take lands: re-run _assets_round4/make_lipsync.py. The end screen's "
             "lip-sync is measured from THIS clip; a new take without it leaves her mouth running "
             "to the old rhythm."}
    for r in range(2, rec.max_row + 1):
        note = AFTER.get(rec.cell(r, 3).value)
        if note:
            rec.cell(r, 7).value = (rec.cell(r, 7).value or "") + "  |  " + note
            rec.cell(r, 7).alignment = Alignment(wrap_text=True, vertical="top")

    r0 = rec.max_row + 2
    rec.cell(r0, 1, "%d line(s) to record. Highlighted rows are new takes - nothing can play them "
                    "until they arrive." % len(todo)).font = Font(name="Arial", bold=True, size=10)
    for j, line in enumerate([
            "",
            "AUDIO FORMAT - please deliver exactly this:",
            "    WAV, 16-bit PCM, MONO, 48 kHz.  One file per row, named as column C.",
            "    16-bit WAV is a hard requirement, not a preference: the word-by-word highlighting is timed by",
            "    reading the waveform, and that reader only understands 16-bit PCM WAV.",
            "    No added silence, no fades, no music bed, no brickwall normalisation - a clean room take.",
            "    Send the folder as-is; the build renames and encodes (Opus 28k mono) on its own."]):
        rec.cell(r0 + 1 + j, 1, line).font = Font(name="Arial", bold=(j == 1), size=10)

    wb.save(out)
    print("  audio_manifest.xlsx  %d lines, %d unresolved %s"
          % (ws.max_row - 1, len(unresolved), unresolved or ""))
    print("  TO RECORD tab        %d line(s) outstanding" % len(todo))


# ── 2 · images ───────────────────────────────────────────────────────────────────────────────────
def image_manifest():
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    out = os.path.join(BUNDLE, "assets", "Images", "image_manifest.xlsx")
    HDR = Font(name="Arial", bold=True, color="FFFFFF", size=10)
    FILL = PatternFill("solid", fgColor="1F3B70")
    MISS = PatternFill("solid", fgColor="FFC7CE")
    AR = Font(name="Arial", size=10); HI = Font(name="Nirmala UI", size=11)
    thin = Border(*[Side(style="thin", color="D9D9D9")] * 4)

    imgs = CARD["assets"]["image"]
    imgs = imgs if isinstance(imgs, dict) else {k: k for k in imgs}
    use = image_usage()
    # the Hindi word an image stands for, so the sheet reads as pictures rather than ids
    word = {}
    for s in CARD.get("slides", []):
        d = s.get("data") or {}
        for it in (d.get("items") or []):
            if isinstance(it, dict) and it.get("img"): word[it["img"]] = it.get("word_hi", "")
        for lv in (d.get("levels") or []):
            for it in (lv.get("items") or []) + (lv.get("spares") or []):
                if it.get("img"): word[it["img"]] = it.get("word_hi", "")

    d_img = os.path.join(BUNDLE, "assets", "Images")
    wb = Workbook(); ws = wb.active; ws.title = CODE[:31]
    ws.append(["#", "Image ID", "Shows (Hindi)", "Used by", "On disk", "Pixels", "KB"])
    for c in range(1, 8): ws.cell(1, c).font = HDR; ws.cell(1, c).fill = FILL
    ws.freeze_panes = "A2"
    missing = 0
    for i, iid in enumerate(sorted(imgs), 1):
        f = os.path.join(d_img, iid + ".png")
        on = os.path.exists(f)
        px = kb = ""
        if on:
            kb = "%.0f" % (os.path.getsize(f) / 1024.0)
            try:
                from PIL import Image
                with Image.open(f) as im: px = "%dx%d" % im.size
            except Exception: px = "?"
        else:
            missing += 1
        ws.append([i, iid, word.get(iid, ""), "; ".join(use.get(iid, [])[:4]) or "engine/shared",
                   "yes" if on else "MISSING", px, kb])
        for c in range(1, 8):
            cell = ws.cell(ws.max_row, c); cell.border = thin
            cell.font = HI if c == 3 else AR
            if c == 4: cell.alignment = Alignment(wrap_text=True, vertical="center")
        if not on: ws.cell(ws.max_row, 5).fill = MISS
    for col, w in zip("ABCDEFG", (5, 20, 16, 52, 10, 12, 8)): ws.column_dimensions[col].width = w
    r = ws.max_row + 2
    for j, t in enumerate([
            "One row per picture the card references. 'Used by' is where the child sees it.",
            "Pink MISSING = the card asks for this image and no file exists; the build's own guard "
            "would not catch it, the page would simply fall back to an emoji.",
            "For NEW art: transparent PNG, long edge 512px, no baked background. The existing set "
            "is not uniform (284-1444px long edge, 7 of 23 at 512) - it grew over several rounds, "
            "and the engine fits each picture to its tile, so size is a delivery convention here "
            "rather than something the game depends on."]):
        ws.cell(r + j, 1, t).font = Font(name="Arial", italic=True, size=10)
    wb.save(out)
    print("  image_manifest.xlsx  %d images, %d missing" % (len(imgs), missing))


if __name__ == "__main__":
    print("manifests for %s from %s/" % (CODE, BUNDLE))
    audio_manifest()
    image_manifest()
