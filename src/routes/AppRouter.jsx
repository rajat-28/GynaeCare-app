import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth, canAccess } from '@/store/index'
import MainLayout    from '@components/layout/MainLayout'
import Login         from '@/pages/Login'

import Dashboard      from '@modules/analytics/Dashboard'
import Patients       from '@modules/patients/Patients'
import OPD            from '@modules/opd/OPD'
import Pregnancy      from '@modules/pregnancy/Pregnancy'
import Ultrasound     from '@modules/ultrasound/Ultrasound'
import Reconstructive from '@modules/reconstructive/Reconstructive'
// import Fertility      from '@modules/fertility/Fertility'
import Billing        from '@modules/billing/Billing'
import Calculators    from '@modules/calculators/Calculators'
import Consent        from '@modules/consent/Consent'
import Engagement     from '@modules/engagement/Engagement'
import AdminUsers      from '@modules/admin/AdminUsers'
import AccessDenied   from '@/pages/AccessDenied'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function ModuleRoute({ module, children }) {
  const { user } = useAuth()
  return canAccess(user?.role, module) ? children : <AccessDenied />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>

      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard"        element={<ModuleRoute module="dashboard"><Dashboard /></ModuleRoute>} />
        <Route path="patients/*"       element={<ModuleRoute module="patients"><Patients /></ModuleRoute>} />
        <Route path="opd/*"            element={<ModuleRoute module="opd"><OPD /></ModuleRoute>} />
        <Route path="pregnancy/*"      element={<ModuleRoute module="pregnancy"><Pregnancy /></ModuleRoute>} />
        <Route path="ultrasound/*"     element={<ModuleRoute module="ultrasound"><Ultrasound /></ModuleRoute>} />
        <Route path="reconstructive/*" element={<ModuleRoute module="reconstructive"><Reconstructive /></ModuleRoute>} />
        {/* <Route path="fertility/*"      element={<ModuleRoute module="fertility"><Fertility /></ModuleRoute>} /> */}
        <Route path="billing/*"        element={<ModuleRoute module="billing"><Billing /></ModuleRoute>} />
        <Route path="calculators"      element={<ModuleRoute module="calculators"><Calculators /></ModuleRoute>} />
        <Route path="consent/*"        element={<ModuleRoute module="consent"><Consent /></ModuleRoute>} />
        <Route path="engagement/*"     element={<ModuleRoute module="engagement"><Engagement /></ModuleRoute>} />
        <Route path="admin/users"      element={<ModuleRoute module="admin"><AdminUsers /></ModuleRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}