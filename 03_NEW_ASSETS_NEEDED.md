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

| Clip id | Spoken text | Note |
|---|---|---|
| `vo_snd_n` | न (bare sound) | **missing** — needed for new page 14 letter options |
| `vo_landing` | नमस्ते दोस्त! मैं हूँ Swiftee। आज हम जानेंगे कि वाक्य में कौन-सी ध्वनि बार-बार सुनाई देती है। सुनो—"काला कौआ काँव-काँव करता।" इस वाक्य में "क" की ध्वनि यानी आवाज़ बार-बार आ रही है। | re-record, sentence changed |
| `vo_line_l2` | चूहे ने चार चने चबाए। | re-record (was "चूहा चार चने चबाए") |
| `vo_line_l3` | मेरे मामा मीठी मलाई लाए। | re-record (was "मामा मीठी मलाई लाए") |
| new sentence VO | नानी नई नाव लाई। | new page 14 |
| `vo_w_patang` / `vo_w_patta` / `vo_w_kela` / `vo_w_ghar` / `vo_w_machhli` | word names | for tap-to-hear on the new options |
| SFX | काँव-काँव crow call | new page 1 |

> `vo_snd_*` clips must be a **bare sound** (pa, cha, ma, na…), not the
> carrier word — see `04_VO_RECORDING_LIST_current.md` for the full
> existing clip list and the recording rule.
