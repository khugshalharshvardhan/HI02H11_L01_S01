# -*- coding: utf-8 -*-
"""Lengthen the FIRST आ of मामा so the word reads as माऽमाऽ rather than म-माऽ.

Measured first: the two आ in this take run 155ms and 240ms. In Hindi vowel length is phonemic, so a
first vowel at 65% of the second pulls the percept towards a short first syllable - which is what
the SME hears as "mamaa" instead of "maamaa".

Only the steady middle of that vowel is stretched. The म onset, the medial म, the second syllable
and both silences are untouched, and the joins are equal-power crossfades inside the vowel itself,
where the signal is stationary and a seam has nothing to catch on.

Worked from the SME's WAV, not from the shipped .ogg: the build master is already lossy and
stretching a decoded lossy signal re-quantises artefacts that were inaudible before.
"""
import numpy as np, os, subprocess, sys, wave

SRC = "_assets_round4/voiceovers_SME_20261008/vo_w_mama.wav"
T = "C:/Users/harsh/AppData/Local/Temp/claude/d--HI02H11-L01-S01-DEV-HANDOVER-20260914T100052Z-1-001/4f2a6bd0-e629-43c4-811f-afd4e693dd3a/scratchpad"
OUT_WAV = T + "/vo_w_mama_fixed.wav"

# the vowel to stretch, and what to stretch it to (both measured, see the module docstring)
VOWEL_MS = (405, 560)
TARGET_MS = 240
XF_MS = 12            # crossfade at each join, inside the stationary part of the vowel


def probe_rate(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0",
                          "-show_entries", "stream=sample_rate", "-of", "csv=p=0", p],
                         capture_output=True, text=True).stdout.strip()
    return int(out)


def load(p, sr):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(sr),
                          "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, dtype="<f4").astype(np.float64)


def save_wav(path, x, sr):
    y = np.clip(x, -1.0, 1.0)
    pcm = (y * 32767.0).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def stretch(seg, sr, factor):
    """slow `seg` down by `factor` using ffmpeg's atempo (WSOLA-style, pitch preserved)"""
    tmp_in, tmp_out = T + "/_st_in.wav", T + "/_st_out.wav"
    save_wav(tmp_in, seg, sr)
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_in,
                        "-filter:a", "atempo=%.6f" % (1.0 / factor), tmp_out],
                       capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit("atempo failed: " + r.stderr[:300])
    out = load(tmp_out, sr)
    for f in (tmp_in, tmp_out):
        try: os.remove(f)
        except OSError: pass
    return out


def xfade(a, b, n):
    """equal-power crossfade: a's tail into b's head over n samples"""
    if n <= 0 or len(a) < n or len(b) < n:
        return np.concatenate([a, b])
    t = np.linspace(0, np.pi / 2, n)
    fo, fi = np.cos(t), np.sin(t)
    mid = a[-n:] * fo + b[:n] * fi
    return np.concatenate([a[:-n], mid, b[n:]])


sr = probe_rate(SRC)
x = load(SRC, sr)
ms = lambda t: int(t * sr / 1000)

v0, v1 = ms(VOWEL_MS[0]), ms(VOWEL_MS[1])
have_ms = VOWEL_MS[1] - VOWEL_MS[0]
factor = TARGET_MS / have_ms

head, vowel, tail = x[:v0], x[v0:v1], x[v1:]
print("  source  : %s @ %d Hz, %.3fs" % (os.path.basename(SRC), sr, len(x) / sr))
print("  vowel   : %d-%d ms (%d ms), stretching x%.2f to reach %d ms"
      % (VOWEL_MS[0], VOWEL_MS[1], have_ms, factor, TARGET_MS))

vs = stretch(vowel, sr, factor)
print("  stretched to %.0f ms" % (1000 * len(vs) / sr))

y = xfade(head, vs, ms(XF_MS))
y = xfade(y, tail, ms(XF_MS))
# keep the original peak, so nothing about the mix level changes
if np.abs(y).max() > 0:
    y *= np.abs(x).max() / np.abs(y).max()
save_wav(OUT_WAV, y, sr)
print("  written : %s  (%.3fs, was %.3fs)" % (OUT_WAV, len(y) / sr, len(x) / sr))
