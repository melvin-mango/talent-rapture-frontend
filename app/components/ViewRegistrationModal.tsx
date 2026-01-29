// app/components/ViewRegistrationModal.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, Loader, Edit2, Trash2 } from 'lucide-react';
import { EventRegistration, ApiResponse } from '@/lib/types';
import { toast } from 'react-toastify';

interface ViewRegistrationModalProps {
  isOpen: boolean;
  registration: EventRegistration | null;
  onClose: () => void;
  onDelete: (registrationId: string) => Promise<void>;
  onUpdate: (registration: EventRegistration) => void;
}

export default function ViewRegistrationModal({
  isOpen,
  registration,
  onClose,
  onDelete,
  onUpdate,
}: ViewRegistrationModalProps) {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phone: registration?.phone || '',
    physicalAddress: registration?.physicalAddress || '',
    numberOfParticipants: registration?.numberOfParticipants || 1,
  });

  if (!isOpen || !registration) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfParticipants' ? parseInt(value) || 1 : value,
    }));
  };

  const handleEdit = () => {
    setFormData({
      phone: registration.phone,
      physicalAddress: registration.physicalAddress,
      numberOfParticipants: registration.numberOfParticipants,
    });
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
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
      if (!jwt) {
        const msg = 'Authentication token not found. Please refresh and login again.';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/event-registrations/${registration.documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse<EventRegistration> = await response.json();

      if (!response.ok || !data.success) {
        const msg = data.error || 'Failed to update registration';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      // Success
      toast.success('Registration updated successfully!');
      onUpdate(data.data!);
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update registration';
      console.error('Error updating registration:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await onDelete(registration.documentId as any);
      toast.success('Registration deleted successfully!');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete registration';
      console.error('Error deleting registration:', err);
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
          <h2 className="text-2xl font-bold text-black">
            {isEditing ? 'Edit Registration' : 'Registration Details'}
          </h2>
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
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {isEditing ? (
            // Edit Form
            <form onSubmit={handleSave} className="space-y-4">
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
                  onClick={handleCancel}
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
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          ) : (
            // View Details
            <div className="space-y-4">
              {/* Phone */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</p>
                <p className="text-gray-800">{registration.phone}</p>
              </div>

              {/* Physical Address */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Physical Address</p>
                <p className="text-gray-800 whitespace-pre-wrap">{registration.physicalAddress}</p>
              </div>

              {/* Number of Participants */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Number of Participants</p>
                <p className="text-gray-800">{registration.numberOfParticipants}</p>
              </div>

              {/* Event */}
              {registration.event && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Event</p>
                  <p className="text-gray-800">{registration.event.title}</p>
                </div>
              )}

              {/* Created Date */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Registered On</p>
                <p className="text-gray-800">
                  {new Date(registration.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border-2 border-[#FF7F00] text-[#FF7F00] rounded-md hover:bg-[#FF7F00] hover:text-white disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
