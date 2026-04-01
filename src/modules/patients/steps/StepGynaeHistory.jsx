import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { CONTRACEPTION_OPTIONS, SURGICAL_HISTORY_OPTIONS } from '../patientData'
import styles from './Step.module.css'

const REGULARITY_OPTS  = ['Regular', 'Irregular', 'Oligomenorrhoea', 'Amenorrhoea']
const MENOPAUSE_OPTS   = ['Pre-menopausal', 'Peri-menopausal', 'Post-menopausal']

function Checkbox({ label, checked, onChange }) {
  return (
    <label className={styles.checkLabel}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

function MultiCheck({ options, selected, onChange, label }) {
  const toggle = val => {
    const next = selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val]
    onChange(next)
  }
  return (
    <div className={styles.multiCheck}>
      {label && <p className={styles.multiCheckLabel}>{label}</p>}
      <div className={styles.checkGrid}>
        {options.map(opt => (
          <label key={opt} className={styles.checkLabel}>
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function StepGynaeHistory({ data, update, errors = {}, onBlur }) {
  return (
    <div>
      <h2 className={styles.stepTitle}>Gynaecological History</h2>
      <p className={styles.stepSub}>Menstrual, obstetric, and surgical background</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Menstrual History</h3>
        <div className={styles.grid3}>
          <Input label="Menarche Age" type="number" min="8" max="20" value={data.menarcheAge} error={errors.menarcheAge}
            onChange={e => update({ menarcheAge: e.target.value })} onBlur={() => onBlur && onBlur('menarcheAge')} placeholder="e.g. 13" suffix="yrs" hint="Range: 8–20 years" />
          <Input label="Cycle Length" type="number" min="21" max="45" value={data.cycleLength} error={errors.cycleLength}
            onChange={e => update({ cycleLength: e.target.value })} onBlur={() => onBlur && onBlur('cycleLength')} placeholder="e.g. 28" suffix="days" hint="Range: 21–45 days" />
          <Input label="Duration of Flow" type="number" value={data.cycleDuration} error={errors.cycleDuration}
            onChange={e => update({ cycleDuration: e.target.value })} onBlur={() => onBlur && onBlur('cycleDuration')} placeholder="e.g. 5" suffix="days" />
        </div>
        <div className={styles.grid2} style={{ marginTop: '1rem' }}>
          <Input label="Last Menstrual Period (LMP)" type="date" max={new Date().toISOString().split('T')[0]} value={data.lmp} error={errors.lmp}
            onChange={e => update({ lmp: e.target.value })} onBlur={() => onBlur && onBlur('lmp')} />
          <Select label="Cycle Regularity" value={data.cycleRegularity} error={errors.cycleRegularity}
            onChange={e => update({ cycleRegularity: e.target.value })} onBlur={() => onBlur && onBlur('cycleRegularity')}
            options={REGULARITY_OPTS} placeholder="Select..." />
        </div>
        <div className={styles.checkRow} style={{ marginTop: '1rem' }}>
          <Checkbox label="Dysmenorrhoea" checked={data.dysmenorrhea}
            onChange={v => update({ dysmenorrhea: v })} />
          <Checkbox label="PMS Symptoms" checked={data.pmsSymptoms}
            onChange={v => update({ pmsSymptoms: v })} />
        </div>
        <div style={{ marginTop: '1rem', maxWidth: 240 }}>
          <Select label="Menopause Status" value={data.menopauseStatus}
            onChange={e => update({ menopauseStatus: e.target.value })}
            options={MENOPAUSE_OPTS} />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Obstetric Score (G P L A)</h3>
        <div className={styles.grid4}>
          <Input label="Gravida (G)" type="number" min="0" value={data.gravida}
            onChange={e => update({ gravida: e.target.value })} placeholder="0" />
          <Input label="Para (P)" type="number" min="0" value={data.para}
            onChange={e => update({ para: e.target.value })} placeholder="0" />
          <Input label="Living (L)" type="number" min="0" value={data.living}
            onChange={e => update({ living: e.target.value })} placeholder="0" />
          <Input label="Abortions (A)" type="number" min="0" value={data.abortions}
            onChange={e => update({ abortions: e.target.value })} placeholder="0" />
        </div>
        <div className={styles.checkRow} style={{ marginTop: '1rem' }}>
          <Checkbox label="Previous C-Section (LSCS)" checked={data.previousCSection}
            onChange={v => update({ previousCSection: v })} />
        </div>
        <div style={{ marginTop: '1rem', maxWidth: 280 }}>
          <Input label="Infertility Duration" value={data.infertilityDuration}
            onChange={e => update({ infertilityDuration: e.target.value })}
            placeholder="e.g. 2 years" hint="Leave blank if not applicable" />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Contraception History</h3>
        <MultiCheck
          options={CONTRACEPTION_OPTIONS}
          selected={data.contraceptionHistory}
          onChange={v => update({ contraceptionHistory: v })}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Surgical History</h3>
        <MultiCheck
          options={SURGICAL_HISTORY_OPTIONS}
          selected={data.surgicalHistory}
          onChange={v => update({ surgicalHistory: v })}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Medical & Allergy History</h3>
        <div className={styles.grid2}>
          <div>
            <label className={styles.textareaLabel}>Medical Conditions</label>
            <textarea className={styles.textarea} rows={3}
              value={data.medicalHistory} placeholder="Diabetes, hypertension, thyroid..."
              onChange={e => update({ medicalHistory: e.target.value })} />
          </div>
          <div>
            <label className={styles.textareaLabel}>Known Allergies</label>
            <textarea className={styles.textarea} rows={3}
              value={data.allergies} placeholder="Drug or food allergies..."
              onChange={e => update({ allergies: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  )
}