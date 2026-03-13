import Badge from '@components/ui/Badge'
import styles from './ResultCard.module.css'

export function ResultCard({ children }) {
  return <div className={styles.card}>{children}</div>
}

export function ResultPrimary({ label, value, sub }) {
  return (
    <div className={styles.primary}>
      <div className={styles.primaryLabel}>{label}</div>
      <div className={styles.primaryValue}>{value}</div>
      {sub && <div className={styles.primarySub}>{sub}</div>}
    </div>
  )
}

export function ResultRow({ label, value, badge, badgeVariant = 'default' }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowRight}>
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        {value && <span className={styles.rowValue}>{value}</span>}
      </div>
    </div>
  )
}

export function ResultDivider() {
  return <hr className={styles.divider}/>
}

export function ResultDisclaimer({ text }) {
  return <p className={styles.disclaimer}>⚕ {text}</p>
}