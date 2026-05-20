function Log() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Daily Log</h1>
        <p className="text-text-muted text-sm mt-1">Log your workout, nutrition, and recovery</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card rounded-xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Workout</h2>
          <div className="space-y-3">
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Exercise</label>
              <input
                type="text"
                placeholder="e.g. Bench Press"
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Sets</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
              <div>
                <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Reps</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
              <div>
                <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Weight</label>
                <input
                  type="number"
                  placeholder="lbs"
                  className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Nutrition</h2>
          <div className="space-y-3">
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Calories</label>
              <input
                type="number"
                placeholder="kcal"
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Protein</label>
              <input
                type="number"
                placeholder="grams"
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Meal Timing</label>
              <input
                type="text"
                placeholder="e.g. 8am, 12pm, 6pm"
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Recovery</h2>
          <div className="space-y-3">
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wide block mb-1">Sleep Hours</label>
              <input
                type="number"
                step="0.5"
                placeholder="hrs"
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
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="w-full md:w-auto bg-accent hover:bg-accent/80 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-150">
          Save Entry
        </button>
      </div>
    </div>
  )
}

export default Log
