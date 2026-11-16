# Services phone visual

`scene.html` is the composition: the ScaleAcres reel in a phone, ringed by floating cards. Every motion is a function of time, so `node render.mjs 30 18` renders 540 exact frames into `frames/`, ready for ffmpeg. The scene expects `reel.webm` (public/videos/nd/hero/scaleacres-reel-1080x1920.webm) and the Outfit fonts beside it.

`rec-home.mjs` records the homepage walkthrough of design/home-v5.
