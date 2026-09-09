import { useContext } from 'react'
import { ApplicationContext, type ApplicationContextType } from './applicationContextDef'

export const useApplications = (): ApplicationContextType => {
  const context = useContext(ApplicationContext)
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider')
  }
  return context
}

export default useApplications
