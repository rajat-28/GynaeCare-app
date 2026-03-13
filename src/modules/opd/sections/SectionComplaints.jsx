import { CHIEF_COMPLAINTS } from '../opdData'
import styles from './Section.module.css'

export default function SectionComplaints({ data, update }) {
  const toggle = val => {
    const next = data.complaints.includes(val)
      ? data.complaints.filter(c => c !== val)
      : [...data.complaints, val]
    update({ complaints: next })
  }
  return (
    <div>
      <h2 className={styles.title}>Chief Complaints</h2>
      <p className={styles.sub}>Select all that apply or type in the notes below</p>
      <div className={styles.chipGrid}>
        {CHIEF_COMPLAINTS.map(c => (
          <button key={c} className={`${styles.chip} ${data.complaints.includes(c) ? styles.chipActive : ''}`}
            onClick={() => toggle(c)}>{c}</button>
        ))}
      </div>
      <div style={{ marginTop: 'var(--space-5)' }}>
        <label className={styles.textareaLabel}>Additional complaint notes</label>
        <textarea className={styles.textarea} rows={3} placeholder="Describe in detail..."
          value={data.complaintsNote} onChange={e => update({ complaintsNote: e.target.value })}/>
      </div>
    </div>
  )
}