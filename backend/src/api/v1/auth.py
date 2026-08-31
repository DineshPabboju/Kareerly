from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from ...database import get_db
from ... import schemas
from ...auth.oauth2 import create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordRequestForm
from ... import models
from ...auth import security


router = APIRouter(
    prefix="/auth", 
    tags=["auth"]
)

@router.post("/login")
async def login(credentials: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    email = credentials.username
    password = credentials.password
    user = await db.execute(select(models.User).where(models.User.email == email)).scalar_one_or_none()
    if not user or not user.verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = security.create_access_token(data={"user_id": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup")
async def register(credentials: schemas.UserRegister, db: AsyncSession = Depends(get_db)):
    
    pass