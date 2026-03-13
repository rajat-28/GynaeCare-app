import clsx from 'clsx'
import styles from './Card.module.css'

export function Card({ children, className, padding = 'md', hover = false, ...props }) {
  return (
    <div className={clsx(styles.card, styles[`p-${padding}`], hover && styles.hover, className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className, action }) {
  return (
    <div className={clsx(styles.header, className)}>
      <div className={styles.headerContent}>{children}</div>
      {action && <div className={styles.headerAction}>{action}</div>}
    </div>
  )
}

export function CardTitle({ children, className }) {
  return <h3 className={clsx(styles.title, className)}>{children}</h3>
}

export function CardBody({ children, className }) {
  return <div className={clsx(styles.body, className)}>{children}</div>
}