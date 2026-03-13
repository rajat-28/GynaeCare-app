import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@components/layout/MainLayout'

// Module pages (we'll fill these in per phase)
import Dashboard     from '@modules/analytics/Dashboard'
import Patients      from '@modules/patients/Patients'
import OPD           from '@modules/opd/OPD'
import Pregnancy     from '@modules/pregnancy/Pregnancy'
import Ultrasound    from '@modules/ultrasound/Ultrasound'
import Reconstructive from '@modules/reconstructive/Reconstructive'
import Fertility     from '@modules/fertility/Fertility'
import Billing       from '@modules/billing/Billing'
import Calculators   from '@modules/calculators/Calculators'
import Consent       from '@modules/consent/Consent'
import Engagement    from '@modules/engagement/Engagement'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"      element={<Dashboard />} />
          <Route path="patients/*"     element={<Patients />} />
          <Route path="opd/*"          element={<OPD />} />
          <Route path="pregnancy/*"    element={<Pregnancy />} />
          <Route path="ultrasound/*"   element={<Ultrasound />} />
          <Route path="reconstructive/*" element={<Reconstructive />} />
          <Route path="fertility/*"    element={<Fertility />} />
          <Route path="billing/*"      element={<Billing />} />
          <Route path="calculators"    element={<Calculators />} />
          <Route path="consent/*"      element={<Consent />} />
          <Route path="engagement/*"   element={<Engagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}