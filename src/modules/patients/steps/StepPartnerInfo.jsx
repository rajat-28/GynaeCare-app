import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { EPISODE_TYPES } from '../patientData'
import styles from './Step.module.css'

export default function StepPartnerInfo({ data, update, errors = {}, onBlur }) {
  return (
    <div>
      <h2 className={styles.stepTitle}>Partner Profile & Episode</h2>
      <p className={styles.stepSub}>Required for fertility cases. Select episode type.</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Partner Information</h3>
        <p className={styles.sectionHint}>Fill only if applicable (fertility / IVF cases)</p>
        <div className={styles.grid2}>
          <Input label="Partner Name" value={data.partnerName} error={errors.partnerName}
            onChange={e => update({ partnerName: e.target.value })} onBlur={() => onBlur && onBlur('partnerName')} placeholder="Full name" />
          <Input label="Partner Age" type="number" min="18" max="80" value={data.partnerAge} error={errors.partnerAge}
            onChange={e => update({ partnerAge: e.target.value })} onBlur={() => onBlur && onBlur('partnerAge')} placeholder="Age in years" suffix="yrs" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Input label="Partner Occupation" value={data.partnerOccupation} error={errors.partnerOccupation}
            onChange={e => update({ partnerOccupation: e.target.value })} onBlur={() => onBlur && onBlur('partnerOccupation')} placeholder="Profession or job" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label className={styles.textareaLabel}>Partner Medical History</label>
          <textarea className={styles.textarea} rows={3}
            value={data.partnerMedicalHistory}
            placeholder="Relevant medical conditions, medications..."
            onChange={e => update({ partnerMedicalHistory: e.target.value })} />
        </div>
        <div style={{ marginTop: '1rem', maxWidth: 320 }}>
          <Input label="Semen Analysis Reference" value={data.semenAnalysisRef}
            onChange={e => update({ semenAnalysisRef: e.target.value })}
            placeholder="Lab report ID / reference" hint="Optional" />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Clinical Episode</h3>
        <div className={styles.grid2}>
          <Select
  label="Episode Type" required
  value={data.episodeType}
  onChange={e => update({ episodeType: e.target.value })}
  options={EPISODE_TYPES}  // { value, label } objects
/>
          <Input label="Referred By" value={data.referredBy}
            onChange={e => update({ referredBy: e.target.value })} placeholder="Doctor / source" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label className={styles.textareaLabel}>Additional Notes</label>
          <textarea className={styles.textarea} rows={3}
            value={data.notes}
            placeholder="Chief complaint, reason for visit..."
            onChange={e => update({ notes: e.target.value })} />
        </div>
      </div>
    </div>
  )
}