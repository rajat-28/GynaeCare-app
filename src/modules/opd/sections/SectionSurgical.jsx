import { SURGICAL_HISTORY_OPTIONS } from '../opdData'
import styles from './Section.module.css'

export default function SectionSurgical({ data, update }) {
  const toggle = val => {
    const next = data.surgicalHistory.includes(val)
      ? data.surgicalHistory.filter(v => v !== val)
      : [...data.surgicalHistory, val]
    update({ surgicalHistory: next })
  }
  return (
    <div>
      <h2 className={styles.title}>Surgical History</h2>
      <p className={styles.sub}>Select all previous surgeries</p>
      <div className={styles.chipGrid}>
        {SURGICAL_HISTORY_OPTIONS.map(s => (
          <button key={s}
            className={`${styles.chip} ${data.surgicalHistory.includes(s) ? styles.chipActive : ''}`}
            onClick={() => toggle(s)}>{s}</button>
        ))}
      </div>
      <div style={{ marginTop: 'var(--space-5)' }}>
        <label className={styles.textareaLabel}>Additional surgical notes</label>
        <textarea className={styles.textarea} rows={3} placeholder="Dates, complications, details..."
          value={data.surgicalNote} onChange={e => update({ surgicalNote: e.target.value })}/>
      </div>
    </div>
  )
}