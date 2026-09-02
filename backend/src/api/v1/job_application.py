from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from ...auth import oauth2
from ... import models
from ...database import get_db
from ...models import Job_Application
from typing import List
from ...schemas.job_application import JobApplicationCreate, JobApplication
router = APIRouter(
    prefix="/job_applications",
    tags=["job_applications"]
)

@router.get("", response_model=List[JobApplication])
async def get_applications(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Job_Application))
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=JobApplication)
async def create_application(application: JobApplicationCreate, db: AsyncSession = Depends(get_db), current_user = Depends(oauth2.get_current_user)):
    job_application = models.Job_Application(**application.model_dump(), user_id=current_user.id)
    try:
        db.add(job_application)
        await db.commit()
        await db.refresh(job_application)
        return job_application
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
