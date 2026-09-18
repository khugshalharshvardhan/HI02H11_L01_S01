# 03 · New assets needed

The SME changes ask for words and visuals that do **not** exist in
`build/assets/` yet. Nothing on this list can be implemented until the
asset is delivered.

## New object images — `build/assets/Images/`

| Needed for | Word | Suggested filename | Used on |
|---|---|---|---|
| crow illustration | कौआ | `obj_kauaa.png` | new page 1 (landing) |
| kite | पतंग | `obj_patang.png` | new pages 8, 9 |
| leaf | पत्ता | `obj_patta.png` | new page 8 |
| banana | केला | `obj_kela.png` | new pages 8, 9 |
| house | घर | `obj_ghar.png` | new page 8 |
| fish | मछली | `obj_machhli.png` | new page 8 |

## Images to REPLACE (file exists but SME says it is unclear)

| Current file | Why |
|---|---|
| `obj_papita.png` | new page 9 — "replace with a clear, full, child-friendly papaya" |
| `obj_mala.png` | new page 14 — "replace if visually unclear" |
| ant image on old page 5 | new page 3 — must become a rat/mouse; use existing `obj_chuha.png` |

## New / re-recorded audio — `build/assets/Audio/`

**All generated 2026-09-17** (Gemini TTS, voice **Kore**, `.ogg`, matching the existing 65 clips).
Every clip was verified by forced-choice listening-back before installing; the method was first
validated on already-approved clips (5/5).

> **r5e, same day — 21 MORE clips were regenerated.** The 20 round-4 **re-records** in
> `_assets_round4/regen_ids.txt` had never actually been re-recorded: `gen_tts` skips ids whose
> file already exists, and the r5d run used no `--force`, so the lesson was still speaking its
> round-3 voice-over on 20 lines. Plus `vo_p1_try`, a partial take. See **r5e** in `CHANGES.md`.
> None of the 21 has been heard by a human yet.

| Clip id | Spoken text | Status |
|---|---|---|
| `vo_line_l6` | नानी नई नाव लाई। | **generated** — the new page-14 sentence |
| `vo_snd_n` | न से नाव। | **generated** — carrier phrase (page 14 `audio.target`) |
| `vo_ltr_n` | न | **generated** — BARE sound, page 14 letter reveal |
| `vo_ltr_m` | म | **generated** — BARE sound, page 14 letter reveal |
| `vo_w_chand` | चाँद | **generated** |
| `vo_w_chinti` | चींटी | **generated** |
| `vo_w_ghar` | घर | **generated** |
| `vo_w_kela` | केला | **generated** |
| `vo_w_machhli` | मछली | **generated** |
| `vo_w_patang` | पतंग | **generated** |
| `vo_w_patta` | पत्ता | **generated** |
| `vo_landing` | (see `04_VO_RECORDING_LIST_current.md`) | already on disk — NOT re-recorded |
| `vo_line_l2` / `vo_line_l3` | — | already on disk — NOT re-recorded |
| SFX `sfx_kanv` काँव-काँव crow call | — | **delivered r4d** — SME recording, cut to one 0.57 s call; ships in `build/` and `dist/` |

> **The bare-sound rule.** `vo_snd_*` read "<letter> से <word>" in the card only because the TTS
> model hard-refuses an isolated akshara. Where a page reveals letter options one by one, the
> option must play the BARE sound (the SME ruling on page 9: *"play only these च, ल, र sound, not
> more than that"*). Page 9 gets this from `vo_snd_ch/l/r`, which were cut down to the bare
> akshara; page 14 now gets it from `vo_ltr_m` / `vo_ltr_n`, added for exactly that purpose.
> `vo_snd_m` keeps its carrier phrase because the TEACH page genuinely teaches "म से मछली".
>
> See `04_VO_RECORDING_LIST_current.md` for the full clip list and the human-recording rule.
