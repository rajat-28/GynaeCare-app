import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'
import Input from '@components/ui/Input'
import Badge from '@components/ui/Badge'
import CalcShell from './CalcShell'
import { ResultCard, ResultPrimary, ResultRow, ResultDivider, ResultDisclaimer } from './ResultCard'
import { calculateFertileWindow } from '@utils/calculators'
import dayjs from 'dayjs'

const INITIAL = { lmp: '', cycleLength: '28', lutealPhase: '14' }

export default function FertileWindowCalc() {
  const [form, setForm] = useState(INITIAL)
  const set = f => setForm(d => ({ ...d, ...f }))

  const result = useMemo(() => {
    if (!form.lmp) return null
    if (dayjs(form.lmp).isAfter(dayjs(), 'day')) return { error: "LMP cannot be a future date." }
    
    const cycle   = Number(form.cycleLength) || 28
    if (cycle < 21 || cycle > 45) return { error: "Cycle length must be between 21 and 45 days." }
    
    const luteal  = Number(form.lutealPhase) || 14
    const ovDay   = cycle - luteal
    const ovDate  = dayjs(form.lmp).add(ovDay, 'day')
    const start   = ovDate.subtract(5, 'day')
    const end     = ovDate.add(1,  'day')
    const today   = dayjs()
    const inWindow = today.isAfter(start.subtract(1,'day')) && today.isBefore(end.add(1,'day'))
    return {
      ovulation:   ovDate.format('DD MMM YYYY'),
      windowStart: start.format('DD MMM YYYY'),
      windowEnd:   end.format('DD MMM YYYY'),
      ovCycleDay:  ovDay,
      inWindow,
      irregular:   cycle < 24 || cycle > 35,
    }
  }, [form])

  return (
    <CalcShell
      title="Fertile Window Calculator"
      icon={Heart}
      color="success"
      result={result ? (
        result.error ? (
          <ResultCard>
            <div style={{padding:'var(--space-6)',textAlign:'center',color:'var(--clr-danger-500)'}}>
              ⚠ {result.error}
            </div>
          </ResultCard>
        ) : (
          <ResultCard>
            <ResultPrimary
              label="Estimated Ovulation Date"
            value={result.ovulation}
            sub={`Cycle Day ${result.ovCycleDay}`}
          />
          <ResultRow
            label="Fertile Window"
            value={`${result.windowStart} → ${result.windowEnd}`}
          />
          <ResultRow label="Window Duration" value="7 days (5 before + ovulation + 1 after)"/>
          <ResultRow
            label="Today's Status"
            badge={result.inWindow ? 'In fertile window' : 'Outside fertile window'}
            badgeVariant={result.inWindow ? 'success' : 'default'}
          />
          {result.irregular && (
            <div style={{padding:'var(--space-3)',background:'var(--clr-warning-50)',borderRadius:'var(--radius-lg)',border:'1px solid var(--clr-warning-400)',fontSize:'var(--text-xs)',color:'var(--clr-warning-500)'}}>
              ⚠ Irregular cycle detected. Estimates may vary — clinical correlation advised.
            </div>
          )}
          <ResultDivider/>
          <ResultDisclaimer text="Estimated only. For irregular cycles, follicular monitoring via ultrasound is recommended." />
        </ResultCard>
        )
      ) : null}
      onReset={() => setForm(INITIAL)}
      onSave={() => alert('Fertile window saved to EMR!')}
    >
      <Input label="Last Menstrual Period (LMP)" required type="date"
        value={form.lmp} onChange={e => set({ lmp: e.target.value })}/>
      <Input label="Average Cycle Length" type="number" min="21" max="45"
        value={form.cycleLength} onChange={e => set({ cycleLength: e.target.value })}
        suffix="days" hint="Normal range: 21–45 days"/>
      <Input label="Luteal Phase Length" type="number" min="10" max="16"
        value={form.lutealPhase} onChange={e => set({ lutealPhase: e.target.value })}
        suffix="days" hint="Usually 12–14 days. Adjust if known."/>
    </CalcShell>
  )
}