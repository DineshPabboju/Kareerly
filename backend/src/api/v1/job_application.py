from operator import and_
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from ...auth import oauth2
from ... import models
from ...database import get_db
from ...models import Job_Application
from typing import List
from ...schemas.job_application import (JobApplicationCreate, 
                                        JobApplication, 
                                        JobApplicationUpdate)
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
    job_application = models.Job_Application(**application.model_dump(), 
                                             user_id=current_user.id)
    try:
        db.add(job_application)
        await db.commit()
        await db.refresh(job_application)
        return job_application
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{id}")
async def delete_application(id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(oauth2.get_current_user)):
    query = await db.execute(select(models.Job_Application)
                             .where(and_
                                    (models.User.id == current_user.id, 
                                     models.Job_Application.id == id)))
    application = query.scalar_one_or_none()
    
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Application with ID-{id} not found")
    await db.delete(application)
    await db.commit()
    return {"Message":"Application Deleted Successfully"}

@router.put("/{id}", response_model=JobApplication)
async def update_application(id:UUID, updated_application: JobApplicationUpdate, db: AsyncSession = Depends(get_db), current_user = Depends(oauth2.get_current_user)):
    query = await db.execute(select(models.Job_Application).
                             where(and_
                                   (models.User.id == current_user.id,
                                    models.Job_Application.id == id)))
    application = query.scalar_one_or_none()
    
    if application is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail=f"Application with ID-{id} not found")
    
    updated_data = updated_application.model_dump(exclude_unset=True)
    
    for field, value in updated_data.items():
        setattr(application, field, value)
        
        
    return application