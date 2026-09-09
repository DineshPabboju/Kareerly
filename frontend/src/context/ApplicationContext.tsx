import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
  SummaryStats,
  ToastMessage,
  UpdateApplicationInput,
  User,
} from '../types/application'
import {
  fetchApplications,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from '../api/applications'
import { getCurrentUser, loginUser, signupUser } from '../api/auth'
import { normalizeStatus, getToneForCompany } from '../utils/helpers'
import { ApplicationContext, type ModalState } from './applicationContextDef'

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all')
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [activeModal, setActiveModal] = useState<ModalState | null>(null)
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date())

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Check user session
  const checkUser = useCallback(async () => {
    const token = localStorage.getItem('folio_token')
    if (!token) {
      setUser(null)
      return null
    }
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch {
      localStorage.removeItem('folio_token')
      setUser(null)
      return null
    }
  }, [])

  // Fetch applications for current user only
  const refreshApplications = useCallback(async () => {
    const token = localStorage.getItem('folio_token')
    if (!token) {
      setUser(null)
      setApplications([])
      setLoading(false)
      return
    }

    try {
      setError(null)
      const data = await fetchApplications()
      const enriched = data.map((app) => ({
        ...app,
        status: normalizeStatus(app.status),
        tone: app.tone || getToneForCompany(app.company),
      }))
      setApplications(enriched)
      setLastSyncTime(new Date())
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('folio_token')
        setUser(null)
        setApplications([])
      } else {
        console.error('Failed to load applications:', err)
        setError('Unable to connect to backend server. Ensure the backend is running on port 8000.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial mount effect
  useEffect(() => {
    let isMounted = true

    const initializeData = async () => {
      const token = localStorage.getItem('folio_token')
      if (!token) {
        if (isMounted) {
          setUser(null)
          setApplications([])
          setLoading(false)
        }
        return
      }

      try {
        const currentUser = await getCurrentUser()
        if (isMounted) setUser(currentUser)
      } catch {
        if (isMounted) {
          localStorage.removeItem('folio_token')
          setUser(null)
          setApplications([])
          setLoading(false)
        }
        return
      }

      try {
        const data = await fetchApplications()
        if (isMounted) {
          const enriched = data.map((app) => ({
            ...app,
            status: normalizeStatus(app.status),
            tone: app.tone || getToneForCompany(app.company),
          }))
          setApplications(enriched)
          setLastSyncTime(new Date())
          setError(null)
        }
      } catch (err: any) {
        if (isMounted) {
          if (err.response?.status === 401) {
            localStorage.removeItem('folio_token')
            setUser(null)
            setApplications([])
          } else {
            console.error('Initial load error:', err)
            setError('Unable to connect to backend server. Ensure the backend is running on port 8000.')
          }
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initializeData()

    return () => {
      isMounted = false
    }
  }, [])

  // Add application
  const addApplication = async (input: CreateApplicationInput): Promise<Application> => {
    if (!user) {
      setAuthModalOpen(true)
      throw new Error('User not authenticated')
    }
    try {
      const created = await createApplication(input)
      const formatted: Application = {
        ...created,
        status: normalizeStatus(created.status),
        tone: getToneForCompany(created.company),
      }
      setApplications((prev) => [formatted, ...prev])
      setLastSyncTime(new Date())
      showToast(`Added ${formatted.company} to ${formatted.status}`, 'success')
      setActiveModal(null)
      return formatted
    } catch (err: unknown) {
      showToast('Failed to create application.', 'error')
      throw err
    }
  }

  // Edit application
  const editApplication = async (
    id: string,
    input: UpdateApplicationInput
  ): Promise<Application> => {
    try {
      const updated = await updateApplication(id, input)
      const formatted: Application = {
        ...updated,
        status: normalizeStatus(updated.status),
        tone: getToneForCompany(updated.company),
      }
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...formatted } : app))
      )
      setLastSyncTime(new Date())
      showToast(`Updated ${formatted.company} details`, 'success')
      setActiveModal(null)
      return formatted
    } catch (err: unknown) {
      showToast('Failed to save changes.', 'error')
      throw err
    }
  }

  // Move status with optimistic update
  const moveApplicationStatus = async (id: string, newStatus: ApplicationStatus) => {
    const originalApp = applications.find((a) => a.id === id)
    if (!originalApp || originalApp.status === newStatus) return

    // Optimistic update
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    )

    try {
      await updateApplicationStatus(id, newStatus)
      setLastSyncTime(new Date())
      showToast(`Moved ${originalApp.company} to ${newStatus}`, 'info')
    } catch (err) {
      // Rollback on failure
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: originalApp.status } : app))
      )
      showToast(`Failed to move ${originalApp.company}. Changes reverted.`, 'error')
      console.error(err)
    }
  }

  // Remove application
  const removeApplication = async (id: string) => {
    const originalApp = applications.find((a) => a.id === id)
    setApplications((prev) => prev.filter((a) => a.id !== id))

    try {
      await deleteApplication(id)
      setLastSyncTime(new Date())
      showToast(`Removed ${originalApp?.company || 'application'}`, 'info')
      setActiveModal(null)
    } catch (err) {
      if (originalApp) {
        setApplications((prev) => [...prev, originalApp])
      }
      showToast('Failed to delete application.', 'error')
      console.error(err)
    }
  }

  // Modal helpers
  const openCreateModal = (defaultStatus?: ApplicationStatus) => {
    if (!user) {
      showToast('Please sign in to manage your applications', 'info')
      setAuthModalOpen(true)
      return
    }
    setActiveModal({ type: 'create', defaultStatus: defaultStatus || 'wishlist' })
  }

  const openEditModal = (app: Application) => {
    setActiveModal({ type: 'edit', application: app })
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  // Auth actions
  const login = async (email: string, pass: string) => {
    const res = await loginUser(email, pass)
    localStorage.setItem('folio_token', res.access_token)
    await checkUser()
    await refreshApplications()
    setAuthModalOpen(false)
    showToast(`Welcome back!`, 'success')
  }

  const signup = async (username: string, email: string, pass: string) => {
    await signupUser(username, email, pass)
    const res = await loginUser(email, pass)
    localStorage.setItem('folio_token', res.access_token)
    await checkUser()
    await refreshApplications()
    setAuthModalOpen(false)
    showToast(`Account created for ${username}!`, 'success')
  }

  const logout = () => {
    localStorage.removeItem('folio_token')
    setUser(null)
    setApplications([])
    showToast('Signed out', 'info')
  }

  // Compute live summary KPI stats
  const stats: SummaryStats = useMemo(() => {
    const total = applications.length
    if (total === 0) {
      return {
        total: 0,
        responseRate: 0,
        interviewsThisWeek: 0,
        lastSyncedText: lastSyncTime ? 'just now' : 'never',
      }
    }

    const appliedCount = applications.filter(
      (a) => a.status === 'applied' || a.status === 'interviewing' || a.status === 'closed'
    ).length

    const positiveCount = applications.filter(
      (a) => a.status === 'interviewing' || a.status === 'closed'
    ).length

    const responseRate =
      appliedCount > 0 ? Math.round((positiveCount / appliedCount) * 100) : 0

    const interviewsThisWeek = applications.filter(
      (a) => a.status === 'interviewing'
    ).length

    const lastSyncedText = lastSyncTime ? 'just now' : 'never'

    return {
      total,
      responseRate,
      interviewsThisWeek,
      lastSyncedText,
    }
  }, [applications, lastSyncTime])

  const value = {
    applications,
    loading,
    error,
    user,
    searchQuery,
    setSearchQuery,
    selectedStatusFilter,
    setSelectedStatusFilter,
    stats,
    toasts,
    showToast,
    dismissToast,
    refreshApplications,
    addApplication,
    editApplication,
    moveApplicationStatus,
    removeApplication,
    activeModal,
    openCreateModal,
    openEditModal,
    closeModal,
    isAuthModalOpen,
    setAuthModalOpen,
    login,
    signup,
    logout,
  }

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>
}

export default ApplicationProvider
