import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { patientApi } from '@services/api'

export default function OPDPatientView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      patientApi.getById(id),
      patientApi.getTimeline(id)
    ]).then(([pRes, eRes]) => {
      const pData = pRes.data?.data || pRes.data
      let eData = eRes.data?.data || eRes.data
      if (!Array.isArray(eData)) eData = []
      
      // Filter out only OPD and ensure everything is placed first
      eData = eData.filter(ep => ep.type?.toLowerCase() === 'opd')
      eData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      eData.forEach(ep => {
        if (ep.consultations) {
          ep.consultations.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
      })
      
      setPatient(pData)
      setEpisodes(eData)
    }).catch(console.error).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading patient history...</p></div>
  if (!patient) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--clr-danger-600)' }}>Patient not found.</p></div>

  const latestEpisode = episodes[0]
  const latestConsultation = latestEpisode?.consultations?.[0]
  
  let isExpired = false
  if (latestConsultation?.nextFollowUp) {
    const nextFollowUpDate = new Date(latestConsultation.nextFollowUp)
    const maxExpiryDate = new Date(nextFollowUpDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    if (new Date() > maxExpiryDate) {
      isExpired = true
    }
  }

  return (
    <div className="page-container" style={{ paddingBottom: '64px' }}>
      <button 
        onClick={() => navigate('/opd')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '16px', color: 'var(--clr-primary-600)', fontWeight: 500 }}
      >
        <ArrowLeft size={16}/> Back to OPD List
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>OPD History: {patient.name}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>Patient ID: {patient.id?.slice(0,8)} · Age: {patient.age || '—'}</p>
        </div>
        
        {!isExpired && (
          <Button icon={Plus} onClick={() => {
            if (latestEpisode) {
              navigate(`/opd/new?episodeId=${latestEpisode.id}&patientId=${patient.id}`)
            } else {
              alert("No active OPD episode to attach a consultation. Please add an OPD episode from the Patients screen first.")
            }
          }}>
            New Consultation
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 16px' }}>
        {episodes.length === 0 ? (
          <Card padding="md"><p style={{color: 'var(--text-muted)', margin: 0}}>No OPD history recorded for this patient.</p></Card>
        ) : (
          episodes.map(episode => (
            <div key={episode.id}>
              <Card padding="md" style={{ marginBottom: '16px', background: 'var(--clr-slate-50)', border: '1px solid var(--clr-gray-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: 'var(--text-primary)' }}>
                    <div><strong style={{ color: 'var(--text-muted)' }}>Episode Date:</strong> <br/>{new Date(episode.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium'})}</div>
                    <div><strong style={{ color: 'var(--text-muted)' }}>Status:</strong> <br/><Badge variant={episode.episodeStatus === 'active' ? 'success' : 'default'} dot>{episode.episodeStatus}</Badge></div>
                    <div><strong style={{ color: 'var(--text-muted)' }}>Notes:</strong> <br/>{episode.title || 'Ongoing OPD Visit'}</div>
                  </div>
                </div>
              </Card>

              <h4 style={{ margin: '0 0 12px 16px', color: 'var(--text-secondary)' }}>Consultations ({episode.consultations?.length || 0})</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '16px' }}>
                {!episode.consultations || episode.consultations.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No consultations found in this episode.</p>
                ) : (
                  episode.consultations.map(c => (
                    <Card key={c.id} padding="md" style={{ borderLeft: '4px solid var(--clr-primary-400)' }}>
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
                          <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Prescription</div>
                          <div style={{ color: 'var(--text-secondary)' }}>{c.prescription || '—'}</div>
                        </div>
                        {c.nextFollowUp && (
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Next Follow-up</div>
                            <div style={{ color: 'var(--text-secondary)' }}>{new Date(c.nextFollowUp).toLocaleDateString('en-IN', { dateStyle: 'medium'})}</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
