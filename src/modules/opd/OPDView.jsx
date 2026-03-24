import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { episodeApi } from '@services/api'

export default function OPDView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [episode, setEpisode] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    episodeApi.getById(id)
      .then(res => {
        setEpisode(res.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading episode details...</p></div>
  if (!episode) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--clr-danger-600)' }}>Episode not found.</p></div>

  const p = episode.patient || {}
  const consultations = episode.consultations || []

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate('/opd')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '16px', color: 'var(--clr-primary-600)', fontWeight: 500 }}
      >
        <ArrowLeft size={16}/> Back to OPD List
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>OPD Consultations: {p.name || 'Unknown Patient'}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>Patient ID: {p.id?.slice(0,8)} · Age: {p.age || '—'}</p>
        </div>
        <Button icon={Plus} onClick={() => navigate(`/opd/new?episodeId=${episode.id}&patientId=${p.id}`)}>
          New Consultation
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 16px' }}>
        <Card padding="md">
          <CardHeader>
            <CardTitle>Episode Overview</CardTitle>
            <Badge variant={episode.episodeStatus === 'active' ? 'success' : 'default'} dot>
              {episode.episodeStatus}
            </Badge>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', gap: '48px', color: 'var(--text-primary)', fontSize: '14px' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Start Date:</strong> <br/>{new Date(episode.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium'})}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Type:</strong> <br/><Badge>{episode.type}</Badge></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Title/Notes:</strong> <br/>{episode.title || 'Ongoing OPD Visit'}</div>
            </div>
          </CardBody>
        </Card>

        <h3 style={{ marginTop: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>Consultation History ({consultations.length})</h3>
        
        {consultations.length === 0 ? (
          <Card padding="md"><p style={{color: 'var(--text-muted)', margin: 0}}>No consultations recorded yet for this episode.</p></Card>
        ) : (
          consultations.map(c => (
            <Card key={c.id} padding="md" style={{ borderLeft: '4px solid var(--clr-primary-500)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--clr-gray-200)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: '600', color: 'var(--text-primary)' }}>
                  <Calendar size={16} style={{ color: 'var(--clr-primary-600)' }}/>
                  {new Date(c.createdAt).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(c.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit'})}
                </div>
                <Button size="sm" variant="ghost" icon={FileText} onClick={() => navigate(`/opd/consultation/${c.id}`)}>View Form</Button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Chief Complaint</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{c.chiefComplaint?.length > 0 ? c.chiefComplaint.join(', ') : '—'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Diagnosis</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{c.diagnosis || '—'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Prescription</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{c.prescription || '—'}</div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
