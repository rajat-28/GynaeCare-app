import { Routes, Route } from 'react-router-dom'
import PatientList from './PatientList'
import PatientNew from './PatientNew'
import PatientProfile from './PatientProfile'
import EditPatient from './EditPatient'
import EpisodeNew from './EpisodeNew'

export default function Patients() {
  return (
    <Routes>
      <Route index element={<PatientList />} />
      <Route path="new" element={<PatientNew />} />
      <Route path=":id" element={<PatientProfile />} />
      <Route path=":id/edit" element={<EditPatient />} />
      <Route path=":id/episodes/new" element={<EpisodeNew />} />
    </Routes>
  )
}