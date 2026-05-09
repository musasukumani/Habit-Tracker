import { useState } from "react"
import { CATEGORY_COLORS } from "../data/habits"

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const SUGGESTED_ICONS = [
  "⏰","💧","💪","🏋️","💻","📝","🌙","🥡","💸","🏃","📚","🧘",
  "🥗","🎯","🎵","🧠","💊","🚶","🔥","⭐","🏆","🌿","🎨","✍️",
]

const CATEGORIES = ["health", "skill", "money", "anchor"]

const COLOR_PALETTE = [
  "#3B9EE8", "#06B6D4", "#10B981", "#22C55E",
  "#8B5CF6", "#818CF8", "#A78BFA", "#EC4899",
  "#F43F5E", "#EF4444", "#F97316", "#F59E0B",
  "#FBBF24", "#14B8A6", "#1D9E75", "#BA7517",
]

const EMPTY = {
  icon: "⭐", name: "", category: "health", color: "#3B9EE8",
  scheduleType: "every", specificDays: [], timeBlock: "morning", xp: 10,
}

function toFormState(habit) {
  if (!habit) return EMPTY
  let scheduleType = "every", specificDays = []
  if (habit.days === "monthly") scheduleType = "monthly"
  else if (Array.isArray(habit.days)) { scheduleType = "specific"; specificDays = [...habit.days] }
  return {
    icon: habit.icon, name: habit.name, category: habit.category,
    color: habit.color || "#3B9EE8", scheduleType, specificDays,
    timeBlock: habit.timeBlock === "monthly" ? "morning" : habit.timeBlock, xp: habit.xp,
  }
}

const label = (text) => (
  <label
    className="block text-xs font-semibold uppercase tracking-widest mb-2"
    style={{ color: "var(--text-3)" }}
  >
    {text}
  </label>
)

const inactiveBtnStyle = { backgroundColor: "var(--bg-muted)", color: "var(--text-3)", border: "1px solid transparent" }
const activeToggleStyle = { backgroundColor: "rgba(83,74,183,0.25)", color: "var(--clr-accent-lo)", border: "1px solid var(--clr-accent)" }

export default function HabitForm({ habit, onSave, onCancel }) {
  const [form, setForm] = useState(() => toFormState(habit))
  const [errors, setErrors] = useState({})

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const toggleDay = (day) => setForm((p) => ({
    ...p,
    specificDays: p.specificDays.includes(day)
      ? p.specificDays.filter((d) => d !== day)
      : [...p.specificDays, day],
  }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "Name is required"
    if (form.scheduleType === "specific" && form.specificDays.length === 0) e.days = "Pick at least one day"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    let days, timeBlock
    if (form.scheduleType === "monthly") { days = "monthly"; timeBlock = "monthly" }
    else if (form.scheduleType === "specific") { days = DAY_ORDER.filter((d) => form.specificDays.includes(d)); timeBlock = form.timeBlock }
    else { days = "every"; timeBlock = form.timeBlock }
    onSave({ icon: form.icon.trim() || "⭐", name: form.name.trim(), category: form.category, color: form.color, days, timeBlock, xp: Math.max(1, Number(form.xp) || 10) })
  }

  const c = CATEGORY_COLORS[form.category]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="w-full max-w-md rounded-t-3xl px-5 pt-5 pb-8 slide-in overflow-y-auto"
        style={{ backgroundColor: "var(--bg-card)", maxHeight: "92vh" }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: "var(--bg-track)" }} />

        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text-1)" }}>
          {habit ? "Edit Habit" : "New Habit"}
        </h2>

        {/* Icon */}
        {label("Icon")}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: c.badgeBg }}
          >
            {form.icon || "⭐"}
          </div>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            placeholder="Paste emoji"
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
            style={{ backgroundColor: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text-1)" }}
            maxLength={4}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {SUGGESTED_ICONS.map((em) => (
            <button
              key={em}
              onClick={() => set("icon", em)}
              className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
              style={{
                backgroundColor: form.icon === em ? c.badgeBg : "var(--bg-hover)",
                border: form.icon === em ? `1px solid ${c.hex}` : "1px solid transparent",
              }}
            >
              {em}
            </button>
          ))}
        </div>

        {/* Name */}
        {label("Habit Name")}
        <input
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Drink 2L of water"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-1"
          style={{
            backgroundColor: "var(--bg-muted)",
            border: errors.name ? "1px solid #E05555" : "1px solid var(--border)",
            color: "var(--text-1)",
          }}
        />
        {errors.name && <p className="text-xs text-red-400 mb-3">{errors.name}</p>}
        {!errors.name && <div className="mb-4" />}

        {/* Category */}
        {label("Category")}
        <div className="flex gap-2 mb-5">
          {CATEGORIES.map((cat) => {
            const cc = CATEGORY_COLORS[cat]
            const active = form.category === cat
            return (
              <button
                key={cat}
                onClick={() => set("category", cat)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
                style={active
                  ? { backgroundColor: cc.badgeBg, color: cc.badgeText, border: `1px solid ${cc.hex}` }
                  : inactiveBtnStyle}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Button colour */}
        {label("Button Colour")}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: form.color,
              border: `2.5px solid ${form.color}`,
              boxShadow: `0 0 14px ${form.color}90, 0 0 5px ${form.color}60`,
            }}
          >
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1.5 5L4.5 8L10.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-wrap gap-2 flex-1">
            {COLOR_PALETTE.map((col) => (
              <button
                key={col}
                onClick={() => set("color", col)}
                className="w-7 h-7 rounded-full transition-all"
                style={{
                  backgroundColor: col,
                  boxShadow: form.color === col ? `0 0 0 2px var(--bg-card), 0 0 0 4px ${col}` : "none",
                  transform: form.color === col ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Schedule */}
        {label("Schedule")}
        <div className="flex gap-2 mb-3">
          {[
            { val: "every", label: "Every day" },
            { val: "specific", label: "Select days" },
            { val: "monthly", label: "1st of month" },
          ].map(({ val, label: lbl }) => (
            <button
              key={val}
              onClick={() => set("scheduleType", val)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={form.scheduleType === val ? activeToggleStyle : inactiveBtnStyle}
            >
              {lbl}
            </button>
          ))}
        </div>

        {form.scheduleType === "specific" && (
          <div className="mb-1">
            <div className="flex gap-1.5 mb-1">
              {DAY_ORDER.map((day) => {
                const active = form.specificDays.includes(day)
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                    style={active
                      ? { backgroundColor: c.badgeBg, color: c.badgeText, border: `1px solid ${c.hex}` }
                      : inactiveBtnStyle}
                  >
                    {day.slice(0, 1)}
                  </button>
                )
              })}
            </div>
            {errors.days && <p className="text-xs text-red-400 mb-2">{errors.days}</p>}
          </div>
        )}
        <div className="mb-4" />

        {/* Time block */}
        {form.scheduleType !== "monthly" && (
          <>
            {label("Time Block")}
            <div className="flex gap-2 mb-5">
              {[{ val: "morning", label: "☀️ Morning" }, { val: "night", label: "🌙 Night" }].map(({ val, label: lbl }) => (
                <button
                  key={val}
                  onClick={() => set("timeBlock", val)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={form.timeBlock === val ? activeToggleStyle : inactiveBtnStyle}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </>
        )}

        {/* XP */}
        {label("XP Reward")}
        <div className="flex items-center gap-3 mb-7">
          {[5, 10, 15, 20].map((v) => (
            <button
              key={v}
              onClick={() => set("xp", v)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={form.xp === v ? activeToggleStyle : inactiveBtnStyle}
            >
              +{v}
            </button>
          ))}
          <input
            type="number"
            inputMode="numeric"
            value={form.xp}
            onChange={(e) => set("xp", e.target.value)}
            className="w-16 px-2 py-2.5 rounded-xl text-sm font-bold text-center outline-none"
            style={{ backgroundColor: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text-1)" }}
            min={1} max={100}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-all"
            style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-2)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all"
            style={{ backgroundColor: "#534AB7", color: "#fff" }}
          >
            {habit ? "Save Changes" : "Add Habit"}
          </button>
        </div>
      </div>
    </div>
  )
}
