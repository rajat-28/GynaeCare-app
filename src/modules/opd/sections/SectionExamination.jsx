import Input from '@components/ui/Input'
import styles from './Section.module.css'

export default function SectionExamination({ data, update }) {
  const { perAbdomen: pa, perSpeculum: ps, perVaginal: pv, generalExam: ge } = data
  const setPA = f => update({ perAbdomen:  { ...pa, ...f } })
  const setPS = f => update({ perSpeculum: { ...ps, ...f } })
  const setPV = f => update({ perVaginal:  { ...pv, ...f } })
  const setGE = f => update({ generalExam: { ...ge, ...f } })

  const handleBP = e => {
    // Strip everything except digits and a single slash
    let raw = e.target.value.replace(/[^\d/]/g, '')
    // Only allow one slash
    const parts = raw.split('/')
    if (parts.length > 2) raw = parts[0] + '/' + parts.slice(1).join('')
    // Cap each part to 3 digits
    const [sys = '', dia = ''] = raw.split('/')
    const sysClean = sys.slice(0, 3)
    const diaClean = dia.slice(0, 3)
    // Auto-insert slash once systolic hits 3 digits and no slash yet
    let value = raw.includes('/')
      ? sysClean + '/' + diaClean
      : sysClean.length === 3 ? sysClean + '/' : sysClean
    setGE({ bp: value })
  }

  return (
    <div>
      <h2 className={styles.title}>Clinical Examination</h2>
      <p className={styles.sub}>Record physical findings</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>General Examination</h3>
        <div className={styles.grid4}>
          <Input label="Blood Pressure" value={ge.bp||''} onChange={handleBP} placeholder="120/80" suffix="mmHg" inputMode="numeric"/>
          <Input label="Pulse" type="number" value={ge.pulse||''} onChange={e=>setGE({pulse:e.target.value})} placeholder="72" suffix="bpm"/>
          <Input label="Weight" type="number" value={ge.weight||''} onChange={e=>setGE({weight:e.target.value})} placeholder="60" suffix="kg"/>
          <Input label="Height" type="number" value={ge.height||''} onChange={e=>setGE({height:e.target.value})} placeholder="160" suffix="cm"/>
        </div>
        <div className={styles.checkRow}>
          {[['pallor','Pallor'],['oedema','Oedema']].map(([k,l]) => (
            <label key={k} className={styles.checkLabel}>
              <input type="checkbox" checked={ge[k]||false} onChange={e=>setGE({[k]:e.target.checked})}/>{l}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Per Abdomen</h3>
        <div className={styles.checkRow}>
          {[['tenderness','Tenderness'],['mass','Mass present']].map(([k,l]) => (
            <label key={k} className={styles.checkLabel}>
              <input type="checkbox" checked={pa[k]||false} onChange={e=>setPA({[k]:e.target.checked})}/>{l}
            </label>
          ))}
        </div>
        <div style={{marginTop:'var(--space-3)', maxWidth:300}}>
          <Input label="Uterine Size" value={pa.uterineSize||''} onChange={e=>setPA({uterineSize:e.target.value})} placeholder="e.g. 8 weeks size"/>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Per Speculum</h3>
        <div className={styles.grid3}>
          <Input label="Cervix Condition" value={ps.cervixCondition||''} onChange={e=>setPS({cervixCondition:e.target.value})} placeholder="Healthy / Erosion..."/>
          <Input label="Discharge" value={ps.discharge||''} onChange={e=>setPS({discharge:e.target.value})} placeholder="None / White / Purulent..."/>
          <Input label="Lesions" value={ps.lesions||''} onChange={e=>setPS({lesions:e.target.value})} placeholder="None / Polyp..."/>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Per Vaginal</h3>
        <div className={styles.grid3}>
          <Input label="Uterine Position" value={pv.uterinePosition||''} onChange={e=>setPV({uterinePosition:e.target.value})} placeholder="Anteverted / Retroverted"/>
          <Input label="Adnexal Mass" value={pv.adnexalMass||''} onChange={e=>setPV({adnexalMass:e.target.value})} placeholder="None / Cyst..."/>
          <div style={{display:'flex',alignItems:'flex-end',paddingBottom:'0.5rem'}}>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={pv.tenderness||false} onChange={e=>setPV({tenderness:e.target.checked})}/>
              Fornix Tenderness
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}