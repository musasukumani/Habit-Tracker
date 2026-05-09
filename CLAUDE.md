# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server (opens browser automatically with --open)
npm run build      # production build
npm run preview    # preview production build locally
```

No test suite or linter is configured.

## Architecture

**Stack:** React 18 + Vite + Tailwind CSS (no TypeScript, no router, single-page app).

**State & persistence:** All app state lives in `src/hooks/useHabitStore.js` via a single `data` object persisted to `localStorage` under key `autopilot-habit-tracker-v1`. The shape is:
```js
{
  habits: Habit[],
  completions: { "YYYY-MM-DD": habitId[] },
  mvdHabitIds: habitId[],   // which habits count as Minimum Viable Day
  rewards: {
    weekly:  { enabled: bool, threshold: number },
    monthly: { enabled: bool, threshold: number },
    celebrated: string[],  // e.g. ["week:2026-05-04", "month:2026-05"]
  }
}
```
There is no server, no API, no context — `useHabitStore` is called once in `App.jsx` and props are drilled down.

**Date keys:** Always use `formatDate()` from `src/utils/dateUtils.js` — it returns `YYYY-MM-DD` using **local** date components (not `.toISOString()` which is UTC and breaks for UTC+ users).

**Theme:** Dark/light is toggled via a `dark` class on `<html>`. All colours are CSS custom properties defined in `src/index.css`. Two sets:
- **Theme tokens** (in `:root` and `.dark`): `--bg-*`, `--text-*`, `--border*` — change between light/dark.
- **Semantic colour tokens** (in `:root` only, theme-neutral): `--clr-accent`, `--clr-accent-lo`, `--clr-accent-bg`, `--clr-success`, `--clr-warn`, `--clr-danger`, `--cell-full`, `--cell-half`, `--cell-some`.

Always use `var(--token)` in inline styles. Never hardcode `#534AB7`, `#9D97E3`, `#4ECBA3`, `#E0A843`, or `#E05555` — use the semantic tokens instead.

**XP system:** Computed on-the-fly from `completions` — never stored separately. Key utilities in `src/utils/xpUtils.js`: `computeTotalXP`, `computeDayXP`, `computeWeekXP`, `computeMonthXP`. Levels/thresholds defined in `src/data/habits.js` under `LEVELS`.

**Reward triggers:** `App.jsx` runs a `useEffect` on `data.completions` that checks weekly/monthly XP against `data.rewards` thresholds. When a threshold is first crossed in a period it shows `<RewardModal>` and appends the period key to `rewards.celebrated` to prevent re-triggering.

**Routing:** No router — tabs are plain `useState` in `App.jsx`. Tab IDs: `today`, `week`, `month`, `stats`, `manage`.

**Habit data shape:**
```js
{
  id: number,
  name: string,
  icon: string,           // emoji
  category: "health" | "skill" | "money" | "anchor",
  color: string,          // hex, used for the toggle circle
  days: "every" | "monthly" | string[],  // string[] = ["Mon","Tue",...]
  timeBlock: "morning" | "night" | "monthly",
  xp: number,
}
```
`CATEGORY_COLORS` in `src/data/habits.js` maps category → `{ hex, bg, border, badgeBg, badgeText, text, bar }`.

**MVDBar** (Minimum Viable Day bar in TodayView) is hardcoded to habit IDs `[2, 8, 9]` via `MVD_HABIT_IDS` in `src/data/habits.js`. If those habits are deleted or their IDs change, MVDBar silently breaks.
