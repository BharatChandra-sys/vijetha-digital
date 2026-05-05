import { useState } from 'react';
import ComingSoonModal from '../components/ui/ComingSoonModal';

export default function TestModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Test Coming Soon Modal</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to test the Coming Soon modal popup.
        </p>
        
        <button
          onClick={() => {
            console.log('Test button clicked');
            setShowModal(true);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Show Coming Soon Modal
        </button>

        <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm text-gray-600">
            Modal state: <strong>{showModal ? 'OPEN' : 'CLOSED'}</strong>
          </p>
        </div>
      </div>

      <ComingSoonModal 
        isOpen={showModal} 
        onClose={() => {
          console.log('Modal closed');
          setShowModal(false);
        }} 
      />
    </div>
  );
}
