import Badge from '@components/ui/Badge'
import styles from './Step.module.css'

function ReviewRow({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className={styles.reviewRow}>
      <span className={styles.reviewLabel}>{label}</span>
      <span className={styles.reviewValue}>{String(value)}</span>
    </div>
  )
}

function ReviewSection({ title, children }) {
  return (
    <div className={styles.reviewSection}>
      <h4 className={styles.reviewSectionTitle}>{title}</h4>
      {children}
    </div>
  )
}

export default function StepReview({ data }) {
  const fullName = `${data.firstName} ${data.lastName}`.trim() || '—'
  return (
    <div>
      <h2 className={styles.stepTitle}>Review & Confirm</h2>
      <p className={styles.stepSub}>Please verify all details before registering</p>

      <div className={styles.reviewGrid}>
        <ReviewSection title="Personal Details">
          <ReviewRow label="Full Name"       value={fullName} />
          <ReviewRow label="Date of Birth"   value={data.dob} />
          <ReviewRow label="Phone"           value={data.phone} />
          <ReviewRow label="Email"           value={data.email} />
          <ReviewRow label="Blood Group"     value={data.bloodGroup} />
          <ReviewRow label="Marital Status"  value={data.maritalStatus} />
          <ReviewRow label="Occupation"      value={data.occupation} />
        </ReviewSection>

        <ReviewSection title="Address">
          <ReviewRow label="Address"  value={data.address} />
          <ReviewRow label="City"     value={data.city} />
          <ReviewRow label="State"    value={data.state} />
          <ReviewRow label="PIN"      value={data.pin} />
        </ReviewSection>

        <ReviewSection title="Menstrual History">
          <ReviewRow label="Menarche Age"    value={data.menarcheAge && `${data.menarcheAge} yrs`} />
          <ReviewRow label="Cycle Length"    value={data.cycleLength && `${data.cycleLength} days`} />
          <ReviewRow label="LMP"             value={data.lmp} />
          <ReviewRow label="Regularity"      value={data.cycleRegularity} />
          <ReviewRow label="Menopause"       value={data.menopauseStatus} />
          <ReviewRow label="Dysmenorrhoea"   value={data.dysmenorrhea ? 'Yes' : null} />
          <ReviewRow label="PMS"             value={data.pmsSymptoms ? 'Yes' : null} />
        </ReviewSection>

        <ReviewSection title="Obstetric Score">
          <ReviewRow label="Gravida"          value={data.gravida} />
          <ReviewRow label="Para"             value={data.para} />
          <ReviewRow label="Living"           value={data.living} />
          <ReviewRow label="Abortions"        value={data.abortions} />
          <ReviewRow label="Previous LSCS"    value={data.previousCSection ? 'Yes' : null} />
          <ReviewRow label="Infertility"      value={data.infertilityDuration} />
        </ReviewSection>

        {data.contraceptionHistory.length > 0 && (
          <ReviewSection title="Contraception History">
            <div className={styles.tagList}>
              {data.contraceptionHistory.map(c => <Badge key={c} variant="default">{c}</Badge>)}
            </div>
          </ReviewSection>
        )}

        {data.surgicalHistory.length > 0 && (
          <ReviewSection title="Surgical History">
            <div className={styles.tagList}>
              {data.surgicalHistory.map(s => <Badge key={s} variant="warning">{s}</Badge>)}
            </div>
          </ReviewSection>
        )}

        {data.partnerName && (
          <ReviewSection title="Partner Profile">
            <ReviewRow label="Name"       value={data.partnerName} />
            <ReviewRow label="Age"        value={data.partnerAge && `${data.partnerAge} yrs`} />
            <ReviewRow label="Occupation" value={data.partnerOccupation} />
          </ReviewSection>
        )}

        <ReviewSection title="Episode">
          <ReviewRow label="Type"        value={data.episodeType} />
          <ReviewRow label="Referred By" value={data.referredBy} />
          <ReviewRow label="Notes"       value={data.notes} />
        </ReviewSection>
      </div>
    </div>
  )
}