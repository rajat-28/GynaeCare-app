import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save, Calculator } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Badge from '@components/ui/Badge'
import { pregnancyApi, patientApi } from '@services/api'
import { RISK_FLAGS, VACCINES } from './pregnancyData'
import { calculateEDD, calculatePregnancyWeek } from '@utils/calculators'
import styles from './PregnancyNew.module.css'

export default function PregnancyNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientIdParams = searchParams.get('patientId')
  const episodeIdParams = searchParams.get('episodeId')

  const [form, setForm] = useState({
    patientSearch: '',
    selectedPatientId: '',

    lmp: '',
    cycleLength: '28',
    eddOverride: '',

    gravida: '',
    para: '',
    abortions: '',

    risks: {},
    vaccines: [],
    notes: '',
  })

  const [patientResults, setPatientResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fixedPatient, setFixedPatient] = useState(false)

  useEffect(() => {
    if (patientIdParams) {
      patientApi.getById(patientIdParams).then(res => {
        const p = res.data?.data || res.data
        set({
          selectedPatientId: p.id,
          patientSearch: `${p.name} (${p.phone})`,
        })
        setFixedPatient(true)
      }).catch(console.error)
    }
  }, [patientIdParams])

  const set = f => setForm(d => ({ ...d, ...f }))

  const edd = form.lmp
    ? calculateEDD(form.lmp, Number(form.cycleLength) || 28)
    : null

  const pgWeek = form.lmp
    ? calculatePregnancyWeek(form.lmp)
    : null

  const toggleRisk = key =>
    set({ risks: { ...form.risks, [key]: !form.risks[key] } })

  const toggleVaccine = val =>
    set({
      vaccines: form.vaccines.includes(val)
        ? form.vaccines.filter(v => v !== val)
        : [...form.vaccines, val]
    })

  const handlePatientSearch = async (value) => {
    set({ patientSearch: value })
    setShowDropdown(true)

    if (value.length < 2) {
      setPatientResults([])
      return
    }

    try {
      const res = await patientApi.search(value)
      const results = res.data?.data || res.data
      setPatientResults(Array.isArray(results) ? results : [])
    } catch (err) {
      console.error(err)
    }
  }

  const selectPatient = (p) => {
    set({
      selectedPatientId: p.id,
      patientSearch: `${p.name} (${p.phone})`,
    })
    setPatientResults([])
    setShowDropdown(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')

    if (!form.selectedPatientId) {
      setError('Select a valid patient')
      setSaving(false)
      return
    }

    try {
      const payload = {
        patientId: form.selectedPatientId,
        episodeId: episodeIdParams || undefined,

        lmp: form.lmp || undefined,
        edd: form.eddOverride || edd || undefined,

        gravida: form.gravida ? Number(form.gravida) : undefined,
        para: form.para ? Number(form.para) : undefined,
        abortions: form.abortions ? Number(form.abortions) : undefined,

        notes: form.notes || undefined,

        risks: Object.keys(form.risks).filter(k => form.risks[k]),
        vaccines: form.vaccines,
      }

      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

      await pregnancyApi.create(payload)

      navigate('/pregnancy')

    } catch (err) {
      const msg = err.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create pregnancy')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container" onClick={() => setShowDropdown(false)}>
      <button className={styles.backBtn} onClick={() => navigate('/pregnancy')}>
        <ArrowLeft size={16} /> Back to Pregnancy
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>
      )}

      <div className={styles.layout}>
        <div className={styles.left}>

          {/* Patient Search */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Patient</h3>

            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <Input
                label="Patient (Name / Phone)"
                value={form.patientSearch}
                onChange={e => !fixedPatient && handlePatientSearch(e.target.value)}
                onFocus={() => !fixedPatient && setShowDropdown(true)}
                disabled={fixedPatient}
              />

              {showDropdown && patientResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  zIndex: 10,
                  maxHeight: 200,
                  overflowY: 'auto'
                }}>
                  {patientResults.map(p => (
                    <div
                      key={p.id}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                      onClick={() => selectPatient(p)}
                    >
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{p.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Dating */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Dating</h3>

            <div className={styles.grid2}>
              <Input
                label="Last Menstrual Period (LMP)"
                type="date"
                value={form.lmp}
                onChange={e => set({ lmp: e.target.value })}
              />

              <Input
                label="Cycle Length"
                type="number"
                value={form.cycleLength}
                onChange={e => set({ cycleLength: e.target.value })}
              />

              <Input
                label="EDD Override (Manual)"
                type="date"
                value={form.eddOverride}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => set({ eddOverride: e.target.value })}
                style={{ gridColumn: 1 }}
              />
            </div>

            {edd && (
              <div className={styles.eddBox}>
                <Calculator size={16} />
                <div>
                  <div className={styles.eddLabel}>Auto-calculated EDD</div>
                  <div className={styles.eddValue}>{edd}</div>
                </div>
                <Badge variant="primary">{pgWeek}</Badge>
              </div>
            )}
          </Card>

          {/* Obstetric */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Obstetric Score</h3>

            <div className={styles.grid3}>
              <Input
                label="Gravida"
                type="number"
                value={form.gravida}
                onChange={e => set({ gravida: e.target.value })}
              />
              <Input
                label="Para"
                type="number"
                value={form.para}
                onChange={e => set({ para: e.target.value })}
              />
              <Input
                label="Abortions"
                type="number"
                value={form.abortions}
                onChange={e => set({ abortions: e.target.value })}
              />
            </div>
          </Card>

          {/* Vaccines */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Vaccines</h3>

            <div className={styles.chipGrid}>
              {VACCINES.map(v => (
                <button
                  key={v}
                  className={`${styles.chip} ${form.vaccines.includes(v) ? styles.chipActive : ''}`}
                  onClick={() => toggleVaccine(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Clinical Notes</h3>

            <textarea
              className={styles.textarea}
              rows={4}
              value={form.notes}
              onChange={e => set({ notes: e.target.value })}
            />
          </Card>
        </div>

        {/* Risk Flags */}
        <div className={styles.right}>
          <Card padding="md" className={styles.stickyCard}>
            <h3 className={styles.cardTitle}>Risk Flags</h3>

            <div className={styles.riskList}>
              {RISK_FLAGS.map(r => (
                <label
                  key={r.key}
                  className={`${styles.riskItem} ${form.risks[r.key] ? styles.riskActive : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={!!form.risks[r.key]}
                    onChange={() => toggleRisk(r.key)}
                    className={styles.riskCheck}
                  />
                  <span className={styles.riskLabel}>{r.label}</span>
                  {form.risks[r.key] && (
                    <Badge variant={r.color} size="sm">Flagged</Badge>
                  )}
                </label>
              ))}
            </div>

            <Button fullWidth icon={Save} loading={saving} onClick={handleSubmit}>
              {saving ? 'Saving...' : 'Register Pregnancy'}
            </Button>

            <Button
              fullWidth
              variant="secondary"
              className={styles.cancelBtn}
              onClick={() => navigate('/pregnancy')}
            >
              Cancel
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}