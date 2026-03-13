import { Routes, Route } from 'react-router-dom'
import PregnancyList from './PregnancyList'
import PregnancyNew  from './PregnancyNew'
import ANCVisit      from './ANCVisit'

export default function Pregnancy() {
  return (
    <Routes>
      <Route index        element={<PregnancyList />} />
      <Route path="new"   element={<PregnancyNew />} />
      <Route path=":id"   element={<ANCVisit />} />
    </Routes>
  )
}