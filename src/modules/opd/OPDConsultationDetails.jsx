import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Edit } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@components/ui/Card'
import Button from '@components/ui/Button'
import { consultationApi } from '@services/api'
import Badge from '@components/ui/Badge'

export default function OPDConsultationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [consultation, setConsultation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    consultationApi.getById(id)
      .then(res => {
        setConsultation(res.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading consultation...</p></div>
  if (!consultation) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--clr-danger-600)' }}>Consultation not found.</p></div>

  const { patient, episode } = consultation

  const renderSection = (title, content) => (
    <Card padding="md" style={{ marginBottom: '16px' }}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardBody>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {content}
        </div>
      </CardBody>
    </Card>
  )

  const renderGridSection = (title, items) => (
    <Card padding="md" style={{ marginBottom: '16px' }}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardBody>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
          {items.map(item => (
            <div key={item.label}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>{item.label}</div>
              <div style={{ color: 'var(--text-primary)' }}>{item.value || '—'}</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '16px', color: 'var(--clr-primary-600)', fontWeight: 500 }}
      >
        <ArrowLeft size={16}/> Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>Consultation Record</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            {patient?.name} · {new Date(consultation.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium'})} at {new Date(consultation.createdAt).toLocaleTimeString('en-IN', { timeStyle: 'short'})}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" icon={Edit} onClick={() => navigate(`/opd/consultation/${id}/edit`)}>Edit</Button>
          <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
        {consultation.chiefComplaint?.length > 0 && 
          renderSection('Chief Complaints', consultation.chiefComplaint.join(', '))
        }

        {consultation.menstrualHistory && Object.keys(consultation.menstrualHistory).length > 0 && 
          renderGridSection('Menstrual History', [
            { label: 'Cycle Regularity', value: consultation.menstrualHistory.cycleRegularity },
            { label: 'Duration (days)', value: consultation.menstrualHistory.duration },
            { label: 'Dysmenorrhea', value: consultation.menstrualHistory.dysmenorrhea ? 'Yes' : 'No' },
          ])
        }

        {consultation.obstetricHistory && Object.keys(consultation.obstetricHistory).length > 0 && 
          renderGridSection('Obstetric History', [
            { label: 'Gravida', value: consultation.obstetricHistory.gravida },
            { label: 'Para', value: consultation.obstetricHistory.para },
            { label: 'Abortions', value: consultation.obstetricHistory.abortion },
            { label: 'Living Children', value: consultation.obstetricHistory.liveBirths },
          ])
        }

        {consultation.surgicalHistory?.length > 0 && 
          renderSection('Surgical History', consultation.surgicalHistory.join(', '))
        }

        {consultation.examination && 
          <Card padding="md" style={{ marginBottom: '16px' }}>
            <CardHeader><CardTitle>Clinical Examination</CardTitle></CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px' }}>
                {consultation.examination.perAbdomen && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Per Abdomen</h4>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Tenderness:</strong> {consultation.examination.perAbdomen.tenderness || '—'}</div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Mass:</strong> {consultation.examination.perAbdomen.mass || '—'}</div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Uterine Size:</strong> {consultation.examination.perAbdomen.uterineSize || '—'}</div>
                    </div>
                  </div>
                )}
                {consultation.examination.perSpeculum && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Per Speculum</h4>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Discharge:</strong> {consultation.examination.perSpeculum.discharge || '—'}</div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Cervix:</strong> {consultation.examination.perSpeculum.cervixCondition || '—'}</div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Lesions:</strong> {consultation.examination.perSpeculum.lesions || '—'}</div>
                    </div>
                  </div>
                )}
                {consultation.examination.perVaginal && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Per Vaginal</h4>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Uterus Position:</strong> {consultation.examination.perVaginal.uterinePosition || '—'}</div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Tenderness:</strong> {consultation.examination.perVaginal.tenderness || '—'}</div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Adnexal Mass:</strong> {consultation.examination.perVaginal.adnexalMass || '—'}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        }

        {consultation.prescription && renderSection('Prescription', consultation.prescription)}
      </div>
    </div>
  )
}
