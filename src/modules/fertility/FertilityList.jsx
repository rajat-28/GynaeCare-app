import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, FlaskConical, Calendar, Activity, CheckCircle } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { episodeApi } from '@services/api'
import styles from './Fertility.module.css'

const CYCLE_STAGES = ['Stimulation','Monitoring','Egg Retrieval','Fertilisation','Embryo Transfer','Luteal Support','Outcome']
const STAGE_VARIANT  = { 'Stimulation':'default','Monitoring':'warning','Egg Retrieval':'teal','Fertilisation':'primary','Embryo Transfer':'primary','Luteal Support':'teal','Outcome':'success' }

export default function FertilityList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await episodeApi.getAll('fertility')
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
    const cycle = e.fertilityCycle
    
    if (!patientMap[rawPatientId]) {
      patientMap[rawPatientId] = {
        id: e.id,
        rawPatientId,
        patientName: e.patient.name || 'Unknown',
        patientId: e.patient.id?.slice(0, 8) || '—',
        cycleNo: cycle?.cycleNumber || 1,
        protocol: cycle?.treatmentType || '—',
        startDate: cycle?.cycleStartDate || cycle?.createdAt,
        stage: cycle?.status === 'ongoing' ? 'Monitoring' : 'Outcome', // Simple inference
        outcome: cycle?.outcome || '—',
        status: cycle?.status || 'ongoing'
      }
    }
  })
  const tableData = Object.values(patientMap)

  // Stats
  const activeCycles = episodes.filter(e => e.fertilityCycle?.status === 'ongoing').length
  const totalCompleted = episodes.filter(e => e.fertilityCycle?.status === 'completed').length
  const successfulOutcomes = episodes.filter(e => e.fertilityCycle?.outcome?.toLowerCase().includes('pregnant') || e.fertilityCycle?.outcome?.toLowerCase().includes('positive')).length
  const successRate = totalCompleted > 0 ? Math.round((successfulOutcomes / totalCompleted) * 100) : 0
  
  const now = new Date()
  const cyclesThisYear = episodes.filter(e => new Date(e.createdAt).getFullYear() === now.getFullYear()).length

  const COLUMNS = [
    {
      key: 'patientName', label: 'Patient',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={styles.avatar}>{val.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div className={styles.name}>{val}</div>
            <div className={styles.sub}>Cycle #{row.cycleNo}</div>
          </div>
        </div>
      )
    },
    { key: 'protocol', label: 'Protocol', render: v => <span className={styles.sub}>{v.replace(/_/g, ' ')}</span> },
    { key: 'startDate', label: 'Started', render: v => <span className={styles.sub}>{new Date(v).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span> },
    { key: 'stage', label: 'Stage', render: v => <Badge variant={STAGE_VARIANT[v] || 'default'}>{v}</Badge> },
    { key: 'outcome', label: 'Outcome', render: v => <span className={styles.outcome}>{v}</span> },
    { 
      key: 'status', label: 'Status', align: 'center',
      render: v => <Badge variant={v === 'ongoing' ? 'warning' : v === 'completed' ? 'success' : 'default'} dot>{v}</Badge> 
    }
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Fertility & IVF</h1>
          <p className={styles.pageSub}>Cycle tracking and outcomes</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/fertility/new')}>New Cycle</Button>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: 'Active Cycles',      value: loading ? '...' : activeCycles,     color: 'var(--clr-primary-600)' },
          { label: 'Success Rate',       value: loading ? '...' : `${successRate}%`, color: 'var(--clr-accent-600)'  },
          { label: 'Cycles This Year',   value: loading ? '...' : cyclesThisYear,    color: 'var(--clr-teal-600)'    },
          { label: 'Outcomes Recorded',   value: loading ? '...' : totalCompleted,    color: 'var(--clr-warning-500)' },
        ].map(s => (
          <Card key={s.label} padding="sm" className={styles.statCard}>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card padding="md" className={styles.pipelineCard}>
        <h3 className={styles.sectionTitle}>Cycle Stage Pipeline</h3>
        <div className={styles.pipeline}>
          {CYCLE_STAGES.map((stage, i) => {
            // Count active cycles at this stage
            // This is a placeholder logic since we don't have a strict 'stage' field yet.
            // In a real app, you'd check a 'current_stage' field or latest follicular study.
            const count = tableData.filter(d => d.stage === stage && d.status === 'ongoing').length
            return (
              <div key={stage} className={styles.pipelineStage}>
                <div className={styles.pipelineNum}>{i+1}</div>
                <div className={styles.pipelineName}>{stage}</div>
                {count > 0 && <Badge variant="warning">{count}</Badge>}
              </div>
            )
          })}
        </div>
      </Card>

      <Card padding="none">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon}/>
            <input className={styles.searchInput}
              placeholder="Search patient, protocol..."
              value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <Table 
          columns={COLUMNS} 
          data={tableData}
          onRowClick={row => navigate(`/fertility/patient/${row.rawPatientId}`)}
          emptyMessage={loading ? "Loading..." : "No cycles found"}
        />
      </Card>
    </div>
  )
}
