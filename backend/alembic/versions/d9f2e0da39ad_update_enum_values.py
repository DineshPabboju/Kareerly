"""update enum values

Revision ID: d9f2e0da39ad
Revises: 42a67ed93235
Create Date: 2026-09-07 17:20:34.662939

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'd9f2e0da39ad'
down_revision: Union[str, Sequence[str], None] = '42a67ed93235'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("UPDATE job_applications SET status = 'PENDING' WHERE status = 'pending'")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("UPDATE job_applications SET status = 'pending' WHERE status = 'PENDING'")
    pass
