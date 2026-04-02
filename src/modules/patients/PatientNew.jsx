import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, User, Heart, Users, FileText, AlertCircle } from 'lucide-react'
import Button from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import StepBasicInfo    from './steps/StepBasicInfo'
import StepGynaeHistory from './steps/StepGynaeHistory'
import StepPartnerInfo  from './steps/StepPartnerInfo'
import StepReview       from './steps/StepReview'
import { patientApi, appointmentApi } from '@services/api'
import styles from './PatientNew.module.css'
import { useAuth } from '@/store/index'

const STEPS = [
  { id: 1, label: 'Basic Info',      icon: User,     component: StepBasicInfo    },
  { id: 2, label: 'Gynae History',   icon: Heart,    component: StepGynaeHistory },
  { id: 3, label: 'Partner Profile', icon: Users,    component: StepPartnerInfo  },
  { id: 4, label: 'Review',          icon: FileText, component: StepReview       },
]

const INITIAL_DATA = {
  // Basic — maps to API fields
  firstName: '', lastName: '', dob: '', gender: 'female',
  phone: '', email: '', aadhaar: '',
  address: '', city: '', state: '', pin: '',
  maritalStatus: '', occupation: '', bloodGroup: '',
  // Gynae — maps to API fields
  menarcheAge: '', cycleLength: '', lmp: '',
  menopauseStatus: false,
  gravida: '', parity: '', livingChildren: '', abortions: '',
  infertilityDuration: '', contraceptionHistory: [],
  surgicalHistory: [], medicalHistory: '', allergies: '',
  // Partner
  partnerName: '', partnerAge: '', partnerOccupation: '',
  partnerMedicalHistory: '', partnerPhone: '', partnerEmail: '',
  // Episode
  episodeType: 'opd', referredBy: '', notes: '',
}

export default function PatientNew() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step,    setStep]   = useState(1)
  const [data,    setData]   = useState(INITIAL_DATA)
  const [saving,  setSaving] = useState(false)
  const [error,   setError]  = useState('')
  const [touched, setTouched] = useState({})

  const update = fields => {
    setData(d => ({ ...d, ...fields }))
    // Set touched for updated fields natively, but only if they actually changed
    setTouched(t => ({ ...t, ...Object.keys(fields).reduce((acc, k) => ({...acc, [k]: true}), {}) }))
  }

  const handleBlur = field => {
    setTouched(t => ({ ...t, [field]: true }))
  }

  const CurrentStep = STEPS[step - 1].component

  const errors = {};
  const todayDate = new Date().toISOString().split('T')[0];

  // Step 1
  if (touched.firstName && !data.firstName?.trim()) errors.firstName = 'First Name is required.';
  if (touched.lastName && !data.lastName?.trim()) errors.lastName = 'Last Name is required.';
  if (touched.dob && !data.dob) errors.dob = 'Date of Birth is required.';
  if (data.dob && data.dob >= todayDate) errors.dob = 'Date of Birth must be a past date.';
  if (touched.bloodGroup && !data.bloodGroup) errors.bloodGroup = 'Blood Group is required.';
  if (touched.gender && !data.gender) errors.gender = 'Gender is required.';
  if (touched.maritalStatus && !data.maritalStatus) errors.maritalStatus = 'Marital Status is required.';
  if (touched.phone && !data.phone?.trim()) errors.phone = 'Phone Number is required.';
  if (data.phone && data.phone.trim() && !/^\d{10}$/.test(data.phone.trim())) errors.phone = 'Must be exactly 10 digits.';
  if (data.email && data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Invalid email address.';
  if (data.aadhaar && data.aadhaar.trim() && !/^\d{12}$/.test(data.aadhaar.trim())) errors.aadhaar = 'Must be exactly 12 digits.';
  if (data.pin && data.pin.trim() && !/^\d{6}$/.test(data.pin.trim())) errors.pin = 'Must be exactly 6 digits.';

  // Step 2
  if (data.menarcheAge && (Number(data.menarcheAge) < 8 || Number(data.menarcheAge) > 20)) errors.menarcheAge = 'Range: 8-20 years.';
  if (data.cycleLength && (Number(data.cycleLength) < 21 || Number(data.cycleLength) > 45)) errors.cycleLength = 'Range: 21-45 days.';
  if (data.lmp && data.lmp >= todayDate) errors.lmp = 'LMP must be a past date.';

  // Step 3
  if (data.partnerAge && (Number(data.partnerAge) < 18 || Number(data.partnerAge) > 80)) errors.partnerAge = 'Range: 18-80 years.';

  const handleNext = () => {
    if (step === 1) {
      setTouched(t => ({ ...t, firstName: true, lastName: true, dob: true, bloodGroup: true, gender: true, maritalStatus: true, phone: true }));
      const hasErrors = !data.firstName?.trim() || !data.lastName?.trim() || !data.dob || data.dob >= todayDate || !data.bloodGroup || !data.gender || !data.maritalStatus || !data.phone?.trim() || !/^\d{10}$/.test(data.phone.trim()) || (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) || (data.aadhaar && !/^\d{12}$/.test(data.aadhaar.trim())) || (data.pin && !/^\d{6}$/.test(data.pin.trim()));
      if (hasErrors) return setError('Please fix the highlighted fields in Step 1 before continuing.');
    } else if (step === 2) {
      if (errors.menarcheAge || errors.cycleLength || errors.lmp) {
        return setError('Please fix the highlighted fields in Step 2 before continuing.');
      }
    } else if (step === 3) {
      if (errors.partnerAge) {
        return setError('Please fix the highlighted fields in Step 3 before continuing.');
      }
    }
    
    setError('');
    setStep(s => s + 1);
  };

  const handleRegister = async () => {
    setSaving(true)
    setError('')

    try {
      // Build payload matching CreatePatientDto exactly
      const payload = {
        name:                `${data.firstName} ${data.lastName}`.trim(),
        age:                 data.dob
                               ? Math.floor((new Date() - new Date(data.dob)) / (365.25 * 24 * 60 * 60 * 1000))
                               : undefined,
        phone:               data.phone,
        email:               data.email     || undefined,
        aadhaar:             data.aadhaar   || undefined,
        dob:                 data.dob       || undefined,
        bloodGroup:          data.bloodGroup   || undefined,
        maritalStatus:       data.maritalStatus || undefined,
        gender:              data.gender    || undefined,
        occupation:          data.occupation || undefined,
        // Gynae fields
        menarcheAge:         data.menarcheAge   ? Number(data.menarcheAge)   : undefined,
        cycleLength:         data.cycleLength   ? Number(data.cycleLength)   : undefined,
        lastMenstrualPeriod: data.lmp           || undefined,
        menopauseStatus:     data.menopauseStatus,
        gravida:             data.gravida       ? Number(data.gravida)       : undefined,
        parity:              data.parity        ? Number(data.parity)        : undefined,
        abortions:           data.abortions     ? Number(data.abortions)     : undefined,
        livingChildren:      data.livingChildren? Number(data.livingChildren): undefined,
        infertilityDuration: data.infertilityDuration || undefined,
        contraceptionHistory: data.contraceptionHistory.length > 0
                               ? data.contraceptionHistory.join(', ')
                               : undefined,
      }

      // Remove undefined fields
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

      // 1. Create patient
      const res = await patientApi.create(payload)
      const newPatient = res.data?.data || res.data

      console.log('PATIENT CREATED:', newPatient)

      // 2. Add episode if patient created successfully
      if (newPatient?.id && data.episodeType) {
        await patientApi.addEpisode(newPatient.id, {
          type:  data.episodeType,
          title: data.notes || undefined,
        })

        // Also create appointment with current time
        if (user?.id) {
          await appointmentApi.create({
            patientId: newPatient.id,
            doctorId: user.id,
            appointmentDate: new Date().toISOString(),
            reason: data.notes || 'New Patient Consultation',
            type: 'consultation'
          })
        }
      }

      // 3. Add partner if partner name provided
      if (newPatient?.id && data.partnerName) {
        await patientApi.addPartner(newPatient.id, {
          name:        data.partnerName,
          age:         data.partnerAge       ? Number(data.partnerAge) : undefined,
          phone:       data.partnerPhone     || undefined,
          email:       data.partnerEmail     || undefined,
          occupation:  data.partnerOccupation|| undefined,
        })
      }

      navigate('/patients')

    } catch (err) {
      console.error('REGISTRATION ERROR:', err)
      const msg = err.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Registration failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate('/patients')}>
        <ArrowLeft size={16}/> Back to Patients
      </button>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={15} style={{ flexShrink: 0 }}/>
          {error}
        </div>
      )}

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
                  onClick={() => {
                    if (done) {
                      setError('');
                      setStep(s.id);
                    }
                  }}
                >
                  <div className={styles.stepCircle}>
                    {done ? <Check size={14} strokeWidth={3}/> : <Icon size={15}/>}
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
            <CurrentStep data={data} update={update} errors={errors} onBlur={handleBlur} />

            <div className={styles.formFooter}>
              <Button
                variant="secondary"
                icon={ArrowLeft}
                onClick={() => {
                  setError('')
                  step > 1 ? setStep(s => s - 1) : navigate('/patients')
                }}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>

              {step < STEPS.length ? (
                <Button icon={ArrowRight} iconPosition="right" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button
                  icon={Check}
                  loading={saving}
                  onClick={handleRegister}
                >
                  {saving ? 'Registering...' : 'Register Patient'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}