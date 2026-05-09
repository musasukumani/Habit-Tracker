export default function MVDBar({ completions, allScheduled, allCompleted, mvdHabitIds, habits }) {
  const mvdHabits = habits.filter((h) => mvdHabitIds.includes(h.id))
  const mvdDone = mvdHabits.length > 0 && mvdHabits.every((h) => completions.includes(h.id))

  let banner = null
  if (allCompleted && allScheduled.length > 0) {
    banner = { text: "💎 Perfect Day!", color: "var(--clr-warn)" }
  } else if (mvdDone) {
    banner = { text: "⚡ MVD Complete", color: "var(--clr-success)" }
  }

  return (
    <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-subtle)" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
            Minimum Viable Day
          </span>
          {mvdHabits.length > 0 ? (
            <div className="text-xs mt-0.5" style={{ color: "var(--text-4)" }}>
              {mvdHabits.map((h) => h.icon).join(" · ")}
            </div>
          ) : (
            <div className="text-xs mt-0.5" style={{ color: "var(--text-4)" }}>
              Set habits in Manage → MVD
            </div>
          )}
        </div>
        {banner && (
          <span className="text-sm font-bold fade-in" style={{ color: banner.color }}>
            {banner.text}
          </span>
        )}
      </div>

      {mvdHabits.length === 0 ? (
        <div className="h-2 rounded-full" style={{ backgroundColor: "var(--bg-track)" }} />
      ) : (
        <div className="flex gap-2">
          {mvdHabits.map((habit) => {
            const done = completions.includes(habit.id)
            return (
              <div key={habit.id} className="flex-1 flex flex-col gap-1">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: done ? "var(--clr-success)" : "var(--bg-track)",
                    boxShadow: done ? "0 0 6px rgba(78,203,163,0.4)" : "none",
                  }}
                />
                <span className="text-xs text-center leading-none" style={{ color: "var(--text-4)" }}>
                  {habit.icon}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
