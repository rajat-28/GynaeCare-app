import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Calendar, Clock } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { episodeApi } from '@services/api'
import styles from './OPDList.module.css'

const STATUS_VARIANT = {
  'active': 'success',
  'inactive': 'default',
}

export default function OPDList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await episodeApi.getAll('opd')
        setEpisodes(Array.isArray(res.data) ? res.data : res.data.episodes || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = episodes.filter(e => {
    const pName = e.patient?.name || ''
    const q = search.toLowerCase()
    return pName.toLowerCase().includes(q)
  })

  // Format and group data for table (one row per patient)
  const patientMap = {}
  filtered.forEach(e => {
    const rawPatientId = e.patient?.id
    if (!rawPatientId) return
    const lastCons = e.consultations?.[0]
    if (!patientMap[rawPatientId]) {
      patientMap[rawPatientId] = {
        id: e.id, // latest episode
        rawPatientId,
        patientName: e.patient.name || 'Unknown',
        patientId: e.patient.id?.slice(0, 8) || '—',
        age: e.patient.age || '—',
        date: new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date(e.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        complaint: lastCons?.chiefComplaint?.join(', ') || e.title || '—',
        status: e.episodeStatus || 'active'
      }
    }
  })
  const tableData = Object.values(patientMap)

  const COLUMNS = [
    {
      key: 'patientName', label: 'Patient', headerAlign: 'center',
      render: (val, row) => (
        <div className={styles.patientCell}>
          <div className={styles.avatar}>{val.split(' ').map(n => n[0]).join('')}</div>
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
          <div className={styles.dateVal}><Calendar size={12} /> {val}</div>
          <div className={styles.sub}><Clock size={12} /> {row.time}</div>
        </div>
      )
    },
    {
      key: 'complaint',
      label: 'Chief Complaint',
      field: 'complaint',
      sortable: true,
      render: v => <span className={styles.complaint}>{v}</span>
    },
    {
      key: 'status', label: 'Status', align: 'center',
      render: v => (
        <Badge variant={STATUS_VARIANT[v] || 'default'} dot>
          {v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}
        </Badge>
      )
    },
    {
      key: 'action', label: 'Add Consultation', align: 'center',
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/opd/new?episodeId=${row.id}&patientId=${row.rawPatientId}`)
          }}
          style={{ padding: '0 8px', height: '24px', fontSize: '12px', minWidth: 'auto' }}
        >
          Add
        </Button>
      )
    },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>OPD Consultations</h1>
          <p className={styles.pageSub}>Today: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Today's stats */}
      <div className={styles.statsRow}>
        {[
          { label: "Total OPD", value: loading ? '...' : episodes.length, color: 'var(--clr-primary-600)' },
          { label: 'Active', value: loading ? '...' : episodes.filter(e => e.episodeStatus === 'active').length, color: 'var(--clr-accent-600)' },
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
            <Search size={14} className={styles.searchIcon} />
            <input className={styles.searchInput}
              placeholder="Search patient, complaint, diagnosis..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table
          columns={COLUMNS}
          data={tableData}
          onRowClick={row => navigate(`/opd/patient/${row.rawPatientId}`)}
          emptyMessage={loading ? "Loading..." : "No OPD episodes found"}
        />
      </Card>
    </div>
  )
}