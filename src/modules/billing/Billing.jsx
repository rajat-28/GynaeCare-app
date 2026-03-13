import { Routes, Route } from 'react-router-dom'
import BillingList   from './BillingList'
import InvoiceNew    from './InvoiceNew'
import InvoiceView   from './InvoiceView'

export default function Billing() {
  return (
    <Routes>
      <Route index          element={<BillingList />} />
      <Route path="new"     element={<InvoiceNew />} />
      <Route path=":id"     element={<InvoiceView />} />
    </Routes>
  )
}