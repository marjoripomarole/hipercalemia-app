# Hipercalemia — Caso Clínico Interativo

An interactive clinical decision-making game built for medical education. Students work through a real-world hyperkalemia emergency in a retro 8-bit RPG aesthetic, making diagnostic and therapeutic choices at each step.

## What it does

The app presents a branching decision-tree case: a 68-year-old male with CKD, diabetes, hypertension, and potassium-retaining medications arrives at the ER with muscle weakness, nausea, and palpitations. Students must:

1. **Triage the situation** — decide the correct first steps (ECG, labs, monitoring)
2. **Classify severity** — interpret ECG changes and repeat labs
3. **Stabilize the patient** — choose the right cardiac membrane stabilizer
4. **Reduce serum potassium** — select the correct shift therapies
5. **Close the diagnosis** — integrate the full clinical picture

Wrong choices lead to dramatic "dead-end" scenes that show the clinical consequences, then redirect back to the decision point. Correct choices advance the case. A score bar (HP) tracks how many key decisions were made correctly.

## Features

- Branching narrative with scored decision nodes
- Structured patient chart (vitals, labs, ECG, medications) shown alongside each scene
- Keyboard shortcuts: `A`/`B`/`C` to select options, `Enter` to confirm/advance
- Breadcrumb trail showing the path taken through the case
- Immediate feedback explaining why each choice is right or wrong
- Restart at any time to replay with different choices

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) components
- [Lucide React](https://lucide.dev) icons

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding cases

The game engine (`components/GameEngine.jsx`) is decoupled from the case data. To add a new clinical case, create a file in `cases/` following the structure in `cases/hipercalemia.js` and pass it as a prop to `<GameEngine caseData={yourCase} />`.

## Deployment

Deployed automatically to [hipercalemia-app.vercel.app](https://hipercalemia-app.vercel.app) on every push to `main` via Vercel's GitHub integration.
