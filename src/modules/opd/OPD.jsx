import { Routes, Route } from 'react-router-dom'
import OPDList from './OPDList'
import OPDNew  from './OPDNew'
import OPDPatientView from './OPDPatientView'
import OPDConsultationDetails from './OPDConsultationDetails'

export default function OPD() {
  return (
    <Routes>
      <Route index   element={<OPDList />} />
      <Route path="new" element={<OPDNew />} />
      <Route path="patient/:id" element={<OPDPatientView />} />
      <Route path="consultation/:id" element={<OPDConsultationDetails />} />
      <Route path="consultation/:id/edit" element={<OPDNew />} />
    </Routes>
  )
}