'use client';

import React, { useState } from 'react';
import CreateEventForm from './CreateEventForm';

export default function CreateEventButton({ onEventCreated }) {
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    setShowForm(true);
  };

  return (
    <>
      <button
        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 transition-colors"
        onClick={handleClick}
      >
        Create Event
      </button>
      {showForm && (
        <CreateEventForm
          onClose={() => setShowForm(false)}
          onEventCreated={onEventCreated}
        />
      )}
    </>
  );
}