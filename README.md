# Autopilot — Habit Tracker

A gamified daily habit tracker built with React. Track habits across morning and night blocks, earn XP, level up, and review your progress by day, week, and month.

**[Live Demo →](https://habit-tracker-pi-sooty.vercel.app/)**

---

## Features

- **Daily habit tracking** — morning, night, and monthly blocks with per-habit completion toggles
- **XP & levelling system** — each habit awards XP; accumulate enough to progress from Rookie → Grinder → Builder → Pro → Elite
- **Streak tracking** — consecutive days with 3+ completions keep your streak alive
- **Week view** — last 7 days with per-day XP and completion ratios
- **Month calendar** — full calendar showing daily XP and colour-coded completion rates
- **Minimum Viable Day (MVD)** — choose which habits define a "good enough" day; the MVD bar tracks only those
- **Configurable rewards** — set weekly and monthly XP targets; the app congratulates you when you hit them (once per period)
- **Dark / light mode** — persisted across sessions
- **Data export & import** — back up your entire history as JSON; restore on any device

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS + CSS custom properties |
| State | `useState` + `localStorage` (no server) |
| Fonts | Space Grotesk (Google Fonts) |

No backend, no database, no auth — fully client-side.

---

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

---

## Data & persistence

All data is stored in `localStorage` under the key `autopilot-habit-tracker-v1`. Use **Manage → Export backup** to download a JSON snapshot and **Import backup** to restore it — useful when switching browsers or devices.

---

## Deploying

This is a standard Vite SPA with no server requirements. Drop the `dist/` folder on any static host:

```bash
npm run build
# then deploy dist/ to Vercel, Netlify, GitHub Pages, etc.
```
