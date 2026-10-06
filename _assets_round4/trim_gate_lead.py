# -*- coding: utf-8 -*-
"""Take the leading silence off the three transition clips, so her mouth and her voice start together.

SME: "transition 1 - vo and visual not in sync."

Measured in the browser: the gate swaps to gate_talk.webp and starts the clip in the SAME tick
(+1531 ms, image decoded 7 ms later), so the engine's timing is already right. What is wrong is
inside the audio - vo_pt_tutorial holds ~280 ms of silence before the first word, so her mouth runs
for a third of a second against nothing. That reads exactly as "not in sync", and no engine tuning
fixes it while the silence is in the file.

Trimming is preferable to delaying the picture: it fixes all three gates with one rule rather than a
per-clip constant the engine has to carry, and it tightens the transition, which is the direction
the SME wants anyway.

Only LEADING silence goes, found at 28 dB below the clip's own peak and then backed off by 60 ms so
no consonant onset is clipped - a plosive starts quietly and a hard threshold eats it. Nothing after
the first word is touched.

FORMAT IS READ, NOT ASSUMED. The first run of this guessed that build/ held RIFF masters under .ogg
- true of the VO this lesson recorded, false of these three, which are INHERITED kit clips and are
real Ogg in both trees. The guess wrote a 470 KB WAV over an 18.8 KB Ogg. So now each file's own
container decides how it is written back, every output is checked for a sane duration and size
before it replaces anything, and the temp file sits beside the target (os.replace cannot cross drive
letters, and this repo is on D: while TEMP is on C:).
"""
import math, os, struct, subprocess, sys, wave

CLIPS = ["vo_pt_tutorial", "vo_pt_guided", "vo_pt_practice"]
TREES = ["build/assets/Audio", "dist/assets/Audio"]
GUARD_MS = 60
DROP_DB = 28
PROBE = "_probe_trim.wav"


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True)
    try:
        return float(out.stdout.strip())
    except ValueError:
        return None


def lead_silence(path):
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", path,
                    "-ac", "1", "-ar", "16000", PROBE], check=True)
    w = wave.open(PROBE)
    n, sr = w.getnframes(), w.getframerate()
    s = struct.unpack("<%dh" % n, w.readframes(n))
    w.close()
    os.remove(PROBE)
    hop = sr // 100
    def db(a):
        r = math.sqrt(sum(float(v) * v for v in a) / max(1, len(a)))
        return 20 * math.log10(r / 32768.0) if r > 0 else -99.0
    frames = [db(s[i:i + hop]) for i in range(0, n - hop, hop)]
    if not frames:
        return None
    thr = max(frames) - DROP_DB
    for i, v in enumerate(frames):
        if v > thr:
            return max(0.0, i / 100.0 - GUARD_MS / 1000.0)
    return None


changed = 0
for cid in CLIPS:
    for tree in TREES:
        src = os.path.join(tree, cid + ".ogg")
        if not os.path.exists(src):
            print("  %-36s (absent)" % src)
            continue
        head = open(src, "rb").read(4)
        if head != b"OggS":
            print("  %-36s container %r - not an Ogg, left alone" % (src, head))
            continue
        lead = lead_silence(src)
        dur0, size0 = duration(src), os.path.getsize(src)
        if lead is None or lead < 0.04:
            print("  %-36s lead %s - nothing worth trimming"
                  % (src, "n/a" if lead is None else "%.0f ms" % (lead * 1000)))
            continue
        tmp = src + ".tmp.ogg"
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", "%.3f" % lead,
                        "-i", src, "-ac", "1", "-c:a", "libopus", "-b:a", "28k", "-vbr", "on",
                        "-application", "audio", tmp], check=True)
        dur1, size1 = duration(tmp), os.path.getsize(tmp)
        # it must be shorter by about the lead, and not wildly bigger - either would mean the
        # container or the codec was misread, which is exactly how the first run did damage
        ok = (dur1 is not None and dur0 is not None
              and abs((dur0 - dur1) - lead) < 0.12
              and size1 < size0 * 1.35
              and open(tmp, "rb").read(4) == b"OggS")
        if not ok:
            os.remove(tmp)
            print("  %-36s REFUSED (%.2fs->%.2fs, %d->%d B) - left untouched"
                  % (src, dur0 or -1, dur1 or -1, size0, size1))
            continue
        os.replace(tmp, src)
        print("  %-36s lead %4.0f ms off   %.2fs -> %.2fs   %6d -> %6d B"
              % (src, lead * 1000, dur0, dur1, size0, size1))
        changed += 1

print("  %d clip(s) trimmed" % changed)
