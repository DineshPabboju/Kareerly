from unittest.mock import Base
from uuid import UUID

from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    user_id: UUID | None = None
    
    
class UserLogin(BaseModel):
    email: str
    password: str
    
class UserRegister(BaseModel):
    username: str
    email:EmailStr
    password: str
    pass