'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUserGroup } from 'react-icons/hi';
import CreateEventButton from './CreateEventButton';
import EventList from './EventList';
import { useRouter } from 'next/navigation';

export default function Events() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleEventCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setShowCreateForm(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-8"
      >
        <div className="container mx-auto px-4">
          <motion.section 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-white">Upcoming Events</h1>
            <p className="text-gray-400 text-lg mb-8">
              Discover and participate in alumni events, reunions, and networking opportunities
            </p>
            {isLoggedIn && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-white text-black font-medium py-3 px-8 rounded-lg
                    hover:bg-gray-200 transition-colors"
                >
                  Create Event
                </button>
              </motion.div>
            )}
          </motion.section>

          <EventList key={refreshKey} />
        </div>
      </motion.div>

      {/* Create Event Form Modal */}
      {showCreateForm && (
        <CreateEventButton 
          onEventCreated={handleEventCreated}
          onClose={() => setShowCreateForm(false)}
          showFormDirectly={true}
        />
      )}
    </>
  );
}