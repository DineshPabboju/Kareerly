from typing import List, TYPE_CHECKING
import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, text
from sqlalchemy import UUID
# from backend.src.models.user import User
# from ..models.user import User
from ..database.base import Base


if TYPE_CHECKING:
    from .user import User




class Job_Application(Base):
    __tablename__ = "job_applications"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False) 
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    job_url: Mapped[str] = mapped_column(String(255), nullable=True)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(255), nullable=False)
    applied_date: Mapped[DateTime] = mapped_column(DateTime, nullable=True, server_default=text("CURRENT_TIMESTAMP"))
    follow_up_date: Mapped[DateTime] = mapped_column(DateTime, nullable=True) 
    notes: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))    

    user: Mapped["User"] = relationship("User",back_populates="applications")
    