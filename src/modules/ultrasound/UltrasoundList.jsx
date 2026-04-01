import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calendar } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { episodeApi } from '@services/api'
import styles from './Ultrasound.module.css'

export default function UltrasoundList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await episodeApi.getAll('ultrasound')
        const d = res.data?.data || res.data
        setEpisodes(Array.isArray(d) ? d : res.data.episodes || [])
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
    return pName.toLowerCase().includes(q) || e.patient?.id?.toLowerCase().includes(q)
  })

  // Group by patient
  const patientMap = {}
  filtered.forEach(e => {
    const rawPatientId = e.patient?.id
    if (!rawPatientId) return
    const lastScan = e.ultrasounds?.[0]

    if (!patientMap[rawPatientId]) {
      patientMap[rawPatientId] = {
        id: e.id,
        rawPatientId,
        patientName: e.patient.name || 'Unknown',
        patientId: e.patient.id?.slice(0, 8) || '—',
        age: e.patient.age || '—',
        date: new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        scanType: lastScan?.scanType || '—',
        category: lastScan?.scanCategory || '—',
        findings: lastScan?.findings?.summary || lastScan?.impression || '—',
        status: e.episodeStatus || 'active'
      }
    }
  })
  const tableData = Object.values(patientMap)

  // Stats
  const totalScans = episodes.reduce((acc, curr) => acc + (curr.ultrasounds?.length || 0), 0)
  const obstetricCount = episodes.reduce((acc, e) => acc + (e.ultrasounds?.filter(u => u.scanCategory?.toLowerCase() === 'obstetric').length || 0), 0)
  const gynaeCount = totalScans - obstetricCount

  const now = new Date()
  const scansThisMonth = episodes.reduce((acc, e) => {
    return acc + (e.ultrasounds?.filter(u => {
      const d = new Date(u.createdAt || e.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length || 0)
  }, 0)

  const COLUMNS = [
    {
      key: 'patientName', label: 'Patient',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clr-primary-100)', color: 'var(--clr-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{val}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.patientId} · {row.age} yrs</div>
          </div>
        </div>
      )
    },
    {
      key: 'date', label: 'Last Scan',
      render: (val) => (
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} /> {val}
        </div>
      )
    },
    {
      key: 'scanType', label: 'Scan Type',
      render: v => <Badge variant="primary" size="sm">{v.replace(/_/g, ' ')}</Badge>
    },
    {
      key: 'category', label: 'Category',
      render: v => <Badge variant={v.toLowerCase() === 'obstetric' ? 'teal' : 'default'} size="sm">{v}</Badge>
    },
    {
      key: 'findings', label: 'Impression',
      render: v => <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</div>
    },
    {
      key: 'status', label: 'Status', align: 'center',
      render: v => <Badge variant={v === 'active' ? 'success' : 'default'} dot>{v}</Badge>
    }
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Ultrasound & Imaging</h1>
          <p className={styles.pageSub}>Scan reports and findings</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: 'Total Scans', value: loading ? '...' : totalScans, color: 'var(--clr-primary-600)' },
          { label: 'This Month', value: loading ? '...' : scansThisMonth, color: 'var(--clr-teal-600)' },
          { label: 'Obstetric', value: loading ? '...' : obstetricCount, color: 'var(--clr-accent-600)' },
          { label: 'Gynaecological', value: loading ? '...' : gynaeCount, color: 'var(--clr-warning-500)' },
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
              placeholder="Search patient"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table
          columns={COLUMNS}
          data={tableData}
          onRowClick={row => navigate(`/ultrasound/patient/${row.rawPatientId}`)}
          emptyMessage={loading ? "Loading..." : "No scan reports found"}
        />
      </Card>
    </div>
  )
}
