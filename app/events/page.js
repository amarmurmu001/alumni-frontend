'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CreateEventButton from './CreateEventButton';
import EventList from './EventList';

export default function Events() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
        className="min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-5">
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-4xl font-bold text-white"
            >
              Upcoming Events
            </motion.h1>
            {isLoggedIn && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Create Event
              </motion.button>
            )}
          </div>

          <EventList key={refreshKey} />
        </div>
      </motion.div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black rounded-lg border border-gray-800 shadow-xl max-w-2xl w-full mx-4"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <CreateEventButton 
                onEventCreated={handleEventCreated}
                onClose={() => setShowCreateForm(false)}
                showFormDirectly={true}
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
