# Hero film and services visual

`wall.html` composes the hero wall: square tiles play ScaleAcres ad films (24 s segments in `seg/`, cut from the ScaleAcres Vimeo library), and tall tiles show covers of ScaleAcres AI, social and ad shorts (`posters/`). `node render.mjs 25 48` renders 1,200 exact frames, which makes a seamless 48 s loop.

`services-ad-results.html` is the services visual: the La Wisteria ad running as a sponsored post, with published case-study results above the screen. Render it the same way at 1800 × 1200 for 24 s.

## Hero v8 (`ai-wall.html`)

Faceless, render-only work, with no people, captions or logos on screen:
- **JBBR Kanvas:** the AI films of the gate and the township aerials.
- **JBBR warehouse:** the AI films of the blueprint-to-building reveal, the aerials, the night exterior and the loading dock.
- **Tech:** an AI data-visualisation film.
- **AI builder renders:** four ScaleAcres AI tower renders.
- **Ad films:** six render shots from the ScaleAcres property ad films (La Wisteria, Bhartiya City, Dualis and Signature Global), cropped clear of their caption and logo bars.

The AI clips come from the existing ScaleAcres Higgsfield library. They were downloaded only; nothing was generated.

To build it:
1. Run `prep-ai-tiles.sh` to cut each clip into a 9.68 s ping-pong loop.
2. Run `node render.mjs 25 48.4` with `wall.html` replaced by `ai-wall.html`. This gives 1,210 frames, a seamless 48.4 s loop (5 tile loops).
