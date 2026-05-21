import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function Dashboard() {
  const [todayLog, setTodayLog] = useState(null)
  const [weekCalories, setWeekCalories] = useState([0, 0, 0, 0, 0, 0, 0])
  const [streak, setStreak] = useState(0)

  //load data when page opens
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    //today's log for stat cards
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

    //this week's calories for the bar chart
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
        //getDay() returns 0=Sun, we want 0=Mon
        const dayIndex = (new Date(log.log_date + 'T00:00:00').getDay() + 6) % 7
        caloriesByDay[dayIndex] = log.calories || 0
      })
      setWeekCalories(caloriesByDay)
    }

    //streak — how many days in a row the user logged
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
    }
  }

  //finds Monday of this week
  const getStartOfWeek = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    const monday = new Date(now)
    monday.setDate(now.getDate() + diff)
    return monday.toISOString().split('T')[0]
  }

  //stat cards — shows '—' if nothing logged today
  const todayStats = [
    { label: 'Calories', value: todayLog?.calories ?? '—', unit: 'kcal' },
    { label: 'Protein', value: todayLog?.protein ?? '—', unit: 'g' },
    { label: 'Sleep', value: todayLog?.sleep_hours ?? '—', unit: 'hrs' },
    { label: 'Energy', value: todayLog?.energy_level ?? '—', unit: '/ 10' },
  ]

  const maxCalories = Math.max(...weekCalories, 1)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Welcome back</p>
        </div>
        <Link
          to="/log"
          className="bg-accent hover:bg-accent/80 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
        >
          + Quick Log
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {todayStats.map((stat) => (
          <div key={stat.label} className="bg-dark-card rounded-xl p-5">
            <p className="text-text-muted text-xs uppercase tracking-wide">{stat.label}</p>
            <p className="font-heading text-2xl font-bold mt-1">
              {stat.value}
              <span className="text-text-muted text-sm font-normal ml-1">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-dark-card rounded-xl p-5">
          <p className="text-text-muted text-xs uppercase tracking-wide mb-3">Current Streak</p>
          <p className="font-heading text-4xl font-bold text-accent">{streak}</p>
          <p className="text-text-muted text-sm mt-1">consecutive days logged</p>
        </div>

        <div className="bg-dark-card rounded-xl p-5 lg:col-span-2">
          <p className="text-text-muted text-xs uppercase tracking-wide mb-4">Weekly Calories</p>
          <div className="flex items-end justify-between gap-2 h-32">
            {weekDays.map((day, i) => (
              <div key={day} className="flex flex-col items-center flex-1 h-full justify-end">
                <div
                  className={`w-full rounded-md transition-all duration-150 ${
                    weekCalories[i] > 0 ? 'bg-accent/70' : 'bg-white/5'
                  }`}
                  style={{
                    height: weekCalories[i] > 0
                      ? `${(weekCalories[i] / maxCalories) * 100}%`
                      : '8%',
                  }}
                />
                <p className="text-text-muted text-xs mt-2">{day}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
