import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HiSun, HiMoon } from 'react-icons/hi'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import Log from './pages/Log'
import Progress from './pages/Progress'
import Research from './pages/Research'
import Navbar from './components/Navbar'
import LegalDisclaimer from './components/LegalDisclaimer'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    document.body.classList.toggle('light', !darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <BrowserRouter>
      <LegalDisclaimer />
      <Navbar />
      <main className="pb-16 md:pb-0 md:pl-60">
        <div className="fixed top-0 right-0 left-0 md:left-60 z-40 flex items-center justify-end px-4 py-3 md:px-8 bg-dark-bg/80 backdrop-blur-sm">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="cursor-pointer bg-dark-card hover:bg-white/10 text-text-primary text-sm px-3 py-1.5 rounded-lg border border-white/10 transition-colors duration-150"
          >
            {darkMode ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
          </button>
        </div>
        <div className="mx-auto max-w-[1200px] px-4 pt-16 pb-6 md:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/log" element={<Log />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/research" element={<Research />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  )
}

export default App