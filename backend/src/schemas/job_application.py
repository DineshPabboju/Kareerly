from uuid import UUID

from pydantic import BaseModel


class JobApplicationBase(BaseModel):
    company: str
    role: str
    status: str


class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplication(JobApplicationBase):
    id: UUID
    
    class Config:
        from_attributes = True
        
class JobApplicationUpdate(JobApplicationBase):
    pass