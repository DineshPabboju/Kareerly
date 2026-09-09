import React from 'react'
import { useApplications } from '../context/useApplications'
import { getToneForCompany } from '../utils/helpers'

interface InsightsViewProps {
  onBackToBoard: () => void
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onBackToBoard }) => {
  const { applications, openCreateModal } = useApplications()

  const wishlistApps = applications.filter((a) => a.status === 'wishlist')
  const appliedApps = applications.filter((a) => a.status === 'applied')
  const interviewApps = applications.filter((a) => a.status === 'interviewing')
  const closedApps = applications.filter((a) => a.status === 'closed')

  const total = applications.length
  const appliedOrFurther = appliedApps.length + interviewApps.length + closedApps.length
  const interviewRate =
    appliedOrFurther > 0
      ? Math.round(((interviewApps.length + closedApps.length) / appliedOrFurther) * 100)
      : 0

  return (
    <div className="insights-container">
      <section className="board-heading">
        <div>
          <p className="eyebrow">Pipeline Analytics & Velocity</p>
          <h1>Application Insights</h1>
          <p className="heading-copy">
            Detailed breakdown of your search funnel, conversion rates, and upcoming milestones.
          </p>
        </div>
        <div className="insights-actions">
          <button className="btn-secondary" type="button" onClick={onBackToBoard}>
            ← Back to Board
          </button>
          <button
            className="add-button"
            type="button"
            onClick={() => openCreateModal()}
          >
            <span>+</span> Add application
          </button>
        </div>
      </section>

      {/* Summary KPI Cards */}
      <div className="insights-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total in Pipeline</span>
          <strong className="kpi-value">{total}</strong>
          <p className="kpi-sub">Across all 4 pipeline stages</p>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Interview Conversion</span>
          <strong className="kpi-value">{interviewRate}%</strong>
          <p className="kpi-sub">Applications advancing to interviews</p>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Active Interviews</span>
          <strong className="kpi-value">{interviewApps.length}</strong>
          <p className="kpi-sub">High momentum opportunities</p>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Closed / Archived</span>
          <strong className="kpi-value">{closedApps.length}</strong>
          <p className="kpi-sub">Completed hiring processes</p>
        </div>
      </div>

      {/* Funnel Section */}
      <section className="insights-section">
        <h2>Recruiting Funnel</h2>
        <div className="funnel-container">
          <div className="funnel-stage">
            <div className="funnel-stage-header">
              <span className="status-dot wishlist" />
              <strong>Wishlist</strong>
              <span className="funnel-count">{wishlistApps.length}</span>
            </div>
            <div className="funnel-bar-wrap">
              <div
                className="funnel-bar wishlist-bar"
                style={{ width: `${total ? Math.max((wishlistApps.length / total) * 100, 4) : 0}%` }}
              />
            </div>
          </div>

          <div className="funnel-stage">
            <div className="funnel-stage-header">
              <span className="status-dot applied" />
              <strong>Applied</strong>
              <span className="funnel-count">{appliedApps.length}</span>
            </div>
            <div className="funnel-bar-wrap">
              <div
                className="funnel-bar applied-bar"
                style={{ width: `${total ? Math.max((appliedApps.length / total) * 100, 4) : 0}%` }}
              />
            </div>
          </div>

          <div className="funnel-stage">
            <div className="funnel-stage-header">
              <span className="status-dot interviewing" />
              <strong>Interviewing</strong>
              <span className="funnel-count">{interviewApps.length}</span>
            </div>
            <div className="funnel-bar-wrap">
              <div
                className="funnel-bar interviewing-bar"
                style={{ width: `${total ? Math.max((interviewApps.length / total) * 100, 4) : 0}%` }}
              />
            </div>
          </div>

          <div className="funnel-stage">
            <div className="funnel-stage-header">
              <span className="status-dot closed" />
              <strong>Closed</strong>
              <span className="funnel-count">{closedApps.length}</span>
            </div>
            <div className="funnel-bar-wrap">
              <div
                className="funnel-bar closed-bar"
                style={{ width: `${total ? Math.max((closedApps.length / total) * 100, 4) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Active Interviews & Priority Follow-ups */}
      <section className="insights-section">
        <h2>Active Interviews & Next Actions</h2>
        {interviewApps.length === 0 ? (
          <div className="empty-insights-box">
            <p>No active interviews scheduled right now.</p>
            <span>Move cards to "Interviewing" or follow up on applied roles.</span>
          </div>
        ) : (
          <div className="interview-list">
            {interviewApps.map((app) => {
              const tone = app.tone || getToneForCompany(app.company)
              return (
                <div key={app.id} className="interview-item">
                  <div className={`company-mark ${tone}`}>
                    {app.company.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="interview-details">
                    <h3>{app.company}</h3>
                    <p>{app.role}</p>
                    {app.location && <span className="interview-loc">📍 {app.location}</span>}
                  </div>
                  <div className="interview-note-box">
                    {app.notes ? (
                      <span className="interview-note-badge">{app.notes}</span>
                    ) : (
                      <span className="interview-pending-badge">Interview in progress</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default InsightsView
