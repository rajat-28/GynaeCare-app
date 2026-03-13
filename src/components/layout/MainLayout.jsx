import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={styles.shell}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className={`main-content${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Topbar collapsed={collapsed} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}