import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Stethoscope, Baby, Scan,
  Scissors, FlaskConical, Receipt, Calculator,
  FileCheck, MessageSquare, ChevronLeft, Heart
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth, ROLE_PERMISSIONS } from '@/store/index'
import logo from '@/assets/logo.png'
import styles from './Sidebar.module.css'

const ALL_NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', module: 'dashboard' },
  { to: '/patients', icon: Users, label: 'Patients', module: 'patients' },
  { to: '/opd', icon: Stethoscope, label: 'OPD Consultation', module: 'opd' },
  { to: '/pregnancy', icon: Baby, label: 'Pregnancy & ANC', module: 'pregnancy' },
  { to: '/ultrasound', icon: Scan, label: 'Ultrasound', module: 'ultrasound' },
  { to: '/reconstructive', icon: Scissors, label: 'Reconstructive', module: 'reconstructive' },
  // { to: '/fertility', icon: FlaskConical, label: 'Fertility & IVF', module: 'fertility' },
  { to: '/billing', icon: Receipt, label: 'Billing', module: 'billing' },
  { to: '/calculators', icon: Calculator, label: 'Calculators', module: 'calculators' },
  { to: '/consent', icon: FileCheck, label: 'Consent & Legal', module: 'consent' },
  { to: '/engagement', icon: MessageSquare, label: 'Engagement', module: 'engagement' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const allowed = ROLE_PERMISSIONS[user?.role] || []
  const navItems = ALL_NAV_ITEMS.filter(item => allowed.includes(item.module))

  return (
    <aside className={clsx(styles.sidebar, collapsed && styles.collapsed)}>
      {/* Logo */}
      <div className={styles.logo} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Logo" className={styles.logoImg} />
        {!collapsed && (
          <div className={styles.logoText}>
            <span className={styles.logoName}>GynaeCare</span>
          </div>
        )}
      </div>

      {/* Role badge */}
      {/* {!collapsed && (
        <div className={styles.roleBadge}>
          {user?.roleLabel}
        </div>
      )} */}

      {/* Nav */}
      <nav className={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => (
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