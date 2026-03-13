import { Bell, Search, ChevronDown } from 'lucide-react'
import styles from './Topbar.module.css'

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      {/* Search */}
      <div className={styles.search}>
        <Search size={15} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search patients, records..."
          type="search"
        />
      </div>

      {/* Right side */}
      <div className={styles.right}>
        {/* Notifications */}
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} strokeWidth={1.75} />
          <span className={styles.badge}>3</span>
        </button>

        {/* Doctor profile */}
        <button className={styles.profile}>
          <div className={styles.avatar}>DR</div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Dr. Sharma</span>
            <span className={styles.profileRole}>Gynaecologist</span>
          </div>
          <ChevronDown size={14} className={styles.chevron} />
        </button>
      </div>
    </header>
  )
}