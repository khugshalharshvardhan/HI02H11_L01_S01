# -*- coding: utf-8 -*-
"""Cut the new vo_snd_ch back to the bare akshara, the way r4e cut it.

The SME's page-9 ruling is that the letter options speak the SOUND, not "च से चम्मच।", and r4e
trimmed ch/l/r to the consonant alone (ल 1.77->0.40s, र 1.69->0.38s, च 0.38s). check_bare_sounds
enforces it and refused the build the moment the new full-phrase take went in.

The new recording is kept - it is a better take than the old one - it is just cut to the same shape.
Method is r4e's, so the three clips stay siblings: cut points from a 20 ms energy envelope, 12 ms
fade in and 30 ms fade out so the cut cannot click. The full carrier is preserved beside the other
originals, because the ruling it contradicts is one the SME could still reverse.
"""
import io, math, os, struct, subprocess, sys, wave

ROOT = "D:/HI02H11_L01_S01_DEV_HANDOVER-20260914T100052Z-1-001/HI02H11_L01_S01_DEV_HANDOVER"
AID = "vo_snd_ch"
SRC = os.path.join(ROOT, "build", "assets", "Audio", AID + ".ogg")   # RIFF under .ogg, as build does
KEEP = os.path.join(ROOT, "_assets_round4", "vo_snd_originals", AID + ".carrier_20261008.ogg")
TARGET_MAX = 0.60                 # the guard's bar is 1.6s; its siblings sit at 0.38-0.40s
FADE_IN_MS, FADE_OUT_MS = 12, 30
HOP_MS = 20                       # r4e's envelope resolution


def read_wav(path):
    w = wave.open(path)
    n, sr, ch, sw = w.getnframes(), w.getframerate(), w.getnchannels(), w.getsampwidth()
    data = w.readframes(n); w.close()
    assert ch == 1 and sw == 2, "expected 16-bit mono, got %dch/%dbit" % (ch, sw * 8)
    return list(struct.unpack("<%dh" % n, data)), sr


s, sr = read_wav(SRC)
hop = max(1, int(sr * HOP_MS / 1000.0))
env = []
for i in range(0, len(s) - hop, hop):
    a = s[i:i + hop]
    env.append(math.sqrt(sum(float(v) * v for v in a) / len(a)))
peak = max(env) if env else 0.0
thr = peak * 0.12                                   # 12% of peak - the burst, not the room tone

start = next((i for i, v in enumerate(env) if v > thr), 0)
# the END of the first burst: the first frame after `start` that falls back under the threshold and
# STAYS under for 3 frames (60 ms). A single dip inside the consonant must not end the cut.
end = len(env) - 1
quiet = 0
for i in range(start + 1, len(env)):
    if env[i] <= thr:
        quiet += 1
        if quiet >= 3:
            end = i - 2
            break
    else:
        quiet = 0

a0 = max(0, start * hop - int(sr * 0.015))          # 15 ms of air before the burst
a1 = min(len(s), (end + 1) * hop + int(sr * 0.020))
cut = s[a0:a1]
fi, fo = int(sr * FADE_IN_MS / 1000.0), int(sr * FADE_OUT_MS / 1000.0)
for i in range(min(fi, len(cut))):
    cut[i] = int(cut[i] * (i / float(fi)))
for i in range(min(fo, len(cut))):
    j = len(cut) - 1 - i
    cut[j] = int(cut[j] * (i / float(fo)))

dur = len(cut) / float(sr)
print("  source     : %.2fs" % (len(s) / float(sr)))
print("  first burst: %.3fs .. %.3fs" % (a0 / float(sr), a1 / float(sr)))
print("  cut        : %.3fs" % dur)
if dur > TARGET_MAX:
    sys.exit("  REFUSED - %.2fs is not a bare akshara; the envelope did not find a clean burst" % dur)

if "--apply" in sys.argv:
    if not os.path.exists(KEEP):
        os.makedirs(os.path.dirname(KEEP), exist_ok=True)
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                        "-i", SRC, "-c", "copy", KEEP], check=False)
        if not os.path.exists(KEEP):
            io.open(KEEP, "wb").write(io.open(SRC, "rb").read())
    w = wave.open(SRC, "wb")
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(struct.pack("<%dh" % len(cut), *cut)); w.close()
    print("  written    : %s  (carrier kept at %s)" % (SRC, os.path.relpath(KEEP, ROOT)))
else:
    print("\n  DRY RUN - nothing written. Re-run with --apply.")
