# -*- coding: utf-8 -*-
"""The portrait gate, on an emulated phone - and the desktop case it must NOT fire on.

Device emulation via CDP rather than a narrow window: the rule is "(orientation:portrait) and
(pointer:coarse)", and only emulation gives a coarse pointer. A resized desktop window is portrait
with a FINE pointer, which is exactly the case that must stay untouched.
"""
import sys, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

DIST = "D:/HI02H11_L01_S01_DEV_HANDOVER-20260914T100052Z-1-001/HI02H11_L01_S01_DEV_HANDOVER/dist"
fails = []


def check(l, ok, d=""):
    print("  %-52s %s%s" % (l, "PASS" if ok else "FAIL", ("   " + d) if d else ""))
    if not ok:
        fails.append(l)


def mk():
    o = Options()
    for f in ("--headless=new", "--autoplay-policy=no-user-gesture-required",
              "--allow-file-access-from-files", "--mute-audio", "--log-level=3"):
        o.add_argument(f)
    return webdriver.Chrome(options=o)


def phone(d, w, h):
    d.execute_cdp_cmd("Emulation.setDeviceMetricsOverride",
                      {"width": w, "height": h, "deviceScaleFactor": 2, "mobile": True})
    d.execute_cdp_cmd("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})


STATE = """
  const g=document.getElementById('rotGate'); const c=getComputedStyle(g);
  return {display:c.display, blocked:document.body.classList.contains('rot-blocked'),
          scale:+(getComputedStyle(document.documentElement).getPropertyValue('--scale')||0),
          talking:document.body.classList.contains('vo-lock'),
          text:((document.querySelector('.rot-hi')||{}).textContent||'').trim()};"""

# ── a phone held upright ──────────────────────────────────────────────────────────────────────
d = mk()
try:
    phone(d, 390, 844)
    d.get("file:///%s/HI02H11_L01_S01.html" % DIST)
    time.sleep(4.0)
    r = d.execute_script(STATE)
    check("portrait phone: the gate is shown", r["display"] == "flex", str(r))
    check("portrait phone: it says to turn the phone", r["text"] == "फ़ोन को घुमाइए", repr(r["text"]))
    check("portrait phone: the lesson behind it is blocked", r["blocked"], str(r["blocked"]))
    check("portrait phone: nothing is talking to a hidden screen", not r["talking"],
          "vo-lock=%s" % r["talking"])
    d.save_screenshot("rot_portrait.png")

    # ── turned sideways ───────────────────────────────────────────────────────────────────────
    phone(d, 844, 390)
    time.sleep(3.0)
    r2 = d.execute_script(STATE)
    check("landscape: the gate is gone", r2["display"] == "none", str(r2["display"]))
    check("landscape: the lesson is live again", not r2["blocked"], str(r2["blocked"]))
    check("landscape: the stage is far bigger",
          r2["scale"] > r["scale"] * 1.5, "%.2f -> %.2f" % (r["scale"], r2["scale"]))
    t = time.time() + 12
    spoke = False
    while time.time() < t:
        if d.execute_script("return document.body.classList.contains('vo-lock');"):
            spoke = True
            break
        time.sleep(0.2)
    check("landscape: the greeting then plays - it was held, not lost", spoke)
    d.save_screenshot("rot_landscape.png")
finally:
    d.quit()

# ── a desktop window that happens to be tall ──────────────────────────────────────────────────
d = mk()
try:
    d.set_window_size(700, 1000)                 # portrait, but a fine pointer
    d.get("file:///%s/HI02H11_L01_S01.html" % DIST)
    time.sleep(3.0)
    r = d.execute_script(STATE)
    check("tall DESKTOP window: no gate, no block",
          r["display"] == "none" and not r["blocked"], str(r))
finally:
    d.quit()

print()
print("  %d failed" % len(fails))
sys.exit(1 if fails else 0)
