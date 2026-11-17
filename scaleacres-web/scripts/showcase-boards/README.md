# Showcase boards (Sohom Estate, DTC Group, Bhatia Group)

`board.html` composes a 1600 × 1000 presentation board from three pieces:
- a darkened project render;
- the project name and location, taken from the reel;
- three phones showing real frames from the ScaleAcres campaign reels.

`board.mjs` renders the three boards with Playwright.

Sources (Drive folder "Builders AI Videos"):
| Board | Reel | Background crop | Phone frames |
| --- | --- | --- | --- |
| Sohom Estate | Pravya FD2 | 29.5 s, y 300 | 7.8 s, 29.5 s, 47.8 s |
| DTC Group | DTC Sojon AI FD1 | 7.0 s, y 260 | 1.5 s, 4.2 s, 7.0 s |
| Bhatia Group | Auriga 9 Reel_1 | 39.5 s, y 420 | 10.6 s, 39.5 s, 17.0 s |

Each background crop is 1080 × 675, taken between the reel's logo bar and its captions. Frames that show people are not used. Output goes to `design/home-v8/assets/img/*-1600.webp`.
