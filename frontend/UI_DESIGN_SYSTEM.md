# Vijetha Digital - Production UI Design System

## 🎨 Design Philosophy

**Apple & Amazon Level Quality**
- Minimalist, clean interfaces
- Perfect typography hierarchy
- Smooth micro-interactions
- Professional color palette
- Accessibility-first approach

---

## 🎯 Button System

### Primary Actions
```jsx
<Button variant="primary" size="md">
  Continue
</Button>
```

### Variants
- `primary` - Main actions (plum-deep background)
- `secondary` - Secondary actions (white with border)
- `outline` - Tertiary actions (transparent with border)
- `ghost` - Minimal actions (no border)
- `danger` - Destructive actions (red)
- `success` - Positive actions (green)
- `coral` - Accent actions (coral-accent)

### Sizes
- `xs` - 8px height, compact
- `sm` - 9px height, small
- `md` - 11px height, standard (default)
- `lg` - 12px height, prominent
- `xl` - 14px height, hero

### Features
- `loading` prop - Shows spinner
- `icon` prop - Adds Material Symbol
- `iconPosition` - 'left' or 'right'
- `fullWidth` - Takes 100% width
- `disabled` - Grayed out state

### Examples
```jsx
// Loading button
<Button loading>Processing...</Button>

// With icon
<Button icon="arrow_forward" iconPosition="right">
  Continue
</Button>

// Danger action
<Button variant="danger" icon="delete">
  Delete Account
</Button>

// Full width
<Button fullWidth size="lg">
  Place Order
</Button>
```

---

## 📝 Input System

### Basic Input
```jsx
<Input 
  label="Email Address"
  type="email"
  placeholder="name@example.com"
/>
```

### Features
- `label` - Top label (auto-styled)
- `error` - Error message with red styling
- `helper` - Helper text
- `icon` - Material Symbol icon
- `iconPosition` - 'left' or 'right'
- `showPasswordToggle` - Auto-adds visibility toggle for password fields

### Examples
```jsx
// With icon
<Input 
  label="Email"
  icon="mail"
  iconPosition="left"
  type="email"
/>

// With error
<Input 
  label="Password"
  type="password"
  showPasswordToggle
  error="Password must be at least 6 characters"
/>

// With helper
<Input 
  label="Phone"
  type="tel"
  helper="We'll use this for order updates"
/>
```

---

## 🎨 Color Palette

### Brand Colors (Tailwind Config)
```javascript
colors: {
  'plum-deep': '#1A1F3C',      // Primary dark
  'plum-light': '#2E3555',     // Primary hover
  'coral-accent': '#FF6B6B',   // Accent color
  'warm-white': '#FDFCFA',     // Background
  'stone-light': '#F4F3F0',    // Light background
  'stone-border': '#E2E0D8',   // Borders
  'text-muted': '#6E6B65',     // Secondary text
}
```

### Usage Guidelines
- **plum-deep**: Primary buttons, headings, important text
- **coral-accent**: CTAs, highlights, progress indicators
- **warm-white**: Page backgrounds
- **stone-light**: Card backgrounds, input fields
- **stone-border**: Dividers, input borders
- **text-muted**: Secondary text, placeholders

---

## 📐 Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Hierarchy
- **Hero**: 2rem (32px), bold, letter-spacing: -0.02em
- **H1**: 1.75rem (28px), bold, letter-spacing: -0.02em
- **H2**: 1.5rem (24px), semibold
- **H3**: 1.25rem (20px), semibold
- **Body**: 0.875rem (14px), regular
- **Small**: 0.8125rem (13px), regular
- **Tiny**: 0.75rem (12px), medium

---

## 🔘 Button Styling Rules

### Base Styles (All Buttons)
```css
- rounded-xl (12px border radius)
- font-bold
- tracking-wide (letter-spacing)
- transition-all duration-200
- hover:-translate-y-0.5 (lift on hover)
- hover:shadow-lg
- active:scale-[0.98] (press effect)
- disabled:opacity-60
- disabled:cursor-not-allowed
```

### Standard Button
```css
height: 44px (h-11)
padding: 0 20px (px-5)
font-size: 14px (text-sm)
```

### Loading State
```jsx
{loading && (
  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
)}
```

---

## 📦 Input Styling Rules

### Base Styles
```css
- h-11 (44px height)
- rounded-xl (12px border radius)
- border-2 (thicker borders)
- focus:ring-2 focus:ring-plum-deep/20
- focus:border-plum-deep
- transition-all duration-200
```

### Labels
```css
- text-[0.6875rem] (11px)
- font-bold
- uppercase
- tracking-wider
- text-text-muted
- mb-2 (8px spacing)
```

---

## 🎭 Animation Standards

### Hover Animations
```css
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Click Animations
```css
.button:active {
  transform: scale(0.98);
}
```

### Fade In
```css
.fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile-First Approach
```jsx
// Always start with mobile, then add larger breakpoints
<div className="px-4 sm:px-6 lg:px-8">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl">
    Title
  </h1>
</div>
```

---

## ♿ Accessibility

### Must-Have Attributes
```jsx
// Buttons
<button aria-label="Close dialog">
  <span className="material-symbols-outlined">close</span>
</button>

// Inputs
<input
  type="text"
  aria-describedby="error-message"
  aria-invalid={hasError}
/>

// Password toggle
<button
  aria-label={showPassword ? "Hide password" : "Show password"}
  tabIndex={-1}
/>
```

### Focus States
- Always visible focus rings
- Keyboard navigable
- Skip to content links
- Proper heading hierarchy

---

## 🚀 Production Checklist

### Before Pushing to Production
- [ ] All buttons use Button component
- [ ] All inputs use Input component
- [ ] Proper loading states
- [ ] Error handling UI
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Focus states visible
- [ ] Color contrast AAA rated
- [ ] Smooth animations (60fps)
- [ ] No layout shifts

---

## 💡 Best Practices

### DO ✅
- Use semantic HTML (`<button>`, `<input>`, `<label>`)
- Add loading states to async actions
- Show success/error feedback
- Use proper spacing (4px, 8px, 12px, 16px, 24px, 32px)
- Keep animations under 300ms
- Use proper color contrast

### DON'T ❌
- Use `<div>` as buttons
- Disable buttons without showing why
- Use tiny font sizes (<12px)
- Animate too many things at once
- Use pure black (#000) or pure white (#FFF)
- Forget mobile users

---

## 📚 Component Examples

### Login Form
```jsx
<form onSubmit={handleSubmit} className="space-y-4">
  <Input 
    label="Email Address"
    type="email"
    icon="mail"
    placeholder="name@example.com"
    required
  />
  
  <Input 
    label="Password"
    type="password"
    showPasswordToggle
    placeholder="Enter your password"
    required
  />
  
  <Button 
    type="submit"
    fullWidth
    size="lg"
    loading={loading}
  >
    Sign In
  </Button>
</form>
```

### Action Group
```jsx
<div className="flex items-center gap-3">
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="primary" loading={saving}>
    Save Changes
  </Button>
</div>
```

---

**This is your production-ready design system. Use it consistently across all pages!** 🎉
