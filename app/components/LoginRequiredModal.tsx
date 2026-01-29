// app/components/LoginRequiredModal.tsx
'use client';

import { X } from 'lucide-react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  onLoginClick,
  onRegisterClick,
}: LoginRequiredModalProps) {
  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose();
    onLoginClick();
  };

  const handleRegisterClick = () => {
    onClose();
    onRegisterClick();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-black">Login Required</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-center mb-6">
            You need to be logged in to register for events. Please login or create an account to continue.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleLoginClick}
              className="flex-1 px-4 py-2 border-2 border-[#FF7F00] text-[#FF7F00] rounded-md hover:bg-[#FF7F00] hover:text-white font-semibold transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              className="flex-1 px-4 py-2 bg-[#FF7F00] text-white rounded-md hover:bg-[#e67e00] font-semibold transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
