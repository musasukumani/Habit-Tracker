import { useState, useMemo, useEffect } from "react"
import { ThemeProvider } from "./context/ThemeContext"
import Header from "./components/Header"
import RewardModal from "./components/RewardModal"
import TodayView from "./views/TodayView"
import WeekView from "./views/WeekView"
import MonthView from "./views/MonthView"
import StatsView from "./views/StatsView"
import SettingsView from "./views/SettingsView"
import { useHabitStore } from "./hooks/useHabitStore"
import { isHabitScheduledForDate, formatDate, getWeekKey, getMonthKey } from "./utils/dateUtils"
import { computeWeekXP, computeMonthXP } from "./utils/xpUtils"

const TABS = [
  { id: "today",   label: "Today",  icon: "☀️" },
  { id: "week",    label: "Week",   icon: "📊" },
  { id: "month",   label: "Month",  icon: "📅" },
  { id: "stats",   label: "Stats",  icon: "⚡" },
  { id: "manage",  label: "Manage", icon: "⚙️" },
]

export default function App() {
  const [activeTab, setActiveTab] = useState("today")
  const [rewardToast, setRewardToast] = useState(null)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const { data, toggleHabit, addHabit, updateHabit, removeHabit, updateRewards, updateMVDHabits, importData } = useHabitStore()
  const habits = data.habits

  const todayKey = formatDate(today)
  const todayCompletions = data.completions[todayKey] || []
  const scheduledToday = habits.filter((h) => isHabitScheduledForDate(h, today))

  useEffect(() => {
    const rewards = data.rewards
    if (!rewards) return

    const now = new Date()
    const weekKey  = `week:${getWeekKey(now)}`
    const monthKey = `month:${getMonthKey(now)}`
    const celebrated = rewards.celebrated || []

    let newCelebrated = [...celebrated]
    let toast = null

    if (rewards.weekly?.enabled && !celebrated.includes(weekKey)) {
      const weekXP = computeWeekXP(data.completions, habits)
      if (weekXP >= rewards.weekly.threshold) {
        toast = { type: "weekly", xp: weekXP, threshold: rewards.weekly.threshold }
        newCelebrated = [...newCelebrated, weekKey]
      }
    }

    if (!toast && rewards.monthly?.enabled && !celebrated.includes(monthKey)) {
      const monthXP = computeMonthXP(data.completions, habits, now.getFullYear(), now.getMonth())
      if (monthXP >= rewards.monthly.threshold) {
        toast = { type: "monthly", xp: monthXP, threshold: rewards.monthly.threshold }
        newCelebrated = [...newCelebrated, monthKey]
      }
    }

    if (toast) {
      setRewardToast(toast)
      updateRewards({ ...rewards, celebrated: newCelebrated })
    }
  }, [data.completions, data.rewards, habits, updateRewards])

  return (
    <ThemeProvider>
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        <Header
          data={data}
          habits={habits}
          today={today}
          score={todayCompletions.length}
          total={scheduledToday.length}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === "today" && (
            <TodayView
              key="today"
              data={data}
              habits={habits}
              today={today}
              toggleHabit={toggleHabit}
            />
          )}
          {activeTab === "week" && (
            <WeekView key="week" data={data} habits={habits} />
          )}
          {activeTab === "month" && (
            <MonthView key="month" data={data} habits={habits} />
          )}
          {activeTab === "stats" && (
            <StatsView key="stats" data={data} habits={habits} />
          )}
          {activeTab === "manage" && (
            <SettingsView
              key="manage"
              data={data}
              habits={habits}
              rewards={data.rewards}
              mvdHabitIds={data.mvdHabitIds}
              onAdd={addHabit}
              onUpdate={updateHabit}
              onRemove={removeHabit}
              onUpdateRewards={updateRewards}
              onUpdateMVD={updateMVDHabits}
              onImport={importData}
            />
          )}
        </main>

        <nav
          className="flex-shrink-0 flex"
          style={{
            backgroundColor: "var(--bg-header)",
            borderTop: "1px solid var(--border)",
            position: "sticky",
            bottom: 0,
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors duration-200"
                style={{ color: isActive ? "var(--clr-accent-lo)" : "var(--text-3)" }}
              >
                <span className="text-xl leading-none">{tab.icon}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: isActive ? "var(--clr-accent-lo)" : "var(--text-3)" }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div
                    className="w-1 h-1 rounded-full absolute bottom-1"
                    style={{ backgroundColor: "var(--clr-accent)" }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <RewardModal reward={rewardToast} onClose={() => setRewardToast(null)} />
    </div>
    </ThemeProvider>
  )
}
