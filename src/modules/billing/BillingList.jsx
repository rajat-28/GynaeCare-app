import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Download, TrendingUp } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { INVOICE_STATUS } from './billingData'
import styles from './BillingList.module.css'

const MOCK_INVOICES = [
  { id: 'INV001', patient: 'Priya Sharma',  patientId: 'P001', date: '10 Mar 2026', services: 'OPD Consultation, Dating Scan', amount: 1700,  paid: 1700,  status: 'paid'     },
  { id: 'INV002', patient: 'Anita Gupta',   patientId: 'P002', date: '09 Mar 2026', services: 'Follicular Study × 2',          amount: 1600,  paid: 800,   status: 'partial'  },
  { id: 'INV003', patient: 'Deepa Nair',    patientId: 'P003', date: '08 Mar 2026', services: 'NT Scan, Growth Scan',           amount: 3000,  paid: 0,     status: 'pending'  },
  { id: 'INV004', patient: 'Kavya Menon',   patientId: 'P004', date: '07 Mar 2026', services: 'Laser Vaginal Tightening',       amount: 15000, paid: 15000, status: 'paid'     },
  { id: 'INV005', patient: 'Reena Singh',   patientId: 'P005', date: '06 Mar 2026', services: 'ANC Package',                   amount: 8000,  paid: 4000,  status: 'partial'  },
  { id: 'INV006', patient: 'Lakshmi Iyer',  patientId: 'P006', date: '05 Mar 2026', services: 'IUI Procedure',                 amount: 8000,  paid: 8000,  status: 'paid'     },
]

const fmt = n => `₹${n.toLocaleString('en-IN')}`

export default function BillingList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = MOCK_INVOICES.filter(i =>
    i.patient.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue  = MOCK_INVOICES.reduce((s,i) => s + i.paid, 0)
  const totalPending  = MOCK_INVOICES.reduce((s,i) => s + (i.amount - i.paid), 0)
  const totalInvoiced = MOCK_INVOICES.reduce((s,i) => s + i.amount, 0)

  const COLUMNS = [
    {
      key: 'id', label: 'Invoice',
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
          <div className={styles.avatar}>{val.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div className={styles.name}>{val}</div>
            <div className={styles.sub}>{row.patientId}</div>
          </div>
        </div>
      )
    },
    { key: 'services', label: 'Services', render: v => <span className={styles.services}>{v}</span> },
    {
      key: 'amount', label: 'Amount', align: 'right',
      render: (val, row) => (
        <div style={{textAlign:'right'}}>
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
        const s = INVOICE_STATUS[v]
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
          { label: 'Total Invoiced',  value: fmt(totalInvoiced), color: 'var(--text-primary)',         icon: '📋' },
          { label: 'Collected',       value: fmt(totalRevenue),  color: 'var(--clr-accent-600)',        icon: '✅' },
          { label: 'Outstanding',     value: fmt(totalPending),  color: 'var(--clr-danger-500)',        icon: '⏳' },
          { label: 'This Month',      value: '₹68,400',          color: 'var(--clr-primary-600)',       icon: '📈' },
        ].map(s => (
          <Card key={s.label} padding="md" className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statEmoji}>{s.icon}</span>
              <TrendingUp size={14} className={styles.statTrend}/>
            </div>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon}/>
            <input className={styles.searchInput} placeholder="Search invoice or patient..."
              value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <div className={styles.filters}>
            {['All','Paid','Partial','Pending'].map(f => (
              <button key={f} className={styles.filterBtn}>{f}</button>
            ))}
          </div>
        </div>
        <Table columns={COLUMNS} data={filtered}
          onRowClick={row => navigate(`/billing/${row.id}`)}/>
      </Card>
    </div>
  )
}