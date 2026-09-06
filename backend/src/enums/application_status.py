from enum import Enum

class ApplicationStatus(str, Enum):
    PENDING = "pending"
    REJECTED = "rejected"
    APPROVED = "approved"
    INTERVIEWING = "interviewing"
    SELECTED = "selected"