import { computeTotalXP, getLevel, getLevelProgress, computeStreak } from "../utils/xpUtils"
import { formatDisplayDate } from "../utils/dateUtils"
import { useTheme } from "../context/ThemeContext"

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      {[[8,1,8,3],[8,13,8,15],[1,8,3,8],[13,8,15,8],[3.2,3.2,4.6,4.6],[11.4,11.4,12.8,12.8],[3.2,12.8,4.6,11.4],[11.4,4.6,12.8,3.2]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      ))}
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path d="M12.5 10C11.1 10.8 9.5 10.8 8.1 10C6.7 9.2 5.8 7.7 5.8 6C5.8 4.9 6.1 3.9 6.7 3.1C4.7 3.8 3.3 5.7 3.3 7.9C3.3 10.5 5.4 12.6 8 12.6C10.2 12.6 12.1 11.2 12.5 10Z" fill="currentColor"/>
    </svg>
  )
}

export default function Header({ data, habits, today, score, total }) {
  const { dark, toggle } = useTheme()
  const xp = computeTotalXP(data.completions, habits)
  const level = getLevel(xp)
  const progress = getLevelProgress(xp)
  const streak = computeStreak(data.completions)
  const nextLevelXp = level.max === Infinity ? null : level.max + 1

  return (
    <header
      className="sticky top-0 z-40 px-4 pt-3 pb-3"
      style={{
        backgroundColor: "var(--bg-header)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        transition: "background-color 0.25s ease",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <div className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
            {formatDisplayDate(today)}
          </div>
          <div className="text-sm font-semibold mt-0.5" style={{ color: "var(--text-1)" }}>
            <span style={{ color: score === total && total > 0 ? "#E0A843" : "var(--text-1)" }}>
              {score}
            </span>
            <span style={{ color: "var(--text-3)" }}>/{total}</span>
            <span className="font-normal ml-1.5" style={{ color: "var(--text-3)" }}>done today</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{ backgroundColor: "rgba(234, 88, 12, 0.15)" }}
          >
            <span className="text-base leading-none">🔥</span>
            <span className="text-sm font-bold text-orange-400">{streak}</span>
          </div>

          {/* Level */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{ backgroundColor: "var(--clr-accent-bg)" }}
          >
            <span className="text-sm leading-none">{level.emoji}</span>
            <span className="text-sm font-bold" style={{ color: "var(--clr-accent-lo)" }}>
              {level.name}
            </span>
          </div>

          {/* Dark / light toggle */}
          <button
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-muted)",
              color: "var(--text-2)",
            }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      {/* XP bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold" style={{ color: "var(--clr-accent-lo)", minWidth: 40 }}>
          {xp} XP
        </span>
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--bg-track)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--clr-accent), var(--clr-accent-lo))" }}
          />
        </div>
        {nextLevelXp && (
          <span className="text-xs" style={{ color: "var(--text-3)", minWidth: 36, textAlign: "right" }}>
            {nextLevelXp}
          </span>
        )}
      </div>
    </header>
  )
}
