const studies = [
  {
    topic: 'Sleep',
    title: 'Sleep and muscle recovery: endocrinological and molecular basis for a new hypothesis',
    authors: 'Dattilo M, Antunes HK, Medeiros A, et al.',
    journal: 'Medical Hypotheses',
    year: 2011,
    summary: 'Examines the role of sleep in muscle recovery through growth hormone release and protein synthesis pathways during deep sleep stages.',
  },
  {
    topic: 'Nutrition',
    title: 'How much protein can the body use in a single meal for muscle-building?',
    authors: 'Schoenfeld BJ, Aragon AA',
    journal: 'Journal of the International Society of Sports Nutrition',
    year: 2018,
    summary: 'Reviews evidence on per-meal protein dosing and its effects on muscle protein synthesis, suggesting higher per-meal intakes than previously recommended.',
  },
  {
    topic: 'Hypertrophy',
    title: 'Dose-response relationship between weekly resistance training volume and increases in muscle mass',
    authors: 'Schoenfeld BJ, Ogborn D, Krieger JW',
    journal: 'Medicine & Science in Sports & Exercise',
    year: 2017,
    summary: 'Meta-analysis finding a graded dose-response relationship between weekly sets per muscle group and hypertrophy outcomes.',
  },
  {
    topic: 'Fat Loss',
    title: 'Effects of resistance training frequency on measures of muscle hypertrophy',
    authors: 'Schoenfeld BJ, Grgic J, Krieger J',
    journal: 'Sports Medicine',
    year: 2019,
    summary: 'Systematic review examining how training frequency interacts with volume to influence body composition and fat-free mass.',
  },
]

const topicColors = {
  Sleep: 'bg-violet-500/20 text-violet-400',
  Nutrition: 'bg-emerald-500/20 text-emerald-400',
  Hypertrophy: 'bg-accent/20 text-accent',
  'Fat Loss': 'bg-rose-500/20 text-rose-400',
}

function Research() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Research</h1>
        <p className="text-text-muted text-sm mt-1">Peer-reviewed studies backing your insights</p>
      </div>

      <div className="space-y-4">
        {studies.map((study) => (
          <div key={study.title} className="bg-dark-card rounded-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="font-heading text-base font-semibold leading-snug">{study.title}</h2>
              <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${topicColors[study.topic]}`}>
                {study.topic}
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-3">{study.summary}</p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>{study.authors}</span>
              <span className="text-white/20">|</span>
              <span>{study.journal}</span>
              <span className="text-white/20">|</span>
              <span>{study.year}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Research
