import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { BLOOD_GROUPS, MARITAL_STATUS, STATES_IN, RELIGIONS } from '../patientData'
import styles from './Step.module.css'

export default function StepBasicInfo({ data, update }) {
  return (
    <div>
      <h2 className={styles.stepTitle}>Basic Information</h2>
      <p className={styles.stepSub}>Patient demographics and contact details</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Details</h3>
        <div className={styles.grid2}>
          <Input label="First Name" required value={data.firstName}
            onChange={e => update({ firstName: e.target.value })} placeholder="Enter first name" />
          <Input label="Last Name" required value={data.lastName}
            onChange={e => update({ lastName: e.target.value })} placeholder="Enter last name" />
        </div>
        <div className={styles.grid3}>
          <Input label="Date of Birth" required type="date" value={data.dob}
            onChange={e => update({ dob: e.target.value })} />
          <Select label="Blood Group" value={data.bloodGroup}
            onChange={e => update({ bloodGroup: e.target.value })}
            options={BLOOD_GROUPS} placeholder="Select..." />
          <Select label="Religion" value={data.religion}
            onChange={e => update({ religion: e.target.value })}
            options={RELIGIONS} placeholder="Select..." />
        </div>
        <div className={styles.grid2}>
          <Select label="Marital Status" required value={data.maritalStatus}
            onChange={e => update({ maritalStatus: e.target.value })}
            options={MARITAL_STATUS} placeholder="Select..." />
          <Input label="Occupation" value={data.occupation}
            onChange={e => update({ occupation: e.target.value })} placeholder="Optional" />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact Information</h3>
        <div className={styles.grid2}>
          <Input label="Phone Number" required type="tel" value={data.phone}
            onChange={e => update({ phone: e.target.value })} placeholder="10-digit mobile number" />
          <Input label="Email Address" type="email" value={data.email}
            onChange={e => update({ email: e.target.value })} placeholder="Optional" />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Identity Documents</h3>
        <div className={styles.grid2}>
          <Input label="Aadhaar Number" value={data.aadhaar}
            onChange={e => update({ aadhaar: e.target.value })} placeholder="12-digit Aadhaar" />
          <Input label="Passport Number" value={data.passport}
            onChange={e => update({ passport: e.target.value })} placeholder="Optional" />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Address</h3>
        <Input label="Street Address" value={data.address}
          onChange={e => update({ address: e.target.value })} placeholder="House no, street, area" />
        <div className={styles.grid3} style={{ marginTop: '1rem' }}>
          <Input label="City" value={data.city}
            onChange={e => update({ city: e.target.value })} placeholder="City" />
          <Select label="State" value={data.state}
            onChange={e => update({ state: e.target.value })}
            options={STATES_IN} placeholder="Select state" />
          <Input label="PIN Code" value={data.pin}
            onChange={e => update({ pin: e.target.value })} placeholder="6-digit PIN" />
        </div>
      </div>
    </div>
  )
}