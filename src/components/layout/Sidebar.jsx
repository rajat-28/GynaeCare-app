import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Stethoscope, Baby, Scan,
  Scissors, FlaskConical, Receipt, Calculator,
  FileCheck, MessageSquare, ChevronLeft, Heart
} from 'lucide-react'
import clsx from 'clsx'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients',       icon: Users,           label: 'Patients' },
  { to: '/opd',            icon: Stethoscope,     label: 'OPD Consultation' },
  { to: '/pregnancy',      icon: Baby,            label: 'Pregnancy & ANC' },
  { to: '/ultrasound',     icon: Scan,            label: 'Ultrasound' },
  { to: '/reconstructive', icon: Scissors,        label: 'Reconstructive' },
  { to: '/fertility',      icon: FlaskConical,    label: 'Fertility & IVF' },
  { to: '/billing',        icon: Receipt,         label: 'Billing' },
  { to: '/calculators',    icon: Calculator,      label: 'Calculators' },
  { to: '/consent',        icon: FileCheck,       label: 'Consent & Legal' },
  { to: '/engagement',     icon: MessageSquare,   label: 'Engagement' },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={clsx(styles.sidebar, collapsed && styles.collapsed)}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Heart size={18} strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className={styles.logoText}>
            <span className={styles.logoName}>GynaeCare</span>
            <span className={styles.logoPro}>Pro</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(styles.navItem, isActive && styles.active)
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} strokeWidth={1.75} className={styles.navIcon} />
            {!collapsed && <span className={styles.navLabel}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        className={clsx(styles.toggleBtn, collapsed && styles.toggleCollapsed)}
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        <ChevronLeft size={16} />
      </button>
    </aside>
  )
}