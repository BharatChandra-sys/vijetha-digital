import { useState, useEffect, useRef } from 'react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(true); // Always visible
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef(null);

  // Show button after 1 second (reduced from 3)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip for 6 seconds
      setTimeout(() => setShowTooltip(true), 500);
      setTimeout(() => setShowTooltip(false), 6500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize position from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem('whatsapp-button-position');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only use saved position if it's valid
        if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setPosition(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved position', e);
        localStorage.removeItem('whatsapp-button-position');
      }
    }
  }, []);

  // WhatsApp number from environment variable or fallback
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  
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

  return (
    <>
      {/* Floating WhatsApp Button - Force visible on ALL screen sizes */}
      <div 
        ref={buttonRef}
        className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 flex flex-col items-end gap-3 sm:gap-4 pointer-events-auto"
        style={{
          ...buttonStyle,
          display: 'flex !important',
          visibility: 'visible !important',
          opacity: '1 !important',
          zIndex: 9999
        }}
      >
        {/* Large Tooltip Card */}
        {showTooltip && !isDragging && (
          <div className="bg-white rounded-[16px] shadow-architectural-xl p-4 sm:p-6 max-w-[280px] sm:max-w-md mr-2 animate-bounce-in border border-stone-border">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-lg font-bold text-plum-deep mb-1 sm:mb-2 leading-tight">
                  Need Help? Chat with us! 💬
                </h4>
                <p className="text-xs sm:text-base text-text-dark/70 leading-relaxed mb-2 sm:mb-3 font-medium">
                  Get instant quotes and place orders via WhatsApp
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[0.6875rem] sm:text-sm text-text-dark/60">
                  <span className="material-symbols-outlined text-coral-accent text-sm sm:text-base">schedule</span>
                  <span className="font-semibold">Usually replies within minutes</span>
                </div>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="flex-shrink-0 text-text-muted hover:text-plum-deep transition-colors p-1"
                aria-label="Close tooltip"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main WhatsApp Button - Perfectly Circular and Draggable */}
        <button
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`group relative bg-green-500 hover:bg-green-600 text-white !rounded-full w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 ${isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105'} active:scale-95 touch-none`}
          aria-label="Chat on WhatsApp"
          style={{ userSelect: 'none', borderRadius: '50%' }}
        >
          {/* WhatsApp Icon - Centered in circle */}
          <svg
            className="w-7 h-7 lg:w-8 lg:h-8 relative z-10 pointer-events-none"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>

          {/* Notification Badge - Circular */}
          <span className="absolute -top-1 -right-1 bg-coral-accent text-white text-[10px] lg:text-xs font-bold rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center shadow-sm">
            1
          </span>
          
          {/* Drag hint */}
          {!isDragging && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[0.625rem] text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Drag to move
            </span>
          )}
        </button>
      </div>
    </>
  );
}
