import { useState, useEffect } from 'react'
import { useAuth } from '@/store/index'
import { analyticsApi } from '@services/api'
import {
  Users, Stethoscope, Baby, TrendingUp,
  AlertTriangle, Calendar, IndianRupee, Wallet, Clock
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card } from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import styles from './Dashboard.module.css'

const STATUS_VARIANT = { 
  active: 'success', 
  waiting: 'default', 
  'high-risk': 'danger',
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'danger' 
}

const EPISODE_COLORS = {
  opd: '#ec4899',
  pregnancy: '#14b8a6',
  fertility: '#8b5cf6',
  ultrasound: '#f59e0b',
  procedure: '#ef4444',
  lab: '#22c55e'
}

const EPISODE_LABELS = {
  opd: 'OPD',
  pregnancy: 'Pregnancy',
  fertility: 'Fertility',
  ultrasound: 'Ultrasound',
  procedure: 'Procedure',
  lab: 'Lab'
}

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`

/* ── Revenue tooltip — total only ── */
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const revenue = payload.find(p => p.dataKey === 'revenue')?.value || 0
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipVal} style={{ color: '#ec4899' }}>Revenue: {fmt(revenue)}</p>
    </div>
  )
}

/* ── Generic tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className={styles.tooltipVal}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (user?.id) {
      // Only filter by doctorId if the user is actually a doctor
      const doctorId = user.role === 'doctor' ? user.id : undefined
      analyticsApi.getDashboardStats(doctorId)
        .then(res => {
          setStats(res.data?.response || res.data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [user?.id, user?.role])


  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) return <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>Loading Dashboard...</div>

  // Mappings
  const opdTrendData = (stats?.trends?.opdTrend || []).map(t => ({
    month: t.month,
    opd: parseInt(t.opd) || 0,
    new: 0
  }))

  const revenueData = (stats?.trends?.revenueTrend || []).map(t => ({
    month: t.month,
    revenue:  parseFloat(t.revenue)  || 0,
    received: parseFloat(t.received) || 0,
    due:      parseFloat(t.due)      || 0,
  }))

  const episodeMixData = (stats?.mix || [])
    .filter(m => !['fertility', 'lab'].includes(m.name))
    .map(m => ({
      name: EPISODE_LABELS[m.name] || m.name,
      value: parseInt(m.value) || 0,
      color: EPISODE_COLORS[m.name] || '#94a3b8'
    }))

  const serviceRevenueData = (stats?.serviceRevenue || []).map((s, i) => ({
    service: s.service,
    revenue: parseFloat(s.revenue) || 0,
    color: SERVICE_COLORS[i % SERVICE_COLORS.length]
  }))

  const totalRevenue  = stats?.kpis?.totalRevenue  || 0
  const totalReceived = stats?.kpis?.totalReceived  || 0
  const totalDue      = stats?.kpis?.totalDue       || 0
  const receivedPct   = totalRevenue > 0 ? Math.round((totalReceived / totalRevenue) * 100) : 0

  const kpis = [
    { icon: Users,        label: "Today's Patients",  value: stats?.kpis?.todayPatients || 0,     sub: 'Daily count',    color: 'var(--clr-primary-600)' },
    { icon: Stethoscope,  label: 'Total Patients',    value: stats?.kpis?.totalPatients || 0,     sub: 'All registered', color: 'var(--clr-teal-600)' },
    { icon: Baby,         label: 'Active Pregnancies',value: stats?.kpis?.activePregnancies || 0, sub: 'Clinical cases', color: 'var(--clr-accent-600)' },
    { icon: TrendingUp,   label: 'Revenue (MTD)',     value: fmt(stats?.kpis?.revenueMTD || 0),   sub: 'Month to date',  color: 'var(--clr-primary-600)' },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            {greeting()}, {user?.name} 👋
          </h1>
          <p className={styles.pageSub}>{today}</p>
        </div>
      </div>

      {/* KPI row */}
      <div className={styles.kpiRow}>
        {kpis.map(k => {
          const Icon = k.icon
          return (
            <Card key={k.label} padding="md" hover className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <div className={styles.kpiIconWrap} style={{ background: `${k.color}18` }}>
                  <Icon size={20} style={{ color: k.color }} />
                </div>
              </div>
              <div className={styles.kpiValue}>{k.value}</div>
              <div className={styles.kpiLabel}>{k.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{k.sub}</div>
            </Card>
          )
        })}
      </div>

      {/* Revenue summary strip */}
      <div className={styles.revenueStrip}>
        {/* Total revenue */}
        <Card padding="md" className={styles.revCard}>
          <div className={styles.revCardTop}>
            <div className={styles.revIconWrap} style={{ background: '#ec489918' }}>
              <IndianRupee size={18} style={{ color: '#ec4899' }} />
            </div>
            <span className={styles.revCardLabel}>Total Revenue (All Time)</span>
          </div>
          <div className={styles.revCardValue}>{fmt(totalRevenue)}</div>
        </Card>

        {/* Received */}
        <Card padding="md" className={styles.revCard}>
          <div className={styles.revCardTop}>
            <div className={styles.revIconWrap} style={{ background: '#22c55e18' }}>
              <Wallet size={18} style={{ color: '#22c55e' }} />
            </div>
            <span className={styles.revCardLabel}>Received</span>
          </div>
          <div className={styles.revCardValue} style={{ color: '#22c55e' }}>{fmt(totalReceived)}</div>
          {/* Progress bar */}
          <div className={styles.revProgress}>
            <div className={styles.revProgressBar} style={{ width: `${receivedPct}%`, background: '#22c55e' }} />
          </div>
          <div className={styles.revProgressLabel}>{receivedPct}% collected</div>
        </Card>

        {/* Due */}
        <Card padding="md" className={styles.revCard}>
          <div className={styles.revCardTop}>
            <div className={styles.revIconWrap} style={{ background: '#f59e0b18' }}>
              <Clock size={18} style={{ color: '#f59e0b' }} />
            </div>
            <span className={styles.revCardLabel}>Outstanding Due</span>
          </div>
          <div className={styles.revCardValue} style={{ color: '#f59e0b' }}>{fmt(totalDue)}</div>
          <div className={styles.revProgress}>
            <div className={styles.revProgressBar} style={{ width: `${100 - receivedPct}%`, background: '#f59e0b' }} />
          </div>
          <div className={styles.revProgressLabel}>{100 - receivedPct}% pending</div>
        </Card>
      </div>

      {/* Charts row 1 */}
      <div className={styles.chartsRow}>
        <Card padding="md" className={styles.chartCardWide}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>OPD Volume Trend</h3>
              <p className={styles.chartSub}>Total visits for last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={opdTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradOpd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ec4899" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="opd" name="Total OPD Visits" stroke="#ec4899" strokeWidth={2} fill="url(#gradOpd)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Episode mix */}
        <Card padding="md" className={styles.chartCardNarrow}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Episode Distribution</h3>
            <p className={styles.chartSub}>By case type</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={episodeMixData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value">
                {episodeMixData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.legendList}>
            {episodeMixData.map(e => (
              <div key={e.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: e.color }} />
                <span className={styles.legendName}>{e.name}</span>
                <span className={styles.legendVal}>{e.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts row 2 — Revenue Performance + Alerts */}
      <div className={styles.chartsRow}>
        {/* Revenue chart — single bar, hover tooltip shows received + due */}
        <Card padding="md" className={styles.chartCardWide}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Revenue Performance</h3>
              <p className={styles.chartSub}>Last 6 months — hover a bar for received vs due</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${v >= 1000 ? v / 1000 + 'K' : v}`} />
              <Tooltip content={<RevenueTooltip />} />
              <Bar dataKey="revenue" name="Total" fill="#ec4899" radius={[6,6,0,0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Alerts */}
        <Card padding="md" className={styles.chartCardNarrow}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Clinic Alerts</h3>
            <Badge variant="danger">{(stats?.alerts || []).length}</Badge>
          </div>
          <div className={styles.alertList}>
            {(stats?.alerts || []).length > 0 ? (stats?.alerts || []).map((a, i) => (
              <div key={i} className={styles.alertItem}>
                <AlertTriangle size={14} className={`${styles.alertIcon} ${styles[`alert_${a.type}`]}`} />
                <div className={styles.alertBody}>
                  <p className={styles.alertMsg}>{a.msg}</p>
                  <span className={styles.alertTime}>{a.time}</span>
                </div>
              </div>
            )) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No active alerts.</p>
            )}
          </div>
        </Card>
      </div>


      {/* Bottom row — Today's Queue */}
      <div className={styles.bottomRow}>
        <Card padding="md" className={styles.bottomCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Today's Queue</h3>
            <Badge variant="primary">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</Badge>
          </div>
          <div className={styles.patientList}>
            {(stats?.recentPatients || []).length > 0 ? (stats?.recentPatients || []).map((p, i) => (
              <div key={i} className={styles.patientRow}>
                <div className={styles.patientAvatar}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={styles.patientInfo}>
                  <span className={styles.patientName}>{p.name}</span>
                  <span className={styles.patientEpisode}>{p.episode}</span>
                </div>
                <div className={styles.patientMeta}>
                  <span className={styles.patientTime}>
                    <Calendar size={11} /> {p.time}
                  </span>
                  <Badge variant={STATUS_VARIANT[p.status] || 'default'} size="sm" dot>
                    {p.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            )) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No patients scheduled for today.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}