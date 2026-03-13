import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import styles from './PatientList.module.css'

export default function PatientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <button className={styles.backBtn || ''} onClick={() => navigate('/patients')}
        style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'none', border:'none',
          cursor:'pointer', color:'var(--text-secondary)', marginBottom:'1.5rem', fontSize:'0.875rem' }}>
        <ArrowLeft size={16} /> Back to Patients
      </button>
      <Card>
        <CardHeader>
          <CardTitle>Patient Profile — {id}</CardTitle>
          <Badge variant="primary" dot>Active</Badge>
        </CardHeader>
        <CardBody>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Full patient profile with medical timeline coming in a later phase.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}