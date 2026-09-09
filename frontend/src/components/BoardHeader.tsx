import React from 'react'
import { useApplications } from '../context/useApplications'

export const BoardHeader: React.FC = () => {
  const { user, stats, openCreateModal } = useApplications()

  // Dynamic formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  const interviewsCount = stats.interviewsThisWeek

  let momentumText = user
    ? (interviewsCount > 0
        ? `Keep the momentum going. You have ${interviewsCount} interview${interviewsCount > 1 ? 's' : ''} in progress.`
        : 'Keep the momentum going. Track and follow up on your applications.')
    : 'Sign in to access your personal applications pipeline.'

  return (
    <section className="board-heading" id="board">
      <div>
        <p className="eyebrow">{todayFormatted}</p>
        <h1>Good morning{user ? `, ${user.username}` : ''}.</h1>
        <p className="heading-copy">{momentumText}</p>
      </div>
      <button
        className="add-button"
        type="button"
        onClick={() => openCreateModal()}
      >
        <span>+</span> Add application
      </button>
    </section>
  )
}

export default BoardHeader
