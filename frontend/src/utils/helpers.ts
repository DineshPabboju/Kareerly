import type { ApplicationStatus, CompanyTone } from '../types/application'

const TONES: CompanyTone[] = ['blue', 'black', 'cream', 'orange', 'purple', 'green']

export const getToneForCompany = (company: string): CompanyTone => {
  if (!company) return 'blue'
  const c = company.toLowerCase().trim()
  if (c === 'linear' || c === 'stripe' || c === 'dropbox') return 'blue'
  if (c === 'vercel' || c === 'raycast') return 'black'
  if (c === 'notion') return 'cream'
  if (c === 'figma' || c === 'loom') return 'orange'
  if (c === 'arc') return 'purple'
  if (c === 'ramp') return 'green'

  let hash = 0
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % TONES.length
  return TONES[index]
}

export const normalizeStatus = (status?: string | null): ApplicationStatus => {
  if (!status) return 'applied'
  const s = status.toLowerCase().trim()
  if (s === 'wishlist') return 'wishlist'
  if (s === 'applied' || s === 'pending') return 'applied'
  if (s === 'interviewing' || s === 'interview' || s === 'approved') return 'interviewing'
  if (s === 'closed' || s === 'rejected' || s === 'offer' || s === 'selected') return 'closed'
  return 'applied'
}

export const formatRelativeAge = (
  dateStr?: string | null,
  status?: string | null
): string => {
  if (!dateStr) {
    const s = normalizeStatus(status)
    if (s === 'wishlist') return 'Saved recently'
    if (s === 'applied') return 'Applied recently'
    if (s === 'interviewing') return 'Interview scheduled'
    return 'Recently updated'
  }

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Recently'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  const prefix = normalizeStatus(status) === 'wishlist' ? 'Added' : 'Applied'

  if (diffHours < 12 && diffDays <= 0) return `${prefix} today`
  if (diffDays === 1) return `${prefix} yesterday`
  if (diffDays > 1 && diffDays < 7) return `${prefix} ${diffDays} days ago`
  if (diffDays >= 7 && diffDays < 14) return `${prefix} 1 week ago`
  if (diffDays >= 14 && diffDays < 30) return `${prefix} ${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays >= 30) return `${prefix} last month`

  return `${prefix} recently`
}

export const formatDateForInput = (dateStr?: string | null): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}
