import clsx from 'clsx'
import styles from './Input.module.css'
import textareaStyles from './Textarea.module.css'

export default function Textarea({ label, error, hint, required, rows = 4, className, id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={clsx(styles.input, textareaStyles.textarea, error && textareaStyles.error)}
        {...props}
      />
      {error && <p className={styles.error}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}