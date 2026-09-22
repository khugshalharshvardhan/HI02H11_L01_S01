# -*- coding: utf-8 -*-
"""Take a folder of delivered VO recordings into build/, validated.

    PYTHONUTF8=1 python intake_vo.py <delivered_folder> [--apply]

Dry run by default: it tells you what it would do and what is wrong, and changes nothing. Add
--apply to actually write into build/assets/Audio/.

WHY AN INTAKE STEP AND NOT JUST "COPY THE FILES IN"
The engine loads `assets/Audio/<id>.ogg`, so that is the name a clip must have on disk. But the
content in build/ is 16-BIT PCM WAV, not Ogg — gen_tts writes RIFF under an .ogg name and only the
dist step re-encodes to real Opus. That mismatch is invisible until it bites:

  * the karaoke word-highlighting is timed by READING THE WAVEFORM (`_wav_mono16` in the recipe),
    and that reader accepts 16-bit RIFF and nothing else. Hand it an MP3, an Ogg or a 24-bit WAV
    and it returns no segments — the clip still plays, the highlighting silently falls back to
    wall-clock guessing, and the words drift out of sync with the voice. That is exactly the defect
    the SME reported in r5e, and it would come back one clip at a time with no error anywhere.
  * the build's own length guard only checks that a clip is long enough to hold its line, so a
    correctly-long clip in the wrong format passes every existing check.

So this script refuses quietly-wrong files instead of letting them through.
"""
import io, json, os, shutil, subprocess, sys

BUNDLE = "build"
SRC = None
APPLY = "--apply" in sys.argv
for a in sys.argv[1:]:
    if not a.startswith("--"): SRC = a
if not SRC:
    sys.exit(__doc__)

card = json.load(io.open(os.path.join(BUNDLE, "card.json"), encoding="utf-8"))
TEXT = card["assets"]["audio_text"]
DEST = os.path.join(BUNDLE, "assets", "Audio")


def wav_spec(path):
    """(ok, description). Parses the RIFF header the same way the recipe's reader does."""
    d = io.open(path, "rb").read(4096)
    if d[:4] != b"RIFF":
        kind = ("Ogg" if d[:4] == b"OggS" else
                "MP3" if d[:3] == b"ID3" or d[:2] == b"\xff\xfb" else
                "MP4/M4A" if d[4:8] == b"ftyp" else "unknown")
        return False, "not WAV (%s)" % kind
    i = 12
    while i + 8 <= len(d):
        cid, n = d[i:i + 4], int.from_bytes(d[i + 4:i + 8], "little")
        if cid == b"fmt ":
            ch = int.from_bytes(d[i + 10:i + 12], "little")
            sr = int.from_bytes(d[i + 12:i + 16], "little")
            bits = int.from_bytes(d[i + 22:i + 24], "little")
            desc = "%dHz %dch %dbit" % (sr, ch, bits)
            if bits != 16:
                return False, desc + "  <- must be 16-bit (the speech map reads 16-bit PCM only)"
            return True, desc + ("" if ch == 1 else "  (stereo: one channel will be used)")
        i += 8 + n + (n & 1)
    return False, "WAV with no fmt chunk"


have = {}
for f in sorted(os.listdir(SRC)):
    stem, ext = os.path.splitext(f)
    if ext.lower() in (".wav", ".ogg", ".mp3", ".m4a", ".flac"):
        have.setdefault(stem, []).append(f)

# [r5x] These ids must ship as the BARE akshara, but their audio_text is the "<letter> से <word>"
# carrier, because that text doubles as the recording script. A studio reads what it is given, so a
# delivery will hand back the carrier - which is exactly what happened on the first real delivery,
# and it surfaced as a build failure rather than an intake one. Warn here instead.
BARE_IDS = ("vo_snd_ch", "vo_snd_l", "vo_snd_r",
            "vo_ltr_ch", "vo_ltr_l", "vo_ltr_r", "vo_ltr_p", "vo_ltr_m", "vo_ltr_n")
BARE_MAX = 1.6


def wav_seconds(path):
    d = io.open(path, "rb").read()
    if d[:4] != b"RIFF": return None
    i, br = 12, 0
    while i + 8 <= len(d):
        cid, n = d[i:i + 4], int.from_bytes(d[i + 4:i + 8], "little")
        if cid == b"fmt ": br = int.from_bytes(d[i + 16:i + 20], "little")
        elif cid == b"data": return n / br if br else None
        i += 8 + n + (n & 1)
    return None


known = set(TEXT)
print("delivered folder: %s" % SRC)
print("%-18s %-30s %s" % ("VO ID", "format", "action"))
print("-" * 92)
ok = bad = unknown = 0
plan = []
for stem in sorted(have):
    files = have[stem]
    if stem not in known:
        print("%-18s %-30s %s" % (stem, "-", "!! not an audio id in this lesson - SKIPPED"))
        unknown += 1
        continue
    if len(files) > 1:
        print("%-18s %-30s %s" % (stem, "-", "!! %d files share this id: %s" % (len(files), files)))
        bad += 1
        continue
    src = os.path.join(SRC, files[0])
    good, desc = wav_spec(src)
    if not good:
        print("%-18s %-30s %s" % (stem, desc, "!! REJECTED - re-export as 16-bit mono WAV"))
        bad += 1
        continue
    note = ""
    if stem in BARE_IDS:
        sec = wav_seconds(src)
        if sec and sec > BARE_MAX:
            note = "  !! %.2fs - this id ships as the BARE letter, but the script gives it the carrier phrase; it needs trimming to the first burst" % sec
    dst = os.path.join(DEST, stem + ".ogg")     # the name the engine loads; content stays WAV
    print("%-18s %-30s %s%s" % (stem, desc, ("replace " if os.path.exists(dst) else "add     ") + stem + ".ogg", note))
    plan.append((src, dst))
    ok += 1

missing = sorted(known - set(have))
print("-" * 92)
print("%d accepted, %d rejected, %d unrecognised, %d lesson lines not in this delivery"
      % (ok, bad, unknown, len(missing)))
if missing and len(missing) <= 20:
    print("   still to come: %s" % ", ".join(missing))

if not APPLY:
    print("\nDRY RUN - nothing written. Re-run with --apply to take these in.")
    sys.exit(0)
if bad:
    sys.exit("\nRefusing to apply while %d file(s) are rejected - fix those first." % bad)

for src, dst in plan:
    shutil.copyfile(src, dst)
print("\ncopied %d clip(s) into %s" % (len(plan), DEST))
print("NEXT: rebuild, then re-cut dist, then regenerate the manifest:")
print("   cd D:/Dev_Kit/factories/FLN_Content_Factory && python KG/HI02H11_L01_S01/rebuild_isolated.py")
print("   python make_manifests.py build")
print("The rebuild recomputes audio_dur and the speech map, so the highlighting re-times itself.")
