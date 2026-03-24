import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Phone, Calendar, User, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { patientApi } from '@services/api'
import styles from './PatientProfile.module.css'

const EPISODE_VARIANT = {
  opd: 'default', pregnancy: 'primary', fertility: 'teal',
  ultrasound: 'warning', procedure: 'danger', lab: 'success',
}

export default function PatientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const fromOPD = location.state?.fromOPD

  const [patient, setPatient] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [pRes, eRes] = await Promise.all([
          patientApi.getById(id),
          patientApi.getEpisodes(id),
        ])
        const pData = pRes.data?.data || pRes.data
        const eData = eRes.data?.data || eRes.data
        setPatient(pData)
        setEpisodes(Array.isArray(eData) ? eData : [])
      } catch (err) {
        setError('Failed to load patient.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="page-container">
      <p style={{ color: 'var(--text-muted)', padding: 'var(--space-8)' }}>Loading patient...</p>
    </div>
  )

  if (error) return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--clr-danger-600)', padding: 'var(--space-4)', background: 'var(--clr-danger-50)', borderRadius: 'var(--radius-lg)' }}>
        <AlertCircle size={15} /> {error}
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate(fromOPD ? '/opd' : '/patients')}>
        <ArrowLeft size={16} /> {fromOPD ? 'Back to OPD' : 'Back to Patients'}
      </button>

      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileLeft}>
          <div className={styles.profileAvatar}>
            {patient?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className={styles.profileName}>{patient?.name}</h1>
            <div className={styles.profileMeta}>
              {patient?.age && <span>{patient.age} yrs</span>}
              {patient?.phone && <span><Phone size={12} /> {patient.phone}</span>}
              {patient?.bloodGroup && <Badge variant="default">{patient.bloodGroup}</Badge>}
              {patient?.maritalStatus && <Badge variant="default">{patient.maritalStatus}</Badge>}
            </div>
          </div>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/patients/${id}/edit`)}>
          Edit Patient
        </Button>
      </div>

      <div className={styles.grid}>
        {/* Basic info */}
        <Card padding="md">
          <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
          <CardBody>
            <div className={styles.infoGrid}>
              {[
                ['Date of Birth', patient?.dob ? new Date(patient.dob).toLocaleDateString('en-IN') : '—'],
                ['Email', patient?.email || '—'],
                ['Phone', patient?.phone || '—'],
                ['Aadhaar', patient?.aadhaar || '—'],
                ['Occupation', patient?.occupation || '—'],
                ['Gender', patient?.gender || '—'],
              ].map(([label, value]) => (
                <div key={label} className={styles.infoRow}>
                  <span className={styles.infoLabel}>{label}</span>
                  <span className={styles.infoValue}>{value}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Gynae history */}
        <Card padding="md">
          <CardHeader><CardTitle>Gynaecological History</CardTitle></CardHeader>
          <CardBody>
            <div className={styles.infoGrid}>
              {[
                ['Menarche Age', patient?.menarcheAge ? `${patient.menarcheAge} yrs` : '—'],
                ['Cycle Length', patient?.cycleLength ? `${patient.cycleLength} days` : '—'],
                ['LMP', patient?.lastMenstrualPeriod ? new Date(patient.lastMenstrualPeriod).toLocaleDateString('en-IN') : '—'],
                ['Menopause', patient?.menopauseStatus ? 'Yes' : 'No'],
                ['Gravida', patient?.gravida ?? '—'],
                ['Parity', patient?.parity ?? '—'],
                ['Abortions', patient?.abortions ?? '—'],
                ['Living Children', patient?.livingChildren ?? '—'],
                ['Infertility', patient?.infertilityDuration || '—'],
                ['Contraception', patient?.contraceptionHistory || '—'],
              ].map(([label, value]) => (
                <div key={label} className={styles.infoRow}>
                  <span className={styles.infoLabel}>{label}</span>
                  <span className={styles.infoValue}>{String(value)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Episodes */}
        <Card padding="md" className={styles.fullWidth}>
          <CardHeader>
            <CardTitle>Clinical Episodes</CardTitle>
            <Badge variant="default">{episodes.length} episodes</Badge>
          </CardHeader>
          <CardBody>
            {episodes.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No episodes yet.</p>
              : (
                <div className={styles.episodeList}>
                  {episodes.map(ep => (
                    <div key={ep.id} className={styles.episodeItem}>
                      <Badge variant={EPISODE_VARIANT[ep.type] || 'default'}>
                        {ep.type}
                      </Badge>
                      <span className={styles.episodeTitle}>{ep.title || '—'}</span>
                      <span className={styles.episodeDate}>
                        <Calendar size={12} />
                        {ep.createdAt ? new Date(ep.createdAt).toLocaleDateString('en-IN') : '—'}
                      </span>
                      <Badge variant={ep.status === 'active' ? 'success' : 'default'} dot>
                        {ep.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )
            }
          </CardBody>
        </Card>
      </div>
    </div>
  )
}