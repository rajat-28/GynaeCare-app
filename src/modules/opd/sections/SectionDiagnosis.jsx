import { DIAGNOSIS_LIST } from '../opdData'
import styles from './Section.module.css'

export default function SectionDiagnosis({ data, update }) {
  const toggle = val => {
    const next = data.diagnosis.includes(val)
      ? data.diagnosis.filter(d => d !== val)
      : [...data.diagnosis, val]
    update({ diagnosis: next })
  }
  return (
    <div>
      <h2 className={styles.title}>Diagnosis</h2>
      <p className={styles.sub}>Select all applicable diagnoses</p>
      <div className={styles.chipGrid}>
        {DIAGNOSIS_LIST.map(d => (
          <button key={d}
            className={`${styles.chip} ${data.diagnosis.includes(d) ? styles.chipActive : ''}`}
            onClick={() => toggle(d)}>{d}</button>
        ))}
      </div>
      <div style={{marginTop:'var(--space-5)'}}>
        <label className={styles.textareaLabel}>Diagnosis notes / differential</label>
        <textarea className={styles.textarea} rows={3}
          value={data.diagnosisNote} onChange={e => update({ diagnosisNote: e.target.value })}
          placeholder="Additional clinical notes..."/>
      </div>
    </div>
  )
}