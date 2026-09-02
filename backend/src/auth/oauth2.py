from time import timezone
from uuid import UUID

from ..models.user import User
from sqlalchemy.future import select
from ..schemas.auth import TokenData
from ..database.db import get_db
from ..config import settings
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
import jwt
from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


SECRET_KEY = f"{settings.SECRET_KEY}"
ALGORITHM = f"{settings.ALGORITHM}"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str, credentials_exception: HTTPException) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("sub")
        if id is None:
            raise credentials_exception
        token_data = TokenData(user_id=UUID(str(id)))
    except PyJWTError:
        raise credentials_exception
    return token_data


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        token_data = verify_access_token(token, credentials_exception)
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    user = await db.execute(select(User).where(User.id == token_data.user_id))
    current_user = user.scalar_one_or_none()
    if current_user is None:
        raise credentials_exception
    return current_user
