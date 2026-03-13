import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Download } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import styles from './InvoiceView.module.css'

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`

const MOCK_INVOICE = {
  id: 'INV001', date: '10 Mar 2026', patient: 'Priya Sharma',
  patientId: 'P001', age: 28, phone: '9876543210',
  items: [
    { name: 'OPD Consultation',  qty: 1, rate: 500,  total: 500  },
    { name: 'Dating Scan',       qty: 1, rate: 1200, total: 1200 },
  ],
  subtotal: 1700, discount: 0, total: 1700,
  paid: 1700, method: 'UPI', status: 'paid',
}

export default function InvoiceView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const inv = MOCK_INVOICE

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate('/billing')}>
        <ArrowLeft size={16}/> Back to Billing
      </button>

      <div className={styles.layout}>
        <Card padding="lg" className={styles.invoice}>
          {/* Invoice header */}
          <div className={styles.invoiceHeader}>
            <div className={styles.clinicInfo}>
              <div className={styles.clinicName}>GynaeCare Pro</div>
              <div className={styles.clinicSub}>Women's Health Clinic</div>
              <div className={styles.clinicContact}>Dr. Sharma · MBBS, MD (Obs & Gynae)</div>
            </div>
            <div className={styles.invoiceMeta}>
              <div className={styles.invTitle}>INVOICE</div>
              <div className={styles.invNum}>{id}</div>
              <div className={styles.invDate}>{inv.date}</div>
              <Badge variant={inv.status === 'paid' ? 'success' : 'warning'} dot>
                {inv.status === 'paid' ? 'Paid' : 'Pending'}
              </Badge>
            </div>
          </div>

          <hr className={styles.divider}/>

          {/* Patient info */}
          <div className={styles.patientInfo}>
            <div>
              <div className={styles.infoLabel}>Bill To</div>
              <div className={styles.infoName}>{inv.patient}</div>
              <div className={styles.infoSub}>ID: {inv.patientId} · {inv.age} yrs · {inv.phone}</div>
            </div>
          </div>

          {/* Items table */}
          <table className={styles.itemTable}>
            <thead>
              <tr>
                <th className={styles.th}>Service</th>
                <th className={styles.th} style={{textAlign:'center'}}>Qty</th>
                <th className={styles.th} style={{textAlign:'right'}}>Rate</th>
                <th className={styles.th} style={{textAlign:'right'}}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {inv.items.map((item, i) => (
                <tr key={i} className={styles.itemRow}>
                  <td className={styles.td}>{item.name}</td>
                  <td className={styles.td} style={{textAlign:'center'}}>{item.qty}</td>
                  <td className={styles.td} style={{textAlign:'right'}}>{fmt(item.rate)}</td>
                  <td className={styles.td} style={{textAlign:'right', fontWeight:600}}>{fmt(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className={styles.totals}>
            <div className={styles.totalRow}><span>Subtotal</span><span>{fmt(inv.subtotal)}</span></div>
            {inv.discount > 0 && <div className={styles.totalRow}><span>Discount</span><span>− {fmt(inv.discount)}</span></div>}
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span><span>{fmt(inv.total)}</span>
            </div>
            <div className={styles.totalRow} style={{color:'var(--clr-accent-600)'}}>
              <span>Paid ({inv.method})</span><span>{fmt(inv.paid)}</span>
            </div>
            {inv.total - inv.paid > 0 && (
              <div className={styles.totalRow} style={{color:'var(--clr-danger-600)', fontWeight:600}}>
                <span>Balance Due</span><span>{fmt(inv.total - inv.paid)}</span>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <p className={styles.footerNote}>Thank you for visiting GynaeCare Pro. Healthcare services are GST exempt.</p>
          </div>
        </Card>

        {/* Actions */}
        <div className={styles.actions}>
          <Button icon={Printer} fullWidth variant="secondary">Print Invoice</Button>
          <Button icon={Download} fullWidth variant="secondary">Download PDF</Button>
        </div>
      </div>
    </div>
  )
}