#!/bin/bash

# Comprehensive Health Check Script
# Checks all system components and reports status

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_URL="${API_URL:-http://localhost:8000}"
TIMEOUT=5

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Start health check
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Vijetha Digital Health Check        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check 1: API Health Endpoint
section "API Health"
if response=$(curl -s -f --max-time $TIMEOUT "$API_URL/health"); then
    check_pass "API is responding"
    
    # Parse health response
    if echo "$response" | grep -q '"status":"ok"'; then
        check_pass "API status is OK"
    else
        check_warn "API status is degraded"
    fi
    
    # Check database
    if echo "$response" | grep -q '"db":"ok"'; then
        check_pass "Database connection OK"
    else
        check_fail "Database connection failed"
    fi
    
    # Check Redis
    if echo "$response" | grep -q '"redis":"ok"'; then
        check_pass "Redis connection OK"
    else
        check_fail "Redis connection failed"
    fi
else
    check_fail "API is not responding"
fi

# Check 2: Docker Containers
section "Docker Containers"
if command -v docker &> /dev/null; then
    if docker ps | grep -q "vijetha.*api"; then
        check_pass "API container is running"
    else
        check_fail "API container is not running"
    fi
    
    if docker ps | grep -q "vijetha.*db\|postgres"; then
        check_pass "Database container is running"
    else
        check_fail "Database container is not running"
    fi
    
    if docker ps | grep -q "vijetha.*redis\|redis"; then
        check_pass "Redis container is running"
    else
        check_fail "Redis container is not running"
    fi
    
    if docker ps | grep -q "vijetha.*worker"; then
        check_pass "Celery worker is running"
    else
        check_warn "Celery worker is not running"
    fi
else
    check_warn "Docker not available"
fi

# Check 3: Database
section "Database"
if command -v docker &> /dev/null; then
    if docker compose exec -T db pg_isready -U vijetha &> /dev/null; then
        check_pass "PostgreSQL is ready"
        
        # Check connection count
        conn_count=$(docker compose exec -T db psql -U vijetha -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ')
        if [ -n "$conn_count" ]; then
            check_pass "Active connections: $conn_count"
        fi
    else
        check_fail "PostgreSQL is not ready"
    fi
else
    check_warn "Cannot check database (Docker not available)"
fi

# Check 4: Redis
section "Redis"
if command -v docker &> /dev/null; then
    if docker compose exec -T redis redis-cli ping &> /dev/null; then
        check_pass "Redis is responding"
        
        # Check memory usage
        mem_used=$(docker compose exec -T redis redis-cli info memory 2>/dev/null | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
        if [ -n "$mem_used" ]; then
            check_pass "Redis memory usage: $mem_used"
        fi
    else
        check_fail "Redis is not responding"
    fi
else
    check_warn "Cannot check Redis (Docker not available)"
fi

# Check 5: Disk Space
section "Disk Space"
disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -lt 80 ]; then
    check_pass "Disk usage: ${disk_usage}%"
elif [ "$disk_usage" -lt 90 ]; then
    check_warn "Disk usage: ${disk_usage}% (getting high)"
else
    check_fail "Disk usage: ${disk_usage}% (critical)"
fi

# Check 6: Memory
section "Memory"
if command -v free &> /dev/null; then
    mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
    if [ "$mem_usage" -lt 80 ]; then
        check_pass "Memory usage: ${mem_usage}%"
    elif [ "$mem_usage" -lt 90 ]; then
        check_warn "Memory usage: ${mem_usage}% (getting high)"
    else
        check_fail "Memory usage: ${mem_usage}% (critical)"
    fi
else
    check_warn "Cannot check memory usage"
fi

# Check 7: API Endpoints
section "API Endpoints"
if curl -s -f --max-time $TIMEOUT "$API_URL/docs" > /dev/null 2>&1; then
    check_pass "API documentation accessible"
else
    check_warn "API documentation not accessible (may be disabled in production)"
fi

if curl -s -f --max-time $TIMEOUT "$API_URL/metrics" > /dev/null 2>&1; then
    check_pass "Metrics endpoint accessible"
else
    check_warn "Metrics endpoint not accessible"
fi

# Check 8: SSL Certificate (if HTTPS)
section "SSL Certificate"
if [[ "$API_URL" == https://* ]]; then
    domain=$(echo "$API_URL" | sed -e 's|^https://||' -e 's|/.*||')
    if expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2); then
        check_pass "SSL certificate valid until: $expiry"
    else
        check_fail "Cannot verify SSL certificate"
    fi
else
    check_warn "Not using HTTPS"
fi

# Check 9: Log Files
section "Log Files"
if [ -d "logs" ]; then
    log_size=$(du -sh logs 2>/dev/null | cut -f1)
    check_pass "Log directory size: $log_size"
    
    # Check for recent errors
    if [ -f "logs/error.log" ]; then
        recent_errors=$(tail -n 100 logs/error.log 2>/dev/null | grep -c "ERROR" || echo "0")
        if [ "$recent_errors" -eq 0 ]; then
            check_pass "No recent errors in logs"
        elif [ "$recent_errors" -lt 10 ]; then
            check_warn "Found $recent_errors recent errors"
        else
            check_fail "Found $recent_errors recent errors (high)"
        fi
    fi
else
    check_warn "Log directory not found"
fi

# Check 10: Backups
section "Backups"
if [ -d "backups" ]; then
    latest_backup=$(ls -t backups/db_backup_*.sql 2>/dev/null | head -1)
    if [ -n "$latest_backup" ]; then
        backup_age=$(( ($(date +%s) - $(stat -f %m "$latest_backup" 2>/dev/null || stat -c %Y "$latest_backup" 2>/dev/null)) / 86400 ))
        if [ "$backup_age" -le 1 ]; then
            check_pass "Latest backup: $backup_age day(s) old"
        elif [ "$backup_age" -le 7 ]; then
            check_warn "Latest backup: $backup_age day(s) old"
        else
            check_fail "Latest backup: $backup_age day(s) old (too old)"
        fi
    else
        check_warn "No database backups found"
    fi
else
    check_warn "Backup directory not found"
fi

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Health Check Summary         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Passed:${NC}   $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC}   $FAILED"
echo ""

# Exit code
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Health check FAILED${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Health check passed with WARNINGS${NC}"
    exit 0
else
    echo -e "${GREEN}Health check PASSED${NC}"
    exit 0
fi
