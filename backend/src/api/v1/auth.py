from unittest import result

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.v1 import user
from ...database import get_db
from ... import schemas
from ...auth.oauth2 import create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordRequestForm
from ... import models
from ...auth import security
from ...schemas import user, auth
from datetime import datetime, timezone
from ...auth import security, oauth2

router = APIRouter(
    prefix="/auth", 
    tags=["auth"]
)

@router.post("/login")
async def login(credentials: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    email = credentials.username
    password = credentials.password
    result = await db.execute(select(models.User).where(models.User.email == email))
    user = result.scalar_one_or_none()
    if not user or not security.verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = oauth2.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", response_model=user.User)
async def register(credentials: auth.UserRegister, db: AsyncSession = Depends(get_db)):
    email = credentials.email
    password = credentials.password
    result = await db.execute(select(models.User).where(models.User.email == email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User Already Exists")
    user_data = credentials.model_dump(exclude={password})
    user_data["hashed_password"] = security.hash_password(password)
    new_user = models.User(
        username=credentials.username,
        email=credentials.email,
        hashed_password=security.hash_password(password),
        created_at=datetime.now(timezone.utc)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.get("/me", response_model=user.User)
async def get_me(current_user: models.User = Depends(oauth2.get_current_user_or_default)):
    return current_user


@router.post("/demo")
async def demo_login(db: AsyncSession = Depends(get_db)):
    """Convenience endpoint returning access token for the first registered user."""
    result = await db.execute(select(models.User))
    user_obj = result.scalars().first()
    if not user_obj:
        # Create a default user if none exists
        user_obj = models.User(
            username="Jordan",
            email="jordan@folio.dev",
            hashed_password=security.hash_password("password123"),
            created_at=datetime.now(timezone.utc)
        )
        db.add(user_obj)
        await db.commit()
        await db.refresh(user_obj)

    access_token = oauth2.create_access_token(data={"sub": str(user_obj.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user_obj.id),
            "username": user_obj.username,
            "email": user_obj.email
        }
    }
