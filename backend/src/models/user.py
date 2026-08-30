from typing import List
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, ForeignKey, text
from sqlalchemy.orm import relationship
from ..models.job_application import Job_Application
from ..database.base import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    
    applications: Mapped[List["Job_Application"]] = mapped_column(
        relationship("Job_Application", back_populates=text("user"), cascade="all, delete-orphan")
    )