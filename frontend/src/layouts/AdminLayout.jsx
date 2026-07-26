import { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/admin/dashboard',    icon: 'dashboard',           label: 'Dashboard'    },
  { to: '/admin/orders',       icon: 'shopping_bag',        label: 'Orders'       },
  { to: '/admin/products',     icon: 'inventory_2',         label: 'Products'     },
  { to: '/admin/staff',        icon: 'group',               label: 'Staff'        },
  { to: '/admin/staff-access', icon: 'admin_panel_settings',label: 'Staff Access' },
  { to: '/admin/reports',      icon: 'bar_chart',           label: 'Reports'      },
  { to: '/admin/security',     icon: 'security',            label: 'Security'     },
  { to: '/admin/settings',     icon: 'settings',            label: 'Settings'     },
]

function isActive(to, pathname) {
  if (to === '/admin/dashboard') return pathname === to
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

  const name     = user?.full_name || user?.email?.split('@')[0] || 'Admin'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
        style={{ border: 'none', background: open ? '#f1f5f9' : 'transparent', minHeight: 'unset', transform: 'none' }}
      >
        <div className="w-8 h-8 rounded-full bg-[#C0392B] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{name.split(' ')[0]}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Administrator</p>
        </div>
        <span className={`material-symbols-outlined text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} style={{ fontSize: 16 }}>expand_more</span>
      </button>

      {open && (
        <div className="portal-dropdown absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50" style={{ maxWidth: 'calc(100vw - 16px)' }}>
          <div className="px-4 py-3 bg-[#C0392B]/5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C0392B] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="py-1.5">
            <button onClick={() => { navigate('/admin/dashboard'); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>dashboard</span>
              Dashboard
            </button>
            <button onClick={() => { navigate('/admin/settings'); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>manage_accounts</span>
              Settings
            </button>
            <button onClick={() => { window.open('/', '_blank'); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>open_in_new</span>
              View Live Site
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

// ── Notification Dropdown ─────────────────────────────────────────────────────
const SAMPLE_NOTIFS = [
  { id: 1, icon: 'shopping_bag',   color: 'text-blue-500 bg-blue-50',   title: 'New order placed',      desc: 'Order #1042 — Ravi Kumar',          time: '2m ago',  unread: true  },
  { id: 2, icon: 'payments',       color: 'text-green-500 bg-green-50', title: 'Payment received',      desc: '₹4,500 from Priya Sharma',          time: '18m ago', unread: true  },
  { id: 3, icon: 'local_shipping', color: 'text-purple-500 bg-purple-50',title: 'Order shipped',        desc: 'Order #1038 dispatched',            time: '1h ago',  unread: true  },
  { id: 4, icon: 'inventory_2',    color: 'text-amber-500 bg-amber-50', title: 'Low stock alert',       desc: 'Product "Matte ID Card" — 3 left',  time: '3h ago',  unread: false },
  { id: 5, icon: 'person_add',     color: 'text-teal-500 bg-teal-50',   title: 'New staff registered',  desc: 'Suresh Babu added to the system',   time: '5h ago',  unread: false },
]

function NotificationDropdown() {
  const [open, setOpen]   = useState(false)
  const [notifs, setNotifs] = useState(SAMPLE_NOTIFS)
  const ref = useRef(null)
  const unread = notifs.filter(n => n.unread).length

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        style={{ border: 'none', background: open ? '#f1f5f9' : 'transparent', minHeight: 'unset', transform: 'none' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
        {unread > 0 && (
          <span className="portal-badge-pulse absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white font-bold px-0.5" style={{ fontSize: 9 }}>{unread}</span>
          </span>
        )}
      </button>

      {open && (
        <div className="portal-dropdown absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50" style={{ maxWidth: 'calc(100vw - 16px)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Notifications</span>
              {unread > 0 && <span className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full" style={{ fontSize: 10 }}>{unread}</span>}
            </div>
            {unread > 0 && (
              <button onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}
                className="text-xs text-[#C0392B] font-semibold hover:underline"
                style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none' }}>
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {notifs.map(n => (
              <div key={n.id}
                className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}
                onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.color}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{n.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${n.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{n.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-slate-400 whitespace-nowrap" style={{ fontSize: 10 }}>{n.time}</span>
                  {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 px-4 py-2.5 text-center">
            <button className="text-xs text-[#C0392B] font-semibold hover:underline"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none' }}>
              View all notifications
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
        placeholder="Search pages..."
      />
      {open && results.length > 0 && (
        <div className="portal-dropdown absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {results.map(r => (
            <button key={r.to}
              onClick={() => { navigate(r.to); setQuery(''); setOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-[#C0392B]/5 hover:text-[#C0392B] transition-colors text-left"
              style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none', borderRadius: 0 }}>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>
      )}
      {open && query.trim().length > 0 && results.length === 0 && (
        <div className="portal-dropdown absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 z-50">
          <p className="text-sm text-slate-400">No results for "<span className="text-slate-600">{query}</span>"</p>
        </div>
      )}
    </div>
  )
}

// ── Sidebar Content ───────────────────────────────────────────────────────────
function SidebarContent({ onClose, onLogout }) {
  const location = useLocation()
  return (
    <div className="flex flex-col h-full bg-white" style={{ width: '256px', minWidth: '256px' }}>
      {/* Brand */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#C0392B] flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md">
          V
        </div>
        <div style={{ display: 'block' }}>
          <p className="text-slate-900 text-sm font-extrabold leading-none tracking-tight">Vijetha Digital</p>
          <p className="text-slate-400 font-bold uppercase tracking-widest mt-0.5" style={{ fontSize: '10px' }}>Admin Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto portal-sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(item => {
          const active = isActive(item.to, location.pathname)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                width: '100%',
                border: 'none',
                transition: 'background-color 0.15s, color 0.15s',
                backgroundColor: active ? '#C0392B' : 'transparent',
                color: active ? '#ffffff' : '#475569',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.05)'; e.currentTarget.style.color = '#C0392B' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569' } }}
            >
              <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
              <span style={{ display: 'inline', whiteSpace: 'nowrap', fontWeight: 500 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 shrink-0" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Link to="/" target="_blank"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            gap: '12px', padding: '10px 12px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 500, textDecoration: 'none',
            color: '#64748b', width: '100%',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>open_in_new</span>
          <span style={{ display: 'inline', whiteSpace: 'nowrap' }}>View Live Site</span>
        </Link>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            gap: '12px', padding: '10px 12px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 500, textDecoration: 'none',
            color: '#ef4444', width: '100%', border: 'none',
            background: 'transparent', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>logout</span>
          <span style={{ display: 'inline', whiteSpace: 'nowrap' }}>Logout</span>
        </button>
      </div>
    </div>
  )
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => { logout(); navigate('/') }
  const currentPage   = NAV.find(n => isActive(n.to, location.pathname))?.label || 'Dashboard'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f6f7f8', fontFamily: "'Inter', 'Manrope', sans-serif" }}>

      {/* ── Desktop sidebar — fixed left column ── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 30,
        width: '256px', display: 'flex', flexDirection: 'column',
        backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)} />
          <aside style={{
            position: 'relative', width: '256px', display: 'flex', flexDirection: 'column',
            backgroundColor: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <SidebarContent onClose={() => setMobileOpen(false)} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* ── Main column — offset by sidebar width on desktop ── */}
      <div style={{ flex: 1, marginLeft: '256px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* ── Top bar ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 20,
          backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', gap: '16px' }}>

            {/* Left — hamburger (mobile) + breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <button
                onClick={() => setMobileOpen(true)}
                style={{
                  display: 'none', // hidden on desktop, shown via media query below
                  padding: '8px', borderRadius: '8px', border: 'none',
                  background: 'transparent', cursor: 'pointer', color: '#475569',
                }}
                className="mobile-menu-btn"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>menu</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>/</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentPage}
                </span>
              </div>
            </div>

            {/* Right — search + notifications + profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <SearchBar />
              <NotificationDropdown />
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
