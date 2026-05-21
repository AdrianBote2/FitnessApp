import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../services/supabase'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function Progress() {
  const [logs, setLogs] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  // pull last 14 days of logs + workouts
  useEffect(() => {
    fetchProgressData()
  }, [])

  const fetchProgressData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 14 days ago
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13)
    const startDate = twoWeeksAgo.toISOString().split('T')[0]

    // daily logs for nutrition + recovery charts
    const { data: logData } = await supabase
      .from('daily_logs')
      .select('log_date, calories, protein, sleep_hours, energy_level')
      .eq('user_id', user.id)
      .gte('log_date', startDate)
      .order('log_date')

    if (logData) {
      // format dates for chart labels (e.g. "5/18")
      const formatted = logData.map((log) => ({
        ...log,
        date: new Date(log.log_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
      }))
      setLogs(formatted)
    }

    // workout volume = sets * reps * weight per day
    const { data: workoutData } = await supabase
      .from('workout_entries')
      .select('daily_log_id, sets, reps, weight, daily_logs!inner(log_date, user_id)')
      .eq('daily_logs.user_id', user.id)
      .gte('daily_logs.log_date', startDate)
      .order('daily_logs(log_date)')

    if (workoutData) {
      // group by date and sum volume
      const volumeByDate = {}
      workoutData.forEach((w) => {
        const date = w.daily_logs.log_date
        const volume = (w.sets || 0) * (w.reps || 0) * (w.weight || 0)
        volumeByDate[date] = (volumeByDate[date] || 0) + volume
      })

      const volumeArray = Object.entries(volumeByDate).map(([date, volume]) => ({
        date: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        volume: Math.round(volume),
      }))
      setWorkouts(volumeArray)
    }

    setLoading(false)
  }

  // no data state
  const noData = logs.length === 0

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Progress</h1>
        <p className="text-text-muted text-sm mt-1">Track your trends over the last 14 days</p>
      </motion.div>

      {loading ? (
        <div className="bg-dark-card rounded-xl p-10 text-center">
          <p className="text-text-muted">Loading your progress...</p>
        </div>
      ) : noData ? (
        <div className="bg-dark-card rounded-xl p-10 text-center">
          <p className="text-text-muted">No data yet. Log some entries to see your progress!</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* calories — line chart */}
          <motion.div variants={item} className="bg-dark-card rounded-xl p-5">
            <p className="text-text-muted text-xs uppercase tracking-wide mb-4">Calorie Intake</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
                <Tooltip contentStyle={{ backgroundColor: '#16162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* protein — line chart */}
          <motion.div variants={item} className="bg-dark-card rounded-xl p-5">
            <p className="text-text-muted text-xs uppercase tracking-wide mb-4">Protein Intake</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
                <Tooltip contentStyle={{ backgroundColor: '#16162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="protein" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* sleep — bar chart */}
          <motion.div variants={item} className="bg-dark-card rounded-xl p-5">
            <p className="text-text-muted text-xs uppercase tracking-wide mb-4">Sleep Hours</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
                <Tooltip contentStyle={{ backgroundColor: '#16162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9' }} />
                <Bar dataKey="sleep_hours" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* energy — line chart */}
          <motion.div variants={item} className="bg-dark-card rounded-xl p-5">
            <p className="text-text-muted text-xs uppercase tracking-wide mb-4">Energy Level</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={40} domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: '#16162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="energy_level" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* workout volume — bar chart, full width */}
          <motion.div variants={item} className="bg-dark-card rounded-xl p-5 md:col-span-2">
            <p className="text-text-muted text-xs uppercase tracking-wide mb-4">Workout Volume</p>
            {workouts.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={workouts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={50} />
                  <Tooltip contentStyle={{ backgroundColor: '#16162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9' }} />
                  <Bar dataKey="volume" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-muted text-sm text-center py-8">No workouts logged yet</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Progress
