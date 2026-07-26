/**
 * Production-Level Input Component
 * Apple & Amazon quality design system
 */

import { forwardRef, useState } from 'react';

const Input = forwardRef(({
  label,
  error,
  helper,
  icon,
  iconPosition = 'left',
  type = 'text',
  showPasswordToggle = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const actualType = (type === 'password' && showPassword) ? 'text' : type;
  
  const hasError = Boolean(error);
  
  const inputStyles = `
    w-full h-11 text-sm rounded-xl
    border-2 transition-all duration-200
    bg-white
    outline-none
    placeholder:text-text-muted/40
    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-stone-light/50
    ${hasError 
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
      : 'border-stone-border focus:border-plum-deep focus:ring-2 focus:ring-plum-deep/20'}
    ${icon && iconPosition === 'left' ? 'pl-11 pr-4' : ''}
    ${icon && iconPosition === 'right' ? 'pl-4 pr-11' : ''}
    ${!icon && showPasswordToggle ? 'pl-4 pr-11' : ''}
    ${!icon && !showPasswordToggle ? 'px-4' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <span className="material-symbols-outlined text-lg">{icon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={actualType}
          className={inputStyles}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <span className="material-symbols-outlined text-lg">{icon}</span>
          </div>
        )}
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-plum-deep transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      
      {(error || helper) && (
        <div className={`flex items-start gap-1.5 text-xs ${
          hasError ? 'text-red-600' : 'text-text-muted'
        }`}>
          {hasError && (
            <span className="material-symbols-outlined text-sm mt-0.5 flex-shrink-0">error</span>
          )}
          <p className="leading-tight">{error || helper}</p>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
