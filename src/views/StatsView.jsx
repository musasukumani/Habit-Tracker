import { LEVELS, CATEGORY_COLORS } from "../data/habits"
import {
  computeTotalXP,
  getLevel,
  getLevelProgress,
  computeStreak,
  computeWeekXP,
  computeTotalChecks,
} from "../utils/xpUtils"

export default function StatsView({ data, habits }) {
  const xp = computeTotalXP(data.completions, habits)
  const level = getLevel(xp)
  const progress = getLevelProgress(xp)
  const streak = computeStreak(data.completions)
  const weekXP = computeWeekXP(data.completions, habits)
  const totalChecks = computeTotalChecks(data.completions)
  const levelIdx = LEVELS.findIndex((l) => l.name === level.name)
  const nextLevel = LEVELS[levelIdx + 1]

  return (
    <div className="p-4 pb-28">
      {/* Level card */}
      <div
        className="p-5 rounded-2xl mb-6"
        style={{
          background: "var(--gradient-card)",
          border: "1px solid rgba(83,74,183,0.3)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold" style={{ color: "var(--text-1)" }}>
              {level.emoji} {level.name}
            </div>
            <div className="text-sm mt-1" style={{ color: "var(--text-3)" }}>
              {xp} XP earned total
            </div>
          </div>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: "rgba(83,74,183,0.2)" }}
          >
            {level.emoji}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs w-6" style={{ color: "var(--text-3)" }}>{level.min}</span>
          <div
            className="flex-1 h-2.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--bg-track)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--clr-accent), var(--clr-accent-lo))" }}
            />
          </div>
          <span className="text-xs w-10 text-right" style={{ color: "var(--text-3)" }}>
            {nextLevel ? nextLevel.min : "MAX"}
          </span>
        </div>
        {nextLevel && (
          <div className="text-xs mt-1.5 text-right" style={{ color: "var(--text-4)" }}>
            {nextLevel.min - xp} XP to {nextLevel.emoji} {nextLevel.name}
          </div>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricCard value={`🔥 ${streak}`} label="Day Streak"   color="#EA580C" bg="rgba(234,88,12,0.12)" />
        <MetricCard value={totalChecks}     label="Total Checks" color="var(--text-1)" bg="var(--bg-hover)" />
        <MetricCard value={`${weekXP} XP`} label="This Week"    color="var(--clr-accent-lo)" bg="var(--clr-accent-bg)" />
      </div>

      {/* Level roadmap */}
      <h3
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--text-3)" }}
      >
        Level Roadmap
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {LEVELS.map((lvl) => {
          const isActive = lvl.name === level.name
          const isPast = xp >= lvl.min
          return (
            <div
              key={lvl.name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: isActive ? "rgba(83,74,183,0.2)" : "var(--bg-hover)",
                border: isActive ? "1px solid rgba(83,74,183,0.5)" : "1px solid transparent",
                opacity: !isPast ? 0.5 : 1,
              }}
            >
              <span className="text-xl">{lvl.emoji}</span>
              <div className="flex-1">
                <span
                  className="text-sm font-semibold"
                  style={{ color: isActive ? "var(--text-1)" : isPast ? "var(--text-2)" : "var(--text-3)" }}
                >
                  {lvl.name}
                </span>
                <span className="text-xs ml-2" style={{ color: "var(--text-4)" }}>
                  {lvl.max === Infinity ? `${lvl.min}+ XP` : `${lvl.min}–${lvl.max} XP`}
                </span>
              </div>
              {isActive && (
                <span className="text-xs font-bold" style={{ color: "var(--clr-accent-lo)" }}>CURRENT</span>
              )}
              {isPast && !isActive && (
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                  <path d="M1 5.5L5 9.5L13 1.5" stroke="var(--clr-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )
        })}
      </div>

      {/* XP guide */}
      <h3
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--text-3)" }}
      >
        XP Guide
      </h3>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-subtle)" }}>
        {habits.map((habit, i) => {
          const c = CATEGORY_COLORS[habit.category]
          return (
            <div
              key={habit.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom: i < habits.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span className="text-base leading-none">{habit.icon}</span>
              <span className="text-sm flex-1 leading-snug" style={{ color: "var(--text-2)" }}>
                {habit.name}
              </span>
              <span className="text-sm font-bold flex-shrink-0" style={{ color: c.text }}>
                +{habit.xp}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MetricCard({ value, label, color, bg }) {
  return (
    <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: bg }}>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{label}</div>
    </div>
  )
}
