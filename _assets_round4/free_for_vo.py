# -*- coding: utf-8 -*-
"""Free the room the new voice-over needs, without degrading anything the SME chose.

    PYTHONUTF8=1 python free_for_vo.py [--apply]

The 92 delivered takes need 267,271 bytes more than the delivery has. Two sources pay for it, and
neither is a quality decision about art anybody picked:

  1. loader.gif -> WebP. 83 frames of GIF is simply the wrong container. The pixel size does not
     change at all - it stays 300x300 for a 150px box, the retina 2x it already was - only the
     codec does. Frees ~155 KB. sync_dist repoints the reference the way it does for every other
     converted asset.

  2. sw_head_hint_anim and sw_head_tryagain_anim to a true 2x. Every sw_head_*_anim file is swapped
     into THE SAME <img> by setSwMood (app.js builds the src by concatenation), so they all render
     in one box - measured at 124 layout px. At 380px and 340px these are 3.1x and 2.7x past retina.
     Frees ~173 KB at q=70.

WHAT IS DELIBERATELY LEFT ALONE, each checked rather than assumed:
  * sw_head_celebrate_anim is the same chip - but the end screen ALSO points at it as the fallback
    behind the lip-synced celebration, where .end-mascot is 330px. Sized for that it is only 1.2x,
    so shrinking it for the chip would soften the one frame anybody sees if the kit fails to start.
  * sw_lg_hint_anim (858 KB) renders in .hint-mascot at 240px and is 524px - a correct 2x.
  * swifty_with_balloons is 408px for a 248px render - already under 2x.
  * THE FONTS. An earlier estimate that subsetting Baloo 2 would free 100 KB+ was wrong, and
    measuring it is what showed that: against Google's own subsetter, 66 Devanagari codepoints
    still pull in most of the face because of the conjunct glyphs, and the saving is ~10 KB per
    weight. Not worth risking a missing ligature in a Hindi reading lesson for 1/25th of the need.

PIL does the animated re-encode, not ffmpeg: ffmpeg's libwebp demuxer cannot read these files at all
("image data not found"). The per-frame durations are parsed straight out of the ANMF chunk headers
and handed back to the encoder, because PIL's own reader reports info['duration'] as None - so a
naive round-trip would silently retime the animation.
"""
import io, os, struct, subprocess, sys

ROOT = "D:/HI02H11_L01_S01_DEV_HANDOVER-20260914T100052Z-1-001/HI02H11_L01_S01_DEV_HANDOVER"
UI = os.path.join(ROOT, "dist", "assets", "UI")
APPLY = "--apply" in sys.argv
CHIP_PX = 124                      # measured; the only box these two are ever drawn in
QUALITY = 70
HEADS = ["sw_head_hint_anim", "sw_head_tryagain_anim"]


def anmf_durations(path):
    b = io.open(path, "rb").read()
    i, out = 12, []
    while i + 8 <= len(b):
        tag = b[i:i + 4]
        size = struct.unpack("<I", b[i + 4:i + 8])[0]
        if tag == b"ANMF":
            out.append(b[i + 20] | (b[i + 21] << 8) | (b[i + 22] << 16))
        i += 8 + size + (size & 1)
    return out


freed = 0
print("  %-30s %10s %10s %10s" % ("asset", "before", "after", "freed"))

gif, webp = os.path.join(UI, "loader.gif"), os.path.join(UI, "loader.webp")
if os.path.exists(gif):
    tmp = webp + ".tmp.webp"
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", gif,
                    "-c:v", "libwebp", "-lossless", "0", "-q:v", "72", "-loop", "0",
                    "-preset", "picture", tmp], check=True)
    b4, af = os.path.getsize(gif), os.path.getsize(tmp)
    print("  %-30s %9dB %9dB %+9d" % ("loader.gif -> loader.webp", b4, af, af - b4))
    freed += b4 - af
    if APPLY:
        os.replace(tmp, webp); os.remove(gif)
    else:
        os.remove(tmp)

from PIL import Image, ImageSequence
for stem in HEADS:
    src = os.path.join(UI, stem + ".webp")
    if not os.path.exists(src):
        continue
    im = Image.open(src)
    w, h = im.size
    D = anmf_durations(src)
    scale = (CHIP_PX * 2) / float(max(w, h))
    if scale >= 0.98:
        print("  %-30s already within 2x - left alone" % stem)
        continue
    nw = max(2, int(round(w * scale)) // 2 * 2)
    nh = max(2, int(round(h * scale)) // 2 * 2)
    frames = [f.convert("RGBA").resize((nw, nh), Image.LANCZOS) for f in ImageSequence.Iterator(im)]
    tmp = src + ".tmp.webp"
    frames[0].save(tmp, "WEBP", save_all=True, append_images=frames[1:],
                   duration=D or 90, loop=0, quality=QUALITY, method=4)
    b4, af = os.path.getsize(src), os.path.getsize(tmp)
    ok = sum(anmf_durations(tmp)) == sum(D) and Image.open(tmp).n_frames == len(D)
    if not ok:
        os.remove(tmp)
        print("  %-30s REFUSED - frames or timing changed" % stem)
        continue
    print("  %-30s %9dB %9dB %+9d   %dx%d -> %dx%d, %d frames, %dms kept"
          % (stem, b4, af, af - b4, w, h, nw, nh, len(D), sum(D)))
    freed += b4 - af
    if APPLY:
        os.replace(tmp, src)
    else:
        os.remove(tmp)

NEED = 267271
print()
print("  freed             : %9d B" % freed)
print("  the new VO needs  : %9d B" % NEED)
print("  margin            : %+9d B  -> %s" % (freed - NEED, "ENOUGH" if freed >= NEED else "NOT ENOUGH"))
if not APPLY:
    print("\n  DRY RUN - nothing written. Re-run with --apply.")
