import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Download, CheckCircle } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Select from '@components/ui/Select'
import { billingApi } from '@services/api'
import { PAYMENT_METHODS, PACKAGES } from './billingData'
import styles from './InvoiceView.module.css'

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`

export default function InvoiceView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inv,         setInv]         = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  // Record payment form
  const [recAmt,      setRecAmt]      = useState('')
  const [recMethod,   setRecMethod]   = useState('Cash')
  const [recRef,      setRecRef]      = useState('')
  const [recNotes,    setRecNotes]    = useState('')
  const [recording,   setRecording]   = useState(false)
  const [recError,    setRecError]    = useState(null)
  const [recSuccess,  setRecSuccess]  = useState(false)

  const fetchInvoice = () => {
    console.log('[InvoiceView] fetchInvoice called. ID:', id)
    if (!id) {
      console.log('[InvoiceView] ID is falsy, returning early.')
      return
    }
    console.log('[InvoiceView] Setting loading to true.')
    setLoading(true)
    setError(null)
    console.log('[InvoiceView] Calling billingApi.getById...')
    billingApi.getById(id)
      .then(res => {
        console.log('[InvoiceView] Received response:', res)
        if (res?.data) {
          setInv(res.data)
        } else {
          setError('Invoice data is empty.')
        }
      })
      .catch(err => {
        console.log('[InvoiceView] Caught error:', err)
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error  ||
          err?.message                ||
          'Failed to load invoice.'
        console.error('[InvoiceView] fetch error:', err)
        setError(Array.isArray(msg) ? msg.join(', ') : msg)
      })
      .finally(() => {
        console.log('[InvoiceView] In finally block. Setting loading to false.')
        setLoading(false)
      })
  }

  useEffect(() => { fetchInvoice() }, [id])

  if (loading) return <p style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading invoice…</p>
  if (error)   return <p style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--clr-danger-500)' }}>{error}</p>
  if (!inv)    return null

  // Normalise data from backend shape
  const patientName = inv.patient?.name ?? '—'
  const patientId   = inv.patient?.id   ?? ''
  const patientPhone= inv.patient?.phone ?? ''
  const patientAge  = inv.patient?.dob
    ? Math.floor((Date.now() - new Date(inv.patient.dob)) / (365.25 * 86400000))
    : null
  const invoiceDate = inv.createdAt
    ? new Date(inv.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
    : '—'
  const invItems = (inv.items ?? []).map(item => ({
    name:  item.description,
    qty:   item.quantity,
    rate:  Number(item.unitPrice),
    total: Number(item.totalAmount),
  }))
  const payMethod = inv.payments?.[0]?.paymentMode ?? 'UPI'
  const invStatus = inv.status ?? 'issued'

  // Calculate per-session amount if package exists
  const backendPkgItem = (inv.items ?? []).find(i => i.category === 'package')
  let sessionPerAmt = 0
  if (backendPkgItem) {
    const pkgDef = PACKAGES.find(p => p.name === backendPkgItem.description)
    const sessionCount = pkgDef?.includes?.length || 1
    sessionPerAmt = Math.ceil(Number(inv.netAmount) / sessionCount)
  }

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
              <div className={styles.invNum}>{inv.invoiceNumber}</div>
              <div className={styles.invDate}>{invoiceDate}</div>
              <Badge variant={invStatus === 'paid' ? 'success' : invStatus === 'partial' ? 'warning' : 'danger'} dot>
                {invStatus.charAt(0).toUpperCase() + invStatus.slice(1)}
              </Badge>
            </div>
          </div>

          <hr className={styles.divider}/>

          {/* Patient info */}
          <div className={styles.patientInfo}>
            <div>
              <div className={styles.infoLabel}>Bill To</div>
              <div className={styles.infoName}>{patientName}</div>
              <div className={styles.infoSub}>
                {patientId.slice(0,8)}…
                {patientAge ? ` · ${patientAge} yrs` : ''}
                {patientPhone ? ` · ${patientPhone}` : ''}
              </div>
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
              {invItems.map((item, i) => (
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
            <div className={styles.totalRow}><span>Subtotal</span><span>{fmt(inv.totalAmount)}</span></div>
            {Number(inv.discountAmount) > 0 && <div className={styles.totalRow}><span>Discount</span><span>− {fmt(inv.discountAmount)}</span></div>}
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span><span>{fmt(inv.netAmount)}</span>
            </div>
            <div className={styles.totalRow} style={{color:'var(--clr-accent-600)'}}>
              <span>Paid ({payMethod})</span><span>{fmt(inv.paidAmount)}</span>
            </div>
            {Number(inv.outstandingAmount) > 0 && (
              <div className={styles.totalRow} style={{color:'var(--clr-danger-600)', fontWeight:600}}>
                <span>Balance Due</span><span>{fmt(inv.outstandingAmount)}</span>
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

          {/* Record Payment panel — shown when balance is outstanding */}
          {Number(inv.outstandingAmount) > 0 && (
            <Card padding="md" className={styles.recordCard}>
              <div className={styles.recordTitle}>Record Payment</div>
              <div className={styles.recordDue}>
                Due: <strong style={{ color: 'var(--clr-danger-500)' }}>{fmt(inv.outstandingAmount)}</strong>
              </div>

              <input
                type="number"
                className={styles.recInput}
                placeholder="Amount (₹)"
                min="1"
                max={Number(inv.outstandingAmount)}
                value={recAmt}
                onChange={e => setRecAmt(e.target.value)}
              />
              <div className={styles.recQuicks}>
                <button className={styles.recQuick} onClick={() => setRecAmt(String(Number(inv.outstandingAmount)))}>
                  Full due
                </button>
                {Number(inv.outstandingAmount) >= 5000 && (
                  <button className={styles.recQuick} onClick={() => setRecAmt(String(Math.ceil(Number(inv.outstandingAmount) / 2)))}>
                    Half
                  </button>
                )}
                {sessionPerAmt > 0 && sessionPerAmt <= Number(inv.outstandingAmount) && (
                  <button className={styles.recQuick} onClick={() => setRecAmt(String(sessionPerAmt))}>
                    1 Session
                  </button>
                )}
              </div>

              <Select
                label="Method"
                value={recMethod}
                onChange={e => setRecMethod(e.target.value)}
                options={PAYMENT_METHODS}
              />

              <input
                className={styles.recInput}
                placeholder="Reference no. (optional)"
                value={recRef}
                onChange={e => setRecRef(e.target.value)}
                style={{ marginTop: 'var(--space-2)' }}
              />
              <textarea
                className={styles.recTextarea}
                rows={2}
                placeholder="Notes (optional)"
                value={recNotes}
                onChange={e => setRecNotes(e.target.value)}
              />

              {recError && <p className={styles.recErr}>{recError}</p>}
              {recSuccess && (
                <p className={styles.recOk}><CheckCircle size={13}/> Payment recorded successfully</p>
              )}

              <Button
                fullWidth
                icon={CheckCircle}
                disabled={!recAmt || Number(recAmt) <= 0 || recording}
                onClick={async () => {
                  setRecording(true)
                  setRecError(null)
                  setRecSuccess(false)
                  const PAY_MODE_MAP = {
                    'Cash': 'cash', 'UPI': 'upi', 'Card': 'card',
                    'NEFT / Bank Transfer': 'net_banking',
                    'Insurance': 'cash', 'Cheque': 'cheque',
                  }
                  try {
                    await billingApi.recordPayment({
                      invoiceId:       inv.id,
                      amount:          Number(recAmt),
                      paymentDate:     new Date().toISOString().split('T')[0],
                      paymentMode:     PAY_MODE_MAP[recMethod] ?? 'cash',
                      referenceNumber: recRef || undefined,
                      notes:           recNotes || undefined,
                    })
                    setRecSuccess(true)
                    setRecAmt('')
                    setRecRef('')
                    setRecNotes('')
                    // Refresh invoice to show updated balance
                    fetchInvoice()
                  } catch (err) {
                    setRecError(err?.response?.data?.message ?? 'Failed to record payment.')
                  } finally {
                    setRecording(false)
                  }
                }}
              >
                {recording ? 'Recording…' : 'Confirm Payment'}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}