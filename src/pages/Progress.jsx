const dummyData = {
  calories: [2100, 1850, 2300, 2140, 1950, 2200, 2050, 1900, 2400, 2100, 2250, 1800, 2150, 2000],
  protein: [130, 125, 155, 145, 110, 140, 135, 120, 150, 145, 160, 105, 140, 130],
  sleep: [7.5, 6.5, 8, 7, 7.5, 9, 6, 7, 8, 7.5, 6.5, 8.5, 7, 7.5],
  energy: [7, 5, 8, 8, 6, 9, 5, 7, 8, 7, 6, 9, 7, 8],
  volume: [12500, 0, 14200, 13800, 0, 15600, 0, 13000, 0, 14800, 14200, 0, 15200, 0],
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function MiniChart({ label, data, unit, color }) {
  const max = Math.max(...data)
  return (
    <div className="bg-dark-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-text-muted text-xs uppercase tracking-wide">{label}</p>
        <p className="text-xs text-text-muted">{unit}</p>
      </div>
      <div className="flex items-end gap-1 h-24">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <div
              className={`w-full rounded-sm ${color}`}
              style={{ height: val > 0 ? `${(val / max) * 100}%` : '4%' }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-text-muted text-[10px]">2 weeks ago</p>
        <p className="text-text-muted text-[10px]">Today</p>
      </div>
    </div>
  )
}

function Progress() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Progress</h1>
        <p className="text-text-muted text-sm mt-1">Track your trends over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniChart label="Calorie Intake" data={dummyData.calories} unit="kcal" color="bg-accent/70" />
        <MiniChart label="Protein Intake" data={dummyData.protein} unit="grams" color="bg-emerald-500/70" />
        <MiniChart label="Sleep Hours" data={dummyData.sleep} unit="hours" color="bg-violet-500/70" />
        <MiniChart label="Energy Level" data={dummyData.energy} unit="1-10" color="bg-amber-500/70" />
        <div className="md:col-span-2">
          <MiniChart label="Workout Volume" data={dummyData.volume} unit="lbs" color="bg-rose-500/70" />
        </div>
      </div>
    </div>
  )
}

export default Progress
