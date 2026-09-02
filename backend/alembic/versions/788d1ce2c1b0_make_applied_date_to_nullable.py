"""Make applied date to nullable

Revision ID: 788d1ce2c1b0
Revises: dea981bc30b1
Create Date: 2026-09-02 18:31:13.848523

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '788d1ce2c1b0'
down_revision: Union[str, Sequence[str], None] = 'dea981bc30b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("job_applications") as batch_op:
        batch_op.alter_column(
            "applied_date",
            existing_type=sa.DateTime(),
            nullable=True,
            existing_server_default=sa.text("(CURRENT_TIMESTAMP)"),
        )


def downgrade() -> None:
    with op.batch_alter_table("job_applications") as batch_op:
        batch_op.alter_column(
            "applied_date",
            existing_type=sa.DateTime(),
            nullable=False,
            existing_server_default=sa.text("(CURRENT_TIMESTAMP)"),
        )