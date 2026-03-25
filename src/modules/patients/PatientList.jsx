import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Search, Filter, Phone, Calendar, AlertCircle } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { patientApi } from '@services/api'
import styles from './PatientList.module.css'

const EPISODE_VARIANT = {
  opd: 'default',
  pregnancy: 'primary',
  fertility: 'teal',
  ultrasound: 'warning',
  procedure: 'danger',
  lab: 'success',
}

const EPISODE_LABEL = {
  opd: 'OPD',
  pregnancy: 'Pregnancy',
  fertility: 'Fertility',
  ultrasound: 'Ultrasound',
  procedure: 'Procedure',
  lab: 'Lab',
}

export default function PatientList() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

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

  // Derived list with search, filtering, and sorting applied
  const displayPatients = useMemo(() => {
    let list = [...patients]

    // 1. Search (Name includes, Phone startsWith)
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(p =>
        (p.name?.toLowerCase().includes(q)) ||
        (p.phone?.startsWith(q))
      )
    }

    // 2. Filter by Episode Type
    if (filterType !== 'all') {
      list = list.filter(p => p.episodes?.some(e => e.type === filterType))
    }

    // 3. Sort
    // 3. Sort
    return list.sort((a, b) => {
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '')
      if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '')

      // Activity-based sorting
      const getActivity = (p) => {
        let max = new Date(p.createdAt || 0).getTime()
        if (p.episodes) {
          p.episodes.forEach(e => {
            const ed = new Date(e.createdAt || 0).getTime()
            if (ed > max) max = ed
            if (e.consultations) {
              e.consultations.forEach(c => {
                const cd = new Date(c.createdAt || 0).getTime()
                if (cd > max) max = cd
              })
            }
          })
        }
        return max
      }

      const actA = getActivity(a)
      const actB = getActivity(b)

      if (sortBy === 'newest') return actB - actA
      if (sortBy === 'oldest') return actA - actB
      return 0
    })
  }, [patients, search, filterType, sortBy])

  const COLUMNS = [
    {
      key: 'name', label: 'Patient',
      render: (val, row) => (
        <div className={styles.patientCell}>
          <div className={styles.avatar}>
            {val?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className={styles.patientName}>{val}</div>
          </div>
        </div>
      )
    },
    { key: 'age', label: 'Age', render: v => v ? `${v} yrs` : '—' },
    {
      key: 'phone', label: 'Phone',
      render: v => v
        ? <span className={styles.phone}><Phone size={12} /> {v}</span>
        : '—'
    },
    {
      key: 'interactions', label: 'Last Interaction',
      render: (_, row) => {
        let lastVisit = null
        let lastEp = null

        if (row.episodes && row.episodes.length > 0) {
          // Episodes are sorted DESC, so first one is latest created
          lastEp = row.episodes[0]

          row.episodes.forEach(ep => {
            // Priority 1: consultations
            if (ep.consultations && ep.consultations.length > 0) {
              const d = new Date(ep.consultations[0].createdAt)
              if (!lastVisit || d > lastVisit) lastVisit = d
            }
            // Priority 2: episode creation itself (as a fallback or for non-consultation visits)
            const ed = new Date(ep.createdAt)
            if (!lastVisit || ed > lastVisit) lastVisit = ed
          })
        }

        return (
          <div className={styles.interactionCell}>
            <div className={styles.visitLine}>
              <span className={styles.interactionLabel}>Visit: </span>
              {lastVisit
                ? <span className={styles.dateText}>{lastVisit.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                : <span className={styles.textMuted}>—</span>
              }
            </div>
            <div className={styles.episodeLine}>
              <span className={styles.interactionLabel}>Ep: </span>
              {lastEp
                ? <span className={styles.epValue}>{EPISODE_LABEL[lastEp.type] || lastEp.type}</span>
                : <span className={styles.textMuted}>—</span>
              }
            </div>
          </div>
        )
      }
    },
    {
      key: 'episodes', label: 'Add Episode',
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/patients/${row.id}/episodes/new`)
          }}
          style={{ padding: '0 16px', height: '24px', fontSize: '15px', minWidth: 'auto' }}
        >
          Add
        </Button>
      )
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
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Patients', value: patients.length, color: 'var(--clr-primary-600)' },
          // { label: 'Active Episodes', value: patients.filter(p => p.episodes?.length > 0).length, color: 'var(--clr-teal-600)' },
          {
            label: 'Registered Today', value: patients.filter(p => {
              if (!p.createdAt) return false
              const today = new Date().toDateString()
              return new Date(p.createdAt).toDateString() === today
            }).length, color: 'var(--clr-accent-600)'
          },
          {
            label: 'This Month', value: patients.filter(p => {
              if (!p.createdAt) return false
              const d = new Date(p.createdAt)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length, color: 'var(--clr-warning-500)'
          },
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
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            icon={Filter}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </Button>
        </div>

        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterSection}>
              {/* Sort */}
              <div className={styles.filterGroup}>
                <div className={styles.filterHeading}>Sort By</div>
                <select
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                </select>
              </div>

              {/* Episode Type */}
              <div className={styles.filterGroup}>
                <div className={styles.filterHeading}>Episode Type</div>
                <div className={styles.filterChips}>
                  {['all', ...Object.keys(EPISODE_LABEL)].map(type => (
                    <button
                      key={type}
                      className={`${styles.filterChip} ${filterType === type ? styles.chipActive : ''}`}
                      onClick={() => setFilterType(type)}
                    >
                      {type === 'all' ? 'All' : EPISODE_LABEL[type]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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