'use client';

import React, { useState, useEffect } from 'react';
import CreateEventForm from './CreateEventForm';

export default function CreateEventButton({ onEventCreated, onClose, showFormDirectly = false }) {
  const [showForm, setShowForm] = useState(showFormDirectly);

  useEffect(() => {
    setShowForm(showFormDirectly);
  }, [showFormDirectly]);

  const handleClick = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    if (onClose) onClose();
  };

  if (showFormDirectly) {
    return (
      <CreateEventForm
        onClose={handleClose}
        onEventCreated={onEventCreated}
      />
    );
  }

  return (
    <>
      <button
        className="bg-white text-black font-medium py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors"
        onClick={handleClick}
      >
        Create Event
      </button>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border border-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Event</h2>
              <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <CreateEventForm
              onClose={handleClose}
              onEventCreated={onEventCreated}
            />
          </div>
        </div>
      )}
    </>
  );
}