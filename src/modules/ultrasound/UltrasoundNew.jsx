import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { patientApi, ultrasoundApi } from '@services/api'

const SCAN_CATEGORIES = [
  { value: 'obstetric',     label: 'Obstetric' },
  { value: 'gynaecological', label: 'Gynaecological' },
]

const SCAN_TYPES = [
  { value: 'dating',           label: 'Dating Scan' },
  { value: 'nt',               label: 'NT Scan' },
  { value: 'tiffa',            label: 'TIFFA / Anomaly' },
  { value: 'growth',           label: 'Growth Scan' },
  { value: 'doppler',          label: 'Doppler' },
  // { value: 'follicular_study', label: 'Follicular Study' },
  // { value: 'pcos_mapping',     label: 'PCOS Mapping' },
  { value: 'other',            label: 'Other' },
]

export default function UltrasoundNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')
  const episodeId = searchParams.get('episodeId')

  const [patient, setPatient] = useState(null)
  const [form, setForm] = useState({
    scanType: 'dating',
    scanCategory: 'obstetric',
    scanDate: new Date().toISOString().split('T')[0],
    impression: '',
    reportNotes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (patientId) {
      patientApi.getById(patientId).then(res => {
        setPatient(res.data?.data || res.data)
      }).catch(console.error)
    }
  }, [patientId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId || !episodeId) return alert('Patient or Episode ID missing')
    
    setSubmitting(true)
    try {
      await ultrasoundApi.create({
        ...form,
        patientId,
        episodeId,
      })
      navigate(`/ultrasound/patient/${patientId}`)
    } catch (err) {
      console.error(err)
      alert('Failed to save ultrasound report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '16px 0', color: 'var(--clr-primary-600)', fontWeight: 500 }}
      >
        <ArrowLeft size={16}/> Back
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>New Ultrasound Report</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Patient: <strong>{patient?.name || 'Loading...'}</strong> ({patient?.id?.slice(0,8)})
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card padding="md" title="Scan Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Select 
                  label="Category" 
                  required
                  value={form.scanCategory} 
                  onChange={e => setForm({...form, scanCategory: e.target.value})}
                  options={SCAN_CATEGORIES}
                />
                <Select 
                  label="Scan Type" 
                  required
                  value={form.scanType} 
                  onChange={e => setForm({...form, scanType: e.target.value})}
                  options={SCAN_TYPES}
                />
              </div>
              <div style={{ marginTop: '16px' }}>
                <Input label="Scan Date" type="date" required value={form.scanDate} onChange={e => setForm({...form, scanDate: e.target.value})} />
              </div>
            </Card>

            <Card padding="md" title="Notes & Findings">
               <textarea 
                 style={{ width: '100%', minHeight: '100px', padding: '12px', border: '1px solid var(--border-default)', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                 placeholder="Additional clinical notes..."
                 value={form.reportNotes}
                 onChange={e => setForm({...form, reportNotes: e.target.value})}
               />
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card padding="md" title="Impression">
               <textarea 
                 style={{ width: '100%', minHeight: '120px', padding: '12px', border: '1px solid var(--border-default)', borderRadius: '8px', outline: 'none', fontWeight: '500' }}
                 placeholder="Final diagnosis/impression..."
                 required
                 value={form.impression}
                 onChange={e => setForm({...form, impression: e.target.value})}
               />
               <div style={{ marginTop: '24px' }}>
                  <Button type="submit" icon={Save} loading={submitting} style={{ width: '100%' }}>Save Report</Button>
                  <Button variant="ghost" onClick={() => navigate(-1)} style={{ width: '100%', marginTop: '8px' }}>Cancel</Button>
               </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
