from typing import List, TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, ForeignKey, text
from sqlalchemy.orm import relationship
# from backend.src.models.job_application import Job_Application
# from ..models import Job_Application
from ..database.base import Base
import uuid
from sqlalchemy import UUID



if TYPE_CHECKING:
    from .job_application import Job_Application

class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    
    applications: Mapped[List["Job_Application"]] = relationship("Job_Application", back_populates="user", cascade="all, delete-orphan")
    