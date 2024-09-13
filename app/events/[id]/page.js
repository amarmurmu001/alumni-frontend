'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function EventDetails({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEventDetails(params.id);
  }, [params.id]);

  const fetchEventDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.events.getEventDetails(id);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to fetch event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (event.registrationLink) {
      window.open(event.registrationLink, '_blank');
    } else {
      try {
        setIsRegistering(true);
        await api.events.registerForEvent(event._id);
        toast.success('Successfully registered for the event!');
        await fetchEventDetails(event._id);
      } catch (error) {
        console.error('Error registering for event:', error);
        toast.error(error.message || 'Failed to register for the event. Please try again.');
      } finally {
        setIsRegistering(false);
      }
    }
  };

  if (loading) return <div className="text-white text-center mt-8">Loading event details...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!event) return <div className="text-white text-center mt-8">Event not found</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-black rounded-lg shadow-md border border-gray-800">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-4 text-white">{event.title}</h1>
      <p className="text-gray-400 mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
      <p className="text-gray-400 mb-4">Location: {event.location}</p>
      <p className="text-gray-300 mb-6">{event.description}</p>
      {event.organizer && (
        <p className="text-gray-400">Organized by: {event.organizer.firstName} {event.organizer.lastName}</p>
      )}
      {!event.registrationLink && (
        <p className="text-gray-400 mt-4">
          Attendees: {event.attendees.length}
          {event.maxAttendees ? `/${event.maxAttendees}` : ''}
        </p>
      )}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
        >
          Back to Events
        </button>
        {event.registrationLink ? (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Registration Link
          </a>
        ) : (
          <button
            onClick={handleRegister}
            disabled={isRegistering}
            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRegistering ? 'Registering...' : 'Register for Event'}
          </button>
        )}
      </div>
    </div>
  );
}