from typing import TYPE_CHECKING, Optional
import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, text, UUID
from ..database.base import Base
from ..enums import ApplicationStatus
from .types import ApplicationStatusType, UTCDateTime

if TYPE_CHECKING:
    from .user import User


class Job_Application(Base):
    __tablename__ = "job_applications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False) 
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    job_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[ApplicationStatus] = mapped_column(
        ApplicationStatusType,
        nullable=False,
        default=ApplicationStatus.APPLIED
    )
    applied_date: Mapped[Optional[datetime]] = mapped_column(UTCDateTime, nullable=True, server_default=text("CURRENT_TIMESTAMP"))
    follow_up_date: Mapped[Optional[datetime]] = mapped_column(UTCDateTime, nullable=True) 
    notes: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(UTCDateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))    

    user: Mapped["User"] = relationship("User", back_populates="applications")
    