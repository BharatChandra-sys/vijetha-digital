import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PORTALS = [
  {
    id: 'admin',
    label: 'Admin Portal',
    tag: 'FULL ACCESS',
    icon: 'admin_panel_settings',
    description: 'Complete platform control — orders, products, staff, reports, settings and security.',
    features: ['Order management', 'Product catalog', 'Staff & access control', 'Revenue reports', 'Security logs'],
    loginPath: '/admin/login',
    dashPath: '/admin/dashboard',
    accent: '#C0392B',
    accentBg: 'rgba(192,57,43,0.06)',
    accentBorder: 'rgba(192,57,43,0.15)',
    role: 'admin',
    badge: { bg: '#fef2f2', color: '#C0392B', border: '#fecaca' },
  },
  {
    id: 'staff',
    label: 'Staff Portal',
    tag: 'OPERATIONS',
    icon: 'badge',
    description: 'Production workspace — manage print operations, delivery pipeline, and daily tasks.',
    features: ['Print operations', 'Delivery tracking', 'Order processing', 'Schedule management', 'Notifications'],
    loginPath: '/staff/login',
    dashPath: '/staff/workspace',
    accent: '#2563eb',
    accentBg: 'rgba(37,99,235,0.06)',
    accentBorder: 'rgba(37,99,235,0.15)',
    role: 'staff',
    badge: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  },
  {
    id: 'reception',
    label: 'Reception Desk',
    tag: 'FRONT DESK',
    icon: 'front_desk',
    description: 'Customer-facing operations — walk-in orders, payments, tracking, and support queue.',
    features: ['Walk-in orders', 'Payment center', 'Order tracking', 'Customer info', 'Support queue'],
    loginPath: '/reception/login',
    dashPath: '/reception/dashboard',
    accent: '#16a34a',
    accentBg: 'rgba(22,163,74,0.06)',
    accentBorder: 'rgba(22,163,74,0.15)',
    role: 'reception',
    badge: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  },
]

export default function Workspace() {
  const navigate   = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [hoverId, setHoverId] = useState(null)

  // If already logged in as a role, highlight their portal
  const userRole = user?.role

  const handlePortalClick = (portal) => {
    // If already authenticated with the right role, go straight to dash
    if (isAuthenticated && (userRole === portal.role || userRole === 'admin')) {
      navigate(portal.dashPath)
    } else {
      navigate(portal.loginPath)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f6f7f8',
      fontFamily: "'Inter', 'Manrope', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Top bar ── */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            backgroundColor: '#C0392B', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '16px',
            boxShadow: '0 2px 8px rgba(192,57,43,0.3)',
          }}>V</div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>Vijetha Digital</p>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>Internal Workspace</p>
          </div>
        </div>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 600, color: '#64748b',
          textDecoration: 'none', padding: '6px 14px', borderRadius: '8px',
          border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#64748b' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>store</span>
          View Store
        </Link>
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: '56px 24px 40px', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 14px', borderRadius: '9999px',
          backgroundColor: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.15)',
          marginBottom: '20px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#C0392B' }}>corporate_fare</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Enterprise Workspace
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2, marginBottom: '12px' }}>
          Choose Your Portal
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6 }}>
          Select the portal that matches your role. Each portal provides role-specific tools and access levels.
        </p>
      </div>

      {/* ── Portal Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1040px',
        margin: '0 auto',
        padding: '0 24px 64px',
        width: '100%',
      }}>
        {PORTALS.map(portal => {
          const isHovered = hoverId === portal.id
          const isCurrentRole = userRole === portal.role || (portal.role === 'admin' && userRole === 'admin')
          return (
            <button
              key={portal.id}
              onClick={() => handlePortalClick(portal)}
              onMouseEnter={() => setHoverId(portal.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                padding: '28px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: isHovered ? `2px solid ${portal.accent}` : '2px solid #e2e8f0',
                boxShadow: isHovered
                  ? `0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px ${portal.accent}20`
                  : '0 1px 4px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                minHeight: 'unset',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Active role indicator */}
              {isCurrentRole && isAuthenticated && (
                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  padding: '3px 10px', borderRadius: '9999px',
                  backgroundColor: portal.badge.bg, border: `1px solid ${portal.badge.border}`,
                  fontSize: '10px', fontWeight: 700, color: portal.accent,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Active
                </div>
              )}

              {/* Icon */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                backgroundColor: portal.accentBg, border: `1px solid ${portal.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '26px', color: portal.accent }}>
                  {portal.icon}
                </span>
              </div>

              {/* Tag */}
              <span style={{
                display: 'inline-block', fontSize: '10px', fontWeight: 800,
                color: portal.accent, textTransform: 'uppercase', letterSpacing: '0.1em',
                marginBottom: '8px',
              }}>
                {portal.tag}
              </span>

              {/* Title */}
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '10px', lineHeight: 1.2 }}>
                {portal.label}
              </h2>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
                {portal.description}
              </p>

              {/* Feature list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '24px', flex: 1 }}>
                {portal.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: portal.accent, flexShrink: 0 }}>
                      check_circle
                    </span>
                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '10px',
                backgroundColor: isHovered ? portal.accent : portal.accentBg,
                border: `1px solid ${isHovered ? portal.accent : portal.accentBorder}`,
                transition: 'all 0.2s',
              }}>
                <span style={{
                  fontSize: '13px', fontWeight: 700,
                  color: isHovered ? '#ffffff' : portal.accent,
                }}>
                  {isAuthenticated && isCurrentRole ? 'Go to Dashboard' : 'Sign In →'}
                </span>
                <span className="material-symbols-outlined" style={{
                  fontSize: '18px',
                  color: isHovered ? '#ffffff' : portal.accent,
                }}>
                  arrow_forward
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Footer ── */}
      <div style={{
        borderTop: '1px solid #e2e8f0',
        padding: '20px 24px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        marginTop: 'auto',
      }}>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
          © {new Date().getFullYear()} Vijetha Digital · All portals are secured with role-based access control
        </p>
      </div>
    </div>
  )
}
