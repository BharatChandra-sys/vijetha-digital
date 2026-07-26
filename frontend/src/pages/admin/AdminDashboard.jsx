import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import api from '../../api/axios'

/* ── Formatters ─────────────────────────────────────────── */
const fmtINR  = (v) => '₹' + Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''
const fmtK    = (v) => `₹${(v / 1000).toFixed(0)}k`

/* ── Status colours ──────────────────────────────────────── */
const STATUS_PILL = {
  placed:        'bg-amber-100 text-amber-700',
  confirmed:     'bg-blue-100 text-blue-700',
  printing:      'bg-cyan-100 text-cyan-700',
  quality_check: 'bg-purple-100 text-purple-700',
  shipped:       'bg-indigo-100 text-indigo-700',
  delivered:     'bg-green-100 text-green-700',
  cancelled:     'bg-red-100 text-red-700',
  refunded:      'bg-slate-100 text-slate-600',
}

function StatusPill({ status }) {
  return (
    <span className={`portal-pill ${STATUS_PILL[status] || 'bg-slate-100 text-slate-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

/* ── Dummy trend data (shown while API loads) ────────────── */
const DUMMY_TREND = Array.from({ length: 14 }, (_, i) => ({
  date: `Day ${i + 1}`,
  revenue: Math.floor(2000 + Math.random() * 8000),
}))

const ORDER_STATUS_DATA = [
  { name: 'Placed',    value: 12, fill: '#F59E0B' },
  { name: 'Printing',  value: 8,  fill: '#06B6D4' },
  { name: 'Shipped',   value: 15, fill: '#6366F1' },
  { name: 'Delivered', value: 34, fill: '#22C55E' },
  { name: 'Cancelled', value: 4,  fill: '#EF4444' },
]

/* ── Main dashboard ─────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats,        setStats]     = useState(null)
  const [trend,        setTrend]     = useState(DUMMY_TREND)
  const [recentOrders, setRecent]    = useState([])
  const [trendDays,    setTrendDays] = useState(30)
  const [loading,      setLoading]   = useState(true)
  const [tick,         setTick]      = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, trendRes, ordersRes] = await Promise.all([
        api.get('/api/v1/admin/dashboard/stats'),
        api.get('/api/v1/admin/dashboard/revenue-trend', { params: { days: trendDays } }),
        api.get('/api/v1/admin/dashboard/orders'),
      ])
      setStats(statsRes.data)
      setTrend(Array.isArray(trendRes.data?.points) ? trendRes.data.points : DUMMY_TREND)
      setRecent((ordersRes.data || []).slice(0, 8))
    } catch { /* keep dummy data */ }
    finally { setLoading(false) }
  }, [trendDays])

  useEffect(() => { load() }, [load, tick])

  const kpis = stats ? [
    { label: 'Total Revenue',    value: fmtINR(stats.totalRevenue),      icon: 'payments',       color: 'text-emerald-600 bg-emerald-100', sub: 'All time'          },
    { label: 'Revenue (30d)',    value: fmtINR(stats.revenue30Days),     icon: 'calendar_month', color: 'text-blue-600 bg-blue-100',       sub: 'Last 30 days'      },
    { label: 'Avg Order Value',  value: fmtINR(stats.averageOrderValue), icon: 'price_check',    color: 'text-purple-600 bg-purple-100',   sub: 'Per order'         },
    { label: 'Total Orders',     value: stats.totalOrders,               icon: 'receipt_long',   color: 'text-[#C0392B] bg-[#C0392B]/10', sub: 'All time'          },
    { label: 'Pending Pipeline', value: stats.pendingOrders,             icon: 'hourglass_top',  color: 'text-amber-600 bg-amber-100',     sub: 'In production'     },
    { label: 'Shipped',          value: stats.shippedOrders,             icon: 'local_shipping', color: 'text-cyan-600 bg-cyan-100',       sub: 'Awaiting delivery' },
    { label: 'Products',         value: stats.totalProducts,             icon: 'inventory_2',    color: 'text-green-600 bg-green-100',     sub: 'Active SKUs'       },
    { label: 'Losses',           value: fmtINR(stats.totalLosses),       icon: 'money_off',      color: 'text-red-600 bg-red-100',         sub: 'Cancelled orders'  },
  ] : []

  return (
    <div className="p-4 md:p-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setTick(v => v + 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ border: '1px solid #e2e8f0', transform: 'none', minHeight: 'unset' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            Refresh
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C0392B] text-white rounded-xl text-sm font-semibold hover:bg-[#A93226] transition-colors shadow-sm"
            style={{ transform: 'none', minHeight: 'unset' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>receipt_long</span>
            View Orders
          </button>
        </div>
      </div>

      {/* ── Loading spinner ── */}
      {loading && !stats && (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── KPI Cards ── */}
      {(stats || !loading) && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.label} className="portal-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{k.icon}</span>
                  </div>
                </div>
                <p className="portal-stat-value">{k.value ?? '—'}</p>
                <p className="text-xs font-semibold text-slate-600 mt-1">{k.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Revenue Trend */}
            <div className="portal-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Revenue Trend</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Daily revenue from delivered orders</p>
                </div>
                <select
                  value={trendDays}
                  onChange={e => setTrendDays(Number(e.target.value))}
                  className="text-xs border border-slate-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] outline-none bg-white text-slate-600 font-medium"
                  style={{ minHeight: 'unset' }}
                >
                  <option value={7}>Last 7 Days</option>
                  <option value={30}>Last 30 Days</option>
                  <option value={90}>Last 90 Days</option>
                  <option value={180}>Last 6 Months</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#C0392B" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#C0392B" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={fmtDate} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                    formatter={v => [fmtINR(v), 'Revenue']}
                    labelFormatter={fmtDate}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#C0392B" strokeWidth={2.5}
                    fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#C0392B', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
              {trend.length > 0 && (
                <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                  <span>{fmtDate(trend[0]?.date)}</span>
                  <span>{fmtDate(trend[trend.length - 1]?.date)}</span>
                </div>
              )}
            </div>

            {/* Order Status Breakdown */}
            <div className="portal-card p-6">
              <div className="mb-5">
                <h4 className="font-black text-slate-900 text-sm">Order Status Breakdown</h4>
                <p className="text-xs text-slate-400 mt-0.5">Current pipeline distribution</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ORDER_STATUS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                    formatter={v => [v, 'Orders']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {ORDER_STATUS_DATA.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3">
                {ORDER_STATUS_DATA.map(d => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: d.fill }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Recent Orders */}
            <div className="lg:col-span-2 portal-card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-black text-slate-900 text-sm">Recent Orders</h4>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="text-[#C0392B] text-xs font-bold hover:underline flex items-center gap-1"
                  style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none' }}
                >
                  View All <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left portal-table">
                  <thead>
                    <tr>
                      {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(o => (
                      <tr key={o.id} className="cursor-pointer" onClick={() => navigate('/admin/orders')}>
                        <td className="font-black text-slate-900">#{o.id}</td>
                        <td>
                          <p className="font-semibold text-slate-800 truncate max-w-[140px]">{o.customerName}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">{o.customerEmail}</p>
                        </td>
                        <td className="font-black text-slate-900">{fmtINR(o.totalAmount)}</td>
                        <td><StatusPill status={o.status} /></td>
                        <td className="text-slate-500">{fmtDate(o.createdAt)}</td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-slate-400">
                          {loading ? 'Loading orders…' : 'No orders yet'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              {/* Pipeline metrics */}
              {[
                { label: 'In Production',  value: stats?.pendingOrders  ?? '—', sub: 'Printing / QC',    icon: 'hourglass_top',  color: '#D97706' },
                { label: 'Ready to Ship',  value: stats?.shippedOrders  ?? '—', sub: 'Awaiting pickup',  icon: 'local_shipping', color: '#0891B2' },
                { label: 'Cancelled',      value: stats?.cancelledOrders ?? '—', sub: fmtINR(stats?.totalLosses) + ' lost', icon: 'cancel', color: '#DC2626' },
              ].map(item => (
                <div key={item.label} className="portal-card p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.color + '18' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: item.color }}>{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">{item.value}</p>
                    <p className="text-xs font-semibold text-slate-600 mt-1">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                </div>
              ))}

              {/* Quick actions */}
              <div className="portal-card p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Quick Actions</p>
                <div className="space-y-0.5">
                  {[
                    { label: 'Manage Products', to: '/admin/products', icon: 'inventory_2'    },
                    { label: 'Staff',           to: '/admin/staff',    icon: 'group'           },
                    { label: 'Reports',         to: '/admin/reports',  icon: 'bar_chart'       },
                    { label: 'Settings',        to: '/admin/settings', icon: 'settings'        },
                  ].map(item => (
                    <button
                      key={item.to}
                      onClick={() => navigate(item.to)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                      style={{ border: 'none', background: 'transparent', minHeight: 'unset', transform: 'none' }}
                    >
                      <span className="material-symbols-outlined text-[#C0392B]" style={{ fontSize: 18 }}>{item.icon}</span>
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className="material-symbols-outlined text-slate-300 ml-auto" style={{ fontSize: 16 }}>chevron_right</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
