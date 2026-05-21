import { useState } from 'react'
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// topic badge colors
const topicColors = {
  'Protein & Muscle': 'bg-emerald-500/20 text-emerald-400',
  'Sleep & Recovery': 'bg-violet-500/20 text-violet-400',
  'Resistance Training': 'bg-accent/20 text-accent',
  'Fat Loss': 'bg-rose-500/20 text-rose-400',
  'Hydration': 'bg-cyan-500/20 text-cyan-400',
  Default: 'bg-white/10 text-text-muted',
}

// preset search topics for quick access
const quickTopics = [
  { label: 'Protein & Muscle', query: 'protein muscle synthesis', topic: 'Protein & Muscle' },
  { label: 'Sleep & Recovery', query: 'sleep exercise recovery', topic: 'Sleep & Recovery' },
  { label: 'Resistance Training', query: 'resistance training hypertrophy', topic: 'Resistance Training' },
  { label: 'Fat Loss', query: 'exercise fat loss body composition', topic: 'Fat Loss' },
  { label: 'Hydration', query: 'hydration exercise performance', topic: 'Hydration' },
]

function Research() {
  const [studies, setStudies] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTopic, setActiveTopic] = useState(null)

  const searchPubMed = async (query, topic) => {
    setLoading(true)
    setActiveTopic(topic || 'Default')

    try {
      // step 1: search for article IDs
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=6&sort=relevance&retmode=json`
      const searchRes = await fetch(searchUrl)
      const searchData = await searchRes.json()
      const ids = searchData.esearchresult?.idlist || []

      if (ids.length === 0) {
        setStudies([])
        setLoading(false)
        return
      }

      // step 2: fetch details for those IDs
      const detailUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
      const detailRes = await fetch(detailUrl)
      const detailData = await detailRes.json()

      // parse into clean study objects
      const parsed = ids.map((id) => {
        const article = detailData.result[id]
        if (!article) return null

        const authors = article.authors
          ? article.authors.slice(0, 3).map(a => a.name).join(', ') + (article.authors.length > 3 ? ', et al.' : '')
          : 'Unknown authors'

        return {
          id,
          title: article.title || 'Untitled',
          authors,
          journal: article.source || 'Unknown journal',
          year: article.pubdate?.split(' ')[0] || 'N/A',
          topic: topic || 'Default',
          link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        }
      }).filter(Boolean)

      // most recent first
      parsed.sort((a, b) => parseInt(b.year) - parseInt(a.year))
      setStudies(parsed)
    } catch (err) {
      console.error('PubMed error:', err)
      setStudies([])
    }

    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchPubMed(searchQuery, 'Default')
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Research</h1>
        <p className="text-text-muted text-sm mt-1">Peer-reviewed studies from PubMed</p>
      </motion.div>

      {/* search bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search PubMed (e.g. creatine performance)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-dark-card border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors duration-150"
          />
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-accent hover:bg-accent/80 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* quick topic buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {quickTopics.map((t) => (
          <button
            key={t.label}
            onClick={() => searchPubMed(t.query, t.topic)}
            className={`cursor-pointer text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-150 ${
              topicColors[t.topic] || topicColors.Default
            } border-white/10 hover:border-white/20`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* results */}
      {studies.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {studies.map((study) => (
            <motion.a
              key={study.id}
              variants={item}
              href={study.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-dark-card rounded-xl p-6 hover:border-accent/30 border border-white/10 transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="font-heading text-base font-semibold leading-snug">{study.title}</h2>
                <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${topicColors[study.topic] || topicColors.Default}`}>
                  {study.topic}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>{study.authors}</span>
                <span className="text-white/20">|</span>
                <span>{study.journal}</span>
                <span className="text-white/20">|</span>
                <span>{study.year}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      ) : !loading && (
        <div className="bg-dark-card rounded-xl p-10 text-center">
          <p className="text-text-muted">Search for a topic or click a quick topic above to find studies.</p>
        </div>
      )}
    </div>
  )
}

export default Research
