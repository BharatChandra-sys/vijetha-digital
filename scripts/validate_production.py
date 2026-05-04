#!/usr/bin/env python3
"""
Production validation script.
Validates that all production requirements are met before deployment.
"""
import os
import sys
from pathlib import Path
from typing import List, Tuple

# Colors for output
GREEN = '\033[0;32m'
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
NC = '\033[0m'  # No Color


def check_env_file() -> Tuple[bool, str]:
    """Check if .env file exists and has required variables."""
    if not Path('.env').exists():
        return False, ".env file not found"
    
    required_vars = [
        'DATABASE_URL',
        'REDIS_URL',
        'JWT_SECRET_KEY',
        'FRONTEND_URL',
        'RAZORPAY_KEY_ID',
        'RAZORPAY_KEY_SECRET',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
    ]
    
    missing_vars = []
    with open('.env', 'r') as f:
        content = f.read()
        for var in required_vars:
            if f'{var}=' not in content:
                missing_vars.append(var)
    
    if missing_vars:
        return False, f"Missing required variables: {', '.join(missing_vars)}"
    
    return True, "All required environment variables present"


def check_env_production() -> Tuple[bool, str]:
    """Check if ENV is set to production."""
    if not Path('.env').exists():
        return False, ".env file not found"
    
    with open('.env', 'r') as f:
        content = f.read()
        if 'ENV=production' in content or 'ENV="production"' in content:
            return True, "ENV set to production"
    
    return False, "ENV not set to production (should be ENV=production)"


def check_jwt_secret_strength() -> Tuple[bool, str]:
    """Check if JWT secret is strong enough."""
    if not Path('.env').exists():
        return False, ".env file not found"
    
    with open('.env', 'r') as f:
        for line in f:
            if line.startswith('JWT_SECRET_KEY='):
                secret = line.split('=', 1)[1].strip().strip('"').strip("'")
                if len(secret) < 32:
                    return False, f"JWT secret too short ({len(secret)} chars, need 32+)"
                if secret in ['your-secret-key', 'test-secret-key', 'changeme']:
                    return False, "JWT secret is a default/test value"
                return True, f"JWT secret is strong ({len(secret)} chars)"
    
    return False, "JWT_SECRET_KEY not found in .env"


def check_docker_installed() -> Tuple[bool, str]:
    """Check if Docker is installed."""
    result = os.system('docker --version > /dev/null 2>&1')
    if result == 0:
        return True, "Docker is installed"
    return False, "Docker is not installed"


def check_docker_compose_installed() -> Tuple[bool, str]:
    """Check if Docker Compose is installed."""
    result = os.system('docker compose version > /dev/null 2>&1')
    if result == 0:
        return True, "Docker Compose is installed"
    
    # Try old docker-compose command
    result = os.system('docker-compose --version > /dev/null 2>&1')
    if result == 0:
        return True, "Docker Compose (legacy) is installed"
    
    return False, "Docker Compose is not installed"


def check_ssl_certificates() -> Tuple[bool, str]:
    """Check if SSL certificates are configured."""
    nginx_conf = Path('nginx/conf.d/vijetha.conf')
    if not nginx_conf.exists():
        return False, "Nginx config not found"
    
    with open(nginx_conf, 'r') as f:
        content = f.read()
        if 'yourdomain.com' in content:
            return False, "SSL certificates not configured (still using yourdomain.com placeholder)"
    
    return True, "SSL certificates appear to be configured"


def check_migrations_exist() -> Tuple[bool, str]:
    """Check if Alembic migrations exist."""
    migrations_dir = Path('alembic/versions')
    if not migrations_dir.exists():
        return False, "Alembic migrations directory not found"
    
    migrations = list(migrations_dir.glob('*.py'))
    if len(migrations) == 0:
        return False, "No migrations found"
    
    return True, f"{len(migrations)} migrations found"


def check_tests_exist() -> Tuple[bool, str]:
    """Check if tests exist."""
    tests_dir = Path('tests')
    if not tests_dir.exists():
        return False, "Tests directory not found"
    
    test_files = list(tests_dir.rglob('test_*.py'))
    if len(test_files) == 0:
        return False, "No test files found"
    
    return True, f"{len(test_files)} test files found"


def check_critical_files() -> Tuple[bool, str]:
    """Check if critical files exist."""
    critical_files = [
        'Dockerfile',
        'docker-compose.yml',
        'requirements.txt',
        'alembic.ini',
        'app/main.py',
        'scripts/deploy.sh',
        'scripts/rollback.sh',
    ]
    
    missing_files = []
    for file in critical_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        return False, f"Missing critical files: {', '.join(missing_files)}"
    
    return True, "All critical files present"


def check_admin_credentials() -> Tuple[bool, str]:
    """Check if admin credentials are configured."""
    if not Path('.env').exists():
        return False, ".env file not found"
    
    with open('.env', 'r') as f:
        content = f.read()
        has_first_admin = 'FIRST_ADMIN_EMAIL=' in content
        has_admin = 'ADMIN_EMAIL=' in content
        
        if not (has_first_admin or has_admin):
            return False, "No admin credentials configured"
        
        # Check for default passwords
        if 'ADMIN_PASSWORD=admin' in content or 'FIRST_ADMIN_PASSWORD=admin' in content:
            return False, "Admin password is set to default value"
    
    return True, "Admin credentials configured"


def check_razorpay_keys() -> Tuple[bool, str]:
    """Check if Razorpay keys are production keys."""
    if not Path('.env').exists():
        return False, ".env file not found"
    
    with open('.env', 'r') as f:
        content = f.read()
        
        # Check for test keys
        if 'rzp_test_' in content:
            return False, "Razorpay test keys detected (should use rzp_live_ for production)"
        
        if 'RAZORPAY_KEY_ID=test' in content:
            return False, "Razorpay keys not configured (still using test values)"
    
    return True, "Razorpay keys appear to be configured"


def run_validation() -> bool:
    """Run all validation checks."""
    print("\n" + "=" * 60)
    print("Vijetha Digital - Production Validation")
    print("=" * 60 + "\n")
    
    checks = [
        ("Environment file exists", check_env_file),
        ("Production mode enabled", check_env_production),
        ("JWT secret strength", check_jwt_secret_strength),
        ("Admin credentials", check_admin_credentials),
        ("Razorpay configuration", check_razorpay_keys),
        ("Docker installed", check_docker_installed),
        ("Docker Compose installed", check_docker_compose_installed),
        ("SSL certificates configured", check_ssl_certificates),
        ("Database migrations", check_migrations_exist),
        ("Tests exist", check_tests_exist),
        ("Critical files", check_critical_files),
    ]
    
    results: List[Tuple[str, bool, str]] = []
    
    for check_name, check_func in checks:
        success, message = check_func()
        results.append((check_name, success, message))
        
        status = f"{GREEN}✓{NC}" if success else f"{RED}✗{NC}"
        print(f"{status} {check_name}: {message}")
    
    print("\n" + "=" * 60)
    
    passed = sum(1 for _, success, _ in results if success)
    total = len(results)
    
    if passed == total:
        print(f"{GREEN}All checks passed! ({passed}/{total}){NC}")
        print(f"{GREEN}System is ready for production deployment.{NC}")
        print("\n" + "=" * 60)
        return True
    else:
        print(f"{RED}Some checks failed! ({passed}/{total} passed){NC}")
        print(f"{YELLOW}Please fix the issues above before deploying.{NC}")
        print("\n" + "=" * 60)
        return False


def main():
    """Main entry point."""
    success = run_validation()
    
    if success:
        print("\nNext steps:")
        print("1. Review PRODUCTION_READINESS_CHECKLIST.md")
        print("2. Run: ./scripts/deploy.sh")
        print("3. Monitor logs: docker compose logs -f api")
        sys.exit(0)
    else:
        print("\nFix the issues above and run this script again.")
        sys.exit(1)


if __name__ == "__main__":
    main()
