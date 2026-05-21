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

function Log() {
  //Workout inputs
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  //Nutrition inputs
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [mealTiming, setMealTiming] = useState('')

  //Recovery inputs
  const [sleepHours, setSleepHours] = useState('')
  const [energyLevel, setEnergyLevel] = useState('')
  const [stressLevel, setStressLevel] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)

    //grab current user
    const { data: { user } } = await supabase.auth.getUser()

    //save nutrition + recovery to daily_logs, get back the row id
    const { data: logData, error: logError } = await supabase
      .from('daily_logs')
      .insert({
        user_id: user.id,
        log_date: new Date().toISOString().split('T')[0],
        calories: calories ? parseInt(calories) : null,
        protein: protein ? parseInt(protein) : null,
        meal_timing: mealTiming || null,
        sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
        energy_level: energyLevel ? parseInt(energyLevel) : null,
        stress_level: stressLevel ? parseInt(stressLevel) : null,
      })
      .select()

    if (logError) {
      setMessage(`Error saving log: ${logError.message}`)
      setLoading(false)
      return
    }

    //save workout linked to today's log via daily_log_id
    if (exercise) {
      const { error: workoutError } = await supabase
        .from('workout_entries')
        .insert({
          daily_log_id: logData[0].id,
          exercise: exercise,
          type: 'lifting',
          sets: sets ? parseInt(sets) : null,
          reps: reps ? parseInt(reps) : null,
          weight: weight ? parseFloat(weight) : null,
        })

      if (workoutError) {
        setMessage(`Error saving workout: ${workoutError.message}`)
        setLoading(false)
        return
      }
    }

    //reset form
    setExercise('')
    setSets('')
    setReps('')
    setWeight('')
    setCalories('')
    setProtein('')
    setMealTiming('')
    setSleepHours('')
    setEnergyLevel('')
    setStressLevel('')
    setMessage('Entry saved successfully!')
    setLoading(false)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Daily Log</h1>
        <p className="text-text-muted text-sm mt-1">Log your workout, nutrition, and recovery</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* -- Workout Card -- */}
        <motion.div variants={item} className="bg-dark-card rounded-xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Workout</h2>
          <div className="space-y-3">
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Exercise</label>
              <input
                type="text"
                placeholder="e.g. Bench Press"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Sets</label>
                <input
                  type="number"
                  placeholder="0"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
              <div>
                <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Reps</label>
                <input
                  type="number"
                  placeholder="0"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
              <div>
                <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Weight</label>
                <input
                  type="number"
                  placeholder="lbs"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* -- Nutrition Card -- */}
        <motion.div variants={item} className="bg-dark-card rounded-xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Nutrition</h2>
          <div className="space-y-3">
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Calories</label>
              <input
                type="number"
                placeholder="kcal"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Protein</label>
              <input
                type="number"
                placeholder="grams"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Meal Timing</label>
              <input
                type="text"
                placeholder="e.g. 8am, 12pm, 6pm"
                value={mealTiming}
                onChange={(e) => setMealTiming(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
          </div>
        </motion.div>

        {/* -- Recovery Card -- */}
        <motion.div variants={item} className="bg-dark-card rounded-xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Recovery</h2>
          <div className="space-y-3">
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Sleep Hours</label>
              <input
                type="number"
                step="0.5"
                placeholder="hrs"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Energy Level (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="1-10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Stress Level (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="1-10"
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* -- Success/error message shown after save -- */}
      {message && (
        <p className={`mt-4 text-sm text-center ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </p>
      )}

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full md:w-auto cursor-pointer bg-accent hover:bg-accent/80 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-150 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </div>
  )
}

export default Log
