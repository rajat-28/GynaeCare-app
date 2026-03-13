import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Search, Filter, Phone, Calendar } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import styles from './PatientList.module.css'

const MOCK_PATIENTS = [
  { id: 'P001', name: 'Priya Sharma', age: 28, phone: '9876543210', lastVisit: '10 Mar 2026', episode: 'Pregnancy Care',    status: 'active' },
  { id: 'P002', name: 'Anita Gupta',  age: 34, phone: '9845012345', lastVisit: '09 Mar 2026', episode: 'Fertility Cycle',   status: 'active' },
  { id: 'P003', name: 'Sunita Rao',   age: 42, phone: '9712345678', lastVisit: '07 Mar 2026', episode: 'OPD Consultation',  status: 'inactive' },
  { id: 'P004', name: 'Kavya Menon',  age: 25, phone: '9654321098', lastVisit: '06 Mar 2026', episode: 'Ultrasound Study',  status: 'active' },
  { id: 'P005', name: 'Reena Singh',  age: 31, phone: '9532109876', lastVisit: '05 Mar 2026', episode: 'Reconstructive',    status: 'warning' },
]

const EPISODE_VARIANT = {
  'Pregnancy Care':    'primary',
  'Fertility Cycle':   'teal',
  'OPD Consultation':  'default',
  'Ultrasound Study':  'warning',
  'Reconstructive':    'danger',
  'Lab Diagnosis':     'success',
}

const STATUS_VARIANT = { active: 'success', inactive: 'default', warning: 'warning' }

export default function PatientList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = MOCK_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  )

  const COLUMNS = [
    {
      key: 'name', label: 'Patient',
      render: (val, row) => (
        <div className={styles.patientCell}>
          <div className={styles.avatar}>{val.split(' ').map(n => n[0]).join('')}</div>
          <div>
            <div className={styles.patientName}>{val}</div>
            <div className={styles.patientId}>{row.id}</div>
          </div>
        </div>
      )
    },
    { key: 'age',   label: 'Age',   render: v => `${v} yrs` },
    {
      key: 'phone', label: 'Phone',
      render: v => (
        <span className={styles.phone}>
          <Phone size={12} /> {v}
        </span>
      )
    },
    {
      key: 'episode', label: 'Episode',
      render: v => <Badge variant={EPISODE_VARIANT[v] || 'default'}>{v}</Badge>
    },
    {
      key: 'status', label: 'Status',
      render: v => <Badge variant={STATUS_VARIANT[v]} dot>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
    },
    {
      key: 'lastVisit', label: 'Last Visit',
      render: v => (
        <span className={styles.date}><Calendar size={12} /> {v}</span>
      )
    },
  ]

  return (
    <div className="page-container">
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Patients</h1>
          <p className={styles.pageSubtitle}>{MOCK_PATIENTS.length} total patients</p>
        </div>
        <Button icon={UserPlus} onClick={() => navigate('/patients/new')}>
          New Patient
        </Button>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Patients', value: '248', color: 'var(--clr-primary-600)' },
          { label: 'Active Episodes', value: '34',  color: 'var(--clr-teal-600)'    },
          { label: 'This Month',      value: '18',  color: 'var(--clr-accent-600)'  },
          { label: 'Critical Flags',  value: '3',   color: 'var(--clr-danger-500)'  },
        ].map(s => (
          <Card key={s.label} padding="sm" className={styles.statCard}>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card padding="none">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by name, ID or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="secondary" icon={Filter} size="sm">Filter</Button>
        </div>

        <Table
          columns={COLUMNS}
          data={filtered}
          onRowClick={row => navigate(`/patients/${row.id}`)}
          emptyMessage="No patients match your search"
        />
      </Card>
    </div>
  )
}