import { useState } from 'react'
import { Calculator, Baby, Calendar, Heart, Activity } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import EDDCalculator         from './EDDCalculator'
import CycleDayCalculator    from './CycleDayCalculator'
import FertileWindowCalc     from './FertileWindowCalc'
import PregnancyWeekCalc     from './PregnancyWeekCalc'
import styles from './Calculators.module.css'

const TABS = [
  { id: 'edd',      label: 'EDD Calculator',      icon: Baby,       desc: 'Expected Delivery Date'  },
  { id: 'cycle',    label: 'Cycle Day',            icon: Calendar,   desc: 'Current menstrual day'   },
  { id: 'fertile',  label: 'Fertile Window',       icon: Heart,      desc: 'Ovulation & fertile days'},
  { id: 'pregweek', label: 'Pregnancy Week',       icon: Activity,   desc: 'Gestational age'         },
]

export default function Calculators() {
  const [active, setActive] = useState('edd')

  const renderCalc = () => {
    switch (active) {
      case 'edd':      return <EDDCalculator />
      case 'cycle':    return <CycleDayCalculator />
      case 'fertile':  return <FertileWindowCalc />
      case 'pregweek': return <PregnancyWeekCalc />
      default:         return null
    }
  }

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <Calculator size={28} className={styles.titleIcon}/>
          <div>
            <h1 className={styles.pageTitle}>Smart Calculators</h1>
            <p className={styles.pageSub}>Clinical calculators with auto-save to EMR</p>
          </div>
        </div>
        <Badge variant="teal">4 calculators available</Badge>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
              onClick={() => setActive(t.id)}
            >
              <Icon size={18} strokeWidth={1.75} className={styles.tabIcon}/>
              <div className={styles.tabText}>
                <span className={styles.tabLabel}>{t.label}</span>
                <span className={styles.tabDesc}>{t.desc}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Calculator content */}
      <div className={styles.calcArea}>
        {renderCalc()}
      </div>
    </div>
  )
}