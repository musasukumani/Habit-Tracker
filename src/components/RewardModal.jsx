export default function RewardModal({ reward, onClose }) {
  if (!reward) return null

  const isWeekly = reward.type === "weekly"

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-7 text-center slide-in"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(83,74,183,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-3">{isWeekly ? "🏆" : "👑"}</div>

        <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--clr-accent-lo)" }}>
          {isWeekly ? "Weekly Goal" : "Monthly Goal"}
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-1)" }}>
          {isWeekly ? "Week crushed!" : "Month conquered!"}
        </h2>

        <p className="text-sm mb-4" style={{ color: "var(--text-3)" }}>
          You hit your {isWeekly ? "weekly" : "monthly"} XP target of{" "}
          <span className="font-bold" style={{ color: "var(--text-2)" }}>
            {reward.threshold} XP
          </span>
        </p>

        <div
          className="py-4 rounded-2xl mb-5"
          style={{ backgroundColor: "var(--clr-accent-bg)", border: "1px solid rgba(83,74,183,0.2)" }}
        >
          <div className="text-4xl font-bold" style={{ color: "var(--clr-accent-lo)" }}>
            {reward.xp}
            <span className="text-xl font-normal ml-1" style={{ color: "var(--text-3)" }}>XP</span>
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-4)" }}>
            {isWeekly ? "this week" : "this month"}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all"
          style={{ background: "linear-gradient(135deg, var(--clr-accent), var(--clr-accent-lo))" }}
        >
          Keep grinding 💪
        </button>
      </div>
    </div>
  )
}
