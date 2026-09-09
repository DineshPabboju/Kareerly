import React, { useState, useRef, useEffect } from 'react'
import { useApplications } from '../context/useApplications'

interface NavbarProps {
  currentTab: 'board' | 'insights'
  onTabChange: (tab: 'board' | 'insights') => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { user, logout, setAuthModalOpen, demoAuth, refreshApplications, showToast } =
    useApplications()
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'JD'

  return (
    <header className="topbar">
      <a
        className="wordmark"
        href="#board"
        onClick={(e) => {
          e.preventDefault()
          onTabChange('board')
        }}
      >
        folio<span>.</span>
      </a>

      <nav className="topnav" aria-label="Main navigation">
        <button
          type="button"
          className={`tab-link ${currentTab === 'board' ? 'active' : ''}`}
          onClick={() => onTabChange('board')}
        >
          Board
        </button>
        <button
          type="button"
          className={`tab-link ${currentTab === 'insights' ? 'active' : ''}`}
          onClick={() => onTabChange('insights')}
        >
          Insights
        </button>
      </nav>

      <div className="profile-area" ref={dropdownRef}>
        <button
          className="icon-button"
          type="button"
          aria-label="Refresh and sync data"
          title="Sync with backend"
          onClick={async () => {
            await refreshApplications()
            showToast('Board synchronized with server', 'info')
          }}
        >
          ◌
        </button>

        <button
          type="button"
          className="avatar-button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-label="User menu"
        >
          <div className="avatar">{initials}</div>
        </button>

        {isDropdownOpen && (
          <div className="profile-menu">
            <div className="profile-menu-header">
              <strong>{user ? user.username : 'Guest Mode'}</strong>
              <span>{user ? user.email : 'Local workspace active'}</span>
            </div>
            <div className="profile-menu-divider" />
            {user ? (
              <button
                type="button"
                className="profile-menu-item logout"
                onClick={() => {
                  logout()
                  setDropdownOpen(false)
                }}
              >
                Sign out
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={() => {
                    setAuthModalOpen(true)
                    setDropdownOpen(false)
                  }}
                >
                  Sign in / Register
                </button>
                <button
                  type="button"
                  className="profile-menu-item accent"
                  onClick={() => {
                    demoAuth()
                    setDropdownOpen(false)
                  }}
                >
                  Quick Demo Login
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
