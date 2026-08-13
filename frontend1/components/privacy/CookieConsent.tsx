'use client';

import { useState, useEffect } from 'react';

/**
 * Premium Enterprise Cookie Consent Banner
 * DPDP Act 2023 Compliant | Bottom Sticky Design
 * Inspired by Google, Microsoft, LinkedIn
 */

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functionality: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functionality: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        applyConsent(saved);
      } catch (e) {
        console.error('Failed to parse cookie consent', e);
      }
    }
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    if (prefs.analytics) {
      console.log('Analytics enabled');
    } else {
      console.log('Analytics disabled');
    }

    if (prefs.marketing) {
      console.log('Marketing enabled');
    } else {
      console.log('Marketing disabled');
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    applyConsent(prefs);
    setShowBanner(false);
    setShowModal(false);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      functionality: true,
    });
  };

  const rejectAll = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functionality: false,
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Premium Bottom Sticky Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-[9999] animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="text-gray-900 font-medium mb-1">
                  We value your privacy
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We use cookies to enhance your experience. By clicking "Accept All", you consent to cookies.{' '}
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Manage Preferences
                  </button>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={rejectAll}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                Reject All
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm text-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
            onClick={() => setShowModal(false)}
          />
          
          <div className="fixed inset-0 z-[10001] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage how we use cookies</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    <CookieCategory
                      title="Strictly Necessary"
                      description="Essential for the website to function. Cannot be disabled."
                      checked={true}
                      disabled={true}
                      badge="Always Active"
                    />

                    <CookieCategory
                      title="Analytics & Performance"
                      description="Help us understand visitor interactions and improve our website."
                      checked={preferences.analytics}
                      onChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                    />

                    <CookieCategory
                      title="Functionality"
                      description="Remember your preferences for enhanced personalized features."
                      checked={preferences.functionality}
                      onChange={(checked) => setPreferences({ ...preferences, functionality: checked })}
                    />

                    <CookieCategory
                      title="Marketing & Advertising"
                      description="Deliver personalized ads and track campaign effectiveness."
                      checked={preferences.marketing}
                      onChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                    />
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-gray-700">
                      <strong>🛡️ DPDP Act 2023:</strong> Change preferences anytime. Data stored in India. 
                      Contact: <a href="mailto:privacy@vijethadigital.com" className="text-blue-600 underline">privacy@vijethadigital.com</a>
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl flex justify-between items-center">
                  <a href="/privacy" target="_blank" className="text-sm text-blue-600 hover:underline">Privacy Policy</a>
                  <div className="flex gap-2">
                    <button onClick={rejectAll} className="px-5 py-2.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg text-sm">
                      Reject All
                    </button>
                    <button onClick={saveCustom} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}</style>
    </>
  );
}

interface CookieCategoryProps {
  title: string;
  description: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  badge?: string;
}

function CookieCategory({ title, description, checked, onChange, disabled, badge }: CookieCategoryProps) {
  return (
    <div className="bg-white rounded-lg p-5 border-2 border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {badge && <span className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded">{badge}</span>}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex-shrink-0">
          {disabled ? (
            <input type="checkbox" checked={checked} disabled className="w-5 h-5 rounded cursor-not-allowed" />
          ) : (
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
