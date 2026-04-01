import { useState, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import Input from '@components/ui/Input'
import CalcShell from './CalcShell'
import { ResultCard, ResultPrimary, ResultRow, ResultDivider, ResultDisclaimer } from './ResultCard'
import { getCyclePhase } from '@utils/calculators'
import dayjs from 'dayjs'

const INITIAL = { lmp: '', visitDate: '', cycleLength: '28' }

export default function CycleDayCalculator() {
  const [form, setForm] = useState(INITIAL)
  const set = f => setForm(d => ({ ...d, ...f }))

  const result = useMemo(() => {
    if (!form.lmp) return null
    const lmp   = dayjs(form.lmp)
    if (lmp.isAfter(dayjs(), 'day')) return { error: "LMP cannot be a future date." }
    const visit = form.visitDate ? dayjs(form.visitDate) : dayjs()
    if (visit.isBefore(lmp)) return { error: "Visit date cannot be before LMP." }
    
    const cycleLength = Number(form.cycleLength) || 28
    if (cycleLength < 21 || cycleLength > 45) return { error: "Cycle length must be between 21 and 45 days." }

    const cycleDay = visit.diff(lmp, 'day') + 1
    const { phase, color } = getCyclePhase(cycleDay)
    const warn = cycleDay > 90
    return { cycleDay, phase, color, warn, visitDateUsed: visit.format('DD MMM YYYY') }
  }, [form])

  return (
    <CalcShell
      title="Cycle Day Calculator"
      icon={Calendar}
      color="teal"
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
              label="Current Cycle Day"
            value={`Day ${result.cycleDay}`}
            sub={`As of ${result.visitDateUsed}`}
          />
          <ResultRow label="Cycle Phase"   badge={result.phase} badgeVariant={result.color}/>
          <ResultRow label="LMP Date"      value={dayjs(form.lmp).format('DD MMM YYYY')}/>
          <ResultRow label="Cycle Length"  value={`${form.cycleLength} days`}/>
          {result.warn && (
            <div style={{padding:'var(--space-3)', background:'var(--clr-warning-50)', borderRadius:'var(--radius-lg)', border:'1px solid var(--clr-warning-400)', fontSize:'var(--text-xs)', color:'var(--clr-warning-500)'}}>
              ⚠ Cycle day &gt;90. Please verify LMP — possible amenorrhoea, pregnancy, or menopause.
            </div>
          )}
          <ResultDivider/>
          <ResultDisclaimer text="Phase mapping based on standard 28-day cycle. Adjust for variable cycle lengths." />
        </ResultCard>
        )
      ) : null}
      onReset={() => setForm(INITIAL)}
      onSave={() => alert('Cycle day saved to EMR!')}
    >
      <Input label="Last Menstrual Period (LMP)" required type="date"
        value={form.lmp} onChange={e => set({ lmp: e.target.value })}/>
      <Input label="Visit / Reference Date" type="date"
        value={form.visitDate} onChange={e => set({ visitDate: e.target.value })}
        hint="Leave blank to use today's date"/>
      <Input label="Average Cycle Length" type="number" min="21" max="45"
        value={form.cycleLength} onChange={e => set({ cycleLength: e.target.value })}
        suffix="days" hint="Used for phase mapping"/>
    </CalcShell>
  )
}