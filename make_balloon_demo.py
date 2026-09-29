# -*- coding: utf-8 -*-
"""Build a standalone, hostable copy of JUST the balloon game.

    PYTHONUTF8=1 python make_balloon_demo.py

Reads dist/ and writes balloon_game_standalone/. It never writes anywhere else — the delivered
bundle is untouched, and this can be re-run after any future change to the real game to refresh the
demo from it.

What it does, and why each part is needed:
  * keeps ONLY the balloon slide and the celebration that follows it, so the demo is the game and
    then a "well done" rather than the game and then a dead end;
  * boots straight into it. The engine already has a `?slide=N` jump for QA; here the default is
    changed from "no jump" to "slide 0", so the root URL just starts the game and whoever is being
    shown it does not have to know about a query string;
  * copies only the assets this slide can actually reach, resolved from the trimmed page rather
    than guessed, so the folder is a fraction of the full delivery.
"""
import io, json, os, re, shutil, sys

SRC = "dist"
OUT = "balloon_game_standalone"
CODE = "HI02H11_L01_S01"
KEEP = ("TAP_BALLOON_SOUND", "CELEBRATION")

html = io.open(os.path.join(SRC, CODE + ".html"), encoding="utf-8", newline="").read()

# ── 1 · trim the inlined card to the two slides the demo needs ─────────────────────────────────
def trim_card(m):
    raw = m.group(2)
    lead = raw[:len(raw) - len(raw.lstrip())]
    trail = raw[len(raw.rstrip()):]
    c = json.loads(raw)
    c["slides"] = [s for s in c["slides"] if s.get("type") in KEEP]
    # phase_distribution is an invariant the engine and the receipt both check: it must sum to the
    # number of slides, so it is re-derived rather than carried over from the full lesson.
    dist = {}
    for s in c["slides"]:
        dist[s["phase"]] = dist.get(s["phase"], 0) + 1
    c["phase_distribution"] = dist

    # THE ASSET MAPS ARE TRIMMED TOO, and that is not cosmetic. Left whole they name every clip in
    # the lesson - including the sixteen hint lines that are not recorded yet - so the demo's own
    # manifest would list files it does not ship, and any check run against it reports 21 phantom
    # gaps. Worse, the copy step below is driven by the paths in this page, so an untrimmed map
    # drags the whole lesson's audio in behind it.
    keep_a, keep_i = set(), set()
    def take(d):
        if not isinstance(d, dict):
            return
        for k, v in d.items():
            if k in ("audio", "sync_audio", "picture_sfx", "whole_audio") and isinstance(v, str):
                keep_a.add(v)
            elif k in ("img", "picture_img", "cover_img") and isinstance(v, str):
                keep_i.add(v)
            elif isinstance(v, dict):
                take(v)
            elif isinstance(v, list):
                for x in v:
                    take(x)
    for s in c["slides"]:
        take(s)
        for role, aid in (s.get("audio") or {}).items():
            if isinstance(aid, str):
                keep_a.add(aid)
    # the engine plays these by name whatever the card says, so they are kept unconditionally
    keep_a |= {k for k in (c.get("assets", {}).get("audio") or {}) if k.startswith(("sfx_", "vo_pt_"))}
    A = c.setdefault("assets", {})
    for key in ("audio", "audio_text", "audio_dur", "audio_speech"):
        if isinstance(A.get(key), dict):
            A[key] = {k: v for k, v in A[key].items() if k in keep_a}
    if isinstance(A.get("image"), dict):
        A["image"] = {k: v for k, v in A["image"].items() if k in keep_i}
    return m.group(1) + lead + json.dumps(c, ensure_ascii=False) + trail + m.group(3)

out = re.sub(r'(<script[^>]*id="cardData"[^>]*>)(.*?)(</script>)', trim_card, html, flags=re.S)

# ── 2 · boot straight into slide 0 ─────────────────────────────────────────────────────────────
NL = "\r\n" if "\r\n" in out else "\n"       # the built page is CRLF; the anchors below are LF
OLD_JUMP = '''    const j = parseInt(new URLSearchParams(location.search).get("slide"), 10);
    if(isNaN(j)) return;'''.replace("\n", NL)
NEW_JUMP = '''    /* [balloon demo] the standalone build opens ON the game. The engine's QA jump is reused
       rather than a new path invented: same code, only the default changes, so the demo cannot
       drift from how the real bundle mounts a slide. */
    let j = parseInt(new URLSearchParams(location.search).get("slide"), 10);
    if(isNaN(j)) j = 0;'''.replace(chr(10), NL)
assert out.count(OLD_JUMP) == 1, "slide-jump anchor (%d)" % out.count(OLD_JUMP)
out = out.replace(OLD_JUMP, NEW_JUMP)

# a shared title, so the browser tab says what this is
out = re.sub(r"<title>.*?</title>", "<title>Balloon Game — बार-बार आने वाली ध्वनि</title>", out, count=1, flags=re.S)

# ── 3 · write it ───────────────────────────────────────────────────────────────────────────────
if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)
io.open(os.path.join(OUT, "index.html"), "w", encoding="utf-8", newline="").write(out)

# ── 4 · copy only what the trimmed page can reach ──────────────────────────────────────────────
# Anchored on the real path text, the same rule sync_dist.py uses: a bare stem match would drag in
# unrelated art (obj_papita matching "papita"), which is how a "small" demo quietly becomes the
# whole delivery again.
refs = set(re.findall(r"assets/[A-Za-z0-9_./ -]+?\.(?:png|jpe?g|webp|svg|gif|mp3|wav|ogg|opus)", out))
# the engine builds some paths by concatenation (Swiftie's moods, the object art in the card), so
# anything whose basename appears as a whole quoted string is kept too
quoted = set(re.findall(r'["\']([A-Za-z0-9_-]{3,})["\']', out))

copied = bytes_ = 0
for dp, _, fs in os.walk(os.path.join(SRC, "assets")):
    for fn in fs:
        src = os.path.join(dp, fn)
        rel = os.path.relpath(src, SRC).replace(os.sep, "/")
        stem = os.path.splitext(fn)[0]
        if rel not in refs and stem not in quoted:
            continue
        dst = os.path.join(OUT, rel.replace("/", os.sep))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        copied += 1
        bytes_ += os.path.getsize(dst)

total = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(OUT) for f in fs)
print("  %s/index.html  (%d slides kept)" % (OUT, len(KEEP)))
print("  %d assets copied, %.2f MB" % (copied, bytes_ / 1048576.0))
print("  folder total: %.2f MB  (the full delivery is 9.57 MB)" % (total / 1048576.0))
