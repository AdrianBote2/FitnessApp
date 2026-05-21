import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../services/supabase'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function Insights() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateInsights = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // last 7 days
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 6)
    const startDate = weekAgo.toISOString().split('T')[0]

    // pull logs
    const { data: logs } = await supabase
      .from('daily_logs')
      .select('log_date, calories, protein, meal_timing, sleep_hours, energy_level, stress_level')
      .eq('user_id', user.id)
      .gte('log_date', startDate)
      .order('log_date')

    // pull workouts
    const { data: workouts } = await supabase
      .from('workout_entries')
      .select('exercise, type, sets, reps, weight, distance, duration, daily_logs!inner(log_date, user_id)')
      .eq('daily_logs.user_id', user.id)
      .gte('daily_logs.log_date', startDate)

    if (!logs || logs.length === 0) {
      setError('No data from the last 7 days. Log some entries first!')
      setLoading(false)
      return
    }

    try {
      // call our serverless function (not OpenAI directly)
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs, workouts: workouts || [] }),
      })

      if (!response.ok) throw new Error('Failed to generate insights')

      const data = await response.json()
      setInsights(data.insights)
    } catch (err) {
      setError('Could not generate insights. Try again later.')
    }

    setLoading(false)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">AI Insights</h1>
          <p className="text-text-muted text-sm mt-1">Weekly analysis powered by AI</p>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="cursor-pointer bg-dark-card hover:bg-white/10 text-text-primary text-sm font-medium px-4 py-2 rounded-lg border border-white/10 transition-colors duration-150 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : insights.length > 0 ? 'Regenerate' : 'Generate Insights'}
        </button>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {insights.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {insights.map((insight, i) => (
            <motion.div key={i} variants={item} className="bg-dark-card rounded-xl p-6">
              <h2 className="font-heading text-lg font-semibold mb-2">{insight.title}</h2>
              <p className="text-text-muted text-sm leading-relaxed">{insight.body}</p>
            </motion.div>
          ))}
        </motion.div>
      ) : !loading && !error && (
        <div className="bg-dark-card rounded-xl p-10 text-center">
          <p className="text-text-muted">Click "Generate Insights" to analyze your last 7 days of data.</p>
        </div>
      )}

      <div className="mt-6 bg-dark-card rounded-xl p-6 border border-white/5">
        <p className="text-text-muted text-xs text-center">
          Insights are generated from your last 7 days of logged data. Log consistently for more accurate analysis.
        </p>
      </div>
    </div>
  )
}

export default Insights
