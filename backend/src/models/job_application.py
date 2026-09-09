from typing import TYPE_CHECKING
import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, ForeignKey, text, UUID
from sqlalchemy.types import TypeDecorator
from ..database.base import Base
from ..enums import ApplicationStatus

if TYPE_CHECKING:
    from .user import User


class ApplicationStatusType(TypeDecorator):
    """
    Custom SQLAlchemy type that maps ApplicationStatus enum to VARCHAR(50) in DB.
    Seamlessly handles lowercase, uppercase, and legacy status values in SQLite & PostgreSQL.
    """
    impl = String(50)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, ApplicationStatus):
            return value.value
        if isinstance(value, str):
            val_clean = value.strip().lower()
            try:
                return ApplicationStatus(val_clean).value
            except ValueError:
                return ApplicationStatus.normalize_for_board(val_clean)
        return str(value).lower()

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, str):
            val_clean = value.strip().lower()
            try:
                return ApplicationStatus(val_clean)
            except ValueError:
                return ApplicationStatus(ApplicationStatus.normalize_for_board(val_clean))
        if isinstance(value, ApplicationStatus):
            return value
        return ApplicationStatus.APPLIED


class Job_Application(Base):
    __tablename__ = "job_applications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False) 
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    job_url: Mapped[str] = mapped_column(String(255), nullable=True)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[ApplicationStatus] = mapped_column(
        ApplicationStatusType,
        nullable=False,
        default=ApplicationStatus.APPLIED
    )
    applied_date: Mapped[DateTime] = mapped_column(DateTime, nullable=True, server_default=text("CURRENT_TIMESTAMP"))
    follow_up_date: Mapped[DateTime] = mapped_column(DateTime, nullable=True) 
    notes: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))    

    user: Mapped["User"] = relationship("User", back_populates="applications")
    