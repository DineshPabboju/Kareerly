import React from 'react'
import { useApplications } from '../context/useApplications'

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedStatusFilter,
    setSelectedStatusFilter,
    applications,
  } = useApplications()

  const counts = {
    all: applications.length,
    wishlist: applications.filter((a) => a.status === 'wishlist').length,
    applied: applications.filter((a) => a.status === 'applied').length,
    interviewing: applications.filter((a) => a.status === 'interviewing').length,
    closed: applications.filter((a) => a.status === 'closed').length,
  }

  return (
    <div className="filter-bar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Filter by company, role, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search applications"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-pills" role="tablist" aria-label="Status filter">
        <button
          type="button"
          className={`filter-pill ${selectedStatusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedStatusFilter('all')}
        >
          All <span>{counts.all}</span>
        </button>
        <button
          type="button"
          className={`filter-pill ${selectedStatusFilter === 'wishlist' ? 'active' : ''}`}
          onClick={() => setSelectedStatusFilter('wishlist')}
        >
          <span className="status-dot wishlist" /> Wishlist <span>{counts.wishlist}</span>
        </button>
        <button
          type="button"
          className={`filter-pill ${selectedStatusFilter === 'applied' ? 'active' : ''}`}
          onClick={() => setSelectedStatusFilter('applied')}
        >
          <span className="status-dot applied" /> Applied <span>{counts.applied}</span>
        </button>
        <button
          type="button"
          className={`filter-pill ${selectedStatusFilter === 'interviewing' ? 'active' : ''}`}
          onClick={() => setSelectedStatusFilter('interviewing')}
        >
          <span className="status-dot interviewing" /> Interviewing <span>{counts.interviewing}</span>
        </button>
        <button
          type="button"
          className={`filter-pill ${selectedStatusFilter === 'closed' ? 'active' : ''}`}
          onClick={() => setSelectedStatusFilter('closed')}
        >
          <span className="status-dot closed" /> Closed <span>{counts.closed}</span>
        </button>
      </div>
    </div>
  )
}

export default FilterBar
