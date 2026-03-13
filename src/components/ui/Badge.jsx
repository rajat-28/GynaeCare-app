import clsx from 'clsx'
import styles from './Badge.module.css'

export default function Badge({ children, variant = 'default', size = 'md', dot = false }) {
  return (
    <span className={clsx(styles.badge, styles[variant], styles[size])}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  )
}