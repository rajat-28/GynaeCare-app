import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { patientApi, fertilityApi } from '@services/api'

const TREATMENT_TYPES = [
  { value: 'natural', label: 'Natural Cycle' },
  { value: 'iui',     label: 'IUI' },
  { value: 'ivf',     label: 'IVF' },
  { value: 'icsi',    label: 'ICSI' },
  { value: 'fet',     label: 'FET (Frozen Embryo Transfer)' },
  { value: 'other',   label: 'Other' },
]

export default function FertilityNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')
  const episodeId = searchParams.get('episodeId')

  const [patient, setPatient] = useState(null)
  const [form, setForm] = useState({
    lmp: '',
    cycleLength: 28,
    treatmentType: 'ivf',
    cycleNumber: 1,
    cycleStartDate: new Date().toISOString().split('T')[0],
    infertilityDurationMonths: 12,
    infertilityType: 'Primary',
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
      await fertilityApi.createCycle({
        ...form,
        patientId,
        episodeId,
        cycleLength: parseInt(form.cycleLength),
        cycleNumber: parseInt(form.cycleNumber),
        infertilityDurationMonths: parseInt(form.infertilityDurationMonths),
      })
      navigate(`/fertility/patient/${patientId}`)
    } catch (err) {
      console.error(err)
      alert('Failed to create fertility cycle')
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
        <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>Start New Fertility Cycle</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Patient: <strong>{patient?.name || 'Loading...'}</strong> ({patient?.id?.slice(0,8)})
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card padding="md" title="Cycle Configuration">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input label="LMP Date" type="date" required value={form.lmp} onChange={e => setForm({...form, lmp: e.target.value})} />
                <Input label="Cycle Length (Days)" type="number" value={form.cycleLength} onChange={e => setForm({...form, cycleLength: e.target.value})} />
                <Input label="Cycle Start Date" type="date" value={form.cycleStartDate} onChange={e => setForm({...form, cycleStartDate: e.target.value})} />
                <Input label="Cycle Number" type="number" value={form.cycleNumber} onChange={e => setForm({...form, cycleNumber: e.target.value})} />
              </div>
            </Card>

            <Card padding="md" title="Infertility History">
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input label="Duration (Months)" type="number" value={form.infertilityDurationMonths} onChange={e => setForm({...form, infertilityDurationMonths: e.target.value})} />
                  <Select 
                    label="Infertility Type" 
                    value={form.infertilityType} 
                    onChange={e => setForm({...form, infertilityType: e.target.value})}
                    options={['Primary', 'Secondary']}
                  />
               </div>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card padding="md" title="Treatment Plan">
               <Select 
                 label="Treatment Type" 
                 required
                 value={form.treatmentType} 
                 onChange={e => setForm({...form, treatmentType: e.target.value})}
                 options={TREATMENT_TYPES}
               />
               <div style={{ marginTop: '24px' }}>
                  <Button type="submit" icon={Save} loading={submitting} style={{ width: '100%' }}>Create Cycle</Button>
                  <Button variant="ghost" onClick={() => navigate(-1)} style={{ width: '100%', marginTop: '8px' }}>Cancel</Button>
               </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
