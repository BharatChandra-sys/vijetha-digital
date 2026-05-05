# CSS Quick Reference Card

## 🎯 The Golden Rule

**Mobile-First + Progressive Enhancement = Professional CSS**

```css
/* ✅ CORRECT: Mobile-first */
.element {
  /* Mobile styles (base) */
  padding: 1rem;
}

@media (min-width: 641px) {
  .element {
    /* Tablet enhancement */
    padding: 0.75rem;
  }
}

@media (min-width: 1025px) {
  .element {
    /* Desktop enhancement */
    padding: 0.5rem;
  }
}
```

## 📱 Breakpoints

| Device | Width | Media Query |
|--------|-------|-------------|
| Mobile | 0-640px | No media query (base) |
| Tablet | 641-1024px | `@media (min-width: 641px)` |
| Desktop | 1025-1279px | `@media (min-width: 1025px)` |
| Large Desktop | 1280px+ | `@media (min-width: 1280px)` |

## 🎨 Design Tokens

```css
:root {
  /* Spacing */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  
  /* Touch Targets */
  --touch-target-min: 44px;
  --touch-target-comfortable: 48px;
  --touch-target-large: 52px;
}
```

## 🔧 Common Patterns

### Button Sizing

```css
/* Mobile */
button {
  min-height: 48px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* Tablet */
@media (min-width: 641px) {
  button {
    min-height: 44px;
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  button {
    min-height: 40px;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
```

### Card Padding

```css
/* Mobile */
.card {
  padding: 1.5rem;
}

/* Tablet */
@media (min-width: 641px) {
  .card {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .card {
    padding: 1.5rem;
  }
}
```

### Grid Gaps

```css
/* Mobile */
.grid {
  gap: 1rem;
}

/* Tablet */
@media (min-width: 641px) {
  .grid {
    gap: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .grid {
    gap: 1.5rem;
  }
}
```

## 🚫 Never Do This

```css
/* ❌ Desktop-first */
@media (max-width: 640px) { }

/* ❌ Using !important */
button { padding: 1rem !important; }

/* ❌ Global overrides without media queries */
* { padding: 2rem; }

/* ❌ Fixed pixel values everywhere */
button { width: 200px; }
```

## ✅ Always Do This

```css
/* ✅ Mobile-first */
@media (min-width: 641px) { }

/* ✅ Proper specificity */
.product-card button { padding: 1rem; }

/* ✅ Scoped selectors */
[data-component="card"] button { }

/* ✅ Relative units */
button { width: clamp(120px, 30%, 200px); }
```

## 🧪 Testing Checklist

### Mobile (< 640px)
- [ ] Buttons ≥ 44px tall
- [ ] Text ≥ 16px (prevents iOS zoom)
- [ ] No horizontal scroll
- [ ] Content has edge padding

### Tablet (641-1024px)
- [ ] Layout adapts smoothly
- [ ] Buttons ≥ 44px tall
- [ ] Grid layouts work

### Desktop (> 1024px)
- [ ] Compact but usable
- [ ] Hover states work
- [ ] No excessive spacing

## 🎯 File Structure

```
styles/
├── index.css                    # Tailwind (don't touch)
├── responsive-system.css        # Main responsive system
├── mobile-enhancements.css      # Mobile-specific features
└── ui-fixes.css                 # Component overrides
```

## 📝 Quick Commands

### Test Responsive Design
```bash
# Chrome DevTools
Cmd+Shift+M (Mac) / Ctrl+Shift+M (Windows)

# Test at these widths:
320px, 375px, 640px, 768px, 1024px, 1280px
```

### Check CSS Specificity
```
Inline:     1,0,0,0
ID:         0,1,0,0
Class:      0,0,1,0
Element:    0,0,0,1
```

### Clear Browser Cache
```
Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
```

## 🆘 Troubleshooting

### Problem: Mobile changes affect desktop

**Solution:** Wrap mobile styles in base (no media query), add desktop override:

```css
/* Mobile (base) */
button { padding: 1rem; }

/* Desktop override */
@media (min-width: 1025px) {
  button { padding: 0.5rem; }
}
```

### Problem: Styles not applying

**Check:**
1. CSS file imported in main.jsx?
2. Correct media query?
3. Specificity high enough?
4. Browser cache cleared?

### Problem: Buttons too small on mobile

**Solution:**
```css
button {
  min-height: 48px; /* Mobile base */
}

@media (min-width: 1025px) {
  button {
    min-height: 40px; /* Desktop */
  }
}
```

## 💡 Pro Tips

1. **Always start with mobile** - it's easier to add than remove
2. **Use CSS custom properties** - change once, update everywhere
3. **Test on real devices** - emulators aren't perfect
4. **Use data attributes** - better isolation than classes
5. **Document your breakpoints** - future you will thank you
6. **Avoid !important** - it's a code smell
7. **Keep it simple** - complexity is the enemy of maintainability

## 📚 Learn More

- `PROFESSIONAL_CSS_ARCHITECTURE.md` - Full documentation
- `frontend/src/styles/responsive-system.css` - Implementation
- Chrome DevTools - Your best friend

---

**Remember:** Mobile-first is not just a technique, it's a mindset. Think small screen first, then enhance for larger screens. 📱 → 💻
