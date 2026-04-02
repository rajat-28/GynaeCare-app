import Input from '@components/ui/Input'
import styles from './Section.module.css'

export default function SectionObstetric({ data, update }) {
  const o = data.obstetric
  const set = f => update({ obstetric: { ...o, ...f } })
  return (
    <div>
      <h2 className={styles.title}>Obstetric History</h2>
      <p className={styles.sub}>G P L A scoring</p>
      <div className={styles.grid4}>
        {[['gravida','Gravida (G)'],['para','Para (P)'],['abortions','Abortions (A)'],['living','Living (L)']].map(([k,l]) => (
          <Input key={k} label={l} type="number" min="0" value={o[k]||''}
            onChange={e => set({ [k]: e.target.value })} placeholder="0"/>
        ))}
      </div>
      
      { (parseInt(o.para) || 0) + (parseInt(o.abortions) || 0) > (parseInt(o.gravida) || 0) && (
        <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--clr-warning-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-warning-300)', color: 'var(--clr-warning-700)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          ⚠ Warning: Para + Abortions exceeds Gravida
        </div>
      )}

      <div className={styles.checkRow}>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={o.prevCSection||false}
            onChange={e => set({ prevCSection: e.target.checked })}/>
          Previous C-Section (LSCS)
        </label>
      </div>
    </div>
  )
}