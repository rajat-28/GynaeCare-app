import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Heart, AlertCircle } from 'lucide-react'
import { useAuth } from '@/store/index'
import { authApi } from '@services/api'
import logo from '@/assets/logo.png'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password.')
      return
    }

    setLoading(true)

    try {
      const res = await authApi.login({ email: email.trim().toLowerCase(), password })
      const data = res.data?.data || res.data
      console.log('LOGIN RESPONSE:', data)

      localStorage.setItem('token', data.accessToken || data.token || '')
      login(data.user || data.data || data)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Login failed. Please check your credentials.')
    }

    setLoading(false)
  }

  return (
    <div className={styles.page}>

      {/* Logo */}
      <div className={styles.logoRow}>
        <img src={logo} alt="Logo" className={styles.logoImg} />
        <span className={styles.logoText}>
          GynaeCare
        </span>
      </div>

      {/* Form card */}
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.sub}>Enter your credentials to access the clinic</p>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.form}>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              placeholder="you@clinic.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.pwdWrap}>
              <input
                id="password"
                className={styles.input}
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPwd(s => !s)}
                tabIndex={-1}
                aria-label="Toggle password"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading
              ? <span className={styles.spinner} />
              : 'Sign in'
            }
          </button>
        </form>
      </div>

      <p className={styles.footer}>
        GynaeCare · Clinic Management &amp; EMR Platform
      </p>
    </div>
  )
}
