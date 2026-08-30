from pydantic import BaseModel


class JobApplicationBase(BaseModel):
    job_title: str
    company_name: str
    application_date: str
    status: str
    user_id: int

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplication(JobApplicationBase):
    id: int
    
    class Config:
        from_attributes = True