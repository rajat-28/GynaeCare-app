import { Routes, Route } from 'react-router-dom'
import ReconstructiveList from './ReconstructiveList'
import ReconstructivePatientView from './ReconstructivePatientView'
import ProcedureNew from './ProcedureNew'

export default function Reconstructive() {
  return (
    <Routes>
      <Route index              element={<ReconstructiveList />} />
      <Route path="new"         element={<ProcedureNew />} />
      <Route path="patient/:id" element={<ReconstructivePatientView />} />
    </Routes>
  )
}