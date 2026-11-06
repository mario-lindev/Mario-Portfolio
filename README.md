# Mario Lin — Student, robotics & Auquara

A React/Vite portfolio with an interactive brain puzzle, an explorable Auquara city model, education and achievements, optional music, and light/dark appearance.

## Local development

Use Node.js 20.19+ or 22.12+ and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Checks and production build

```sh
pnpm check
```

This runs the city and brain geometry checks, then builds the site into `dist/`. Run `pnpm preview` to inspect that build. For Vercel, use the Vite preset, build command `pnpm build`, output directory `dist`, and production branch `main`.

## Project layout

- `src/main.jsx`: portfolio content, navigation, theme, and music controls.
- `src/BrainScene.jsx` and `src/brainModel.js`: brain rendering, rotation, and puzzle timing.
- `src/CityScene.jsx`, `src/auquaraModel.js`, and `src/physics.js`: city geometry, camera orbit, and spring interactions.
- `src/style.css`: responsive layout, themes, accessibility preferences, and controls.
- `public/audio/`: the user-supplied music track, loaded only when played.
- `public/models/`: the brain puzzle and downloadable city GLB/CAD, metadata, and model documentation.
- `scripts/`: offline geometry generators and checks. `scripts/assets/` holds the original brain model used only during generation.
- `PRODUCT.md`, `DESIGN.md`, and `.impeccable/`: current product facts and design guidance.

Generated build output, dependencies, logs, environment files, and review screenshots are ignored by Git.

## Model maintenance

```sh
pnpm model:export  # regenerate Auquara GLB, OpenSCAD, and design metadata
pnpm model:check
pnpm brain:build   # regenerate the brain puzzle from scripts/assets/pegasus-fsaverage5.glb
pnpm brain:check
```

Auquara follows four photos supplied by Mario. Its nominal board is 190 × 380 mm; dimensions and hidden geometry are estimates. The main island is circular, the display base rectangular, and the lower-left satellite is a planted greenhouse. The website and city exports share one geometry source. The original photographs are not distributed. Scale the CAD with `scale_factor` in `public/models/auquara.scad`.

The brain puzzle keeps about 65% assembled while 37 rounded pieces fill scattered gaps. It holds complete for one second before rebuilding. Reduced motion shows the complete brain; pause preserves the current frame.

## Content and credits

Profile facts were checked on November 5, 2026 against [Mario’s LinkedIn](https://www.linkedin.com/in/mario-lin7/). Mario confirmed the AMC 10 score of 70/150. The Gold Coast floating-city scenario comes directly from Mario.

[ThreeUI](https://threeui.com/) inspired the original visual direction; its unused package and shaders have been removed. The brain derives from [Pegasus](https://github.com/rishith-c/pegasus/tree/52ba71e3b4bb53063eff035a6e2223388889ca1c), pinned to commit `52ba71e3b4bb53063eff035a6e2223388889ca1c`. License notices are consolidated in `public/third-party-notices.txt`. Interaction references include Apple’s fluid-interface principles and [Emil Kowalski’s guidance](https://emilkowal.ski/ui/good-vs-great-animations).
