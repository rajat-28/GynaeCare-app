import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { MEDICINES_COMMON } from '../opdData'
import styles from './Section.module.css'

const DURATIONS = ['3 days','5 days','7 days','10 days','2 weeks','1 month','Ongoing']
const FREQUENCY = ['OD','BD','TDS','QID','SOS','HS','Weekly']

export default function SectionPrescription({ data, update }) {
  const [quick, setQuick] = useState('')

  const addMedicine = (name = '') => {
    update({ medicines: [...data.medicines, { name, dose:'', frequency:'OD', duration:'5 days', instructions:'' }] })
  }

  const updateMed = (i, field, val) => {
    const next = data.medicines.map((m, idx) => idx === i ? { ...m, [field]: val } : m)
    update({ medicines: next })
  }

  const removeMed = i => update({ medicines: data.medicines.filter((_,idx) => idx !== i) })

  return (
    <div>
      <h2 className={styles.title}>Prescription</h2>
      <p className={styles.sub}>Add medicines with dosage and instructions</p>

      {/* Quick add chips */}
      <div style={{marginBottom:'var(--space-4)'}}>
        <p className={styles.textareaLabel}>Quick add common medicines</p>
        <div className={styles.chipGrid}>
          {MEDICINES_COMMON.slice(0,10).map(m => (
            <button key={m} className={styles.chip} onClick={() => addMedicine(m)}>{m}</button>
          ))}
        </div>
      </div>

      {/* Medicine rows */}
      {data.medicines.map((med, i) => (
        <div key={i} className={styles.itemRow}>
          <input className={styles.itemRowInput} style={{flex:2}}
            placeholder="Medicine name" value={med.name}
            onChange={e => updateMed(i, 'name', e.target.value)}/>
          <input className={styles.itemRowInput} style={{width:80}}
            placeholder="Dose" value={med.dose}
            onChange={e => updateMed(i, 'dose', e.target.value)}/>
          <select className={styles.itemRowInput} style={{width:80}}
            value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)}>
            {FREQUENCY.map(f => <option key={f}>{f}</option>)}
          </select>
          <select className={styles.itemRowInput} style={{width:100}}
            value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)}>
            {DURATIONS.map(d => <option key={d}>{d}</option>)}
          </select>
          <input className={styles.itemRowInput} style={{flex:1}}
            placeholder="Instructions (after food, etc.)" value={med.instructions}
            onChange={e => updateMed(i, 'instructions', e.target.value)}/>
          <button className={styles.removeBtn} onClick={() => removeMed(i)}><X size={12}/></button>
        </div>
      ))}

      <button className={styles.addBtn} onClick={() => addMedicine()}>
        <Plus size={14}/> Add Medicine
      </button>
    </div>
  )
}