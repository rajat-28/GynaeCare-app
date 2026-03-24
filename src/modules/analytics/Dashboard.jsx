import { useState } from 'react'
import { useAuth } from '@/store/index'
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

/* ── Mock data ── */
const OPD_TREND = [
  { month: 'Sep', opd: 38, new: 12 }, { month: 'Oct', opd: 42, new: 15 },
  { month: 'Nov', opd: 35, new: 10 }, { month: 'Dec', opd: 48, new: 18 },
  { month: 'Jan', opd: 52, new: 20 }, { month: 'Feb', opd: 46, new: 14 },
  { month: 'Mar', opd: 58, new: 22 },
]

const REVENUE_DATA = [
  { month: 'Sep', revenue: 42000 }, { month: 'Oct', revenue: 55000 },
  { month: 'Nov', revenue: 38000 }, { month: 'Dec', revenue: 67000 },
  { month: 'Jan', revenue: 71000 }, { month: 'Feb', revenue: 63000 },
  { month: 'Mar', revenue: 68400 },
]

const EPISODE_MIX = [
  { name: 'OPD', value: 42, color: '#ec4899' },
  { name: 'Pregnancy', value: 18, color: '#14b8a6' },
  { name: 'Fertility', value: 12, color: '#8b5cf6' },
  { name: 'Ultrasound', value: 15, color: '#f59e0b' },
  { name: 'Reconstructive', value: 8, color: '#ef4444' },
  { name: 'Lab', value: 5, color: '#22c55e' },
]

const RECENT_PATIENTS = [
  { name: 'Priya Sharma', episode: 'Pregnancy Care', time: '10:30 AM', status: 'active' },
  { name: 'Anita Gupta', episode: 'Fertility Cycle', time: '11:00 AM', status: 'active' },
  { name: 'Kavya Menon', episode: 'OPD Consultation', time: '11:30 AM', status: 'waiting' },
  { name: 'Deepa Nair', episode: 'ANC Visit', time: '12:00 PM', status: 'high-risk' },
  { name: 'Reena Singh', episode: 'Reconstructive', time: '02:00 PM', status: 'active' },
]

const ALERTS = [
  { type: 'danger', msg: 'Deepa Nair — Pre-eclampsia risk flag', time: '2h ago' },
  { type: 'warning', msg: 'Anita Gupta — Follicular study due today', time: '3h ago' },
  { type: 'warning', msg: 'Lakshmi Iyer — EDD in 3 weeks, prep needed', time: '5h ago' },
  { type: 'default', msg: 'Meena Pillai — ANC visit overdue by 5 days', time: '1d ago' },
]

const STATUS_VARIANT = { active: 'success', waiting: 'default', 'high-risk': 'danger' }

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
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

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
        {[
          { icon: Users, label: "Today's Patients", value: '12', sub: '+3 vs yesterday', up: true, color: 'var(--clr-primary-600)' },
          { icon: Stethoscope, label: 'Total Patients', value: '248', sub: '+18 this month', up: true, color: 'var(--clr-teal-600)' },
          { icon: Baby, label: 'Active Pregnancies', value: '18', sub: '3 high risk', up: false, color: 'var(--clr-accent-600)' },
          { icon: TrendingUp, label: 'Revenue (MTD)', value: '₹68.4K', sub: '+12% vs last month', up: true, color: 'var(--clr-primary-600)' },
        ].map(k => {
          const Icon = k.icon
          return (
            <Card key={k.label} padding="md" hover className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <div className={styles.kpiIconWrap} style={{ background: `${k.color}18` }}>
                  <Icon size={20} style={{ color: k.color }} />
                </div>
                <span className={`${styles.kpiTrend} ${k.up ? styles.trendUp : styles.trendDown}`}>
                  {k.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {k.sub}
                </span>
              </div>
              <div className={styles.kpiValue}>{k.value}</div>
              <div className={styles.kpiLabel}>{k.label}</div>
            </Card>
          )
        })}
      </div>

      {/* Charts row 1 */}
      <div className={styles.chartsRow}>
        {/* OPD trend */}
        <Card padding="md" className={styles.chartCardWide}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>OPD Volume Trend</h3>
              <p className={styles.chartSub}>Total visits vs new patients</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={OPD_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradOpd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="opd" name="Total OPD" stroke="#ec4899" strokeWidth={2} fill="url(#gradOpd)" />
              <Area type="monotone" dataKey="new" name="New Patients" stroke="#14b8a6" strokeWidth={2} fill="url(#gradNew)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Episode mix */}
        <Card padding="md" className={styles.chartCardNarrow}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Episode Mix</h3>
            <p className={styles.chartSub}>By type</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={EPISODE_MIX} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value">
                {EPISODE_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.legendList}>
            {EPISODE_MIX.map(e => (
              <div key={e.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: e.color }} />
                <span className={styles.legendName}>{e.name}</span>
                <span className={styles.legendVal}>{e.value}%</span>
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
              <h3 className={styles.chartTitle}>Revenue Trend</h3>
              <p className={styles.chartSub}>Monthly collections</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip content={<CustomTooltip prefix="₹" />} />
              <Bar dataKey="revenue" name="Revenue" fill="#ec4899" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Alerts */}
        <Card padding="md" className={styles.chartCardNarrow}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Clinical Alerts</h3>
            <Badge variant="danger">{ALERTS.length}</Badge>
          </div>
          <div className={styles.alertList}>
            {ALERTS.map((a, i) => (
              <div key={i} className={styles.alertItem}>
                <AlertTriangle size={14} className={`${styles.alertIcon} ${styles[`alert_${a.type}`]}`} />
                <div className={styles.alertBody}>
                  <p className={styles.alertMsg}>{a.msg}</p>
                  <span className={styles.alertTime}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className={styles.bottomRow}>
        {/* Today's patients */}
        <Card padding="md" className={styles.bottomCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Today's Patients</h3>
            <Badge variant="primary">13 Mar 2026</Badge>
          </div>
          <div className={styles.patientList}>
            {RECENT_PATIENTS.map((p, i) => (
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
                  <Badge variant={STATUS_VARIANT[p.status]} size="sm" dot>
                    {p.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
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