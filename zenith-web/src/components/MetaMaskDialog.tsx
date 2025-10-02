import React from 'react';

interface MetaMaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MetaMaskDialog: React.FC<MetaMaskDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-void-black p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">MetaMask Not Detected</h2>
        <p>To connect your wallet, you need to install the MetaMask extension.</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="bg-stardust-grey text-white font-bold py-2 px-4 rounded-lg">
            Close
          </button>
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="bg-celestial-blue text-void-black font-bold py-2 px-4 rounded-lg">
            Install MetaMask
          </a>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskDialog;
