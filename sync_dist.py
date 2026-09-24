# -*- coding: utf-8 -*-
"""Bring dist/ up to date with build/, WITHOUT churning bytes that did not change.

    PYTHONUTF8=1 python sync_dist.py            # report only
    PYTHONUTF8=1 python sync_dist.py --apply

Why this is not `build_dist.py`
------------------------------
The kit's build_dist.py rebuilds the whole delivery from scratch: it re-encodes every clip at a
fixed 32 kbps and re-converts every image. That is fine on a game with room to spare. This one
ships at 9.90 MB against a 10 MB cap, so its dist was hand-tuned - Opus at 28k rather than 32k,
and PNGs palettised rather than converted to WebP - and a full rebuild would quietly undo both and
bust the cap. It would also re-encode 91 human VO clips to produce 91 different files that sound
the same, which makes every future `xcheck` diff useless.

So this script is INCREMENTAL and additive: it touches an asset only when dist does not already
have one, and it never rewrites an asset that is already there. If you genuinely want a clip
re-encoded, delete it from dist/ and run again - that is the whole opt-in mechanism.

The HTML transform is not guessed
---------------------------------
`rewrite()` was derived from the shipped pair and verified to reproduce dist/HI02H11_L01_S01.html
byte-for-byte from build/HI02H11_L01_S01.html before it was written down. Note what it is NOT: the
kit's ext_only_rewrite does a blunt whole-text `.png` -> `.webp` replace, which also rewrites the
extension inside PROSE - the engine carries long comments that name asset files - and rewrites
paths for assets this dist never converted (sw_anim_rest.png is still a .png here). Extensions are
therefore rewritten only where dist actually holds the converted file.
"""
import io, json, os, re, shutil, subprocess, sys

CODE  = "HI02H11_L01_S01"
BUILD, DIST = "build", "dist"
CAP   = 10 * 1024 * 1024

# Opus bitrates. 28k is this delivery's VO/SFX rate - see the module docstring. The music bed is the
# one exception: 28k mono on MUSIC (as opposed to a single voice) is audibly grainy, and at 12.0s the
# step up to 40k costs 21 KB, which the budget has.
BITRATE = {"sfx_bal_music": "40k"}
BITRATE_DEFAULT = "28k"

# Assets that are referenced, are NOT in the delivery, and are deliberately staying out of it.
# Both were found the first time this script walked the tree rather than trusting the old one, so
# they are pre-existing gaps, not something a recent round introduced - and shipping either is a
# visible change that has to be asked for, not slipped in under a music patch.
HOLD = {
    "assets/UI/startnew_bg.webp":
        # The landing's backdrop. It has never been in dist (checked against git HEAD), so every
        # build the SME has reviewed fell back to `body.is-start{background:#47BCFD}` - which is the
        # flat blue in the screenshot they asked for a white card rim against. Adding it now would
        # change the cover mid-review AND cost 53 KB against ~36 KB of headroom.
        "never shipped; landing falls back to flat #47BCFD, which is what review has been seeing",
    "assets/UI/sw_anim_rest.webp":
        # Redundant, not missing: the hint mascot is referenced as sw_anim_rest.PNG and dist ships
        # that .png. Adding the .webp would make rewrite() repoint the reference at it and orphan a
        # file that is already working.
        "dist ships sw_anim_rest.png and the markup asks for .png - the .webp is redundant",
}

APPLY = "--apply" in sys.argv


def rewrite(t):
    """Point every literal asset path at the extension dist actually holds."""
    def f(m):
        rel, ext = m.group(1), m.group(2)
        for cand in (ext, ".webp", ".ogg"):
            if os.path.exists(os.path.join(DIST, (rel + cand).replace("/", os.sep))):
                return rel + cand
        return rel + ext
    return re.sub(r"(assets/[A-Za-z0-9_./ -]+?)(\.(?:png|jpe?g|webp|svg|gif|mp3|wav|ogg|opus))", f, t)


def patch_card_exts(raw):
    """audio_ext/img_ext drive the engine's runtime path building, which no text rewrite can reach."""
    c = json.loads(raw)
    c.setdefault("assets", {})["audio_ext"] = "ogg"
    c["assets"]["img_ext"] = "png"          # this delivery palettises PNGs; it does not ship WebP art
    return json.dumps(c, ensure_ascii=False)


ANY_EXT = r"(?:png|jpe?g|webp|svg|gif|mp3|wav|ogg|opus)"


def referenced(rel, stem, html):
    """Can the playable actually reach this asset?

    Two tests, and both are ANCHORED - a plain `stem in html` substring test is not good enough and
    was not merely imprecise, it was expensive: "papita" occurs inside "obj_papita", so the SME's
    1.4 MB unused source art for that object tested as referenced and went into the delivery,
    single-handedly busting the cap by more than a megabyte.
      1. the literal path, with any extension - this is how nearly everything is referenced; and
      2. the basename as a WHOLE quoted string, which is the kit's safety net for the paths the
         engine concatenates (`"assets/UI/" + stem + ".webp"`).
    """
    folder = rel.replace(os.sep, "/").rsplit("/", 1)[0]
    if re.search(r"%s/%s\.%s" % (re.escape(folder), re.escape(stem), ANY_EXT), html):
        return True
    return re.search(r"[\"']%s[\"']" % re.escape(stem), html) is not None


def encode_audio(src, dst, rate):
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", src,
                    "-ac", "1", "-c:a", "libopus", "-b:a", rate, "-vbr", "on",
                    "-application", "audio", dst], check=True)


def main():
    added, skipped, orphans, held = [], 0, [], []
    html = io.open(os.path.join(BUILD, CODE + ".html"), encoding="utf-8", newline="").read()

    # ── 1 · assets dist does not have yet ──────────────────────────────────────────────────────
    # An asset is only worth adding if the game can reach it. build/assets/Audio still holds three
    # unreferenced mp3s the SME dropped in early on ("ballon pop.mp3" and friends, superseded by the
    # sfx_* clips); without this test they would be encoded into the delivery, and the first of them
    # took ffmpeg down anyway - the .mp3 EXTENSION selected the mp3 muxer while -c:a said libopus.
    # Hence both halves of the fix: test the reference, and always land audio on .ogg.
    for dp, _, fs in os.walk(os.path.join(BUILD, "assets")):
        for fn in fs:
            src = os.path.join(dp, fn)
            rel = os.path.relpath(src, BUILD)
            stem, ext = os.path.splitext(fn)
            if ext.lower() == ".xlsx":
                continue                    # the manifest is a working file, not a delivered asset
            is_audio = ext.lower() in (".ogg", ".wav", ".mp3", ".opus")
            dst = os.path.join(DIST, (os.path.splitext(rel)[0] + ".ogg") if is_audio else rel)
            if os.path.exists(dst):
                skipped += 1
                continue
            if rel.replace(os.sep, "/") in HOLD:
                held.append(rel)
                continue
            if not referenced(rel, stem, html):
                orphans.append(rel)
                continue
            if APPLY:
                os.makedirs(os.path.dirname(dst), exist_ok=True)
            if is_audio:
                rate = BITRATE.get(stem, BITRATE_DEFAULT)
                if APPLY:
                    encode_audio(src, dst, rate)
                added.append((rel, rate, os.path.getsize(dst) if APPLY else 0))
            else:
                if APPLY:
                    shutil.copy2(src, dst)
                added.append((rel, "copy", os.path.getsize(dst) if APPLY else 0))

    # ── 2 · the playable, and the loose card beside it ─────────────────────────────────────────
    out = rewrite(html)
    out = re.sub(r'(<script[^>]*id="cardData"[^>]*>)(.*?)(</script>)',
                 lambda m: (m.group(1)
                            + m.group(2)[:len(m.group(2)) - len(m.group(2).lstrip())]
                            + patch_card_exts(m.group(2))
                            + m.group(2)[len(m.group(2).rstrip()):]
                            + m.group(3)),
                 out, flags=re.S)
    if APPLY:
        io.open(os.path.join(DIST, CODE + ".html"), "w", encoding="utf-8", newline="").write(out)
        shutil.copy2(os.path.join(BUILD, "card.json"), os.path.join(DIST, "card.json"))

    # ── 3 · report ─────────────────────────────────────────────────────────────────────────────
    for rel, how, n in added:
        print("  +  %-44s %-5s %8s" % (rel.replace(os.sep, "/"), how, ("%d B" % n) if n else "-"))
    for rel in held:
        r = rel.replace(os.sep, "/")
        print("  !  %-44s HELD - %s" % (r, HOLD[r]))
    for rel in orphans:
        print("  -  %-44s not referenced by the playable - not shipped" % rel.replace(os.sep, "/"))
    print("  =  %d asset(s) already in dist, left untouched" % skipped)
    total = sum(os.path.getsize(os.path.join(dp, f))
                for dp, _, fs in os.walk(DIST) for f in fs)
    print("  dist %d bytes = %.3f MB   cap %.0f MB   %s %d bytes"
          % (total, total / 1048576.0, CAP / 1048576.0,
             "FREE" if total <= CAP else "OVER BY", abs(CAP - total)))
    if total > CAP:
        sys.exit("  X  over the 10 MB cap")
    if not APPLY:
        print("  (dry run - nothing written; pass --apply)")


if __name__ == "__main__":
    main()
