import clsx from 'clsx'
import styles from './Input.module.css'

export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  suffix,
  required,
  className,
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={clsx(styles.inputWrap, error && styles.hasError)}>
        {Icon && <Icon size={15} className={styles.icon} />}
        <input
          id={inputId}
          className={clsx(styles.input, Icon && styles.withIcon, suffix && styles.withSuffix)}
          {...props}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}