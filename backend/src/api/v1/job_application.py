from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db

router = APIRouter(
    prefix="/applications",
    tags=["applications"]
)

@router.get("")
async def get_applications(db: Session = Depends(get_db)):
    
    pass