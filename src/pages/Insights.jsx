const placeholderInsights = [
  {
    title: 'Sleep & Recovery Connection',
    body: 'Your sleep averaged 7.2 hours this week, correlating with higher energy levels on days following 7+ hours. Research suggests this aligns with optimal recovery windows for muscle protein synthesis.',
    study: 'Dattilo et al. (2011) — Sleep and muscle recovery, Medical Hypotheses',
  },
  {
    title: 'Protein Timing Pattern',
    body: 'You consistently hit your protein target of 140g+ on training days but dropped to 95g on rest days. Maintaining protein intake on rest days supports continued muscle repair and adaptation.',
    study: 'Schoenfeld & Aragon (2018) — Protein timing revisited, Journal of ISSN',
  },
  {
    title: 'Training Volume Trend',
    body: 'Weekly training volume increased 12% compared to last week. Progressive overload is on track, but monitor recovery markers — your stress levels elevated slightly on high-volume days.',
    study: 'Schoenfeld et al. (2017) — Dose-response of weekly volume, Medicine & Science in Sports',
  },
]

function Insights() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">AI Insights</h1>
          <p className="text-text-muted text-sm mt-1">Weekly analysis powered by Claude</p>
        </div>
        <button className="bg-dark-card hover:bg-white/10 text-text-primary text-sm font-medium px-4 py-2 rounded-lg border border-white/10 transition-colors duration-150">
          Regenerate
        </button>
      </div>

      <div className="space-y-4">
        {placeholderInsights.map((insight) => (
          <div key={insight.title} className="bg-dark-card rounded-xl p-6">
            <h2 className="font-heading text-lg font-semibold mb-2">{insight.title}</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-4">{insight.body}</p>
            <div className="border-t border-white/10 pt-3">
              <p className="text-xs text-accent">{insight.study}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-dark-card rounded-xl p-6 border border-white/5">
        <p className="text-text-muted text-xs text-center">
          Insights are generated from your last 7 days of logged data. Log consistently for more accurate analysis.
        </p>
      </div>
    </div>
  )
}

export default Insights
