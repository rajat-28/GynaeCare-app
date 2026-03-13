import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Stethoscope, Calendar, Clock } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import styles from './OPDList.module.css'

const MOCK_CONSULTATIONS = [
  { id: 'C001', patientName: 'Priya Sharma',  patientId: 'P001', age: 28, date: '10 Mar 2026', time: '10:30 AM', complaint: 'Irregular periods',  diagnosis: 'PCOS',              status: 'completed' },
  { id: 'C002', patientName: 'Anita Gupta',   patientId: 'P002', age: 34, date: '10 Mar 2026', time: '11:00 AM', complaint: 'Infertility',         diagnosis: 'Ovarian cyst',      status: 'completed' },
  { id: 'C003', patientName: 'Kavya Menon',   patientId: 'P004', age: 25, date: '10 Mar 2026', time: '11:30 AM', complaint: 'Pelvic pain',         diagnosis: 'Endometriosis',     status: 'in-progress' },
  { id: 'C004', patientName: 'Sunita Rao',    patientId: 'P003', age: 42, date: '10 Mar 2026', time: '12:00 PM', complaint: 'Vaginal discharge',   diagnosis: 'PID',               status: 'waiting' },
  { id: 'C005', patientName: 'Reena Singh',   patientId: 'P005', age: 31, date: '09 Mar 2026', time: '02:00 PM', complaint: 'Urinary incontinence',diagnosis: 'Pelvic floor weak', status: 'completed' },
]

const STATUS_VARIANT = {
  'completed':    'success',
  'in-progress':  'warning',
  'waiting':      'default',
}

export default function OPDList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = MOCK_CONSULTATIONS.filter(c =>
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.complaint.toLowerCase().includes(search.toLowerCase()) ||
    c.diagnosis.toLowerCase().includes(search.toLowerCase())
  )

  const COLUMNS = [
    {
      key: 'patientName', label: 'Patient',
      render: (val, row) => (
        <div className={styles.patientCell}>
          <div className={styles.avatar}>{val.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div className={styles.name}>{val}</div>
            <div className={styles.sub}>{row.patientId} · {row.age} yrs</div>
          </div>
        </div>
      )
    },
    {
      key: 'date', label: 'Date & Time',
      render: (val, row) => (
        <div>
          <div className={styles.dateVal}><Calendar size={12}/> {val}</div>
          <div className={styles.sub}><Clock size={12}/> {row.time}</div>
        </div>
      )
    },
    { key: 'complaint',  label: 'Chief Complaint', render: v => <span className={styles.complaint}>{v}</span> },
    { key: 'diagnosis',  label: 'Diagnosis',        render: v => <Badge variant="primary">{v}</Badge> },
    {
      key: 'status', label: 'Status',
      render: v => (
        <Badge variant={STATUS_VARIANT[v]} dot>
          {v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}
        </Badge>
      )
    },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>OPD Consultations</h1>
          <p className={styles.pageSub}>Today: 13 Mar 2026</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/opd/new')}>
          New Consultation
        </Button>
      </div>

      {/* Today's stats */}
      <div className={styles.statsRow}>
        {[
          { label: "Today's OPD",    value: '12', color: 'var(--clr-primary-600)' },
          { label: 'Completed',      value: '8',  color: 'var(--clr-accent-600)'  },
          { label: 'In Progress',    value: '2',  color: 'var(--clr-warning-500)' },
          { label: 'Waiting',        value: '2',  color: 'var(--clr-neutral-500)' },
        ].map(s => (
          <Card key={s.label} padding="sm" className={styles.statCard}>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon}/>
            <input className={styles.searchInput}
              placeholder="Search patient, complaint, diagnosis..."
              value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <Table columns={COLUMNS} data={filtered}
          onRowClick={row => navigate(`/opd/${row.id}`)}
          emptyMessage="No consultations found"/>
      </Card>
    </div>
  )
}