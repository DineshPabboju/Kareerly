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
from ...schemas.user import User


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("", response_model=List[User])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    try:
        query = await db.execute(select(models.User))
        users = query.scalars().all()
    except Exception as e:
        raise(e)
    
    return users

