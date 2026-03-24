import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Download, TrendingUp } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { billingApi } from '@services/api'
import { INVOICE_STATUS } from './billingData'
import styles from './BillingList.module.css'

// Extend status map to handle backend values not in billingData
const STATUS_MAP = {
  ...INVOICE_STATUS,
  issued: { label: 'Pending', variant: 'danger' },
  overdue: { label: 'Overdue', variant: 'danger' },
}

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function BillingList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    setLoading(true)
    billingApi.getAll()
      .then(res => setInvoices(res.data.invoices ?? []))
      .catch(() => setError('Failed to load invoices.'))
      .finally(() => setLoading(false))
  }, [])

  // Map backend invoice → row shape
  const rows = invoices.map(inv => ({
    id: inv.id,
    invoiceNo: inv.invoiceNumber,
    patient: inv.patient?.name ?? '—',
    patientId: inv.patient?.id ?? '—',
    date: formatDate(inv.createdAt),
    services: inv.items?.map(i => i.description).join(', ') || '—',
    amount: Number(inv.netAmount),
    paid: Number(inv.paidAmount),
    status: inv.status,
  }))

  const filtered = rows.filter(i => {
    const matchSearch = (
      i.patient.toLowerCase().includes(search.toLowerCase()) ||
      i.invoiceNo?.toLowerCase().includes(search.toLowerCase())
    )
    const matchFilter = filter === 'All' || i.status === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  const now = new Date()
  const thisMonthInvoices = invoices.filter(inv => {
    const d = new Date(inv.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const totalInvoiced = rows.reduce((s, i) => s + i.amount, 0)
  const totalRevenue = rows.reduce((s, i) => s + i.paid, 0)
  const totalPending = rows.reduce((s, i) => s + (i.amount - i.paid), 0)
  const thisMonthTotal = thisMonthInvoices.reduce((s, i) => s + Number(i.netAmount), 0)

  const COLUMNS = [
    {
      key: 'invoiceNo', label: 'Invoice',
      render: (val, row) => (
        <div>
          <div className={styles.invoiceId}>{val}</div>
          <div className={styles.sub}>{row.date}</div>
        </div>
      )
    },
    {
      key: 'patient', label: 'Patient',
      render: (val, row) => (
        <div className={styles.patientCell}>
          <div className={styles.avatar}>{val.split(' ').map(n => n[0]).join('')}</div>
          <div>
            <div className={styles.name}>{val}</div>
            <div className={styles.sub}>{row.patientId?.slice(0, 8)}…</div>
          </div>
        </div>
      )
    },
    { key: 'services', label: 'Services', render: v => <span className={styles.services}>{v}</span> },
    {
      key: 'amount', label: 'Amount', align: 'right',
      render: (val, row) => (
        <div style={{ textAlign: 'right' }}>
          <div className={styles.amount}>{fmt(val)}</div>
          {row.paid < val && (
            <div className={styles.outstanding}>Due: {fmt(val - row.paid)}</div>
          )}
        </div>
      )
    },
    {
      key: 'status', label: 'Status',
      render: v => {
        const s = STATUS_MAP[v] ?? { label: v, variant: 'default' }
        return <Badge variant={s.variant} dot>{s.label}</Badge>
      }
    },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Billing & Payments</h1>
          <p className={styles.pageSub}>GST-compliant invoicing</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" icon={Download} size="sm">Export</Button>
          <Button icon={Plus} onClick={() => navigate('/billing/new')}>New Invoice</Button>
        </div>
      </div>

      {/* Revenue stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Invoiced', value: fmt(totalInvoiced), color: 'var(--text-primary)', icon: '📋' },
          { label: 'Collected', value: fmt(totalRevenue), color: 'var(--clr-accent-600)', icon: '✅' },
          { label: 'Outstanding', value: fmt(totalPending), color: 'var(--clr-danger-500)', icon: '⏳' },
          { label: 'This Month', value: fmt(thisMonthTotal), color: 'var(--clr-primary-600)', icon: '📈' },
        ].map(s => (
          <Card key={s.label} padding="md" className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statEmoji}>{s.icon}</span>
              {/* <TrendingUp size={14} className={styles.statTrend}/> */}
            </div>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Search invoice or patient..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className={styles.filters}>
            {['All', 'Paid', 'Partial', 'Pending', 'issued', 'overdue'].map(f => (
              <button key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {loading && <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading invoices…</p>}
        {error && <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--clr-danger-500)' }}>{error}</p>}
        {!loading && !error && (
          <Table columns={COLUMNS} data={filtered}
            onRowClick={row => navigate(`/billing/${row.id}`)} />
        )}
      </Card>
    </div>
  )
}