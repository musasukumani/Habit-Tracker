import { CATEGORY_COLORS } from "../data/habits"
import { getLast7Days, formatDate, isHabitScheduledForDate, formatShortDay } from "../utils/dateUtils"
import { computeDayXP, computeWeekXP } from "../utils/xpUtils"

const CELL_COLORS = {
  full:  "var(--cell-full)",
  half:  "var(--cell-half)",
  some:  "var(--cell-some)",
  none:  "var(--bg-hover)",
  future:"var(--bg-hover)",
}

const RATIO_TEXT = {
  full:  "var(--clr-success)",
  half:  "var(--clr-warn)",
  some:  "var(--clr-danger)",
  none:  "var(--text-4)",
  future:"var(--text-4)",
}

function cellStatus(completions, total) {
  if (total === 0) return "none"
  if (completions === total) return "full"
  if (completions / total >= 0.5) return "half"
  if (completions > 0) return "some"
  return "none"
}

export default function WeekView({ data, habits }) {
  const days = getLast7Days()
  const todayKey = formatDate(new Date())
  const weekXP = computeWeekXP(data.completions, habits)

  const dayStats = days.map((date) => {
    const key = formatDate(date)
    const done = (data.completions[key] || []).length
    const scheduled = habits.filter((h) => isHabitScheduledForDate(h, date)).length
    const status = cellStatus(done, scheduled)
    const isFuture = key > todayKey
    const xp = isFuture ? 0 : computeDayXP(data.completions, habits, date)
    return { date, key, done, scheduled, status, isFuture, xp }
  })

  const habitProgress = habits.map((habit) => {
    let scheduled = 0, completed = 0
    for (const date of days) {
      if (isHabitScheduledForDate(habit, date)) {
        scheduled++
        const key = formatDate(date)
        if ((data.completions[key] || []).includes(habit.id)) completed++
      }
    }
    return { habit, scheduled, completed }
  }).filter((x) => x.scheduled > 0)

  return (
    <div className="p-4 pb-28">
      {/* Week XP banner */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
        style={{ backgroundColor: "var(--clr-accent-bg)", border: "1px solid rgba(83,74,183,0.25)" }}
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--clr-accent-lo)" }}>
            This Week
          </div>
          <div className="text-2xl font-bold mt-0.5" style={{ color: "var(--text-1)" }}>
            {weekXP} <span className="text-base font-normal" style={{ color: "var(--text-3)" }}>XP</span>
          </div>
        </div>
        <div className="text-3xl">⚡</div>
      </div>

      <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-1)" }}>Last 7 Days</h2>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-8">
        {dayStats.map(({ date, key, done, scheduled, status, isFuture, xp }) => {
          const isToday = key === todayKey
          return (
            <div
              key={key}
              className="rounded-xl p-2 flex flex-col items-center gap-0.5 transition-all duration-200"
              style={{
                backgroundColor: CELL_COLORS[status],
                border: isToday ? `2px solid var(--clr-accent)` : "2px solid transparent",
              }}
            >
              <span className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
                {formatShortDay(date)}
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: isToday ? "var(--clr-accent-lo)" : RATIO_TEXT[status] }}
              >
                {date.getDate()}
              </span>
              <span className="text-xs" style={{ color: RATIO_TEXT[status] }}>
                {scheduled > 0 ? `${done}/${scheduled}` : "—"}
              </span>
              {!isFuture && xp > 0 && (
                <span className="font-bold leading-none" style={{ color: RATIO_TEXT[status], fontSize: "11px" }}>
                  {xp}xp
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Per-habit progress */}
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-3)" }}>
        Habit Progress
      </h3>

      <div className="flex flex-col gap-4">
        {habitProgress.map(({ habit, scheduled, completed }) => {
          const ratio = scheduled > 0 ? completed / scheduled : 0
          const c = CATEGORY_COLORS[habit.category]
          return (
            <div key={habit.id}>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-base leading-none">{habit.icon}</span>
                <span className="text-sm flex-1 leading-snug" style={{ color: "var(--text-1)" }}>{habit.name}</span>
                <span className="text-xs font-semibold flex-shrink-0" style={{ color: c.text }}>{completed}/{scheduled}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-track)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${ratio * 100}%`, backgroundColor: c.bar }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
