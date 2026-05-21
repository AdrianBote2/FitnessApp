import { NavLink } from 'react-router-dom'
import { HiHome, HiClipboardList, HiLightBulb, HiChartBar, HiSearch } from 'react-icons/hi'

const links = [
  { to: '/', label: 'Dashboard', icon: HiHome },
  { to: '/log', label: 'Log', icon: HiClipboardList },
  { to: '/progress', label: 'Progress', icon: HiChartBar },
  { to: '/insights', label: 'Insights', icon: HiLightBulb },
  { to: '/research', label: 'Research', icon: HiSearch },
]

function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-dark-surface md:top-0 md:right-auto md:w-60 md:border-r md:border-t-0">
      <div className="hidden md:block px-6 py-6">
        <h1 className="font-heading text-xl font-bold tracking-tight text-text-primary">
          Nucleus
        </h1>
        <p className="text-xs text-text-muted mt-1">Fitness Intelligence</p>
      </div>

      <div className="flex md:flex-col">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `cursor-pointer flex-1 flex items-center justify-center py-3 text-xs transition-colors duration-150
               md:flex-none md:justify-start md:px-6 md:py-3 md:text-sm
               ${isActive
                 ? 'text-accent bg-accent/10'
                 : 'text-text-muted hover:text-text-primary hover:bg-white/5'
               }`
            }
          >
            <link.icon className="text-lg md:mr-3" />
            <span className="hidden md:inline">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
