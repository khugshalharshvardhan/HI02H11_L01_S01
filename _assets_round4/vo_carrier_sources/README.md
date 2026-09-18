# Words cut out of a carrier sentence

Isolated-word TTS is where this model's Hindi pronunciation is weakest: with no prosodic context it
clips codas and flattens aspiration. Asking for the word inside an ordinary sentence and cutting it
out gives a naturally-spoken token instead.

| id | carrier used | cut |
|---|---|---|
| `vo_w_machhli` | मछली पानी में तैरती है। | the FIRST speech burst (the word starts the sentence, so the cut is unambiguous), 45 ms of head and 75 ms of tail kept, 15 ms fade-in / 60 ms fade-out, loudnorm I=-18 |

Reproduce with `carrier_cut.py`-style steps: synthesise the carrier, run
`silencedetect=noise=-38dB:d=0.06`, take burst 1, trim and fade.

**Put the word FIRST in the carrier.** Mid-sentence the burst boundaries are ambiguous and the cut
will clip a neighbour.
