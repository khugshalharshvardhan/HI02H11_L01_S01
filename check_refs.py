# -*- coding: utf-8 -*-
"""Can every asset the deliverables NAME actually be opened from the folder they ship in?

    PYTHONUTF8=1 python check_refs.py          # exit 1 if anything reachable is missing

Why this exists
---------------
sync_dist.py answers "should this file be copied in?". This answers the opposite and more important
question: "the page asks for this at runtime - is it there?". r8a needed both. The celebration kit
names its three sprite sheets as base + src, which no rule in sync_dist could see, so the sheets were
silently left out and the end screen animated nothing; the same blind spot then shipped again in the
standalone demo. A missing asset is invisible until someone watches the exact screen that needs it,
which is precisely the kind of thing that should be a check rather than a memory.

Four reference styles have to be followed, because the bundle uses all four and each one has at some
point hidden a missing file from a check that only knew the other three:
  * a literal "assets/.../x.png" written into the markup;
  * an id in assets.audio, played as "assets/Audio/<id>." + audio_ext;
  * a value in assets.image, which is ALREADY a full path, not a stem - appending the extension to it
    is what made the first run of this report cry 24 phantom misses;
  * base + src, which is how the celebration kit and the gate name their sheets.

Two kinds of miss are NOT failures, and both are listed rather than hidden so they stay visible:
  * AWAITING - the hint lines the studio has not recorded yet. The build ships the card that names
    them so the recording list is derivable from the delivery itself; see make_manifests.py.
  * UNREACHABLE - named in the bundle but on no path this card can take. Each is justified below,
    because "it's probably dead code" is exactly the assumption that lets a real miss through.
"""
import io, json, os, re, sys

TARGETS = [("dist", "HI02H11_L01_S01.html"), ("balloon_game_standalone", "index.html")]
AWAITING = re.compile(r"_h\d(?:\.|$)")      # vo_g2_h1 & friends - the studio's outstanding list

# Named in the bundle, reachable by nothing this card does. Verified individually, not assumed.
UNREACHABLE = {
    "assets/Images/obj_crane.png":
        "drawn by the bt-crane mechanic; this card ships no slide of that type",
    "assets/UI/hint.png":
        "swapped onto #hintImg, which this shell has no element for - both uses are if(hi)-guarded, "
        "and the hint button really draws the shipped sw_head_hint*.webp",
    "assets/UI/hint_active.png":
        "the pressed state of the same absent #hintImg",
    "assets/UI/peeking.webp":
        "r8a's three-piece gate replaced it; the single-image fallback it belongs to runs only when "
        "the card ships no gate.peek, and this one does. Remaining hits are prose in comments.",
    "assets/UI/peeking_pal.gif":
        "named only inside a comment describing the old gate",
    "assets/UI/startnew_bg.webp":
        "deliberately not shipped - see HOLD in sync_dist.py; the landing falls back to flat #47BCFD",
}


def scan(root, page):
    h = io.open(os.path.join(root, page), encoding="utf-8", newline="").read()
    c = json.loads(re.search(r'id="cardData"[^>]*>(.*?)</script>', h, re.S).group(1))
    A = c.get("assets", {})
    aext = A.get("audio_ext", "ogg")
    named = []                                           # (kind, what, path-relative-to-root)

    for aid in (A.get("audio") or {}):
        named.append(("audio", aid, "assets/Audio/%s.%s" % (aid, aext)))
    for iid, v in (A.get("image") or {}).items():
        named.append(("image", iid,
                      v if isinstance(v, str) and v.startswith("assets/")
                      else "assets/Images/%s.%s" % (iid, A.get("img_ext", "png"))))
    for lit in sorted(set(re.findall(
            r"assets/[A-Za-z0-9_./ -]+?\.(?:png|jpe?g|webp|svg|gif|mp3|wav|ogg|opus)", h))):
        named.append(("path", lit, lit))
    if c.get("end_anim"):
        for k in ("shabaash", "talk", "idle"):
            s = c["end_anim"][k]["src"]
            named.append(("celebration", k, "assets/UI/celebration/" + s))
    for k, v in (c.get("gate") or {}).items():
        if isinstance(v, str) and v.startswith("assets/"):
            named.append(("gate", k, v))

    missing, awaiting, dead = [], set(), set()
    for kind, what, rel in named:
        if os.path.exists(os.path.join(root, rel.replace("/", os.sep))):
            continue
        if AWAITING.search(rel):
            awaiting.add(rel)
        elif rel in UNREACHABLE:
            dead.add(rel)
        else:
            missing.append("%s:%s -> %s" % (kind, what, rel))
    return len(named), missing, sorted(awaiting), sorted(dead)


def main():
    bad = 0
    for root, page in TARGETS:
        if not os.path.isdir(root):
            print("  %-24s (not built)" % root)
            continue
        n, missing, awaiting, dead = scan(root, page)
        print("  %s — %d references checked" % (root, n))
        if missing:
            bad += len(missing)
            print("      MISSING, and reachable:")
            for m in missing:
                print("        X  " + m)
        else:
            print("      ok   every reachable reference resolves")
        if awaiting:
            print("      ..   %d awaiting the studio (hint lines)" % len(awaiting))
        for rel in dead:
            print("      --   %s  (%s)" % (rel, UNREACHABLE[rel]))
    if bad:
        sys.exit("  X  %d reachable asset(s) missing" % bad)


if __name__ == "__main__":
    main()
