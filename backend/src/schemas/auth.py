from unittest.mock import Base

from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    user_id: int | None = None
    
    
class UserLogin(BaseModel):
    email: str
    password: str
    
class UserRegister(BaseModel):
    username: str
    email:EmailStr
    password: str
    pass