import { Routes, Route } from 'react-router-dom'
import FertilityList from './FertilityList'
import FertilityPatientView from './FertilityPatientView'
import FertilityNew from './FertilityNew'

export default function Fertility() {
  return (
    <Routes>
      <Route index              element={<FertilityList />} />
      <Route path="new"         element={<FertilityNew />} />
      <Route path="patient/:id" element={<FertilityPatientView />} />
    </Routes>
  )
}