"""
Add comprehensive IAM (Identity and Access Management) system.

This migration creates:
- Core role and permission tables
- Role-permission and user-role association tables
- Audit logging tables for role assignments and permission access
- All necessary indexes for performance
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic
revision = 'add_iam_system_001'
down_revision = 'f3061cbd3567'  # Update based on your last migration
branch_labels = None
depends_on = None


def upgrade():
    # Create ENUM types
    op.execute("""
    DO $$ BEGIN
        CREATE TYPE permission_category_enum AS ENUM (
            'user_management',
            'role_management',
            'order_management',
            'financial',
            'delivery',
            'analytics',
            'product',
            'system'
        );
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;
    """)

    permission_category_enum = postgresql.ENUM(
        'user_management',
        'role_management',
        'order_management',
        'financial',
        'delivery',
        'analytics',
        'product',
        'system',
        name='permission_category_enum',
        create_type=False
    )
    permission_category_enum._create_events = False

    op.execute("""
    DO $$ BEGIN
        CREATE TYPE resource_type_enum AS ENUM (
            'user',
            'order',
            'product',
            'payment',
            'delivery',
            'role',
            'permission',
            'report',
            'setting'
        );
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;
    """)

    resource_type_enum = postgresql.ENUM(
        'user',
        'order',
        'product',
        'payment',
        'delivery',
        'role',
        'permission',
        'report',
        'setting',
        name='resource_type_enum',
        create_type=False
    )
    resource_type_enum._create_events = False

    op.execute("""
    DO $$ BEGIN
        CREATE TYPE action_type_enum AS ENUM (
            'create',
            'read',
            'update',
            'delete'
        );
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;
    """)

    action_type_enum = postgresql.ENUM(
        'create',
        'read',
        'update',
        'delete',
        name='action_type_enum',
        create_type=False
    )
    action_type_enum._create_events = False

    op.execute("""
    DO $$ BEGIN
        CREATE TYPE user_status_enum AS ENUM (
            'active',
            'inactive',
            'suspended',
            'pending_verification'
        );
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;
    """)

    user_status_enum = postgresql.ENUM(
        'active',
        'inactive',
        'suspended',
        'pending_verification',
        name='user_status_enum',
        create_type=False
    )
    user_status_enum._create_events = False

    # ========== Alter users table ==========
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('full_name', sa.String(255), nullable=False, server_default=''))
        batch_op.add_column(sa.Column('status', postgresql.ENUM(name='user_status_enum', create_type=False), nullable=False, server_default='active'))
        batch_op.add_column(sa.Column('phone', sa.String(20), nullable=True))
        batch_op.add_column(sa.Column('avatar_url', sa.String(500), nullable=True))
        batch_op.add_column(sa.Column('address', sa.String(500), nullable=True))
        batch_op.add_column(sa.Column('city', sa.String(100), nullable=True))
        batch_op.add_column(sa.Column('state', sa.String(100), nullable=True))
        batch_op.add_column(sa.Column('postal_code', sa.String(20), nullable=True))
        batch_op.add_column(sa.Column('email_verified', sa.Boolean(), nullable=False, server_default='false'))
        batch_op.add_column(sa.Column('email_verified_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('last_login_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('last_login_ip', sa.String(50), nullable=True))
        batch_op.add_column(sa.Column('mfa_enabled', sa.Boolean(), nullable=False, server_default='false'))
        batch_op.add_column(sa.Column('mfa_secret', sa.String(255), nullable=True))
        batch_op.add_column(sa.Column('created_by', sa.Integer(), nullable=True))
        
        batch_op.create_index('ix_users_status', ['status'])
        batch_op.create_index('ix_users_phone', ['phone'])

    # ========== Create permissions table ==========
    op.create_table(
        'permissions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('permission_key', sa.String(100), nullable=False),
        sa.Column('display_name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', postgresql.ENUM(name='permission_category_enum', create_type=False), nullable=False),
        sa.Column('resource', postgresql.ENUM(name='resource_type_enum', create_type=False), nullable=False),
        sa.Column('action', postgresql.ENUM(name='action_type_enum', create_type=False), nullable=False),
        sa.Column('is_dangerous', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_delegable', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('permission_key'),
        sa.UniqueConstraint('resource', 'action', name='uq_permission_resource_action')
    )
    
    op.create_index('ix_permissions_category', 'permissions', ['category'])
    op.create_index('ix_permissions_resource_action', 'permissions', ['resource', 'action'])

    # ========== Create roles table ==========
    op.create_table(
        'roles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('slug', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_system_role', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('priority', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('max_users', sa.Integer(), nullable=True),
        sa.Column('requires_approval', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('parent_role_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['parent_role_id'], ['roles.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        sa.UniqueConstraint('slug')
    )
    
    op.create_index('ix_roles_slug', 'roles', ['slug'])
    op.create_index('ix_roles_is_active', 'roles', ['is_active'])
    op.create_index('ix_roles_priority', 'roles', ['priority'])

    # ========== Create role_permissions junction table ==========
    op.create_table(
        'role_permissions',
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.Column('permission_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['permission_id'], ['permissions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('role_id', 'permission_id')
    )
    
    op.create_index('ix_role_permissions_permission_id', 'role_permissions', ['permission_id'])
    op.create_index('ix_role_permissions_role_id', 'role_permissions', ['role_id'])

    # ========== Create user_roles junction table ==========
    op.create_table(
        'user_roles',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.Column('assigned_at', sa.DateTime(), nullable=False),
        sa.Column('assigned_by', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['assigned_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('user_id', 'role_id')
    )
    
    op.create_index('ix_user_roles_assigned_by', 'user_roles', ['assigned_by'])
    op.create_index('ix_user_roles_role_id', 'user_roles', ['role_id'])
    op.create_index('ix_user_roles_user_id', 'user_roles', ['user_id'])

    # ========== Create role_assignment_logs table ==========
    op.create_table(
        'role_assignment_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.Column('action', sa.String(50), nullable=False),
        sa.Column('assigned_by_id', sa.Integer(), nullable=True),
        sa.Column('assigned_by_name', sa.String(255), nullable=True),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('revoked_at', sa.DateTime(), nullable=True),
        sa.Column('revoked_reason', sa.Text(), nullable=True),
        sa.Column('requires_approval', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('approved_by_id', sa.Integer(), nullable=True),
        sa.Column('approved_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['assigned_by_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['approved_by_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_index('ix_role_assignment_logs_role_id', 'role_assignment_logs', ['role_id'])
    op.create_index('ix_role_assignment_logs_user_id', 'role_assignment_logs', ['user_id'])

    # ========== Create permission_access_logs table ==========
    op.create_table(
        'permission_access_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('permission_id', sa.Integer(), nullable=False),
        sa.Column('resource_type', sa.String(50), nullable=False),
        sa.Column('resource_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(50), nullable=False),
        sa.Column('endpoint', sa.String(255), nullable=True),
        sa.Column('method', sa.String(10), nullable=True),
        sa.Column('status_code', sa.Integer(), nullable=True),
        sa.Column('ip_address', sa.String(50), nullable=True),
        sa.Column('success', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['permission_id'], ['permissions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_index('ix_permission_access_logs_created_at', 'permission_access_logs', ['created_at'])
    op.create_index('ix_permission_access_logs_permission_id', 'permission_access_logs', ['permission_id'])
    op.create_index('ix_permission_access_logs_resource', 'permission_access_logs', ['resource_type', 'resource_id'])
    op.create_index('ix_permission_access_logs_user_id', 'permission_access_logs', ['user_id'])


def downgrade():
    # Drop tables in reverse order
    op.drop_index('ix_permission_access_logs_user_id', table_name='permission_access_logs')
    op.drop_index('ix_permission_access_logs_resource', table_name='permission_access_logs')
    op.drop_index('ix_permission_access_logs_permission_id', table_name='permission_access_logs')
    op.drop_index('ix_permission_access_logs_created_at', table_name='permission_access_logs')
    op.drop_table('permission_access_logs')
    
    op.drop_index('ix_role_assignment_logs_user_id', table_name='role_assignment_logs')
    op.drop_index('ix_role_assignment_logs_role_id', table_name='role_assignment_logs')
    op.drop_table('role_assignment_logs')
    
    op.drop_index('ix_user_roles_user_id', table_name='user_roles')
    op.drop_index('ix_user_roles_role_id', table_name='user_roles')
    op.drop_index('ix_user_roles_assigned_by', table_name='user_roles')
    op.drop_table('user_roles')
    
    op.drop_index('ix_role_permissions_role_id', table_name='role_permissions')
    op.drop_index('ix_role_permissions_permission_id', table_name='role_permissions')
    op.drop_table('role_permissions')
    
    op.drop_index('ix_roles_priority', table_name='roles')
    op.drop_index('ix_roles_is_active', table_name='roles')
    op.drop_index('ix_roles_slug', table_name='roles')
    op.drop_table('roles')
    
    op.drop_index('ix_permissions_resource_action', table_name='permissions')
    op.drop_index('ix_permissions_category', table_name='permissions')
    op.drop_table('permissions')
    
    # Alter users table
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_index('ix_users_phone')
        batch_op.drop_index('ix_users_status')
        batch_op.drop_column('created_by')
        batch_op.drop_column('mfa_secret')
        batch_op.drop_column('mfa_enabled')
        batch_op.drop_column('last_login_ip')
        batch_op.drop_column('last_login_at')
        batch_op.drop_column('email_verified_at')
        batch_op.drop_column('email_verified')
        batch_op.drop_column('postal_code')
        batch_op.drop_column('state')
        batch_op.drop_column('city')
        batch_op.drop_column('address')
        batch_op.drop_column('avatar_url')
        batch_op.drop_column('phone')
        batch_op.drop_column('status')
        batch_op.drop_column('full_name')
    
    # Drop ENUM types
    sa.Enum('active', 'inactive', 'suspended', 'pending_verification', name='user_status_enum').drop(op.get_bind(), checkfirst=True)
    sa.Enum('create', 'read', 'update', 'delete', name='action_type_enum').drop(op.get_bind(), checkfirst=True)
    sa.Enum('user', 'order', 'product', 'payment', 'delivery', 'role', 'permission', 'report', 'setting', name='resource_type_enum').drop(op.get_bind(), checkfirst=True)
    sa.Enum('user_management', 'role_management', 'order_management', 'financial', 'delivery', 'analytics', 'product', 'system', name='permission_category_enum').drop(op.get_bind(), checkfirst=True)
