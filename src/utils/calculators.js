import dayjs from 'dayjs'

export function calculateEDD(lmp, cycleLength = 28) {
  const adjustment = cycleLength - 28
  return dayjs(lmp).add(280 + adjustment, 'day').format('DD MMM YYYY')
}

export function calculatePregnancyWeek(lmp, visitDate = null) {
  const visit = visitDate ? dayjs(visitDate) : dayjs()
  const days  = visit.diff(dayjs(lmp), 'day')
  if (days < 0) return 'Invalid'
  const weeks = Math.floor(days / 7)
  const rem   = days % 7
  return `${weeks}W ${rem}D`
}

export function calculateCycleDay(lmp, visitDate = null) {
  const visit = visitDate ? dayjs(visitDate) : dayjs()
  return visit.diff(dayjs(lmp), 'day') + 1
}

export function calculateFertileWindow(lmp, cycleLength = 28) {
  const ovulationDay  = cycleLength - 14
  const ovulationDate = dayjs(lmp).add(ovulationDay, 'day')
  return {
    ovulation:   ovulationDate.format('DD MMM YYYY'),
    windowStart: ovulationDate.subtract(5, 'day').format('DD MMM YYYY'),
    windowEnd:   ovulationDate.add(1, 'day').format('DD MMM YYYY'),
  }
}

export function getCyclePhase(cycleDay) {
  if (cycleDay <= 5)  return { phase: 'Menstrual',   color: 'danger'  }
  if (cycleDay <= 13) return { phase: 'Follicular',  color: 'warning' }
  if (cycleDay === 14) return { phase: 'Ovulatory',  color: 'success' }
  return                     { phase: 'Luteal',      color: 'default' }
}

export function getTrimester(weeks) {
  if (weeks <= 13) return { trimester: 'First Trimester',  color: 'teal'    }
  if (weeks <= 27) return { trimester: 'Second Trimester', color: 'primary' }
  return                  { trimester: 'Third Trimester',  color: 'warning' }
}