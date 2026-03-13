import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, AlertTriangle, Baby } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import { useState } from 'react'
import { ANC_SYMPTOMS, ANC_INVESTIGATIONS, MILESTONE_SCANS } from './pregnancyData'
import styles from './ANCVisit.module.css'

const MOCK_VISITS = [
  { id:1, week:'6W 2D',  date:'15 Jan 2026', bp:'110/70', weight:'58',  hb:'11.2', sugar:'92',  fetalMovement:'NA',     notes:'Dating scan done. FHR 156 bpm.' },
  { id:2, week:'10W 0D', date:'12 Feb 2026', bp:'112/72', weight:'58.5',hb:'11.0', sugar:'88',  fetalMovement:'NA',     notes:'NT scan ordered. Normal.' },
]

export default function ANCVisit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showForm, setShowForm]   = useState(false)
  const [symptoms, setSymptoms]   = useState([])
  const [newVisit, setNewVisit]   = useState({
    bp:'', weight:'', hb:'', sugar:'', fetalMovement:'', notes:''
  })

  const toggleSymptom = s => setSymptoms(prev =>
    prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s])

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate('/pregnancy')}>
        <ArrowLeft size={16}/> Back to Pregnancy
      </button>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar}>DP</div>
          <div>
            <h1 className={styles.name}>Deepa Nair</h1>
            <div className={styles.meta}>
              <span>ID: PR003</span>
              <span>·</span>
              <span>26 yrs</span>
              <span>·</span>
              <span>LMP: 10 Sep 2025</span>
              <span>·</span>
              <span className={styles.weeks}>26W 3D</span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.eddChip}>
            <Baby size={14}/>
            <span>EDD: 17 Jun 2026</span>
          </div>
          <Badge variant="danger" dot>High Risk</Badge>
          <Button icon={Plus} size="sm" onClick={() => setShowForm(s=>!s)}>
            Add ANC Visit
          </Button>
        </div>
      </div>

      {/* Risk flags */}
      <div className={styles.riskBanner}>
        <AlertTriangle size={15} className={styles.riskIcon}/>
        <strong>Risk Flags:</strong>
        <Badge variant="danger">Pre-eclampsia</Badge>
        <Badge variant="warning">Anaemia</Badge>
      </div>

      {/* Milestone tracker */}
      <Card padding="md" className={styles.milestoneCard}>
        <h3 className={styles.sectionTitle}>Milestone Scans</h3>
        <div className={styles.milestones}>
          {MILESTONE_SCANS.map((m, i) => {
            const done = i < 2
            return (
              <div key={m.week} className={`${styles.milestone} ${done ? styles.milestoneDone : ''}`}>
                <div className={styles.milestoneWeek}>{m.week}w</div>
                <div className={styles.milestoneDot}/>
                <div className={styles.milestoneScan}>{m.scan}</div>
                {done && <Badge variant="success" size="sm">Done</Badge>}
              </div>
            )
          })}
        </div>
      </Card>

      {/* New visit form */}
      {showForm && (
        <Card padding="md" className={styles.visitForm}>
          <h3 className={styles.sectionTitle}>New ANC Visit</h3>
          <div className={styles.grid4}>
            <Input label="Blood Pressure" value={newVisit.bp}
              onChange={e=>setNewVisit(v=>({...v,bp:e.target.value}))} placeholder="120/80" suffix="mmHg"/>
            <Input label="Weight" type="number" value={newVisit.weight}
              onChange={e=>setNewVisit(v=>({...v,weight:e.target.value}))} placeholder="60" suffix="kg"/>
            <Input label="Haemoglobin" type="number" value={newVisit.hb}
              onChange={e=>setNewVisit(v=>({...v,hb:e.target.value}))} placeholder="11.5" suffix="g/dL"/>
            <Input label="Blood Sugar" type="number" value={newVisit.sugar}
              onChange={e=>setNewVisit(v=>({...v,sugar:e.target.value}))} placeholder="90" suffix="mg/dL"/>
          </div>
          <div style={{marginTop:'var(--space-4)'}}>
            <p className={styles.symptomLabel}>Symptoms reported</p>
            <div className={styles.chipGrid}>
              {ANC_SYMPTOMS.map(s => (
                <button key={s}
                  className={`${styles.chip} ${symptoms.includes(s) ? styles.chipActive : ''}`}
                  onClick={() => toggleSymptom(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{marginTop:'var(--space-4)'}}>
            <Input label="Fetal Movement" value={newVisit.fetalMovement}
              onChange={e=>setNewVisit(v=>({...v,fetalMovement:e.target.value}))}
              placeholder="Good / Reduced / Not felt yet" />
          </div>
          <div style={{marginTop:'var(--space-4)'}}>
            <label className={styles.symptomLabel}>Visit Notes</label>
            <textarea className={styles.textarea} rows={3}
              value={newVisit.notes} placeholder="Ultrasound findings, medications, advice..."
              onChange={e=>setNewVisit(v=>({...v,notes:e.target.value}))}/>
          </div>
          <div className={styles.formFooter}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={() => { alert('Visit saved!'); setShowForm(false) }}>Save Visit</Button>
          </div>
        </Card>
      )}

      {/* Visit history */}
      <Card padding="none">
        <div className={styles.visitHeader}>
          <h3 className={styles.sectionTitle} style={{margin:0}}>ANC Visit History</h3>
          <Badge variant="default">{MOCK_VISITS.length} visits recorded</Badge>
        </div>
        <div className={styles.visitList}>
          {MOCK_VISITS.map(v => (
            <div key={v.id} className={styles.visitRow}>
              <div className={styles.visitWeek}>{v.week}</div>
              <div className={styles.visitDate}>{v.date}</div>
              <div className={styles.visitVitals}>
                <span>BP: <strong>{v.bp}</strong></span>
                <span>Wt: <strong>{v.weight} kg</strong></span>
                <span>Hb: <strong>{v.hb}</strong></span>
                <span>Sugar: <strong>{v.sugar}</strong></span>
              </div>
              <div className={styles.visitNotes}>{v.notes}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}