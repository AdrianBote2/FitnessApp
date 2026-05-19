import { Link } from 'react-router-dom'

const todayStats = [
  { label: 'Calories', value: '2,140', unit: 'kcal' },
  { label: 'Protein', value: '145', unit: 'g' },
  { label: 'Sleep', value: '7.5', unit: 'hrs' },
  { label: 'Energy', value: '8', unit: '/ 10' },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weekCalories = [2100, 1850, 2300, 2140, 0, 0, 0]
const maxCalories = Math.max(...weekCalories)

function Dashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Welcome back, Adrian</p>
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
          <p className="font-heading text-4xl font-bold text-accent">4</p>
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
