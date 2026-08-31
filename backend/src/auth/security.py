from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from datetime import UTC
from ..config import settings 
from datetime import datetime, timedelta
import jwt


password_hasher = PasswordHasher()



def hash_password(password: str) -> str:
    return password_hasher.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return password_hasher.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False
    

