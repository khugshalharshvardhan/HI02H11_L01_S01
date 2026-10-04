# -*- coding: utf-8 -*-
"""Turn the SME's 18.46s background music into a bed that loops without a seam.

The source is a finished PIECE, not a loop: it holds a steady ~-20 dB for 17 seconds, strikes a
final chord at -1.15s and rings out to -44 dB. Play that on repeat and every pass ends by fading
into near-silence and then snapping back to full level - which is exactly the "abrupt cut or break"
the SME asked not to hear.

So the ring-out is folded back over the beginning: the loop body is s[0:L], and across the first T
of it the head fades UP while the discarded tail s[L:N] fades DOWN over the top. The join is then
continuous BY CONSTRUCTION at sample level - the sample before the wrap is s[L-1] and the one after
is s[L], the two that were already adjacent in the source - and musically it is the last chord
ringing out over the next pass, which is what a musician would do by hand.

An equal-power (sin/cos) law is used rather than linear: two decorrelated signals summed with linear
gains dip about 3 dB in the middle, and a 3 dB hole once per pass is audible on a bed this steady.

HOW THE SEAM IS SCORED
----------------------
Not against the piece's average - that was the first attempt and it was wrong, because it charged
every loop for the music's own dynamics and reported 11 dB on a join that is continuous by
construction. What makes a seam audible is a LEVEL JUMP that the ear hears as an edit, so the real
question is whether the jump at the wrap is unusual FOR THIS PIECE. The envelope's consecutive-window
differences are therefore collected across the whole bed to learn what a normal musical transition
looks like, and the seam's own jump is reported as a percentile of that distribution. A seam sitting
mid-distribution is indistinguishable from an ordinary bar line; the raw loop sits far outside it.
"""
import math, struct, wave

SRC = "build/assets/Audio/Standard Background Music 1.wav"
OUT = "build/assets/Audio/sfx_bg_music.wav"
HOP_MS = 50

w = wave.open(SRC)
N, SR = w.getnframes(), w.getframerate()
assert w.getnchannels() == 1 and w.getsampwidth() == 2, "expected 16-bit mono"
S = list(struct.unpack("<%dh" % N, w.readframes(N)))
w.close()
HOP = int(SR * HOP_MS / 1000.0)


def db(a):
    if not a:
        return -99.0
    r = math.sqrt(sum(float(v) * v for v in a) / len(a))
    return 20 * math.log10(r / 32768.0) if r > 0 else -99.0


def env(sig):
    return [db(sig[i:i + HOP]) for i in range(0, len(sig) - HOP, HOP)]


def build(T):
    L = N - T
    out = S[:L]
    for i in range(T):
        x = (i + 0.5) / T
        g_head, g_tail = math.sin(x * math.pi / 2), math.cos(x * math.pi / 2)
        out[i] = int(max(-32768, min(32767, round(S[i] * g_head + S[L + i] * g_tail))))
    return out


def seam(loop):
    """(jump at the wrap in dB, its percentile among this piece's own transitions)."""
    e = env(loop + loop)
    jumps = sorted(abs(e[i + 1] - e[i]) for i in range(len(e) - 1))
    j = len(loop) // HOP                                   # window index of the wrap
    at = max(abs(e[k + 1] - e[k]) for k in range(j - 1, j + 1))
    pct = 100.0 * sum(1 for v in jumps if v <= at) / len(jumps)
    return at, pct


print("  source %.3fs, %d Hz, median %.1f dB" % (N / SR, SR, db(S)))
j, p = seam(S)
print("  raw loop, no crossfade        jump %5.1f dB at the wrap = %.0fth pct of this piece" % (j, p))
print("                                (that is the break: a transition louder than %.0f%% of every"
      " bar line in the music)" % p)
print()

best = None
for ms in (600, 800, 1000, 1300, 1600, 2000, 2500):
    T = int(SR * ms / 1000.0)
    loop = build(T)
    j, p = seam(loop)
    mark = ""
    # ranked on the JUMP, not the percentile: the percentile is the readable form of the same
    # number and quantises too coarsely to separate near-ties, and where two crossfades score alike
    # the shorter one is better - it overwrites less of the piece, so each pass holds more music.
    if best is None or j < best[1] - 1e-9:
        best, mark = (p, j, ms, loop), "  <-"
    print("  crossfade %4d ms -> %6.3fs      jump %5.1f dB = %3.0fth pct%s" % (ms, len(loop) / SR, j, p, mark))

p, j, ms, loop = best
print()
print("  chosen %d ms -> %.3fs loop: the wrap now jumps %.1f dB, quieter than %.0f%% of the piece's"
      " own transitions" % (ms, len(loop) / SR, j, 100 - p))

o = wave.open(OUT, "wb")
o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR)
o.writeframes(struct.pack("<%dh" % len(loop), *loop))
o.close()
print("  wrote %s  (%.3fs)" % (OUT, len(loop) / SR))
