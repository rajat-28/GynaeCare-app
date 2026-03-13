import { BookmarkPlus, RotateCcw } from 'lucide-react'
import Button from '@components/ui/Button'
import styles from './CalcShell.module.css'

export default function CalcShell({ title, icon: Icon, color = 'primary', children, result, onReset, onSave }) {
  return (
    <div className={styles.shell}>
      {/* Input panel */}
      <div className={styles.inputPanel}>
        <div className={styles.panelHeader}>
          <div className={`${styles.iconWrap} ${styles[color]}`}>
            <Icon size={20} strokeWidth={1.75}/>
          </div>
          <h2 className={styles.panelTitle}>{title}</h2>
        </div>
        <div className={styles.fields}>{children}</div>
        <div className={styles.panelFooter}>
          <Button variant="secondary" icon={RotateCcw} size="sm" onClick={onReset}>Reset</Button>
        </div>
      </div>

      {/* Result panel */}
      <div className={styles.resultPanel}>
        {result
          ? result
          : (
            <div className={styles.emptyResult}>
              <div className={styles.emptyIcon}><Icon size={32} strokeWidth={1}/></div>
              <p className={styles.emptyText}>Fill in the fields to calculate</p>
            </div>
          )
        }
        {result && (
          <div className={styles.saveRow}>
            <Button icon={BookmarkPlus} onClick={onSave} fullWidth>
              Save to EMR
            </Button>
            <p className={styles.saveHint}>Result will auto-populate relevant EMR fields</p>
          </div>
        )}
      </div>
    </div>
  )
}