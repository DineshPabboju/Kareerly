export type ApplicationStatus = 'wishlist' | 'applied' | 'interviewing' | 'closed'

export type CompanyTone = 'blue' | 'black' | 'cream' | 'orange' | 'purple' | 'green'

export interface Application {
  id: string
  user_id?: string
  company: string
  role: string
  status: ApplicationStatus | string
  job_url?: string | null
  location?: string | null
  applied_date?: string | null
  follow_up_date?: string | null
  notes?: string | null
  created_at?: string
  tone?: CompanyTone
}

export interface CreateApplicationInput {
  company: string
  role: string
  status: ApplicationStatus
  job_url?: string
  location?: string
  notes?: string
  applied_date?: string
  follow_up_date?: string
}

export interface UpdateApplicationInput {
  company?: string
  role?: string
  status?: ApplicationStatus
  job_url?: string
  location?: string
  notes?: string
  applied_date?: string
  follow_up_date?: string
}

export interface User {
  id: string
  username: string
  email: string
  created_at?: string
}

export interface BoardColumnDef {
  id: ApplicationStatus
  label: string
  dotClass: string
}

export interface SummaryStats {
  total: number
  responseRate: number
  interviewsThisWeek: number
  lastSyncedText: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  text: string
}
