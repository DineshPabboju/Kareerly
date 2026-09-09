from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.future import select
from sqlalchemy import or_, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from ...auth import oauth2
from ... import models
from ...database import get_db
from ...schemas.job_application import (
    JobApplicationCreate,
    JobApplication,
    JobApplicationUpdate,
    JobApplicationStatusUpdate
)

router = APIRouter(
    prefix="/job_applications",
    tags=["job_applications"]
)


@router.get("", response_model=List[JobApplication])
async def get_applications(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user_or_default)
):
    try:
        query = select(models.Job_Application).where(models.Job_Application.user_id == current_user.id)

        if search:
            search_pattern = f"%{search.strip()}%"
            query = query.where(
                or_(
                    models.Job_Application.company.ilike(search_pattern),
                    models.Job_Application.role.ilike(search_pattern),
                    models.Job_Application.location.ilike(search_pattern),
                    models.Job_Application.notes.ilike(search_pattern)
                )
            )

        if status_filter:
            query = query.where(models.Job_Application.status == status_filter)

        query = query.order_by(desc(models.Job_Application.created_at))
        result = await db.execute(query)
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id}", response_model=JobApplication)
async def get_application(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user_or_default)
):
    query = await db.execute(
        select(models.Job_Application).where(
            and_(
                models.Job_Application.user_id == current_user.id,
                models.Job_Application.id == id
            )
        )
    )
    application = query.scalar_one_or_none()
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Application with ID {id} not found")
    return application


@router.post("", response_model=JobApplication, status_code=status.HTTP_201_CREATED)
async def create_application(
    application: JobApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user_or_default)
):
    job_application = models.Job_Application(
        **application.model_dump(),
        user_id=current_user.id
    )
    try:
        db.add(job_application)
        await db.commit()
        await db.refresh(job_application)
        return job_application
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{id}/status", response_model=JobApplication)
async def update_application_status(
    id: UUID,
    status_update: JobApplicationStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user_or_default)
):
    query = await db.execute(
        select(models.Job_Application).where(
            and_(
                models.Job_Application.user_id == current_user.id,
                models.Job_Application.id == id
            )
        )
    )
    application = query.scalar_one_or_none()
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Application with ID {id} not found")

    application.status = status_update.status
    try:
        await db.commit()
        await db.refresh(application)
        return application
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{id}", response_model=JobApplication)
async def update_application(
    id: UUID,
    updated_application: JobApplicationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user_or_default)
):
    query = await db.execute(
        select(models.Job_Application).where(
            and_(
                models.Job_Application.user_id == current_user.id,
                models.Job_Application.id == id
            )
        )
    )
    application = query.scalar_one_or_none()

    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Application with ID {id} not found")

    updated_data = updated_application.model_dump(exclude_unset=True)
    for field, value in updated_data.items():
        setattr(application, field, value)

    try:
        await db.commit()
        await db.refresh(application)
        return application
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{id}")
async def delete_application(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user_or_default)
):
    query = await db.execute(
        select(models.Job_Application).where(
            and_(
                models.Job_Application.user_id == current_user.id,
                models.Job_Application.id == id
            )
        )
    )
    application = query.scalar_one_or_none()

    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Application with ID {id} not found")

    try:
        await db.delete(application)
        await db.commit()
        return {"message": "Application deleted successfully", "id": str(id)}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))