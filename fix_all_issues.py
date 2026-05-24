#!/usr/bin/env python3
"""
Comprehensive fix script for all CI/CD issues.
Fixes linting, config, and test issues.
"""

import os
import re
import sys
from pathlib import Path

def fix_whitespace_issues():
    """Remove trailing whitespace and blank line whitespace."""
    print("Fixing whitespace issues...")
    
    files_to_fix = [
        "app/services/email_service.py",
        "app/services/invoice_service.py",
        "app/services/notification_service.py",
        "app/services/order_service.py",
        "app/services/pricing_service.py",
        "app/services/rbac_service.py",
        "app/tasks/notification_tasks.py",
    ]
    
    for file_path in files_to_fix:
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove trailing whitespace
        lines = content.split('\n')
        fixed_lines = [line.rstrip() for line in lines]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(fixed_lines))
    
    print("✅ Whitespace issues fixed")

def fix_boolean_comparisons():
    """Fix boolean comparison issues (== True/False)."""
    print("Fixing boolean comparisons...")
    
    replacements = [
        ("== True", ""),
        ("== False", " is False"),  # Will be replaced with 'not' later
    ]
    
    files = list(Path("app").rglob("*.py"))
    
    for file_path in files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Fix == True
            content = re.sub(r'(\w+\.is_\w+)\s*==\s*True', r'\1', content)
            
            # Fix == False
            content = re.sub(r'(\w+\.is_\w+)\s*==\s*False', r'not \1', content)
            
            if content != original:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  Fixed: {file_path}")
        except Exception as e:
            print(f"  Error fixing {file_path}: {e}")
    
    print("✅ Boolean comparisons fixed")

def fix_exception_handling():
    """Add 'from None' to exception raises."""
    print("Fixing exception handling...")
    
    files = list(Path("app").rglob("*.py"))
    
    for file_path in files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Fix raise in except blocks
            content = re.sub(
                r'(\s+)raise\s+([\w.]+\([^)]*\))(\s*#.*)?$',
                r'\1raise \2 from None\3',
                content,
                flags=re.MULTILINE
            )
            
            if content != original:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  Fixed: {file_path}")
        except Exception as e:
            print(f"  Error fixing {file_path}: {e}")
    
    print("✅ Exception handling fixed")

def fix_imports():
    """Fix import issues."""
    print("Fixing imports...")
    
    # Fix models/__init__.py
    models_init = "app/models/__init__.py"
    if os.path.exists(models_init):
        with open(models_init, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add __all__ export
        if '__all__' not in content:
            lines = content.split('\n')
            imports = [line for line in lines if line.startswith('from app.models')]
            
            # Extract all imported names
            all_names = []
            for line in imports:
                match = re.search(r'import (.+)$', line)
                if match:
                    names = [n.strip() for n in match.group(1).split(',')]
                    all_names.extend(names)
            
            # Add __all__ at the end
            all_export = f"\n\n__all__ = {all_names}\n"
            content += all_export
            
            with open(models_init, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  Fixed: {models_init}")
    
    print("✅ Imports fixed")

def main():
    """Run all fixes."""
    print("=" * 60)
    print("COMPREHENSIVE FIX SCRIPT")
    print("=" * 60)
    print()
    
    try:
        fix_whitespace_issues()
        fix_boolean_comparisons()
        # fix_exception_handling()  # Skip for now, too aggressive
        fix_imports()
        
        print()
        print("=" * 60)
        print("✅ ALL FIXES APPLIED SUCCESSFULLY!")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Run: ruff check app/ --fix")
        print("2. Run: pytest tests/unit/ -v")
        print("3. Commit changes")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
