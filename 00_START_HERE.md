# HI02H11_L01_S01 — Developer handover

Hindi · Grade 2 · "बार-बार आने वाली ध्वनि" (repeated sound in a sentence)

This folder is the **single source of truth**. Ignore any older
`_SME_Review_v2 / round2 / round3` decks — they are superseded.

## Read in this order

| File | What it is |
|---|---|
| `01_CHANGE_LIST.md` | **The work.** Page-by-page instructions, verbatim from SME. |
| `02_PAGE_ORDER.md` | Which pages are deleted and how the rest are re-ordered. |
| `03_NEW_ASSETS_NEEDED.md` | Images + audio that must be created before some pages can be built. |
| `04_VO_RECORDING_LIST_current.md` | The 99 VO clips already recorded, with exact spoken text. |
| `HI02H11_L01_S01_SME_Review_Final.pptx` | Source deck. Open the **Comments** pane — that is where the notes live. |
| `build/` | Current implementation: `HI02H11_L01_S01.html`, `card.json`, `assets/`. |
| `reference_screens/` | Screenshot of each surviving page, named in the **new** order. |

## Summary of this round

- **20 pages → 16 pages.** Pages **11, 15, 17, 18** are deleted.
- **Pages 2 and 3 move** to after page 7, so the teaching order becomes **च → म → प**.
- **15 pages have change requests.** The celebration page is unchanged.

## The recurring patterns
Several instructions repeat across pages — implement them once, apply everywhere:

1. **Text off the screen, into VO.** On every MEET_LETTER page, delete the
   on-screen explanatory sentence and keep it as voice-over only.
2. **Two-stage highlighting.** Play the sentence with *word-by-word*
   highlight synced to VO → then clear it → then highlight **only the target
   letter** inside each word. Never leave whole words highlighted.
3. **One target sound per screen.** Drop the extra distractor letters
   (र, ल, त) from the teach pages.
4. **4 options maximum** on tap-all activities: 2 correct, 2 incorrect.
5. **Keep existing hint logic.** Shake + brief red + hint VO on wrong,
   hand-nudge after repeated wrong. SME explicitly says do not rebuild it.

## What was left out of this folder
Old review decks (5), `_backup_pre_uiclean/`, internal review JSON, build
reports and round-2/3 feedback notes. Ask if you need any of them.
