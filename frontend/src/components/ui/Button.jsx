/**
 * Production-Level Button Component
 * Apple & Amazon quality design system
 */

import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  
  // Variant styles
  const variants = {
    primary: 'bg-plum-deep text-white hover:bg-plum-light focus:ring-plum-deep/20',
    secondary: 'bg-white text-plum-deep border-2 border-plum-deep hover:bg-plum-deep/5 focus:ring-plum-deep/20',
    outline: 'bg-transparent text-plum-deep border-2 border-stone-border hover:border-plum-deep hover:bg-plum-deep/5 focus:ring-plum-deep/20',
    ghost: 'bg-transparent text-plum-deep hover:bg-plum-deep/10 focus:ring-plum-deep/20',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/20',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600/20',
    coral: 'bg-coral-accent text-white hover:bg-coral-accent/90 focus:ring-coral-accent/20',
  };

  // Size styles
  const sizes = {
    xs: 'h-8 px-3 text-xs rounded-lg',
    sm: 'h-9 px-4 text-sm rounded-lg',
    md: 'h-11 px-5 text-sm rounded-xl',
    lg: 'h-12 px-6 text-base rounded-xl',
    xl: 'h-14 px-8 text-lg rounded-xl',
  };

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-bold tracking-wide
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-[0.98]
    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'pointer-events-none' : 'hover:-translate-y-0.5 hover:shadow-lg'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={baseStyles}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-lg">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-lg">{icon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
