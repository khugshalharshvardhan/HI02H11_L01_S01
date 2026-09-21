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
import io, importlib.util, json, os, sys

SKILL_BUILD = r"C:\Users\harsh\.claude\skills\swiftpal-game-revise\scripts\build"
BUNDLE = (sys.argv[1] if len(sys.argv) > 1 else "build").rstrip("/\\")
CARD = json.load(io.open(os.path.join(BUNDLE, "card.json"), encoding="utf-8"))
CODE = CARD.get("skill_code", "HI02H11_L01_S01")


# ── where is each clip actually heard? ───────────────────────────────────────────────────────────
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
    wb.save(out)
    print("  audio_manifest.xlsx  %d lines, %d unresolved %s"
          % (ws.max_row - 1, len(unresolved), unresolved or ""))


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
