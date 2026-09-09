import React from 'react'
import { useApplications } from '../context/useApplications'

export const SummaryRow: React.FC = () => {
  const { stats } = useApplications()

  return (
    <section className="summary-row" aria-label="Application summary">
      <div className="summary-item">
        <strong>{stats.total}</strong>
        <span>Total applications</span>
      </div>
      <div className="summary-item">
        <strong>{stats.responseRate}%</strong>
        <span>Response rate</span>
      </div>
      <div className="summary-item">
        <strong>{String(stats.interviewsThisWeek).padStart(2, '0')}</strong>
        <span>Interviews in progress</span>
      </div>
      <div className="summary-note">
        <span className="pulse-dot" /> Last synced {stats.lastSyncedText}
      </div>
    </section>
  )
}

export default SummaryRow
