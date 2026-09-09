from datetime import datetime, timezone
from sqlalchemy.types import TypeDecorator, DateTime, String
from ..enums import ApplicationStatus


class UTCDateTime(TypeDecorator):
    """
    SQLAlchemy TypeDecorator that ensures all datetimes bound to SQL statements
    are converted to naive UTC datetimes, preventing asyncpg's DataError:
    'can't subtract offset-naive and offset-aware datetimes' when writing to
    PostgreSQL's TIMESTAMP WITHOUT TIME ZONE column.
    On load, attaches UTC timezone so clients receive accurate ISO strings.
    """
    impl = DateTime
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, datetime):
            if value.tzinfo is not None:
                # Convert to UTC and strip timezone info to make it naive
                return value.astimezone(timezone.utc).replace(tzinfo=None)
            return value
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, datetime):
            if value.tzinfo is None:
                return value.replace(tzinfo=timezone.utc)
            return value
        return value


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
