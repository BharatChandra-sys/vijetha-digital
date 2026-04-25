# Migration Guide - Production Deployment

## Overview

This guide covers migrating from development to production and upgrading between versions safely.

## Pre-Migration Checklist

### 1. Backup Everything
```bash
# Database backup
pg_dump -U vijetha vijetha_db > backup_$(date +%Y%m%d).sql

# File uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Configuration backup
cp .env .env.backup
```

### 2. Test in Staging
- [ ] Deploy to staging environment
- [ ] Run all integration tests
- [ ] Perform manual smoke tests
- [ ] Load test with realistic traffic
- [ ] Verify monitoring and alerts

### 3. Communication
- [ ] Notify users of maintenance window
- [ ] Prepare rollback plan
- [ ] Have team on standby
- [ ] Set up incident channel

## Migration Steps

### Step 1: Database Migration

#### Run Migrations
```bash
# Check current version
alembic current

# View pending migrations
alembic heads

# Backup before migration
pg_dump -U vijetha vijetha_db > pre_migration_backup.sql

# Run migrations
alembic upgrade head

# Verify migration
alembic current
```

#### Run Data Backfill
```bash
# Backfill new fields with safe defaults
python scripts/backfill_data.py

# Verify data integrity
python scripts/verify_data.py
```

### Step 2: Code Deployment

#### Using Docker
```bash
# Pull latest code
git pull origin main

# Build new images
docker compose build

# Stop old containers
docker compose down

# Start new containers
docker compose up -d

# Verify health
curl http://localhost/health
```

#### Manual Deployment
```bash
# Pull latest code
git pull origin main

# Install dependencies
pip install -r requirements.txt

# Restart services
systemctl restart vijetha-api
systemctl restart vijetha-worker
systemctl restart vijetha-beat
```

### Step 3: Verification

#### Health Checks
```bash
# API health
curl http://localhost/health

# Database connectivity
curl http://localhost/health | jq '.db'

# Redis connectivity
curl http://localhost/health | jq '.redis'

# Metrics endpoint
curl http://localhost/metrics
```

#### Smoke Tests
```bash
# Run critical path tests
pytest tests/integration/test_critical_paths.py

# Test authentication
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vijetha.com","password":"admin123"}'

# Test order creation
# Test payment processing
# Test admin dashboard
```

### Step 4: Monitor

#### Watch Logs
```bash
# API logs
docker compose logs -f api

# Worker logs
docker compose logs -f worker

# Error logs
tail -f logs/error.log
```

#### Check Metrics
- Response times
- Error rates
- Database connections
- Memory usage
- CPU usage

## Rollback Procedure

### If Migration Fails

#### 1. Stop New Version
```bash
docker compose down
```

#### 2. Restore Database
```bash
# Restore from backup
psql -U vijetha vijetha_db < pre_migration_backup.sql

# Verify restoration
psql -U vijetha vijetha_db -c "SELECT COUNT(*) FROM users;"
```

#### 3. Revert Code
```bash
# Checkout previous version
git checkout <previous-tag>

# Rebuild and restart
docker compose up -d
```

#### 4. Verify Rollback
```bash
# Check health
curl http://localhost/health

# Run smoke tests
pytest tests/integration/test_critical_paths.py
```

## Version-Specific Migrations

### v1.0 to v2.0

#### Breaking Changes
1. **Response Format Change**
   - Old: Direct data
   - New: Wrapped in `data` field

2. **Authentication**
   - Old: Single token
   - New: Access + refresh tokens

3. **Error Format**
   - Old: Simple message
   - New: Structured error object

#### Migration Steps

1. **Update Client Code**
   ```javascript
   // Old
   const orders = await fetch('/orders').then(r => r.json());
   
   // New
   const response = await fetch('/api/v2/orders').then(r => r.json());
   const orders = response.data;
   ```

2. **Update Authentication**
   ```javascript
   // Old
   localStorage.setItem('token', response.token);
   
   // New
   localStorage.setItem('accessToken', response.access_token);
   localStorage.setItem('refreshToken', response.refresh_token);
   ```

3. **Update Error Handling**
   ```javascript
   // Old
   if (response.error) {
     alert(response.error);
   }
   
   // New
   if (response.error) {
     alert(response.error.message);
     console.error(response.error.code, response.error.details);
   }
   ```

### Database Schema Changes

#### Adding New Tables
```sql
-- New table migration
CREATE TABLE new_feature (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_new_feature_name ON new_feature(name);
```

#### Adding New Columns
```sql
-- Add column with default
ALTER TABLE users 
ADD COLUMN new_field VARCHAR(255) DEFAULT 'default_value';

-- Backfill existing rows
UPDATE users SET new_field = 'migrated_value' WHERE new_field IS NULL;

-- Make NOT NULL after backfill
ALTER TABLE users ALTER COLUMN new_field SET NOT NULL;
```

#### Modifying Columns
```sql
-- Add new column
ALTER TABLE orders ADD COLUMN new_status VARCHAR(50);

-- Migrate data
UPDATE orders SET new_status = old_status::text;

-- Drop old column
ALTER TABLE orders DROP COLUMN old_status;

-- Rename new column
ALTER TABLE orders RENAME COLUMN new_status TO status;
```

## Environment-Specific Configuration

### Development
```bash
ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Staging
```bash
ENV=staging
DEBUG=false
LOG_LEVEL=info
SENTRY_DSN=<staging-dsn>
```

### Production
```bash
ENV=production
DEBUG=false
LOG_LEVEL=warning
SENTRY_DSN=<production-dsn>
TRUSTED_HOSTS=yourdomain.com,www.yourdomain.com
```

## Data Migration Patterns

### Pattern 1: Dual Write
```python
# Write to both old and new fields
def save_user(user_data):
    user.old_field = user_data['value']
    user.new_field = user_data['value']  # Dual write
    db.commit()
```

### Pattern 2: Background Migration
```python
# Migrate data in background
@celery.task
def migrate_old_data():
    users = User.query.filter(User.new_field == None).limit(1000)
    for user in users:
        user.new_field = transform(user.old_field)
    db.commit()
```

### Pattern 3: Feature Flag
```python
# Use feature flag for gradual rollout
if feature_flags.is_enabled('new_feature', user_id):
    return new_implementation()
else:
    return old_implementation()
```

## Common Issues and Solutions

### Issue 1: Migration Timeout
**Problem**: Migration takes too long and times out

**Solution**:
```bash
# Increase timeout
alembic upgrade head --sql > migration.sql
psql -U vijetha vijetha_db < migration.sql
```

### Issue 2: Dependency Conflicts
**Problem**: New dependencies conflict with existing ones

**Solution**:
```bash
# Create fresh virtual environment
python -m venv venv_new
source venv_new/bin/activate
pip install -r requirements.txt
```

### Issue 3: Data Inconsistency
**Problem**: Data doesn't match expected format

**Solution**:
```bash
# Run data validation
python scripts/validate_data.py

# Fix inconsistencies
python scripts/fix_data_issues.py
```

### Issue 4: Performance Degradation
**Problem**: New version is slower

**Solution**:
```bash
# Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;

# Add missing indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);

# Analyze tables
ANALYZE orders;
```

## Post-Migration Tasks

### 1. Verify Functionality
- [ ] Test all critical user flows
- [ ] Verify admin functions
- [ ] Check reporting accuracy
- [ ] Test integrations

### 2. Monitor Performance
- [ ] Check response times
- [ ] Monitor error rates
- [ ] Watch database performance
- [ ] Check memory usage

### 3. Update Documentation
- [ ] Update API docs
- [ ] Update deployment docs
- [ ] Document any issues encountered
- [ ] Update runbooks

### 4. Communicate Success
- [ ] Notify users migration is complete
- [ ] Share metrics with team
- [ ] Document lessons learned
- [ ] Plan next improvements

## Maintenance Windows

### Recommended Schedule
- **Minor Updates**: Tuesday/Wednesday 2-4 AM
- **Major Updates**: Sunday 12-6 AM
- **Emergency Fixes**: As needed with notification

### Communication Template
```
Subject: Scheduled Maintenance - [Date] [Time]

Dear Users,

We will be performing scheduled maintenance on [Date] from [Start Time] to [End Time].

During this time:
- The application will be unavailable
- All data will be preserved
- No action is required from you

We expect the maintenance to complete by [End Time]. We'll send a confirmation email once complete.

Thank you for your patience.

The Vijetha Digital Team
```

## Emergency Procedures

### Critical Bug in Production

1. **Assess Impact**
   - How many users affected?
   - Is data at risk?
   - Can we hotfix or need rollback?

2. **Immediate Action**
   - Enable maintenance mode if needed
   - Notify users
   - Start incident response

3. **Fix or Rollback**
   - If quick fix: Deploy hotfix
   - If complex: Rollback to previous version
   - Document incident

4. **Post-Mortem**
   - What went wrong?
   - How to prevent?
   - Update procedures

## Best Practices

1. **Always Test First**
   - Test in staging
   - Run automated tests
   - Manual verification

2. **Have a Rollback Plan**
   - Know how to rollback
   - Practice rollback procedure
   - Keep backups

3. **Monitor Closely**
   - Watch metrics during migration
   - Have team available
   - Set up alerts

4. **Communicate Clearly**
   - Notify users in advance
   - Provide status updates
   - Confirm completion

5. **Document Everything**
   - Document steps taken
   - Note any issues
   - Update procedures

## Support

For migration support:
- Email: devops@vijetha.com
- Slack: #deployments
- On-call: +91-XXX-XXX-XXXX

---

**Last Updated**: 2024-01-01  
**Version**: 1.0  
**Maintained by**: DevOps Team
