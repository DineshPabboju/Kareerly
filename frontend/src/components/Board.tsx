type Application = {
  company: string
  role: string
  age: string
  tone: string
  note?: string
}

type BoardColumn = {
  label: string
  count: number
  applications: Application[]
}

const columns: BoardColumn[] = [
  {
    label: 'Wishlist',
    count: 3,
    applications: [
      { company: 'Linear', role: 'Product Designer', age: 'Added today', tone: 'blue' },
      { company: 'Vercel', role: 'Design Engineer', age: 'Added yesterday', tone: 'black' },
      { company: 'Notion', role: 'Product Designer', age: 'Added 4 days ago', tone: 'cream' },
    ],
  },
  {
    label: 'Applied',
    count: 4,
    applications: [
      { company: 'Figma', role: 'Senior Product Designer', age: 'Applied 2 days ago', tone: 'orange', note: 'Follow up in 3 days' },
      { company: 'Arc', role: 'Product Designer', age: 'Applied 5 days ago', tone: 'purple' },
      { company: 'Raycast', role: 'Brand Designer', age: 'Applied 1 week ago', tone: 'black' },
    ],
  },
  {
    label: 'Interviewing',
    count: 2,
    applications: [
      { company: 'Stripe', role: 'Product Designer', age: 'Tomorrow at 10:30', tone: 'blue', note: 'Portfolio review' },
      { company: 'Ramp', role: 'Senior Product Designer', age: 'Next Tuesday', tone: 'green', note: 'Second round' },
    ],
  },
  {
    label: 'Closed',
    count: 5,
    applications: [
      { company: 'Dropbox', role: 'Product Designer', age: 'Closed 2 weeks ago', tone: 'blue' },
      { company: 'Loom', role: 'Design Lead', age: 'Closed last month', tone: 'orange' },
    ],
  },
]

const Board = () => {
  return (
    <main className="workspace-shell">
      <header className="topbar">
        <a className="wordmark" href="/">folio<span>.</span></a>
        <nav className="topnav" aria-label="Main navigation">
          <a className="active" href="#board">Board</a>
          <a href="#insights">Insights</a>
        </nav>
        <div className="profile-area">
          <button className="icon-button" type="button" aria-label="Open notifications">◌</button>
          <div className="avatar">JD</div>
        </div>
      </header>

      <section className="board-heading" id="board">
        <div>
          <p className="eyebrow">Tuesday, September 8, 2026</p>
          <h1>Good morning, Jordan.</h1>
          <p className="heading-copy">Keep the momentum going. You have 2 interviews this week.</p>
        </div>
        <button className="add-button" type="button"><span>+</span> Add application</button>
      </section>

      <section className="summary-row" aria-label="Application summary">
        <div className="summary-item"><strong>14</strong><span>Total applications</span></div>
        <div className="summary-item"><strong>42%</strong><span>Response rate</span></div>
        <div className="summary-item"><strong>02</strong><span>Interviews this week</span></div>
        <div className="summary-note"><span className="pulse-dot" /> Last synced just now</div>
      </section>

      <section className="board-grid" aria-label="Job applications board">
        {columns.map((column) => (
          <section className="board-column" key={column.label}>
            <div className="column-header">
              <div className="column-title"><span className={`status-dot ${column.label.toLowerCase()}`} />{column.label}</div>
              <span className="column-count">{String(column.count).padStart(2, '0')}</span>
            </div>
            <div className="card-stack">
              {column.applications.map((application) => (
                <article className="application-card" key={`${column.label}-${application.company}`}>
                  <div className={`company-mark ${application.tone}`}>{application.company.slice(0, 1)}</div>
                  <div className="application-body">
                    <h2>{application.company}</h2>
                    <p>{application.role}</p>
                    <div className="card-meta"><span>{application.age}</span><button type="button" aria-label={`More options for ${application.company}`}>···</button></div>
                    {application.note && <div className="card-note">{application.note}</div>}
                  </div>
                </article>
              ))}
              <button className="column-add" type="button"><span>+</span> Add application</button>
            </div>
          </section>
        ))}
      </section>
    </main>
  )
}

export default Board