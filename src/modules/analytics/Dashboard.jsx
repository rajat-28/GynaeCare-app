import { useState, useEffect } from 'react'
import { useAuth } from '@/store/index'
import { analyticsApi } from '@services/api'
import {
  Users, Stethoscope, Baby, TrendingUp,
  AlertTriangle, Calendar, ArrowUpRight, ArrowDownRight
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

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className={styles.tooltipVal}>
          {p.name}: {prefix}{typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value}{suffix}
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
    analyticsApi.getDashboardStats()
      .then(res => {
        setStats(res.data?.response || res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

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
    new: 0 // Logic for new patients could be added to backend later
  }))

  const revenueData = (stats?.trends?.revenueTrend || []).map(t => ({
    month: t.month,
    revenue: parseFloat(t.revenue) || 0
  }))

  const episodeMixData = (stats?.mix || [])
    .filter(m => !['fertility', 'lab'].includes(m.name))
    .map(m => ({
      name: EPISODE_LABELS[m.name] || m.name,
      value: parseInt(m.value) || 0,
      color: EPISODE_COLORS[m.name] || '#94a3b8'
    }))

  const kpis = [
    { icon: Users, label: "Today's Patients", value: stats?.kpis?.todayPatients || 0, sub: 'Daily count', up: true, color: 'var(--clr-primary-600)' },
    { icon: Stethoscope, label: 'Total Patients', value: stats?.kpis?.totalPatients || 0, sub: 'All registered', up: true, color: 'var(--clr-teal-600)' },
    { icon: Baby, label: 'Active Pregnancies', value: stats?.kpis?.activePregnancies || 0, sub: 'Clinical cases', up: true, color: 'var(--clr-accent-600)' },
    { icon: TrendingUp, label: 'Revenue (MTD)', value: fmt(stats?.kpis?.revenueMTD || 0), sub: 'Month to date', up: true, color: 'var(--clr-primary-600)' },
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
        {/* <Badge variant="primary" dot>Clinic Open</Badge> */}
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
                {/* <span className={`${styles.kpiTrend} ${k.up ? styles.trendUp : styles.trendDown}`}>
                  {k.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {k.sub}
                </span> */}
              </div>
              <div className={styles.kpiValue}>{k.value}</div>
              <div className={styles.kpiLabel}>{k.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{k.sub}</div>
            </Card>
          )
        })}
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
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
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

      {/* Charts row 2 */}
      <div className={styles.chartsRow}>
        {/* Revenue */}
        <Card padding="md" className={styles.chartCardWide}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Revenue Performance</h3>
              <p className={styles.chartSub}>Last 6 months collections</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${v >= 1000 ? v / 1000 + 'K' : v}`} />
              <Tooltip content={<CustomTooltip prefix="₹" />} />
              <Bar dataKey="revenue" name="Revenue" fill="#ec4899" radius={[6, 6, 0, 0]} maxBarSize={40} />
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

      {/* Bottom row */}
      <div className={styles.bottomRow}>
        {/* Today's patients */}
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

        {/* Quick stats */}
        <Card padding="md" className={styles.quickStats}>
          <h3 className={styles.chartTitle} style={{ marginBottom: 'var(--space-4)' }}>Clinical Metrics</h3>
          {[
            { label: 'Pregnancy Success Rate', value: '94%', variant: 'success' },
            { label: 'IVF Cycle Success', value: '62%', variant: 'teal' },
            { label: 'Avg ANC Visits / Patient', value: '8.4', variant: 'primary' },
            { label: 'Patient Retention Rate', value: '87%', variant: 'success' },
            { label: 'High Risk Pregnancies', value: '16%', variant: 'warning' },
            { label: 'Complication Rate', value: '4.2%', variant: 'danger' },
          ].map(m => (
            <div key={m.label} className={styles.metricRow}>
              <span className={styles.metricLabel}>{m.label}</span>
              <Badge variant={m.variant}>{m.value}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}