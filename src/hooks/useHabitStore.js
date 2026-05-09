import { useState, useEffect, useCallback } from "react"
import { formatDate } from "../utils/dateUtils"
import { HABITS as DEFAULT_HABITS } from "../data/habits"

const STORAGE_KEY = "autopilot-habit-tracker-v1"

const DEFAULT_REWARDS = {
  weekly:  { enabled: true, threshold: 200 },
  monthly: { enabled: true, threshold: 1000 },
  celebrated: [],
}

const DEFAULT_MVD_IDS = [2, 8, 9]

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completions: {}, monthlyDone: {}, habits: DEFAULT_HABITS, rewards: DEFAULT_REWARDS, mvdHabitIds: DEFAULT_MVD_IDS }
    const parsed = JSON.parse(raw)
    if (!parsed.habits)      parsed.habits      = DEFAULT_HABITS
    if (!parsed.rewards)     parsed.rewards     = DEFAULT_REWARDS
    if (!parsed.mvdHabitIds) parsed.mvdHabitIds = DEFAULT_MVD_IDS
    return parsed
  } catch {
    return { completions: {}, monthlyDone: {}, habits: DEFAULT_HABITS, rewards: DEFAULT_REWARDS, mvdHabitIds: DEFAULT_MVD_IDS }
  }
}

export const useHabitStore = () => {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const toggleHabit = useCallback((habitId, date = new Date()) => {
    const key = formatDate(date)
    setData((prev) => {
      const day = prev.completions[key] || []
      const newDay = day.includes(habitId)
        ? day.filter((id) => id !== habitId)
        : [...day, habitId]
      return { ...prev, completions: { ...prev.completions, [key]: newDay } }
    })
  }, [])

  const isCompleted = useCallback(
    (habitId, date = new Date()) => {
      const key = formatDate(date)
      return (data.completions[key] || []).includes(habitId)
    },
    [data]
  )

  const getDayCompletions = useCallback(
    (date) => data.completions[formatDate(date)] || [],
    [data]
  )

  const addHabit = useCallback((habit) => {
    setData((prev) => ({
      ...prev,
      habits: [...prev.habits, { ...habit, id: crypto.randomUUID() }],
    }))
  }, [])

  const updateHabit = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }))
  }, [])

  const removeHabit = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
      // also remove from MVD if present
      mvdHabitIds: prev.mvdHabitIds.filter((mid) => mid !== id),
    }))
  }, [])

  const updateRewards = useCallback((rewards) => {
    setData((prev) => ({ ...prev, rewards }))
  }, [])

  const updateMVDHabits = useCallback((mvdHabitIds) => {
    setData((prev) => ({ ...prev, mvdHabitIds }))
  }, [])

  const importData = useCallback((newData) => {
    setData(newData)
  }, [])

  return { data, toggleHabit, isCompleted, getDayCompletions, addHabit, updateHabit, removeHabit, updateRewards, updateMVDHabits, importData }
}
