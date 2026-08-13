/**
 * DPDP Act 2023 Compliant Data Protection Notice
 * To be displayed on forms collecting personal data
 */

interface DataProtectionNoticeProps {
  context: 'contact' | 'quote' | 'newsletter' | 'feedback';
}

export default function DataProtectionNotice({ context }: DataProtectionNoticeProps) {
  const notices = {
    contact: {
      title: 'How We Use Your Information',
      purpose: 'to respond to your inquiry and provide the requested information about our services',
      retention: '3 years from last contact',
    },
    quote: {
      title: 'Quote Request Data Usage',
      purpose: 'to prepare and send you a customized quote, follow up on your requirements, and maintain project records',
      retention: '5 years for business records compliance',
    },
    newsletter: {
      title: 'Newsletter Subscription Notice',
      purpose: 'to send you promotional emails, product updates, and industry news',
      retention: 'until you unsubscribe',
    },
    feedback: {
      title: 'Feedback Data Usage',
      purpose: 'to improve our services and address any concerns you may have',
      retention: '2 years from submission',
    },
  };

  const notice = notices[context];

  return (
    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {notice.title}
      </h4>
      <div className="text-xs text-gray-700 space-y-2">
        <p>
          By submitting this form, you consent to Vijetha Digital collecting and processing 
          your personal data {notice.purpose}.
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Data Retention:</strong> {notice.retention}</li>
          <li><strong>Your Rights:</strong> Access, correct, delete your data anytime</li>
          <li><strong>Data Storage:</strong> Securely stored in India (DPDP Act compliant)</li>
          <li><strong>Contact:</strong> privacy@vijethadigital.com</li>
        </ul>
        <p className="text-xs italic">
          See our{' '}
          <a href="/privacy" className="text-blue-600 hover:underline font-medium">
            Privacy Policy
          </a>
          {' '}for complete details.
        </p>
      </div>
    </div>
  );
}
