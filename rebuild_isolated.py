# -*- coding: utf-8 -*-
"""Build HI02H11_L01_S01 against its OWN engine (engine_local/), never the shared one.

    PYTHONUTF8=1 python KG/HI02H11_L01_S01/rebuild_isolated.py

Why this file exists rather than `engine_isolate.py build`:
  * this checkout has no "Maths HTML Factory", and engine_isolate dereferences that factory's
    app.js unconditionally before it reaches its own --from-monolith branch;
  * `engine_isolate build` re-derives the local monolith from the SHARED one whenever the local
    monolith does not already embed the local app.js/style.css verbatim — which is exactly the
    state right after you edit them. Here the re-injection is the FIRST step instead, so an
    isolated build never depends on shared state (the 2026-08-03 lesson, applied up front).

It reuses engine_isolate's own _mono_regions/_mono_inject, so the monolith it writes is
byte-identical to what that tool would have produced.
"""
import io, os, re, runpy, sys

SKILL_BUILD = r"C:\Users\harsh\.claude\skills\swiftpal-game-revise\scripts\build"
HERE = os.path.dirname(os.path.abspath(__file__))                 # KG/<CODE>
FLN = os.path.dirname(os.path.dirname(HERE))                      # FLN_Content_Factory
LD = os.path.join(HERE, "engine_local")
CODE = "HI02H11_L01_S01"

sys.path.insert(0, SKILL_BUILD)
import engine_isolate as EI

# 1. fold this game's app.js + style.css back into its own monolith
mono_p = os.path.join(LD, "lesson_template.html")
mono = io.open(mono_p, encoding="utf-8", newline="").read()
lj = io.open(os.path.join(LD, "app.js"), encoding="utf-8", newline="").read()
lc = io.open(os.path.join(LD, "style.css"), encoding="utf-8", newline="").read()
out = EI._mono_inject(mono, lj, lc)
if out is None:
    sys.exit("  X  could not locate the inlined engine regions in the local monolith")
# prove the injection round-trips before anything is built on it
rj, rc = EI._mono_extract(out)
assert rj == lj and rc == lc, "  X  monolith injection is lossy - refusing to build"
io.open(mono_p, "w", encoding="utf-8", newline="").write(out)
stamp = re.search(r'ENGINE_VERSION\s*=\s*["\']([^"\']+)["\']', lj)
stamp = stamp.group(1) if stamp else "UNSTAMPED"
print("  ok  local monolith re-synced with engine_local/app.js + style.css  (%s)" % stamp)

# 2. point the guard at THIS game's engine, in memory only - the shared engine is never written
sys.path.insert(0, os.path.join(FLN, "scripts"))
import unified_build
unified_build.EXPECTED_ENGINE_VERSION = stamp
unified_build.require_current_engine = (lambda *a, **k: out)
print("  ok  engine guard redirected to engine_local (isolated build)")

# 3. run the game's normal build script
runpy.run_path(os.path.join(FLN, "scripts", "build_skill_%s.py" % CODE), run_name="__main__")
