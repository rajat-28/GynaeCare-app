import { Routes, Route } from 'react-router-dom'
import OPDList from './OPDList'
import OPDNew  from './OPDNew'

export default function OPD() {
  return (
    <Routes>
      <Route index   element={<OPDList />} />
      <Route path="new" element={<OPDNew />} />
    </Routes>
  )
}