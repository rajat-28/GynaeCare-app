import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, Activity, CheckCircle, FlaskConical, Info, FileText } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { patientApi } from '@services/api'
import styles from './Fertility.module.css'

export default function FertilityPatientView() {
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
      
      // Filter for fertility type episodes
      eData = eData.filter(ep => ep.type?.toLowerCase() === 'fertility')
      eData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      // Sort follicular studies within cycles
      eData.forEach(ep => {
        if (ep.fertilityCycle?.follicularStudies) {
          ep.fertilityCycle.follicularStudies.sort((a,b) => new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime())
        }
      })
      
      setPatient(pData)
      setEpisodes(eData)
    }).catch(console.error).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading history...</p></div>
  if (!patient) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--clr-danger-600)' }}>Patient not found.</p></div>

  const latestEpisode = episodes[0]

  return (
    <div className="page-container" style={{ paddingBottom: '64px' }}>
      <button 
        onClick={() => navigate('/fertility')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '16px', color: 'var(--clr-primary-600)', fontWeight: 500 }}
      >
        <ArrowLeft size={16}/> Back to Fertility List
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>Fertility History: {patient.name}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>Patient ID: {patient.id?.slice(0,8)} · Age: {patient.age || '—'}</p>
        </div>
        
        <Button icon={Plus} onClick={() => {
           if (latestEpisode) {
             navigate(`/fertility/new?episodeId=${latestEpisode.id}&patientId=${patient.id}`)
           } else {
             alert("No active Fertility episode. Please add a Fertility episode from the Patients screen first.")
           }
        }}>
          New Cycle
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 16px' }}>
        {episodes.length === 0 ? (
          <Card padding="md"><p style={{color: 'var(--text-muted)', margin: 0}}>No fertility history recorded for this patient.</p></Card>
        ) : (
          episodes.map(episode => {
            const cycle = episode.fertilityCycle
            const studies = cycle?.follicularStudies || []

            return (
              <div key={episode.id}>
                <Card padding="md" style={{ marginBottom: '16px', background: 'var(--clr-slate-50)', border: '1px solid var(--clr-gray-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Cycle Started:</strong> <br/>{new Date(cycle?.cycleStartDate || episode.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium'})}</div>
                      <div>
                        <strong style={{ color: 'var(--text-muted)' }}>Treatment:</strong> <br/>
                        <Badge variant="primary" size="sm">{cycle?.treatmentType?.replace(/_/g, ' ') || 'IVF'}</Badge>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-muted)' }}>Cycle Status:</strong> <br/>
                        <Badge variant={cycle?.status === 'ongoing' ? 'warning' : cycle?.status === 'completed' ? 'success' : 'default'} dot>{cycle?.status}</Badge>
                      </div>
                      {cycle?.outcome && (
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Outcome:</strong> <br/>
                          <span style={{ fontWeight: 600, color: 'var(--clr-success-700)' }}>{cycle.outcome}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                <h4 style={{ margin: '0 0 12px 16px', color: 'var(--text-secondary)' }}>Follicular Monitoring ({studies.length})</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', paddingLeft: '16px' }}>
                  {studies.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No follicular studies recorded in this cycle.</p>
                  ) : (
                    studies.map(study => (
                      <Card key={study.id} padding="md" style={{ borderLeft: '3px solid var(--clr-teal-400)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--clr-gray-100)' }}>
                           <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold' }}>
                              <FlaskConical size={14} style={{ color: 'var(--clr-teal-600)' }}/>
                              CD {study.cycleDay || '—'}
                           </div>
                           <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                             {new Date(study.studyDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                           </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                           <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Right Ovary</div>
                              <div style={{ fontSize: '13px' }}>{study.rightOvaryFollicles?.join(', ') || 'None'}</div>
                           </div>
                           <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Left Ovary</div>
                              <div style={{ fontSize: '13px' }}>{study.leftOvaryFollicles?.join(', ') || 'None'}</div>
                           </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                           <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>ET</div>
                              <div style={{ fontWeight: '600', color: 'var(--clr-primary-600)' }}>{study.endometrialThickness} mm</div>
                           </div>
                           <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Pattern</div>
                              <div style={{ fontSize: '13px' }}>{study.endometrialPattern || '—'}</div>
                           </div>
                           {study.ovulationConfirmed && <Badge variant="success" size="sm">Ovulated</Badge>}
                        </div>

                        {study.advice && (
                          <div style={{ padding: '8px', background: 'var(--clr-teal-50)', borderRadius: '6px', fontSize: '12px', color: 'var(--clr-teal-700)' }}>
                             <strong>Advice:</strong> {study.advice}
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                  <Card padding="md" style={{ border: '2px dashed var(--clr-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'none' }}>
                     <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Plus size={24} style={{ margin: '0 auto 8px' }}/>
                        <div style={{ fontSize: '14px' }}>Add Follicular Study</div>
                     </div>
                  </Card>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
