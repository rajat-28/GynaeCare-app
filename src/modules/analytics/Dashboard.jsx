import { Card, CardHeader, CardTitle, CardBody } from '@components/ui'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'

export default function Dashboard() {
  return (
    <div className="page-container">
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
        Dashboard
      </h1>
      <Card style={{ maxWidth: 400 }}>
        <CardHeader action={<Button size="sm">New Patient</Button>}>
          <CardTitle>UI Components Working</CardTitle>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Badge variant="primary" dot>Active</Badge>
            <Badge variant="success" dot>Confirmed</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Critical</Badge>
            <Badge variant="teal">ANC</Badge>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}