# -*- coding: utf-8 -*-
"""Where inside each transition clip does its on-screen phrase start, and which stretches are voiced?

The SME wants the gate title to appear only when Swiftie actually says it. That needs two numbers per
phase, both measured from OUR OWN clips rather than copied from the reference lesson - its gate VO is
a different recording, and ours were trimmed in r8d besides:

    title_cue_ms   when the phrase begins inside the clip
    title_voice_ms the voiced stretches from there on, so the letters can be typed in step with the
                   voice instead of on a timer of their own

Transcribed first, so the structure is known rather than guessed:
    vo_pt_tutorial  "ध्यान से देखिए और मेरे साथ जानिए। चलिए शुरू करें।"   - the phrase is the LAST sentence
    vo_pt_practice  "वाह अब आपकी बारी"                                   - the phrase follows one word

So the cue is the onset of the final voiced block in each clip, found from the silence structure: the
last gap long enough to be a sentence break, not a breath between words.
"""
import json, math, os, struct, subprocess, sys, tempfile, wave

ROOT = "D:/HI02H11_L01_S01_DEV_HANDOVER-20260914T100052Z-1-001/HI02H11_L01_S01_DEV_HANDOVER"
HOP_MS = 10
GAP_MS = 220               # a sentence break; a gap between words is shorter
DROP_DB = 26

# phase -> (clip, how many voiced blocks the PHRASE itself spans)
CLIPS = {"tutorial": "vo_pt_tutorial", "guided": "vo_pt_guided", "practice": "vo_pt_practice"}


def envelope(path):
    w = os.path.join(tempfile.gettempdir(), "_cue.wav")
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", path,
                    "-ac", "1", "-ar", "16000", w], check=True)
    f = wave.open(w)
    n, sr = f.getnframes(), f.getframerate()
    s = struct.unpack("<%dh" % n, f.readframes(n))
    f.close()
    hop = max(1, int(sr * HOP_MS / 1000.0))
    out = []
    for i in range(0, n - hop, hop):
        a = s[i:i + hop]
        r = math.sqrt(sum(float(v) * v for v in a) / len(a))
        out.append(20 * math.log10(r / 32768.0) if r > 0 else -99.0)
    return out, n / float(sr)


def blocks(env):
    """Voiced runs as (start_ms, end_ms), merging gaps shorter than GAP_MS."""
    thr = max(env) - DROP_DB
    runs, cur = [], None
    for i, v in enumerate(env):
        if v > thr:
            if cur is None:
                cur = [i, i]
            else:
                cur[1] = i
        elif cur is not None and (i - cur[1]) * HOP_MS >= GAP_MS:
            runs.append((cur[0] * HOP_MS, cur[1] * HOP_MS)); cur = None
    if cur is not None:
        runs.append((cur[0] * HOP_MS, cur[1] * HOP_MS))
    return runs


cue, voice, dur_ms = {}, {}, {}
for phase, aid in CLIPS.items():
    p = os.path.join(ROOT, "build", "assets", "Audio", aid + ".ogg")
    if not os.path.exists(p):
        print("  %-9s %-16s (absent)" % (phase, aid)); continue
    env, secs = envelope(p)
    bl = blocks(env)
    # THE PHRASE STARTS AFTER THE LONGEST SILENCE, and spans every block from there to the end.
    # Taking only the final block was wrong and the numbers showed it: «चलिए शुरू करें।» is two
    # blocks (चलिए / शुरू करें) with a 360ms breath between them, so the title would have begun
    # appearing on «शुरू» with «चलिए» already spoken. The longest gap is the sentence break - 670ms
    # on the tutorial clip against 360-390ms for the breaths inside the phrase.
    gaps = [(bl[i + 1][0] - bl[i][1], i + 1) for i in range(len(bl) - 1)]
    first = max(gaps)[1] if gaps else 0
    phrase = bl[first:] if bl else []
    cue[phase] = phrase[0][0] if phrase else 0
    voice[phase] = [[a, b] for a, b in phrase]
    dur_ms[phase] = (phrase[-1][1] - phrase[0][0]) if phrase else 0
    print("  %-9s %-16s %.2fs   blocks: %s" % (phase, aid, secs,
          ", ".join("%d-%dms" % (a, b) for a, b in bl)))
    print("  %-9s %-16s cue=%dms  dur=%dms" % ("", "", cue[phase], dur_ms[phase]))

print()
print(json.dumps({"title_cue_ms": cue, "title_dur_ms": dur_ms, "title_voice_ms": voice},
                 indent=1, sort_keys=True))
