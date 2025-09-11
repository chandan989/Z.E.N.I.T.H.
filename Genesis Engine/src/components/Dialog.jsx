import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Dialog = ({ isOpen, onClose, children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      // Delay unmounting for the animation to complete
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isMounted) {
    return null;
  }

  const dialogContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/60 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-dark-matter rounded-2xl p-6 w-full max-w-lg relative transition-all duration-300 ${isOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stardust-grey hover:text-white"
        >
          ✕
        </button>
        {typeof children === 'function' ? children(onClose) : children}
      </div>
    </div>
  );

  const portalContainer = document.getElementById('portal-root');

  if (!portalContainer) {
    console.error("The portal root element with ID 'portal-root' was not found in the DOM.");
    // Fallback to rendering in place, though this may have stacking issues
    return dialogContent;
  }

  return createPortal(dialogContent, portalContainer);
};

export default Dialog;
