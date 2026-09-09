import React, { useState } from 'react'
import { useApplications } from '../context/useApplications'

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, signup } = useApplications()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        await login(email.trim(), password)
      } else {
        if (!username.trim()) {
          setErrorMsg('Username is required')
          setIsSubmitting(false)
          return
        }
        await signup(username.trim(), email.trim(), password)
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Authentication failed. Please check your credentials.'
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="wordmark">folio<span>.</span></span>
            <h2>{mode === 'login' ? 'Sign in to your board' : 'Create an account'}</h2>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={() => setAuthModalOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="auth-tab-row">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login')
              setErrorMsg('')
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup')
              setErrorMsg('')
            }}
          >
            Create account
          </button>
        </div>

        {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="authUsername">Username</label>
              <input
                id="authUsername"
                type="text"
                required
                placeholder="e.g. Jordan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="authEmail">Email address</label>
            <input
              id="authEmail"
              type="email"
              required
              placeholder="e.g. jordan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="authPassword">Password</label>
            <input
              id="authPassword"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthModal
