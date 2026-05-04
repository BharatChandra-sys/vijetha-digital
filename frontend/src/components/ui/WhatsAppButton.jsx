import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip for 5 seconds
      setTimeout(() => setShowTooltip(true), 500);
      setTimeout(() => setShowTooltip(false), 5500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // WhatsApp number (replace with actual business number)
  const phoneNumber = '919876543210'; // Format: country code + number (no + or spaces)
  
  // Pre-filled message
  const message = encodeURIComponent(
    `Hello Vijetha Digital! 👋\n\nI'm interested in your printing services and would like to:\n\n• Get a quote for my project\n• Discuss product options\n• Place an order\n\nCould you please assist me?\n\nThank you!`
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip */}
        {showTooltip && (
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs animate-bounce-in mr-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Need Help? Chat with us!
                </p>
                <p className="text-xs text-gray-600">
                  Get instant quotes and place orders via WhatsApp
                </p>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={handleClick}
          className="group relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 animate-fade-in"
          aria-label="Chat on WhatsApp"
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
          
          {/* WhatsApp Icon */}
          <svg
            className="w-8 h-8 relative z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>

          {/* Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            1
          </span>
        </button>

        {/* Text label (optional, shows on hover) */}
        <div className="absolute right-20 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Chat with us on WhatsApp
            <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          60% {
            opacity: 1;
            transform: translateX(-10px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </>
  );
}
