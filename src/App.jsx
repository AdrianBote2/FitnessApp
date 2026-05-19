import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import Log from './pages/Log'
import Progress from './pages/Progress'
import Research from './pages/Research'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pb-16 md:pb-0 md:pl-60">
        <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
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