import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import styles from './Section.module.css'

const REGULARITY = ['Regular','Irregular','Oligomenorrhoea','Amenorrhoea']

export default function SectionMenstrual({ data, update }) {
  const m = data.menstrual
  const set = f => update({ menstrual: { ...m, ...f } })
  return (
    <div>
      <h2 className={styles.title}>Menstrual History</h2>
      <p className={styles.sub}>Current cycle details</p>
      <div className={styles.grid3}>
        <Input label="Cycle Length" type="number" value={m.cycleLength||''}
          onChange={e => set({ cycleLength: e.target.value })} placeholder="28" suffix="days"/>
        <Input label="Duration of Flow" type="number" value={m.duration}
          onChange={e => set({ duration: e.target.value })} placeholder="5" suffix="days"/>
        <Select label="Cycle Regularity" value={m.cycleRegularity}
          onChange={e => set({ cycleRegularity: e.target.value })} options={REGULARITY}/>
      </div>
      <div className={styles.checkRow}>
        {[['dysmenorrhea','Dysmenorrhoea'],['pmsSymptoms','PMS Symptoms']].map(([k,l]) => (
          <label key={k} className={styles.checkLabel}>
            <input type="checkbox" checked={m[k]||false} onChange={e => set({ [k]: e.target.checked })}/>
            {l}
          </label>
        ))}
      </div>
    </div>
  )
}