'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from "../components/Header";
import { Calendar, MapPin, Clock, Download, Loader } from "lucide-react";
import { Event, ApiResponse, EventRegistration } from '@/lib/types';
import RegistrationModal from '../components/RegistrationModal';
import ViewRegistrationModal from '../components/ViewRegistrationModal';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const EventCard = ({ event, onLoginClick, onRegisterClick }: { event: Event; onLoginClick: () => void; onRegisterClick: () => void }) => {
    const { data: session } = useSession();
    const [isDownloading, setIsDownloading] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [userRegistration, setUserRegistration] = useState<EventRegistration | null>(null);
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

    // Format date from ISO format (YYYY-MM-DD) to readable format
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return dateString;
        }
    };

    // Check if user has already registered for this event
    const checkRegistration = async () => {
        if (!session?.user) {
            setIsCheckingRegistration(false);
            return;
        }

        try {
            const jwt = (session as any).jwt;
            if (!jwt) {
                console.log('No JWT in session');
                setIsCheckingRegistration(false);
                return;
            }

            const response = await fetch(`/api/event-registrations?eventId=${event.documentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
            });

            if (response.ok) {
                const data: ApiResponse<EventRegistration[]> = await response.json();
                if (data.success && data.data && data.data.length > 0) {
                    setUserRegistration(data.data[0]);
                }
            }
        } catch (error) {
            console.error('Error checking registration:', error);
        } finally {
            setIsCheckingRegistration(false);
        }
    };

    useEffect(() => {
        checkRegistration();
    }, [session?.user, event.id]);

    // Handle flyer download
    const handleDownloadFlyer = async () => {
        if (!event.flyer?.url) {
            alert('Flyer not available for this event');
            return;
        }

        setIsDownloading(true);
        try {
            const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
            const flyerUrl = event.flyer.url.startsWith('http') 
                ? event.flyer.url 
                : `${strapiUrl}${event.flyer.url}`;

            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = flyerUrl;
            link.download = event.flyer.name || `${event.title}-flyer`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading flyer:', error);
            alert('Failed to download flyer');
        } finally {
            setIsDownloading(false);
        }
    };

    // Handle successful registration
    const handleRegistrationSuccess = (registration: EventRegistration) => {
        setUserRegistration(registration);
        setShowRegistrationModal(false);
    };

    // Handle delete registration
    const handleDeleteRegistration = async (registrationId: string) => {
        try {
            const jwt = (session as any).jwt;
            if (!jwt) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`/api/event-registrations/${registrationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
            });

            const data: ApiResponse<null> = await response.json();
            if (data.success) {
                setUserRegistration(null);
                setShowViewModal(false);
            } else {
                throw new Error(data.error || 'Failed to delete registration');
            }
        } catch (error) {
            console.error('Error deleting registration:', error);
            throw error;
        }
    };

    // Handle update registration
    const handleUpdateRegistration = (updatedRegistration: EventRegistration) => {
        setUserRegistration(updatedRegistration);
    };

    // Get image URL
    const getImageUrl = () => {
        if (!event.image?.url) return '/img/abti2.jpg';
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
        return event.image.url.startsWith('http') 
            ? event.image.url 
            : `${strapiUrl}${event.image.url}`;
    };

    return (
        <>
            <div className="bg-[#FEFAE0] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                {/* Event Image */}
                <div className="h-48 bg-gray-300 overflow-hidden">
                    <img 
                        src={getImageUrl()} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/img/abti2.jpg';
                        }}
                    />
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col gap-4">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-center text-black">
                        {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="flex flex-col gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={18} />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} />
                            <span>{event.time}</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                        {isCheckingRegistration ? (
                            <div className="w-full flex items-center justify-center py-2">
                                <Loader size={18} className="animate-spin text-[#FF7F00]" />
                            </div>
                        ) : (
                            <>
                                {userRegistration ? (
                                    <button 
                                        onClick={() => setShowViewModal(true)}
                                        className="w-full cursor-pointer border-2 border-[#FF7F00] bg-[#FF7F00] hover:bg-transparent text-white hover:text-[#FF7F00] font-semibold py-2 px-4 rounded transition-colors"
                                    >
                                        View Registration
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setShowRegistrationModal(true)}
                                        className="w-full cursor-pointer border-2 border-[#FF7F00] bg-[#FF7F00] hover:bg-transparent text-white hover:text-[#FF7F00] font-semibold py-2 px-4 rounded transition-colors"
                                    >
                                        Register Now
                                    </button>
                                )}
                            </>
                        )}

                        <button 
                            onClick={handleDownloadFlyer}
                            disabled={isDownloading || !event.flyer?.url}
                            className="w-full cursor-pointer border-2 border-[#FF7F00] text-[#FF7F00] hover:bg-[#FF7F00] hover:text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    Download Flyer
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <RegistrationModal
                isOpen={showRegistrationModal}
                eventId={event.documentId}
                eventTitle={event.title}
                onClose={() => setShowRegistrationModal(false)}
                onSuccess={handleRegistrationSuccess}
                onLoginClick={onLoginClick}
                onRegisterClick={onRegisterClick}
            />

            <ViewRegistrationModal
                isOpen={showViewModal}
                registration={userRegistration}
                onClose={() => setShowViewModal(false)}
                onDelete={handleDeleteRegistration}
                onUpdate={handleUpdateRegistration}
            />
        </>
    );
};

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('Fetching events from /api/events');
            const response = await fetch('/api/events', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);
                throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch events`);
            }

            const data: ApiResponse<Event[]> = await response.json();
            console.log('Events data received:', data);
            
            if (data.success && data.data) {
                console.log('Events with IDs:', data.data.map(e => ({ id: e.id, documentId: e.documentId, title: e.title })));
                setEvents(data.data);
            } else {
                setError(data.error || 'Failed to load events');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="w-full bg-[#F3DEBA] items-center justify-center flex" id="events">
            <div className="w-full xl:w-7xl p-4 flex flex-col gap-y-5">
                <Header heading={'Events'}/>
                <p className="text-xl text-black font-light">
                    Our Upcoming Events
                </p>
                
                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader size={40} className="animate-spin text-[#FF7F00]" />
                            <p className="text-gray-700">Loading events...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-semibold">Error loading events</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && events.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-700 text-lg">There are no events at the moment</p>
                    </div>
                )}

                {/* Events Grid */}
                {!isLoading && events.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                        {events.map((event) => (
                            <EventCard 
                                key={event.id} 
                                event={event}
                                onLoginClick={() => setShowLoginModal(true)}
                                onRegisterClick={() => setShowRegisterModal(true)}
                            />
                        ))}
                    </div>
                )}
            </div>
            {/* Auth Modals */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        /> 
        </div>
           );
}