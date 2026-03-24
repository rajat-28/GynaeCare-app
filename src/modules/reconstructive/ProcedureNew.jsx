import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { patientApi, procedureApi } from '@services/api'

const PROCEDURE_TYPES = [
  { value: 'vaginal_rejuvenation', label: 'Vaginal Rejuvenation' },
  { value: 'labiaplasty',          label: 'Labiaplasty' },
  { value: 'hymenoplasty',         label: 'Hymenoplasty' },
  { value: 'prp_therapy',          label: 'PRP Therapy' },
  { value: 'laser_tightening',     label: 'Laser Vaginal Tightening' },
  { value: 'sui_treatment',        label: 'SUI Treatment' },
  { value: 'other',                label: 'Other' },
]

export default function ProcedureNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')
  const episodeId = searchParams.get('episodeId')

  const [patient, setPatient] = useState(null)
  const [form, setForm] = useState({
    procedureType: 'laser_tightening',
    plannedSessions: 3,
    clinicalNotes: '',
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
      await procedureApi.create({
        ...form,
        patientId,
        episodeId,
        plannedSessions: parseInt(form.plannedSessions),
      })
      navigate(`/reconstructive/patient/${patientId}`)
    } catch (err) {
      console.error(err)
      alert('Failed to create procedure')
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
        <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>New Procedure Case</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Patient: <strong>{patient?.name || 'Loading...'}</strong> ({patient?.id?.slice(0,8)})
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card padding="md" title="Procedure Details">
              <Select 
                label="Procedure Type" 
                required
                value={form.procedureType} 
                onChange={e => setForm({...form, procedureType: e.target.value})}
                options={PROCEDURE_TYPES}
              />
              <div style={{ marginTop: '16px' }}>
                <Input label="Planned Sessions" type="number" required value={form.plannedSessions} onChange={e => setForm({...form, plannedSessions: e.target.value})} />
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card padding="md" title="Clinical Notes">
               <textarea 
                 style={{ width: '100%', minHeight: '120px', padding: '12px', border: '1px solid var(--border-default)', borderRadius: '8px', outline: 'none' }}
                 placeholder="Indications, specific requirements..."
                 value={form.clinicalNotes}
                 onChange={e => setForm({...form, clinicalNotes: e.target.value})}
               />
               <div style={{ marginTop: '24px' }}>
                  <Button type="submit" icon={Save} loading={submitting} style={{ width: '100%' }}>Create Procedure</Button>
               </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
