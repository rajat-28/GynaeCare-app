import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Calculator } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Badge from '@components/ui/Badge'
import { RISK_FLAGS, VACCINES } from './pregnancyData'
import { calculateEDD, calculatePregnancyWeek } from '@utils/calculators'
import styles from './PregnancyNew.module.css'

export default function PregnancyNew() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    patientId: 'P001', patientName: 'Priya Sharma',
    lmp: '', cycleLength: '28', eddOverride: '',
    gravida: '', para: '', abortions: '',
    risks: {}, vaccines: [],
    notes: '',
  })

  const set = f => setForm(d => ({ ...d, ...f }))

  const edd    = form.lmp ? calculateEDD(form.lmp, Number(form.cycleLength) || 28) : null
  const pgWeek = form.lmp ? calculatePregnancyWeek(form.lmp) : null

  const toggleRisk    = key  => set({ risks:    { ...form.risks, [key]: !form.risks[key] } })
  const toggleVaccine = val  => set({ vaccines: form.vaccines.includes(val)
    ? form.vaccines.filter(v => v !== val) : [...form.vaccines, val] })

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate('/pregnancy')}>
        <ArrowLeft size={16}/> Back to Pregnancy
      </button>

      <div className={styles.layout}>
        {/* Left column */}
        <div className={styles.left}>

          {/* Patient */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Patient</h3>
            <div className={styles.grid2}>
              <Input label="Patient ID" value={form.patientId}
                onChange={e => set({ patientId: e.target.value })}/>
              <Input label="Patient Name" value={form.patientName}
                onChange={e => set({ patientName: e.target.value })}/>
            </div>
          </Card>

          {/* Dates */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Dating</h3>
            <div className={styles.grid2}>
              <Input label="Last Menstrual Period (LMP)" required type="date"
                value={form.lmp} onChange={e => set({ lmp: e.target.value })}/>
              <Input label="Cycle Length" type="number"
                value={form.cycleLength} onChange={e => set({ cycleLength: e.target.value })}
                suffix="days" hint="Default 28 days"/>
            </div>

            {/* Auto-calculated EDD */}
            {edd && (
              <div className={styles.eddBox}>
                <Calculator size={16} className={styles.eddIcon}/>
                <div>
                  <div className={styles.eddLabel}>Auto-calculated EDD</div>
                  <div className={styles.eddValue}>{edd}</div>
                </div>
                <Badge variant="primary">{pgWeek}</Badge>
              </div>
            )}

            <div style={{ marginTop: 'var(--space-4)', maxWidth: 220 }}>
              <Input label="EDD Override (if ultrasound differs)" type="date"
                value={form.eddOverride} onChange={e => set({ eddOverride: e.target.value })}
                hint="Leave blank to use calculated EDD"/>
            </div>
          </Card>

          {/* Obstetric */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Obstetric Score</h3>
            <div className={styles.grid3}>
              {[['gravida','Gravida (G)'],['para','Para (P)'],['abortions','Abortions (A)']].map(([k,l]) => (
                <Input key={k} label={l} type="number" min="0"
                  value={form[k]} onChange={e => set({ [k]: e.target.value })} placeholder="0"/>
              ))}
            </div>
          </Card>

          {/* Vaccines */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Vaccines</h3>
            <div className={styles.chipGrid}>
              {VACCINES.map(v => (
                <button key={v}
                  className={`${styles.chip} ${form.vaccines.includes(v) ? styles.chipActive : ''}`}
                  onClick={() => toggleVaccine(v)}>{v}
                </button>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Clinical Notes</h3>
            <textarea className={styles.textarea} rows={4}
              placeholder="Any relevant history, concerns, notes..."
              value={form.notes} onChange={e => set({ notes: e.target.value })}/>
          </Card>
        </div>

        {/* Right column — Risk flags */}
        <div className={styles.right}>
          <Card padding="md" className={styles.stickyCard}>
            <h3 className={styles.cardTitle}>Risk Flags</h3>
            <p className={styles.riskSub}>System will auto-flag based on vitals. Manual override below.</p>
            <div className={styles.riskList}>
              {RISK_FLAGS.map(r => (
                <label key={r.key} className={`${styles.riskItem} ${form.risks[r.key] ? styles.riskActive : ''}`}>
                  <input type="checkbox" checked={!!form.risks[r.key]}
                    onChange={() => toggleRisk(r.key)} className={styles.riskCheck}/>
                  <span className={styles.riskLabel}>{r.label}</span>
                  {form.risks[r.key] && <Badge variant={r.color} size="sm">Flagged</Badge>}
                </label>
              ))}
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <Button fullWidth icon={Save}
                onClick={() => { alert('Pregnancy registered!'); navigate('/pregnancy') }}>
                Register Pregnancy
              </Button>
              <Button fullWidth variant="secondary" className={styles.cancelBtn}
                onClick={() => navigate('/pregnancy')}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}