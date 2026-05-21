import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../services/supabase'

const allStats = ['Calories', 'Protein', 'Sleep', 'Energy']

function GoalModal({ goals, visibleStats, onSave, onClose }) {
  // seed form with current goals or defaults
  const [calorieGoal, setCalorieGoal] = useState(goals?.calorie_goal ?? 2000)
  const [proteinGoal, setProteinGoal] = useState(goals?.protein_goal ?? 150)
  const [sleepGoal, setSleepGoal] = useState(goals?.sleep_goal ?? 8)
  const [energyGoal, setEnergyGoal] = useState(goals?.energy_goal ?? 8)
  const [visible, setVisible] = useState(visibleStats || allStats)
  const [saving, setSaving] = useState(false)

  // toggle a stat on or off
  const toggleStat = (stat) => {
    setVisible((prev) =>
      prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
    )
  }

  const handleSave = async () => {
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const goalData = {
      user_id: user.id,
      calorie_goal: parseInt(calorieGoal),
      protein_goal: parseInt(proteinGoal),
      sleep_goal: parseFloat(sleepGoal),
      energy_goal: parseInt(energyGoal),
    }

    // upsert — insert if no row exists, update if it does
    const { data, error } = await supabase
      .from('user_goals')
      .upsert(goalData, { onConflict: 'user_id' })
      .select()

    if (!error && data) {
      // save stat visibility to localStorage
      localStorage.setItem('nucleus-visible-stats', JSON.stringify(visible))
      onSave(data[0], visible)
    }

    setSaving(false)
  }

  // close modal when clicking the backdrop
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const inputClass =
    'w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150'

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-dark-card rounded-xl p-6 w-full max-w-md mx-4 border border-white/10"
      >
        <h2 className="font-heading text-lg font-semibold mb-1">Set Your Goals</h2>
        <p className="text-text-muted text-xs mb-5">
          Personalize your dashboard with daily targets
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">
              Calorie Goal (kcal)
            </label>
            <input
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">
              Protein Goal (g)
            </label>
            <input
              type="number"
              value={proteinGoal}
              onChange={(e) => setProteinGoal(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">
              Sleep Goal (hrs)
            </label>
            <input
              type="number"
              step="0.5"
              value={sleepGoal}
              onChange={(e) => setSleepGoal(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">
              Energy Goal (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={energyGoal}
              onChange={(e) => setEnergyGoal(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* stat visibility toggles */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <p className="text-text-muted text-xs uppercase tracking-wide mb-3">Show on Dashboard</p>
          <div className="flex flex-wrap gap-2">
            {allStats.map((stat) => (
              <button
                key={stat}
                onClick={() => toggleStat(stat)}
                className={`cursor-pointer text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-150 ${
                  visible.includes(stat)
                    ? 'bg-accent/20 text-accent border-accent/30'
                    : 'bg-white/5 text-text-muted border-white/10'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 bg-dark-surface hover:bg-white/10 text-text-muted text-sm font-medium px-4 py-2.5 rounded-lg border border-white/10 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer flex-1 bg-accent hover:bg-accent/80 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Goals'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default GoalModal
