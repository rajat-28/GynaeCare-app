import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Printer } from 'lucide-react'
import Button from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import { patientApi, consultationApi } from '@services/api'
import SectionComplaints from './sections/SectionComplaints'
import SectionMenstrual from './sections/SectionMenstrual'
import SectionObstetric from './sections/SectionObstetric'
import SectionSurgical from './sections/SectionSurgical'
import SectionExamination from './sections/SectionExamination'
import SectionPrescription from './sections/SectionPrescription'
import SectionInvestigation from './sections/SectionInvestigation'
import SectionAdvice from './sections/SectionAdvice'
import styles from './OPDNew.module.css'

const SECTIONS = [
  'Chief Complaints', 'Menstrual History', 'Obstetric History',
  'Surgical History', 'Clinical Examination',
  'Prescription', 'Investigations', 'Advice & Follow-up',
]

const INITIAL = {
  patientId: 'P001', patientName: 'Priya Sharma',
  date: new Date().toISOString().split('T')[0],
  complaints: [], complaintsNote: '',
  menstrual: { cycleRegularity: '', duration: '', dysmenorrhea: false, pmsSymptoms: false },
  obstetric: { gravida: '', para: '', abortions: '', living: '', prevCSection: false },
  surgicalHistory: [], surgicalNote: '',
  perAbdomen: { tenderness: false, mass: false, uterineSize: '' },
  perSpeculum: { cervixCondition: '', discharge: '', lesions: '' },
  perVaginal: { uterinePosition: '', adnexalMass: '', tenderness: false },
  generalExam: { bp: '', pulse: '', weight: '', height: '', pallor: false, oedema: false },
  medicines: [],
  investigations: [],
  advice: [], adviceNote: '',
  followUp: '', followUpNote: '',
  doctorNote: '',
}

export default function OPDNew() {
  const navigate = useNavigate()
  const { id } = useParams() // consultation id for edit
  const [searchParams] = useSearchParams()
  const patientIdParams = searchParams.get('patientId')
  const episodeIdParams = searchParams.get('episodeId')

  const [data, setData] = useState(INITIAL)
  const [activeSection, setActiveSection] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      consultationApi.getById(id)
        .then(res => {
          const c = res.data
          const p = c.patient || {}
          setData(d => ({
            ...d,
            patientId: p.patientId || p.id?.slice(0, 8) || '—',
            patientName: p.name || 'Unknown',
            age: p.age || '—',

            complaints: c.chiefComplaint || [],
            menstrual: {
              cycleRegularity: c.menstrualHistory?.cycleRegularity || '',
              duration: c.menstrualHistory?.duration?.toString() || '',
              dysmenorrhea: c.menstrualHistory?.dysmenorrhea || false,
              pmsSymptoms: false
            },
            obstetric: {
              gravida: c.obstetricHistory?.gravida?.toString() || '',
              para: c.obstetricHistory?.para?.toString() || '',
              abortions: c.obstetricHistory?.abortion?.toString() || '',
              living: c.obstetricHistory?.liveBirths?.toString() || '',
              prevCSection: false
            },
            surgicalHistory: c.surgicalHistory || [],
            perAbdomen: {
              tenderness: c.examination?.perAbdomen?.tenderness === 'Yes',
              mass: c.examination?.perAbdomen?.mass === 'Yes',
              uterineSize: c.examination?.perAbdomen?.uterineSize || ''
            },
            perSpeculum: {
              discharge: c.examination?.perSpeculum?.discharge || '',
              cervixCondition: c.examination?.perSpeculum?.cervixCondition || '',
              lesions: c.examination?.perSpeculum?.lesions || ''
            },
            perVaginal: {
              uterinePosition: c.examination?.perVaginal?.uterinePosition || '',
              tenderness: c.examination?.perVaginal?.tenderness === 'Yes',
              adnexalMass: c.examination?.perVaginal?.adnexalMass || ''
            },
            medicines: c.prescription ? [{ name: c.prescription, frequency: 'As prescribed', duration: '' }] : [],
            followUp: c.nextFollowUp ? new Date(c.nextFollowUp).toISOString().split('T')[0] : ''
          }))
        })
        .catch(console.error)
    } else if (patientIdParams) {
      patientApi.getById(patientIdParams)
        .then(res => {
          const p = res.data
          setData(d => ({
            ...d,
            patientId: p.patientId || p.id?.slice(0, 8) || '—',
            patientName: p.name || 'Unknown',
            age: p.age || '—'
          }))
        })
        .catch(console.error)
    }
  }, [id, patientIdParams])

  const update = fields => setData(d => ({ ...d, ...fields }))

  const handleSave = async () => {
    if (!id && (!episodeIdParams || !patientIdParams)) {
      alert("Missing patient or episode context. Cannot save consultation.")
      return
    }

    if (data.complaints.length === 0 && !data.complaintsNote?.trim()) {
      alert("At least one Chief Complaint must be selected or entered before saving.")
      return
    }

    const g = parseInt(data.obstetric.gravida) || 0
    const p = parseInt(data.obstetric.para) || 0
    const a = parseInt(data.obstetric.abortions) || 0
    if ((p > 0 || a > 0) && g < p + a) {
      if (!window.confirm("Warning: Para + Abortions exceeds Gravida. Save anyway?")) {
        return
      }
    }

    try {
      setSaving(true)
      const payload = {
        chiefComplaint: data.complaints,
        menstrualHistory: {
          cycleRegularity: data.menstrual.cycleRegularity,
          duration: parseInt(data.menstrual.duration) || undefined,
          dysmenorrhea: data.menstrual.dysmenorrhea,
        },
        obstetricHistory: {
          gravida: parseInt(data.obstetric.gravida) || undefined,
          para: parseInt(data.obstetric.para) || undefined,
          abortion: parseInt(data.obstetric.abortions) || undefined,
          liveBirths: parseInt(data.obstetric.living) || undefined,
        },
        surgicalHistory: data.surgicalHistory,
        examination: {
          perAbdomen: {
            tenderness: data.perAbdomen.tenderness ? 'Yes' : 'No',
            mass: data.perAbdomen.mass ? 'Yes' : 'No',
            uterineSize: data.perAbdomen.uterineSize
          },
          perSpeculum: {
            discharge: data.perSpeculum.discharge,
            cervixCondition: data.perSpeculum.cervixCondition,
            lesions: data.perSpeculum.lesions
          },
          perVaginal: {
            uterinePosition: data.perVaginal.uterinePosition,
            tenderness: data.perVaginal.tenderness ? 'Yes' : 'No',
            adnexalMass: data.perVaginal.adnexalMass
          }
        },
        prescription: data.medicines.map(m => `${m.name} (${m.frequency})`).join(', ') || 'No prescription',
        nextFollowUp: data.followUp || undefined,
      }

      if (id) {
        await consultationApi.update(id, payload)
        navigate(`/opd/consultation/${id}`)
      } else {
        payload.episodeId = episodeIdParams
        payload.patientId = patientIdParams
        await consultationApi.create(payload)
        navigate('/opd')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save consultation. Check console.')
    } finally {
      setSaving(false)
    }
  }

  const sectionComponents = [
    <SectionComplaints data={data} update={update} />,
    <SectionMenstrual data={data} update={update} />,
    <SectionObstetric data={data} update={update} />,
    <SectionSurgical data={data} update={update} />,
    <SectionExamination data={data} update={update} />,
    <SectionPrescription data={data} update={update} />,
    <SectionInvestigation data={data} update={update} />,
    <SectionAdvice data={data} update={update} />,
  ]

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Patient header strip */}
      <div className={styles.patientStrip}>
        <div className={styles.patientAvatar}>PS</div>
        <div>
          <div className={styles.patientName}>{data.patientName || 'Loading...'}</div>
          <div className={styles.patientMeta}>ID: {data.patientId} · {data.age || '—'} yrs</div>
        </div>
        <div className={styles.dateField}>
          <label>Consultation Date</label>
          <div className={styles.dateInput} style={{ display: 'flex', alignItems: 'center', cursor: 'default', userSelect: 'none' }}>
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <div className={styles.stripActions}>
          {/* <Button variant="secondary" icon={Printer} size="sm">Print</Button> */}
          <Button icon={Save} size="sm" loading={saving}
            onClick={handleSave}>
            Save Consultation
          </Button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Section nav */}
        <nav className={styles.sectionNav}>
          {SECTIONS.map((s, i) => (
            <button
              key={s}
              className={`${styles.navBtn} ${activeSection === i ? styles.navActive : ''}`}
              onClick={() => setActiveSection(i)}
            >
              <span className={styles.navNum}>{i + 1}</span>
              {s}
            </button>
          ))}
        </nav>

        {/* Active section */}
        <Card padding="lg" className={styles.formCard}>
          {sectionComponents[activeSection]}

          <div className={styles.formFooter}>
            <Button variant="secondary" onClick={() => setActiveSection(i => Math.max(0, i - 1))}
              disabled={activeSection === 0}>
              ← Previous
            </Button>
            {activeSection < SECTIONS.length - 1
              ? <Button onClick={() => setActiveSection(i => i + 1)}>Next →</Button>
              : <Button icon={Save} loading={saving}
                onClick={handleSave}>
                Save Consultation
              </Button>
            }
          </div>
        </Card>
      </div>
    </div>
  )
}