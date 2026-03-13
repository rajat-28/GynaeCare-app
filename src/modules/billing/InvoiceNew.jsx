import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Save, Package } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Badge from '@components/ui/Badge'
import { SERVICE_CATALOG, PACKAGES, PAYMENT_METHODS } from './billingData'
import styles from './InvoiceNew.module.css'

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`
const CATEGORIES = ['All', ...new Set(SERVICE_CATALOG.map(s => s.category))]

export default function InvoiceNew() {
  const navigate = useNavigate()
  const [patient,    setPatient]    = useState({ id: 'P001', name: 'Priya Sharma' })
  const [items,      setItems]      = useState([])
  const [discount,   setDiscount]   = useState('')
  const [advance,    setAdvance]    = useState('')
  const [payMethod,  setPayMethod]  = useState('Cash')
  const [notes,      setNotes]      = useState('')
  const [catFilter,  setCatFilter]  = useState('All')
  const [showPkgs,   setShowPkgs]   = useState(false)

  const filteredServices = catFilter === 'All'
    ? SERVICE_CATALOG
    : SERVICE_CATALOG.filter(s => s.category === catFilter)

  const addService = svc => {
    const existing = items.find(i => i.id === svc.id)
    if (existing) {
      setItems(items.map(i => i.id === svc.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setItems([...items, { ...svc, qty: 1 }])
    }
  }

  const addPackage = pkg => {
    setItems([...items, { id: pkg.id, name: pkg.name, category: 'Package', rate: pkg.price, qty: 1 }])
    setShowPkgs(false)
  }

  const updateQty  = (id, qty) => setItems(items.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
  const removeItem = id  => setItems(items.filter(i => i.id !== id))

  const subtotal  = useMemo(() => items.reduce((s, i) => s + i.rate * i.qty, 0), [items])
  const discAmt   = Number(discount) || 0
  const total     = Math.max(0, subtotal - discAmt)
  const advAmt    = Number(advance)  || 0
  const balance   = Math.max(0, total - advAmt)

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate('/billing')}>
        <ArrowLeft size={16}/> Back to Billing
      </button>

      <div className={styles.layout}>
        {/* Left: service selector */}
        <div className={styles.left}>
          <Card padding="md" className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Add Services</h3>
              <Button variant="outline" icon={Package} size="sm" onClick={() => setShowPkgs(s=>!s)}>
                Packages
              </Button>
            </div>

            {/* Package selector */}
            {showPkgs && (
              <div className={styles.pkgList}>
                {PACKAGES.map(p => (
                  <div key={p.id} className={styles.pkgCard}>
                    <div>
                      <div className={styles.pkgName}>{p.name}</div>
                      <div className={styles.pkgIncludes}>{p.includes.join(' · ')}</div>
                    </div>
                    <div className={styles.pkgRight}>
                      <span className={styles.pkgPrice}>{fmt(p.price)}</span>
                      <Button size="sm" onClick={() => addPackage(p)}>Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Category filter */}
            <div className={styles.catFilters}>
              {CATEGORIES.map(c => (
                <button key={c}
                  className={`${styles.catBtn} ${catFilter === c ? styles.catActive : ''}`}
                  onClick={() => setCatFilter(c)}>{c}</button>
              ))}
            </div>

            {/* Service grid */}
            <div className={styles.serviceGrid}>
              {filteredServices.map(svc => (
                <button key={svc.id} className={styles.svcCard} onClick={() => addService(svc)}>
                  <div className={styles.svcName}>{svc.name}</div>
                  <div className={styles.svcRate}>{fmt(svc.rate)}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: invoice builder */}
        <div className={styles.right}>
          {/* Patient */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Patient</h3>
            <div className={styles.grid2}>
              <Input label="Patient ID" value={patient.id}
                onChange={e => setPatient(p => ({ ...p, id: e.target.value }))}/>
              <Input label="Patient Name" value={patient.name}
                onChange={e => setPatient(p => ({ ...p, name: e.target.value }))}/>
            </div>
          </Card>

          {/* Line items */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Invoice Items</h3>
            {items.length === 0
              ? <p className={styles.emptyItems}>← Add services from the left panel</p>
              : (
                <div className={styles.itemList}>
                  {items.map(item => (
                    <div key={item.id} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{item.name}</span>
                        <Badge variant="default" size="sm">{item.category}</Badge>
                      </div>
                      <div className={styles.itemControls}>
                        <div className={styles.qtyControl}>
                          <button className={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                          <span className={styles.qtyVal}>{item.qty}</span>
                          <button className={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                        </div>
                        <span className={styles.itemTotal}>{fmt(item.rate * item.qty)}</span>
                        <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                          <X size={12}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </Card>

          {/* Payment summary */}
          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Payment Summary</h3>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <input className={styles.inlineInput} type="number" placeholder="0"
                  value={discount} onChange={e => setDiscount(e.target.value)}/>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>

            <div className={styles.paymentFields}>
              <div className={styles.grid2}>
                <Input label="Advance / Paid Now" type="number" value={advance}
                  onChange={e => setAdvance(e.target.value)} placeholder="0" suffix="₹"/>
                <Select label="Payment Method" value={payMethod}
                  onChange={e => setPayMethod(e.target.value)} options={PAYMENT_METHODS}/>
              </div>

              {balance > 0 && (
                <div className={styles.balanceBanner}>
                  Outstanding Balance: <strong>{fmt(balance)}</strong>
                </div>
              )}
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
              <label className={styles.notesLabel}>Notes</label>
              <textarea className={styles.textarea} rows={2}
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Insurance details, remarks..."/>
            </div>

            <div className={styles.formFooter}>
              <Button variant="secondary" onClick={() => navigate('/billing')}>Cancel</Button>
              <Button icon={Save}
                onClick={() => { alert('Invoice saved!'); navigate('/billing') }}>
                Save Invoice
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}