import { useState, useEffect, useRef } from "react"
import HabitRow from "../components/HabitRow"
import MVDBar from "../components/MVDBar"
import Confetti from "../components/Confetti"
import { isHabitScheduledForDate, formatDate } from "../utils/dateUtils"
import { computeDayXP } from "../utils/xpUtils"

function Section({ title, icon, habits, completions, onToggle }) {
  if (habits.length === 0) return null
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {habits.map((h) => (
          <HabitRow
            key={h.id}
            habit={h}
            completed={completions.includes(h.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

export default function TodayView({ data, habits, today, toggleHabit }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiShownRef = useRef(false)

  const key = formatDate(today)
  const completions = data.completions[key] || []
  const scheduled = habits.filter((h) => isHabitScheduledForDate(h, today))
  const morning = scheduled.filter((h) => h.timeBlock === "morning")
  const night = scheduled.filter((h) => h.timeBlock === "night")
  const monthly = scheduled.filter((h) => h.timeBlock === "monthly")

  const allCompleted = scheduled.length > 0 && scheduled.every((h) => completions.includes(h.id))

  // Yesterday stats
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = formatDate(yesterday)
  const yesterdayCompletions = data.completions[yesterdayKey] || []
  const yesterdayScheduled = habits.filter((h) => isHabitScheduledForDate(h, yesterday))
  const yesterdayXP = computeDayXP(data.completions, habits, yesterday)
  const yesterdayPct = yesterdayScheduled.length > 0
    ? Math.round((yesterdayCompletions.filter(id => yesterdayScheduled.some(h => h.id === id)).length / yesterdayScheduled.length) * 100)
    : null
  const showYesterday = yesterdayScheduled.length > 0

  useEffect(() => {
    if (allCompleted && !confettiShownRef.current) {
      confettiShownRef.current = true
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 3500)
      return () => clearTimeout(t)
    }
    if (!allCompleted) {
      confettiShownRef.current = false
      setShowConfetti(false)
    }
  }, [allCompleted])

  return (
    <div className="p-4 pb-28">
      <Confetti active={showConfetti} />

      {/* Day header */}
      <div className="flex items-center justify-between mb-4 mt-1">
        <div>
          <div className="text-3xl font-bold" style={{ color: "var(--text-1)" }}>
            {completions.length}
            <span className="text-2xl" style={{ color: "var(--text-4)" }}>/{scheduled.length}</span>
          </div>
          <div className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>
            {scheduled.length === 0 ? "no habits today" : "habits completed today"}
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" style={{ stroke: "var(--bg-track)" }} strokeWidth="4" />
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke={allCompleted ? "var(--clr-warn)" : "var(--clr-accent)"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - (scheduled.length > 0 ? completions.length / scheduled.length : 0))}`}
              style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {allCompleted ? (
              <span className="text-lg">💎</span>
            ) : (
              <span className="text-xs font-bold" style={{ color: "var(--text-3)" }}>
                {scheduled.length > 0 ? Math.round((completions.length / scheduled.length) * 100) : 0}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Yesterday recap */}
      {showYesterday && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
          style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border)" }}
        >
          <div className="text-base leading-none">📅</div>
          <div className="flex-1">
            <div className="text-xs font-semibold" style={{ color: "var(--text-3)" }}>Yesterday</div>
            <div className="text-sm font-medium mt-0.5" style={{ color: "var(--text-2)" }}>
              {yesterdayCompletions.filter(id => yesterdayScheduled.some(h => h.id === id)).length}/{yesterdayScheduled.length} done
              {yesterdayPct !== null && (
                <span className="ml-1.5" style={{ color: yesterdayPct === 100 ? "var(--clr-success)" : yesterdayPct >= 50 ? "var(--clr-warn)" : "var(--clr-danger)" }}>
                  · {yesterdayPct}%
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold" style={{ color: "var(--clr-accent-lo)" }}>{yesterdayXP}</div>
            <div className="text-xs" style={{ color: "var(--text-4)" }}>XP</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {scheduled.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">🌴</div>
          <div className="text-base font-semibold mb-1" style={{ color: "var(--text-2)" }}>
            No habits scheduled today
          </div>
          <div className="text-sm" style={{ color: "var(--text-4)" }}>
            Enjoy the rest — or add habits in Manage.
          </div>
        </div>
      )}

      <Section
        title="Morning Block"
        icon="☀️"
        habits={morning}
        completions={completions}
        onToggle={toggleHabit}
      />
      <Section
        title="Night Block"
        icon="🌙"
        habits={night}
        completions={completions}
        onToggle={toggleHabit}
      />
      {monthly.length > 0 && (
        <Section
          title="Monthly"
          icon="📅"
          habits={monthly}
          completions={completions}
          onToggle={toggleHabit}
        />
      )}

      <MVDBar
        completions={completions}
        allScheduled={scheduled}
        allCompleted={allCompleted}
        mvdHabitIds={data.mvdHabitIds || []}
        habits={habits}
      />
    </div>
  )
}
