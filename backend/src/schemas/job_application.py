from uuid import UUID
from ..enums import ApplicationStatus
from pydantic import BaseModel


class JobApplicationBase(BaseModel):
    company: str
    role: str
    status: ApplicationStatus


class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplication(JobApplicationBase):
    id: UUID
    
    class Config:
        from_attributes = True
        
class JobApplicationUpdate(JobApplicationBase):

    pass