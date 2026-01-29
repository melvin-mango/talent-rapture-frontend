// app/components/RegistrationModal.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, Loader } from 'lucide-react';
import { EventRegistrationRequest, ApiResponse, EventRegistration } from '@/lib/types';
import LoginRequiredModal from './LoginRequiredModal';
import { toast } from 'react-toastify';

interface RegistrationModalProps {
  isOpen: boolean;
  eventId: string;
  eventTitle: string;
  onClose: () => void;
  onSuccess: (registration: EventRegistration) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function RegistrationModal({
  isOpen,
  eventId,
  eventTitle,
  onClose,
  onSuccess,
  onLoginClick,
  onRegisterClick,
}: RegistrationModalProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    physicalAddress: '',
    numberOfParticipants: 1,
  });

  if (!isOpen) return null;

  // Show loading while session is loading
  if (status !== 'authenticated' && status !== 'unauthenticated') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 flex flex-col items-center gap-4">
          <Loader size={40} className="animate-spin text-[#FF7F00]" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (status === 'unauthenticated' || !session?.user) {
    return (
      <>
        <LoginRequiredModal
          isOpen={true}
          onClose={onClose}
          onLoginClick={onLoginClick}
          onRegisterClick={onRegisterClick}
        />
      </>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfParticipants' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation
      if (!formData.phone.trim()) {
        const msg = 'Phone number is required';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }
      if (!formData.physicalAddress.trim()) {
        const msg = 'Physical address is required';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }
      if (formData.numberOfParticipants < 1) {
        const msg = 'Number of participants must be at least 1';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      const jwt = (session as any)?.jwt;
      const userId = (session?.user as any)?.id;

      console.log('Session:', session);
      console.log('JWT:', jwt);
      console.log('UserID:', userId);
      console.log('EventID:', eventId);

      if (!jwt) {
        const msg = 'Authentication token not found. Please refresh and login again.';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      if (!userId) {
        const msg = 'User ID not found. Please refresh and login again.';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      if (!eventId) {
        const msg = 'Event ID not found. Please try again.';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          phone: formData.phone,
          physicalAddress: formData.physicalAddress,
          numberOfParticipants: formData.numberOfParticipants,
          event: eventId,
          userId: userId,
        }),
      });

      const data: ApiResponse<EventRegistration> = await response.json();

      if (!response.ok || !data.success) {
        const msg = data.error || 'Failed to create registration';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      // Success
      toast.success('Event registration successful!');
      onSuccess(data.data!);
      setFormData({
        phone: '',
        physicalAddress: '',
        numberOfParticipants: 1,
      });
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create registration';
      console.error('Error registering:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-black">Register for Event</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Title */}
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Event:</span> {eventTitle}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#FF7F00] disabled:bg-gray-100"
                required
              />
            </div>

            {/* Physical Address */}
            <div>
              <label htmlFor="physicalAddress" className="block text-sm font-semibold text-gray-700 mb-1">
                Physical Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="physicalAddress"
                name="physicalAddress"
                value={formData.physicalAddress}
                onChange={handleChange}
                placeholder="Enter your physical address"
                disabled={isLoading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#FF7F00] disabled:bg-gray-100 resize-none"
                required
              />
            </div>

            {/* Number of Participants */}
            <div>
              <label htmlFor="numberOfParticipants" className="block text-sm font-semibold text-gray-700 mb-1">
                Number of Participants <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="numberOfParticipants"
                name="numberOfParticipants"
                value={formData.numberOfParticipants}
                onChange={handleChange}
                placeholder="Enter number of participants"
                disabled={isLoading}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#FF7F00] disabled:bg-gray-100"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-[#FF7F00] text-white rounded-md hover:bg-[#e67e00] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
