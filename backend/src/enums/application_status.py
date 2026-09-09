from enum import Enum
from typing import Optional


class ApplicationStatus(str, Enum):
    WISHLIST = "wishlist"
    APPLIED = "applied"
    INTERVIEWING = "interviewing"
    CLOSED = "closed"
    OFFER = "offer"
    REJECTED = "rejected"

    # Legacy values for database backward compatibility
    PENDING = "pending"
    APPROVED = "approved"
    SELECTED = "selected"

    @classmethod
    def normalize_for_board(cls, status: Optional[str]) -> str:
        """Map legacy and specific statuses to the 4 board columns."""
        if not status:
            return cls.APPLIED.value
        s = str(status).lower().strip()
        if s in (cls.WISHLIST.value, "wishlist"):
            return cls.WISHLIST.value
        if s in (cls.APPLIED.value, cls.PENDING.value, "applied", "pending"):
            return cls.APPLIED.value
        if s in (cls.INTERVIEWING.value, cls.APPROVED.value, "interviewing", "approved"):
            return cls.INTERVIEWING.value
        if s in (cls.CLOSED.value, cls.REJECTED.value, cls.SELECTED.value, cls.OFFER.value, "closed", "rejected", "selected", "offer"):
            return cls.CLOSED.value
        return cls.APPLIED.value

    @classmethod
    def _missing_(cls, value):
        """Case-insensitive and fuzzy lookup for enum members."""
        if isinstance(value, str):
            val_clean = value.strip().lower()
            for member in cls:
                if member.value == val_clean or member.name.lower() == val_clean:
                    return member
            normalized = cls.normalize_for_board(val_clean)
            for member in cls:
                if member.value == normalized:
                    return member
        return None