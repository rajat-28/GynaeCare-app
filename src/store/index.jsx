import { createContext, useContext, useState } from 'react'

export const ROLE_PERMISSIONS = {
  doctor:     ['dashboard','patients','opd','pregnancy','ultrasound','reconstructive','fertility','billing','calculators','consent','engagement'],
  reception:  ['dashboard','patients','opd','pregnancy','ultrasound','engagement'],
  billing:    ['dashboard','billing'],
  lab:        ['dashboard','ultrasound'],
  admin:      ['dashboard','patients','opd','pregnancy','ultrasound','reconstructive','fertility','billing','calculators','consent','engagement', 'admin'],
}

export function canAccess(role, module) {
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false
}

// Maps backend role strings to display labels
const ROLE_LABELS = {
  doctor:     'Doctor',
  gynaecologist: 'Gynaecologist',
  obstetrician:  'Obstetrician',
  reception:  'Receptionist',
  receptionist: 'Receptionist',
  billing:    'Billing Staff',
  billing_staff: 'Billing Staff',
  lab:        'Lab Technician',
  lab_technician: 'Lab Technician',
  admin:      'Admin',
  clinic_admin: 'Clinic Admin',
}

// Normalize user object from backend into consistent shape
function normalizeUser(raw) {
  if (!raw) return null
  const role = (raw.role || raw.userRole || raw.user_role || '').toLowerCase()
  return {
    id:        raw.id || raw._id || raw.userId,
    name:      raw.name || raw.fullName || raw.full_name || raw.firstName || 'User',
    email:     raw.email,
    role:      role,
    roleLabel: raw.roleLabel || ROLE_LABELS[role] || role,
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gynaecare_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (rawUser) => {
    const normalized = normalizeUser(rawUser)
    localStorage.setItem('gynaecare_user', JSON.stringify(normalized))
    setUser(normalized)
  }

  const logout = () => {
    localStorage.removeItem('gynaecare_user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)