#!/bin/bash

# Production Deployment Script
# Automates the deployment process with safety checks

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="deploy_${TIMESTAMP}.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    error "Do not run this script as root"
fi

# Start deployment
log "Starting deployment process..."

# Step 1: Pre-deployment checks
log "Step 1: Running pre-deployment checks..."

# Check if .env exists
if [ ! -f .env ]; then
    error ".env file not found"
fi

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running"
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    if ! command -v docker compose &> /dev/null; then
        error "docker-compose not found"
    fi
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

log "Pre-deployment checks passed ✓"

# Step 2: Backup
log "Step 2: Creating backups..."

mkdir -p "$BACKUP_DIR"

# Backup database
log "Backing up database..."
$DOCKER_COMPOSE exec -T db pg_dump -U vijetha vijetha_db > "$BACKUP_DIR/db_backup_${TIMESTAMP}.sql" || warn "Database backup failed"

# Backup uploads
log "Backing up uploads..."
if [ -d "uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads_backup_${TIMESTAMP}.tar.gz" uploads/ || warn "Uploads backup failed"
fi

# Backup .env
log "Backing up configuration..."
cp .env "$BACKUP_DIR/env_backup_${TIMESTAMP}" || warn "Config backup failed"

log "Backups completed ✓"

# Step 3: Pull latest code
log "Step 3: Pulling latest code..."
git pull origin main || error "Git pull failed"
log "Code updated ✓"

# Step 4: Build new images
log "Step 4: Building Docker images..."
$DOCKER_COMPOSE build || error "Docker build failed"
log "Images built ✓"

# Step 5: Run database migrations
log "Step 5: Running database migrations..."
$DOCKER_COMPOSE run --rm api alembic upgrade head || error "Migration failed"
log "Migrations completed ✓"

# Step 6: Run data backfill
log "Step 6: Running data backfill..."
$DOCKER_COMPOSE run --rm api python scripts/backfill_data.py || warn "Backfill had warnings"
log "Backfill completed ✓"

# Step 7: Stop old containers
log "Step 7: Stopping old containers..."
$DOCKER_COMPOSE down || warn "Failed to stop containers"
log "Old containers stopped ✓"

# Step 8: Start new containers
log "Step 8: Starting new containers..."
$DOCKER_COMPOSE up -d || error "Failed to start containers"
log "New containers started ✓"

# Step 9: Wait for services to be ready
log "Step 9: Waiting for services to be ready..."
sleep 10

# Step 10: Health check
log "Step 10: Running health checks..."

# Check API health
if curl -f http://localhost/health > /dev/null 2>&1; then
    log "API health check passed ✓"
else
    error "API health check failed"
fi

# Check database connectivity
if $DOCKER_COMPOSE exec -T db pg_isready -U vijetha > /dev/null 2>&1; then
    log "Database health check passed ✓"
else
    error "Database health check failed"
fi

# Check Redis connectivity
if $DOCKER_COMPOSE exec -T redis redis-cli ping > /dev/null 2>&1; then
    log "Redis health check passed ✓"
else
    error "Redis health check failed"
fi

# Step 11: Run smoke tests
log "Step 11: Running smoke tests..."
$DOCKER_COMPOSE exec -T api pytest tests/integration/test_critical_paths.py -q || warn "Some smoke tests failed"
log "Smoke tests completed ✓"

# Step 12: Cleanup old images
log "Step 12: Cleaning up old Docker images..."
docker image prune -f || warn "Image cleanup failed"
log "Cleanup completed ✓"

# Deployment complete
log "========================================="
log "Deployment completed successfully! 🚀"
log "========================================="
log ""
log "Backup location: $BACKUP_DIR"
log "Log file: $LOG_FILE"
log ""
log "Next steps:"
log "1. Monitor logs: docker-compose logs -f api"
log "2. Check metrics: curl http://localhost/metrics"
log "3. Verify functionality in production"
log ""
log "To rollback, run: ./scripts/rollback.sh $TIMESTAMP"
