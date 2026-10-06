# -*- coding: utf-8 -*-
"""Stop the title-screen Swiftee looping, so nothing moves while the play button pulses.

SME: "Swiftee is moving on the title page when play button is pulsating. not required. checklist
pointer." The checklist line is "when the Play button is pulsating, nothing else should move on the
screen except the subtle background elements."

She is an ANIMATED WEBP, and CSS cannot pause one - animation-play-state does not reach a decoded
image, and there is no static frame of her in the delivery to swap to. Buying one would cost ~30 KB
against 22 KB of headroom.

But the format already answers this: the ANIM chunk carries a 16-bit loop count, and 0 means loop
forever. Set to 1 she plays her 3.24s wave ONCE and then holds her last frame - well inside the
6.37s greeting, so by the time the greeting ends and the button starts pulsing she is already still.
That is exactly the behaviour asked for, it costs ZERO bytes, and it needs no new asset.

Two bytes change. Every frame, its timing and the image data are untouched, so nothing about how she
looks or moves on her one pass is affected.
"""
import io, os, struct, sys

TARGETS = ["build/assets/UI/new_landing_swiftee_anim.webp",
           "dist/assets/UI/new_landing_swiftee_anim.webp"]
LOOPS = 1


def anim_offset(b):
    """Byte offset of the ANIM chunk's loop-count field, or None."""
    i = 12                                    # past "RIFF<size>WEBP"
    while i + 8 <= len(b):
        tag = b[i:i + 4]
        size = struct.unpack("<I", b[i + 4:i + 8])[0]
        if tag == b"ANIM":
            return i + 12                     # 4 bytes background colour, then the loop count
        if tag == b"ANMF":
            return None                       # frames have started; there was no ANIM
        i += 8 + size + (size & 1)            # chunks are padded to even length
    return None


changed = 0
for path in TARGETS:
    if not os.path.exists(path):
        print("  %-52s (not present)" % path)
        continue
    b = bytearray(io.open(path, "rb").read())
    off = anim_offset(b)
    if off is None:
        print("  %-52s no ANIM chunk - not an animation, left alone" % path)
        continue
    before = struct.unpack("<H", bytes(b[off:off + 2]))[0]
    if before == LOOPS:
        print("  %-52s already loops %d time(s)" % (path, before))
        continue
    size_before = len(b)
    b[off:off + 2] = struct.pack("<H", LOOPS)
    io.open(path, "wb").write(bytes(b))
    assert os.path.getsize(path) == size_before, "file size must not change"
    print("  %-52s loop %s -> %d   (%d B, unchanged)"
          % (path, "infinite" if before == 0 else before, LOOPS, size_before))
    changed += 1

print("  %d file(s) changed, 2 bytes each" % changed)
