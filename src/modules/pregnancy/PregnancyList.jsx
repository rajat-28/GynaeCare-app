import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Baby, AlertTriangle, Calendar } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import styles from './PregnancyList.module.css'

const MOCK = [
  { id: 'PR001', name: 'Priya Sharma',  age: 28, lmp: '01 Jan 2026', edd: '08 Oct 2026', weeks: '10W 2D', visits: 2, risks: ['Anaemia'],                   status: 'active'   },
  { id: 'PR002', name: 'Meena Pillai',  age: 31, lmp: '15 Nov 2025', edd: '22 Aug 2026', weeks: '17W 0D', visits: 4, risks: ['Gestational Diabetes'],       status: 'active'   },
  { id: 'PR003', name: 'Deepa Nair',    age: 26, lmp: '10 Sep 2025', edd: '17 Jun 2026', weeks: '26W 3D', visits: 7, risks: ['Pre-eclampsia', 'Anaemia'],   status: 'high-risk'},
  { id: 'PR004', name: 'Lakshmi Iyer',  age: 34, lmp: '20 Jul 2025', edd: '27 Apr 2026', weeks: '34W 6D', visits: 9, risks: [],                             status: 'active'   },
  { id: 'PR005', name: 'Pooja Verma',   age: 29, lmp: '05 Jun 2025', edd: '12 Mar 2026', weeks: 'Delivered', visits: 12, risks: [],                         status: 'delivered'},
]

const STATUS_VARIANT = { active: 'success', 'high-risk': 'danger', delivered: 'teal' }

export default function PregnancyList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = MOCK.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search)
  )

  const COLUMNS = [
    {
      key: 'name', label: 'Patient',
      render: (val, row) => (
        <div className={styles.patientCell}>
          <div className={styles.avatar}>{val.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div className={styles.name}>{val}</div>
            <div className={styles.sub}>{row.id} · {row.age} yrs</div>
          </div>
        </div>
      )
    },
    {
      key: 'lmp', label: 'LMP / EDD',
      render: (val, row) => (
        <div>
          <div className={styles.dateVal}><Calendar size={12}/> LMP: {val}</div>
          <div className={styles.sub}><Baby size={12}/> EDD: {row.edd}</div>
        </div>
      )
    },
    {
      key: 'weeks', label: 'Gestation',
      render: v => (
        <span className={styles.weeks}>{v}</span>
      )
    },
    { key: 'visits', label: 'ANC Visits', render: v => <span className={styles.visits}>{v} visits</span> },
    {
      key: 'risks', label: 'Risk Flags',
      render: v => v.length === 0
        ? <span className={styles.noRisk}>None</span>
        : (
          <div className={styles.riskList}>
            {v.map(r => <Badge key={r} variant="danger" size="sm"><AlertTriangle size={10}/> {r}</Badge>)}
          </div>
        )
    },
    {
      key: 'status', label: 'Status',
      render: v => <Badge variant={STATUS_VARIANT[v]} dot>{v.charAt(0).toUpperCase()+v.slice(1).replace('-',' ')}</Badge>
    },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Pregnancy & ANC</h1>
          <p className={styles.pageSub}>Antenatal care tracking</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/pregnancy/new')}>
          New Pregnancy
        </Button>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: 'Active Pregnancies', value: '18', color: 'var(--clr-primary-600)' },
          { label: 'High Risk',          value: '3',  color: 'var(--clr-danger-500)'  },
          { label: 'Due This Month',     value: '2',  color: 'var(--clr-teal-600)'    },
          { label: 'Delivered (MTD)',    value: '5',  color: 'var(--clr-accent-600)'  },
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
            <input className={styles.searchInput} placeholder="Search patient or ID..."
              value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <Table columns={COLUMNS} data={filtered}
          onRowClick={row => navigate(`/pregnancy/${row.id}`)}/>
      </Card>
    </div>
  )
}