import { LayoutDashboard, Instagram, Facebook, Music2, BarChart3 } from 'lucide-react'

export type Section = 'resumen' | 'instagram' | 'facebook' | 'tiktok' | 'metaads'

interface NavItem {
  id: Section
  label: string
  icon: React.ReactNode
  color: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard size={18} />, color: '#6366F1' },
  { id: 'instagram', label: 'Instagram', icon: <Instagram size={18} />, color: '#C13584' },
  { id: 'facebook', label: 'Facebook', icon: <Facebook size={18} />, color: '#4267B2' },
  { id: 'tiktok', label: 'TikTok', icon: <Music2 size={18} />, color: '#69C9D0' },
  { id: 'metaads', label: 'Meta Ads', icon: <BarChart3 size={18} />, color: '#0081FB' },
]

interface SidebarProps {
  active: Section
  onSelect: (s: Section) => void
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">EDG</p>
            <p className="text-slate-500 text-xs mt-0.5">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              style={isActive ? { backgroundColor: `${item.color}20`, color: item.color } : {}}
            >
              <span style={isActive ? { color: item.color } : {}}>{item.icon}</span>
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-800">
        <p className="text-slate-600 text-xs">Espacio de Genios</p>
        <p className="text-slate-700 text-xs">© 2025</p>
      </div>
    </aside>
  )
}
