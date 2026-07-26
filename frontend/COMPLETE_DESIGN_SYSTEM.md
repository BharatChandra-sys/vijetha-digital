# Vijetha Digital - Complete Production Design System
**Research-Driven | Mobile-First | E-Commerce Optimized**

---

## 📐 Typography Scale (Based on 1.250 - Major Third Ratio)

### Desktop (Base: 16px)
```
Display XL:  48px (3rem)    - Hero titles
Display L:   40px (2.5rem)  - Section headers  
H1:          32px (2rem)    - Page titles
H2:          25.6px (1.6rem)- Section titles
H3:          20.48px (1.28rem) - Card titles
H4:          18px (1.125rem) - Small headings
Body Large:  18px (1.125rem) - Intro paragraphs
Body:        16px (1rem)    - Main content
Body Small:  14px (0.875rem)- Secondary text
Caption:     12.8px (0.8rem) - Labels, tags
Tiny:        11px (0.6875rem) - Legal, footnotes
```

### Mobile (Base: 14px - Optimized for readability)
```
Display XL:  36px (2.57rem) - Hero titles
Display L:   32px (2.29rem) - Section headers
H1:          28px (2rem)    - Page titles
H2:          22px (1.57rem) - Section titles
H3:          18px (1.29rem) - Card titles
H4:          16px (1.14rem) - Small headings
Body Large:  16px (1.14rem) - Intro paragraphs
Body:        14px (1rem)    - Main content (MOBILE BASE)
Body Small:  13px (0.93rem) - Secondary text
Caption:     12px (0.86rem) - Labels, tags
Tiny:        11px (0.79rem) - Legal, footnotes
```

### Line Heights (Optimized for reading)
```
Headings:    1.2 - 1.3 (tight for impact)
Body:        1.6 - 1.7 (comfortable reading)
Captions:    1.4 - 1.5 (compact)
```

### Letter Spacing
```
Display/H1:  -0.02em (tighter)
H2-H4:       -0.01em  
Body:        0 (normal)
Caption/Labels: 0.02em - 0.05em (looser, ALL CAPS)
```

---

## 🎨 Enhanced Color System

### Primary Colors
```css
--plum-deepest:  #151929  /* Text on white */
--plum-deep:     #1A1F3C  /* Primary dark */
--plum-DEFAULT:  #2E3555  /* Hover states */
--plum-light:    #434968  /* Disabled text */
```

### Accent Colors
```css
--coral-bright:  #FF8585  /* Hover state */
--coral-DEFAULT: #FF6B6B  /* Primary accent */
--coral-dark:    #FF5252  /* Active state */
```

### Neutral Palette (Critical for professional look)
```css
--white:         #FFFFFF
--warm-50:       #FDFCFA  /* Page background */
--stone-100:     #F4F3F0  /* Card background */
--stone-200:     #E8E6E0  /* Hover background */
--stone-300:     #E2E0D8  /* Borders */
--stone-400:     #CFCDC3  /* Disabled borders */
--stone-500:     #9A9890  /* Placeholder text */
--stone-600:     #6E6B65  /* Secondary text */
--stone-700:     #4A4845  /* Body text */
--stone-800:     #2D2B29  /* Strong text */
--black:         #1A1918  /* Headings */
```

### Semantic Colors
```css
--success-50:    #ECFDF5
--success-500:   #10B981  /* Green */
--success-700:   #047857

--warning-50:    #FFFBEB
--warning-500:   #F59E0B  /* Amber */
--warning-700:   #B45309

--error-50:      #FEF2F2
--error-500:     #EF4444  /* Red */
--error-700:     #B91C1C

--info-50:       #EFF6FF
--info-500:      #3B82F6  /* Blue */
--info-700:      #1D4ED8
```

---

## 📦 Spacing Scale (8px base - Industry standard)

```
0:    0px
0.5:  2px   - Hairline gaps
1:    4px   - Tiny spacing
1.5:  6px   - Compact
2:    8px   - Small
3:    12px  - Default gap
4:    16px  - Medium
5:    20px  - Large gap
6:    24px  - Section spacing
8:    32px  - Big sections
10:   40px  - Major sections
12:   48px  - Hero spacing
16:   64px  - Huge spacing
20:   80px  - Page sections
24:   96px  - Mega spacing
```

---

## 🔘 Button Sizes & Styles

### Size Scale
```
xs:  h-8  (32px) px-3  text-xs  - Inline actions, tags
sm:  h-9  (36px) px-4  text-sm  - Table actions
md:  h-11 (44px) px-5  text-sm  - DEFAULT (touch-friendly)
lg:  h-12 (48px) px-6  text-base - Primary CTAs
xl:  h-14 (56px) px-8  text-lg  - Hero CTAs
```

### Radius Standards
```
xs:  rounded-lg (8px)  - Compact elements
sm:  rounded-lg (8px)  - Small buttons
md:  rounded-xl (12px) - DEFAULT buttons
lg:  rounded-xl (12px) - Large buttons
xl:  rounded-2xl (16px) - Hero buttons
```

### States (ALL buttons must have)
```css
/* Base */
transition-all duration-200

/* Hover */
hover:shadow-lg
hover:-translate-y-0.5
hover:brightness-110

/* Active */
active:scale-[0.98]

/* Focus */
focus:ring-2
focus:ring-offset-2
focus:outline-none

/* Disabled */
disabled:opacity-50
disabled:cursor-not-allowed
disabled:hover:translate-y-0
disabled:hover:shadow-none
```

---

## 📝 Input Field Standards

### Sizes
```
sm:  h-9  (36px) text-sm px-3  - Compact forms
md:  h-11 (44px) text-sm px-4  - DEFAULT (mobile-friendly)
lg:  h-12 (48px) text-base px-4 - Prominent inputs
```

### Standards
```css
/* Border */
border-2 border-stone-300
focus:border-plum-deep

/* Radius */
rounded-xl (12px)

/* States */
focus:ring-2 focus:ring-plum-deep/20
disabled:bg-stone-100
disabled:cursor-not-allowed

/* Placeholder */
placeholder:text-stone-500
placeholder:text-opacity-60
```

---

## 🃏 Card Standards

### Sizes
```
Compact:    p-4  - List items, small cards
Standard:   p-6  - Product cards, DEFAULT
Spacious:   p-8  - Feature cards, content blocks
```

### Styles
```css
/* Elevation */
shadow-sm         - Subtle (default)
shadow-md         - Hover state
shadow-lg         - Elevated cards
shadow-xl         - Modal, dialog

/* Borders */
rounded-xl        - Standard (12px)
rounded-2xl       - Large cards (16px)
border border-stone-300  - Optional subtle border
```

---

## 📱 Responsive Breakpoints

```
sm:   640px   - Large phones
md:   768px   - Tablets
lg:   1024px  - Laptops
xl:   1280px  - Desktops
2xl:  1536px  - Large screens
```

### Container Max-Widths
```
sm:   640px
md:   768px
lg:   1024px
xl:   1200px  - Sweet spot for content
2xl:  1280px  - Maximum width
```

---

## ⚡ Animation Standards

### Duration
```
Fast:     100ms  - Micro-interactions
Default:  200ms  - Buttons, hovers
Smooth:   300ms  - Transitions, slides
Slow:     500ms  - Page transitions
```

### Easing
```
ease-out      - DEFAULT (feels snappy)
ease-in-out   - Smooth transitions
ease-in       - Exit animations
```

### Common Patterns
```css
/* Hover lift */
transition-all duration-200 ease-out
hover:-translate-y-0.5 hover:shadow-lg

/* Button press */
active:scale-[0.98]

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide in */
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

---

## 🎯 Product Card Best Practices

### Anatomy
```
1. Image (16:9 or 4:3 ratio)
2. Category tag (sm, uppercase, letter-spacing)
3. Title (H3, font-semibold)
4. Price (text-lg, font-bold)
5. Description (text-sm, line-clamp-2)
6. CTA Button (lg size, primary color)
```

### Sizing
```
Mobile:   Full width, min-h-[280px]
Tablet:   2 columns, min-h-[320px]
Desktop:  3-4 columns, min-h-[360px]
```

---

## ♿ Accessibility Requirements

### Color Contrast
```
AAA (7:1)  - Body text
AA (4.5:1) - Large text (18px+)
AA (3:1)   - UI components
```

### Interactive Elements
```
Minimum tap target: 44x44px (mobile)
Focus indicators: Always visible
Keyboard navigation: Full support
Screen readers: Proper ARIA labels
```

---

**This is the foundation. Pages must strictly follow these standards!** 🎯
