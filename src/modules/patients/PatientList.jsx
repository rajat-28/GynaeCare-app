import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Search, Filter, Phone, Calendar, AlertCircle } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { patientApi } from '@services/api'
import styles from './PatientList.module.css'

const EPISODE_VARIANT = {
  opd:       'default',
  pregnancy: 'primary',
  fertility: 'teal',
  ultrasound:'warning',
  procedure: 'danger',
  lab:       'success',
}

const EPISODE_LABEL = {
  opd:       'OPD',
  pregnancy: 'Pregnancy',
  fertility: 'Fertility',
  ultrasound:'Ultrasound',
  procedure: 'Procedure',
  lab:       'Lab',
}

export default function PatientList() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [searchResults, setSearchResults] = useState(null) // null = not searching

  // Load all patients on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await patientApi.getAll()
        const data = res.data
        // Handle both { patients, count } and plain array
        setPatients(Array.isArray(data) ? data : data.patients || [])
      } catch (err) {
        setError('Failed to load patients. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Search with debounce
  useEffect(() => {
    if (!search.trim()) { setSearchResults(null); return }

    const timer = setTimeout(async () => {
      try {
        const res = await patientApi.search(search.trim())
        const data = res.data
        setSearchResults(Array.isArray(data) ? data : data.patients || [])
      } catch {
        setSearchResults([])
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  const displayPatients = searchResults !== null ? searchResults : patients

  const COLUMNS = [
    {
      key: 'name', label: 'Patient',
      render: (val, row) => (
        <div className={styles.patientCell}>
          <div className={styles.avatar}>
            {val?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div>
            <div className={styles.patientName}>{val}</div>
            <div className={styles.patientId}>{row.id?.slice(0,8)}...</div>
          </div>
        </div>
      )
    },
    { key: 'age',   label: 'Age',   render: v => v ? `${v} yrs` : '—' },
    {
      key: 'phone', label: 'Phone',
      render: v => v
        ? <span className={styles.phone}><Phone size={12}/> {v}</span>
        : '—'
    },
    {
      key: 'createdAt', label: 'Registered',
      render: v => v
        ? <span className={styles.date}>
            <Calendar size={12}/>
            {new Date(v).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
          </span>
        : '—'
    },
    {
      key: 'episodes', label: 'Add Episode',
      render: (v, row) => {
        const latest = Array.isArray(v) ? v[0] : null
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {latest && (
              <Badge variant={EPISODE_VARIANT[latest.type] || 'default'}>
                {EPISODE_LABEL[latest.type] || latest.type}
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/patients/${row.id}/episodes/new`)
              }}
              style={{ padding: '0 8px', height: '24px', fontSize: '12px', minWidth: 'auto' }}
            >
              Add
            </Button>
          </div>
        )
      }
    },
  ]

  return (
    <div className="page-container">
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Patients</h1>
          <p className={styles.pageSubtitle}>
            {loading ? 'Loading...' : `${patients.length} total patients`}
          </p>
        </div>
        <Button icon={UserPlus} onClick={() => navigate('/patients/new')}>
          New Patient
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={15}/>
          {error}
        </div>
      )}

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Patients',  value: patients.length,                                          color: 'var(--clr-primary-600)' },
          { label: 'Active Episodes', value: patients.filter(p => p.episodes?.length > 0).length,     color: 'var(--clr-teal-600)'    },
          { label: 'Registered Today',value: patients.filter(p => {
              if (!p.createdAt) return false
              const today = new Date().toDateString()
              return new Date(p.createdAt).toDateString() === today
            }).length,                                                                                  color: 'var(--clr-accent-600)'  },
          { label: 'This Month',      value: patients.filter(p => {
              if (!p.createdAt) return false
              const d = new Date(p.createdAt)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length,                                                                                  color: 'var(--clr-warning-500)' },
        ].map(s => (
          <Card key={s.label} padding="sm" className={styles.statCard}>
            <div className={styles.statValue} style={{ color: s.color }}>
              {loading ? '—' : s.value}
            </div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card padding="none">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon}/>
            <input
              className={styles.searchInput}
              placeholder="Search by name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="secondary" icon={Filter} size="sm">Filter</Button>
        </div>

        {loading
          ? <div className={styles.loadingState}>Loading patients...</div>
          : <Table
              columns={COLUMNS}
              data={displayPatients}
              onRowClick={row => navigate(`/patients/${row.id}`)}
              emptyMessage={search ? 'No patients match your search' : 'No patients registered yet'}
            />
        }
      </Card>
    </div>
  )
}