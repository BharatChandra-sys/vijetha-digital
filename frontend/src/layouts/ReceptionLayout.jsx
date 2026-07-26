import { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/reception/dashboard',  icon: 'dashboard',       label: 'Dashboard'       },
  { to: '/reception/walk-in',    icon: 'person_add',      label: 'Walk-in Orders'  },
  { to: '/reception/tracking',   icon: 'track_changes',   label: 'Order Tracking'  },
  { to: '/reception/orders',     icon: 'receipt_long',    label: 'All Orders'      },
  { to: '/reception/customers',  icon: 'group',           label: 'Customers'       },
  { to: '/reception/payments',   icon: 'payments',        label: 'Payment Center'  },
  { to: '/reception/support',    icon: 'support_agent',   label: 'Support Queue'   },
  { to: '/reception/inventory',  icon: 'inventory_2',     label: 'Inventory'       },
  { to: '/reception/delivery',   icon: 'local_shipping',  label: 'Delivery Queue'  },
  { to: '/reception/reports',    icon: 'bar_chart',       label: 'Daily Reports'   },
  { to: '/reception/tasks',      icon: 'task_alt',        label: 'My Tasks'        },
  { to: '/reception/schedule',   icon: 'calendar_month',  label: 'Schedule'        },
  { to: '/reception/profile',    icon: 'person',          label: 'Profile'         },
]

function isActive(to, pathname) {
  if (to === '/reception/dashboard') return pathname === to
  return pathname.startsWith(to)
}

// ── Profile Dropdown ──────────────────────────────────────────────────────────
function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const name     = user?.full_name || user?.email?.split('@')[0] || 'Reception'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
        style={{ border: 'none', background: open ? '#f1f5f9' : 'transparent', minHeight: 'unset', transform: 'none' }}
      >
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{name.split(' ')[0]}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Front Desk</p>
        </div>
        <span className={`material-symbols-outlined text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} style={{ fontSize: 16 }}>expand_more</span>
      </button>

      {open && (
        <div className="portal-dropdown absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50" style={{ maxWidth: 'calc(100vw - 16px)' }}>
          <div className="px-4 py-3 bg-green-600/5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="py-1.5">
            <button onClick={() => { navigate('/reception/dashboard'); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>dashboard</span>
              Dashboard
            </button>
            <button onClick={() => { navigate('/reception/profile'); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>manage_accounts</span>
              My Profile
            </button>
            <button onClick={() => { navigate('/reception/tasks'); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>task_alt</span>
              My Tasks
            </button>
          </div>
          <div className="border-t border-slate-100 py-1.5">
            <button onClick={() => { onLogout(); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Search Bar ────────────────────────────────────────────────────────────────
function SearchBar() {
  const [query, setQuery] = useState('')
  const [open,  setOpen]  = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const results = query.trim().length > 0
    ? NAV.filter(n => n.label.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <div className="relative hidden md:block" ref={ref}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 18 }}>search</span>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className="portal-search-input"
        placeholder="Search..."
      />
      {open && results.length > 0 && (
        <div className="portal-dropdown absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {results.map(r => (
            <button key={r.to}
              onClick={() => { navigate(r.to); setQuery(''); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors text-left"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sidebar Content ───────────────────────────────────────────────────────────
function SidebarContent({ onClose, onLogout }) {
  const location = useLocation()
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-5 border-b border-slate-200 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md">
          V
        </div>
        <div>
          <p className="text-slate-900 text-sm font-extrabold leading-none tracking-tight">Vijetha Digital</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Reception Desk</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto portal-sidebar-nav">
        {NAV.map(item => {
          const active = isActive(item.to, location.pathname)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`portal-sidebar-link ${active ? 'bg-green-600 text-white shadow-sm' : 'text-slate-600 hover:bg-green-50 hover:text-green-700'}`}
            >
              <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20 }}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 space-y-0.5 shrink-0">
        <Link to="/reception/walk-in"
          className="portal-sidebar-link bg-green-600 text-white hover:bg-green-700 font-semibold">
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20 }}>add_circle</span>
          <span className="font-semibold">New Walk-in Order</span>
        </Link>
        <button
          onClick={onLogout}
          className="portal-sidebar-link text-red-500 hover:bg-red-50 hover:text-red-600 w-full"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20 }}>logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function ReceptionLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => { logout(); navigate('/') }
  const currentPage   = NAV.find(n => isActive(n.to, location.pathname))?.label || 'Dashboard'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f6f7f8', fontFamily: "'Inter', 'Manrope', sans-serif" }}>

      {/* Desktop sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 30,
        width: '256px', display: 'flex', flexDirection: 'column',
        backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setMobileOpen(false)} />
          <aside style={{ position: 'relative', width: '256px', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <SidebarContent onClose={() => setMobileOpen(false)} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div style={{ flex: 1, marginLeft: '256px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 20,
          backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setMobileOpen(true)}
                style={{ display: 'none', padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                className="mobile-menu-btn">
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>menu</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>/</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{currentPage}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '9999px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#16a34a' }}>front_desk</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reception</span>
              </div>
              <SearchBar />
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
      <style>{`@media (max-width: 1023px) { .mobile-menu-btn { display: flex !important; } }`}</style>
    </div>
  )
}
