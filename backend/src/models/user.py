from typing import List, TYPE_CHECKING
import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, text, UUID
from ..database.base import Base
from .types import UTCDateTime

if TYPE_CHECKING:
    from .job_application import Job_Application


class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(UTCDateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    
    applications: Mapped[List["Job_Application"]] = relationship("Job_Application", back_populates="user", cascade="all, delete-orphan")
    