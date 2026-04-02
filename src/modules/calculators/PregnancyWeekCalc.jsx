import { useState, useMemo } from 'react'
import { Activity } from 'lucide-react'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import CalcShell from './CalcShell'
import { ResultCard, ResultPrimary, ResultRow, ResultDivider, ResultDisclaimer } from './ResultCard'
import { getTrimester, calculateEDD } from '@utils/calculators'
import dayjs from 'dayjs'

const METHODS = ['Based on LMP', 'Based on EDD']
const INITIAL  = { method: 'Based on LMP', lmp: '', edd: '', visitDate: '' }

const MILESTONE_ALERTS = [
  { range: [6,8],   msg: 'Viability / Dating Scan due',      variant: 'teal'    },
  { range: [11,14], msg: 'NT Scan due',                       variant: 'primary' },
  { range: [18,22], msg: 'Anomaly / TIFFA Scan due',          variant: 'warning' },
  { range: [28,32], msg: 'Growth Scan due',                   variant: 'teal'    },
  { range: [36,44], msg: 'Delivery preparedness — monitor closely', variant: 'danger' },
]

export default function PregnancyWeekCalc() {
  const [form, setForm] = useState(INITIAL)
  const set = f => setForm(d => ({ ...d, ...f }))

  const result = useMemo(() => {
    const today = form.visitDate ? dayjs(form.visitDate) : dayjs()
    let daysElapsed, edd

    if (form.method === 'Based on LMP' && form.lmp) {
      if (dayjs(form.lmp).isAfter(today, 'day')) return { error: "LMP cannot be a future date." }
      daysElapsed = today.diff(dayjs(form.lmp), 'day')
      edd = dayjs(form.lmp).add(280, 'day')
    } else if (form.method === 'Based on EDD' && form.edd) {
      edd = dayjs(form.edd)
      daysElapsed = 280 - edd.diff(today, 'day')
    } else return null

    if (daysElapsed < 0) return null
    const weeks = Math.floor(daysElapsed / 7)
    const days  = daysElapsed % 7
    const { trimester, color } = getTrimester(weeks)
    const daysToEdd = edd.diff(today, 'day')
    const milestone = MILESTONE_ALERTS.find(m => weeks >= m.range[0] && weeks <= m.range[1])

    if (weeks > 44) return { overdue: true }

    return { weeks, days, trimester, color, edd: edd.format('DD MMM YYYY'), daysToEdd, milestone }
  }, [form])

  return (
    <CalcShell
      title="Pregnancy Week Calculator"
      icon={Activity}
      color="warning"
      result={result ? (
        result.error ? (
          <ResultCard>
            <div style={{padding:'var(--space-6)',textAlign:'center',color:'var(--clr-danger-500)'}}>
              ⚠ {result.error}
            </div>
          </ResultCard>
        ) : result.overdue ? (
          <ResultCard>
            <div style={{padding:'var(--space-6)',textAlign:'center',color:'var(--clr-danger-500)'}}>
              ⚠ Gestational age &gt;44 weeks. Please verify dates.
            </div>
          </ResultCard>
        ) : (
          <ResultCard>
            <ResultPrimary
              label="Gestational Age"
              value={`${result.weeks}W ${result.days}D`}
              sub={`${result.daysToEdd > 0 ? result.daysToEdd + ' days to EDD' : 'Past EDD'}`}
            />
            <ResultRow label="Trimester"  badge={result.trimester} badgeVariant={result.color}/>
            <ResultRow label="EDD"        value={result.edd}/>
            {result.milestone && (
              <>
                <ResultDivider/>
                <div style={{padding:'var(--space-3)',background:'var(--clr-primary-50)',borderRadius:'var(--radius-lg)',border:'1px solid var(--clr-primary-200)',fontSize:'var(--text-sm)',color:'var(--clr-primary-700)',display:'flex',gap:'var(--space-2)',alignItems:'center'}}>
                  📋 <strong>Milestone alert:</strong> {result.milestone.msg}
                </div>
              </>
            )}
            <ResultDivider/>
            <ResultDisclaimer text="Gestational age beyond 44 weeks will be flagged for clinical review." />
          </ResultCard>
        )
      ) : null}
      onReset={() => setForm(INITIAL)}
      onSave={() => alert('Gestational age saved to EMR!')}
    >
      <Select label="Calculation Method" value={form.method}
        onChange={e => set({ method: e.target.value })} options={METHODS}/>

      {form.method === 'Based on LMP'
        ? <Input label="Last Menstrual Period (LMP)" required type="date"
            value={form.lmp} onChange={e => set({ lmp: e.target.value })}/>
        : <Input label="Expected Date of Delivery (EDD)" required type="date"
            value={form.edd} onChange={e => set({ edd: e.target.value })}/>
      }

      <Input label="Visit / Reference Date" type="date"
        value={form.visitDate} onChange={e => set({ visitDate: e.target.value })}
        hint="Leave blank to use today"/>
    </CalcShell>
  )
}