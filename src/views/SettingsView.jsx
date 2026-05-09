import { useState } from "react"
import HabitForm from "../components/HabitForm"
import { CATEGORY_COLORS } from "../data/habits"

const TIME_BLOCK_LABELS = {
  morning: { label: "Morning", icon: "☀️" },
  night:   { label: "Night",   icon: "🌙" },
  monthly: { label: "Monthly", icon: "📅" },
}

function scheduleSummary(habit) {
  if (habit.days === "monthly") return "1st of month"
  if (habit.days === "every") return "Every day"
  return habit.days.join(", ")
}

function SectionHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
        {label}
      </h3>
    </div>
  )
}

function HabitCard({ habit, onEdit, onRemove }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const c = CATEGORY_COLORS[habit.category]

  const handleRemove = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    onRemove(habit.id)
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "var(--bg-hover)" }}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: c.badgeBg }}
      >
        {habit.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: "var(--text-1)" }}>{habit.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: c.badgeBg, color: c.badgeText }}>
            {habit.category}
          </span>
          <span className="text-xs" style={{ color: "var(--text-3)" }}>{scheduleSummary(habit)}</span>
          <span className="text-xs font-bold" style={{ color: c.text }}>+{habit.xp}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(habit)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ backgroundColor: "var(--clr-accent-bg)" }}
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z" stroke="var(--clr-accent-lo)" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={handleRemove}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ backgroundColor: confirmDelete ? "rgba(200,50,50,0.25)" : "var(--bg-muted)" }}
          title={confirmDelete ? "Tap again to confirm" : "Delete"}
        >
          {confirmDelete ? (
            <span className="text-xs font-bold" style={{ color: "var(--clr-danger)" }}>!</span>
          ) : (
            <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
              <path d="M1 3.5H12M4.5 3.5V2H8.5V3.5M5.5 6.5V10.5M7.5 6.5V10.5M2 3.5L2.5 12H10.5L11 3.5H2Z"
                stroke="#666" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ backgroundColor: on ? "var(--clr-accent)" : "var(--bg-track)" }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
        style={{ left: on ? "22px" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
      />
    </button>
  )
}

function RewardCard({ icon, title, description, enabled, threshold, onToggle, onChangeThreshold }) {
  return (
    <div
      className="p-4 rounded-xl transition-all"
      style={{
        backgroundColor: enabled ? "var(--clr-accent-bg)" : "var(--bg-hover)",
        border: `1px solid ${enabled ? "rgba(83,74,183,0.3)" : "var(--border)"}`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl leading-none">{icon}</span>
        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{title}</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{description}</div>
        </div>
        <Toggle on={enabled} onToggle={onToggle} />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--text-3)" }}>Congratulate me when I reach</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={threshold}
            disabled={!enabled}
            onChange={(e) => onChangeThreshold(Math.max(1, Number(e.target.value)))}
            className="w-16 text-center text-sm font-bold rounded-lg px-2 py-1 outline-none transition-all"
            style={{
              backgroundColor: enabled ? "rgba(83,74,183,0.15)" : "var(--bg-muted)",
              color: enabled ? "var(--clr-accent-lo)" : "var(--text-4)",
              border: "1px solid transparent",
            }}
          />
          <span className="text-xs font-semibold" style={{ color: enabled ? "var(--clr-accent-lo)" : "var(--text-4)" }}>XP</span>
        </div>
      </div>
    </div>
  )
}

function MVDCard({ habit, selected, onToggle }) {
  const c = CATEGORY_COLORS[habit.category]
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all"
      style={{
        backgroundColor: selected ? "var(--clr-accent-bg)" : "var(--bg-hover)",
        border: `1px solid ${selected ? "rgba(83,74,183,0.3)" : "var(--border)"}`,
      }}
    >
      <span className="text-lg leading-none">{habit.icon}</span>
      <span className="flex-1 text-sm font-medium" style={{ color: "var(--text-1)" }}>{habit.name}</span>
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          backgroundColor: selected ? "var(--clr-accent)" : "transparent",
          border: selected ? "none" : "2px solid var(--border-hi)",
        }}
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  )
}

function DataBackup({ data, onImport }) {
  const [importError, setImportError] = useState(null)
  const [importOk, setImportOk]       = useState(false)

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    const date = new Date().toISOString().split("T")[0]
    a.href     = url
    a.download = `autopilot-backup-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImportError(null)
    setImportOk(false)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (!parsed.habits || !parsed.completions) throw new Error("Invalid backup file")
        onImport(parsed)
        setImportOk(true)
        setTimeout(() => setImportOk(false), 3000)
      } catch {
        setImportError("Could not read file — make sure it's an Autopilot backup.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  return (
    <div className="mt-2 mb-8">
      <SectionHeader icon="💾" label="Data & Backup" />
      <p className="text-xs mb-4" style={{ color: "var(--text-4)" }}>
        Export saves all your habits and completion history as a JSON file. Import restores from a previous export.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-1)" }}
        >
          Export backup
        </button>
        <label
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-center cursor-pointer transition-all"
          style={{ backgroundColor: "var(--clr-accent-bg)", border: "1px solid rgba(83,74,183,0.3)", color: "var(--clr-accent-lo)" }}
        >
          Import backup
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
      </div>
      {importOk && (
        <p className="text-xs mt-2 font-semibold" style={{ color: "var(--clr-success)" }}>
          ✓ Data restored successfully
        </p>
      )}
      {importError && (
        <p className="text-xs mt-2" style={{ color: "var(--clr-danger)" }}>{importError}</p>
      )}
    </div>
  )
}

export default function SettingsView({ habits, rewards, mvdHabitIds = [], onAdd, onUpdate, onRemove, onUpdateRewards, onUpdateMVD, onImport, data }) {
  const [formState, setFormState] = useState(null)

  const openAdd  = () => setFormState({ habit: null })
  const openEdit = (habit) => setFormState({ habit })
  const closeForm = () => setFormState(null)

  const handleSave = (fields) => {
    if (formState.habit) onUpdate(formState.habit.id, fields)
    else onAdd(fields)
    closeForm()
  }

  const setWeekly  = (patch) => onUpdateRewards({ ...rewards, weekly:  { ...rewards.weekly,  ...patch } })
  const setMonthly = (patch) => onUpdateRewards({ ...rewards, monthly: { ...rewards.monthly, ...patch } })

  const toggleMVD = (id) => {
    if (mvdHabitIds.includes(id)) onUpdateMVD(mvdHabitIds.filter((x) => x !== id))
    else onUpdateMVD([...mvdHabitIds, id])
  }

  const groups = [
    { key: "morning", habits: habits.filter((h) => h.timeBlock === "morning") },
    { key: "night",   habits: habits.filter((h) => h.timeBlock === "night")   },
    { key: "monthly", habits: habits.filter((h) => h.timeBlock === "monthly") },
  ].filter((g) => g.habits.length > 0)

  return (
    <div className="p-4 pb-28">
      {/* Habits header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-1)" }}>Manage Habits</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-4)" }}>{habits.length} habits · tap to edit or delete</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all"
          style={{ backgroundColor: "var(--clr-accent)", color: "#fff" }}
        >
          <span className="text-base leading-none">+</span>
          Add
        </button>
      </div>

      {habits.length === 0 && (
        <div className="text-center py-10" style={{ color: "var(--text-4)" }}>
          <div className="text-4xl mb-3">📋</div>
          <div className="text-sm">No habits yet.</div>
          <div className="text-xs mt-1">Tap "Add" to create your first habit.</div>
        </div>
      )}

      {groups.map(({ key, habits: groupHabits }) => {
        const { label, icon } = TIME_BLOCK_LABELS[key]
        return (
          <div key={key} className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <span>{icon}</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>{label}</span>
              <span className="text-xs" style={{ color: "var(--text-4)" }}>({groupHabits.length})</span>
            </div>
            <div className="flex flex-col gap-2">
              {groupHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} onEdit={openEdit} onRemove={onRemove} />
              ))}
            </div>
          </div>
        )
      })}

      {habits.length > 0 && (
        <p className="text-xs text-center mb-8" style={{ color: "var(--text-4)" }}>
          Tap delete once to arm · tap again to confirm
        </p>
      )}

      {/* ── Data & Backup ───────────────────────────────── */}
      <DataBackup data={data} onImport={onImport} />

      {/* ── Minimum Viable Day ───────────────────────────── */}
      <div className="mt-2 mb-8">
        <SectionHeader icon="⚡" label="Minimum Viable Day" />
        <p className="text-xs mb-4" style={{ color: "var(--text-4)" }}>
          The habits that define a "good enough" day. The MVD bar on Today tracks only these.
        </p>
        {habits.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--text-4)" }}>Add habits first.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {habits.map((habit) => (
              <MVDCard
                key={habit.id}
                habit={habit}
                selected={mvdHabitIds.includes(habit.id)}
                onToggle={() => toggleMVD(habit.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Rewards ─────────────────────────────────────── */}
      <div className="mt-2">
        <SectionHeader icon="🎯" label="Rewards" />
        <p className="text-xs mb-4" style={{ color: "var(--text-4)" }}>
          The app will congratulate you with a popup whenever you hit these XP milestones. Each milestone triggers once per period.
        </p>
        <div className="flex flex-col gap-3">
          <RewardCard
            icon="🏆"
            title="Weekly XP Goal"
            description="Celebrate hitting your weekly target"
            enabled={rewards?.weekly?.enabled ?? true}
            threshold={rewards?.weekly?.threshold ?? 200}
            onToggle={() => setWeekly({ enabled: !rewards?.weekly?.enabled })}
            onChangeThreshold={(v) => setWeekly({ threshold: v })}
          />
          <RewardCard
            icon="👑"
            title="Monthly XP Goal"
            description="Celebrate hitting your monthly target"
            enabled={rewards?.monthly?.enabled ?? true}
            threshold={rewards?.monthly?.threshold ?? 1000}
            onToggle={() => setMonthly({ enabled: !rewards?.monthly?.enabled })}
            onChangeThreshold={(v) => setMonthly({ threshold: v })}
          />
        </div>
      </div>

      {formState !== null && (
        <HabitForm habit={formState.habit} onSave={handleSave} onCancel={closeForm} />
      )}
    </div>
  )
}
