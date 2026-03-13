import { Plus, X } from 'lucide-react'
import { INVESTIGATION_LIST } from '../opdData'
import styles from './Section.module.css'

export default function SectionInvestigation({ data, update }) {
  const toggle = val => {
    const next = data.investigations.includes(val)
      ? data.investigations.filter(v => v !== val)
      : [...data.investigations, val]
    update({ investigations: next })
  }

  return (
    <div>
      <h2 className={styles.title}>Investigations</h2>
      <p className={styles.sub}>Select tests to be ordered</p>
      <div className={styles.chipGrid}>
        {INVESTIGATION_LIST.map(inv => (
          <button key={inv}
            className={`${styles.chip} ${data.investigations.includes(inv) ? styles.chipActive : ''}`}
            onClick={() => toggle(inv)}>{inv}</button>
        ))}
      </div>
      {data.investigations.length > 0 && (
        <div style={{marginTop:'var(--space-4)', padding:'var(--space-3)', background:'var(--clr-primary-50)', borderRadius:'var(--radius-lg)', border:'1px solid var(--clr-primary-200)'}}>
          <p style={{fontSize:'var(--text-xs)', fontWeight:'var(--weight-semibold)', color:'var(--clr-primary-700)', marginBottom:'var(--space-2)', textTransform:'uppercase', letterSpacing:'.06em'}}>
            Ordered: {data.investigations.length} test(s)
          </p>
          <div style={{display:'flex', flexWrap:'wrap', gap:'var(--space-2)'}}>
            {data.investigations.map(inv => (
              <span key={inv} style={{display:'flex',alignItems:'center',gap:'0.25rem',padding:'.25rem .625rem', background:'white', borderRadius:'var(--radius-full)', border:'1px solid var(--clr-primary-300)', fontSize:'var(--text-xs)', color:'var(--clr-primary-700)'}}>
                {inv}
                <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--clr-primary-400)',display:'flex'}} onClick={() => toggle(inv)}><X size={10}/></button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}