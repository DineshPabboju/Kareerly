import React, { useState } from 'react'
import type { Application, BoardColumnDef } from '../types/application'
import { useApplications } from '../context/useApplications'
import Card from './Card'

interface ColumnProps {
  column: BoardColumnDef
  applications: Application[]
}

export const Column: React.FC<ColumnProps> = ({ column, applications }) => {
  const { openCreateModal, moveApplicationStatus } = useApplications()
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only reset if leaving the column element itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const appId = e.dataTransfer.getData('text/plain')
    if (appId) {
      moveApplicationStatus(appId, column.id)
    }
  }

  return (
    <section className={`board-column ${isDragOver ? 'drag-over' : ''}`} aria-label={`${column.label} column`}>
      <div className="column-header">
        <div className="column-title">
          <span className={`status-dot ${column.dotClass}`} />
          {column.label}
        </div>
        <span className="column-count">{String(applications.length).padStart(2, '0')}</span>
      </div>

      <div
        className={`card-stack ${isDragOver ? 'stack-drop-active' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {applications.length === 0 ? (
          <div className="empty-column-placeholder">
            <p>No applications</p>
            <span>Drop cards here or add a new one</span>
          </div>
        ) : (
          applications.map((application) => (
            <Card key={application.id} application={application} />
          ))
        )}

        <button
          className="column-add"
          type="button"
          onClick={() => openCreateModal(column.id)}
        >
          <span>+</span> Add application
        </button>
      </div>
    </section>
  )
}

export default Column