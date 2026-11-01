import { useState, useEffect, useRef } from 'react';
import { BUSINESS } from '../../config/business';

export default function WhatsAppButton() {
  const isVisible = true; // Always visible
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef(null);

  // Show button after 1 second and tooltip after 2 seconds
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('whatsapp-tooltip-seen') === '1'; } catch { /* storage blocked */ }
    if (seen || !window.matchMedia('(min-width: 1024px)').matches) return undefined;

    const show = setTimeout(() => {
      setShowTooltip(true);
      try { sessionStorage.setItem('whatsapp-tooltip-seen', '1'); } catch { /* storage blocked */ }
    }, 4000);
    const hide = setTimeout(() => setShowTooltip(false), 10000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  // Initialize position - always use default bottom-right position
  useEffect(() => {
    const saved = localStorage.getItem('whatsapp-button-position');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only use saved position if it's valid and not default
        if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number' && (parsed.x !== 0 || parsed.y !== 0)) {
          setPosition(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved position', e);
        localStorage.removeItem('whatsapp-button-position');
      }
    }
  }, []);

  // WhatsApp number from environment variable or fallback
  const phoneNumber = BUSINESS.whatsapp;
  
  // Pre-filled message
  const message = encodeURIComponent(
    `Hello Vijetha Digital! 👋\n\nI'm interested in your printing services and would like to:\n\n• Get a quote for my project\n• Discuss product options\n• Place an order\n\nCould you please assist me?\n\nThank you!`
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleClick = () => {
    if (!isDragging) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Drag handlers with proper event handling
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = position.x || 0;
    const startPosY = position.y || 0;
    let hasMoved = false;
    let currentPos = { x: startPosX, y: startPosY };
    
    const handleMove = (moveEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Only set dragging if moved more than 5px
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved = true;
        setIsDragging(true);
      }
      
      if (hasMoved) {
        const newX = startPosX + deltaX;
        const newY = startPosY + deltaY;
        
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 80;
        
        currentPos = {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        };
        
        setPosition(currentPos);
      }
    };
    
    const handleUp = () => {
      if (hasMoved) {
        localStorage.setItem('whatsapp-button-position', JSON.stringify(currentPos));
      }
      setTimeout(() => setIsDragging(false), 100);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startPosX = position.x || 0;
    const startPosY = position.y || 0;
    let hasMoved = false;
    let currentPos = { x: startPosX, y: startPosY };
    
    const handleMove = (moveEvent) => {
      moveEvent.preventDefault();
      const touchMove = moveEvent.touches[0];
      const deltaX = touchMove.clientX - startX;
      const deltaY = touchMove.clientY - startY;
      
      // Only set dragging if moved more than 5px
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved = true;
        setIsDragging(true);
      }
      
      if (hasMoved) {
        const newX = startPosX + deltaX;
        const newY = startPosY + deltaY;
        
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 80;
        
        currentPos = {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        };
        
        setPosition(currentPos);
      }
    };
    
    const handleEnd = () => {
      if (hasMoved) {
        localStorage.setItem('whatsapp-button-position', JSON.stringify(currentPos));
      }
      setTimeout(() => setIsDragging(false), 100);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
    
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseup', () => {});
    };
  }, []);

  if (!isVisible) return null;

  // Only apply custom position if user has dragged it
  const hasCustomPosition = position.x !== 0 || position.y !== 0;
  const buttonStyle = hasCustomPosition
    ? { right: 'auto', bottom: 'auto', left: `${position.x}px`, top: `${position.y}px` }
    : {};

  const iconPath = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

  return (
    <div
      ref={buttonRef}
      className="fixed right-4 flex flex-col items-end gap-3 lg:right-6"
      style={{
        bottom: 'calc(var(--sticky-bar, 0px) + 16px)',
        ...buttonStyle,
        zIndex: 35,
      }}
    >
      {showTooltip && !isDragging && (
        <div className="relative w-64 rounded-lg border border-line bg-surface p-4 pr-10 text-ink shadow-lg animate-fade-in">
          <p className="text-sm font-semibold">Need help? Chat with us</p>
          <p className="mt-1 text-[0.8125rem] leading-snug text-ink-2">Get instant quotes and place orders via WhatsApp.</p>
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-md text-ink-3 hover:text-ink"
            aria-label="Close tooltip"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      <button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        title="Chat on WhatsApp. Drag to move."
        aria-label="Chat on WhatsApp"
        className={`flex h-[52px] w-[52px] items-center justify-center !rounded-full bg-[#25D366] shadow-lg transition-colors hover:bg-[#128C7E] touch-none select-none ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
      >
        <svg viewBox="0 0 24 24" fill="#fff" width="28" height="28" aria-hidden="true"><path d={iconPath} /></svg>
      </button>
    </div>
  );
}
