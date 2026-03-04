## PitchPilot 🎹 (Beta)

PitchPilot is a small web app to train your **ear** and **voice** by matching sung notes to a piano keyboard.

This repository contains the source code for the experimental beta. The main app lives in the `pitch-pilot` folder.

> **Status:** experimental **beta** – the UI, sounds, and behavior may change frequently.

### Features

- **Virtual piano**
  - One octave at a time, with an organ‑like synth sound.
  - Black keys are visually centered between their white neighbors (C♯ between C and D, etc.).

- **Keyboard control**
  - White keys: `C D E F G A B` → plays C D E F G A B of the current octave.
  - Sharps: `Shift + C / D / F / G / A` → C♯, D♯, F♯, G♯, A♯.
  - Octave: `Alt + 2–6` → switch between octaves 2–6.

- **Voice tuner**
  - Click or play a note → it becomes the **target**.
  - Start the tuner and sing:
    - See the detected note name and octave.
    - See the live frequency in Hz.
    - Watch a needle showing how many cents sharp/flat you are.

### Getting started

Clone the repo and run the app from the `pitch-pilot` folder:

```bash
git clone https://github.com/Gabriel-Armas/PitchPilot.git
cd PitchPilot/pitch-pilot
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`) and allow microphone access for the tuner.

### Tech stack

- **Frontend:** React + TypeScript (Vite)
- **Audio:** Web Audio API (custom organ‑style synth + pitch detection via autocorrelation)
- **Runtime:** Browser only, no backend required.

### Deployment

PitchPilot is designed to be deployed as a static site (e.g. Netlify, Vercel, GitHub Pages):

- **Build command:** `npm run build`
- **Output folder:** `dist`

### Roadmap / ideas

- Interval and melody training modes.
- Visual history of your intonation accuracy.
- Alternative instruments and timbres.
- Mobile‑friendly layout and touch interactions.

Feedback and ideas are very welcome – this is a **work in progress beta** focused on fast iteration, not final polish. 🎧

