#!/bin/bash
# Batch UI Improvement Script - Updates all buttons and inputs across the codebase

echo "🎨 Starting batch UI improvements..."

# Change to frontend directory
cd "$(dirname "$0")/../frontend/src" || exit

# 1. Update all rounded-lg buttons to rounded-xl
echo "📐 Updating button border radius (lg → xl)..."
find . -name "*.jsx" -type f -exec sed -i 's/rounded-lg\(.*button\|.*type="button"\|.*type="submit"\)/rounded-xl\1/g' {} \;

# 2. Update button heights from h-10 to h-11
echo "📏 Updating button heights (h-10 → h-11)..."
find . -name "*.jsx" -type f -exec sed -i 's/\(button.*\)h-10\(.*\)/\1h-11\2/g' {} \;

# 3. Add hover:shadow-lg to buttons that don't have it
echo "✨ Adding shadow effects..."
find . -name "*.jsx" -type f -exec sed -i 's/\(button.*hover:bg-[^ ]*\)\( \)/\1 hover:shadow-lg\2/g' {} \;

# 4. Update input border radius
echo "📝 Updating input border radius..."
find . -name "*.jsx" -type f -exec sed -i 's/\(input.*\)rounded-lg/\1rounded-xl/g' {} \;

# 5. Update input borders to border-2
echo "🎯 Updating input borders..."
find . -name "*.jsx" -type f -exec sed -i 's/\(input.*\)border border-/\1border-2 border-/g' {} \;

# 6. Update input heights
echo "📐 Updating input heights..."
find . -name "*.jsx" -type f -exec sed -i 's/\(input.*\)h-10/\1h-11/g' {} \;

echo "✅ Batch improvements complete!"
echo "📊 Modified files:"
find . -name "*.jsx" -type f -newer /tmp/ui-improve-start 2>/dev/null | wc -l
