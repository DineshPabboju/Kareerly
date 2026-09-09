import apiClient from './client'
import type {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
  UpdateApplicationInput,
} from '../types/application'

export const fetchApplications = async (params?: {
  search?: string
  status?: string
}): Promise<Application[]> => {
  const response = await apiClient.get<Application[]>('/job_applications', { params })
  return response.data
}

export const fetchApplication = async (id: string): Promise<Application> => {
  const response = await apiClient.get<Application>(`/job_applications/${id}`)
  return response.data
}

export const createApplication = async (
  input: CreateApplicationInput
): Promise<Application> => {
  const response = await apiClient.post<Application>('/job_applications', input)
  return response.data
}

export const updateApplication = async (
  id: string,
  input: UpdateApplicationInput
): Promise<Application> => {
  const response = await apiClient.put<Application>(`/job_applications/${id}`, input)
  return response.data
}

export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus
): Promise<Application> => {
  const response = await apiClient.patch<Application>(`/job_applications/${id}/status`, {
    status,
  })
  return response.data
}

export const deleteApplication = async (
  id: string
): Promise<{ message: string; id: string }> => {
  const response = await apiClient.delete<{ message: string; id: string }>(
    `/job_applications/${id}`
  )
  return response.data
}
