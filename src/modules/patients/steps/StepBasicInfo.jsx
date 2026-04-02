import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { BLOOD_GROUPS, MARITAL_STATUS, STATES_IN, RELIGIONS, GENDER_OPTIONS } from '../patientData'
import styles from './Step.module.css'

export default function StepBasicInfo({ data, update, errors = {}, onBlur }) {
  return (
    <div>
      <h2 className={styles.stepTitle}>Basic Information</h2>
      <p className={styles.stepSub}>Patient demographics and contact details</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Details</h3>
        <div className={styles.grid2}>
          <Input label="First Name" required value={data.firstName} error={errors.firstName}
            onChange={e => update({ firstName: e.target.value })} onBlur={() => onBlur && onBlur('firstName')} placeholder="Enter first name" />
          <Input label="Last Name" required value={data.lastName} error={errors.lastName}
            onChange={e => update({ lastName: e.target.value })} onBlur={() => onBlur && onBlur('lastName')} placeholder="Enter last name" />
        </div>
        <div className={styles.grid3}>
          <Input label="Date of Birth" required type="date" value={data.dob} error={errors.dob}
            onChange={e => update({ dob: e.target.value })} onBlur={() => onBlur && onBlur('dob')} />
          <Select label="Blood Group" required value={data.bloodGroup} error={errors.bloodGroup}
            onChange={e => update({ bloodGroup: e.target.value })} onBlur={() => onBlur && onBlur('bloodGroup')}
            options={BLOOD_GROUPS} placeholder="Select..." />
          <Select label="Religion" value={data.religion} error={errors.religion}
            onChange={e => update({ religion: e.target.value })} onBlur={() => onBlur && onBlur('religion')}
            options={RELIGIONS} placeholder="Select..." />
        </div>
        <div className={styles.grid3}>
          <Select
            label="Gender" required
            value={data.gender} error={errors.gender}
            onChange={e => update({ gender: e.target.value })} onBlur={() => onBlur && onBlur('gender')}
            options={GENDER_OPTIONS}
            placeholder="Select..."
          />
          <Select
            label="Marital Status" required
            value={data.maritalStatus} error={errors.maritalStatus}
            onChange={e => update({ maritalStatus: e.target.value })} onBlur={() => onBlur && onBlur('maritalStatus')}
            options={MARITAL_STATUS}
            placeholder="Select..."
          />
          <Input label="Occupation" value={data.occupation} error={errors.occupation}
            onChange={e => update({ occupation: e.target.value })} onBlur={() => onBlur && onBlur('occupation')} placeholder="Optional" />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact Information</h3>
        <div className={styles.grid2}>
          <Input label="Phone Number" required type="tel" value={data.phone} error={errors.phone}
            onChange={e => update({ phone: e.target.value.replace(/\D/g, '') })} onBlur={() => onBlur && onBlur('phone')} placeholder="10-digit mobile number" />
          <Input label="Email Address" type="email" value={data.email} error={errors.email}
            onChange={e => update({ email: e.target.value })} onBlur={() => onBlur && onBlur('email')} placeholder="Optional" />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Identity Documents</h3>
        <div className={styles.grid2}>
          <Input label="Aadhaar Number" value={data.aadhaar} error={errors.aadhaar}
            onChange={e => update({ aadhaar: e.target.value.replace(/\D/g, '') })} onBlur={() => onBlur && onBlur('aadhaar')} placeholder="12-digit Aadhaar" />
          <Input label="Passport Number" value={data.passport} error={errors.passport}
            onChange={e => update({ passport: e.target.value })} onBlur={() => onBlur && onBlur('passport')} placeholder="Optional" />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Address</h3>
        <Input label="Street Address" value={data.address} error={errors.address}
          onChange={e => update({ address: e.target.value })} onBlur={() => onBlur && onBlur('address')} placeholder="House no, street, area" />
        <div className={styles.grid3} style={{ marginTop: '1rem' }}>
          <Input label="City" value={data.city} error={errors.city}
            onChange={e => update({ city: e.target.value })} onBlur={() => onBlur && onBlur('city')} placeholder="City" />
          <Select label="State" value={data.state} error={errors.state}
            onChange={e => update({ state: e.target.value })} onBlur={() => onBlur && onBlur('state')}
            options={STATES_IN} placeholder="Select state" />
          <Input label="PIN Code" value={data.pin} error={errors.pin}
            onChange={e => update({ pin: e.target.value.replace(/\D/g, '') })} onBlur={() => onBlur && onBlur('pin')} placeholder="6-digit PIN" />
        </div>
      </div>
    </div>
  )
}