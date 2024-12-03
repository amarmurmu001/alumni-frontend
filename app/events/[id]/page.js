'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HiOutlineCalendar, 
  HiOutlineLocationMarker, 
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineArrowLeft
} from 'react-icons/hi';
import { api } from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function EventDetails({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
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
    if (!isLoggedIn) {
      toast.error('Please log in to register for the event.');
      return;
    }

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
        if (error.message.includes('already registered')) {
          toast.error('You are already registered for this event.');
        } else {
          toast.error(error.message || 'Failed to register for the event. Please try again.');
        }
      } finally {
        setIsRegistering(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white/70 animate-pulse">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/70">
          {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white/70">Event not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black py-8"
    >
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
          },
        }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="bg-white/5 hover:bg-white/10 text-white/70 p-2 rounded-lg
                transition-colors border border-white/10"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-white/60">
                <HiOutlineCalendar className="w-5 h-5 mr-3" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-white/60">
                <HiOutlineLocationMarker className="w-5 h-5 mr-3" />
                {event.location}
              </div>
              {event.organizer && (
                <div className="flex items-center text-white/60">
                  <HiOutlineUser className="w-5 h-5 mr-3" />
                  Organized by: {event.organizer.firstName} {event.organizer.lastName}
                </div>
              )}
              {!event.registrationLink && (
                <div className="flex items-center text-white/60">
                  <HiOutlineUserGroup className="w-5 h-5 mr-3" />
                  {event.attendees.length} attending
                  {event.maxAttendees ? ` (${event.maxAttendees} max)` : ''}
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <p className="text-white/70 leading-relaxed">{event.description}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            {event.registrationLink ? (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black font-semibold py-2 px-6 rounded-lg
                  transition-colors hover:bg-white/90 text-center"
              >
                Registration Link
              </motion.a>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRegister}
                disabled={isRegistering}
                className={`bg-white text-black font-semibold py-2 px-6 rounded-lg
                  transition-colors hover:bg-white/90 disabled:opacity-50 
                  disabled:cursor-not-allowed text-center`}
              >
                {isRegistering ? 'Registering...' : 'Register for Event'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}