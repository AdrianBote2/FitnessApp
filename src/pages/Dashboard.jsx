import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiFire, HiMoon, HiLightningBolt, HiAdjustments } from 'react-icons/hi'
import { TbMeat } from 'react-icons/tb'
import { supabase } from '../services/supabase'
import GoalModal from '../components/GoalModal'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// stagger children with fade + slide up
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// animated SVG ring for goal progress
function ProgressRing({ progress, color, size = 44 }) {
  const strokeWidth = 3.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text-primary">
        {Math.round(progress)}%
      </span>
    </div>
  )
}

// dynamic encouragement based on goal progress
function getCelebrationMsg(progress) {
  if (progress >= 100) return 'Crushed it! 🏆'
  if (progress >= 80) return 'Almost there! 💪'
  if (progress >= 50) return 'Solid work! 👊'
  return "Let's go! 🚀"
}

// dynamic streak message based on consecutive days
function getStreakMsg(streak) {
  if (streak === 0) return 'Start your streak today!'
  if (streak <= 2) return 'Good start! Keep going!'
  if (streak <= 6) return "You're on fire! 🔥"
  if (streak <= 13) return 'Unstoppable! 💪'
  if (streak <= 29) return 'Beast mode! 🦾'
  return 'Legend status 👑'
}

function Dashboard({ session }) {
  const [todayLog, setTodayLog] = useState(null)
  const [recentLogs, setRecentLogs] = useState([])
  const [weekCalories, setWeekCalories] = useState([0, 0, 0, 0, 0, 0, 0])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [goals, setGoals] = useState(null)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [xp, setXp] = useState(0)
  const [visibleStats, setVisibleStats] = useState(() => {
    const saved = localStorage.getItem('nucleus-visible-stats')
    return saved ? JSON.parse(saved) : ['Calories', 'Protein', 'Sleep', 'Energy']
  })

  // get display name from email
  const userName = session?.user?.email?.split('@')[0] || 'there'

  // pick one greeting per session, not per render
  const [greeting] = useState(() => {
    const greetings = [
      `Welcome, ${userName}`,
      `Let's get after it, ${userName}`,
      `Ready to crush it, ${userName}?`,
      `Stay consistent, ${userName}`,
      `Keep pushing, ${userName}`,
      `Time to level up, ${userName}`,
      `No days off, ${userName}`,
      `Gains don't wait, ${userName}`,
      `Lock in, ${userName}`,
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    const { data: todayData } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('log_date', today)
      .order('created_at', { ascending: false })
      .limit(1)

    if (todayData && todayData.length > 0) {
      setTodayLog(todayData[0])
    }

    // pull last 30 days for week/month averages
    const thirtyAgo = new Date()
    thirtyAgo.setDate(thirtyAgo.getDate() - 29)
    const thirtyStart = thirtyAgo.toISOString().split('T')[0]

    const { data: recentData } = await supabase
      .from('daily_logs')
      .select('log_date, calories, protein, sleep_hours, energy_level')
      .eq('user_id', user.id)
      .gte('log_date', thirtyStart)
      .order('log_date')

    if (recentData) setRecentLogs(recentData)

    const startOfWeek = getStartOfWeek()
    const { data: weekData } = await supabase
      .from('daily_logs')
      .select('log_date, calories')
      .eq('user_id', user.id)
      .gte('log_date', startOfWeek)
      .order('log_date')

    if (weekData) {
      const caloriesByDay = [0, 0, 0, 0, 0, 0, 0]
      weekData.forEach((log) => {
        const dayIndex = (new Date(log.log_date + 'T00:00:00').getDay() + 6) % 7
        caloriesByDay[dayIndex] = log.calories || 0
      })
      setWeekCalories(caloriesByDay)
    }

    const { data: allLogs } = await supabase
      .from('daily_logs')
      .select('log_date')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })

    if (allLogs) {
      let count = 0
      const checkDate = new Date()
      for (let i = 0; i < allLogs.length; i++) {
        const logDate = allLogs[i].log_date
        const expected = checkDate.toISOString().split('T')[0]
        if (logDate === expected) {
          count++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
      setStreak(count)

      // XP: 10 per log entry
      setXp(allLogs.length * 10)
    }

    // fetch user goals
    const { data: goalData } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)

    if (goalData && goalData.length > 0) {
      setGoals(goalData[0])
    }

    setLoading(false)
  }

  const getStartOfWeek = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    const monday = new Date(now)
    monday.setDate(now.getDate() + diff)
    return monday.toISOString().split('T')[0]
  }

  // compute stat values based on selected time range
  const getStatValues = () => {
    if (timeRange === 'today') {
      return {
        calories: todayLog?.calories ?? '—',
        protein: todayLog?.protein ?? '—',
        sleep: todayLog?.sleep_hours ?? '—',
        energy: todayLog?.energy_level ?? '—',
      }
    }

    // filter logs to the selected range
    const days = timeRange === 'week' ? 7 : 30
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - (days - 1))
    const cutoffStr = cutoff.toISOString().split('T')[0]
    const filtered = recentLogs.filter((log) => log.log_date >= cutoffStr)

    if (filtered.length === 0) {
      return { calories: '—', protein: '—', sleep: '—', energy: '—' }
    }

    // average helper — ignores null entries
    const avg = (key) => {
      const values = filtered.map((l) => l[key]).filter((v) => v != null)
      if (values.length === 0) return '—'
      return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    }

    return {
      calories: avg('calories'),
      protein: avg('protein'),
      sleep: avg('sleep_hours'),
      energy: avg('energy_level'),
    }
  }

  const statValues = getStatValues()
  const isAvg = timeRange !== 'today'

  const todayStats = [
    { label: 'Calories', value: statValues.calories, unit: isAvg ? 'avg kcal' : 'kcal', goal: goals?.calorie_goal, icon: HiFire, iconColor: 'text-orange-400', bgColor: 'bg-orange-500/15', strokeColor: '#fb923c' },
    { label: 'Protein', value: statValues.protein, unit: isAvg ? 'avg g' : 'g', goal: goals?.protein_goal, icon: TbMeat, iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/15', strokeColor: '#34d399' },
    { label: 'Sleep', value: statValues.sleep, unit: isAvg ? 'avg hrs' : 'hrs', goal: goals?.sleep_goal, icon: HiMoon, iconColor: 'text-violet-400', bgColor: 'bg-violet-500/15', strokeColor: '#a78bfa' },
    { label: 'Energy', value: statValues.energy, unit: isAvg ? 'avg / 10' : '/ 10', goal: goals?.energy_goal, icon: HiLightningBolt, iconColor: 'text-amber-400', bgColor: 'bg-amber-500/15', strokeColor: '#fbbf24' },
  ]

  const maxCalories = Math.max(...weekCalories, 1)

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="font-heading text-3xl font-bold">{greeting}</h1>
          <p className="text-text-muted text-sm mt-1">
            {timeRange === 'today' && "Here's your daily overview"}
            {timeRange === 'week' && 'Averages from the last 7 days'}
            {timeRange === 'month' && 'Averages from the last 30 days'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGoalModal(true)}
            className="cursor-pointer bg-dark-card hover:bg-white/10 text-text-muted text-sm px-3 py-2 rounded-lg border border-white/10 transition-colors duration-150"
          >
            <HiAdjustments className="text-lg" />
          </button>
          <Link
            to="/log"
            className="bg-accent hover:bg-accent/80 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
          >
            + Quick Log
          </Link>
        </div>
      </motion.div>

      {/* time range toggle */}
      <div className="flex gap-1 mb-6 bg-dark-card rounded-lg p-1 w-fit">
        {['today', 'week', 'month'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`cursor-pointer text-xs font-medium px-4 py-1.5 rounded-md transition-colors duration-150 capitalize ${
              timeRange === range
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-dark-card rounded-xl p-10 text-center">
          <p className="text-text-muted">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          <motion.div
            key={timeRange}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {todayStats.filter((stat) => visibleStats.includes(stat.label)).map((stat) => {
              const hasGoal = stat.goal != null && typeof stat.value === 'number'
              const progress = hasGoal ? Math.min((stat.value / stat.goal) * 100, 100) : 0

              return (
                <motion.div key={stat.label} variants={item} className="bg-dark-card rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`inline-flex p-1.5 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`text-sm ${stat.iconColor}`} />
                    </div>
                    <p className="text-text-muted text-xs uppercase tracking-wide">{stat.label}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-heading text-2xl font-bold">
                        {stat.value}
                        <span className="text-text-muted text-sm font-normal ml-1">{stat.unit}</span>
                      </p>
                      {hasGoal && (
                        <p className="text-xs mt-1" style={{ color: stat.strokeColor }}>
                          {getCelebrationMsg(progress)}
                        </p>
                      )}
                    </div>
                    {hasGoal && (
                      <ProgressRing progress={progress} color={stat.strokeColor} />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            <motion.div
              variants={item}
              className={`bg-dark-card rounded-xl p-5 transition-all duration-300 ${
                streak >= 3 ? 'border border-accent/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {streak > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-lg"
                  >
                    🔥
                  </motion.span>
                )}
                <p className="text-text-muted text-xs uppercase tracking-wide">Current Streak</p>
              </div>
              <p className="font-heading text-4xl font-bold text-accent">{streak}</p>
              <p className="text-text-muted text-sm mt-1">consecutive days logged</p>
              <p className="text-accent text-xs mt-2 font-medium">{getStreakMsg(streak)}</p>

              {/* XP & level */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-text-muted text-xs">
                    Level {Math.floor(xp / 500) + 1}
                  </p>
                  <p className="text-text-muted text-xs font-medium">
                    {xp} XP
                  </p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(xp % 500) / 500 * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
                <p className="text-text-muted text-[10px] mt-1">{500 - (xp % 500)} XP to next level</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-dark-card rounded-xl p-5 lg:col-span-2">
              <p className="text-text-muted text-xs uppercase tracking-wide mb-4">Weekly Calories</p>
              <div className="flex items-end justify-between gap-2 h-32">
                {weekDays.map((day, i) => (
                  <div key={day} className="flex flex-col items-center flex-1 h-full justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: weekCalories[i] > 0
                          ? `${(weekCalories[i] / maxCalories) * 100}%`
                          : '8%',
                      }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                      className={`w-full rounded-md ${
                        weekCalories[i] > 0 ? 'bg-accent/70' : 'bg-white/5'
                      }`}
                    />
                    <p className="text-text-muted text-xs mt-2">{day}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* goal settings modal */}
      {showGoalModal && (
        <GoalModal
          goals={goals}
          visibleStats={visibleStats}
          onSave={(saved, visible) => {
            setGoals(saved)
            setVisibleStats(visible)
            setShowGoalModal(false)
          }}
          onClose={() => setShowGoalModal(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
