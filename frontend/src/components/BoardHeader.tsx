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

  const name = user?.username || 'Jordan'
  const interviewsCount = stats.interviewsThisWeek

  let momentumText = 'Keep the momentum going. Track and follow up on your applications.'
  if (interviewsCount > 0) {
    momentumText = `Keep the momentum going. You have ${interviewsCount} interview${interviewsCount > 1 ? 's' : ''} in progress.`
  }

  return (
    <section className="board-heading" id="board">
      <div>
        <p className="eyebrow">{todayFormatted}</p>
        <h1>Good morning, {name}.</h1>
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
