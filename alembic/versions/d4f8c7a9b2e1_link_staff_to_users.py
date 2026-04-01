"""link staff to users for IAM foundation

Revision ID: d4f8c7a9b2e1
Revises: add_tracking_invoice
Create Date: 2026-03-08 20:15:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = "d4f8c7a9b2e1"
down_revision: Union[str, Sequence[str], None] = "add_tracking_invoice"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _has_column(inspector, table_name: str, column_name: str) -> bool:
    return any(col["name"] == column_name for col in inspector.get_columns(table_name))


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if not inspector.has_table("staff"):
        op.create_table(
            "staff",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column("name", sa.String(length=255), nullable=False),
            sa.Column("position", sa.String(length=255), nullable=False),
            sa.Column("phone", sa.String(length=20), nullable=False),
            sa.Column("email", sa.String(length=255), nullable=True),
            sa.Column("department", sa.String(length=100), nullable=True),
            sa.Column("status", sa.String(length=50), nullable=True, server_default=sa.text("'active'")),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_staff_id"), "staff", ["id"], unique=False)
        op.create_index(op.f("ix_staff_name"), "staff", ["name"], unique=False)
        op.create_index(op.f("ix_staff_user_id"), "staff", ["user_id"], unique=False)
        op.create_unique_constraint("uq_staff_user_id", "staff", ["user_id"])
        return

    if not _has_column(inspector, "staff", "user_id"):
        op.add_column("staff", sa.Column("user_id", sa.Integer(), nullable=True))

    # Best-effort backfill: link staff->user by matching email (case-insensitive).
    bind.execute(
        sa.text(
            """
            UPDATE staff s
            SET user_id = m.id
            FROM (
                SELECT LOWER(email) AS email_key, MIN(id) AS id
                FROM users
                WHERE email IS NOT NULL
                GROUP BY LOWER(email)
            ) AS m
            WHERE s.user_id IS NULL
              AND s.email IS NOT NULL
              AND LOWER(s.email) = m.email_key
            """
        )
    )

    # If duplicates exist after backfill, keep first link and clear remaining links.
    bind.execute(
        sa.text(
            """
            WITH ranked AS (
                SELECT id, user_id,
                       ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY id) AS rn
                FROM staff
                WHERE user_id IS NOT NULL
            )
            UPDATE staff s
            SET user_id = NULL
            FROM ranked r
            WHERE s.id = r.id
              AND r.rn > 1
            """
        )
    )

    inspector = inspect(bind)

    existing_fks = {fk["name"] for fk in inspector.get_foreign_keys("staff") if fk.get("name")}
    if "fk_staff_user_id_users" not in existing_fks:
        op.create_foreign_key(
            "fk_staff_user_id_users",
            "staff",
            "users",
            ["user_id"],
            ["id"],
            ondelete="SET NULL",
        )

    existing_indexes = {idx["name"] for idx in inspector.get_indexes("staff")}
    if "ix_staff_user_id" not in existing_indexes:
        op.create_index("ix_staff_user_id", "staff", ["user_id"], unique=False)

    existing_uniques = {uq["name"] for uq in inspector.get_unique_constraints("staff") if uq.get("name")}
    if "uq_staff_user_id" not in existing_uniques:
        op.create_unique_constraint("uq_staff_user_id", "staff", ["user_id"])


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if not inspector.has_table("staff"):
        return

    existing_uniques = {uq["name"] for uq in inspector.get_unique_constraints("staff") if uq.get("name")}
    if "uq_staff_user_id" in existing_uniques:
        op.drop_constraint("uq_staff_user_id", "staff", type_="unique")

    existing_indexes = {idx["name"] for idx in inspector.get_indexes("staff")}
    if "ix_staff_user_id" in existing_indexes:
        op.drop_index("ix_staff_user_id", table_name="staff")

    existing_fks = {fk["name"] for fk in inspector.get_foreign_keys("staff") if fk.get("name")}
    if "fk_staff_user_id_users" in existing_fks:
        op.drop_constraint("fk_staff_user_id_users", "staff", type_="foreignkey")

    if _has_column(inspector, "staff", "user_id"):
        op.drop_column("staff", "user_id")
