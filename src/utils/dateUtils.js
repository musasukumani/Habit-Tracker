const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export const getDayName = (date) => SHORT_DAYS[date.getDay()]

export const isHabitScheduledForDate = (habit, date) => {
  if (habit.days === "monthly") return date.getDate() === 1
  if (habit.days === "every") return true
  return habit.days.includes(getDayName(date))
}

export const getLast7Days = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    days.push(d)
  }
  return days
}

export const formatDisplayDate = (date) =>
  date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

export const formatShortDay = (date) =>
  SHORT_DAYS[date.getDay()].slice(0, 2)

export const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

export const getWeekKey = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day)) // rewind to Monday
  return formatDate(d)
}
