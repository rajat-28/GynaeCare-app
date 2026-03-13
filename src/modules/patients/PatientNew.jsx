import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, User, Heart, Users, FileText } from 'lucide-react'
import Button from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import StepBasicInfo    from './steps/StepBasicInfo'
import StepGynaeHistory from './steps/StepGynaeHistory'
import StepPartnerInfo  from './steps/StepPartnerInfo'
import StepReview       from './steps/StepReview'
import styles from './PatientNew.module.css'

const STEPS = [
  { id: 1, label: 'Basic Info',      icon: User,     component: StepBasicInfo    },
  { id: 2, label: 'Gynae History',   icon: Heart,    component: StepGynaeHistory },
  { id: 3, label: 'Partner Profile', icon: Users,    component: StepPartnerInfo  },
  { id: 4, label: 'Review',          icon: FileText, component: StepReview       },
]

const INITIAL_DATA = {
  // Basic
  firstName: '', lastName: '', dob: '', gender: 'Female',
  phone: '', email: '', aadhaar: '', passport: '',
  address: '', city: '', state: '', pin: '',
  maritalStatus: '', occupation: '', bloodGroup: '', religion: '',
  // Gynae
  menarcheAge: '', cycleLength: '', cycleDuration: '',
  lmp: '', cycleRegularity: '', dysmenorrhea: false, pmsSymptoms: false,
  menopauseStatus: 'Pre-menopausal',
  gravida: '', para: '', living: '', abortions: '', previousCSection: false,
  infertilityDuration: '',
  contraceptionHistory: [],
  surgicalHistory: [],
  medicalHistory: '',
  allergies: '',
  // Partner
  partnerName: '', partnerAge: '', partnerOccupation: '',
  partnerMedicalHistory: '', semenAnalysisRef: '',
  // Meta
  episodeType: 'OPD Consultation',
  referredBy: '', notes: '',
}

export default function PatientNew() {
  const navigate = useNavigate()
  const [step, setStep]   = useState(1)
  const [data, setData]   = useState(INITIAL_DATA)

  const update = fields => setData(d => ({ ...d, ...fields }))

  const CurrentStep = STEPS[step - 1].component

  return (
    <div className="page-container">
      {/* Back */}
      <button className={styles.backBtn} onClick={() => navigate('/patients')}>
        <ArrowLeft size={16} /> Back to Patients
      </button>

      <div className={styles.layout}>
        {/* Stepper sidebar */}
        <div className={styles.stepper}>
          <div className={styles.stepperHeader}>
            <h2 className={styles.stepperTitle}>New Patient</h2>
            <p className={styles.stepperSub}>Registration Form</p>
          </div>
          <div className={styles.steps}>
            {STEPS.map(s => {
              const Icon = s.icon
              const done    = step > s.id
              const current = step === s.id
              return (
                <div
                  key={s.id}
                  className={`${styles.stepItem} ${done ? styles.done : ''} ${current ? styles.current : ''}`}
                  onClick={() => done && setStep(s.id)}
                >
                  <div className={styles.stepCircle}>
                    {done ? <Check size={14} strokeWidth={3} /> : <Icon size={15} />}
                  </div>
                  <div className={styles.stepMeta}>
                    <span className={styles.stepNum}>Step {s.id}</span>
                    <span className={styles.stepLabel}>{s.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form area */}
        <div className={styles.formArea}>
          <Card padding="lg">
            <CurrentStep data={data} update={update} />

            <div className={styles.formFooter}>
              <Button
                variant="secondary"
                icon={ArrowLeft}
                onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/patients')}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>

              {step < STEPS.length ? (
                <Button icon={ArrowRight} iconPosition="right" onClick={() => setStep(s => s + 1)}>
                  Continue
                </Button>
              ) : (
                <Button
                  icon={Check}
                  onClick={() => { alert('Patient registered! (connect to API)'); navigate('/patients') }}
                >
                  Register Patient
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}