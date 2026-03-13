import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Printer } from 'lucide-react'
import Button from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import SectionComplaints    from './sections/SectionComplaints'
import SectionMenstrual     from './sections/SectionMenstrual'
import SectionObstetric     from './sections/SectionObstetric'
import SectionSurgical      from './sections/SectionSurgical'
import SectionExamination   from './sections/SectionExamination'
import SectionDiagnosis     from './sections/SectionDiagnosis'
import SectionPrescription  from './sections/SectionPrescription'
import SectionInvestigation from './sections/SectionInvestigation'
import SectionAdvice        from './sections/SectionAdvice'
import styles from './OPDNew.module.css'

const SECTIONS = [
  'Chief Complaints', 'Menstrual History', 'Obstetric History',
  'Surgical History', 'Clinical Examination', 'Diagnosis',
  'Prescription', 'Investigations', 'Advice & Follow-up',
]

const INITIAL = {
  patientId: 'P001', patientName: 'Priya Sharma',
  date: new Date().toISOString().split('T')[0],
  complaints: [], complaintsNote: '',
  menstrual: { cycleRegularity:'', duration:'', dysmenorrhea: false, pmsSymptoms: false },
  obstetric: { gravida:'', para:'', abortions:'', living:'', prevCSection: false },
  surgicalHistory: [], surgicalNote: '',
  perAbdomen:   { tenderness: false, mass: false, uterineSize: '' },
  perSpeculum:  { cervixCondition: '', discharge: '', lesions: '' },
  perVaginal:   { uterinePosition: '', adnexalMass: '', tenderness: false },
  generalExam:  { bp:'', pulse:'', weight:'', height:'', pallor: false, oedema: false },
  diagnosis: [], diagnosisNote: '',
  medicines: [],
  investigations: [],
  advice: [], adviceNote: '',
  followUp: '', followUpNote: '',
  doctorNote: '',
}

export default function OPDNew() {
  const navigate = useNavigate()
  const [data, setData]         = useState(INITIAL)
  const [activeSection, setActiveSection] = useState(0)

  const update = fields => setData(d => ({ ...d, ...fields }))

  const sectionComponents = [
    <SectionComplaints    data={data} update={update} />,
    <SectionMenstrual     data={data} update={update} />,
    <SectionObstetric     data={data} update={update} />,
    <SectionSurgical      data={data} update={update} />,
    <SectionExamination   data={data} update={update} />,
    <SectionDiagnosis     data={data} update={update} />,
    <SectionPrescription  data={data} update={update} />,
    <SectionInvestigation data={data} update={update} />,
    <SectionAdvice        data={data} update={update} />,
  ]

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate('/opd')}>
        <ArrowLeft size={16}/> Back to OPD
      </button>

      {/* Patient header strip */}
      <div className={styles.patientStrip}>
        <div className={styles.patientAvatar}>PS</div>
        <div>
          <div className={styles.patientName}>{data.patientName}</div>
          <div className={styles.patientMeta}>ID: {data.patientId} · 28 yrs · Female</div>
        </div>
        <div className={styles.dateField}>
          <label>Consultation Date</label>
          <input type="date" value={data.date}
            onChange={e => update({ date: e.target.value })}
            className={styles.dateInput}/>
        </div>
        <div className={styles.stripActions}>
          <Button variant="secondary" icon={Printer} size="sm">Print</Button>
          <Button icon={Save} size="sm"
            onClick={() => { alert('Saved! (connect to API)'); navigate('/opd') }}>
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
            <Button variant="secondary" onClick={() => setActiveSection(i => Math.max(0, i-1))}
              disabled={activeSection === 0}>
              ← Previous
            </Button>
            {activeSection < SECTIONS.length - 1
              ? <Button onClick={() => setActiveSection(i => i+1)}>Next →</Button>
              : <Button icon={Save}
                  onClick={() => { alert('Consultation saved!'); navigate('/opd') }}>
                  Save Consultation
                </Button>
            }
          </div>
        </Card>
      </div>
    </div>
  )
}