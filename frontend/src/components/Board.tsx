import React, { useMemo } from 'react'
import type { BoardColumnDef } from '../types/application'
import { useApplications } from '../context/useApplications'
import BoardHeader from './BoardHeader'
import SummaryRow from './SummaryRow'
import FilterBar from './FilterBar'
import Column from './Column'

const COLUMNS: BoardColumnDef[] = [
  { id: 'wishlist', label: 'Wishlist', dotClass: 'wishlist' },
  { id: 'applied', label: 'Applied', dotClass: 'applied' },
  { id: 'interviewing', label: 'Interviewing', dotClass: 'interviewing' },
  { id: 'closed', label: 'Closed', dotClass: 'closed' },
]

export const Board: React.FC = () => {
  const {
    applications,
    loading,
    error,
    user,
    setAuthModalOpen,
    searchQuery,
    selectedStatusFilter,
    refreshApplications,
  } = useApplications()

  // Filter applications by search text and status pill
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (selectedStatusFilter !== 'all' && app.status !== selectedStatusFilter) {
        return false
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchCompany = app.company.toLowerCase().includes(q)
        const matchRole = app.role.toLowerCase().includes(q)
        const matchLocation = app.location ? app.location.toLowerCase().includes(q) : false
        const matchNotes = app.notes ? app.notes.toLowerCase().includes(q) : false
        return matchCompany || matchRole || matchLocation || matchNotes
      }
      return true
    })
  }, [applications, searchQuery, selectedStatusFilter])

  return (
    <div className="board-container">
      <BoardHeader />
      <SummaryRow />
      <FilterBar />

      {!user && !loading && (
        <div className="board-auth-banner">
          <div>
            <strong>You are currently not signed in</strong>
            <p>Sign in or create an account to view and manage your applications.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setAuthModalOpen(true)}
          >
            Sign in / Register
          </button>
        </div>
      )}

      {error && (
        <div className="board-alert">
          <span>{error}</span>
          <button type="button" onClick={() => refreshApplications()}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="board-loading">
          <div className="loading-spinner" />
          <p>Loading your applications...</p>
        </div>
      ) : (
        <section className="board-grid" aria-label="Job applications board">
          {COLUMNS.map((column) => {
            const columnApps = filteredApplications.filter((app) => app.status === column.id)
            return (
              <Column
                key={column.id}
                column={column}
                applications={columnApps}
              />
            )
          })}
        </section>
      )}
    </div>
  )
}

export default Board