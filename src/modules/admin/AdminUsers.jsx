import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { userApi } from '@services/api'
import styles from './AdminUsers.module.css'

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'reception', label: 'Receptionist' },
  { value: 'billing', label: 'Billing Staff' },
  { value: 'lab_technician', label: 'Lab Technician' },
  // { value: 'staff',      label: 'Staff' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
    specialization: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await userApi.getAll()
      setUsers(res.data?.data || res.data || [])
    } catch (err) {
      console.error('Failed to fetch users', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await userApi.update(editingUser.id, payload)
      } else {
        await userApi.create(form)
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return
    try {
      await userApi.delete(id)
      fetchUsers()
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const openEdit = (u) => {
    setEditingUser(u)
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      specialization: u.specialization || ''
    })
    setShowModal(true)
  }

  const openNew = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', password: '', role: 'doctor', specialization: '' })
    setShowModal(true)
  }

  return (
    <div className="page-container">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Manage clinic staff accounts and system access</p>
        </div>
        <Button icon={Plus} onClick={openNew}>Register New User</Button>
      </div>

      <Card padding="none">
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {/* <th>Specialization</th> */}
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className={styles.empty}>Loading staff members...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="6" className={styles.empty}>No users found.</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{u.name.substring(0, 2).toUpperCase()}</div>
                      <span className={styles.userName}>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${styles[u.role]}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  {/* <td>{u.specialization || '—'}</td> */}
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <button onClick={() => openEdit(u)} title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(u.id)} title="Remove" className={styles.delete}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && createPortal(
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editingUser ? 'Edit Staff Member' : 'Register New Staff'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <Input label="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <Input label="Email Address" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <Input label={editingUser ? "Password (leave blank to keep current)" : "Password"}
                  type="password" required={!editingUser}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <Select label="Role" options={ROLES} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                <Input label="Specialization (Optional)" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
              </div>
              <div className={styles.modalActions}>
                <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">{editingUser ? 'Update User' : 'Create User'}</Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
