import { X } from 'lucide-react';

export default function ComingSoonModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const message = encodeURIComponent(
    `Hello Vijetha Digital! 👋\n\nI saw your website and I'm ready to place an order!\n\nCould you please help me with:\n• Product details\n• Pricing\n• Order placement\n\nThank you!`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-plum-deep/85 backdrop-blur-sm p-4 sm:p-6 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-[20px] shadow-architectural-xl overflow-hidden animate-fade-in-up">
        {/* Decorative top bar with gradient */}
        <div className="h-2 bg-gradient-to-r from-coral-accent via-plum-deep to-coral-accent"></div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-7 sm:right-7 sm:top-9 text-text-muted hover:text-plum-deep transition-colors rounded-full p-2 hover:bg-stone-light z-10"
          aria-label="Close"
        >
          <X className="h-7 w-7 sm:h-8 sm:w-8" />
        </button>

        {/* Content */}
        <div className="px-6 py-10 sm:px-16 sm:py-16 text-center">
          {/* Icon with glow effect */}
          <div className="mb-8 sm:mb-10 flex justify-center">
            <div className="relative">
              {/* Glow background */}
              <div className="absolute inset-0 bg-coral-accent/20 rounded-full blur-3xl scale-150"></div>
              {/* Icon container */}
              <div className="relative bg-gradient-to-br from-plum-deep to-plum-darker rounded-full p-8 sm:p-10 shadow-soft-plum">
                <svg 
                  className="w-16 h-16 sm:w-20 sm:h-20 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-4 border-coral-accent/20 scale-125"></div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-plum-deep mb-5 sm:mb-7 tracking-tight leading-tight">
            We're Launching Soon! 🚀
          </h2>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-text-muted mb-10 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
            Our online payment system is being prepared for launch. In the meantime, 
            you can place orders directly through WhatsApp for instant service!
          </p>

          {/* CTA Buttons */}
          <div className="space-y-4 sm:space-y-5 max-w-lg mx-auto">
            {/* WhatsApp Button - Large and prominent */}
            <button
              onClick={handleWhatsApp}
              className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-5 sm:py-6 px-8 sm:px-10 rounded-[12px] shadow-soft-plum hover:shadow-card-hover transition-all duration-300 flex items-center justify-center gap-4 text-lg sm:text-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg 
                className="w-8 h-8 sm:w-9 sm:h-9 group-hover:scale-110 transition-transform" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Order via WhatsApp</span>
            </button>

            {/* Continue Browsing Button */}
            <button
              onClick={onClose}
              className="w-full bg-white hover:bg-stone-light border-2 border-stone-border hover:border-plum-deep text-plum-deep font-bold py-5 sm:py-6 px-8 sm:px-10 rounded-[12px] transition-all duration-300 text-lg sm:text-xl transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Continue Browsing
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-stone-border">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-5">
              <div className="flex items-center gap-2 text-sm sm:text-base text-text-muted font-medium">
                <span className="material-symbols-outlined text-coral-accent text-xl">verified_user</span>
                <span>Instant quotes</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base text-text-muted font-medium">
                <span className="material-symbols-outlined text-coral-accent text-xl">bolt</span>
                <span>Fast response</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base text-text-muted font-medium">
                <span className="material-symbols-outlined text-coral-accent text-xl">workspace_premium</span>
                <span>Professional service</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-text-muted">
              Need help?{' '}
              <a
                href="/contact"
                className="font-bold text-plum-deep hover:text-coral-accent transition-colors underline decoration-2 underline-offset-4"
              >
                Contact our team
              </a>
            </p>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="h-1 bg-gradient-to-r from-transparent via-coral-accent to-transparent opacity-50"></div>
      </div>
    </div>
  );
}
