import React, { useState, useEffect } from 'react'
import type { ApplicationStatus, CompanyTone } from '../types/application'
import { useApplications } from '../context/useApplications'
import type { ModalState } from '../context/applicationContextDef'
import { formatDateForInput, getToneForCompany } from '../utils/helpers'

const TONES: { id: CompanyTone; name: string; hex: string }[] = [
  { id: 'blue', name: 'Blue', hex: '#517cb1' },
  { id: 'black', name: 'Black', hex: '#252b28' },
  { id: 'cream', name: 'Cream', hex: '#dbb98e' },
  { id: 'orange', name: 'Orange', hex: '#e47c53' },
  { id: 'purple', name: 'Purple', hex: '#8479a8' },
  { id: 'green', name: 'Green', hex: '#73957b' },
]

interface DialogProps {
  activeModal: ModalState
}

const CardModalDialog: React.FC<DialogProps> = ({ activeModal }) => {
  const { closeModal, addApplication, editApplication, removeApplication } = useApplications()

  const isEdit = activeModal.type === 'edit'
  const app = activeModal.application

  const [company, setCompany] = useState(isEdit ? app?.company || '' : '')
  const [role, setRole] = useState(isEdit ? app?.role || '' : '')
  const [status, setStatus] = useState<ApplicationStatus>(
    isEdit
      ? (app?.status as ApplicationStatus) || 'wishlist'
      : activeModal.defaultStatus || 'wishlist'
  )
  const [jobUrl, setJobUrl] = useState(isEdit ? app?.job_url || '' : '')
  const [location, setLocation] = useState(isEdit ? app?.location || '' : '')
  const [appliedDate, setAppliedDate] = useState(
    isEdit ? formatDateForInput(app?.applied_date) : formatDateForInput(new Date().toISOString())
  )
  const [followUpDate, setFollowUpDate] = useState(
    isEdit ? formatDateForInput(app?.follow_up_date) : ''
  )
  const [notes, setNotes] = useState(isEdit ? app?.notes || '' : '')
  const [tone, setTone] = useState<CompanyTone>(
    isEdit ? app?.tone || getToneForCompany(app?.company || '') : 'blue'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) {
      setErrorMsg('Please provide both company name and role title.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      if (isEdit && app) {
        await editApplication(app.id, {
          company: company.trim(),
          role: role.trim(),
          status,
          job_url: jobUrl.trim() || undefined,
          location: location.trim() || undefined,
          applied_date: appliedDate ? new Date(appliedDate).toISOString() : undefined,
          follow_up_date: followUpDate ? new Date(followUpDate).toISOString() : undefined,
          notes: notes.trim() || undefined,
        })
      } else {
        await addApplication({
          company: company.trim(),
          role: role.trim(),
          status,
          job_url: jobUrl.trim() || undefined,
          location: location.trim() || undefined,
          applied_date: appliedDate ? new Date(appliedDate).toISOString() : undefined,
          follow_up_date: followUpDate ? new Date(followUpDate).toISOString() : undefined,
          notes: notes.trim() || undefined,
        })
      }
    } catch {
      setErrorMsg('Failed to save application. Please verify backend connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!app) return
    if (window.confirm(`Are you sure you want to delete ${app.company}?`)) {
      setIsSubmitting(true)
      try {
        await removeApplication(app.id)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const currentInitial = (company || '?').trim().slice(0, 1).toUpperCase()

  return (
    <div className="modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="modal-badge">
              <span className={`company-mark ${tone}`}>{currentInitial}</span>
              <div className="modal-title-wrap">
                <h2>{isEdit ? 'Edit application' : 'Add new application'}</h2>
                <p>
                  {isEdit
                    ? `Manage ${app?.company || 'role'} details`
                    : 'Track a new opportunity in your pipeline'}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={closeModal}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row two-col">
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                id="company"
                type="text"
                required
                placeholder="e.g. Linear, Stripe, Figma"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value)
                  if (!isEdit) {
                    setTone(getToneForCompany(e.target.value))
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role / Title *</label>
              <input
                id="role"
                type="text"
                required
                placeholder="e.g. Senior Product Designer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label htmlFor="status">Stage / Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="e.g. San Francisco / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label htmlFor="appliedDate">Date Added / Applied</label>
              <input
                id="appliedDate"
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="followUpDate">Follow-up / Interview Date</label>
              <input
                id="followUpDate"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jobUrl">Job Posting URL</label>
            <input
              id="jobUrl"
              type="url"
              placeholder="https://careers.company.com/job/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes / Follow-up Tasks</label>
            <textarea
              id="notes"
              rows={3}
              placeholder="e.g. Follow up in 3 days, Portfolio review prep..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Badge Color Tone</label>
            <div className="tone-picker" role="radiogroup" aria-label="Company mark color">
              {TONES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`tone-circle ${t.id} ${tone === t.id ? 'active' : ''}`}
                  onClick={() => setTone(t.id)}
                  title={t.name}
                  aria-label={t.name}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer">
            {isEdit && (
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete
              </button>
            )}

            <div className="modal-footer-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add application'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export const CardModal: React.FC = () => {
  const { activeModal } = useApplications()
  if (!activeModal) return null

  const modalKey =
    activeModal.type === 'edit'
      ? `edit-${activeModal.application?.id}`
      : `new-${activeModal.defaultStatus}`

  return <CardModalDialog key={modalKey} activeModal={activeModal} />
}

export default CardModal