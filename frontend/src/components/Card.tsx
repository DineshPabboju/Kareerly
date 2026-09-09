import React, { useState, useRef, useEffect } from 'react'
import type { Application, ApplicationStatus } from '../types/application'
import { useApplications } from '../context/useApplications'
import { formatRelativeAge, getToneForCompany } from '../utils/helpers'

interface CardProps {
  application: Application
}

export const Card: React.FC<CardProps> = ({ application }) => {
  const { openEditModal, moveApplicationStatus, removeApplication } = useApplications()
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const tone = application.tone || getToneForCompany(application.company)
  const initial = (application.company || '?').trim().slice(0, 1).toUpperCase()
  const age = formatRelativeAge(application.created_at || application.applied_date, application.status)

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    e.dataTransfer.setData('text/plain', application.id)
    e.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const statuses: { id: ApplicationStatus; label: string }[] = [
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'applied', label: 'Applied' },
    { id: 'interviewing', label: 'Interviewing' },
    { id: 'closed', label: 'Closed' },
  ]

  return (
    <article
      className={`application-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        // Prevent opening edit modal if clicking inside the menu
        if (menuRef.current && menuRef.current.contains(e.target as Node)) return
        openEditModal(application)
      }}
      aria-label={`${application.company} ${application.role}`}
    >
      <div className={`company-mark ${tone}`}>{initial}</div>

      <div className="application-body">
        <h2>{application.company}</h2>
        <p>{application.role}</p>

        <div className="card-meta">
          <span>{age}</span>
          <div className="card-actions" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="more-button"
              aria-label={`More options for ${application.company}`}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              ···
            </button>

            {isMenuOpen && (
              <div className="card-dropdown-menu">
                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    setMenuOpen(false)
                    openEditModal(application)
                  }}
                >
                  <span className="menu-item-icon">✎</span>
                  <span className="menu-item-label">Edit details</span>
                </button>
                <div className="menu-divider" />
                <div className="menu-label">Move to stage</div>
                {statuses.map((s) => {
                  const isCurrent = application.status === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`menu-item stage-item ${isCurrent ? 'active' : ''}`}
                      onClick={() => {
                        setMenuOpen(false)
                        if (!isCurrent) {
                          moveApplicationStatus(application.id, s.id)
                        }
                      }}
                    >
                      <span className={`status-dot ${s.id}`} />
                      <span className="menu-item-label">{s.label}</span>
                      {isCurrent && <span className="menu-item-check">✓</span>}
                    </button>
                  )
                })}
                <div className="menu-divider" />
                <button
                  type="button"
                  className="menu-item danger"
                  onClick={() => {
                    setMenuOpen(false)
                    if (window.confirm(`Delete application for ${application.company}?`)) {
                      removeApplication(application.id)
                    }
                  }}
                >
                  <span className="menu-item-icon">✕</span>
                  <span className="menu-item-label">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {application.notes && <div className="card-note">{application.notes}</div>}
      </div>
    </article>
  )
}

export default Card