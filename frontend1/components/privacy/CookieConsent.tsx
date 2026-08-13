'use client';

import { useState, useEffect } from 'react';

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
      {/* Minimal Bottom Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2a2b2e] border-t border-[#3a3b3f] z-[9999] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Left: Simple Icon + Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-[#fdd484]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="flex-1">
                <p className="text-[#e5e5e5] text-sm leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking <strong className="text-white">"Accept All"</strong>, you consent to our use of cookies.{' '}
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-[#fdd484] hover:text-[#ffed84] underline underline-offset-2 transition-colors"
                  >
                    Customize Preferences
                  </button>
                </p>
              </div>
            </div>

            {/* Right: Clean Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
              <button
                onClick={rejectAll}
                className="flex-1 md:flex-none px-5 py-2 bg-transparent border border-[#5a5b5f] hover:border-[#fdd484] text-[#e5e5e5] hover:text-white text-sm font-medium rounded transition-all"
              >
                Reject All
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 md:flex-none px-5 py-2 bg-[#fdd484] hover:bg-[#ffed84] text-[#1c1d20] text-sm font-semibold rounded transition-all"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Modal */}
      {showModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 z-[10000]"
            onClick={() => setShowModal(false)}
          />
          
          <div className="fixed inset-0 z-[10001] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-[#2a2b2e] rounded-lg shadow-2xl max-w-2xl w-full border border-[#3a3b3f]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#3a3b3f]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Cookie Preferences</h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-[#9a9a9a] hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-3">
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

                  {/* DPDP Notice */}
                  <div className="mt-5 p-3 bg-[#3a3b3f] rounded text-xs text-[#b5b5b5] leading-relaxed">
                    <strong className="text-[#fdd484]">DPDP Act 2023:</strong> Change preferences anytime. Data stored in India. Contact:{' '}
                    <a href="mailto:privacy@vijethadigital.com" className="text-[#fdd484] hover:text-[#ffed84] underline">
                      privacy@vijethadigital.com
                    </a>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#3a3b3f] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a 
                    href="/privacy" 
                    target="_blank"
                    className="text-sm text-[#fdd484] hover:text-[#ffed84] underline"
                  >
                    Privacy Policy
                  </a>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={rejectAll}
                      className="flex-1 sm:flex-none px-4 py-2 bg-transparent border border-[#5a5b5f] hover:border-[#fdd484] text-[#e5e5e5] hover:text-white text-sm font-medium rounded transition-all"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={saveCustom}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#fdd484] hover:bg-[#ffed84] text-[#1c1d20] text-sm font-semibold rounded transition-all"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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
    <div className="bg-[#33353a] rounded p-4 border border-[#3a3b3f] hover:border-[#4a4b4f] transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-medium text-white text-sm">{title}</h3>
            {badge && <span className="px-2 py-0.5 bg-[#fdd484] text-[#1c1d20] text-xs rounded font-medium">{badge}</span>}
          </div>
          <p className="text-xs text-[#b5b5b5] leading-relaxed">{description}</p>
        </div>
        <div className="flex-shrink-0">
          {disabled ? (
            <div className="w-10 h-5 bg-[#5a5b5f] rounded-full relative cursor-not-allowed opacity-60">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </div>
          ) : (
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} className="sr-only peer" />
              <div className="w-10 h-5 bg-[#5a5b5f] rounded-full peer peer-checked:bg-[#fdd484] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
