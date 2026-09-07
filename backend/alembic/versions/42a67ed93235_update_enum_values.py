"""Update enum values

Revision ID: 42a67ed93235
Revises: fd9f445d2342
Create Date: 2026-09-07 16:28:48.798407

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '42a67ed93235'
down_revision: Union[str, Sequence[str], None] = 'fd9f445d2342'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Example migration script
def upgrade():
    # Update any "Applied" records to "pending"
    op.execute("UPDATE job_applications SET status = 'PENDING' WHERE status = 'pending'")
    # Handle any other invalid values similarly
    
def downgrade():
    # Reverse the migration if needed
    op.execute("UPDATE job_applications SET status = 'pending' WHERE status = 'PENDING'")
