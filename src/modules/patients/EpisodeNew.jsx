import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, AlertCircle } from 'lucide-react'
import Button from '@components/ui/Button'
import { Card, CardHeader, CardTitle, CardBody } from '@components/ui/Card'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { patientApi, appointmentApi } from '@services/api'
import { EPISODE_TYPES } from './patientData'
import styles from './PatientProfile.module.css'
import { useAuth } from '@/store/index'

export default function EpisodeNew() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [data, setData] = useState({
    episodeType: 'opd',
    referredBy: '',
    notes: '',
  })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [patientName, setPatientName] = useState('')

  useEffect(() => {
    // Optionally fetch patient details to display name
    const fetchPatient = async () => {
      try {
        const res = await patientApi.getById(id)
        const patientData = res.data?.data || res.data
        setPatientName(patientData?.name || '')
      } catch (err) {
        console.error(err)
      }
    }
    if (id) fetchPatient()
  }, [id])

  const handleRegister = async () => {
    setSaving(true)
    setError('')
    try {
      if (!data.episodeType) {
        setError('Episode type is required.')
        return
      }

      await patientApi.addEpisode(id, {
        type: data.episodeType,
        title: data.notes || undefined,
      })

      if (user?.id) {
        await appointmentApi.create({
          patientId: id,
          doctorId: user.id,
          appointmentDate: new Date().toISOString(),
          reason: data.notes || 'New Episode Started',
          type: 'consultation'
        })
      }

      // After successful creation, navigate back to Patient profile
      navigate(`/patients/${id}`)

    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to add episode.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container">
      <button 
        className={styles.backBtn} 
        onClick={() => navigate(`/patients/${id}`)}
      >
        <ArrowLeft size={16}/> Back to Patient
      </button>

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--clr-danger-50)', color: 'var(--clr-danger-600)', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '8px', marginBottom: '16px' }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }}/>
          {error}
        </div>
      )}

      <Card padding="lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <CardHeader>
          <CardTitle>Add Episode {patientName ? `for ${patientName}` : ''}</CardTitle>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Start a new clinical episode.</p>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Select
              label="Episode Type" 
              required
              value={data.episodeType}
              onChange={e => setData(d => ({ ...d, episodeType: e.target.value }))}
              options={EPISODE_TYPES}
            />
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Additional Notes / Title</label>
              <textarea 
                rows={3}
                value={data.notes}
                placeholder="Chief complaint, reason for visit..."
                onChange={e => setData(d => ({ ...d, notes: e.target.value }))} 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #d1d5db', 
                  resize: 'vertical',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary-400, #3b82f6)'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button
                icon={Check}
                loading={saving}
                onClick={handleRegister}
              >
                {saving ? 'Saving...' : 'Create Episode'}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
