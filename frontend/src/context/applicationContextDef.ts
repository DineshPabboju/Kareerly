import { createContext } from 'react'
import type {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
  SummaryStats,
  ToastMessage,
  UpdateApplicationInput,
  User,
} from '../types/application'

export interface ModalState {
  type: 'create' | 'edit'
  application?: Application
  defaultStatus?: ApplicationStatus
}

export interface ApplicationContextType {
  applications: Application[]
  loading: boolean
  error: string | null
  user: User | null
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedStatusFilter: string
  setSelectedStatusFilter: (status: string) => void
  stats: SummaryStats
  toasts: ToastMessage[]
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void
  dismissToast: (id: string) => void
  refreshApplications: () => Promise<void>
  addApplication: (input: CreateApplicationInput) => Promise<Application>
  editApplication: (id: string, input: UpdateApplicationInput) => Promise<Application>
  moveApplicationStatus: (id: string, newStatus: ApplicationStatus) => Promise<void>
  removeApplication: (id: string) => Promise<void>
  activeModal: ModalState | null
  openCreateModal: (defaultStatus?: ApplicationStatus) => void
  openEditModal: (app: Application) => void
  closeModal: () => void
  isAuthModalOpen: boolean
  setAuthModalOpen: (open: boolean) => void
  login: (email: string, pass: string) => Promise<void>
  signup: (username: string, email: string, pass: string) => Promise<void>
  demoAuth: () => Promise<void>
  logout: () => void
}

export const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)
