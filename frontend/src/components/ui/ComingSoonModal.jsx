import { X, Rocket } from 'lucide-react';

export default function ComingSoonModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Rocket className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Coming Soon!
          </h2>
          <p className="mb-6 text-gray-600">
            We're preparing to launch our online ordering system. 
            Check back soon to place your orders!
          </p>

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
            <p className="text-sm text-gray-500">
              In the meantime, browse our products and services
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-500">
            Want to place an order now?{' '}
            <a
              href="/contact"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Contact us directly
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
