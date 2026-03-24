import { Routes, Route } from 'react-router-dom'
import FertilityList from './FertilityList'
import FertilityPatientView from './FertilityPatientView'

export default function Fertility() {
  return (
    <Routes>
      <Route index              element={<FertilityList />} />
      <Route path="patient/:id" element={<FertilityPatientView />} />
    </Routes>
  )
}