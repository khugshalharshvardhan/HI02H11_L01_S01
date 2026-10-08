# -*- coding: utf-8 -*-
"""Take the self-introduction back out of the new vo_landing.

    PYTHONUTF8=1 python splice_landing.py [--apply]

The October take says «नमस्ते दोस्त, मैं हूँ स्विफ्टी। आज हम जानेंगे...». The middle clause is the one
the SME removed three separate times - "ONLY THIS NO EXTRA VO AUDIO", "I want only ... thats it",
and finally "this dont change this" about the exact wording. It is back because the studio recorded
from the SEPTEMBER manifest, which still carried the pre-r6 line; that is the risk flagged when the
stale export was found, and it landed.

Three ways out, and this is the least bad:
  * ship it as delivered - undoes an instruction given three times. No.
  * keep the old clip - it says the approved line, but it is SYNTHESISED, and the whole point of
    this delivery is a human voice.
  * cut the clause - gives a HUMAN take of the approved line.

The cut is only safe because the recording leaves a 640 ms gap between «स्विफ्टी।» and «आज», measured
off a 20 ms energy envelope. Both ends land inside silence, so there is no word to clip; the join
gets a 25 ms equal-power crossfade so it cannot tick. The delivered take is kept untouched in
_assets_round4/voiceovers_SME_20261008/ - this writes only the build copy, and the SME can overrule.
"""
import io, math, os, struct, subprocess, sys, tempfile, wave

ROOT = "D:/HI02H11_L01_S01_DEV_HANDOVER-20260914T100052Z-1-001/HI02H11_L01_S01_DEV_HANDOVER"
DEST = os.path.join(ROOT, "build", "assets", "Audio", "vo_landing.ogg")
CUT_FROM, CUT_TO = 1.12, 2.92      # inside the 1.08-1.50 and 2.38-3.02 silences
XF_MS = 25
APPLY = "--apply" in sys.argv


def read(path):
    w = os.path.join(tempfile.gettempdir(), "_vl_in.wav")
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", path,
                    "-ac", "1", "-c:a", "pcm_s16le", w], check=True)
    f = wave.open(w)
    n, sr = f.getnframes(), f.getframerate()
    s = list(struct.unpack("<%dh" % n, f.readframes(n)))
    f.close()
    return s, sr


def rms_db(a):
    if not a:
        return -99.0
    r = math.sqrt(sum(float(v) * v for v in a) / len(a))
    return 20 * math.log10(r / 32768.0) if r > 0 else -99.0


s, sr = read(DEST)
a, b = int(CUT_FROM * sr), int(CUT_TO * sr)
win = int(sr * 0.02)
print("  clip            : %.2fs" % (len(s) / float(sr)))
print("  cutting         : %.2fs .. %.2fs   (%.2fs removed)" % (CUT_FROM, CUT_TO, CUT_TO - CUT_FROM))
print("  level at the cut: in %.1f dB, out %.1f dB   (both must be silence)"
      % (rms_db(s[a - win:a + win]), rms_db(s[b - win:b + win])))

xf = int(sr * XF_MS / 1000.0)
head, tail = s[:a], s[b:]
out = head[:-xf] if len(head) > xf else head[:]
for i in range(xf):
    g = (i + 0.5) / xf
    hv = head[len(head) - xf + i] if len(head) >= xf else 0
    tv = tail[i] if i < len(tail) else 0
    out.append(int(max(-32768, min(32767,
               hv * math.cos(g * math.pi / 2) + tv * math.sin(g * math.pi / 2)))))
out.extend(tail[xf:])
print("  result          : %.2fs" % (len(out) / float(sr)))

if APPLY:
    w = wave.open(DEST, "wb")
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(struct.pack("<%dh" % len(out), *out)); w.close()
    print("  written to %s" % os.path.relpath(DEST, ROOT))
else:
    print("\n  DRY RUN - nothing written. Re-run with --apply.")
