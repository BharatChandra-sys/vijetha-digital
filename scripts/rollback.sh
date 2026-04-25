#!/bin/bash

# Rollback Script
# Rolls back to a previous deployment state

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="backups"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check arguments
if [ -z "$1" ]; then
    error "Usage: ./rollback.sh <timestamp>"
fi

TIMESTAMP=$1

# Check if backup exists
if [ ! -f "$BACKUP_DIR/db_backup_${TIMESTAMP}.sql" ]; then
    error "Backup not found for timestamp: $TIMESTAMP"
fi

log "Starting rollback to $TIMESTAMP..."

# Confirm rollback
read -p "Are you sure you want to rollback? This will restore database and code. (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    log "Rollback cancelled"
    exit 0
fi

# Check docker-compose
if ! command -v docker-compose &> /dev/null; then
    if ! command -v docker compose &> /dev/null; then
        error "docker-compose not found"
    fi
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Step 1: Stop current containers
log "Step 1: Stopping current containers..."
$DOCKER_COMPOSE down

# Step 2: Restore database
log "Step 2: Restoring database..."
$DOCKER_COMPOSE up -d db
sleep 5

# Drop and recreate database
$DOCKER_COMPOSE exec -T db psql -U vijetha -c "DROP DATABASE IF EXISTS vijetha_db;"
$DOCKER_COMPOSE exec -T db psql -U vijetha -c "CREATE DATABASE vijetha_db;"

# Restore from backup
cat "$BACKUP_DIR/db_backup_${TIMESTAMP}.sql" | $DOCKER_COMPOSE exec -T db psql -U vijetha vijetha_db

log "Database restored ✓"

# Step 3: Restore uploads
log "Step 3: Restoring uploads..."
if [ -f "$BACKUP_DIR/uploads_backup_${TIMESTAMP}.tar.gz" ]; then
    rm -rf uploads/
    tar -xzf "$BACKUP_DIR/uploads_backup_${TIMESTAMP}.tar.gz"
    log "Uploads restored ✓"
else
    warn "No uploads backup found"
fi

# Step 4: Restore configuration
log "Step 4: Restoring configuration..."
if [ -f "$BACKUP_DIR/env_backup_${TIMESTAMP}" ]; then
    cp "$BACKUP_DIR/env_backup_${TIMESTAMP}" .env
    log "Configuration restored ✓"
else
    warn "No config backup found"
fi

# Step 5: Restart all services
log "Step 5: Restarting all services..."
$DOCKER_COMPOSE up -d

# Wait for services
sleep 10

# Step 6: Health check
log "Step 6: Running health checks..."

if curl -f http://localhost/health > /dev/null 2>&1; then
    log "Health check passed ✓"
else
    error "Health check failed"
fi

log "========================================="
log "Rollback completed successfully! ✓"
log "========================================="
log ""
log "System restored to state from: $TIMESTAMP"
log ""
log "Next steps:"
log "1. Verify functionality"
log "2. Check logs: docker-compose logs -f"
log "3. Monitor metrics"
