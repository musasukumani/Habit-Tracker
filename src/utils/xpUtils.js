import { HABITS as DEFAULT_HABITS, LEVELS } from "../data/habits"
import { formatDate } from "./dateUtils"

export const computeTotalXP = (completions, habits = DEFAULT_HABITS) => {
  let total = 0
  for (const ids of Object.values(completions)) {
    for (const id of ids) {
      const habit = habits.find((h) => h.id === id)
      if (habit) total += habit.xp
    }
  }
  return total
}

export const computeDayXP = (completions, habits, date) => {
  const key = formatDate(date)
  let total = 0
  for (const id of completions[key] || []) {
    const habit = habits.find((h) => h.id === id)
    if (habit) total += habit.xp
  }
  return total
}

export const computeMonthXP = (completions, habits, year, month) => {
  let total = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    total += computeDayXP(completions, habits, new Date(year, month, d))
  }
  return total
}

export const getLevel = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return LEVELS[i]
  }
  return LEVELS[0]
}

export const getLevelProgress = (xp) => {
  const level = getLevel(xp)
  const idx = LEVELS.findIndex((l) => l.name === level.name)
  if (idx === LEVELS.length - 1) return 100
  const next = LEVELS[idx + 1]
  return Math.min(100, ((xp - level.min) / (next.min - level.min)) * 100)
}

export const computeStreak = (completions) => {
  let streak = 0
  const today = new Date()
  const todayKey = formatDate(today)
  const todayCount = (completions[todayKey] || []).length

  // If today has >= 3 completions, start counting from today; otherwise from yesterday
  const startOffset = todayCount >= 3 ? 0 : 1

  for (let i = startOffset; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = formatDate(d)
    const count = (completions[key] || []).length
    if (count >= 3) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export const computeWeekXP = (completions, habits = DEFAULT_HABITS) => {
  let total = 0
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = formatDate(d)
    for (const id of completions[key] || []) {
      const habit = habits.find((h) => h.id === id)
      if (habit) total += habit.xp
    }
  }
  return total
}

export const computeTotalChecks = (completions) => {
  let total = 0
  for (const ids of Object.values(completions)) {
    total += ids.length
  }
  return total
}
