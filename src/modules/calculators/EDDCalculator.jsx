import { useState, useMemo } from 'react'
import { Baby } from 'lucide-react'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Badge from '@components/ui/Badge'
import CalcShell from './CalcShell'
import { ResultCard, ResultPrimary, ResultRow, ResultDivider, ResultDisclaimer } from './ResultCard'
import { calculateEDD, calculatePregnancyWeek, getTrimester } from '@utils/calculators'
import dayjs from 'dayjs'

const METHODS = ['LMP (Naegele\'s Rule)', 'Ultrasound-Based', 'Conception Date']

const INITIAL = { method: 'LMP (Naegele\'s Rule)', lmp: '', cycleLength: '28', scanDate: '', scanGA: '', scanGADays: '', conceptionDate: '' }

export default function EDDCalculator() {
  const [form, setForm] = useState(INITIAL)
  const set = f => setForm(d => ({ ...d, ...f }))

  const result = useMemo(() => {
    if (form.method === "LMP (Naegele's Rule)" && form.lmp) {
      if (dayjs(form.lmp).isAfter(dayjs(), 'day')) {
        return { error: "LMP cannot be a future date." }
      }
      const cycle = Number(form.cycleLength) || 28
      if (cycle < 21 || cycle > 45) {
        return { error: "Cycle length must be between 21 and 45 days." }
      }
      const adj   = cycle - 28
      const edd   = dayjs(form.lmp).add(280 + adj, 'day')
      const today = dayjs()
      const daysElapsed = today.diff(dayjs(form.lmp), 'day')
      const weeks = Math.floor(daysElapsed / 7)
      const days  = daysElapsed % 7
      const { trimester, color } = getTrimester(weeks)
      return { edd: edd.format('DD MMM YYYY'), weekDay: `${weeks}W ${days}D`, trimester, color, method: "Naegele's Rule", daysToEdd: edd.diff(today, 'day') }
    }
    if (form.method === 'Ultrasound-Based' && form.scanDate && form.scanGA) {
      const gaTotal = (Number(form.scanGA) * 7) + (Number(form.scanGADays) || 0)
      const edd     = dayjs(form.scanDate).add(280 - gaTotal, 'day')
      const today   = dayjs()
      const weeks   = Math.floor(gaTotal / 7)
      const { trimester, color } = getTrimester(weeks)
      return { edd: edd.format('DD MMM YYYY'), weekDay: `${Math.floor(gaTotal/7)}W ${gaTotal%7}D (at scan)`, trimester, color, method: 'Ultrasound', daysToEdd: edd.diff(today, 'day') }
    }
    if (form.method === 'Conception Date' && form.conceptionDate) {
      const edd   = dayjs(form.conceptionDate).add(266, 'day')
      const today = dayjs()
      const daysElapsed = today.diff(dayjs(form.conceptionDate), 'day') + 14
      const weeks = Math.floor(daysElapsed / 7)
      const days  = daysElapsed % 7
      const { trimester, color } = getTrimester(weeks)
      return { edd: edd.format('DD MMM YYYY'), weekDay: `${weeks}W ${days}D`, trimester, color, method: 'Conception Date', daysToEdd: edd.diff(today, 'day') }
    }
    return null
  }, [form])

  return (
    <CalcShell
      title="EDD Calculator"
      icon={Baby}
      color="primary"
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
              label="Expected Date of Delivery"
            value={result.edd}
            sub={`${result.daysToEdd > 0 ? result.daysToEdd + ' days remaining' : 'Past due date'}`}
          />
          <ResultRow label="Current Gestational Age"  value={result.weekDay} />
          <ResultRow label="Trimester"                badge={result.trimester} badgeVariant={result.color} />
          <ResultRow label="Calculation Method"       value={result.method} />
          <ResultDivider/>
          <ResultDisclaimer text="EDD is an estimate. Clinical correlation and ultrasound confirmation recommended." />
        </ResultCard>
        )
      ) : null}
      onReset={() => setForm(INITIAL)}
      onSave={() => alert('EDD saved to EMR!')}
    >
      <Select
        label="Calculation Method"
        value={form.method}
        onChange={e => set({ method: e.target.value })}
        options={METHODS}
      />

      {form.method === "LMP (Naegele's Rule)" && (
        <>
          <Input label="Last Menstrual Period (LMP)" required type="date"
            value={form.lmp} onChange={e => set({ lmp: e.target.value })}
            hint="First day of last period"/>
          <Input label="Cycle Length" type="number" min="21" max="45"
            value={form.cycleLength} onChange={e => set({ cycleLength: e.target.value })}
            suffix="days" hint="Normal range: 21–45 days"/>
        </>
      )}

      {form.method === 'Ultrasound-Based' && (
        <>
          <Input label="Ultrasound Scan Date" required type="date"
            value={form.scanDate} onChange={e => set({ scanDate: e.target.value })}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input label="Gestational Age at Scan (weeks)" type="number"
              value={form.scanGA} onChange={e => set({ scanGA: e.target.value })} placeholder="8" suffix="wks"/>
            <Input label="Additional days" type="number" min="0" max="6"
              value={form.scanGADays} onChange={e => set({ scanGADays: e.target.value })} placeholder="3" suffix="days"/>
          </div>
        </>
      )}

      {form.method === 'Conception Date' && (
        <Input label="Known Conception Date" required type="date"
          value={form.conceptionDate} onChange={e => set({ conceptionDate: e.target.value })}
          hint="EDD = Conception Date + 266 days"/>
      )}
    </CalcShell>
  )
}