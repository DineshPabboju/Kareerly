"""add application status enum

Revision ID: fd9f445d2342
Revises: 788d1ce2c1b0
Create Date: 2026-09-06 16:46:26.384106

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fd9f445d2342'
down_revision: Union[str, Sequence[str], None] = '788d1ce2c1b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("job_applications") as batch_op:
        batch_op.alter_column(
            "status",
            existing_type=sa.String(length=255),
            type_=sa.Enum(
                "PENDING",
                "REJECTED",
                "APPROVED",
                "INTERVIEWING",
                "SELECTED",
                name="applicationstatus",
            ),
            existing_nullable=False,
        )


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("job_applications") as batch_op:
        batch_op.alter_column(
            "status",
            existing_type=sa.Enum(
                "PENDING",
                "REJECTED",
                "APPROVED",
                "INTERVIEWING",
                "SELECTED",
                name="applicationstatus",
            ),
            type_=sa.String(length=255),
            existing_nullable=False,
        )
