import { useState, useCallback } from "react"
import { CATEGORY_COLORS } from "../data/habits"

export default function HabitRow({ habit, completed, onToggle }) {
  const [popping, setPopping] = useState(false)
  const c = CATEGORY_COLORS[habit.category]
  const btnColor = habit.color || c.hex

  const handleToggle = useCallback(() => {
    setPopping(true)
    setTimeout(() => setPopping(false), 320)
    onToggle(habit.id)
  }, [habit.id, onToggle])

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => e.key === "Enter" && handleToggle()}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer select-none transition-all duration-300"
      style={{
        backgroundColor: completed ? c.bg : "var(--bg-hover)",
        borderLeft: `3px solid ${completed ? btnColor : "transparent"}`,
      }}
    >
      {/* Circle toggle button */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          popping ? "habit-pop" : ""
        }`}
        style={{
          border: completed
            ? `2.5px solid ${btnColor}`
            : "2.5px solid var(--border-hi)",
          backgroundColor: completed ? btnColor : "transparent",
          boxShadow: completed
            ? `0 0 12px ${btnColor}90, 0 0 4px ${btnColor}60`
            : "none",
        }}
      >
        {completed ? (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path
              d="M1.5 4.5L4 7L9.5 1.5"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>

      {/* Emoji icon */}
      <span className="text-lg flex-shrink-0 leading-none">{habit.icon}</span>

      {/* Name */}
      <span
        className="flex-1 text-sm font-medium leading-snug transition-all duration-200"
        style={{
          color: completed ? "var(--text-off)" : "var(--text-1)",
          textDecoration: completed ? "line-through" : "none",
        }}
      >
        {habit.name}
      </span>

      {/* Category badge */}
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wide"
        style={{ backgroundColor: c.badgeBg, color: c.badgeText }}
      >
        {habit.category}
      </span>

      {/* XP */}
      <span
        className="text-xs font-bold flex-shrink-0 w-10 text-right"
        style={{ color: c.text }}
      >
        +{habit.xp}
      </span>
    </div>
  )
}
