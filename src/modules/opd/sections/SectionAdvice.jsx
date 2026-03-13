import { ADVICE_TEMPLATES, FOLLOW_UP_PERIODS } from '../opdData'
import Select from '@components/ui/Select'
import styles from './Section.module.css'

export default function SectionAdvice({ data, update }) {
  const toggle = val => {
    const next = data.advice.includes(val)
      ? data.advice.filter(v => v !== val)
      : [...data.advice, val]
    update({ advice: next })
  }

  return (
    <div>
      <h2 className={styles.title}>Advice & Follow-up</h2>
      <p className={styles.sub}>Patient instructions and next visit</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Advice</h3>
        <div className={styles.chipGrid}>
          {ADVICE_TEMPLATES.map(a => (
            <button key={a}
              className={`${styles.chip} ${data.advice.includes(a) ? styles.chipActive : ''}`}
              onClick={() => toggle(a)}>{a}</button>
          ))}
        </div>
        <div style={{marginTop:'var(--space-4)'}}>
          <label className={styles.textareaLabel}>Additional advice</label>
          <textarea className={styles.textarea} rows={3}
            value={data.adviceNote} onChange={e => update({ adviceNote: e.target.value })}
            placeholder="Lifestyle, diet, activity instructions..."/>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Follow-up</h3>
        <div className={styles.grid2}>
          <Select label="Follow-up in" value={data.followUp}
            onChange={e => update({ followUp: e.target.value })}
            options={FOLLOW_UP_PERIODS} placeholder="Select period"/>
          <div/>
        </div>
        <div style={{marginTop:'var(--space-4)'}}>
          <label className={styles.textareaLabel}>Follow-up instructions</label>
          <textarea className={styles.textarea} rows={2}
            value={data.followUpNote} onChange={e => update({ followUpNote: e.target.value })}
            placeholder="Come with reports, fasting required..."/>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Doctor's Notes</h3>
        <textarea className={styles.textarea} rows={4}
          value={data.doctorNote} onChange={e => update({ doctorNote: e.target.value })}
          placeholder="Private clinical notes, observations..."/>
      </div>
    </div>
  )
}