import clsx from 'clsx'
import styles from './Input.module.css' /* reuses Input styles */
import selectStyles from './Select.module.css'

export default function Select({
  label, error, hint, required,
  options = [], placeholder = 'Select...',
  className, id, ...props
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
      <div className={styles.inputWrap}>
        <select id={inputId} className={clsx(styles.input, selectStyles.select)} {...props}>
          <option value="">{placeholder}</option>
          {options.map(opt =>
            typeof opt === 'string'
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}