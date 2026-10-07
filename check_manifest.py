# -*- coding: utf-8 -*-
"""Check the VO manifest against the DELIVERED page, one check per bullet the reviewer listed.

Checked against dist/ rather than build/ on purpose: dist is the file that actually ships and is
what a reviewer plays, so if the two ever drifted it is dist that the recording has to match.
"""
import io, json, os, re, sys
import openpyxl

ROOT = "D:/HI02H11_L01_S01_DEV_HANDOVER-20260914T100052Z-1-001/HI02H11_L01_S01_DEV_HANDOVER"
PAGE = os.path.join(ROOT, "dist", "HI02H11_L01_S01.html")
XLSX = os.path.join(ROOT, "build", "assets", "Audio", "audio_manifest.xlsx")

html = io.open(PAGE, encoding="utf-8", newline="").read()
CARD = json.loads(re.search(r'id="cardData"[^>]*>(.*?)</script>', html, re.S).group(1))
TEXT = CARD["assets"].get("audio_text", {})
DECL = set(CARD["assets"].get("audio") or {})

wb = openpyxl.load_workbook(XLSX)
ws = wb["HI02H11_L01_S01"]
rows = [r for r in ws.iter_rows(min_row=2, values_only=True) if isinstance(r[0], int)]

fails = []
def check(label, ok, detail=""):
    print("  %-62s %s%s" % (label, "PASS" if ok else "FAIL", ("\n      " + detail) if detail else ""))
    if not ok:
        fails.append(label)

print("  manifest : %s" % XLSX)
print("  checked against the DELIVERED page: dist/HI02H11_L01_S01.html")
print("  %d rows\n" % len(rows))

# 1 · every text comes from the latest card
stale = [(r[2], r[4], TEXT.get(r[2])) for r in rows
         if TEXT.get(r[2]) is not None and (TEXT[r[2]] or "").strip() != (r[4] or "").strip()]
check("1. every Hindi line matches the shipped card", not stale,
      "; ".join(x[0] for x in stale[:5]))

# 2 · page sequence is monotonic
def pnum(lbl):
    if lbl == "cover":  return 0
    if lbl == "engine": return 99
    m = re.match(r"page (\d+)", str(lbl or ""))
    return int(m.group(1)) if m else None
seq, cur = [], None
for r in rows:
    if r[1]:
        cur = pnum(r[1])
    seq.append(cur)
mono = all(a is not None and b is not None and a <= b for a, b in zip(seq, seq[1:]))
check("2. rows run in game page-number order, never backwards",
      mono, "order seen: %s" % sorted(set(x for x in seq if x is not None)))

# 3 · within a page, the order is the play order the generator computed
sys.path.insert(0, ROOT)
os.chdir(ROOT)
import importlib.util
spec = importlib.util.spec_from_file_location("mm", os.path.join(ROOT, "make_manifests.py"))
mm = importlib.util.module_from_spec(spec)
try:
    spec.loader.exec_module(mm)
except SystemExit:
    pass
PI = mm.play_index()
want = [a for a, _ in sorted(((r[2], PI.get(r[2], (98, 0))) for r in rows), key=lambda t: t[1])]
got = [r[2] for r in rows]
check("3. inside each page, clips sit in play order", want == got,
      "first divergence: %s" % next((("%s vs %s" % (a, b)) for a, b in zip(want, got) if a != b), "-"))

# 4 · nothing outdated survives
orphan = [r[2] for r in rows if r[2] not in DECL]
missing = [a for a, (pg, _) in PI.items() if pg not in (98, 99) and a not in {r[2] for r in rows}]
check("4a. no row for an id the game no longer declares", not orphan, ", ".join(orphan[:6]))
check("4b. no clip the game can reach is absent from the sheet", not missing, ", ".join(missing[:6]))

# and the thing that started this
old = "C:/Users/harsh/Downloads/HI02H11_L01_S01_audio_manifest.xlsx"
check("5. the September export is no longer sitting under its old name",
      not os.path.exists(old), old)

print()
print("  %d check(s) failed" % len(fails))
sys.exit(1 if fails else 0)
