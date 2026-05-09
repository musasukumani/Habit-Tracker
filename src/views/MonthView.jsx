import { useState } from "react"
import { formatDate, isHabitScheduledForDate } from "../utils/dateUtils"
import { computeDayXP, computeMonthXP } from "../utils/xpUtils"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function getDayColor(pct, isFuture) {
  if (isFuture) return { bg: "transparent",      text: "var(--text-4)" }
  if (pct === null) return { bg: "transparent",  text: "var(--text-4)" }
  if (pct === 100)  return { bg: "var(--cell-full)", text: "var(--clr-success)" }
  if (pct >= 50)    return { bg: "var(--cell-half)", text: "var(--clr-warn)" }
  if (pct > 0)      return { bg: "var(--cell-some)", text: "var(--clr-danger)" }
  return                   { bg: "rgba(255,255,255,0.04)", text: "var(--text-4)" }
}

export default function MonthView({ data, habits }) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const todayKey = formatDate(now)

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const dayStats = {}
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d)
    const key = formatDate(date)
    const isFuture = key > todayKey
    if (isFuture) { dayStats[d] = { pct: null, done: 0, total: 0, xp: 0, isFuture: true }; continue }
    const scheduled = habits.filter(h => isHabitScheduledForDate(h, date))
    const done = (data.completions[key] || []).filter(id => scheduled.some(h => h.id === id)).length
    const total = scheduled.length
    const pct = total > 0 ? Math.round((done / total) * 100) : null
    const xp = computeDayXP(data.completions, habits, date)
    dayStats[d] = { pct, done, total, xp, isFuture: false }
  }

  const pastDays = Object.values(dayStats).filter(s => !s.isFuture && s.total > 0)
  const totalDone = pastDays.reduce((s, d) => s + d.done, 0)
  const totalScheduled = pastDays.reduce((s, d) => s + d.total, 0)
  const perfectDays = pastDays.filter(d => d.pct === 100).length
  const monthPct = totalScheduled > 0 ? Math.round((totalDone / totalScheduled) * 100) : 0
  const monthXP = computeMonthXP(data.completions, habits, viewYear, viewMonth)

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()
  const canGoNext = !isCurrentMonth

  return (
    <div className="p-4 pb-28">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-2)" }}
        >
          ‹
        </button>
        <div className="text-base font-bold" style={{ color: "var(--text-1)" }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{
            backgroundColor: canGoNext ? "var(--bg-hover)" : "transparent",
            color: canGoNext ? "var(--text-2)" : "var(--text-4)",
            cursor: canGoNext ? "pointer" : "default",
          }}
        >
          ›
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-2 mb-5 p-3 rounded-xl" style={{ backgroundColor: "var(--bg-hover)" }}>
        <div className="text-center">
          <div className="text-base font-bold" style={{ color: "var(--clr-accent-lo)" }}>
            {monthXP}<span className="text-xs font-normal ml-0.5">xp</span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-3)" }}>month XP</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold" style={{ color: "var(--clr-success)" }}>{monthPct}%</div>
          <div className="text-xs" style={{ color: "var(--text-3)" }}>overall</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold" style={{ color: "var(--clr-warn)" }}>{perfectDays}</div>
          <div className="text-xs" style={{ color: "var(--text-3)" }}>perfect</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold" style={{ color: "var(--text-1)" }}>{totalDone}</div>
          <div className="text-xs" style={{ color: "var(--text-3)" }}>done</div>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: "var(--text-3)" }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const stat = dayStats[day]
          const { bg, text } = getDayColor(stat.pct, stat.isFuture)
          const dateKey = formatDate(new Date(viewYear, viewMonth, day))
          const isToday = dateKey === todayKey

          return (
            <div
              key={day}
              className="flex flex-col items-center justify-center rounded-xl py-1.5 gap-0.5 transition-all duration-200"
              style={{
                backgroundColor: bg,
                border: isToday ? `2px solid var(--clr-accent)` : "2px solid transparent",
                minHeight: "58px",
              }}
            >
              <span
                className="font-bold leading-none"
                style={{ color: isToday ? "var(--clr-accent-lo)" : "var(--text-2)", fontSize: "11px" }}
              >
                {day}
              </span>
              <span className="font-bold leading-none" style={{ color: text, fontSize: "11px" }}>
                {stat.isFuture ? "" : stat.total === 0 ? "—" : stat.xp > 0 ? `${stat.xp}xp` : "0xp"}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5 flex-wrap">
        {[
          { color: "var(--cell-full)", label: "100%" },
          { color: "var(--cell-half)", label: "≥50%" },
          { color: "var(--cell-some)", label: ">0%"  },
          { color: "rgba(255,255,255,0.04)", label: "0%" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs" style={{ color: "var(--text-3)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
